
class PaymentSettings {
    constructor() {
        this.configurations = {
            pix: null,
            stripe: null,
            mercadopago: null
        };
        this.init();
        this.loadConfigurations();
        this.updateStatusIndicators();
    }

    init() {
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.closest('.tab-btn').dataset.tab));
        });

        // Form submissions
        document.getElementById('pixForm').addEventListener('submit', (e) => this.savePixConfig(e));
        document.getElementById('stripeForm').addEventListener('submit', (e) => this.saveStripeConfig(e));
        document.getElementById('mercadopagoForm').addEventListener('submit', (e) => this.saveMercadoPagoConfig(e));

        // PIX key type change
        document.getElementById('pixKeyType').addEventListener('change', (e) => this.updatePixKeyPlaceholder(e.target.value));

        // Auto-refresh status every 30 seconds
        setInterval(() => this.updateStatusIndicators(), 30000);
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    updatePixKeyPlaceholder(type) {
        const input = document.getElementById('pixKey');
        const placeholders = {
            'email': 'exemplo@email.com',
            'cpf': '123.456.789-00',
            'cnpj': '12.345.678/0001-00',
            'phone': '+5511999999999',
            'random': 'chave-aleatoria-do-banco'
        };
        
        input.placeholder = placeholders[type] || 'Digite sua chave PIX';
        
        // Update validation pattern
        if (type === 'email') {
            input.type = 'email';
        } else if (type === 'phone') {
            input.type = 'tel';
        } else {
            input.type = 'text';
        }
    }

    async loadConfigurations() {
        try {
            const response = await fetch('payment_config.php?action=all');
            const configs = await response.json();

            this.configurations = configs;

            // Load PIX config
            if (configs.pix) {
                document.getElementById('pixKeyType').value = configs.pix.pix_key_type || '';
                document.getElementById('pixKey').value = configs.pix.pix_key || '';
                document.getElementById('merchantName').value = configs.pix.merchant_name || '';
                document.getElementById('merchantCity').value = configs.pix.merchant_city || '';
                this.updatePixKeyPlaceholder(configs.pix.pix_key_type);
            }

            // Load Stripe config
            if (configs.stripe) {
                document.getElementById('stripePublicKey').value = configs.stripe.public_key || '';
                document.getElementById('stripeSecretKey').value = configs.stripe.secret_key || '';
                document.getElementById('stripeWebhookSecret').value = configs.stripe.webhook_secret || '';
            }

            // Load Mercado Pago config
            if (configs.mercadopago) {
                document.getElementById('mpPublicKey').value = configs.mercadopago.public_key || '';
                document.getElementById('mpAccessToken').value = configs.mercadopago.access_token || '';
                document.getElementById('mpEnvironment').value = configs.mercadopago.environment || 'sandbox';
            }

            this.updateStatusIndicators();
        } catch (error) {
            console.error('Erro ao carregar configurações:', error);
            this.showNotification('Erro ao carregar configurações existentes', 'error');
        }
    }

    updateStatusIndicators() {
        // PIX Status
        const pixConfigured = this.configurations?.pix?.pix_key && 
                             this.configurations?.pix?.merchant_name && 
                             this.configurations?.pix?.merchant_city;
        
        this.updateGatewayStatus('pix', pixConfigured);

        // Stripe Status
        const stripeConfigured = this.configurations?.stripe?.public_key && 
                                this.configurations?.stripe?.secret_key;
        
        this.updateGatewayStatus('stripe', stripeConfigured);

        // Mercado Pago Status
        const mpConfigured = this.configurations?.mercadopago?.public_key && 
                            this.configurations?.mercadopago?.access_token;
        
        this.updateGatewayStatus('mercadopago', mpConfigured);
    }

    updateGatewayStatus(gateway, isConfigured) {
        // Update tab indicator
        const tabIndicator = document.querySelector(`[data-tab="${gateway}"] .status-indicator`);
        if (tabIndicator) {
            tabIndicator.className = `status-indicator ${isConfigured ? 'active' : ''}`;
        }

        // Update status card
        const statusCard = document.getElementById(`${gateway === 'mercadopago' ? 'mp' : gateway}-status-card`);
        const statusBadge = document.getElementById(`${gateway === 'mercadopago' ? 'mp' : gateway}-badge`);
        
        if (statusCard && statusBadge) {
            if (isConfigured) {
                statusCard.classList.add('configured');
                statusBadge.textContent = 'Configurado';
                statusBadge.className = 'status-badge configured';
            } else {
                statusCard.classList.remove('configured');
                statusBadge.textContent = 'Não Configurado';
                statusBadge.className = 'status-badge not-configured';
            }
        }
    }

    async savePixConfig(e) {
        e.preventDefault();
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<div class="loading"></div> Salvando...';
        submitBtn.disabled = true;
        
        const config = {
            gateway: 'pix',
            config: {
                pix_key_type: document.getElementById('pixKeyType').value,
                pix_key: document.getElementById('pixKey').value,
                merchant_name: document.getElementById('merchantName').value,
                merchant_city: document.getElementById('merchantCity').value
            }
        };

        // Validation
        if (!config.config.pix_key_type || !config.config.pix_key || 
            !config.config.merchant_name || !config.config.merchant_city) {
            this.showNotification('Por favor, preencha todos os campos obrigatórios', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            return;
        }

        try {
            const response = await fetch('payment_config.php?action=save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });

            const result = await response.json();
            if (result.success) {
                this.configurations.pix = config.config;
                this.showNotification('Configuração PIX salva com sucesso!', 'success');
                this.updateStatusIndicators();
            } else {
                throw new Error(result.error || 'Erro ao salvar');
            }
        } catch (error) {
            this.showNotification('Erro ao salvar configuração PIX: ' + error.message, 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async saveStripeConfig(e) {
        e.preventDefault();
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<div class="loading"></div> Salvando...';
        submitBtn.disabled = true;
        
        const config = {
            gateway: 'stripe',
            config: {
                public_key: document.getElementById('stripePublicKey').value,
                secret_key: document.getElementById('stripeSecretKey').value,
                webhook_secret: document.getElementById('stripeWebhookSecret').value
            }
        };

        // Validation
        if (!config.config.public_key || !config.config.secret_key) {
            this.showNotification('Por favor, preencha as chaves pública e secreta', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            return;
        }

        try {
            const response = await fetch('payment_config.php?action=save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });

            const result = await response.json();
            if (result.success) {
                this.configurations.stripe = config.config;
                this.showNotification('Configuração Stripe salva com sucesso!', 'success');
                this.updateStatusIndicators();
            } else {
                throw new Error(result.error || 'Erro ao salvar');
            }
        } catch (error) {
            this.showNotification('Erro ao salvar configuração Stripe: ' + error.message, 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async saveMercadoPagoConfig(e) {
        e.preventDefault();
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<div class="loading"></div> Salvando...';
        submitBtn.disabled = true;
        
        const config = {
            gateway: 'mercadopago',
            config: {
                public_key: document.getElementById('mpPublicKey').value,
                access_token: document.getElementById('mpAccessToken').value,
                environment: document.getElementById('mpEnvironment').value
            }
        };

        // Validation
        if (!config.config.public_key || !config.config.access_token) {
            this.showNotification('Por favor, preencha as credenciais do Mercado Pago', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            return;
        }

        try {
            const response = await fetch('payment_config.php?action=save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });

            const result = await response.json();
            if (result.success) {
                this.configurations.mercadopago = config.config;
                this.showNotification('Configuração Mercado Pago salva com sucesso!', 'success');
                this.updateStatusIndicators();
            } else {
                throw new Error(result.error || 'Erro ao salvar');
            }
        } catch (error) {
            this.showNotification('Erro ao salvar configuração Mercado Pago: ' + error.message, 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Test functions
async function testPixPayment() {
    try {
        const response = await fetch('payment_processor.php?action=create_pix', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: 10.00,
                description: 'Teste PIX - Sistema CRM',
                customer_id: null
            })
        });

        const result = await response.json();
        if (result.success) {
            showPixTestResult(result);
        } else {
            alert('Erro no teste PIX: ' + (result.error || 'Configuração PIX não encontrada ou incompleta'));
        }
    } catch (error) {
        alert('Erro ao testar PIX: ' + error.message);
    }
}

function showPixTestResult(result) {
    const modal = document.createElement('div');
    modal.className = 'pix-test-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="this.closest('.pix-test-modal').remove()">&times;</span>
            <h3><i class="fas fa-qrcode"></i> Teste PIX - R$ ${result.amount.toFixed(2)}</h3>
            <p><strong>ID da Transação:</strong> ${result.transaction_id}</p>
            <img src="${result.qr_code_url}" alt="QR Code PIX">
            <p><strong>Código PIX (Copia e Cola):</strong></p>
            <textarea readonly>${result.pix_code}</textarea>
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                <button onclick="copyToClipboard('${result.pix_code}')" class="btn btn-primary">
                    <i class="fas fa-copy"></i> Copiar Código
                </button>
                <button onclick="checkTestPayment('${result.transaction_id}')" class="btn btn-secondary">
                    <i class="fas fa-sync"></i> Verificar Pagamento
                </button>
                <button onclick="this.closest('.pix-test-modal').remove()" class="btn btn-secondary">
                    <i class="fas fa-times"></i> Fechar
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            alert('Código PIX copiado para a área de transferência!');
        });
    } else {
        // Fallback para navegadores antigos
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Código PIX copiado!');
    }
}

async function checkTestPayment(transactionId) {
    try {
        const response = await fetch('payment_processor.php?action=verify_payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transaction_id: transactionId })
        });
        
        const result = await response.json();
        
        if (result.success) {
            if (result.status === 'paid') {
                alert('✅ ' + result.message);
            } else {
                alert('⏳ Pagamento ainda pendente. Status: ' + result.status);
            }
        } else {
            alert('❌ Erro ao verificar pagamento: ' + result.error);
        }
    } catch (error) {
        alert('❌ Erro ao verificar pagamento: ' + error.message);
    }
}

async function testStripePayment() {
    try {
        const response = await fetch('payment_processor.php?action=create_stripe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: 15.00,
                description: 'Teste Stripe - Sistema CRM',
                customer_id: null
            })
        });

        const result = await response.json();
        if (result.success) {
            if (result.checkout_url) {
                window.open(result.checkout_url, '_blank');
            } else {
                alert('✅ ' + (result.message || 'Teste Stripe executado com sucesso!'));
            }
        } else {
            alert('❌ Erro no teste Stripe: ' + (result.error || 'Configuração Stripe não encontrada ou incompleta'));
        }
    } catch (error) {
        alert('❌ Erro ao testar Stripe: ' + error.message);
    }
}

async function testMercadoPagoPayment() {
    try {
        const response = await fetch('payment_processor.php?action=create_mercadopago', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: 20.00,
                description: 'Teste Mercado Pago - Sistema CRM',
                customer_id: null
            })
        });

        const result = await response.json();
        if (result.success) {
            if (result.checkout_url) {
                window.open(result.checkout_url, '_blank');
            } else {
                alert('✅ ' + (result.message || 'Teste Mercado Pago executado com sucesso!'));
            }
        } else {
            alert('❌ Erro no teste Mercado Pago: ' + (result.error || 'Configuração Mercado Pago não encontrada ou incompleta'));
        }
    } catch (error) {
        alert('❌ Erro ao testar Mercado Pago: ' + error.message);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new PaymentSettings();
});
