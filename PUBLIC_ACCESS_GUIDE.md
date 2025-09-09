# 🌐 Making Your Civic Issue Reporter Publicly Accessible

## Quick Start - 3 Methods

### Method 1: Using ngrok (Easiest - Free Public URL)

1. **Double-click `start-public-server.bat`**
   - This will start the server and create a public URL
   - Look for a URL like: `https://abc123.ngrok.io`
   - Share this URL with anyone in the world!

2. **Or run manually in PowerShell:**
   ```powershell
   # Terminal 1 - Start the server
   npm start
   
   # Terminal 2 - Create public tunnel
   .\ngrok.exe http 3001
   ```

3. **You'll see something like:**
   ```
   Forwarding: https://abc123.ngrok.io -> http://localhost:3001
   ```
   Share the https://abc123.ngrok.io URL!

### Method 2: Local Network Access (No Internet Required)

1. **Find your IP address:**
   ```powershell
   ipconfig | findstr IPv4
   ```
   You'll see something like: `192.168.1.100`

2. **Start the server:**
   ```powershell
   npm start
   ```

3. **Share these URLs with people on your network:**
   - Citizens Portal: `http://192.168.1.100:3001`
   - Admin Dashboard: `http://192.168.1.100:3001/admin.html`

### Method 3: Port Forwarding (Permanent Public Access)

1. **Configure your router:**
   - Access router admin (usually `192.168.1.1`)
   - Find "Port Forwarding" settings
   - Forward port 3001 to your PC's IP
   - Use your public IP: whatismyip.com

2. **Windows Firewall:**
   ```powershell
   # Run as Administrator
   New-NetFirewallRule -DisplayName "Civic Reporter" -Direction Inbound -Protocol TCP -LocalPort 3001 -Action Allow
   ```

## 🔒 Security Warning

When making your app publicly accessible:
- Anyone can submit issues
- Consider adding authentication for production
- Monitor for spam/abuse
- Use HTTPS in production

## 📱 Sharing Your App

### With ngrok:
- Citizens: `https://your-id.ngrok.io`
- Admin: `https://your-id.ngrok.io/admin.html`

### On Local Network:
- Citizens: `http://your-ip:3001`
- Admin: `http://your-ip:3001/admin.html`

## 🚀 Quick Commands

```powershell
# Start server only
npm start

# Create public tunnel (after server is running)
.\ngrok.exe http 3001

# Get your IP address
ipconfig | findstr IPv4

# Test if port is open
Test-NetConnection -ComputerName localhost -Port 3001
```

## 📊 Free Hosting Alternatives

For permanent free hosting, consider:
1. **Render.com** - Free Node.js hosting
2. **Railway.app** - Free tier available
3. **Glitch.com** - Free forever hosting
4. **Vercel** - For static + serverless
5. **Netlify** - For static sites

## ⚠️ Important Notes

- ngrok URLs change each time (unless you pay)
- Free ngrok has a 40 connections/minute limit
- Your computer must stay on for local hosting
- Consider cloud hosting for production use
