
const fs = require('fs');
const path = require('path');

// Configurações que podem ser personalizadas antes do build
const buildConfig = {
  // Configurações de produção
  PRODUCTION_DOMAIN: process.env.PRODUCTION_DOMAIN || 'https://crm.seudominio.com',
  PRODUCTION_API_URL: process.env.PRODUCTION_API_URL || 'https://api.seudominio.com',
  
  // Configurações Evolution API
  EVOLUTION_API_URL: process.env.EVOLUTION_API_URL || 'https://api.redenexus.top',
  EVOLUTION_API_KEY: process.env.EVOLUTION_API_KEY || 'e5fe045f841bddf5406357ebea55ea2b',
  EVOLUTION_INSTANCE_NAME: process.env.EVOLUTION_INSTANCE_NAME || 'crm-instance',
  EVOLUTION_WEBHOOK_URL: process.env.EVOLUTION_WEBHOOK_URL || 'https://webhook.site/unique-id',
  
  // Configurações n8n
  N8N_URL: process.env.N8N_URL || 'https://app.n8n.cloud',
  N8N_API_KEY: process.env.N8N_API_KEY || '',
  N8N_WEBHOOK_URL: process.env.N8N_WEBHOOK_URL || '',
  
  // Configurações Supabase
  SUPABASE_URL: process.env.SUPABASE_URL || 'https://eirvcmzqbtkmoxquovsy.supabase.co',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpcnZjbXpxYnRrbW94cXVvdnN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5OTIzNzEsImV4cCI6MjA2NTU2ODM3MX0.pFTNDBbigWzm0pdWvuzQU9giujRVVSXU-tm8eXpl2ts'
};

// Função para atualizar o arquivo de configuração de produção
function updateProductionConfig() {
  const configPath = path.join(__dirname, 'src/config/production.ts');
  let configContent = fs.readFileSync(configPath, 'utf8');
  
  // Substituir valores no arquivo de configuração
  configContent = configContent
    .replace(/domain: '[^']*'/, `domain: '${buildConfig.PRODUCTION_DOMAIN}'`)
    .replace(/apiUrl: '[^']*'/, `apiUrl: '${buildConfig.PRODUCTION_API_URL}'`)
    .replace(/url: 'https:\/\/eirvcmzqbtkmoxquovsy\.supabase\.co'/, `url: '${buildConfig.SUPABASE_URL}'`)
    .replace(/anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9[^']*'/, `anonKey: '${buildConfig.SUPABASE_ANON_KEY}'`)
    .replace(/url: 'https:\/\/api\.redenexus\.top'/, `url: '${buildConfig.EVOLUTION_API_URL}'`)
    .replace(/key: 'e5fe045f841bddf5406357ebea55ea2b'/, `key: '${buildConfig.EVOLUTION_API_KEY}'`)
    .replace(/instanceName: 'crm-instance'/, `instanceName: '${buildConfig.EVOLUTION_INSTANCE_NAME}'`)
    .replace(/webhookUrl: 'https:\/\/webhook\.site\/unique-id'/, `webhookUrl: '${buildConfig.EVOLUTION_WEBHOOK_URL}'`)
    .replace(/url: 'https:\/\/app\.n8n\.cloud'/, `url: '${buildConfig.N8N_URL}'`)
    .replace(/apiKey: ''/, `apiKey: '${buildConfig.N8N_API_KEY}'`);
  
  // Atualizar n8n webhookUrl se fornecido
  if (buildConfig.N8N_WEBHOOK_URL) {
    configContent = configContent.replace(/webhookUrl: ''/, `webhookUrl: '${buildConfig.N8N_WEBHOOK_URL}'`);
  }
  
  fs.writeFileSync(configPath, configContent);
  console.log('✅ Configurações de produção atualizadas!');
}

// Função para atualizar o cliente Supabase
function updateSupabaseClient() {
  const clientPath = path.join(__dirname, 'src/integrations/supabase/client.ts');
  let clientContent = fs.readFileSync(clientPath, 'utf8');
  
  clientContent = clientContent
    .replace(/const SUPABASE_URL = "[^"]*"/, `const SUPABASE_URL = "${buildConfig.SUPABASE_URL}"`)
    .replace(/const SUPABASE_PUBLISHABLE_KEY = "[^"]*"/, `const SUPABASE_PUBLISHABLE_KEY = "${buildConfig.SUPABASE_ANON_KEY}"`);
  
  fs.writeFileSync(clientPath, clientContent);
  console.log('✅ Cliente Supabase atualizado!');
}

// Executar atualizações
console.log('🔧 Configurando build de produção...');
console.log('📝 Configurações aplicadas:');
console.log(`   - Domínio: ${buildConfig.PRODUCTION_DOMAIN}`);
console.log(`   - API URL: ${buildConfig.PRODUCTION_API_URL}`);
console.log(`   - Evolution API: ${buildConfig.EVOLUTION_API_URL}`);
console.log(`   - n8n URL: ${buildConfig.N8N_URL}`);
console.log(`   - Supabase URL: ${buildConfig.SUPABASE_URL}`);

updateProductionConfig();
updateSupabaseClient();

console.log('🚀 Configuração de build concluída!');
