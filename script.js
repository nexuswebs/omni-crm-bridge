
// Sistema CRM Simples em JavaScript Puro
class CRMSystem {
    constructor() {
        this.currentUser = null;
        this.customers = [];
        this.workflows = [];
        this.payments = [];
        this.agents = [];
        this.whatsappConnected = false;
        
        this.init();
        this.loadSampleData();
    }

    init() {
        // Event listeners
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('logoutBtn').addEventListener('click', () => this.handleLogout());
        
        // Menu navigation
        document.querySelectorAll('.sidebar-menu a').forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Modal handling
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => this.closeModals());
        });

        // Customer form
        document.getElementById('customerForm').addEventListener('submit', (e) => this.handleAddCustomer(e));

        // Update stats on load
        this.updateStats();
    }

    loadSampleData() {
        // Dados de exemplo para demonstração
        this.customers = [
            {
                id: 1,
                name: 'João Silva',
                email: 'joao@email.com',
                phone: '(11) 99999-9999',
                company: 'Empresa ABC',
                status: 'active',
                createdAt: new Date()
            },
            {
                id: 2,
                name: 'Maria Santos',
                email: 'maria@email.com',
                phone: '(11) 88888-8888',
                company: 'Tech Corp',
                status: 'active',
                createdAt: new Date()
            },
            {
                id: 3,
                name: 'Pedro Costa',
                email: 'pedro@email.com',
                phone: '(11) 77777-7777',
                company: 'StartupXYZ',
                status: 'inactive',
                createdAt: new Date()
            }
        ];

        this.workflows = [
            {
                id: 1,
                name: 'Onboarding Automático',
                description: 'Processo automatizado de boas-vindas para novos clientes',
                status: 'active',
                executions: 45,
                createdAt: new Date()
            },
            {
                id: 2,
                name: 'Follow-up Vendas',
                description: 'Acompanhamento automático de prospects',
                status: 'active',
                executions: 32,
                createdAt: new Date()
            },
            {
                id: 3,
                name: 'Suporte Inteligente',
                description: 'IA que responde dúvidas comuns automaticamente',
                status: 'paused',
                executions: 78,
                createdAt: new Date()
            }
        ];

        this.payments = [
            {
                id: 1,
                customerName: 'João Silva',
                amount: 1500.00,
                status: 'paid',
                date: new Date(),
                method: 'Cartão de Crédito'
            },
            {
                id: 2,
                customerName: 'Maria Santos',
                amount: 850.00,
                status: 'pending',
                date: new Date(),
                method: 'PIX'
            },
            {
                id: 3,
                customerName: 'Pedro Costa',
                amount: 2200.00,
                status: 'paid',
                date: new Date(),
                method: 'Boleto'
            }
        ];

        this.agents = [
            {
                id: 1,
                name: 'Assistente de Vendas',
                description: 'IA especializada em qualificação de leads',
                status: 'active',
                conversations: 156
            },
            {
                id: 2,
                name: 'Suporte Técnico',
                description: 'Bot para resolver dúvidas técnicas comuns',
                status: 'active',
                conversations: 89
            },
            {
                id: 3,
                name: 'Atendimento Financeiro',
                description: 'Assistente para questões de pagamento',
                status: 'inactive',
                conversations: 23
            }
        ];
    }

    handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Simulação de login (aceita qualquer email/senha para demo)
        if (email && password) {
            this.currentUser = {
                email: email,
                name: 'Admin User'
            };
            
            this.showScreen('dashboardScreen');
            this.showPage('dashboard');
            this.updateStats();
            this.renderCustomers();
            this.renderWorkflows();
            this.renderPayments();
            this.renderAgents();
            
            this.showNotification('Login realizado com sucesso!', 'success');
        } else {
            this.showNotification('Por favor, preencha todos os campos', 'error');
        }
    }

    handleLogout() {
        this.currentUser = null;
        this.showScreen('loginScreen');
        document.getElementById('loginForm').reset();
        this.showNotification('Logout realizado com sucesso!', 'success');
    }

    handleNavigation(e) {
        e.preventDefault();
        
        const page = e.target.closest('a').dataset.page;
        
        // Update active menu item
        document.querySelectorAll('.sidebar-menu a').forEach(link => {
            link.classList.remove('active');
        });
        e.target.closest('a').classList.add('active');
        
        this.showPage(page);
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    showPage(pageId) {
        // Update page title
        const titles = {
            'dashboard': 'Dashboard',
            'customers': 'Clientes',
            'whatsapp': 'WhatsApp',
            'workflows': 'Workflows',
            'payments': 'Pagamentos',
            'agents': 'Agentes',
            'settings': 'Configurações'
        };
        
        document.getElementById('pageTitle').textContent = titles[pageId] || 'Dashboard';
        
        // Show page content
        document.querySelectorAll('.page-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(pageId + 'Content').classList.add('active');
        
        // Load page-specific data
        switch(pageId) {
            case 'customers':
                this.renderCustomers();
                break;
            case 'workflows':
                this.renderWorkflows();
                break;
            case 'payments':
                this.renderPayments();
                break;
            case 'agents':
                this.renderAgents();
                break;
        }
    }

    updateStats() {
        document.getElementById('totalCustomers').textContent = this.customers.length;
        document.getElementById('whatsappMessages').textContent = this.whatsappConnected ? Math.floor(Math.random() * 100) + 50 : 0;
        document.getElementById('activeWorkflows').textContent = this.workflows.filter(w => w.status === 'active').length;
        
        const totalRevenue = this.payments
            .filter(p => p.status === 'paid')
            .reduce((sum, p) => sum + p.amount, 0);
        document.getElementById('totalRevenue').textContent = `R$ ${totalRevenue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    }

    renderCustomers() {
        const tbody = document.querySelector('#customersTable tbody');
        tbody.innerHTML = '';
        
        this.customers.forEach(customer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td><span class="status ${customer.status}">${customer.status === 'active' ? 'Ativo' : 'Inativo'}</span></td>
                <td>
                    <button class="btn btn-secondary" onclick="crm.editCustomer(${customer.id})">Editar</button>
                    <button class="btn btn-danger" onclick="crm.deleteCustomer(${customer.id})">Excluir</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    renderWorkflows() {
        const grid = document.getElementById('workflowsGrid');
        grid.innerHTML = '';
        
        this.workflows.forEach(workflow => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>${workflow.name}</h3>
                <p>${workflow.description}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                    <span class="status ${workflow.status}">${workflow.status === 'active' ? 'Ativo' : 'Pausado'}</span>
                    <span style="color: #7f8c8d; font-size: 14px;">${workflow.executions} execuções</span>
                </div>
                <div style="margin-top: 15px;">
                    <button class="btn btn-secondary" onclick="crm.editWorkflow(${workflow.id})">Editar</button>
                    <button class="btn ${workflow.status === 'active' ? 'btn-secondary' : 'btn-primary'}" 
                            onclick="crm.toggleWorkflow(${workflow.id})">
                        ${workflow.status === 'active' ? 'Pausar' : 'Ativar'}
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    renderPayments() {
        const tbody = document.querySelector('#paymentsTable tbody');
        tbody.innerHTML = '';
        
        this.payments.forEach(payment => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${payment.customerName}</td>
                <td>R$ ${payment.amount.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                <td><span class="status ${payment.status}">${this.getPaymentStatusLabel(payment.status)}</span></td>
                <td>${payment.date.toLocaleDateString('pt-BR')}</td>
                <td>
                    <button class="btn btn-secondary" onclick="crm.viewPayment(${payment.id})">Ver</button>
                    ${payment.status === 'pending' ? '<button class="btn btn-primary" onclick="crm.processPayment(' + payment.id + ')">Processar</button>' : ''}
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    renderAgents() {
        const grid = document.getElementById('agentsGrid');
        grid.innerHTML = '';
        
        this.agents.forEach(agent => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>${agent.name}</h3>
                <p>${agent.description}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                    <span class="status ${agent.status}">${agent.status === 'active' ? 'Ativo' : 'Inativo'}</span>
                    <span style="color: #7f8c8d; font-size: 14px;">${agent.conversations} conversas</span>
                </div>
                <div style="margin-top: 15px;">
                    <button class="btn btn-secondary" onclick="crm.configureAgent(${agent.id})">Configurar</button>
                    <button class="btn ${agent.status === 'active' ? 'btn-secondary' : 'btn-primary'}" 
                            onclick="crm.toggleAgent(${agent.id})">
                        ${agent.status === 'active' ? 'Desativar' : 'Ativar'}
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    handleAddCustomer(e) {
        e.preventDefault();
        
        const name = document.getElementById('customerName').value;
        const email = document.getElementById('customerEmail').value;
        const phone = document.getElementById('customerPhone').value;
        const company = document.getElementById('customerCompany').value;
        
        const newCustomer = {
            id: Date.now(),
            name,
            email,
            phone,
            company,
            status: 'active',
            createdAt: new Date()
        };
        
        this.customers.push(newCustomer);
        this.closeModals();
        this.renderCustomers();
        this.updateStats();
        this.showNotification('Cliente adicionado com sucesso!', 'success');
        
        document.getElementById('customerForm').reset();
    }

    // Utility methods
    getPaymentStatusLabel(status) {
        const labels = {
            'paid': 'Pago',
            'pending': 'Pendente',
            'failed': 'Falhou'
        };
        return labels[status] || status;
    }

    showNotification(message, type = 'info') {
        // Simple notification system
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

    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    // Action methods
    connectWhatsApp() {
        document.getElementById('whatsappStatus').textContent = 'Conectando...';
        document.getElementById('qrcode').style.display = 'block';
        
        setTimeout(() => {
            this.whatsappConnected = true;
            document.getElementById('whatsappStatus').textContent = 'Conectado';
            document.getElementById('qrcode').style.display = 'none';
            this.updateStats();
            this.showNotification('WhatsApp conectado com sucesso!', 'success');
        }, 3000);
    }

    editCustomer(id) {
        this.showNotification('Funcionalidade de edição em desenvolvimento', 'info');
    }

    deleteCustomer(id) {
        if (confirm('Tem certeza que deseja excluir este cliente?')) {
            this.customers = this.customers.filter(c => c.id !== id);
            this.renderCustomers();
            this.updateStats();
            this.showNotification('Cliente excluído com sucesso!', 'success');
        }
    }

    toggleWorkflow(id) {
        const workflow = this.workflows.find(w => w.id === id);
        if (workflow) {
            workflow.status = workflow.status === 'active' ? 'paused' : 'active';
            this.renderWorkflows();
            this.updateStats();
            this.showNotification(`Workflow ${workflow.status === 'active' ? 'ativado' : 'pausado'}!`, 'success');
        }
    }

    toggleAgent(id) {
        const agent = this.agents.find(a => a.id === id);
        if (agent) {
            agent.status = agent.status === 'active' ? 'inactive' : 'active';
            this.renderAgents();
            this.showNotification(`Agente ${agent.status === 'active' ? 'ativado' : 'desativado'}!`, 'success');
        }
    }

    processPayment(id) {
        const payment = this.payments.find(p => p.id === id);
        if (payment) {
            payment.status = 'paid';
            this.renderPayments();
            this.updateStats();
            this.showNotification('Pagamento processado com sucesso!', 'success');
        }
    }
}

// Global functions for HTML onclick events
function openAddCustomerModal() {
    document.getElementById('customerModal').style.display = 'block';
}

function openAddWorkflowModal() {
    crm.showNotification('Modal de criação de workflow em desenvolvimento', 'info');
}

function openPaymentModal() {
    crm.showNotification('Modal de pagamento em desenvolvimento', 'info');
}

function openAddAgentModal() {
    crm.showNotification('Modal de criação de agente em desenvolvimento', 'info');
}

// Initialize CRM system
let crm;
document.addEventListener('DOMContentLoaded', () => {
    crm = new CRMSystem();
});

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}
