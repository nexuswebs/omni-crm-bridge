
#!/bin/bash

echo "🚀 Preparando CRM Nexus Agents para produção..."

# Criar diretórios necessários
mkdir -p logs
mkdir -p temp

# Construir a aplicação
echo "📦 Construindo aplicação..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erro na construção da aplicação"
    exit 1
fi

# Configurar permissões
chmod +x start.js
chmod 644 app.js
chmod -R 755 dist/

echo "✅ Build concluído com sucesso!"
echo ""
echo "📋 Próximos passos para deploy no cPanel:"
echo "1. Faça upload de todos os arquivos para seu diretório no cPanel"
echo "2. No cPanel, vá em 'Node.js App'"
echo "3. Crie uma nova aplicação:"
echo "   - Node.js Version: 22.x"
echo "   - Application Mode: Production"
echo "   - Application Root: /"
echo "   - Application URL: seu-dominio.com"
echo "   - Application Startup File: app.js"
echo "4. Clique em 'Create'"
echo "5. Acesse: seu-dominio.com/api/health para testar"
echo ""
echo "🔗 URLs de teste:"
echo "   Health Check: /api/health"
echo "   Aplicação: /"
