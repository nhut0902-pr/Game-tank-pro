# Deployment Guide - Game Tank 3D Pro

## 🚀 Deployment lên Vercel

### Phương Pháp 1: Vercel Dashboard (Khuyến Nghị)

1. **Truy cập Vercel**
   - Đi tới https://vercel.com
   - Đăng nhập bằng GitHub account

2. **Import Project**
   - Nhấn "Add New..." → "Project"
   - Chọn "Import Git Repository"
   - Tìm `nhut0902-pr/Game-tank-pro`
   - Nhấn "Import"

3. **Cấu Hình Build**
   - **Framework Preset**: Vite
   - **Build Command**: `pnpm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install`

4. **Environment Variables** (nếu cần)
   - Không cần thiết cho dự án này

5. **Deploy**
   - Nhấn "Deploy"
   - Chờ build hoàn thành (~2-3 phút)
   - Vercel sẽ cấp URL: `https://game-tank-pro.vercel.app`

### Phương Pháp 2: Vercel CLI

```bash
# Cài Vercel CLI
npm i -g vercel

# Đăng nhập
vercel login

# Deploy
cd /home/ubuntu/Game-tank-new
vercel

# Deploy production
vercel --prod
```

### Phương Pháp 3: GitHub Integration

1. Vercel tự động watch GitHub repo
2. Mỗi khi push code lên `main`, Vercel tự động deploy
3. Preview URL cho mỗi PR

## 📋 Vercel Configuration

File `vercel.json` đã được cấu hình:

```json
{
  "installCommand": "npm install",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

## ✅ Pre-Deployment Checklist

- [x] Code pushed to GitHub
- [x] All dependencies in package.json
- [x] Build script works locally (`pnpm run build`)
- [x] No hardcoded paths
- [x] Environment variables configured
- [x] README.md updated
- [x] vercel.json configured

## 🔍 Troubleshooting

### Build Failed
```bash
# Kiểm tra build locally
pnpm run build

# Xem error logs
vercel logs
```

### Deployment Timeout
- Tăng timeout trong vercel.json
- Tối ưu build size
- Kiểm tra dependencies

### Performance Issues
- Kiểm tra Vercel Analytics
- Tối ưu bundle size
- Kiểm tra API calls

## 📊 Monitoring

### Vercel Dashboard
- **Deployments**: Xem tất cả deployments
- **Analytics**: Traffic, performance metrics
- **Logs**: Build và runtime logs
- **Domains**: Quản lý custom domains

### Custom Domain
1. Mua domain (GoDaddy, Namecheap, etc.)
2. Trong Vercel: Settings → Domains
3. Thêm domain
4. Cập nhật DNS records
5. Chờ propagation (~24h)

## 🔐 Security

### Environment Variables
```bash
# Thêm environment variables
vercel env add SECRET_KEY
vercel env add API_KEY
```

### CORS & CSP
- Vercel tự động handle CORS
- Kiểm tra Content Security Policy nếu cần

## 📈 Performance Optimization

### Vercel Analytics
```javascript
// Đã được cấu hình trong HTML
<script defer src="https://analytics.vercel.com/umami" 
  data-website-id="..."></script>
```

### Caching Strategy
- Static assets: 1 năm
- HTML: No cache
- API responses: Tùy endpoint

## 🔄 Continuous Deployment

### GitHub Actions (Optional)
Tạo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## 📱 Mobile Testing

### Vercel Preview
- Mỗi PR có preview URL
- Test trên mobile devices
- Kiểm tra responsive design

### Browser Testing
- Chrome DevTools
- Firefox DevTools
- Safari Developer Tools

## 🎯 Deployment Checklist

### Trước Deploy
- [ ] Code review
- [ ] Test locally
- [ ] Build test
- [ ] Performance check
- [ ] Security audit

### Sau Deploy
- [ ] Verify deployment
- [ ] Test all features
- [ ] Check analytics
- [ ] Monitor errors
- [ ] Performance monitoring

## 📞 Support

- Vercel Support: https://vercel.com/support
- GitHub Issues: https://github.com/nhut0902-pr/Game-tank-pro/issues
- Discord: [Your Discord Link]

## 🔗 Useful Links

- Vercel Docs: https://vercel.com/docs
- Vite Docs: https://vitejs.dev
- Three.js Docs: https://threejs.org/docs
- GitHub Docs: https://docs.github.com

---

**Last Updated**: May 2, 2026
**Status**: Ready for Production ✅
