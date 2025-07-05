
class IntegrationSettings {
    constructor() {
        this.configurations = {
            evolution: null,
            n8n: null,
            webhooks: null
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
        document.getElementById('evolutionForm').addEventListener('submit', (e) => this.saveEvolutionConfig(e));
        document.getElementById('n8nForm').addEventListener('submit', (e) => this.saveN8nConfig(e));
        document.getElementById('webhookForm').addEventListener('submit', (e) => this.saveWebhookConfig(e));

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

    async loadConfigurations() {
        try {
            const response = await fetch('api_config.php?action=all');
            const configs = await response.json();

            this.configurations = configs;

            // Load Evolution config
            if (configs.evolution) {
                document.getElementById('evolutionUrl').value = configs.evolution.url || '';
                document.getElementById('evolutionKey').value = configs.evolution.key || '';
                document.getElementById('evolutionWebhook').value = configs.evolution.webhook || '';
                document.getElementById('evolutionInstance').value = configs.evolution.instanceName || 'crm-instance';
            }

            // Load n8n config
            if (configs.n8n) {
                document.getElementById('n8nUrl').value = configs.n8n.n8nUrl || '';
                document.getElementById('n8nApiKey').value = configs.n8n.apiKey || '';
                document.getElementById('n8nWebhook').value = configs.n8n.webhookUrl || '';
            }

            // Load webhook config
            if (configs.webhooks) {
                document.getElementById('evolutionWebhookUrl').value = configs.webhooks.evolutionUrl || '';
                document.getElementById('n8nWebhookUrl').value = configs.webhooks.n8nUrl || '';
                document.getElementById('paymentWebhookUrl').value = configs.webhooks.paymentUrl || '';
                document.getElementById('genericWebhookUrl').value = configs.webhooks.genericUrl || '';
            }

            this.updateStatusIndicators();
        } catch (error) {
            console.error('Erro ao carregar configurações:', error);
        }
    }

    async saveEvolutionConfig(e) {
        e.preventDefault();
        
        const config = {
            url: document.getElementById('evolutionUrl').value,
            key: document.getElementById('evolutionKey').value,
            webhook: document.getElementById('evolutionWebhook').value,
            instanceName: document.getElementById('evolutionInstance').value
        };

        try {
            const response = await fetch('api_config.php?action=evolution', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(config)
            });

            const result = await response.json();
            
            if (result.success) {
                this.showNotification('Configuração Evolution salva com sucesso!', 'success');
                this.configurations.evolution = config;
                this.updateStatusIndicators();
            } else {
                throw new Error(result.error || 'Erro ao salvar configuração');
            }
        } catch (error) {
            console.error('Erro ao salvar configuração Evolution:', error);
            this.showNotification('Erro ao salvar configuração: ' + error.message, 'error');
        }
    }

    async saveN8nConfig(e) {
        e.preventDefault();
        
        const config = {
            n8nUrl: document.getElementById('n8nUrl').value,
            apiKey: document.getElementById('n8nApiKey').value,
            webhookUrl: document.getElementById('n8nWebhook').value
        };

        try {
            const response = await fetch('api_config.php?action=n8n', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(config)
            });

            const result = await response.json();
            
            if (result.success) {
                this.showNotification('Configuração n8n salva com sucesso!', 'success');
                this.configurations.n8n = config;
                this.updateStatusIndicators();
            } else {
                throw new Error(result.error || 'Erro ao salvar configuração');
            }
        } catch (error) {
            console.error('Erro ao salvar configuração n8n:', error);
            this.showNotification('Erro ao salvar configuração: ' + error.message, 'error');
        }
    }

    async saveWebhookConfig(e) {
        e.preventDefault();
        
        const config = {
            evolutionUrl: document.getElementById('evolutionWebhookUrl').value,
            n8nUrl: document.getElementById('n8nWebhookUrl').value,
            paymentUrl: document.getElementById('paymentWebhookUrl').value,
            genericUrl: document.getElementById('genericWebhookUrl').value
        };

        try {
            const response = await fetch('api_config.php?action=webhooks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(config)
            });

            const result = await response.json();
            
            if (result.success) {
                this.showNotification('Configuração de webhooks salva com sucesso!', 'success');
                this.configurations.webhooks = config;
                this.updateStatusIndicators();
            } else {
                throw new Error(result.error || 'Erro ao salvar configuração');
            }
        } catch (error) {
            console.error('Erro ao salvar configuração de webhooks:', error);
            this.showNotification('Erro ao salvar configuração: ' + error.message, 'error');
        }
    }

    updateStatusIndicators() {
        // Evolution API Status
        this.updateIntegrationStatus('evolution', this.configurations.evolution);
        
        // n8n Status
        this.updateIntegrationStatus('n8n', this.configurations.n8n);
        
        // Webhooks Status
        this.updateIntegrationStatus('webhooks', this.configurations.webhooks);
    }

    updateIntegrationStatus(integration, config) {
        const isConfigured = config && Object.values(config).some(value => value && value.trim() !== '');
        
        // Update tab indicator
        const tabIndicator = document.getElementById(`${integration}-status`);
        if (tabIndicator) {
            tabIndicator.className = `status-indicator ${isConfigured ? 'active' : ''}`;
        }

        // Update status card
        const statusCard = document.getElementById(`${integration}-status-card`);
        const statusBadge = document.getElementById(`${integration}-badge`);
        const statusDetails = document.getElementById(`${integration}-details`);

        if (statusCard && statusBadge) {
            if (isConfigured) {
                statusCard.classList.add('configured');
                statusBadge.textContent = 'Configurado';
                statusBadge.className = 'status-badge configured';
                
                if (statusDetails) {
                    statusDetails.textContent = this.getStatusDetails(integration, config);
                }
            } else {
                statusCard.classList.remove('configured');
                statusBadge.textContent = 'Não Configurado';
                statusBadge.className = 'status-badge not-configured';
                
                if (statusDetails) {
                    statusDetails.textContent = this.getStatusPlaceholder(integration);
                }
            }
        }
    }

    getStatusDetails(integration, config) {
        switch (integration) {
            case 'evolution':
                return `Conectado: ${config.url}`;
            case 'n8n':
                return `n8n.cloud: ${config.n8nUrl}`;
            case 'webhooks':
                const configuredCount = Object.values(config).filter(url => url && url.trim() !== '').length;
                return `${configuredCount} webhook(s) configurado(s)`;
            default:
                return 'Configurado';
        }
    }

    getStatusPlaceholder(integration) {
        switch (integration) {
            case 'evolution':
                return 'Configure para conectar WhatsApp';
            case 'n8n':
                return 'Configure para automações';
            case 'webhooks':
                return 'Configure URLs de eventos';
            default:
                return 'Não configurado';
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

// Test Functions
async function testEvolutionConnection() {
    const config = {
        url: document.getElementById('evolutionUrl').value,
        key: document.getElementById('evolutionKey').value
    };

    if (!config.url || !config.key) {
        alert('Preencha URL e API Key primeiro');
        return;
    }

    try {
        // First save the config
        await fetch('api_config.php?action=evolution', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...config,
                webhook: document.getElementById('evolutionWebhook').value,
                instanceName: document.getElementById('evolutionInstance').value
            })
        });

        // Then test connection
        const response = await fetch('evolution_api.php?action=test_connection');
        const result = await response.json();

        if (result.success) {
            alert('✅ ' + result.message);
            loadEvolutionInstances();
        } else {
            alert('❌ Erro: ' + result.error);
        }
    } catch (error) {
        console.error('Erro ao testar conexão Evolution:', error);
        alert('❌ Erro ao testar conexão: ' + error.message);
    }
}

async function testN8nConnection() {
    const config = {
        n8nUrl: document.getElementById('n8nUrl').value,
        apiKey: document.getElementById('n8nApiKey').value
    };

    if (!config.n8nUrl || !config.apiKey) {
        alert('Preencha URL e API Key primeiro');
        return;
    }

    try {
        // First save the config
        await fetch('api_config.php?action=n8n', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...config,
                webhookUrl: document.getElementById('n8nWebhook').value
            })
        });

        // Then test connection
        const response = await fetch('n8n_api.php?action=test_connection');
        const result = await response.json();

        if (result.success) {
            alert('✅ ' + result.message);
            loadN8nWorkflows();
        } else {
            alert('❌ Erro: ' + result.error);
        }
    } catch (error) {
        console.error('Erro ao testar conexão n8n:', error);
        alert('❌ Erro ao testar conexão: ' + error.message);
    }
}

// Evolution Instance Management
async function loadEvolutionInstances() {
    try {
        const response = await fetch('evolution_api.php?action=get_instances');
        const result = await response.json();

        const container = document.getElementById('evolution-instances');
        
        if (result.success && result.instances) {
            let html = '<div class="instances-grid">';
            
            if (Array.isArray(result.instances) && result.instances.length > 0) {
                result.instances.forEach(instance => {
                    const status = instance.connectionStatus || 'disconnected';
                    const statusClass = status === 'open' ? 'connected' : 'disconnected';
                    
                    html += `
                        <div class="instance-card ${statusClass}">
                            <div class="instance-info">
                                <h4>${instance.instanceName}</h4>
                                <p>Status: <span class="status-${statusClass}">${status}</span></p>
                                ${instance.phone ? `<p>Telefone: ${instance.phone}</p>` : ''}
                            </div>
                            <div class="instance-actions">
                                ${status !== 'open' ? `
                                    <button onclick="connectEvolutionInstance('${instance.instanceName}')" class="btn btn-sm btn-primary">
                                        <i class="fas fa-plug"></i> Conectar
                                    </button>
                                ` : `
                                    <button onclick="getEvolutionQRCode('${instance.instanceName}')" class="btn btn-sm btn-secondary">
                                        <i class="fas fa-qrcode"></i> QR Code
                                    </button>
                                    <button onclick="logoutEvolutionInstance('${instance.instanceName}')" class="btn btn-sm btn-danger">
                                        <i class="fas fa-sign-out-alt"></i> Desconectar
                                    </button>
                                `}
                            </div>
                        </div>
                    `;
                });
            } else {
                html += '<p>Nenhuma instância encontrada. Crie uma nova instância.</p>';
            }
            
            html += '</div>';
            container.innerHTML = html;
        } else {
            container.innerHTML = '<p>Erro ao carregar instâncias: ' + (result.error || 'Erro desconhecido')</p>';
        }
    } catch (error) {
        console.error('Erro ao carregar instâncias Evolution:', error);
        document.getElementById('evolution-instances').innerHTML = '<p>Erro ao carregar instâncias</p>';
    }
}

async function createEvolutionInstance() {
    const instanceName = prompt('Nome da nova instância:', 'crm-instance-' + Date.now());
    if (!instanceName) return;

    try {
        const response = await fetch('evolution_api.php?action=create_instance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                instanceName: instanceName,
                webhook: document.getElementById('evolutionWebhook').value
            })
        });

        const result = await response.json();

        if (result.success) {
            alert('✅ Instância criada com sucesso!');
            loadEvolutionInstances();
        } else {
            alert('❌ Erro ao criar instância: ' + result.error);
        }
    } catch (error) {
        console.error('Erro ao criar instância:', error);
        alert('❌ Erro ao criar instância: ' + error.message);
    }
}

async function connectEvolutionInstance(instanceName) {
    try {
        const response = await fetch('evolution_api.php?action=connect_instance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ instanceName })
        });

        const result = await response.json();

        if (result.success) {
            alert('✅ Conectando instância...');
            setTimeout(() => loadEvolutionInstances(), 2000);
            
            // Try to get QR code
            getEvolutionQRCode(instanceName);
        } else {
            alert('❌ Erro ao conectar instância: ' + result.error);
        }
    } catch (error) {
        console.error('Erro ao conectar instância:', error);
        alert('❌ Erro ao conectar instância: ' + error.message);
    }
}

async function getEvolutionQRCode(instanceName) {
    try {
        const response = await fetch(`evolution_api.php?action=get_qrcode&instance=${instanceName}`);
        const result = await response.json();

        if (result.success && result.qrcode) {
            showQRCodeModal(result.qrcode, instanceName);
        } else {
            alert('❌ Erro ao obter QR Code: ' + result.error);
        }
    } catch (error) {
        console.error('Erro ao obter QR Code:', error);
        alert('❌ Erro ao obter QR Code: ' + error.message);
    }
}

function showQRCodeModal(qrcode, instanceName) {
    const modal = document.createElement('div');
    modal.className = 'pix-test-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h3>QR Code - WhatsApp ${instanceName}</h3>
            <p>Escaneie o código QR com seu WhatsApp:</p>
            ${qrcode.base64 ? `<img src="${qrcode.base64}" alt="QR Code" style="max-width: 300px;">` : ''}
            ${qrcode.code ? `
                <p>Código PIX:</p>
                <textarea readonly onclick="this.select()">${qrcode.code}</textarea>
                <button onclick="navigator.clipboard.writeText('${qrcode.code}')" class="btn btn-secondary">
                    <i class="fas fa-copy"></i> Copiar Código
                </button>
            ` : ''}
        </div>
    `;
    
    document.body.appendChild(modal);
}

async function logoutEvolutionInstance(instanceName) {
    if (!confirm('Deseja realmente desconectar a instância ' + instanceName + '?')) return;

    try {
        const response = await fetch('evolution_api.php?action=logout_instance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ instanceName })
        });

        const result = await response.json();

        if (result.success) {
            alert('✅ Instância desconectada com sucesso!');
            loadEvolutionInstances();
        } else {
            alert('❌ Erro ao desconectar instância: ' + result.error);
        }
    } catch (error) {
        console.error('Erro ao desconectar instância:', error);
        alert('❌ Erro ao desconectar instância: ' + error.message);
    }
}

// n8n Workflow Management
async function loadN8nWorkflows() {
    try {
        const response = await fetch('n8n_api.php?action=get_workflows');
        const result = await response.json();

        const container = document.getElementById('n8n-workflows');
        
        if (result.success && result.workflows) {
            let html = '<div class="workflows-grid">';
            
            if (result.workflows.data && result.workflows.data.length > 0) {
                result.workflows.data.forEach(workflow => {
                    const activeClass = workflow.active ? 'active' : 'inactive';
                    
                    html += `
                        <div class="workflow-card ${activeClass}">
                            <div class="workflow-info">
                                <h4>${workflow.name}</h4>
                                <p>ID: ${workflow.id}</p>
                                <p>Status: <span class="status-${activeClass}">${workflow.active ? 'Ativo' : 'Inativo'}</span></p>
                            </div>
                            <div class="workflow-actions">
                                <button onclick="executeN8nWorkflow('${workflow.id}')" class="btn btn-sm btn-primary">
                                    <i class="fas fa-play"></i> Executar
                                </button>
                                <button onclick="viewN8nWorkflow('${workflow.id}')" class="btn btn-sm btn-secondary">
                                    <i class="fas fa-eye"></i> Ver Detalhes
                                </button>
                            </div>
                        </div>
                    `;
                });
            } else {
                html += '<p>Nenhum workflow encontrado.</p>';
            }
            
            html += '</div>';
            container.innerHTML = html;
        } else {
            container.innerHTML = '<p>Erro ao carregar workflows: ' + (result.error || 'Erro desconhecido')</p>';
        }
    } catch (error) {
        console.error('Erro ao carregar workflows n8n:', error);
        document.getElementById('n8n-workflows').innerHTML = '<p>Erro ao carregar workflows</p>';
    }
}

async function syncN8nWorkflows() {
    try {
        const response = await fetch('n8n_api.php?action=sync_workflows');
        const result = await response.json();

        if (result.success) {
            alert('✅ ' + result.message);
            loadN8nWorkflows();
        } else {
            alert('❌ Erro ao sincronizar workflows: ' + result.error);
        }
    } catch (error) {
        console.error('Erro ao sincronizar workflows:', error);
        alert('❌ Erro ao sincronizar workflows: ' + error.message);
    }
}

async function executeN8nWorkflow(workflowId) {
    const inputData = prompt('Dados de entrada (JSON) - opcional:', '{}');
    let parsedInput = {};
    
    if (inputData && inputData.trim() !== '{}') {
        try {
            parsedInput = JSON.parse(inputData);
        } catch (e) {
            alert('❌ JSON inválido nos dados de entrada');
            return;
        }
    }

    try {
        const response = await fetch('n8n_api.php?action=execute_workflow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                workflowId: workflowId,
                inputData: parsedInput
            })
        });

        const result = await response.json();

        if (result.success) {
            alert('✅ Workflow executado com sucesso!');
            console.log('Resultado da execução:', result.execution);
        } else {
            alert('❌ Erro ao executar workflow: ' + result.error);
        }
    } catch (error) {
        console.error('Erro ao executar workflow:', error);
        alert('❌ Erro ao executar workflow: ' + error.message);
    }
}

function viewN8nWorkflow(workflowId) {
    // Open n8n workflow in new tab
    const n8nUrl = document.getElementById('n8nUrl').value;
    if (n8nUrl) {
        window.open(`${n8nUrl}/workflow/${workflowId}`, '_blank');
    } else {
        alert('Configure a URL do n8n primeiro');
    }
}

// Webhook Events
async function loadWebhookEvents() {
    // This would load webhook events from database
    // For now, show a placeholder
    document.getElementById('webhook-events').innerHTML = `
        <p>Funcionalidade de log de webhooks será implementada.</p>
        <p>Aqui aparecerão os eventos recebidos dos webhooks configurados.</p>
    `;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    new IntegrationSettings();
});
