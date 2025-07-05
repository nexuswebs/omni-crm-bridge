
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
    
    switch($method) {
        case 'POST':
            handlePaymentAction($pdo, $action);
            break;
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Método não permitido']);
    }
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

function handlePaymentAction($pdo, $action) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    switch($action) {
        case 'create_pix':
            createPixPayment($pdo, $data);
            break;
        case 'create_stripe':
            createStripePayment($pdo, $data);
            break;
        case 'create_mercadopago':
            createMercadoPagoPayment($pdo, $data);
            break;
        case 'verify_payment':
            verifyPayment($pdo, $data);
            break;
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Ação não encontrada']);
    }
}

function getPaymentConfig($pdo, $gateway) {
    $stmt = $pdo->prepare("SELECT config_data FROM payment_configs WHERE gateway = ? AND is_active = 1");
    $stmt->execute([$gateway]);
    $result = $stmt->fetch();
    
    return $result ? json_decode($result['config_data'], true) : null;
}

function createPixPayment($pdo, $data) {
    $config = getPaymentConfig($pdo, 'pix');
    if (!$config) {
        throw new Exception('Configuração PIX não encontrada');
    }
    
    $amount = $data['amount'];
    $description = $data['description'] ?? 'Pagamento CRM';
    $customer_id = $data['customer_id'] ?? null;
    
    // Gerar dados PIX
    $pixKey = $config['pix_key'];
    $pixKeyType = $config['pix_key_type'];
    $merchantName = $config['merchant_name'];
    $merchantCity = $config['merchant_city'];
    $transactionId = 'TXN' . time() . rand(1000, 9999);
    
    // Gerar PIX Code (EMV)
    $pixCode = generatePixCode($pixKey, $merchantName, $merchantCity, $amount, $description, $transactionId);
    
    // Salvar pagamento no banco
    $stmt = $pdo->prepare("INSERT INTO payments (user_id, customer_id, amount, status, method, description, pix_code, transaction_id) VALUES (1, ?, ?, 'pending', 'PIX', ?, ?, ?)");
    $stmt->execute([$customer_id, $amount, $description, $pixCode, $transactionId]);
    
    $paymentId = $pdo->lastInsertId();
    
    echo json_encode([
        'success' => true,
        'payment_id' => $paymentId,
        'pix_code' => $pixCode,
        'qr_code_url' => 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' . urlencode($pixCode),
        'amount' => $amount,
        'transaction_id' => $transactionId
    ]);
}

function generatePixCode($pixKey, $merchantName, $merchantCity, $amount, $description, $transactionId) {
    // Implementação simplificada do EMV Code para PIX
    $payload = '';
    
    // Payload Format Indicator
    $payload .= formatTLV('00', '01');
    
    // Point of Initiation Method
    $payload .= formatTLV('01', '12');
    
    // Merchant Account Information
    $gui = '0014br.gov.bcb.pix01' . sprintf('%02d', strlen($pixKey)) . $pixKey;
    $payload .= formatTLV('26', $gui);
    
    // Merchant Category Code
    $payload .= formatTLV('52', '0000');
    
    // Transaction Currency
    $payload .= formatTLV('53', '986'); // BRL
    
    // Transaction Amount
    $payload .= formatTLV('54', number_format($amount, 2, '.', ''));
    
    // Country Code
    $payload .= formatTLV('58', 'BR');
    
    // Merchant Name
    $payload .= formatTLV('59', $merchantName);
    
    // Merchant City
    $payload .= formatTLV('60', $merchantCity);
    
    // Additional Data Field Template
    $additionalData = formatTLV('05', $transactionId);
    $payload .= formatTLV('62', $additionalData);
    
    // CRC16
    $payload .= '6304';
    $crc = calculateCRC16($payload);
    $payload .= strtoupper(dechex($crc));
    
    return $payload;
}

function formatTLV($tag, $value) {
    return $tag . sprintf('%02d', strlen($value)) . $value;
}

function calculateCRC16($data) {
    $crc = 0xFFFF;
    for ($i = 0; $i < strlen($data); $i++) {
        $crc ^= ord($data[$i]) << 8;
        for ($j = 0; $j < 8; $j++) {
            if ($crc & 0x8000) {
                $crc = ($crc << 1) ^ 0x1021;
            } else {
                $crc = $crc << 1;
            }
        }
    }
    return $crc & 0xFFFF;
}

function createStripePayment($pdo, $data) {
    $config = getPaymentConfig($pdo, 'stripe');
    if (!$config) {
        throw new Exception('Configuração Stripe não encontrada');
    }
    
    // Aqui você implementaria a integração real com Stripe
    // Por enquanto, simulação
    echo json_encode([
        'success' => true,
        'message' => 'Integração Stripe em desenvolvimento',
        'checkout_url' => 'https://checkout.stripe.com/example'
    ]);
}

function createMercadoPagoPayment($pdo, $data) {
    $config = getPaymentConfig($pdo, 'mercadopago');
    if (!$config) {
        throw new Exception('Configuração Mercado Pago não encontrada');
    }
    
    // Aqui você implementaria a integração real com Mercado Pago
    // Por enquanto, simulação
    echo json_encode([
        'success' => true,
        'message' => 'Integração Mercado Pago em desenvolvimento',
        'checkout_url' => 'https://mercadopago.com/example'
    ]);
}

function verifyPayment($pdo, $data) {
    $transactionId = $data['transaction_id'];
    
    // Simular verificação (em produção, você consultaria a API do gateway)
    $stmt = $pdo->prepare("SELECT * FROM payments WHERE transaction_id = ?");
    $stmt->execute([$transactionId]);
    $payment = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($payment) {
        // Simulação: 30% de chance de estar pago
        $isPaid = rand(1, 10) <= 3;
        
        if ($isPaid && $payment['status'] === 'pending') {
            $stmt = $pdo->prepare("UPDATE payments SET status = 'paid', updated_at = CURRENT_TIMESTAMP WHERE id = ?");
            $stmt->execute([$payment['id']]);
            
            echo json_encode(['success' => true, 'status' => 'paid', 'message' => 'Pagamento confirmado!']);
        } else {
            echo json_encode(['success' => true, 'status' => $payment['status']]);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'Pagamento não encontrado']);
    }
}
?>
