
#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando CRM Nexus Agents...');

// Configurar variáveis de ambiente para produção
process.env.NODE_ENV = 'production';

// Iniciar a aplicação
const app = require('./app.js');

console.log('✅ Aplicação iniciada com sucesso!');
