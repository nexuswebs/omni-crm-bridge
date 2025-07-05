
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
    try {
        $stmt = $pdo->prepare("SELECT config_data FROM payment_configs WHERE gateway = ? AND is_active = 1");
        $stmt->execute([$gateway]);
        $result = $stmt->fetch();
        
        return $result ? json_decode($result['config_data'], true) : null;
    } catch (Exception $e) {
        error_log("Erro ao buscar configuração: " . $e->getMessage());
        return null;
    }
}

function createPixPayment($pdo, $data) {
    $config = getPaymentConfig($pdo, 'pix');
    if (!$config) {
        throw new Exception('Configuração PIX não encontrada. Configure suas credenciais PIX primeiro.');
    }
    
    // Validar campos obrigatórios da configuração
    if (!isset($config['pix_key']) || !isset($config['merchant_name']) || !isset($config['merchant_city'])) {
        throw new Exception('Configuração PIX incompleta. Verifique se todos os campos estão preenchidos.');
    }
    
    $amount = floatval($data['amount'] ?? 0);
    $description = $data['description'] ?? 'Pagamento CRM';
    $customer_id = $data['customer_id'] ?? null;
    
    if ($amount <= 0) {
        throw new Exception('Valor do pagamento deve ser maior que zero');
    }
    
    // Gerar dados PIX
    $pixKey = $config['pix_key'];
    $pixKeyType = $config['pix_key_type'] ?? 'email';
    $merchantName = substr($config['merchant_name'], 0, 25); // Limite EMV
    $merchantCity = substr($config['merchant_city'], 0, 15); // Limite EMV
    $transactionId = 'PIX' . time() . sprintf('%04d', rand(0, 9999));
    
    // Gerar PIX Code (EMV)
    $pixCode = generatePixCode($pixKey, $merchantName, $merchantCity, $amount, $description, $transactionId);
    
    // Salvar pagamento no banco
    try {
        $stmt = $pdo->prepare("INSERT INTO payments (user_id, customer_id, amount, status, method, description, pix_code, transaction_id, created_at) VALUES (1, ?, ?, 'pending', 'PIX', ?, ?, ?, datetime('now'))");
        $stmt->execute([$customer_id, $amount, $description, $pixCode, $transactionId]);
        
        $paymentId = $pdo->lastInsertId();
        
        echo json_encode([
            'success' => true,
            'payment_id' => $paymentId,
            'pix_code' => $pixCode,
            'qr_code_url' => 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' . urlencode($pixCode),
            'amount' => $amount,
            'transaction_id' => $transactionId,
            'merchant_name' => $merchantName,
            'description' => $description
        ]);
    } catch (Exception $e) {
        throw new Exception('Erro ao salvar pagamento no banco: ' . $e->getMessage());
    }
}

function generatePixCode($pixKey, $merchantName, $merchantCity, $amount, $description, $transactionId) {
    // Implementação completa do EMV Code para PIX
    $payload = '';
    
    // Payload Format Indicator (ID 00)
    $payload .= formatTLV('00', '01');
    
    // Point of Initiation Method (ID 01) - Static QR Code
    $payload .= formatTLV('01', '12');
    
    // Merchant Account Information (ID 26) - PIX
    $merchantAccountInfo = '';
    $merchantAccountInfo .= formatTLV('00', 'br.gov.bcb.pix'); // GUI
    $merchantAccountInfo .= formatTLV('01', $pixKey); // PIX Key
    
    if (!empty($description)) {
        $merchantAccountInfo .= formatTLV('02', substr($description, 0, 72)); // Description
    }
    
    $payload .= formatTLV('26', $merchantAccountInfo);
    
    // Merchant Category Code (ID 52)
    $payload .= formatTLV('52', '0000');
    
    // Transaction Currency (ID 53) - BRL
    $payload .= formatTLV('53', '986');
    
    // Transaction Amount (ID 54)
    $payload .= formatTLV('54', number_format($amount, 2, '.', ''));
    
    // Country Code (ID 58)
    $payload .= formatTLV('58', 'BR');
    
    // Merchant Name (ID 59)
    $payload .= formatTLV('59', $merchantName);
    
    // Merchant City (ID 60)
    $payload .= formatTLV('60', $merchantCity);
    
    // Additional Data Field Template (ID 62)
    $additionalData = '';
    $additionalData .= formatTLV('05', substr($transactionId, 0, 25)); // Reference Label
    $payload .= formatTLV('62', $additionalData);
    
    // CRC16 (ID 63)
    $payload .= '6304';
    $crc = calculateCRC16($payload);
    $payload .= strtoupper(sprintf('%04X', $crc));
    
    return $payload;
}

function formatTLV($tag, $value) {
    $length = strlen($value);
    return $tag . sprintf('%02d', $length) . $value;
}

function calculateCRC16($data) {
    $crc = 0xFFFF;
    $polynomial = 0x1021;
    
    for ($i = 0; $i < strlen($data); $i++) {
        $crc ^= (ord($data[$i]) << 8);
        
        for ($j = 0; $j < 8; $j++) {
            if ($crc & 0x8000) {
                $crc = (($crc << 1) ^ $polynomial) & 0xFFFF;
            } else {
                $crc = ($crc << 1) & 0xFFFF;
            }
        }
    }
    
    return $crc;
}

function createStripePayment($pdo, $data) {
    $config = getPaymentConfig($pdo, 'stripe');
    if (!$config) {
        throw new Exception('Configuração Stripe não encontrada. Configure suas credenciais Stripe primeiro.');
    }
    
    if (!isset($config['public_key']) || !isset($config['secret_key'])) {
        throw new Exception('Configuração Stripe incompleta. Verifique se as chaves estão configuradas.');
    }
    
    $amount = floatval($data['amount'] ?? 0);
    $description = $data['description'] ?? 'Pagamento CRM';
    
    if ($amount <= 0) {
        throw new Exception('Valor do pagamento deve ser maior que zero');
    }
    
    // Simulação da integração Stripe (em produção, usar a API real)
    $transactionId = 'STRIPE_' . time() . rand(1000, 9999);
    
    // Salvar no banco como pendente
    try {
        $stmt = $pdo->prepare("INSERT INTO payments (user_id, customer_id, amount, status, method, description, transaction_id, created_at) VALUES (1, ?, ?, 'pending', 'STRIPE', ?, ?, datetime('now'))");
        $stmt->execute([$data['customer_id'] ?? null, $amount, $description, $transactionId]);
        
        $paymentId = $pdo->lastInsertId();
        
        // Em produção, aqui você faria a chamada real para a API do Stripe
        echo json_encode([
            'success' => true,
            'payment_id' => $paymentId,
            'message' => 'Integração Stripe simulada. Em produção, será redirecionado para o checkout.',
            'transaction_id' => $transactionId,
            'amount' => $amount,
            'checkout_url' => 'https://checkout.stripe.com/pay/example#' . $transactionId
        ]);
    } catch (Exception $e) {
        throw new Exception('Erro ao processar pagamento Stripe: ' . $e->getMessage());
    }
}

function createMercadoPagoPayment($pdo, $data) {
    $config = getPaymentConfig($pdo, 'mercadopago');
    if (!$config) {
        throw new Exception('Configuração Mercado Pago não encontrada. Configure suas credenciais primeiro.');
    }
    
    if (!isset($config['public_key']) || !isset($config['access_token'])) {
        throw new Exception('Configuração Mercado Pago incompleta. Verifique se as credenciais estão configuradas.');
    }
    
    $amount = floatval($data['amount'] ?? 0);
    $description = $data['description'] ?? 'Pagamento CRM';
    
    if ($amount <= 0) {
        throw new Exception('Valor do pagamento deve ser maior que zero');
    }
    
    // Simulação da integração Mercado Pago (em produção, usar a API real)
    $transactionId = 'MP_' . time() . rand(1000, 9999);
    $environment = $config['environment'] ?? 'sandbox';
    
    // Salvar no banco como pendente
    try {
        $stmt = $pdo->prepare("INSERT INTO payments (user_id, customer_id, amount, status, method, description, transaction_id, created_at) VALUES (1, ?, ?, 'pending', 'MERCADO_PAGO', ?, ?, datetime('now'))");
        $stmt->execute([$data['customer_id'] ?? null, $amount, $description, $transactionId]);
        
        $paymentId = $pdo->lastInsertId();
        
        // Em produção, aqui você faria a chamada real para a API do Mercado Pago
        $checkoutUrl = $environment === 'sandbox' ? 
            'https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=' . $transactionId :
            'https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=' . $transactionId;
            
        echo json_encode([
            'success' => true,
            'payment_id' => $paymentId,
            'message' => 'Integração Mercado Pago simulada (' . ucfirst($environment) . '). Em produção, será redirecionado para o checkout.',
            'transaction_id' => $transactionId,
            'amount' => $amount,
            'environment' => $environment,
            'checkout_url' => $checkoutUrl
        ]);
    } catch (Exception $e) {
        throw new Exception('Erro ao processar pagamento Mercado Pago: ' . $e->getMessage());
    }
}

function verifyPayment($pdo, $data) {
    if (!isset($data['transaction_id'])) {
        throw new Exception('ID da transação não fornecido');
    }
    
    $transactionId = $data['transaction_id'];
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM payments WHERE transaction_id = ?");
        $stmt->execute([$transactionId]);
        $payment = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$payment) {
            echo json_encode(['success' => false, 'error' => 'Pagamento não encontrado']);
            return;
        }
        
        // Simulação de verificação de pagamento
        // Em produção, você consultaria a API do gateway de pagamento
        $currentStatus = $payment['status'];
        
        if ($currentStatus === 'pending') {
            // Simular: 20% de chance de ter sido pago
            $isPaid = rand(1, 5) === 1;
            
            if ($isPaid) {
                $stmt = $pdo->prepare("UPDATE payments SET status = 'paid', updated_at = datetime('now') WHERE id = ?");
                $stmt->execute([$payment['id']]);
                
                echo json_encode([
                    'success' => true, 
                    'status' => 'paid', 
                    'message' => 'Pagamento confirmado com sucesso!',
                    'payment_id' => $payment['id'],
                    'amount' => $payment['amount'],
                    'method' => $payment['method']
                ]);
            } else {
                echo json_encode([
                    'success' => true, 
                    'status' => 'pending',
                    'message' => 'Pagamento ainda não foi processado'
                ]);
            }
        } else {
            echo json_encode([
                'success' => true, 
                'status' => $currentStatus,
                'message' => $currentStatus === 'paid' ? 'Pagamento já foi confirmado' : 'Status: ' . $currentStatus
            ]);
        }
    } catch (Exception $e) {
        throw new Exception('Erro ao verificar pagamento: ' . $e->getMessage());
    }
}
?>
