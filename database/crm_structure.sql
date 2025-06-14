
-- =============================================
-- CRM System Database Structure
-- Compatible with MySQL 5.7+ / MariaDB 10.2+
-- Optimized for cPanel/CloudLinux environments
-- =============================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

-- =============================================
-- Database Configuration
-- =============================================

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- =============================================
-- Table: users (Sistema de usuários)
-- =============================================

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','agent','manager') DEFAULT 'agent',
  `status` enum('active','inactive','suspended') DEFAULT 'active',
  `avatar` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `department` varchar(50) DEFAULT NULL,
  `permissions` json DEFAULT NULL,
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_role` (`role`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: customers (Clientes)
-- =============================================

CREATE TABLE `customers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `whatsapp` varchar(20) DEFAULT NULL,
  `document` varchar(20) DEFAULT NULL,
  `company` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `state` varchar(30) DEFAULT NULL,
  `zipcode` varchar(10) DEFAULT NULL,
  `country` varchar(30) DEFAULT 'Brasil',
  `status` enum('active','inactive','blocked') DEFAULT 'active',
  `tags` json DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `assigned_agent` int(11) DEFAULT NULL,
  `last_contact` timestamp NULL DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_email` (`email`),
  KEY `idx_phone` (`phone`),
  KEY `idx_whatsapp` (`whatsapp`),
  KEY `idx_status` (`status`),
  KEY `idx_assigned_agent` (`assigned_agent`),
  FOREIGN KEY (`assigned_agent`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: conversations (Conversas/Tickets)
-- =============================================

CREATE TABLE `conversations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) NOT NULL,
  `agent_id` int(11) DEFAULT NULL,
  `title` varchar(200) DEFAULT NULL,
  `status` enum('open','pending','resolved','closed') DEFAULT 'open',
  `priority` enum('low','medium','high','urgent') DEFAULT 'medium',
  `channel` enum('whatsapp','email','phone','web','api') DEFAULT 'whatsapp',
  `category` varchar(50) DEFAULT NULL,
  `tags` json DEFAULT NULL,
  `last_message_at` timestamp NULL DEFAULT NULL,
  `resolved_at` timestamp NULL DEFAULT NULL,
  `rating` tinyint(1) DEFAULT NULL,
  `feedback` text DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_customer_id` (`customer_id`),
  KEY `idx_agent_id` (`agent_id`),
  KEY `idx_status` (`status`),
  KEY `idx_priority` (`priority`),
  KEY `idx_channel` (`channel`),
  KEY `idx_created_at` (`created_at`),
  FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`agent_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: messages (Mensagens)
-- =============================================

CREATE TABLE `messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `conversation_id` int(11) NOT NULL,
  `sender_type` enum('customer','agent','system','bot') NOT NULL,
  `sender_id` int(11) DEFAULT NULL,
  `message_type` enum('text','image','audio','video','document','location') DEFAULT 'text',
  `content` text NOT NULL,
  `media_url` varchar(500) DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `is_read` boolean DEFAULT FALSE,
  `read_at` timestamp NULL DEFAULT NULL,
  `external_id` varchar(100) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_conversation_id` (`conversation_id`),
  KEY `idx_sender_type` (`sender_type`),
  KEY `idx_sender_id` (`sender_id`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_external_id` (`external_id`),
  FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: workflows (Automações/Workflows)
-- =============================================

CREATE TABLE `workflows` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `trigger_type` enum('message_received','customer_created','time_based','manual','webhook') NOT NULL,
  `trigger_conditions` json DEFAULT NULL,
  `actions` json NOT NULL,
  `status` enum('active','inactive','draft') DEFAULT 'draft',
  `category` varchar(50) DEFAULT NULL,
  `execution_count` int(11) DEFAULT 0,
  `last_executed` timestamp NULL DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_trigger_type` (`trigger_type`),
  KEY `idx_status` (`status`),
  KEY `idx_created_by` (`created_by`),
  FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: workflow_executions (Execuções de Workflow)
-- =============================================

CREATE TABLE `workflow_executions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `workflow_id` int(11) NOT NULL,
  `trigger_data` json DEFAULT NULL,
  `status` enum('pending','running','completed','failed','cancelled') DEFAULT 'pending',
  `result` json DEFAULT NULL,
  `error_message` text DEFAULT NULL,
  `execution_time` int(11) DEFAULT NULL,
  `started_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `completed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_workflow_id` (`workflow_id`),
  KEY `idx_status` (`status`),
  KEY `idx_started_at` (`started_at`),
  FOREIGN KEY (`workflow_id`) REFERENCES `workflows` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: integrations (Integrações)
-- =============================================

CREATE TABLE `integrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `type` varchar(30) NOT NULL,
  `config` json NOT NULL,
  `status` enum('connected','disconnected','error') DEFAULT 'disconnected',
  `last_sync` timestamp NULL DEFAULT NULL,
  `error_log` text DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_name_type` (`name`, `type`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: payments (Pagamentos)
-- =============================================

CREATE TABLE `payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(3) DEFAULT 'BRL',
  `status` enum('pending','processing','completed','failed','cancelled','refunded') DEFAULT 'pending',
  `method` varchar(50) DEFAULT NULL,
  `gateway` varchar(30) DEFAULT NULL,
  `transaction_id` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_customer_id` (`customer_id`),
  KEY `idx_status` (`status`),
  KEY `idx_transaction_id` (`transaction_id`),
  KEY `idx_created_at` (`created_at`),
  FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: system_settings (Configurações do Sistema)
-- =============================================

CREATE TABLE `system_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `setting_type` enum('string','number','boolean','json','encrypted') DEFAULT 'string',
  `category` varchar(50) DEFAULT 'general',
  `description` text DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`),
  KEY `idx_category` (`category`),
  FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: activity_logs (Logs de Atividade)
-- =============================================

CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `entity_type` varchar(50) DEFAULT NULL,
  `entity_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_action` (`action`),
  KEY `idx_entity` (`entity_type`, `entity_id`),
  KEY `idx_created_at` (`created_at`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Dados Iniciais
-- =============================================

-- Usuário administrador padrão
INSERT INTO `users` (`name`, `email`, `password`, `role`, `status`) VALUES
('Administrador', 'admin@crm.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'active');

-- Configurações básicas do sistema
INSERT INTO `system_settings` (`setting_key`, `setting_value`, `setting_type`, `category`, `description`) VALUES
('company_name', 'Minha Empresa CRM', 'string', 'general', 'Nome da empresa'),
('system_email', 'sistema@empresa.com', 'string', 'general', 'Email do sistema'),
('timezone', 'America/Sao_Paulo', 'string', 'general', 'Fuso horário'),
('auto_assign_tickets', 'true', 'boolean', 'tickets', 'Auto-atribuição de tickets'),
('ai_responses', 'true', 'boolean', 'ai', 'Respostas automáticas IA'),
('email_notifications', 'true', 'boolean', 'notifications', 'Notificações por email'),
('collect_analytics', 'true', 'boolean', 'analytics', 'Coletar dados analíticos'),
('whatsapp_api_url', '', 'string', 'integrations', 'URL da API do WhatsApp'),
('whatsapp_api_key', '', 'encrypted', 'integrations', 'Chave da API do WhatsApp'),
('openai_api_key', '', 'encrypted', 'integrations', 'Chave da API OpenAI'),
('n8n_webhook_url', '', 'string', 'integrations', 'URL do webhook n8n'),
('stripe_public_key', '', 'string', 'payments', 'Chave pública Stripe'),
('stripe_secret_key', '', 'encrypted', 'payments', 'Chave secreta Stripe');

-- Integrações padrão
INSERT INTO `integrations` (`name`, `type`, `config`, `status`) VALUES
('WhatsApp Evolution API', 'whatsapp', '{"api_url":"","api_key":"","instance_name":""}', 'disconnected'),
('OpenAI GPT', 'ai', '{"api_key":"","model":"gpt-3.5-turbo","max_tokens":500}', 'disconnected'),
('n8n Automation', 'automation', '{"webhook_url":"","api_key":""}', 'disconnected'),
('Stripe Payments', 'payment', '{"public_key":"","secret_key":"","webhook_secret":""}', 'disconnected');

-- =============================================
-- Índices de Performance
-- =============================================

-- Índices compostos para consultas frequentes
CREATE INDEX `idx_conversations_customer_status` ON `conversations` (`customer_id`, `status`);
CREATE INDEX `idx_messages_conversation_created` ON `messages` (`conversation_id`, `created_at`);
CREATE INDEX `idx_customers_agent_status` ON `customers` (`assigned_agent`, `status`);
CREATE INDEX `idx_workflow_executions_workflow_status` ON `workflow_executions` (`workflow_id`, `status`);

-- =============================================
-- Views para Dashboard
-- =============================================

-- View para estatísticas de conversas
CREATE VIEW `conversation_stats` AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_conversations,
    SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open_conversations,
    SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved_conversations,
    SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed_conversations
FROM conversations 
GROUP BY DATE(created_at);

-- View para performance de agentes
CREATE VIEW `agent_performance` AS
SELECT 
    u.id,
    u.name,
    COUNT(c.id) as total_conversations,
    AVG(CASE WHEN c.rating IS NOT NULL THEN c.rating END) as avg_rating,
    SUM(CASE WHEN c.status = 'resolved' THEN 1 ELSE 0 END) as resolved_count
FROM users u
LEFT JOIN conversations c ON u.id = c.agent_id
WHERE u.role IN ('agent', 'manager')
GROUP BY u.id, u.name;

-- =============================================
-- Triggers para Logs Automáticos
-- =============================================

DELIMITER $$

-- Trigger para log de criação de clientes
CREATE TRIGGER `customer_created_log` 
AFTER INSERT ON `customers`
FOR EACH ROW
BEGIN
    INSERT INTO `activity_logs` (`action`, `entity_type`, `entity_id`, `description`)
    VALUES ('customer_created', 'customer', NEW.id, CONCAT('Cliente criado: ', NEW.name));
END$$

-- Trigger para log de atualização de conversas
CREATE TRIGGER `conversation_updated_log`
AFTER UPDATE ON `conversations`
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status THEN
        INSERT INTO `activity_logs` (`user_id`, `action`, `entity_type`, `entity_id`, `description`)
        VALUES (NEW.agent_id, 'conversation_status_changed', 'conversation', NEW.id, 
                CONCAT('Status alterado de ', OLD.status, ' para ', NEW.status));
    END IF;
END$$

DELIMITER ;

-- =============================================
-- Finalização
-- =============================================

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- =============================================
-- Informações de Instalação
-- =============================================

/*
INSTRUÇÕES DE INSTALAÇÃO:

1. Acesse o phpMyAdmin no seu cPanel
2. Crie um novo banco de dados (ex: 'crm_database')
3. Selecione o banco criado
4. Clique em "Importar"
5. Selecione este arquivo SQL
6. Execute a importação

USUÁRIO PADRÃO:
- Email: admin@crm.com  
- Senha: password (altere imediatamente!)

CONFIGURAÇÕES PÓS-INSTALAÇÃO:
1. Altere a senha do administrador
2. Configure as integrações na aba Configurações
3. Ajuste as configurações do sistema conforme necessário

REQUISITOS:
- MySQL 5.7+ ou MariaDB 10.2+
- Pelo menos 100MB de espaço em disco
- Suporte a JSON (nativo no MySQL 5.7+)

PERFORMANCE:
- Banco otimizado para até 100.000 clientes
- Índices criados para consultas frequentes
- Views para dashboard em tempo real
*/
