
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
    
    // Criar tabela para logs de webhook se não existir
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS webhook_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source TEXT NOT NULL,
            event_type TEXT,
            payload TEXT,
            processed BOOLEAN DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ");
    
    $source = $_GET['source'] ?? 'generic';
    
    switch($source) {
        case 'evolution':
            handleEvolutionWebhook($pdo);
            break;
        case 'n8n':
            handleN8nWebhook($pdo);
            break;
        case 'payment':
            handlePaymentWebhook($pdo);
            break;
        default:
            handleGenericWebhook($pdo);
    }
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

function handleEvolutionWebhook($pdo) {
    $payload = file_get_contents('php://input');
    $data = json_decode($payload, true);
    
    if (!$data) {
        throw new Exception('Payload inválido');
    }
    
    // Log do webhook
    logWebhookEvent($pdo, 'evolution', $data['event'] ?? 'unknown', $payload);
    
    // Processar diferentes tipos de eventos Evolution
    $event = $data['event'] ?? '';
    
    switch($event) {
        case 'messages.upsert':
            processEvolutionMessage($pdo, $data);
            break;
        case 'connection.update':
            processEvolutionConnection($pdo, $data);
            break;
        case 'qrcode.updated':
            processEvolutionQRCode($pdo, $data);
            break;
        default:
            // Log evento desconhecido
            error_log("Evento Evolution desconhecido: " . $event);
    }
    
    echo json_encode(['success' => true, 'message' => 'Webhook Evolution processado']);
}

function processEvolutionMessage($pdo, $data) {
    // Extrair dados da mensagem
    $instanceName = $data['instance'] ?? '';
    $messages = $data['data'] ?? [];
    
    foreach ($messages as $message) {
        $messageData = [
            'instance_name' => $instanceName,
            'message_id' => $message['key']['id'] ?? '',
            'from_number' => $message['key']['remoteJid'] ?? '',
            'message_type' => 'received',
            'content' => $message['message']['conversation'] ?? $message['message']['extendedTextMessage']['text'] ?? '',
            'timestamp' => $message['messageTimestamp'] ?? time(),
            'status' => 'received'
        ];
        
        // Salvar mensagem no banco
        $stmt = $pdo->prepare("
            INSERT INTO messages (instance_name, message_id, from_number, message_type, content, timestamp, status, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
        ");
        $stmt->execute([
            $messageData['instance_name'],
            $messageData['message_id'],
            $messageData['from_number'],
            $messageData['message_type'],
            $messageData['content'],
            $messageData['timestamp'],
            $messageData['status']
        ]);
        
        // Verificar se existe cliente com este número
        $stmt = $pdo->prepare("SELECT id FROM customers WHERE phone = ?");
        $stmt->execute([$messageData['from_number']]);
        $customer = $stmt->fetch();
        
        if (!$customer) {
            // Criar cliente automaticamente
            $stmt = $pdo->prepare("
                INSERT INTO customers (name, phone, status, source, created_at) 
                VALUES (?, ?, 'active', 'whatsapp', datetime('now'))
            ");
            $stmt->execute([
                'Cliente WhatsApp ' . substr($messageData['from_number'], -4),
                $messageData['from_number']
            ]);
        }
    }
}

function processEvolutionConnection($pdo, $data) {
    $instanceName = $data['instance'] ?? '';
    $state = $data['data']['state'] ?? '';
    
    // Atualizar status da instância
    $stmt = $pdo->prepare("
        UPDATE evolution_instances 
        SET status = ?, updated_at = datetime('now') 
        WHERE instance_name = ?
    ");
    $stmt->execute([$state, $instanceName]);
}

function processEvolutionQRCode($pdo, $data) {
    $instanceName = $data['instance'] ?? '';
    $qrcode = $data['data'] ?? [];
    
    // Salvar QR Code atualizado
    $stmt = $pdo->prepare("
        UPDATE evolution_instances 
        SET config_data = ?, updated_at = datetime('now') 
        WHERE instance_name = ?
    ");
    $stmt->execute([json_encode($qrcode), $instanceName]);
}

function handleN8nWebhook($pdo) {
    $payload = file_get_contents('php://input');
    $data = json_decode($payload, true);
    
    if (!$data) {
        throw new Exception('Payload inválido');
    }
    
    // Log do webhook
    logWebhookEvent($pdo, 'n8n', $data['workflowName'] ?? 'unknown', $payload);
    
    // Processar dados do n8n
    // Aqui você pode implementar lógicas específicas baseadas nos dados recebidos
    
    echo json_encode(['success' => true, 'message' => 'Webhook n8n processado']);
}

function handlePaymentWebhook($pdo) {
    $payload = file_get_contents('php://input');
    $data = json_decode($payload, true);
    
    if (!$data) {
        throw new Exception('Payload inválido');
    }
    
    // Log do webhook
    logWebhookEvent($pdo, 'payment', $data['type'] ?? 'unknown', $payload);
    
    // Processar notificação de pagamento
    $paymentType = $data['type'] ?? '';
    
    switch($paymentType) {
        case 'stripe':
            processStripeWebhook($pdo, $data);
            break;
        case 'mercadopago':
            processMercadoPagoWebhook($pdo, $data);
            break;
        case 'pix':
            processPixWebhook($pdo, $data);
            break;
    }
    
    echo json_encode(['success' => true, 'message' => 'Webhook pagamento processado']);
}

function processStripeWebhook($pdo, $data) {
    // Processar webhooks do Stripe
    $eventType = $data['type'] ?? '';
    
    if ($eventType === 'payment_intent.succeeded') {
        $paymentIntent = $data['data']['object'] ?? [];
        $transactionId = $paymentIntent['id'] ?? '';
        
        // Atualizar status do pagamento
        $stmt = $pdo->prepare("UPDATE payments SET status = 'paid', updated_at = datetime('now') WHERE transaction_id = ?");
        $stmt->execute([$transactionId]);
    }
}

function processMercadoPagoWebhook($pdo, $data) {
    // Processar webhooks do Mercado Pago
    $action = $data['action'] ?? '';
    
    if ($action === 'payment.updated') {
        $paymentId = $data['data']['id'] ?? '';
        // Buscar detalhes do pagamento na API do Mercado Pago
        // Atualizar status no banco
    }
}

function processPixWebhook($pdo, $data) {
    // Processar confirmação de PIX
    $transactionId = $data['transaction_id'] ?? '';
    $status = $data['status'] ?? '';
    
    if ($status === 'paid') {
        $stmt = $pdo->prepare("UPDATE payments SET status = 'paid', updated_at = datetime('now') WHERE transaction_id = ?");
        $stmt->execute([$transactionId]);
    }
}

function handleGenericWebhook($pdo) {
    $payload = file_get_contents('php://input');
    $data = json_decode($payload, true);
    
    // Log do webhook genérico
    logWebhookEvent($pdo, 'generic', 'webhook', $payload);
    
    echo json_encode(['success' => true, 'message' => 'Webhook genérico processado']);
}

function logWebhookEvent($pdo, $source, $eventType, $payload) {
    try {
        $stmt = $pdo->prepare("
            INSERT INTO webhook_logs (source, event_type, payload, created_at) 
            VALUES (?, ?, ?, datetime('now'))
        ");
        $stmt->execute([$source, $eventType, $payload]);
    } catch (Exception $e) {
        error_log("Erro ao salvar log do webhook: " . $e->getMessage());
    }
}
?>
