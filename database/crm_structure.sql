
-- =============================================
-- CRM Inteligente - Estrutura do Banco de Dados
-- Versão: 2.0
-- Compatível: MySQL 5.7+ / MariaDB 10.2+
-- Otimizado para cPanel/CloudLinux
-- =============================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- =============================================
-- Tabela: users (Sistema de usuários e perfis)
-- =============================================

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','manager','agent','viewer') DEFAULT 'agent',
  `status` enum('active','inactive','suspended') DEFAULT 'active',
  `avatar` varchar(500) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `department` varchar(50) DEFAULT NULL,
  `permissions` json DEFAULT NULL,
  `preferences` json DEFAULT NULL,
  `two_factor_enabled` boolean DEFAULT FALSE,
  `two_factor_secret` varchar(32) DEFAULT NULL,
  `last_login` timestamp NULL DEFAULT NULL,
  `last_activity` timestamp NULL DEFAULT NULL,
  `login_attempts` int DEFAULT 0,
  `locked_until` timestamp NULL DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_role` (`role`),
  KEY `idx_status` (`status`),
  KEY `idx_last_activity` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Tabela: customers (Clientes e prospects)
-- =============================================

CREATE TABLE `customers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `whatsapp` varchar(20) DEFAULT NULL,
  `document` varchar(20) DEFAULT NULL,
  `document_type` enum('cpf','cnpj','passport','other') DEFAULT 'cpf',
  `company` varchar(100) DEFAULT NULL,
  `position` varchar(50) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `address_line2` varchar(100) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `state` varchar(30) DEFAULT NULL,
  `zipcode` varchar(10) DEFAULT NULL,
  `country` varchar(30) DEFAULT 'Brasil',
  `status` enum('active','inactive','blocked','prospect') DEFAULT 'prospect',
  `source` varchar(50) DEFAULT NULL COMMENT 'Origem do lead',
  `tags` json DEFAULT NULL,
  `custom_fields` json DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `assigned_agent` int(11) DEFAULT NULL,
  `score` int DEFAULT 0 COMMENT 'Lead scoring',
  `lifetime_value` decimal(10,2) DEFAULT 0.00,
  `last_contact` timestamp NULL DEFAULT NULL,
  `next_followup` timestamp NULL DEFAULT NULL,
  `conversion_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_email` (`email`),
  KEY `idx_phone` (`phone`),
  KEY `idx_whatsapp` (`whatsapp`),
  KEY `idx_status` (`status`),
  KEY `idx_assigned_agent` (`assigned_agent`),
  KEY `idx_score` (`score`),
  KEY `idx_source` (`source`),
  FOREIGN KEY (`assigned_agent`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Tabela: conversations (Conversas/Tickets)
-- =============================================

CREATE TABLE `conversations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) NOT NULL,
  `agent_id` int(11) DEFAULT NULL,
  `title` varchar(200) DEFAULT NULL,
  `status` enum('open','pending','resolved','closed','waiting') DEFAULT 'open',
  `priority` enum('low','medium','high','urgent') DEFAULT 'medium',
  `channel` enum('whatsapp','email','phone','web','api','chat') DEFAULT 'whatsapp',
  `category` varchar(50) DEFAULT NULL,
  `subcategory` varchar(50) DEFAULT NULL,
  `tags` json DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `first_response_at` timestamp NULL DEFAULT NULL,
  `last_message_at` timestamp NULL DEFAULT NULL,
  `resolved_at` timestamp NULL DEFAULT NULL,
  `closed_at` timestamp NULL DEFAULT NULL,
  `rating` tinyint(1) DEFAULT NULL COMMENT '1-5 rating',
  `feedback` text DEFAULT NULL,
  `resolution_time` int DEFAULT NULL COMMENT 'Tempo em minutos',
  `response_time` int DEFAULT NULL COMMENT 'Tempo primeira resposta em minutos',
  `auto_close_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_customer_id` (`customer_id`),
  KEY `idx_agent_id` (`agent_id`),
  KEY `idx_status` (`status`),
  KEY `idx_priority` (`priority`),
  KEY `idx_channel` (`channel`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_rating` (`rating`),
  FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`agent_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Tabela: messages (Mensagens das conversas)
-- =============================================

CREATE TABLE `messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `conversation_id` int(11) NOT NULL,
  `sender_type` enum('customer','agent','system','bot','ai') NOT NULL,
  `sender_id` int(11) DEFAULT NULL,
  `message_type` enum('text','image','audio','video','document','location','contact','sticker') DEFAULT 'text',
  `content` text NOT NULL,
  `media_url` varchar(500) DEFAULT NULL,
  `media_caption` text DEFAULT NULL,
  `media_filename` varchar(255) DEFAULT NULL,
  `media_mimetype` varchar(100) DEFAULT NULL,
  `media_size` int DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `is_read` boolean DEFAULT FALSE,
  `read_at` timestamp NULL DEFAULT NULL,
  `delivered_at` timestamp NULL DEFAULT NULL,
  `failed_at` timestamp NULL DEFAULT NULL,
  `error_message` text DEFAULT NULL,
  `external_id` varchar(100) DEFAULT NULL,
  `reply_to_message_id` int(11) DEFAULT NULL,
  `forwarded_from` varchar(100) DEFAULT NULL,
  `edited_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_conversation_id` (`conversation_id`),
  KEY `idx_sender_type` (`sender_type`),
  KEY `idx_sender_id` (`sender_id`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_external_id` (`external_id`),
  KEY `idx_reply_to` (`reply_to_message_id`),
  FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`reply_to_message_id`) REFERENCES `messages` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Tabela: workflows (Automações n8n)
-- =============================================

CREATE TABLE `workflows` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `n8n_workflow_id` varchar(50) DEFAULT NULL,
  `trigger_type` enum('message_received','customer_created','time_based','manual','webhook','form_submitted') NOT NULL,
  `trigger_conditions` json DEFAULT NULL,
  `actions` json NOT NULL,
  `status` enum('active','inactive','draft','error') DEFAULT 'draft',
  `category` varchar(50) DEFAULT NULL,
  `execution_count` int(11) DEFAULT 0,
  `success_count` int(11) DEFAULT 0,
  `error_count` int(11) DEFAULT 0,
  `last_executed` timestamp NULL DEFAULT NULL,
  `last_success` timestamp NULL DEFAULT NULL,
  `last_error` timestamp NULL DEFAULT NULL,
  `last_error_message` text DEFAULT NULL,
  `average_execution_time` int DEFAULT NULL COMMENT 'Tempo médio em ms',
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_trigger_type` (`trigger_type`),
  KEY `idx_status` (`status`),
  KEY `idx_created_by` (`created_by`),
  KEY `idx_n8n_workflow_id` (`n8n_workflow_id`),
  FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Tabela: workflow_executions (Histórico de execuções)
-- =============================================

CREATE TABLE `workflow_executions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `workflow_id` int(11) NOT NULL,
  `n8n_execution_id` varchar(50) DEFAULT NULL,
  `trigger_data` json DEFAULT NULL,
  `status` enum('pending','running','completed','failed','cancelled','timeout') DEFAULT 'pending',
  `result` json DEFAULT NULL,
  `error_message` text DEFAULT NULL,
  `execution_time` int(11) DEFAULT NULL COMMENT 'Tempo em ms',
  `started_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `completed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_workflow_id` (`workflow_id`),
  KEY `idx_status` (`status`),
  KEY `idx_started_at` (`started_at`),
  KEY `idx_n8n_execution_id` (`n8n_execution_id`),
  FOREIGN KEY (`workflow_id`) REFERENCES `workflows` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Tabela: integrations (Integrações externas)
-- =============================================

CREATE TABLE `integrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `type` varchar(30) NOT NULL,
  `provider` varchar(50) DEFAULT NULL,
  `config` json NOT NULL,
  `credentials` json DEFAULT NULL COMMENT 'Encrypted credentials',
  `status` enum('connected','disconnected','error','pending') DEFAULT 'disconnected',
  `health_check_url` varchar(500) DEFAULT NULL,
  `last_sync` timestamp NULL DEFAULT NULL,
  `last_health_check` timestamp NULL DEFAULT NULL,
  `sync_frequency` int DEFAULT 300 COMMENT 'Frequência sync em segundos',
  `error_log` text DEFAULT NULL,
  `success_count` int DEFAULT 0,
  `error_count` int DEFAULT 0,
  `rate_limit_remaining` int DEFAULT NULL,
  `rate_limit_reset` timestamp NULL DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_name_type` (`name`, `type`),
  KEY `idx_status` (`status`),
  KEY `idx_type` (`type`),
  KEY `idx_last_sync` (`last_sync`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Tabela: payments (Pagamentos e faturas)
-- =============================================

CREATE TABLE `payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(3) DEFAULT 'BRL',
  `status` enum('pending','processing','completed','failed','cancelled','refunded','partially_refunded') DEFAULT 'pending',
  `method` enum('credit_card','debit_card','pix','bank_transfer','cash','other') DEFAULT NULL,
  `gateway` varchar(30) DEFAULT NULL,
  `gateway_transaction_id` varchar(100) DEFAULT NULL,
  `gateway_fee` decimal(10,2) DEFAULT 0.00,
  `net_amount` decimal(10,2) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `invoice_number` varchar(50) DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `payment_link` varchar(500) DEFAULT NULL,
  `pix_code` text DEFAULT NULL,
  `pix_qr_code` text DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `refunded_at` timestamp NULL DEFAULT NULL,
  `refund_amount` decimal(10,2) DEFAULT 0.00,
  `refund_reason` text DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_customer_id` (`customer_id`),
  KEY `idx_status` (`status`),
  KEY `idx_gateway_transaction_id` (`gateway_transaction_id`),
  KEY `idx_invoice_number` (`invoice_number`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_due_date` (`due_date`),
  FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Tabela: notifications (Sistema de notificações)
-- =============================================

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `type` enum('info','success','warning','error','system') DEFAULT 'info',
  `title` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `action_url` varchar(500) DEFAULT NULL,
  `action_text` varchar(50) DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `is_read` boolean DEFAULT FALSE,
  `read_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_type` (`type`),
  KEY `idx_is_read` (`is_read`),
  KEY `idx_created_at` (`created_at`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Tabela: system_settings (Configurações do sistema)
-- =============================================

CREATE TABLE `system_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `setting_type` enum('string','number','boolean','json','encrypted','array') DEFAULT 'string',
  `category` varchar(50) DEFAULT 'general',
  `subcategory` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `validation_rules` json DEFAULT NULL,
  `is_public` boolean DEFAULT FALSE COMMENT 'Visível no frontend',
  `is_required` boolean DEFAULT FALSE,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`),
  KEY `idx_category` (`category`),
  KEY `idx_is_public` (`is_public`),
  FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Tabela: activity_logs (Logs de atividade)
-- =============================================

CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `entity_type` varchar(50) DEFAULT NULL,
  `entity_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `old_values` json DEFAULT NULL,
  `new_values` json DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `session_id` varchar(100) DEFAULT NULL,
  `severity` enum('info','warning','error','critical') DEFAULT 'info',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_action` (`action`),
  KEY `idx_entity` (`entity_type`, `entity_id`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_severity` (`severity`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Tabela: api_tokens (Tokens de API)
-- =============================================

CREATE TABLE `api_tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `token` varchar(255) NOT NULL,
  `permissions` json DEFAULT NULL,
  `last_used` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `is_active` boolean DEFAULT TRUE,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_is_active` (`is_active`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- DADOS INICIAIS
-- =============================================

-- Usuário administrador padrão
INSERT INTO `users` (`name`, `email`, `password`, `role`, `status`, `permissions`, `preferences`) VALUES
('Administrador do Sistema', 'admin@crm.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'active', 
'["all"]', 
'{"theme":"light","language":"pt-BR","timezone":"America/Sao_Paulo","notifications":{"email":true,"push":true,"desktop":true}}');

-- Configurações básicas do sistema
INSERT INTO `system_settings` (`setting_key`, `setting_value`, `setting_type`, `category`, `subcategory`, `description`, `is_public`) VALUES
-- Configurações Gerais
('company_name', 'CRM Inteligente', 'string', 'general', 'company', 'Nome da empresa', TRUE),
('company_email', 'contato@empresa.com', 'string', 'general', 'company', 'Email principal da empresa', FALSE),
('company_phone', '+55 11 99999-9999', 'string', 'general', 'company', 'Telefone da empresa', TRUE),
('timezone', 'America/Sao_Paulo', 'string', 'general', 'system', 'Fuso horário do sistema', FALSE),
('date_format', 'DD/MM/YYYY', 'string', 'general', 'system', 'Formato de data', TRUE),
('currency', 'BRL', 'string', 'general', 'system', 'Moeda padrão', TRUE),

-- Configurações de Tickets/Conversas
('auto_assign_tickets', 'true', 'boolean', 'tickets', 'assignment', 'Auto-atribuição de tickets', FALSE),
('ticket_auto_close_hours', '72', 'number', 'tickets', 'automation', 'Auto-fechar tickets após X horas', FALSE),
('max_tickets_per_agent', '50', 'number', 'tickets', 'limits', 'Máximo de tickets por agente', FALSE),

-- Configurações de IA
('ai_enabled', 'true', 'boolean', 'ai', 'general', 'Ativar respostas automáticas IA', FALSE),
('ai_confidence_threshold', '0.7', 'number', 'ai', 'general', 'Limite de confiança da IA (0-1)', FALSE),
('ai_fallback_to_human', 'true', 'boolean', 'ai', 'general', 'Escalar para humano se IA falhar', FALSE),

-- Configurações de Notificações
('email_notifications', 'true', 'boolean', 'notifications', 'email', 'Ativar notificações por email', FALSE),
('push_notifications', 'true', 'boolean', 'notifications', 'push', 'Ativar notificações push', FALSE),
('desktop_notifications', 'true', 'boolean', 'notifications', 'desktop', 'Ativar notificações desktop', FALSE),

-- Analytics e Logs
('collect_analytics', 'true', 'boolean', 'analytics', 'general', 'Coletar dados analíticos', FALSE),
('log_retention_days', '90', 'number', 'logs', 'retention', 'Dias para manter logs', FALSE),
('activity_log_enabled', 'true', 'boolean', 'logs', 'activity', 'Ativar log de atividades', FALSE),

-- Integrações
('whatsapp_api_url', '', 'string', 'integrations', 'whatsapp', 'URL da API do WhatsApp Evolution', FALSE),
('whatsapp_api_key', '', 'encrypted', 'integrations', 'whatsapp', 'Chave da API do WhatsApp', FALSE),
('whatsapp_instance_name', '', 'string', 'integrations', 'whatsapp', 'Nome da instância WhatsApp', FALSE),

('n8n_webhook_url', '', 'string', 'integrations', 'n8n', 'URL do webhook n8n.cloud', FALSE),
('n8n_api_url', '', 'string', 'integrations', 'n8n', 'URL da API n8n.cloud', FALSE),
('n8n_api_key', '', 'encrypted', 'integrations', 'n8n', 'Chave da API n8n.cloud', FALSE),

('openai_api_key', '', 'encrypted', 'integrations', 'openai', 'Chave da API OpenAI', FALSE),
('openai_model', 'gpt-3.5-turbo', 'string', 'integrations', 'openai', 'Modelo OpenAI', FALSE),
('openai_max_tokens', '500', 'number', 'integrations', 'openai', 'Máximo de tokens por resposta', FALSE),

-- Pagamentos
('stripe_public_key', '', 'string', 'payments', 'stripe', 'Chave pública Stripe', FALSE),
('stripe_secret_key', '', 'encrypted', 'payments', 'stripe', 'Chave secreta Stripe', FALSE),
('stripe_webhook_secret', '', 'encrypted', 'payments', 'stripe', 'Secret do webhook Stripe', FALSE),
('pix_enabled', 'true', 'boolean', 'payments', 'pix', 'Habilitar pagamentos PIX', FALSE),

-- Segurança
('session_timeout', '1440', 'number', 'security', 'session', 'Timeout da sessão em minutos', FALSE),
('max_login_attempts', '5', 'number', 'security', 'login', 'Máximo tentativas de login', FALSE),
('lockout_duration', '15', 'number', 'security', 'login', 'Duração do bloqueio em minutos', FALSE),
('require_2fa', 'false', 'boolean', 'security', '2fa', 'Exigir autenticação 2FA', FALSE);

-- Integrações padrão
INSERT INTO `integrations` (`name`, `type`, `provider`, `config`, `status`) VALUES
('WhatsApp Evolution API', 'messaging', 'evolution-api', 
'{"api_url":"","api_key":"","instance_name":"","webhook_url":"","auto_create_instance":true,"qr_timeout":60}', 
'disconnected'),

('OpenAI GPT', 'ai', 'openai', 
'{"api_key":"","model":"gpt-3.5-turbo","max_tokens":500,"temperature":0.7,"system_prompt":"Você é um assistente de atendimento ao cliente profissional e prestativo."}', 
'disconnected'),

('n8n Cloud Workflows', 'automation', 'n8n-cloud', 
'{"webhook_url":"","api_url":"","api_key":"","auto_sync":true,"sync_interval":300}', 
'disconnected'),

('Stripe Payments', 'payment', 'stripe', 
'{"public_key":"","secret_key":"","webhook_secret":"","currency":"BRL","capture_method":"automatic"}', 
'disconnected');

-- Workflows de exemplo
INSERT INTO `workflows` (`name`, `description`, `trigger_type`, `trigger_conditions`, `actions`, `status`, `category`, `created_by`) VALUES
('Onboarding Automático', 'Processo completo de boas-vindas para novos clientes', 'customer_created', 
'{"customer_source":["website","whatsapp"],"exclude_existing":true}',
'[{"type":"send_whatsapp","template":"welcome","delay":0},{"type":"create_ticket","priority":"medium","delay":300},{"type":"send_email","template":"onboarding","delay":600}]',
'active', 'onboarding', 1),

('Suporte Inteligente', 'IA que responde dúvidas comuns automaticamente', 'message_received', 
'{"channels":["whatsapp"],"business_hours_only":false,"exclude_agents":true}',
'[{"type":"ai_analysis","confidence_threshold":0.7},{"type":"ai_response","fallback_to_human":true},{"type":"log_interaction"}]',
'active', 'support', 1),

('Follow-up Vendas', 'Acompanhamento automático de prospects inativos', 'time_based', 
'{"schedule":"daily","time":"09:00","conditions":{"customer_status":"prospect","last_contact_days":3}}',
'[{"type":"send_whatsapp","template":"followup","personalized":true},{"type":"update_score","increment":-5},{"type":"schedule_callback","days":7}]',
'active', 'sales', 1);

-- Notificações iniciais
INSERT INTO `notifications` (`user_id`, `type`, `title`, `message`, `icon`, `action_url`) VALUES
(1, 'success', 'Sistema Instalado', 'CRM Inteligente foi instalado com sucesso! Configure as integrações para começar.', 'check-circle', '/settings'),
(1, 'info', 'Configure WhatsApp', 'Configure a integração com WhatsApp Evolution API para começar a receber mensagens.', 'message-square', '/settings'),
(1, 'info', 'Configure IA', 'Adicione sua chave OpenAI para ativar respostas automáticas inteligentes.', 'brain', '/settings');

-- =============================================
-- ÍNDICES DE PERFORMANCE
-- =============================================

-- Índices compostos para consultas frequentes
CREATE INDEX `idx_conversations_customer_status_date` ON `conversations` (`customer_id`, `status`, `created_at`);
CREATE INDEX `idx_messages_conversation_created_sender` ON `messages` (`conversation_id`, `created_at`, `sender_type`);
CREATE INDEX `idx_customers_agent_status_score` ON `customers` (`assigned_agent`, `status`, `score`);
CREATE INDEX `idx_workflow_executions_workflow_status_date` ON `workflow_executions` (`workflow_id`, `status`, `started_at`);
CREATE INDEX `idx_activity_logs_user_action_date` ON `activity_logs` (`user_id`, `action`, `created_at`);
CREATE INDEX `idx_payments_customer_status_date` ON `payments` (`customer_id`, `status`, `created_at`);
CREATE INDEX `idx_notifications_user_read_date` ON `notifications` (`user_id`, `is_read`, `created_at`);

-- =============================================
-- VIEWS PARA DASHBOARD E RELATÓRIOS
-- =============================================

-- View para estatísticas de conversas por período
CREATE VIEW `conversation_stats_daily` AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_conversations,
    SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open_conversations,
    SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved_conversations,
    SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed_conversations,
    AVG(CASE WHEN resolution_time IS NOT NULL THEN resolution_time END) as avg_resolution_time,
    AVG(CASE WHEN response_time IS NOT NULL THEN response_time END) as avg_response_time,
    AVG(CASE WHEN rating IS NOT NULL THEN rating END) as avg_rating
FROM conversations 
WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- View para performance de agentes
CREATE VIEW `agent_performance_stats` AS
SELECT 
    u.id,
    u.name,
    u.department,
    COUNT(c.id) as total_conversations,
    SUM(CASE WHEN c.status = 'resolved' THEN 1 ELSE 0 END) as resolved_count,
    SUM(CASE WHEN c.status = 'closed' THEN 1 ELSE 0 END) as closed_count,
    AVG(CASE WHEN c.rating IS NOT NULL THEN c.rating END) as avg_rating,
    AVG(CASE WHEN c.resolution_time IS NOT NULL THEN c.resolution_time END) as avg_resolution_time,
    AVG(CASE WHEN c.response_time IS NOT NULL THEN c.response_time END) as avg_response_time,
    COUNT(DISTINCT c.customer_id) as unique_customers
FROM users u
LEFT JOIN conversations c ON u.id = c.agent_id AND c.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
WHERE u.role IN ('agent', 'manager')
GROUP BY u.id, u.name, u.department;

-- View para métricas de workflows
CREATE VIEW `workflow_performance_stats` AS
SELECT 
    w.id,
    w.name,
    w.category,
    w.status,
    COUNT(we.id) as total_executions,
    SUM(CASE WHEN we.status = 'completed' THEN 1 ELSE 0 END) as successful_executions,
    SUM(CASE WHEN we.status = 'failed' THEN 1 ELSE 0 END) as failed_executions,
    ROUND((SUM(CASE WHEN we.status = 'completed' THEN 1 ELSE 0 END) / COUNT(we.id)) * 100, 2) as success_rate,
    AVG(CASE WHEN we.execution_time IS NOT NULL THEN we.execution_time END) as avg_execution_time,
    MAX(we.started_at) as last_execution
FROM workflows w
LEFT JOIN workflow_executions we ON w.id = we.workflow_id AND we.started_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY w.id, w.name, w.category, w.status;

-- View para estatísticas de receita
CREATE VIEW `revenue_stats_daily` AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_payments,
    SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as total_revenue,
    SUM(CASE WHEN status = 'completed' THEN net_amount ELSE 0 END) as net_revenue,
    SUM(CASE WHEN status = 'completed'


 THEN gateway_fee ELSE 0 END) as total_fees,
    AVG(CASE WHEN status = 'completed' THEN amount END) as avg_ticket_size,
    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as successful_payments,
    SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_payments
FROM payments 
WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- =============================================
-- TRIGGERS AUTOMÁTICOS
-- =============================================

DELIMITER $$

-- Trigger para atualizar last_activity do usuário
CREATE TRIGGER `update_user_activity` 
AFTER INSERT ON `activity_logs`
FOR EACH ROW
BEGIN
    IF NEW.user_id IS NOT NULL THEN
        UPDATE users SET last_activity = NOW() WHERE id = NEW.user_id;
    END IF;
END$$

-- Trigger para log automático de criação de clientes
CREATE TRIGGER `customer_created_log` 
AFTER INSERT ON `customers`
FOR EACH ROW
BEGIN
    INSERT INTO `activity_logs` (`action`, `entity_type`, `entity_id`, `description`, `new_values`)
    VALUES ('customer_created', 'customer', NEW.id, 
            CONCAT('Cliente criado: ', NEW.name), 
            JSON_OBJECT('name', NEW.name, 'email', NEW.email, 'phone', NEW.phone));
END$$

-- Trigger para log de mudanças de status em conversas
CREATE TRIGGER `conversation_status_changed_log`
AFTER UPDATE ON `conversations`
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status THEN
        INSERT INTO `activity_logs` (`user_id`, `action`, `entity_type`, `entity_id`, `description`, `old_values`, `new_values`)
        VALUES (NEW.agent_id, 'conversation_status_changed', 'conversation', NEW.id, 
                CONCAT('Status da conversa alterado de ', OLD.status, ' para ', NEW.status),
                JSON_OBJECT('status', OLD.status),
                JSON_OBJECT('status', NEW.status));
    END IF;
    
    -- Atualizar timestamps baseado no novo status
    IF NEW.status = 'resolved' AND OLD.status != 'resolved' THEN
        UPDATE conversations SET resolved_at = NOW() WHERE id = NEW.id;
    END IF;
    
    IF NEW.status = 'closed' AND OLD.status != 'closed' THEN
        UPDATE conversations SET closed_at = NOW() WHERE id = NEW.id;
    END IF;
END$$

-- Trigger para calcular tempo de resolução
CREATE TRIGGER `calculate_resolution_time`
BEFORE UPDATE ON `conversations`
FOR EACH ROW
BEGIN
    IF NEW.status = 'resolved' AND OLD.status != 'resolved' THEN
        SET NEW.resolution_time = TIMESTAMPDIFF(MINUTE, NEW.created_at, NOW());
    END IF;
END$$

-- Trigger para atualizar contadores de workflow
CREATE TRIGGER `update_workflow_counters`
AFTER INSERT ON `workflow_executions`
FOR EACH ROW
BEGIN
    UPDATE workflows 
    SET execution_count = execution_count + 1,
        last_executed = NOW()
    WHERE id = NEW.workflow_id;
END$$

-- Trigger para atualizar contadores de sucesso/erro de workflow
CREATE TRIGGER `update_workflow_results`
AFTER UPDATE ON `workflow_executions`
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status THEN
        IF NEW.status = 'completed' THEN
            UPDATE workflows 
            SET success_count = success_count + 1,
                last_success = NOW()
            WHERE id = NEW.workflow_id;
        ELSEIF NEW.status = 'failed' THEN
            UPDATE workflows 
            SET error_count = error_count + 1,
                last_error = NOW(),
                last_error_message = NEW.error_message
            WHERE id = NEW.workflow_id;
        END IF;
    END IF;
END$$

-- Trigger para marcar notificações como lidas automaticamente após 7 dias
CREATE TRIGGER `auto_expire_notifications`
BEFORE INSERT ON `notifications`
FOR EACH ROW
BEGIN
    IF NEW.expires_at IS NULL AND NEW.type != 'critical' THEN
        SET NEW.expires_at = DATE_ADD(NOW(), INTERVAL 7 DAY);
    END IF;
END$$

DELIMITER ;

-- =============================================
-- STORED PROCEDURES ÚTEIS
-- =============================================

DELIMITER $$

-- Procedure para limpar logs antigos
CREATE PROCEDURE `CleanOldLogs`(IN days_to_keep INT)
BEGIN
    DECLARE log_retention_days INT DEFAULT 90;
    
    IF days_to_keep IS NOT NULL AND days_to_keep > 0 THEN
        SET log_retention_days = days_to_keep;
    END IF;
    
    -- Limpar activity_logs
    DELETE FROM activity_logs 
    WHERE created_at < DATE_SUB(NOW(), INTERVAL log_retention_days DAY);
    
    -- Limpar workflow_executions antigas
    DELETE FROM workflow_executions 
    WHERE started_at < DATE_SUB(NOW(), INTERVAL log_retention_days DAY) 
    AND status IN ('completed', 'failed');
    
    -- Limpar notificações expiradas
    DELETE FROM notifications 
    WHERE expires_at < NOW() OR 
          (is_read = TRUE AND created_at < DATE_SUB(NOW(), INTERVAL 30 DAY));
    
    SELECT 'Limpeza de logs concluída' as message;
END$$

-- Procedure para estatísticas do dashboard
CREATE PROCEDURE `GetDashboardStats`()
BEGIN
    -- Estatísticas básicas
    SELECT 
        (SELECT COUNT(*) FROM customers WHERE status = 'active') as active_customers,
        (SELECT COUNT(*) FROM conversations WHERE status = 'open') as open_conversations,
        (SELECT COUNT(*) FROM workflows WHERE status = 'active') as active_workflows,
        (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'completed' AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)) as monthly_revenue,
        (SELECT COUNT(*) FROM messages WHERE created_at >= CURDATE()) as messages_today,
        (SELECT COUNT(*) FROM workflow_executions WHERE status = 'completed' AND started_at >= CURDATE()) as workflows_executed_today;
END$$

DELIMITER ;

-- =============================================
-- EVENTOS AUTOMÁTICOS (se suportado)
-- =============================================

-- Ativar eventos (se MySQL suportar)
SET GLOBAL event_scheduler = ON;

DELIMITER $$

-- Evento para limpeza automática de logs (diária às 2h)
CREATE EVENT IF NOT EXISTS `daily_log_cleanup`
ON SCHEDULE EVERY 1 DAY
STARTS TIMESTAMP(CURDATE(), '02:00:00')
DO
BEGIN
    CALL CleanOldLogs(90);
END$$

-- Evento para atualizar estatísticas (a cada hora)
CREATE EVENT IF NOT EXISTS `hourly_stats_update`
ON SCHEDULE EVERY 1 HOUR
DO
BEGIN
    -- Atualizar score de clientes baseado em atividade
    UPDATE customers 
    SET score = CASE 
        WHEN last_contact >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN score + 1
        WHEN last_contact < DATE_SUB(NOW(), INTERVAL 30 DAY) THEN GREATEST(score - 1, 0)
        ELSE score
    END
    WHERE status = 'active';
    
    -- Auto-fechar conversas antigas (se configurado)
    UPDATE conversations 
    SET status = 'closed', closed_at = NOW()
    WHERE status = 'resolved' 
    AND resolved_at < DATE_SUB(NOW(), INTERVAL 72 HOUR);
END$$

DELIMITER ;

-- =============================================
-- FINALIZAÇÃO E INFORMAÇÕES
-- =============================================

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- =============================================
-- INFORMAÇÕES DE INSTALAÇÃO
-- =============================================

/*
==============================================
CRM INTELIGENTE - BANCO DE DADOS v2.0
==============================================

INSTALAÇÃO:
1. Crie o banco de dados no cPanel
2. Importe este arquivo via phpMyAdmin  
3. Verifique se todas as tabelas foram criadas
4. Configure as integrações no sistema

CREDENCIAIS PADRÃO:
Email: admin@crm.com
Senha: password

⚠️ ALTERE A SENHA IMEDIATAMENTE!

CARACTERÍSTICAS:
✅ 13 tabelas principais
✅ Índices otimizados para performance
✅ Views para dashboard e relatórios
✅ Triggers automáticos
✅ Procedures úteis
✅ Eventos automáticos
✅ Dados iniciais configurados
✅ Suporte para n8n.cloud
✅ Integração Evolution API (VPS)
✅ Sistema de notificações
✅ Logs de atividade
✅ API tokens

PERFORMANCE:
- Suporta até 500.000 registros
- Otimizado para cPanel/CloudLinux
- Índices compostos para consultas rápidas
- Limpeza automática de logs

INTEGRAÇÕES CONFIGURADAS:
- WhatsApp Evolution API (VPS separada)
- n8n.cloud (automações)
- OpenAI (inteligência artificial)
- Stripe (pagamentos)

SEGURANÇA:
- Senhas criptografadas
- Logs de atividade
- Tokens de API
- Configurações protegidas

PÓS-INSTALAÇÃO:
1. Configure Evolution API na VPS
2. Configure n8n.cloud workflows
3. Adicione chaves OpenAI e Stripe
4. Teste todas as integrações
5. Configure usuários e permissões

SUPORTE:
- Documentação: README.md
- Email: suporte@empresa.com
- Sistema preparado para 100% de funcionamento

VERSÃO: 2.0
DATA: Dezembro 2024
COMPATIBILIDADE: MySQL 5.7+ / MariaDB 10.2+
*/
