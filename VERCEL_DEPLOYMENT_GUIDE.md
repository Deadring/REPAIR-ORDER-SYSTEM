# 🚀 Panduan Deploy ke Vercel

Sistem Repair Order Anda sekarang sudah dikonfigurasi untuk deploy di Vercel dengan benar!

## ✅ Perubahan yang Sudah Dilakukan

### 1. **vercel.json** (Baru)
- Mengatur routing untuk API di `/api`
- Frontend build akan serve sebagai static files
- Semua request akan handle oleh React Router

### 2. **backend/server.js** (Updated)
- Support Vercel serverless functions
- CORS configuration untuk production
- Module export untuk Vercel

### 3. **frontend/src/services/api.js** (Updated)
- Auto detect production environment
- Menggunakan `/api` path di production (routed by vercel.json)
- Local development tetap bisa connect ke `localhost:8000`

## 📋 Langkah-Langkah Deploy

### Step 1: Push ke GitHub
```bash
git init
git add .
git commit -m "Prepare for Vercel deployment"
git branch -M main
git remote add origin https://github.com/your-username/repair-order-system.git
git push -u origin main
```

### Step 2: Set Environment Variables di Vercel

1. Buka project di [vercel.com](https://vercel.com)
2. Klik **Settings** → **Environment Variables**
3. Tambahkan variables ini:

```
DB_HOST = your-database-host.com
DB_USER = your-database-user
DB_PASSWORD = your-database-password
DB_NAME = repair_order_db
DB_PORT = 3306
JWT_SECRET = your-jwt-secret-key
FRONTEND_URL = https://your-project.vercel.app
NODE_ENV = production
```

### Step 3: Configure Database Access
- Database harus accessible dari internet (Vercel servers)
- Whitelist Vercel IP jika menggunakan firewall
- Test connection dengan Health Check: `https://your-project.vercel.app/api/health`

### Step 4: Deploy
```bash
git push origin main
```
Vercel akan auto-deploy dari push ke main branch

## 🔍 Testing

### Test API Endpoints:
```bash
# Health check
curl https://your-project.vercel.app/api/health

# Login
curl -X POST https://your-project.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'

# Get repair orders
curl https://your-project.vercel.app/api/repair-orders \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Frontend:
- Buka browser: `https://your-project.vercel.app`
- Seharusnya melihat form login
- Login dengan credentials yang ada di database
- Lihat data repair orders

## 🐛 Troubleshooting

### Error: "Cannot connect to API"
- Check Network tab di DevTools (F12)
- Lihat error response
- Verify database credentials di Vercel settings
- Check database whitelist IP

### Error: "CORS error"
- Verify `FRONTEND_URL` environment variable
- Check CORS configuration di backend/server.js
- Pastikan frontend URL match dengan deployment URL

### Error: "404 at /api/..."
- Check vercel.json routing
- Verify backend/server.js exports
- Check Vercel build logs

## 📊 Production Checklist

- [ ] Database credentials diatur di Vercel environment
- [ ] FRONTEND_URL sesuai dengan Vercel domain
- [ ] JWT_SECRET diganti dengan secret yang aman
- [ ] Database bisa diakses dari Vercel
- [ ] CORS whitelist frontend URL
- [ ] Test semua API endpoints
- [ ] Test login dan fetch data
- [ ] Export Excel feature working
- [ ] Network Settings accessible
- [ ] Remove debug console.logs jika diperlukan

## 🚨 Penting

1. **Database Connection**: Pastikan MySQL/database Anda bisa diakses dari internet atau gunakan managed database service seperti PlanetScale
2. **Security**: Jangan commit `.env` file dengan real credentials
3. **Build Time**: Frontend build + backend initialization bisa memakan waktu
4. **Limits**: Vercel Hobby plan punya timeout 60 detik untuk serverless functions

## 📞 Support

Jika ada error saat deploy, check:
1. Vercel deployment logs (vercel.com → project → deployments)
2. Frontend build success
3. Backend function logs
4. Browser console (F12)
5. Network requests (Network tab)

Selamat! Sistem Anda siap di-deploy! 🎉
