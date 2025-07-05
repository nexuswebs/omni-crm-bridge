<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Configuração do banco de dados SQLite
$database = 'crm_database.sqlite';

try {
    $pdo = new PDO("sqlite:$database");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Criar tabelas se não existirem
    createTables($pdo);
    
    $method = $_SERVER['REQUEST_METHOD'];
    $path = $_GET['path'] ?? '';
    
    switch($method) {
        case 'GET':
            handleGet($pdo, $path);
            break;
        case 'POST':
            handlePost($pdo, $path);
            break;
        case 'PUT':
            handlePut($pdo, $path);
            break;
        case 'DELETE':
            handleDelete($pdo, $path);
            break;
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Método não permitido']);
    }
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

function createTables($pdo) {
    // Tabela de usuários
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");
    
    // Tabela de clientes
    $pdo->exec("CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        company TEXT,
        status TEXT DEFAULT 'active',
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )");
    
    // Tabela de workflows
    $pdo->exec("CREATE TABLE IF NOT EXISTS workflows (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'active',
        trigger_type TEXT,
        actions TEXT,
        conditions TEXT,
        executions INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )");
    
    // Tabela de pagamentos atualizada
    $pdo->exec("CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        customer_id INTEGER,
        amount DECIMAL(10,2) NOT NULL,
        status TEXT DEFAULT 'pending',
        method TEXT,
        description TEXT,
        pix_code TEXT,
        transaction_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (customer_id) REFERENCES customers (id)
    )");
    
    // Tabela de instâncias WhatsApp
    $pdo->exec("CREATE TABLE IF NOT EXISTS whatsapp_instances (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        phone TEXT,
        status TEXT DEFAULT 'disconnected',
        qr_code TEXT,
        webhook_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )");
    
    // Inserir usuário padrão se não existir
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE email = ?");
    $stmt->execute(['admin@teste.com']);
    if($stmt->fetchColumn() == 0) {
        $stmt = $pdo->prepare("INSERT INTO users (email, password, name) VALUES (?, ?, ?)");
        $stmt->execute(['admin@teste.com', password_hash('123456', PASSWORD_DEFAULT), 'Admin User']);
    }
}

function handleGet($pdo, $path) {
    switch($path) {
        case 'customers':
            $stmt = $pdo->query("SELECT * FROM customers ORDER BY created_at DESC");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            break;
            
        case 'workflows':
            $stmt = $pdo->query("SELECT * FROM workflows ORDER BY created_at DESC");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            break;
            
        case 'payments':
            $stmt = $pdo->query("
                SELECT p.*, c.name as customer_name 
                FROM payments p 
                LEFT JOIN customers c ON p.customer_id = c.id 
                ORDER BY p.created_at DESC
            ");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            break;
            
        case 'whatsapp':
            $stmt = $pdo->query("SELECT * FROM whatsapp_instances ORDER BY created_at DESC");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            break;
            
        case 'stats':
            $customers = $pdo->query("SELECT COUNT(*) FROM customers")->fetchColumn();
            $activeWorkflows = $pdo->query("SELECT COUNT(*) FROM workflows WHERE status = 'active'")->fetchColumn();
            $totalRevenue = $pdo->query("SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'paid'")->fetchColumn();
            
            echo json_encode([
                'customers' => $customers,
                'activeWorkflows' => $activeWorkflows,
                'totalRevenue' => $totalRevenue,
                'whatsappMessages' => rand(50, 150)
            ]);
            break;
            
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Endpoint não encontrado']);
    }
}

function handlePost($pdo, $path) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    switch($path) {
        case 'login':
            $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
            $stmt->execute([$data['email']]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if($user && password_verify($data['password'], $user['password'])) {
                unset($user['password']);
                echo json_encode(['success' => true, 'user' => $user]);
            } else {
                http_response_code(401);
                echo json_encode(['error' => 'Credenciais inválidas']);
            }
            break;
            
        case 'customers':
            $stmt = $pdo->prepare("INSERT INTO customers (user_id, name, email, phone, company, notes) VALUES (1, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['name'],
                $data['email'] ?? null,
                $data['phone'] ?? null,
                $data['company'] ?? null,
                $data['notes'] ?? null
            ]);
            
            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
            break;
            
        case 'workflows':
            $stmt = $pdo->prepare("INSERT INTO workflows (user_id, name, description, trigger_type, actions, conditions) VALUES (1, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['name'],
                $data['description'] ?? null,
                $data['trigger_type'] ?? 'manual',
                json_encode($data['actions'] ?? []),
                json_encode($data['conditions'] ?? [])
            ]);
            
            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
            break;
            
        case 'payments':
            $stmt = $pdo->prepare("INSERT INTO payments (user_id, customer_id, amount, method, description) VALUES (1, ?, ?, ?, ?)");
            $stmt->execute([
                $data['customer_id'] ?? null,
                $data['amount'],
                $data['method'] ?? null,
                $data['description'] ?? null
            ]);
            
            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
            break;
            
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Endpoint não encontrado']);
    }
}

function handlePut($pdo, $path) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if(preg_match('/^customers\/(\d+)$/', $path, $matches)) {
        $id = $matches[1];
        $stmt = $pdo->prepare("UPDATE customers SET name = ?, email = ?, phone = ?, company = ?, status = ?, notes = ? WHERE id = ?");
        $stmt->execute([
            $data['name'],
            $data['email'] ?? null,
            $data['phone'] ?? null,
            $data['company'] ?? null,
            $data['status'] ?? 'active',
            $data['notes'] ?? null,
            $id
        ]);
        
        echo json_encode(['success' => true]);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint não encontrado']);
    }
}

function handleDelete($pdo, $path) {
    if(preg_match('/^customers\/(\d+)$/', $path, $matches)) {
        $id = $matches[1];
        $stmt = $pdo->prepare("DELETE FROM customers WHERE id = ?");
        $stmt->execute([$id]);
        
        echo json_encode(['success' => true]);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint não encontrado']);
    }
}
?>
