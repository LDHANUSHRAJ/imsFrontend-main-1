# 🚀 IMS Frontend - Deployment Guide

## 📋 Overview

This guide covers deploying the IMS Faculty & Recruiter Portal to production environments.

---

## 🎯 Pre-Deployment Checklist

### Environment Configuration
- [ ] Create `.env.production` file
- [ ] Configure API base URL
- [ ] Set up error tracking (Sentry)
- [ ] Configure analytics (Google Analytics)
- [ ] Set up CDN for static assets (optional)

### Code Quality
- [ ] Run linting: `npm run lint`
- [ ] Fix all TypeScript errors
- [ ] Remove console.logs from production code
- [ ] Test all user flows
- [ ] Check browser compatibility (Chrome, Firefox, Safari, Edge)

### Security
- [ ] Enable HTTPS
- [ ] Configure CORS headers
- [ ] Implement CSP (Content Security Policy)
- [ ] Add rate limiting
- [ ] Enable security headers (Helmet.js on backend)

---

## ⚙️ Environment Variables

Create a `.env.production` file in the project root:

```bash
# API Configuration
VITE_API_BASE_URL=https://api.christuniversity.in/ims
VITE_ERP_API_URL=https://erp.christuniversity.in/api

# Authentication
VITE_AUTH_TOKEN_KEY=ims_auth_token
VITE_REFRESH_TOKEN_KEY=ims_refresh_token

# Feature Flags
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_ANALYTICS=true

# Analytics
VITE_GA_TRACKING_ID=UA-XXXXXXXXX-X

# Error Tracking (Sentry)
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
VITE_SENTRY_ENVIRONMENT=production

# App Configuration
VITE_APP_NAME=IMS Faculty Portal
VITE_APP_VERSION=1.0.0
```

---

## 🏗 Build Process

### Development Build
```bash
npm run dev
# Access at http://localhost:5173
```

### Production Build
```bash
# Install dependencies
npm ci

# Run build
npm run build

# Output will be in ./dist folder
# Contents:
# - index.html
# - assets/
#   - index-[hash].js
#   - index-[hash].css
#   - [images]
```

### Build Optimization
```javascript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2015',
    minify: 'terser',
    sourcemap: false, // Set to true for debugging
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            'react',
            'react-dom',
            'react-router-dom'
          ],
          ui: [
            'lucide-react'
          ]
        }
      }
    }
  }
});
```

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended for Quick Deploy)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Production deploy
vercel --prod
```

**Vercel Configuration** (`vercel.json`):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Option 2: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# Production
netlify deploy --prod
```

**Netlify Configuration** (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "no-referrer-when-downgrade"
```

### Option 3: CHRIST University Server (Manual Deploy)

#### Using Nginx

**1. Build the application**
```bash
npm run build
```

**2. Copy `dist/` folder to server**
```bash
scp -r dist/* user@server:/var/www/ims-faculty-portal/
```

**3. Nginx Configuration** (`/etc/nginx/sites-available/ims`):
```nginx
server {
    listen 80;
    server_name ims.christuniversity.in;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ims.christuniversity.in;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/ims.christuniversity.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ims.christuniversity.in/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Root directory
    root /var/www/ims-faculty-portal;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_vary on;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # API proxy (if needed)
    location /api {
        proxy_pass https://api.christuniversity.in;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**4. Enable site and restart Nginx**
```bash
sudo ln -s /etc/nginx/sites-available/ims /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Option 4: Docker Deployment

**Dockerfile**:
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf (for Docker)**:
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Build and run**:
```bash
# Build image
docker build -t ims-frontend .

# Run container
docker run -d -p 80:80 ims-frontend
```

---

## 🔒 SSL Certificate Setup (Let's Encrypt)

```bash
# Install certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d ims.christuniversity.in

# Auto-renewal (crontab)
0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 📊 Monitoring & Analytics

### Error Tracking (Sentry)

**1. Install Sentry**
```bash
npm install @sentry/react @sentry/tracing
```

**2. Configure** (`src/main.tsx`):
```typescript
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
  environment: import.meta.env.MODE,
});
```

### Analytics (Google Analytics)

**1. Install**
```bash
npm install react-ga4
```

**2. Configure** (`src/utils/analytics.ts`):
```typescript
import ReactGA from "react-ga4";

export const initGA = () => {
  ReactGA.initialize(import.meta.env.VITE_GA_TRACKING_ID);
};

export const logPageView = () => {
  ReactGA.send({ hitType: "pageview", page: window.location.pathname });
};
```

---

## 🧪 Testing Before Deployment

### Manual Testing Checklist
- [ ] Login with all 4 roles
- [ ] Create a session (IC)
- [ ] Create a recruiter (IC)
- [ ] Create a job posting (Recruiter)
- [ ] Approve/Reject job (IC)
- [ ] Review application (Faculty)
- [ ] Assign guide (IC)
- [ ] Submit evaluation (Faculty)
- [ ] Check notifications
- [ ] Test logout

### Automated Testing (Future)
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

---

## 🚨 Rollback Plan

If deployment fails:

1. **Revert to previous version**
   ```bash
   # Vercel
   vercel rollback

   # Manual (Nginx)
   sudo cp -r /var/www/ims-faculty-portal.backup/* /var/www/ims-faculty-portal/
   ```

2. **Check logs**
   ```bash
   # Nginx logs
   sudo tail -f /var/log/nginx/error.log

   # Application logs (if using PM2)
   pm2 logs ims-frontend
   ```

3. **Notify stakeholders**
   - Email IT team
   - Update status page

---

## 📈 Performance Optimization

### Code Splitting
```typescript
// Lazy load routes
const ICDashboard = lazy(() => import('./pages/dashboards/ICDashboard'));
const JobForm = lazy(() => import('./pages/jobs/JobForm'));

<Suspense fallback={<Loading />}>
  <Route path="/dashboard" element={<ICDashboard />} />
</Suspense>
```

### Image Optimization
```bash
# Install sharp for image optimization
npm install --save-dev vite-plugin-imagemin
```

### Bundle Analysis
```bash
# Install bundle analyzer
npm install --save-dev rollup-plugin-visualizer

# Generate report
npm run build -- --mode analyze
```

---

## 🔧 Troubleshooting

### Issue: Blank page after deployment
**Solution**: Check if base path is correct in `vite.config.ts`
```typescript
export default defineConfig({
  base: '/', // Or subdirectory if deployed to one
});
```

### Issue: API calls failing
**Solution**: Verify CORS settings and API base URL in `.env`

### Issue: Routes not working (404)
**Solution**: Ensure server redirects all routes to `index.html` (SPA mode)

---

## 📚 Post-Deployment Tasks

- [ ] Update DNS records (if applicable)
- [ ] Test in all supported browsers
- [ ] Monitor error rates (Sentry)
- [ ] Check page load times (Lighthouse)
- [ ] Verify SSL certificate
- [ ] Document deployment process
- [ ] Train support team
- [ ] Create user documentation

---

## 👥 Support

- **DevOps**: devops@christuniversity.in
- **IT Support**: it-support@christuniversity.in
- **Emergency Hotline**: +91-XXX-XXXX

---

**Last Updated**: January 31, 2026  
**Version**: 1.0.0
