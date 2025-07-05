
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
    
    // Criar tabela para configurações de API se não existir
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS api_configs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            api_name TEXT UNIQUE NOT NULL,
            config_data TEXT NOT NULL,
            is_active BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ");
    
    $method = $_SERVER['REQUEST_METHOD'];
    $action = $_GET['action'] ?? '';
    
    switch($method) {
        case 'GET':
            handleGetConfig($pdo, $action);
            break;
        case 'POST':
            handleSaveConfig($pdo, $action);
            break;
        case 'PUT':
            handleUpdateConfig($pdo, $action);
            break;
        case 'DELETE':
            handleDeleteConfig($pdo, $action);
            break;
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Método não permitido']);
    }
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

function handleGetConfig($pdo, $action) {
    if ($action === 'all') {
        $stmt = $pdo->query("SELECT * FROM api_configs WHERE is_active = 1");
        $configs = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $configs[$row['api_name']] = json_decode($row['config_data'], true);
        }
        echo json_encode($configs);
    } else {
        $stmt = $pdo->prepare("SELECT config_data FROM api_configs WHERE api_name = ? AND is_active = 1");
        $stmt->execute([$action]);
        $result = $stmt->fetch();
        
        if ($result) {
            echo json_encode(json_decode($result['config_data'], true));
        } else {
            echo json_encode(['error' => 'Configuração não encontrada']);
        }
    }
}

function handleSaveConfig($pdo, $action) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    try {
        $stmt = $pdo->prepare("
            INSERT OR REPLACE INTO api_configs (api_name, config_data, updated_at) 
            VALUES (?, ?, datetime('now'))
        ");
        $stmt->execute([$action, json_encode($data)]);
        
        echo json_encode(['success' => true, 'message' => 'Configuração salva com sucesso']);
    } catch (Exception $e) {
        throw new Exception('Erro ao salvar configuração: ' . $e->getMessage());
    }
}

function handleUpdateConfig($pdo, $action) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    try {
        $stmt = $pdo->prepare("
            UPDATE api_configs 
            SET config_data = ?, updated_at = datetime('now') 
            WHERE api_name = ?
        ");
        $stmt->execute([json_encode($data), $action]);
        
        echo json_encode(['success' => true, 'message' => 'Configuração atualizada com sucesso']);
    } catch (Exception $e) {
        throw new Exception('Erro ao atualizar configuração: ' . $e->getMessage());
    }
}

function handleDeleteConfig($pdo, $action) {
    try {
        $stmt = $pdo->prepare("UPDATE api_configs SET is_active = 0 WHERE api_name = ?");
        $stmt->execute([$action]);
        
        echo json_encode(['success' => true, 'message' => 'Configuração removida com sucesso']);
    } catch (Exception $e) {
        throw new Exception('Erro ao remover configuração: ' . $e->getMessage());
    }
}
?>
