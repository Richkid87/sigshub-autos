# 🚀 Hostinger Deployment Guide for SigsHub Autos

This Next.js application is configured with `output: 'standalone'`, a custom production `server.js`, and trailing-slash routes to avoid Hostinger redirect loops. Admin routes are part of the Next.js app; no separate `/admin` folder is needed.

---

## Method 1: Hostinger Cloud / Web Hosting (Node.js App Manager)

If you are using Hostinger's standard Cloud or Web hosting with **Node.js support**:

### 1. Upload the Project
You can either:
- **Option A (GitHub Git deployment):** In Hostinger hPanel, go to **Advanced > Git**, connect `https://github.com/Richkid87/sigshub-autos.git`, and pull into `public_html`.
- **Option B (File Manager / FTP):** Zip your project files (excluding `node_modules` and `.next`) and extract them inside your domain's `public_html` directory.

### 2. Configure Node.js in hPanel
1. In hPanel, navigate to **Websites > Manage** for your domain.
2. In the left menu, search for **Node.js** (under *Advanced*).
3. Set the following settings:
   - **Node.js version:** `22.x` (or `20.x` with minimum `20.9.0`)
   - **Application mode:** `Production`
   - **Application root:** `/home/u362629995/domains/sigsautos.com/public_html`
   - **Application URL:** `https://sigsautos.com`
   - **Application startup file:** `server.js`

### 3. Add Environment Variables
In the **Environment Variables** section in the Node.js settings, add:
- `SUPABASE_URL` = `https://zbkjuvarxaijwmugkkwr.supabase.co`
- `SUPABASE_API_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpia2p1dmFyeGFpandtdWdra3dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5NDU2MjIsImV4cCI6MjA5NzUyMTYyMn0.KmwA5C6hzXTWbgNxmPVwcF-IKai3D7qP-uXjQNcvY6E`
- `NEXT_PUBLIC_SUPABASE_URL` = `https://zbkjuvarxaijwmugkkwr.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpia2p1dmFyeGFpandtdWdra3dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5NDU2MjIsImV4cCI6MjA5NzUyMTYyMn0.KmwA5C6hzXTWbgNxmPVwcF-IKai3D7qP-uXjQNcvY6E`
- `ADMIN_PASSWORD` = `Standard2026`
- `NODE_ENV` = `production`
- `PORT` = `3000`

*(Alternatively, you can create a `.env.production` file in your root folder with these keys).*

### 4. Install Dependencies & Build
Via SSH or Hostinger Web Terminal:
```bash
cd public_html
npm install
npm run build
# Or if Turbopack ever has issues on your environment:
# npm run build:webpack
```

### 5. Start the Application
- In the hPanel Node.js section, click **"Run script"** or **"Restart Application"**.
- Your website will now be live on your Hostinger domain with SSL enabled.

---

## Method 2: Hostinger VPS (Ubuntu / Debian with PM2 + Nginx)

If you are using a Hostinger VPS:

### 1. Clone & Install
```bash
cd /var/www
git clone https://github.com/Richkid87/sigshub-autos.git
cd sigshub-autos
npm install
```

### 2. Set Up Environment Variables
Create `.env.local`:
```bash
nano .env.local
```
Add:
```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
ADMIN_PASSWORD=<your-admin-password>
NODE_ENV=production
```

### 3. Build & Run with PM2
```bash
npm run build
pm2 start server.js --name "sigshub"
pm2 save
pm2 startup
```

### 4. Nginx Reverse Proxy
In `/etc/nginx/sites-available/sigshubautos.com`:
```nginx
server {
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Enable site and get SSL:
```bash
sudo ln -s /etc/nginx/sites-available/sigshubautos.com /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
