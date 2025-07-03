
const express = require('express');
const path = require('path');
const app = express();

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'dist')));

// API health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'CRM Nexus Agents funcionando!',
    timestamp: new Date().toISOString()
  });
});

// SPA - todas as rotas servem o index.html (React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Porta configurada pelo Passenger ou 3000 como fallback
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`🚀 CRM Nexus Agents rodando na porta ${port}`);
  console.log(`📁 Servindo arquivos de: ${path.join(__dirname, 'dist')}`);
});

module.exports = app;
