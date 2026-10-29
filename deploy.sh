#!/bin/bash
set -e

echo "========================================="
echo "🚀 Deployment Started: $(date '+%Y-%m-%d %H:%M:%S')"
echo "========================================="

# 1. Masuk ke direktori monorepo
PROJECT_DIR="/www/wwwroot/wedding-invitational"
if [ -d "$PROJECT_DIR" ]; then
  cd "$PROJECT_DIR"
else
  cd "$(dirname "$0")"
fi

# 2. Muat environment PATH (Node.js & PM2 di aaPanel)
export PATH="/www/server/nodejs/v24.22.0/bin:/usr/local/bin:/usr/bin:/bin:$PATH"

echo "Node.js Version: $(node -v)"
echo "NPM Version: $(npm -v)"

# 3. Tarik perubahan terbaru dari GitHub
echo "📥 Pulling latest changes from GitHub (main)..."
git fetch --all
git reset --hard origin/main

# 4. Pastikan permission node_modules executable
if [ -d "node_modules" ]; then
  chmod -R 755 node_modules 2>/dev/null || true
fi

# 5. Install dependensi jika ada perubahan
echo "📦 Installing dependencies..."
npm install

# 6. Kompilasi build Next.js frontend untuk production
echo "🏗️ Building Next.js frontend..."
chmod -R 755 node_modules/.bin 2>/dev/null || true
npm run build

# 7. Berikan kepemilikan file ke user www (user aaPanel)
echo "🔒 Adjusting file permissions for user www..."
chown -R www:www .
chmod -R 775 .

# 8. Reload / Restart PM2 proses
echo "🔄 Reloading PM2 services..."
if command -v pm2 >/dev/null 2>&1; then
  sudo -u www pm2 reload ecosystem.config.cjs || sudo -u www pm2 restart all
  sudo -u www pm2 save
else
  echo "⚠️ PM2 not found in current PATH!"
fi

echo "========================================="
echo "✅ Deployment Completed Successfully: $(date '+%Y-%m-%d %H:%M:%S')"
echo "========================================="
