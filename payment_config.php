
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
    
    // Criar tabela de configurações de pagamento se não existir
    createPaymentConfigTable($pdo);
    
    $method = $_SERVER['REQUEST_METHOD'];
    $action = $_GET['action'] ?? '';
    
    switch($method) {
        case 'GET':
            handleGetConfig($pdo, $action);
            break;
        case 'POST':
            handlePostConfig($pdo, $action);
            break;
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Método não permitido']);
    }
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

function createPaymentConfigTable($pdo) {
    $pdo->exec("CREATE TABLE IF NOT EXISTS payment_configs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        gateway TEXT NOT NULL,
        config_data TEXT NOT NULL,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");
}

function handleGetConfig($pdo, $action) {
    switch($action) {
        case 'all':
            $stmt = $pdo->query("SELECT * FROM payment_configs WHERE is_active = 1");
            $configs = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $result = [];
            foreach($configs as $config) {
                $result[$config['gateway']] = json_decode($config['config_data'], true);
            }
            echo json_encode($result);
            break;
            
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Ação não encontrada']);
    }
}

function handlePostConfig($pdo, $action) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    switch($action) {
        case 'save':
            $gateway = $data['gateway'];
            $config = json_encode($data['config']);
            
            // Verificar se já existe configuração para este gateway
            $stmt = $pdo->prepare("SELECT id FROM payment_configs WHERE gateway = ?");
            $stmt->execute([$gateway]);
            $existing = $stmt->fetch();
            
            if($existing) {
                $stmt = $pdo->prepare("UPDATE payment_configs SET config_data = ?, updated_at = CURRENT_TIMESTAMP WHERE gateway = ?");
                $stmt->execute([$config, $gateway]);
            } else {
                $stmt = $pdo->prepare("INSERT INTO payment_configs (gateway, config_data) VALUES (?, ?)");
                $stmt->execute([$gateway, $config]);
            }
            
            echo json_encode(['success' => true, 'message' => 'Configuração salva com sucesso']);
            break;
            
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Ação não encontrada']);
    }
}
?>
