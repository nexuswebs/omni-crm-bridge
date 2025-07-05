
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
            testEvolutionConnection($pdo);
            break;
        case 'create_instance':
            createEvolutionInstance($pdo);
            break;
        case 'get_instances':
            getEvolutionInstances($pdo);
            break;
        case 'connect_instance':
            connectEvolutionInstance($pdo);
            break;
        case 'get_qrcode':
            getEvolutionQRCode($pdo);
            break;
        case 'send_message':
            sendEvolutionMessage($pdo);
            break;
        case 'logout_instance':
            logoutEvolutionInstance($pdo);
            break;
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Ação não encontrada']);
    }
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

function getEvolutionConfig($pdo) {
    $stmt = $pdo->prepare("SELECT config_data FROM api_configs WHERE api_name = 'evolution' AND is_active = 1");
    $stmt->execute();
    $result = $stmt->fetch();
    
    if (!$result) {
        throw new Exception('Configuração Evolution API não encontrada. Configure primeiro nas configurações.');
    }
    
    return json_decode($result['config_data'], true);
}

function testEvolutionConnection($pdo) {
    $config = getEvolutionConfig($pdo);
    
    if (!isset($config['url']) || !isset($config['key'])) {
        throw new Exception('URL e chave da API são obrigatórias');
    }
    
    $url = rtrim($config['url'], '/') . '/instance/fetchInstances';
    
    $options = [
        'http' => [
            'method' => 'GET',
            'header' => [
                'apikey: ' . $config['key'],
                'Content-Type: application/json'
            ]
        ]
    ];
    
    $context = stream_context_create($options);
    $response = file_get_contents($url, false, $context);
    
    if ($response === false) {
        throw new Exception('Erro ao conectar com Evolution API. Verifique URL e chave.');
    }
    
    $data = json_decode($response, true);
    echo json_encode([
        'success' => true, 
        'message' => 'Conexão estabelecida com sucesso!',
        'instances_count' => count($data)
    ]);
}

function createEvolutionInstance($pdo) {
    $config = getEvolutionConfig($pdo);
    $data = json_decode(file_get_contents('php://input'), true);
    
    $instanceName = $data['instanceName'] ?? 'crm-instance-' . time();
    $webhook = $data['webhook'] ?? '';
    
    $url = rtrim($config['url'], '/') . '/instance/create';
    
    $payload = [
        'instanceName' => $instanceName,
        'qrcode' => true
    ];
    
    if (!empty($webhook)) {
        $payload['webhook'] = $webhook;
    }
    
    $options = [
        'http' => [
            'method' => 'POST',
            'header' => [
                'apikey: ' . $config['key'],
                'Content-Type: application/json'
            ],
            'content' => json_encode($payload)
        ]
    ];
    
    $context = stream_context_create($options);
    $response = file_get_contents($url, false, $context);
    
    if ($response === false) {
        throw new Exception('Erro ao criar instância Evolution API');
    }
    
    $result = json_decode($response, true);
    
    // Salvar instância no banco
    $stmt = $pdo->prepare("
        INSERT OR REPLACE INTO evolution_instances (instance_name, status, config_data, created_at) 
        VALUES (?, 'created', ?, datetime('now'))
    ");
    $stmt->execute([$instanceName, json_encode($result)]);
    
    echo json_encode([
        'success' => true,
        'instance' => $result,
        'message' => 'Instância criada com sucesso!'
    ]);
}

function getEvolutionInstances($pdo) {
    $config = getEvolutionConfig($pdo);
    
    $url = rtrim($config['url'], '/') . '/instance/fetchInstances';
    
    $options = [
        'http' => [
            'method' => 'GET',
            'header' => [
                'apikey: ' . $config['key'],
                'Content-Type: application/json'
            ]
        ]
    ];
    
    $context = stream_context_create($options);
    $response = file_get_contents($url, false, $context);
    
    if ($response === false) {
        throw new Exception('Erro ao buscar instâncias');
    }
    
    $instances = json_decode($response, true);
    echo json_encode(['success' => true, 'instances' => $instances]);
}

function connectEvolutionInstance($pdo) {
    $config = getEvolutionConfig($pdo);
    $data = json_decode(file_get_contents('php://input'), true);
    
    $instanceName = $data['instanceName'] ?? '';
    if (empty($instanceName)) {
        throw new Exception('Nome da instância é obrigatório');
    }
    
    $url = rtrim($config['url'], '/') . '/instance/connect/' . $instanceName;
    
    $options = [
        'http' => [
            'method' => 'GET',
            'header' => [
                'apikey: ' . $config['key'],
                'Content-Type: application/json'
            ]
        ]
    ];
    
    $context = stream_context_create($options);
    $response = file_get_contents($url, false, $context);
    
    if ($response === false) {
        throw new Exception('Erro ao conectar instância');
    }
    
    $result = json_decode($response, true);
    echo json_encode(['success' => true, 'connection' => $result]);
}

function getEvolutionQRCode($pdo) {
    $config = getEvolutionConfig($pdo);
    $instanceName = $_GET['instance'] ?? '';
    
    if (empty($instanceName)) {
        throw new Exception('Nome da instância é obrigatório');
    }
    
    $url = rtrim($config['url'], '/') . '/instance/qrcode/' . $instanceName;
    
    $options = [
        'http' => [
            'method' => 'GET',
            'header' => [
                'apikey: ' . $config['key'],
                'Content-Type: application/json'
            ]
        ]
    ];
    
    $context = stream_context_create($options);
    $response = file_get_contents($url, false, $context);
    
    if ($response === false) {
        throw new Exception('Erro ao buscar QR Code');
    }
    
    $qrcode = json_decode($response, true);
    echo json_encode(['success' => true, 'qrcode' => $qrcode]);
}

function sendEvolutionMessage($pdo) {
    $config = getEvolutionConfig($pdo);
    $data = json_decode(file_get_contents('php://input'), true);
    
    $instanceName = $data['instanceName'] ?? '';
    $number = $data['number'] ?? '';
    $message = $data['message'] ?? '';
    
    if (empty($instanceName) || empty($number) || empty($message)) {
        throw new Exception('Instância, número e mensagem são obrigatórios');
    }
    
    $url = rtrim($config['url'], '/') . '/message/sendText/' . $instanceName;
    
    $payload = [
        'number' => $number,
        'options' => [
            'delay' => 1200,
            'presence' => 'composing'
        ],
        'textMessage' => [
            'text' => $message
        ]
    ];
    
    $options = [
        'http' => [
            'method' => 'POST',
            'header' => [
                'apikey: ' . $config['key'],
                'Content-Type: application/json'
            ],
            'content' => json_encode($payload)
        ]
    ];
    
    $context = stream_context_create($options);
    $response = file_get_contents($url, false, $context);
    
    if ($response === false) {
        throw new Exception('Erro ao enviar mensagem');
    }
    
    $result = json_decode($response, true);
    echo json_encode(['success' => true, 'message_result' => $result]);
}

function logoutEvolutionInstance($pdo) {
    $config = getEvolutionConfig($pdo);
    $data = json_decode(file_get_contents('php://input'), true);
    
    $instanceName = $data['instanceName'] ?? '';
    if (empty($instanceName)) {
        throw new Exception('Nome da instância é obrigatório');
    }
    
    $url = rtrim($config['url'], '/') . '/instance/logout/' . $instanceName;
    
    $options = [
        'http' => [
            'method' => 'DELETE',
            'header' => [
                'apikey: ' . $config['key'],
                'Content-Type: application/json'
            ]
        ]
    ];
    
    $context = stream_context_create($options);
    $response = file_get_contents($url, false, $context);
    
    if ($response === false) {
        throw new Exception('Erro ao desconectar instância');
    }
    
    echo json_encode(['success' => true, 'message' => 'Instância desconectada com sucesso']);
}

// Criar tabela para instâncias Evolution se não existir
try {
    $pdo = new PDO("sqlite:$database");
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS evolution_instances (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            instance_name TEXT UNIQUE NOT NULL,
            status TEXT DEFAULT 'disconnected',
            config_data TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ");
} catch(Exception $e) {
    error_log("Erro ao criar tabela evolution_instances: " . $e->getMessage());
}
?>
