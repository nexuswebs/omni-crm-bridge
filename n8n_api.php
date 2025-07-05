
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
    
    $method = $_SERVER['REQUEST_METHOD'];
    $action = $_GET['action'] ?? '';
    
    switch($action) {
        case 'test_connection':
            testN8nConnection($pdo);
            break;
        case 'get_workflows':
            getN8nWorkflows($pdo);
            break;
        case 'execute_workflow':
            executeN8nWorkflow($pdo);
            break;
        case 'get_executions':
            getN8nExecutions($pdo);
            break;
        case 'sync_workflows':
            syncN8nWorkflows($pdo);
            break;
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Ação não encontrada']);
    }
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

function getN8nConfig($pdo) {
    $stmt = $pdo->prepare("SELECT config_data FROM api_configs WHERE api_name = 'n8n' AND is_active = 1");
    $stmt->execute();
    $result = $stmt->fetch();
    
    if (!$result) {
        throw new Exception('Configuração n8n não encontrada. Configure primeiro nas configurações.');
    }
    
    return json_decode($result['config_data'], true);
}

function testN8nConnection($pdo) {
    $config = getN8nConfig($pdo);
    
    if (!isset($config['n8nUrl']) || !isset($config['apiKey'])) {
        throw new Exception('URL do n8n e API Key são obrigatórias');
    }
    
    $url = rtrim($config['n8nUrl'], '/') . '/api/v1/workflows';
    
    $options = [
        'http' => [
            'method' => 'GET',
            'header' => [
                'X-N8N-API-KEY: ' . $config['apiKey'],
                'Content-Type: application/json'
            ]
        ]
    ];
    
    $context = stream_context_create($options);
    $response = file_get_contents($url, false, $context);
    
    if ($response === false) {
        throw new Exception('Erro ao conectar com n8n. Verifique URL e API Key.');
    }
    
    $data = json_decode($response, true);
    echo json_encode([
        'success' => true, 
        'message' => 'Conexão n8n estabelecida com sucesso!',
        'workflows_count' => isset($data['data']) ? count($data['data']) : 0
    ]);
}

function getN8nWorkflows($pdo) {
    $config = getN8nConfig($pdo);
    
    $url = rtrim($config['n8nUrl'], '/') . '/api/v1/workflows';
    
    $options = [
        'http' => [
            'method' => 'GET',
            'header' => [
                'X-N8N-API-KEY: ' . $config['apiKey'],
                'Content-Type: application/json'
            ]
        ]
    ];
    
    $context = stream_context_create($options);
    $response = file_get_contents($url, false, $context);
    
    if ($response === false) {
        throw new Exception('Erro ao buscar workflows do n8n');
    }
    
    $workflows = json_decode($response, true);
    echo json_encode(['success' => true, 'workflows' => $workflows]);
}

function executeN8nWorkflow($pdo) {
    $config = getN8nConfig($pdo);
    $data = json_decode(file_get_contents('php://input'), true);
    
    $workflowId = $data['workflowId'] ?? '';
    $inputData = $data['inputData'] ?? [];
    
    if (empty($workflowId)) {
        throw new Exception('ID do workflow é obrigatório');
    }
    
    $url = rtrim($config['n8nUrl'], '/') . '/api/v1/workflows/' . $workflowId . '/execute';
    
    $payload = [
        'inputData' => $inputData
    ];
    
    $options = [
        'http' => [
            'method' => 'POST',
            'header' => [
                'X-N8N-API-KEY: ' . $config['apiKey'],
                'Content-Type: application/json'
            ],
            'content' => json_encode($payload)
        ]
    ];
    
    $context = stream_context_create($options);
    $response = file_get_contents($url, false, $context);
    
    if ($response === false) {
        throw new Exception('Erro ao executar workflow');
    }
    
    $result = json_decode($response, true);
    
    // Salvar execução no banco
    $stmt = $pdo->prepare("
        INSERT INTO n8n_executions (workflow_id, execution_data, status, created_at) 
        VALUES (?, ?, 'completed', datetime('now'))
    ");
    $stmt->execute([$workflowId, json_encode($result)]);
    
    echo json_encode(['success' => true, 'execution' => $result]);
}

function getN8nExecutions($pdo) {
    $config = getN8nConfig($pdo);
    
    $workflowId = $_GET['workflowId'] ?? '';
    
    if (empty($workflowId)) {
        throw new Exception('ID do workflow é obrigatório');
    }
    
    $url = rtrim($config['n8nUrl'], '/') . '/api/v1/executions?workflowId=' . $workflowId;
    
    $options = [
        'http' => [
            'method' => 'GET',
            'header' => [
                'X-N8N-API-KEY: ' . $config['apiKey'],
                'Content-Type: application/json'
            ]
        ]
    ];
    
    $context = stream_context_create($options);
    $response = file_get_contents($url, false, $context);
    
    if ($response === false) {
        throw new Exception('Erro ao buscar execuções');
    }
    
    $executions = json_decode($response, true);
    echo json_encode(['success' => true, 'executions' => $executions]);
}

function syncN8nWorkflows($pdo) {
    $config = getN8nConfig($pdo);
    
    $url = rtrim($config['n8nUrl'], '/') . '/api/v1/workflows';
    
    $options = [
        'http' => [
            'method' => 'GET',
            'header' => [
                'X-N8N-API-KEY: ' . $config['apiKey'],
                'Content-Type: application/json'
            ]
        ]
    ];
    
    $context = stream_context_create($options);
    $response = file_get_contents($url, false, $context);
    
    if ($response === false) {
        throw new Exception('Erro ao sincronizar workflows');
    }
    
    $workflows = json_decode($response, true);
    
    // Salvar workflows no banco local
    foreach ($workflows['data'] as $workflow) {
        $stmt = $pdo->prepare("
            INSERT OR REPLACE INTO n8n_workflows (workflow_id, name, active, workflow_data, updated_at) 
            VALUES (?, ?, ?, ?, datetime('now'))
        ");
        $stmt->execute([
            $workflow['id'], 
            $workflow['name'], 
            $workflow['active'] ? 1 : 0, 
            json_encode($workflow)
        ]);
    }
    
    echo json_encode([
        'success' => true, 
        'message' => 'Workflows sincronizados com sucesso!',
        'synced_count' => count($workflows['data'])
    ]);
}

// Criar tabelas para n8n se não existirem
try {
    $pdo = new PDO("sqlite:$database");
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS n8n_workflows (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            workflow_id TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            active BOOLEAN DEFAULT 1,
            workflow_data TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ");
    
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS n8n_executions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            workflow_id TEXT NOT NULL,
            execution_data TEXT,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ");
} catch(Exception $e) {
    error_log("Erro ao criar tabelas n8n: " . $e->getMessage());
}
?>
