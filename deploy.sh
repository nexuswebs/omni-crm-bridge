
#!/bin/bash

echo "🚀 Preparando CRM Nexus Agents para produção..."

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale o Node.js primeiro."
    exit 1
fi

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado. Instale o npm primeiro."
    exit 1
fi

# Criar diretórios necessários
mkdir -p logs
mkdir -p temp

echo "🔧 Configurando build de produção..."

# Aplicar configurações de produção
node build-config.js

if [ $? -ne 0 ]; then
    echo "❌ Erro na configuração de produção"
    exit 1
fi

# Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

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
echo "1. Faça upload dos arquivos para seu diretório no cPanel:"
echo "   - app.js (servidor Node.js)"
echo "   - start.js (script de inicialização)"
echo "   - ecosystem.config.js (configuração PM2)"
echo "   - dist/ (aplicação React buildada)"
echo "   - package.json (dependências)"
echo ""
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
echo ""
echo "⚙️  Configurações já incluídas no build:"
echo "   - Conexão com Supabase configurada"
echo "   - Evolution API pré-configurada"
echo "   - n8n configurado (se fornecido)"
echo "   - Todas as credenciais já incluídas"
echo ""
echo "🎉 Depois do upload, a aplicação deve funcionar imediatamente!"
