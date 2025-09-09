# 🔐 Admin Portal Access

## 🌐 Public Website vs Admin Portal

### **Citizens Website (Public)**
- **URL**: `https://your-site.loca.lt/`
- **Pages**:
  - Landing Page: `/index.html`
  - Report Issue: `/report.html` 
  - Track Issues: `/track.html`
- **Access**: Anyone can visit
- **Login**: Google/Phone for citizens

### **Admin Portal (Government Only)**
- **URL**: `https://your-site.loca.lt/gov-admin-2024`
- **Access**: Only government officials with credentials
- **Hidden**: Not linked from public site

## 🔒 How to Access Admin Panel

### **Step 1: Go to Secret Admin URL**
```
https://your-site.loca.lt/gov-admin-2024
```

### **Step 2: Use Admin Credentials**
- Username: `admin`
- Password: `admin123`

## 📂 File Structure

```
public/
├── index.html          (Public landing page)
├── report.html         (Citizens report page)
├── track.html          (Issue tracking)
├── login.html          (Admin login - hidden)
├── admin.html          (Admin dashboard - protected)
└── gov-admin-2024      (Secret admin entry point)
```

## 🛡️ Security Features

1. **Separate URLs**: Admin portal has different URL
2. **No Public Links**: Admin login not visible on public site
3. **Session Based**: 30-minute auto logout
4. **Protected Routes**: Can't access admin.html directly

## 🚀 To Deploy Separately

For production, you can host:
- **Public Site**: `civicconnect.gov.in`
- **Admin Site**: `admin.civicconnect.gov.in` (different subdomain)

## 📝 Notes

- Admin portal is completely separate from citizen portal
- Citizens use Google/Phone login
- Government officials use username/password
- No cross-linking between public and admin sites
