# 🏛️ CivicConnect - Civic Issue Reporting System

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black)](https://civic-issue-reporter-nqhd775fr-prajjwals-projects-3400e066.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v14+-green.svg)](https://nodejs.org)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple.svg)](https://getbootstrap.com)

## 🌟 Overview

CivicConnect is a modern, mobile-first platform that enables citizens to report civic issues directly to local authorities. Built for the Government of Jharkhand as part of the Clean & Green Technology initiative.

## ✨ Features

### For Citizens
- 📱 **Mobile-First Design** - Report issues on the go
- 📸 **Photo Upload** - Capture and attach images
- 📍 **GPS Location** - Automatic location tagging
- 🗺️ **Interactive Map** - Visualize reported issues
- 📊 **Real-time Tracking** - Monitor issue resolution
- 🔐 **Social Login** - Google/Phone authentication

### For Administrators
- 📊 **Analytics Dashboard** - Real-time statistics
- 🎯 **Issue Management** - Track and resolve issues
- 🏢 **Department Routing** - Automatic assignment
- 💬 **Comments System** - Internal communication
- 📈 **Performance Metrics** - Track resolution times

## 🚀 Live Demo

**Public Portal:** https://civic-issue-reporter-nqhd775fr-prajjwals-projects-3400e066.vercel.app

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript, Bootstrap 5
- **Backend:** Node.js, Express.js
- **Database:** SQLite
- **Maps:** Leaflet.js
- **Charts:** Chart.js
- **Hosting:** Vercel
- **Animations:** AOS Library

## 📸 Screenshots

### Landing Page
Beautiful animated landing page with user authentication

### Issue Reporting
Mobile-friendly interface for reporting civic issues

### Admin Dashboard
Comprehensive dashboard for government officials

## 🏗️ Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/civic-issue-reporter.git
cd civic-issue-reporter
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the server**
```bash
npm start
```

4. **Access the application**
- Public Portal: http://localhost:3001
- Admin Portal: http://localhost:3001/gov-admin-2024

## 🔐 Admin Access

The admin portal is accessible at `/gov-admin-2024` with credentials:
- Username: `admin`
- Password: `admin123`

**Note:** Change these credentials in production!

## 📂 Project Structure

```
civic-issue-reporter/
├── backend/
│   └── server.js          # Express server & API
├── public/
│   ├── index.html         # Landing page
│   ├── report.html        # Issue reporting
│   ├── admin.html         # Admin dashboard
│   ├── css/               # Stylesheets
│   └── js/                # JavaScript files
├── uploads/               # Image uploads
├── package.json           # Dependencies
└── README.md             # Documentation
```

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/issues` | Get all issues |
| GET | `/api/issues/:id` | Get specific issue |
| POST | `/api/issues` | Create new issue |
| PUT | `/api/issues/:id` | Update issue |
| DELETE | `/api/issues/:id` | Delete issue |
| GET | `/api/statistics` | Get statistics |

## 🎨 Features Showcase

- ✅ **Responsive Design** - Works on all devices
- ✅ **Real-time Updates** - Live data refresh
- ✅ **Secure Authentication** - Session management
- ✅ **File Upload** - Image attachment support
- ✅ **Map Integration** - Visual issue tracking
- ✅ **Analytics** - Data visualization
- ✅ **Department Routing** - Automatic assignment
- ✅ **Comment System** - Issue updates

## 🚀 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/civic-issue-reporter)

### Manual Deployment

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel --prod`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

Developed for the Government of Jharkhand, Department of Higher and Technical Education.

## 🙏 Acknowledgments

- Government of Jharkhand for the opportunity
- Clean & Green Technology initiative
- Open source community for the amazing tools

## 📞 Support

For issues and questions, please open a GitHub issue or contact the development team.

---

**Built with ❤️ for Better Civic Engagement**
