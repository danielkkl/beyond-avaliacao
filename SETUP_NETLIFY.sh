#!/bin/bash

# ============================================================================
# SETUP NETLIFY - Script de Configuração Automática
# ============================================================================
# Este script automatiza a configuração do Beyond Avaliação no Netlify
# Uso: bash SETUP_NETLIFY.sh
# ============================================================================

set -e

echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                                                                    ║"
echo "║        🚀 SETUP NETLIFY - Beyond Avaliação                        ║"
echo "║                                                                    ║"
echo "║        Configuração automática para deploy no Netlify             ║"
echo "║                                                                    ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""

# ============================================================================
# VERIFICAÇÕES INICIAIS
# ============================================================================

echo "📋 Verificando pré-requisitos..."
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale em: https://nodejs.org"
    exit 1
fi
echo "✅ Node.js $(node --version)"

# Verificar pnpm
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm não encontrado. Instale com: npm install -g pnpm"
    exit 1
fi
echo "✅ pnpm $(pnpm --version)"

# Verificar Git
if ! command -v git &> /dev/null; then
    echo "❌ Git não encontrado. Instale em: https://git-scm.com"
    exit 1
fi
echo "✅ Git $(git --version | cut -d' ' -f3)"

echo ""

# ============================================================================
# CONFIGURAÇÃO DO REPOSITÓRIO
# ============================================================================

echo "📦 Configurando repositório Git..."
echo ""

# Verificar se está em repositório Git
if [ ! -d ".git" ]; then
    echo "⚠️  Não está em repositório Git. Inicializando..."
    git init
    git add .
    git commit -m "Initial commit: Beyond Avaliação"
    echo "✅ Repositório Git inicializado"
else
    echo "✅ Repositório Git já existe"
fi

echo ""

# ============================================================================
# INSTALAR DEPENDÊNCIAS
# ============================================================================

echo "📚 Instalando dependências..."
echo ""

pnpm install

echo "✅ Dependências instaladas"
echo ""

# ============================================================================
# BUILD
# ============================================================================

echo "🔨 Compilando projeto..."
echo ""

pnpm build

echo "✅ Projeto compilado com sucesso"
echo ""

# ============================================================================
# VERIFICAR ESTRUTURA
# ============================================================================

echo "🔍 Verificando estrutura de arquivos..."
echo ""

files=(
    "netlify.toml"
    "package.json"
    "client/dist"
    "drizzle/schema.ts"
    "server/routers.ts"
)

for file in "${files[@]}"; do
    if [ -e "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file não encontrado"
    fi
done

echo ""

# ============================================================================
# INSTRUÇÕES FINAIS
# ============================================================================

echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                                                                    ║"
echo "║        ✅ SETUP CONCLUÍDO COM SUCESSO!                           ║"
echo "║                                                                    ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""

echo "📝 PRÓXIMOS PASSOS:"
echo ""
echo "1️⃣  Fazer push para GitHub:"
echo "   git push origin main"
echo ""
echo "2️⃣  Conectar ao Netlify:"
echo "   https://app.netlify.com → New site from Git"
echo ""
echo "3️⃣  Configurar variáveis de ambiente:"
echo "   Site settings → Build & deploy → Environment"
echo ""
echo "   Variáveis necessárias:"
echo "   - DATABASE_URL"
echo "   - STRIPE_SECRET_KEY"
echo "   - STRIPE_PUBLISHABLE_KEY"
echo "   - STRIPE_WEBHOOK_SECRET"
echo "   - GOOGLE_CLIENT_ID"
echo "   - GOOGLE_CLIENT_SECRET"
echo "   - JWT_SECRET"
echo ""
echo "4️⃣  Criar webhook do Stripe:"
echo "   https://dashboard.stripe.com/webhooks"
echo "   URL: https://seu-site.netlify.app/api/stripe/webhook"
echo ""
echo "5️⃣  Importar schema do banco de dados:"
echo "   mysql -h HOST -u USER -p < database_schema.sql"
echo ""
echo "6️⃣  Testar deploy:"
echo "   https://seu-site.netlify.app"
echo ""

echo "📚 Documentação completa em: DEPLOY_NETLIFY.md"
echo ""

echo "💡 Dicas:"
echo "   - Use .env.local para variáveis locais (não commite!)"
echo "   - Teste pagamentos com cartão: 4242 4242 4242 4242"
echo "   - Monitore logs em: Netlify → Deploys → Deploy log"
echo ""

echo "🎉 Seu Beyond Avaliação está pronto para deploy!"
echo ""
