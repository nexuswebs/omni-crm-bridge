
# 🚀 Nexus Agents - Guia Completo de Instalação VPS & Docker Portainer

## 📋 Índice
- [Pré-requisitos](#pré-requisitos)
- [Opção 1: Instalação Tradicional na VPS](#opção-1-instalação-tradicional-na-vps)
- [Opção 2: Instalação com Docker & Portainer](#opção-2-instalação-com-docker--portainer)
- [Evolution API - Configuração Completa](#evolution-api---configuração-completa)
- [Configuração do Supabase](#configuração-do-supabase)
- [Configuração de Domínio e SSL](#configuração-de-domínio-e-ssl)
- [Monitoramento e Manutenção](#monitoramento-e-manutenção)
- [Troubleshooting](#troubleshooting)

---

## 📝 Pré-requisitos

### 🖥️ Servidor VPS
- **OS**: Ubuntu 20.04 LTS ou superior / CentOS 8+
- **RAM**: Mínimo 4GB (Recomendado 8GB+)
- **Storage**: Mínimo 40GB SSD
- **CPU**: 4 vCPUs mínimo
- **Rede**: IP público com acesso SSH

### 🌐 Domínio
- [ ] Domínio registrado (ex: nexusagents.com)
- [ ] DNS apontando para IP da VPS
- [ ] Acesso ao painel de DNS

### 🔑 Credenciais
- [ ] Acesso SSH à VPS (root ou sudo)
- [ ] Credenciais do Supabase
- [ ] Chaves de API (se aplicável)

---

## 🛠️ Opção 1: Instalação Tradicional na VPS

### 1️⃣ Preparação do Servidor

```bash
# Conectar via SSH
ssh root@SEU_IP_VPS

# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependências básicas
sudo apt install -y curl wget git unzip software-properties-common

# Instalar Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalação
node --version
npm --version
```

### 2️⃣ Instalar e Configurar Nginx

```bash
# Instalar Nginx
sudo apt install -y nginx

# Iniciar e habilitar Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Verificar status
sudo systemctl status nginx
```

### 3️⃣ Configurar Firewall

```bash
# Configurar UFW
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Verificar status
sudo ufw status
```

### 4️⃣ Deploy da Aplicação

```bash
# Criar diretório para aplicação
sudo mkdir -p /var/www/nexus-agents
cd /var/www/nexus-agents

# Clonar projeto (substitua pela URL do seu repositório)
sudo git clone https://github.com/SEU_USUARIO/nexus-agents.git .

# Instalar dependências
sudo npm install

# Criar arquivo de ambiente
sudo nano .env
```

**Conteúdo do arquivo `.env`:**
```env
VITE_SUPABASE_URL=https://eirvcmzqbtkmoxquovsy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpcnZjbXpxYnRrbW94cXVvdnN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5OTIzNzEsImV4cCI6MjA2NTU2ODM3MX0.pFTNDBbigWzm0pdWvuzQU9giujRVVSXU-tm8eXpl2ts
```

```bash
# Build da aplicação
sudo npm run build

# Configurar permissões
sudo chown -R www-data:www-data /var/www/nexus-agents
sudo chmod -R 755 /var/www/nexus-agents
```

### 5️⃣ Configurar Nginx para SPA

```bash
# Criar configuração do site
sudo nano /etc/nginx/sites-available/nexus-agents
```

**Conteúdo da configuração:**
```nginx
server {
    listen 80;
    server_name SEU_DOMINIO.com www.SEU_DOMINIO.com;
    root /var/www/nexus-agents/dist;
    index index.html;

    # Configuração para SPA (Single Page Application)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache para assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Compressão gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
```

```bash
# Habilitar site
sudo ln -s /etc/nginx/sites-available/nexus-agents /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Recarregar Nginx
sudo systemctl reload nginx
```

### 6️⃣ Configurar SSL com Let's Encrypt

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obter certificado SSL
sudo certbot --nginx -d SEU_DOMINIO.com -d www.SEU_DOMINIO.com

# Verificar renovação automática
sudo certbot renew --dry-run
```

---

## 🐳 Opção 2: Instalação com Docker & Portainer

### 📋 Checklist Docker & Portainer (ASSUMINDO QUE JÁ ESTÁ INSTALADO)

Baseado na informação que você já tem Docker e Portainer instalados com rede "Nexus":

- [x] Docker instalado e funcionando
- [x] Portainer instalado e acessível
- [x] Rede "Nexus" criada
- [ ] Stack Nexus Agents a ser criada
- [ ] Evolution API a ser configurada

### 1️⃣ Criando Stack no Portainer

1. **Acesse Portainer**: `https://SEU_IP_VPS:9443`
2. **Vá para Stacks** → **Add Stack**
3. **Nome da Stack**: `nexus-agents`
4. **Cole o docker-compose.yml abaixo**:

### 2️⃣ Docker Compose para Nexus Agents + Evolution API

```yaml
version: '3.8'

networks:
  nexus:
    external: true

services:
  # Evolution API
  evolution-api:
    image: atendai/evolution-api:v2.0.0
    container_name: evolution-api
    restart: unless-stopped
    ports:
      - "8080:8080"
    environment:
      # Configurações do Servidor
      - SERVER_TYPE=http
      - SERVER_PORT=8080
      - CORS_ORIGIN=*
      - CORS_METHODS=POST,GET,PUT,DELETE
      - CORS_CREDENTIALS=true
      
      # Configurações de Autenticação
      - AUTHENTICATION_TYPE=apikey
      - AUTHENTICATION_API_KEY=e5fe045f841bddf5406357ebea55ea2b
      - AUTHENTICATION_EXPOSE_IN_FETCH_INSTANCES=true
      
      # Configurações do WhatsApp
      - QRCODE_TYPE=terminal
      - QRCODE_COLOR=#198754
      
      # Configurações do Webhook
      - WEBHOOK_GLOBAL_URL=https://seu-crm.com/webhook/whatsapp
      - WEBHOOK_GLOBAL_ENABLED=false
      - WEBHOOK_GLOBAL_WEBHOOK_BY_EVENTS=false
      
      # Configurações do Banco de Dados (PostgreSQL)
      - DATABASE_ENABLED=true
      - DATABASE_CONNECTION_URI=postgresql://evolution:evolution123@postgres-evolution:5432/evolution
      - DATABASE_CONNECTION_CLIENT_NAME=evolution_api
      
      # Configurações do Redis
      - REDIS_ENABLED=true
      - REDIS_URI=redis://redis-evolution:6379
      - REDIS_PREFIX_KEY=evolution_api
      
      # Configurações de Logs
      - LOG_LEVEL=ERROR,WARN,DEBUG,INFO,LOG,VERBOSE,DARK,WEBHOOKS
      - LOG_COLOR=true
      - LOG_BAILEYS=error
      
      # Configurações de Instância
      - DEL_INSTANCE=false
      - DEL_TEMP_INSTANCES=true
      - CLEAN_STORE_CLEANING_INTERVAL=7200
      - CLEAN_STORE_MESSAGES=true
      - CLEAN_STORE_MESSAGE_UP_TO=false
      - CLEAN_STORE_CONTACTS=true
      - CLEAN_STORE_CHATS=true
      
    volumes:
      - evolution_instances:/evolution/instances
      - evolution_store:/evolution/store
    networks:
      - nexus
    depends_on:
      - postgres-evolution
      - redis-evolution

  # PostgreSQL para Evolution API
  postgres-evolution:
    image: postgres:15-alpine
    container_name: postgres-evolution
    restart: unless-stopped
    environment:
      - POSTGRES_DB=evolution
      - POSTGRES_USER=evolution
      - POSTGRES_PASSWORD=evolution123
    volumes:
      - postgres_evolution_data:/var/lib/postgresql/data
    networks:
      - nexus

  # Redis para Evolution API
  redis-evolution:
    image: redis:7-alpine
    container_name: redis-evolution
    restart: unless-stopped
    command: redis-server --appendonly yes
    volumes:
      - redis_evolution_data:/data
    networks:
      - nexus

  # Nexus Agents Frontend
  nexus-agents:
    build: 
      context: .
      dockerfile: Dockerfile
    container_name: nexus-agents-app
    restart: unless-stopped
    ports:
      - "3000:80"
    environment:
      - VITE_SUPABASE_URL=https://eirvcmzqbtkmoxquovsy.supabase.co
      - VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpcnZjbXpxYnRrbW94cXVvdnN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5OTIzNzEsImV4cCI6MjA2NTU2ODM3MX0.pFTNDBbigWzm0pdWvuzQU9giujRVVSXU-tm8eXpl2ts
      - VITE_EVOLUTION_API_URL=http://evolution-api:8080
      - VITE_EVOLUTION_API_KEY=e5fe045f841bddf5406357ebea55ea2b
    networks:
      - nexus
    depends_on:
      - evolution-api

  # Reverse Proxy com Traefik
  traefik:
    image: traefik:v3.0
    container_name: traefik
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080" # Dashboard do Traefik
    command:
      - --api.dashboard=true
      - --api.insecure=true
      - --providers.docker=true
      - --providers.docker.exposedbydefault=false
      - --entrypoints.web.address=:80
      - --entrypoints.websecure.address=:443
      - --certificatesresolvers.letsencrypt.acme.httpchallenge=true
      - --certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web
      - --certificatesresolvers.letsencrypt.acme.email=seu-email@dominio.com
      - --certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - traefik_letsencrypt:/letsencrypt
    networks:
      - nexus
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.traefik.rule=Host(`traefik.SEU_DOMINIO.com`)"
      - "traefik.http.routers.traefik.tls.certresolver=letsencrypt"

volumes:
  evolution_instances:
  evolution_store:
  postgres_evolution_data:
  redis_evolution_data:
  traefik_letsencrypt:
```

### 3️⃣ Dockerfile para Nexus Agents

Crie um arquivo `Dockerfile` no diretório do projeto:

```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copiar package files
COPY package*.json ./
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Production stage
FROM nginx:alpine

# Copiar build
COPY --from=build /app/dist /usr/share/nginx/html

# Configuração personalizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 4️⃣ Configuração do Nginx (nginx.conf)

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Configuração para SPA
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache para assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Compressão
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
```

### 5️⃣ Deploy no Portainer

1. **No Portainer, vá para Stacks**
2. **Add Stack** → Nome: `nexus-agents`
3. **Cole o docker-compose.yml**
4. **Configure as variáveis de ambiente se necessário**
5. **Deploy the Stack**

### 6️⃣ Configurar Labels do Traefik

Adicione estas labels aos serviços no docker-compose:

```yaml
# Para o Nexus Agents
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.nexus-agents.rule=Host(`SEU_DOMINIO.com`)"
  - "traefik.http.routers.nexus-agents.tls.certresolver=letsencrypt"
  - "traefik.http.services.nexus-agents.loadbalancer.server.port=80"

# Para Evolution API
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.evolution-api.rule=Host(`api.SEU_DOMINIO.com`)"
  - "traefik.http.routers.evolution-api.tls.certresolver=letsencrypt"
  - "traefik.http.services.evolution-api.loadbalancer.server.port=8080"
```

---

## 📱 Evolution API - Configuração Completa

### ✅ Checklist Evolution API

- [ ] **Container rodando** (porta 8080)
- [ ] **PostgreSQL conectado**
- [ ] **Redis funcionando**
- [ ] **API Key configurada**: `e5fe045f841bddf5406357ebea55ea2b`
- [ ] **Endpoints acessíveis**
- [ ] **Webhook configurado** (opcional)

### 🔧 Endpoints Importantes

```bash
# Testar API
curl -X GET "https://api.SEU_DOMINIO.com/instance/fetchInstances" \
  -H "apikey: e5fe045f841bddf5406357ebea55ea2b"

# Criar instância
curl -X POST "https://api.SEU_DOMINIO.com/instance/create" \
  -H "Content-Type: application/json" \
  -H "apikey: e5fe045f841bddf5406357ebea55ea2b" \
  -d '{
    "instanceName": "test-instance",
    "qrcode": true,
    "webhook": "https://seu-webhook.com/whatsapp"
  }'

# Conectar instância
curl -X GET "https://api.SEU_DOMINIO.com/instance/connect/test-instance" \
  -H "apikey: e5fe045f841bddf5406357ebea55ea2b"

# Obter QR Code
curl -X GET "https://api.SEU_DOMINIO.com/instance/qrcode/test-instance" \
  -H "apikey: e5fe045f841bddf5406357ebea55ea2b"
```

### 🔍 Logs da Evolution API

```bash
# Ver logs do container
docker logs evolution-api -f

# Ver logs do PostgreSQL
docker logs postgres-evolution -f

# Ver logs do Redis
docker logs redis-evolution -f
```

### 🌐 Configuração de Domínios

Para usar domínios personalizados:

1. **API Evolution**: `api.seudominio.com` → porta 8080
2. **Nexus Agents**: `seudominio.com` → porta 3000
3. **Traefik Dashboard**: `traefik.seudominio.com` → porta 8080

---

## 🔗 Configuração do Supabase

### ✅ Checklist Supabase

- [ ] **Projeto criado** no Supabase
- [ ] **URL do projeto**: `https://eirvcmzqbtkmoxquovsy.supabase.co`
- [ ] **Anon Key** configurada
- [ ] **Autenticação habilitada**
- [ ] **RLS (Row Level Security)** configurado
- [ ] **Tabelas criadas** (profiles, etc.)

### 🔑 Configurar Authentication

1. **Acesse o painel do Supabase**
2. **Vá para Authentication** → **Settings**
3. **Configure os provedores** (Email, Google, etc.)
4. **Defina URLs de redirecionamento**:
   - `https://SEU_DOMINIO.com`
   - `http://localhost:5173` (desenvolvimento)

### 📊 Verificar Banco de Dados

```sql
-- Verificar se as tabelas existem
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Verificar usuário admin
SELECT * FROM auth.users WHERE email = 'stark@redenexus.top';
```

---

## 🌐 Configuração de Domínio e SSL

### 📋 Checklist DNS

- [ ] **Registro A**: `SEU_DOMINIO.com` → `IP_DA_VPS`
- [ ] **Registro A**: `www.SEU_DOMINIO.com` → `IP_DA_VPS`
- [ ] **Registro A**: `api.SEU_DOMINIO.com` → `IP_DA_VPS`
- [ ] **TTL**: 300 (5 minutos)
- [ ] **Propagação**: Aguardar 24h máximo

### 🔒 SSL Automático com Traefik

O Traefik configurado no docker-compose já cuida automaticamente dos certificados SSL via Let's Encrypt.

---

## 📊 Monitoramento e Manutenção

### 🔍 Scripts de Monitoramento

```bash
# Status dos containers
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Logs em tempo real
docker logs -f nexus-agents-app
docker logs -f evolution-api
docker logs -f traefik

# Uso de recursos
docker stats

# Backup dos volumes
docker run --rm -v nexus-agents_postgres_evolution_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres-backup.tar.gz -C /data .
```

### 📈 Monitoramento com Portainer

1. **Dashboard**: Ver status de todos os containers
2. **Logs**: Acessar logs de cada serviço
3. **Stats**: Monitorar uso de CPU/RAM/Disk
4. **Volumes**: Gerenciar dados persistentes

---

## 🚨 Troubleshooting

### ❌ Problemas Comuns

#### 1. **Evolution API não responde**
```bash
# Verificar se o container está rodando
docker ps | grep evolution-api

# Ver logs
docker logs evolution-api

# Testar conectividade
curl -I http://localhost:8080
```

#### 2. **Erro "Invalid integration"**
- Verificar se a API Key está correta
- Conferir se todos os containers estão rodando
- Validar configuração do PostgreSQL

#### 3. **QR Code não aparece**
```bash
# Verificar logs da Evolution API
docker logs evolution-api | grep -i qr

# Testar endpoint manualmente
curl -X GET "http://localhost:8080/instance/qrcode/INSTANCE_NAME" \
  -H "apikey: e5fe045f841bddf5406357ebea55ea2b"
```

#### 4. **SSL não funciona**
- Verificar se o Traefik está rodando
- Conferir DNS apontando corretamente
- Ver logs do Traefik: `docker logs traefik`

#### 5. **Containers não conectam na rede**
```bash
# Verificar se a rede "nexus" existe
docker network ls | grep nexus

# Recriar a rede se necessário
docker network create nexus
```

### 🔧 Comandos Úteis

```bash
# Reiniciar toda a stack
docker-compose down && docker-compose up -d

# Verificar conectividade entre containers
docker exec -it nexus-agents-app ping evolution-api

# Backup completo
docker run --rm -v nexus-agents_evolution_instances:/data -v $(pwd):/backup alpine tar czf /backup/evolution-instances.tar.gz -C /data .

# Restaurar backup
docker run --rm -v nexus-agents_evolution_instances:/data -v $(pwd):/backup alpine tar xzf /backup/evolution-instances.tar.gz -C /data

# Limpar containers órfãos
docker system prune -a
```

---

## ✅ Checklist Final de Instalação

### 🐳 Docker & Portainer
- [ ] Portainer acessível via web
- [ ] Rede "nexus" criada
- [ ] Stack "nexus-agents" deployada
- [ ] Todos os containers rodando

### 📱 Evolution API
- [ ] Container evolution-api rodando
- [ ] PostgreSQL conectado
- [ ] Redis funcionando
- [ ] API respondendo na porta 8080
- [ ] Endpoints testados com sucesso

### 🖥️ Nexus Agents
- [ ] Container nexus-agents-app rodando
- [ ] Build realizado com sucesso
- [ ] Conectividade com Supabase
- [ ] Conectividade com Evolution API

### 🌐 Rede e SSL
- [ ] Traefik rodando
- [ ] SSL certificados gerados
- [ ] Domínios acessíveis via HTTPS
- [ ] Redirecionamento HTTP → HTTPS

### 🔗 Integração
- [ ] Nexus Agents consegue criar instâncias
- [ ] QR Code sendo exibido
- [ ] WhatsApp conectando
- [ ] Mensagens sendo enviadas

---

## 🆘 Suporte

Se encontrar problemas durante a instalação:

1. **Verifique os logs** de cada container
2. **Teste as conexões** entre serviços
3. **Consulte este guia** novamente
4. **Valide as configurações** de rede e portas

**Logs importantes:**
- `docker logs evolution-api` - API Evolution
- `docker logs nexus-agents-app` - Frontend
- `docker logs traefik` - Proxy reverso
- `docker logs postgres-evolution` - Banco de dados

---

🎉 **Parabéns!** Se chegou até aqui, o Nexus Agents com Evolution API está rodando em produção!

📧 **Contato**: Para suporte, abra uma issue no repositório.
