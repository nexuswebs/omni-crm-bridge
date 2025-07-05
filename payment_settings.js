
class PaymentSettings {
    constructor() {
        this.init();
        this.loadConfigurations();
    }

    init() {
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Form submissions
        document.getElementById('pixForm').addEventListener('submit', (e) => this.savePixConfig(e));
        document.getElementById('stripeForm').addEventListener('submit', (e) => this.saveStripeConfig(e));
        document.getElementById('mercadopagoForm').addEventListener('submit', (e) => this.saveMercadoPagoConfig(e));

        // PIX key type change
        document.getElementById('pixKeyType').addEventListener('change', (e) => this.updatePixKeyPlaceholder(e.target.value));
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
            'email': 'seu.email@exemplo.com',
            'cpf': '123.456.789-00',
            'cnpj': '12.345.678/0001-00',
            'phone': '+5511999999999',
            'random': 'chave-aleatoria-do-banco'
        };
        input.placeholder = placeholders[type] || 'Digite sua chave PIX';
    }

    async loadConfigurations() {
        try {
            const response = await fetch('payment_config.php?action=all');
            const configs = await response.json();

            // Load PIX config
            if (configs.pix) {
                document.getElementById('pixKeyType').value = configs.pix.pix_key_type || 'email';
                document.getElementById('pixKey').value = configs.pix.pix_key || '';
                document.getElementById('merchantName').value = configs.pix.merchant_name || '';
                document.getElementById('merchantCity').value = configs.pix.merchant_city || '';
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
            }

        } catch (error) {
            console.error('Erro ao carregar configurações:', error);
        }
    }

    async savePixConfig(e) {
        e.preventDefault();
        
        const config = {
            gateway: 'pix',
            config: {
                pix_key_type: document.getElementById('pixKeyType').value,
                pix_key: document.getElementById('pixKey').value,
                merchant_name: document.getElementById('merchantName').value,
                merchant_city: document.getElementById('merchantCity').value
            }
        };

        try {
            const response = await fetch('payment_config.php?action=save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });

            const result = await response.json();
            if (result.success) {
                this.showNotification('Configuração PIX salva com sucesso!', 'success');
            } else {
                throw new Error(result.error || 'Erro ao salvar');
            }
        } catch (error) {
            this.showNotification('Erro ao salvar configuração PIX: ' + error.message, 'error');
        }
    }

    async saveStripeConfig(e) {
        e.preventDefault();
        
        const config = {
            gateway: 'stripe',
            config: {
                public_key: document.getElementById('stripePublicKey').value,
                secret_key: document.getElementById('stripeSecretKey').value,
                webhook_secret: document.getElementById('stripeWebhookSecret').value
            }
        };

        try {
            const response = await fetch('payment_config.php?action=save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });

            const result = await response.json();
            if (result.success) {
                this.showNotification('Configuração Stripe salva com sucesso!', 'success');
            } else {
                throw new Error(result.error || 'Erro ao salvar');
            }
        } catch (error) {
            this.showNotification('Erro ao salvar configuração Stripe: ' + error.message, 'error');
        }
    }

    async saveMercadoPagoConfig(e) {
        e.preventDefault();
        
        const config = {
            gateway: 'mercadopago',
            config: {
                public_key: document.getElementById('mpPublicKey').value,
                access_token: document.getElementById('mpAccessToken').value
            }
        };

        try {
            const response = await fetch('payment_config.php?action=save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });

            const result = await response.json();
            if (result.success) {
                this.showNotification('Configuração Mercado Pago salva com sucesso!', 'success');
            } else {
                throw new Error(result.error || 'Erro ao salvar');
            }
        } catch (error) {
            this.showNotification('Erro ao salvar configuração Mercado Pago: ' + error.message, 'error');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            font-weight: 500;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
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
                description: 'Teste PIX',
                customer_id: null
            })
        });

        const result = await response.json();
        if (result.success) {
            showPixTestResult(result);
        } else {
            alert('Erro no teste PIX: ' + result.error);
        }
    } catch (error) {
        alert('Erro ao testar PIX: ' + error.message);
    }
}

function showPixTestResult(result) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 10px; max-width: 400px; text-align: center;">
            <h3>Teste PIX - R$ ${result.amount.toFixed(2)}</h3>
            <img src="${result.qr_code_url}" alt="QR Code PIX" style="margin: 20px 0;">
            <p><strong>Código PIX:</strong></p>
            <textarea readonly style="width: 100%; height: 100px; margin: 10px 0; font-size: 12px;">${result.pix_code}</textarea>
            <button onclick="copyToClipboard('${result.pix_code}')" class="btn btn-primary" style="margin: 5px;">Copiar Código</button>
            <button onclick="this.closest('div').parentElement.remove()" class="btn btn-secondary" style="margin: 5px;">Fechar</button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Código PIX copiado para a área de transferência!');
    });
}

async function testStripePayment() {
    alert('Teste Stripe: Funcionalidade em desenvolvimento');
}

async function testMercadoPagoPayment() {
    alert('Teste Mercado Pago: Funcionalidade em desenvolvimento');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new PaymentSettings();
});
