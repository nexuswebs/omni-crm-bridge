// Function to open the customer creation modal
function openCustomerModal() {
    document.getElementById('customerModal').style.display = 'block';
}

// Function to close the customer creation modal
function closeCustomerModal() {
    document.getElementById('customerModal').style.display = 'none';
}

// Function to save the customer data
function saveCustomer() {
    const customerName = document.getElementById('customerName').value;
    const customerEmail = document.getElementById('customerEmail').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const customerAddress = document.getElementById('customerAddress').value;
    const customerCity = document.getElementById('customerCity').value;
    const customerState = document.getElementById('customerState').value;
    const customerZip = document.getElementById('customerZip').value;
    const customerNotes = document.getElementById('customerNotes').value;

    // Validate required fields
    if (!customerName || !customerEmail || !customerPhone) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    // Create a customer object
    const customer = {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        address: customerAddress,
        city: customerCity,
        state: customerState,
        zip: customerZip,
        notes: customerNotes
    };

    // Send the customer data to the server
    fetch('data.php?action=create_customer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(customer)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Cliente criado com sucesso!');
            closeCustomerModal();
            loadCustomers(); // Reload the customer list
        } else {
            alert('Erro ao criar cliente: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao criar cliente.');
    });
    
    // After saving customer, trigger integrations
    const customerData = {
        name: document.getElementById('customerName').value,
        email: document.getElementById('customerEmail').value,
        phone: document.getElementById('customerPhone').value,
        address: document.getElementById('customerAddress').value,
        city: document.getElementById('customerCity').value,
        state: document.getElementById('customerState').value,
        zip: document.getElementById('customerZip').value,
        notes: document.getElementById('customerNotes').value
    };
    
    // Trigger n8n workflow for new customer (if configured)
    triggerNewCustomerWorkflow(customerData);
}

// Function to load customers from the server
function loadCustomers() {
    fetch('data.php?action=get_customers')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const customerList = document.getElementById('customerList');
            customerList.innerHTML = ''; // Clear existing list

            data.customers.forEach(customer => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    ${customer.name} - ${customer.email} - ${customer.phone}
                    <button onclick="openEditCustomerModal(${customer.id})">Editar</button>
                    <button onclick="deleteCustomer(${customer.id})">Excluir</button>
                `;
                customerList.appendChild(listItem);
            });
        } else {
            alert('Erro ao carregar clientes: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao carregar clientes.');
    });
}

// Function to open the edit customer modal
function openEditCustomerModal(customerId) {
    // Fetch customer data and populate the edit modal
    fetch(`data.php?action=get_customer&id=${customerId}`)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const customer = data.customer;
            document.getElementById('editCustomerId').value = customer.id;
            document.getElementById('editCustomerName').value = customer.name;
            document.getElementById('editCustomerEmail').value = customer.email;
            document.getElementById('editCustomerPhone').value = customer.phone;
            document.getElementById('editCustomerAddress').value = customer.address || '';
            document.getElementById('editCustomerCity').value = customer.city || '';
            document.getElementById('editCustomerState').value = customer.state || '';
            document.getElementById('editCustomerZip').value = customer.zip || '';
            document.getElementById('editCustomerNotes').value = customer.notes || '';

            document.getElementById('editCustomerModal').style.display = 'block';
        } else {
            alert('Erro ao carregar cliente: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao carregar cliente.');
    });
}

// Function to close the edit customer modal
function closeEditCustomerModal() {
    document.getElementById('editCustomerModal').style.display = 'none';
}

// Function to update the customer data
function updateCustomer() {
    const customerId = document.getElementById('editCustomerId').value;
    const customerName = document.getElementById('editCustomerName').value;
    const customerEmail = document.getElementById('editCustomerEmail').value;
    const customerPhone = document.getElementById('editCustomerPhone').value;
    const customerAddress = document.getElementById('editCustomerAddress').value;
    const customerCity = document.getElementById('editCustomerCity').value;
    const customerState = document.getElementById('editCustomerState').value;
    const customerZip = document.getElementById('editCustomerZip').value;
    const customerNotes = document.getElementById('editCustomerNotes').value;

    // Validate required fields
    if (!customerName || !customerEmail || !customerPhone) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    // Create a customer object
    const customer = {
        id: customerId,
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        address: customerAddress,
        city: customerCity,
        state: customerState,
        zip: customerZip,
        notes: customerNotes
    };

    // Send the updated customer data to the server
    fetch('data.php?action=update_customer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(customer)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Cliente atualizado com sucesso!');
            closeEditCustomerModal();
            loadCustomers(); // Reload the customer list
        } else {
            alert('Erro ao atualizar cliente: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao atualizar cliente.');
    });
}

// Function to delete a customer
function deleteCustomer(customerId) {
    if (confirm('Tem certeza de que deseja excluir este cliente?')) {
        fetch(`data.php?action=delete_customer&id=${customerId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Cliente excluído com sucesso!');
                loadCustomers(); // Reload the customer list
            } else {
                alert('Erro ao excluir cliente: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao excluir cliente.');
        });
    }
}

// Function to open the message modal
function openMessageModal() {
    // Load customers into the message modal's select element
    fetch('data.php?action=get_customers')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const messageCustomerSelect = document.getElementById('messageCustomer');
            messageCustomerSelect.innerHTML = ''; // Clear existing options

            data.customers.forEach(customer => {
                const option = document.createElement('option');
                option.value = customer.phone; // Use phone as the identifier
                option.text = `${customer.name} - ${customer.phone}`;
                messageCustomerSelect.appendChild(option);
            });

            document.getElementById('messageModal').style.display = 'block';
        } else {
            alert('Erro ao carregar clientes: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao carregar clientes.');
    });
}

// Function to close the message modal
function closeMessageModal() {
    document.getElementById('messageModal').style.display = 'none';
}

// Function to send a message
function sendMessage() {
    const messageCustomer = document.getElementById('messageCustomer').value;
    const messageContent = document.getElementById('messageContent').value;

    // Validate required fields
    if (!messageCustomer || !messageContent) {
        alert('Por favor, selecione um cliente e preencha o conteúdo da mensagem.');
        return;
    }

    // Create a message object
    const message = {
        customer: messageCustomer,
        content: messageContent
    };

    // Send the message data to the server
    fetch('data.php?action=create_message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Mensagem enviada com sucesso!');
            closeMessageModal();
            loadMessages(); // Reload the message list
        } else {
            alert('Erro ao enviar mensagem: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao enviar mensagem.');
    });
    
    // After saving message, try to send via Evolution API
    const messageData = {
        customerPhone: document.getElementById('messageCustomer').value,
        content: document.getElementById('messageContent').value,
        instanceName: 'crm-instance' // Default instance
    };
    
    sendMessageViaEvolution(messageData);
}

// Function to load messages from the server
function loadMessages() {
    fetch('data.php?action=get_messages')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const messageList = document.getElementById('messageList');
            messageList.innerHTML = ''; // Clear existing list

            data.messages.forEach(message => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    ${message.customer} - ${message.content} - ${message.timestamp}
                `;
                messageList.appendChild(listItem);
            });
        } else {
            alert('Erro ao carregar mensagens: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao carregar mensagens.');
    });
}

// Function to open the payment modal
function openPaymentModal() {
    // Load customers into the payment modal's select element
    fetch('data.php?action=get_customers')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const paymentCustomerSelect = document.getElementById('paymentCustomer');
            paymentCustomerSelect.innerHTML = ''; // Clear existing options

            data.customers.forEach(customer => {
                const option = document.createElement('option');
                option.value = customer.id; // Use customer ID as the identifier
                option.text = `${customer.name} - ${customer.email} - ${customer.phone}`;
                paymentCustomerSelect.appendChild(option);
            });

            document.getElementById('paymentModal').style.display = 'block';
        } else {
            alert('Erro ao carregar clientes: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao carregar clientes.');
    });
}

// Function to close the payment modal
function closePaymentModal() {
    document.getElementById('paymentModal').style.display = 'none';
}

// Function to create a payment
function createPayment(type, amount, description, customerId = null) {
    const paymentAmount = document.getElementById('paymentAmount').value;
    const paymentDescription = document.getElementById('paymentDescription').value;
    const paymentCustomer = document.getElementById('paymentCustomer').value;

    // Validate required fields
    if (!paymentAmount || !paymentDescription) {
        alert('Por favor, preencha o valor e a descrição do pagamento.');
        return;
    }

    // Create a payment object
    const payment = {
        amount: paymentAmount,
        description: paymentDescription,
        customer_id: paymentCustomer || null, // Use customer ID
        method: type // Payment method (e.g., "credit_card", "paypal")
    };

    // Send the payment data to the server
    fetch('data.php?action=create_payment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payment)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Pagamento criado com sucesso!');
            closePaymentModal();
            loadPayments(); // Reload the payment list
        } else {
            alert('Erro ao criar pagamento: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao criar pagamento.');
    });
    
    // After creating payment, trigger webhook notification
    const paymentData = {
        type: type,
        amount: amount,
        description: description,
        customerId: customerId,
        timestamp: new Date().toISOString()
    };
    
    triggerPaymentWebhook(paymentData);
}

// Function to load payments from the server
function loadPayments() {
    fetch('data.php?action=get_payments')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const paymentList = document.getElementById('paymentList');
            paymentList.innerHTML = ''; // Clear existing list

            data.payments.forEach(payment => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    ${payment.amount} - ${payment.description} - ${payment.timestamp}
                `;
                paymentList.appendChild(listItem);
            });
        } else {
            alert('Erro ao carregar pagamentos: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao carregar pagamentos.');
    });
}

// Function to open the task modal
function openTaskModal() {
    // Load customers into the task modal's select element
    fetch('data.php?action=get_customers')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const taskCustomerSelect = document.getElementById('taskCustomer');
            taskCustomerSelect.innerHTML = ''; // Clear existing options

            data.customers.forEach(customer => {
                const option = document.createElement('option');
                option.value = customer.id; // Use customer ID as the identifier
                option.text = `${customer.name} - ${customer.email} - ${customer.phone}`;
                taskCustomerSelect.appendChild(option);
            });

            document.getElementById('taskModal').style.display = 'block';
        } else {
            alert('Erro ao carregar clientes: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao carregar clientes.');
    });
}

// Function to close the task modal
function closeTaskModal() {
    document.getElementById('taskModal').style.display = 'none';
}

// Function to create a task
function createTask() {
    const taskTitle = document.getElementById('taskTitle').value;
    const taskDescription = document.getElementById('taskDescription').value;
    const taskDueDate = document.getElementById('taskDueDate').value;
    const taskCustomer = document.getElementById('taskCustomer').value;

    // Validate required fields
    if (!taskTitle || !taskDescription || !taskDueDate) {
        alert('Por favor, preencha o título, a descrição e a data de vencimento da tarefa.');
        return;
    }

    // Create a task object
    const task = {
        title: taskTitle,
        description: taskDescription,
        due_date: taskDueDate,
        customer_id: taskCustomer || null // Use customer ID
    };

    // Send the task data to the server
    fetch('data.php?action=create_task', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Tarefa criada com sucesso!');
            closeTaskModal();
            loadTasks(); // Reload the task list
        } else {
            alert('Erro ao criar tarefa: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao criar tarefa.');
    });
}

// Function to load tasks from the server
function loadTasks() {
    fetch('data.php?action=get_tasks')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = ''; // Clear existing list

            data.tasks.forEach(task => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    ${task.title} - ${task.description} - ${task.due_date}
                `;
                taskList.appendChild(listItem);
            });
        } else {
            alert('Erro ao carregar tarefas: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao carregar tarefas.');
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadCustomers();
    loadMessages();
    loadPayments();
    loadTasks();
});

// Adicionar funções para integrações
function openIntegrationsSettings() {
    window.open('integrations_settings.html', '_blank');
}

// Add integration settings button to main menu
document.addEventListener('DOMContentLoaded', function() {
    // Get the sidebar element
    const sidebar = document.querySelector('.sidebar ul');

    // Check if the sidebar exists
    if (sidebar) {
        // Create a new list item for the integrations settings
        const integrationsItem = document.createElement('li');
        integrationsItem.innerHTML = `
            <a href="#" onclick="openIntegrationsSettings()">
                <i class="fas fa-plug"></i>
                <span>Integrações</span>
            </a>
        `;

        // Append the new list item to the sidebar
        sidebar.appendChild(integrationsItem);
    }
    
    // Add integrations button to sidebar if it doesn't exist
    const sidebar = document.querySelector('.sidebar ul');
    if (sidebar && !document.querySelector('[onclick="openIntegrationsSettings()"]')) {
        const integrationsItem = document.createElement('li');
        integrationsItem.innerHTML = `
            <a href="#" onclick="openIntegrationsSettings()">
                <i class="fas fa-plug"></i>
                <span>Integrações</span>
                <div class="integration-indicators">
                    <span class="integration-indicator" data-integration="evolution" title="Evolution API"></span>
                    <span class="integration-indicator" data-integration="n8n" title="n8n.cloud"></span>
                    <span class="integration-indicator" data-integration="webhooks" title="Webhooks"></span>
                </div>
            </a>
        `;
        sidebar.appendChild(integrationsItem);
    }
});

// Evolution API Integration Functions
async function sendEvolutionMessage(instanceName, number, message) {
    try {
        const response = await fetch('evolution_api.php?action=send_message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                instanceName: instanceName,
                number: number,
                message: message
            })
        });

        const result = await response.json();
        
        if (result.success) {
            console.log('Mensagem enviada via Evolution API:', result);
            return result;
        } else {
            throw new Error(result.error || 'Erro ao enviar mensagem');
        }
    } catch (error) {
        console.error('Erro ao enviar mensagem Evolution:', error);
        throw error;
    }
}

// n8n Integration Functions
async function executeN8nWorkflowFromCRM(workflowId, inputData = {}) {
    try {
        const response = await fetch('n8n_api.php?action=execute_workflow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                workflowId: workflowId,
                inputData: inputData
            })
        });

        const result = await response.json();
        
        if (result.success) {
            console.log('Workflow n8n executado:', result);
            return result;
        } else {
            throw new Error(result.error || 'Erro ao executar workflow');
        }
    } catch (error) {
        console.error('Erro ao executar workflow n8n:', error);
        throw error;
    }
}

// Enhanced Customer Functions with Integration
function saveCustomer() {
    const customerName = document.getElementById('customerName').value;
    const customerEmail = document.getElementById('customerEmail').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const customerAddress = document.getElementById('customerAddress').value;
    const customerCity = document.getElementById('customerCity').value;
    const customerState = document.getElementById('customerState').value;
    const customerZip = document.getElementById('customerZip').value;
    const customerNotes = document.getElementById('customerNotes').value;

    // Validate required fields
    if (!customerName || !customerEmail || !customerPhone) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    // Create a customer object
    const customer = {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        address: customerAddress,
        city: customerCity,
        state: customerState,
        zip: customerZip,
        notes: customerNotes
    };

    // Send the customer data to the server
    fetch('data.php?action=create_customer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(customer)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Cliente criado com sucesso!');
            closeCustomerModal();
            loadCustomers(); // Reload the customer list
        } else {
            alert('Erro ao criar cliente: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao criar cliente.');
    });
    
    // After saving customer, trigger integrations
    const customerData = {
        name: document.getElementById('customerName').value,
        email: document.getElementById('customerEmail').value,
        phone: document.getElementById('customerPhone').value,
        address: document.getElementById('customerAddress').value,
        city: document.getElementById('customerCity').value,
        state: document.getElementById('customerState').value,
        zip: document.getElementById('customerZip').value,
        notes: document.getElementById('customerNotes').value
    };
    
    // Trigger n8n workflow for new customer (if configured)
    triggerNewCustomerWorkflow(customerData);
}

async function triggerNewCustomerWorkflow(customerData) {
    try {
        // Check if n8n is configured and has a new customer workflow
        const response = await fetch('api_config.php?action=n8n');
        const config = await response.json();
        
        if (config && config.n8nUrl && config.apiKey) {
            // Try to execute a predefined workflow for new customers
            await executeN8nWorkflowFromCRM('new-customer-workflow', customerData);
        }
    } catch (error) {
        console.log('N8n workflow not configured or failed:', error);
        // Don't show error to user, just log it
    }
}

// Enhanced Message Functions
function sendMessage() {
    const messageCustomer = document.getElementById('messageCustomer').value;
    const messageContent = document.getElementById('messageContent').value;

    // Validate required fields
    if (!messageCustomer || !messageContent) {
        alert('Por favor, selecione um cliente e preencha o conteúdo da mensagem.');
        return;
    }

    // Create a message object
    const message = {
        customer: messageCustomer,
        content: messageContent
    };

    // Send the message data to the server
    fetch('data.php?action=create_message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Mensagem enviada com sucesso!');
            closeMessageModal();
            loadMessages(); // Reload the message list
        } else {
            alert('Erro ao enviar mensagem: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao enviar mensagem.');
    });
    
    // After saving message, try to send via Evolution API
    const messageData = {
        customerPhone: document.getElementById('messageCustomer').value,
        content: document.getElementById('messageContent').value,
        instanceName: 'crm-instance' // Default instance
    };
    
    sendMessageViaEvolution(messageData);
}

async function sendMessageViaEvolution(messageData) {
    try {
        // Check if Evolution API is configured
        const response = await fetch('api_config.php?action=evolution');
        const config = await response.json();
        
        if (config && config.url && config.key) {
            // Send message via Evolution API
            await sendEvolutionMessage(
                messageData.instanceName,
                messageData.customerPhone,
                messageData.content
            );
        }
    } catch (error) {
        console.log('Evolution API not configured or failed:', error);
        // Don't show error to user, just log it
    }
}

// Payment Integration Enhancement
function createPayment(type, amount, description, customerId = null) {
    const paymentAmount = document.getElementById('paymentAmount').value;
    const paymentDescription = document.getElementById('paymentDescription').value;
    const paymentCustomer = document.getElementById('paymentCustomer').value;

    // Validate required fields
    if (!paymentAmount || !paymentDescription) {
        alert('Por favor, preencha o valor e a descrição do pagamento.');
        return;
    }

    // Create a payment object
    const payment = {
        amount: paymentAmount,
        description: paymentDescription,
        customer_id: paymentCustomer || null, // Use customer ID
        method: type // Payment method (e.g., "credit_card", "paypal")
    };

    // Send the payment data to the server
    fetch('data.php?action=create_payment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payment)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Pagamento criado com sucesso!');
            closePaymentModal();
            loadPayments(); // Reload the payment list
        } else {
            alert('Erro ao criar pagamento: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao criar pagamento.');
    });
    
    // After creating payment, trigger webhook notification
    const paymentData = {
        type: type,
        amount: amount,
        description: description,
        customerId: customerId,
        timestamp: new Date().toISOString()
    };
    
    triggerPaymentWebhook(paymentData);
}

async function triggerPaymentWebhook(paymentData) {
    try {
        // Check if payment webhook is configured
        const response = await fetch('api_config.php?action=webhooks');
        const config = await response.json();
        
        if (config && config.paymentUrl) {
            // Send payment data to configured webhook
            await fetch(config.paymentUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData)
            });
        }
    } catch (error) {
        console.log('Payment webhook not configured or failed:', error);
    }
}

// Integration Status Check
async function checkIntegrationsStatus() {
    try {
        const response = await fetch('api_config.php?action=all');
        const configs = await response.json();
        
        const integrationStatus = {
            evolution: configs.evolution ? 'configured' : 'not_configured',
            n8n: configs.n8n ? 'configured' : 'not_configured',
            webhooks: configs.webhooks ? 'configured' : 'not_configured'
        };
        
        // Update UI indicators if they exist
        updateIntegrationIndicators(integrationStatus);
        
        return integrationStatus;
    } catch (error) {
        console.error('Erro ao verificar status das integrações:', error);
        return null;
    }
}

function updateIntegrationIndicators(status) {
    // Update any integration status indicators in the main interface
    Object.keys(status).forEach(integration => {
        const indicator = document.querySelector(`[data-integration="${integration}"]`);
        if (indicator) {
            indicator.className = `integration-indicator ${status[integration]}`;
        }
    });
}

// Initialize integrations check on page load
if (typeof window !== 'undefined') {
    window.addEventListener('load', function() {
        checkIntegrationsStatus();
    });
}
