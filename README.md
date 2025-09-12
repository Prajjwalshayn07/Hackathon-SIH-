# 🏛️ Civic Issue Reporter MVP
## Crowdsourced Civic Issue Reporting and Resolution System

A mobile-first web application that enables citizens to report civic issues directly to local authorities, with a comprehensive admin dashboard for municipal staff to manage and resolve reported problems.

## 🌟 Features

### For Citizens:
- **📱 Mobile-First Design**: Responsive interface optimized for smartphones
- **📸 Photo Upload**: Capture and attach images of issues directly from mobile devices
- **📍 GPS Location**: Automatic location detection using device GPS
- **🗺️ Interactive Map**: View all reported issues on an interactive map
- **📊 Real-time Statistics**: See community impact and resolution progress
- **🔍 Filter & Search**: Browse issues by status, category, or priority
- **📝 Detailed Reporting**: Comprehensive issue submission with categories and priority levels

### For Administrators:
- **📊 Dashboard Overview**: Real-time statistics and charts
- **🎯 Issue Management**: View, filter, update, and resolve issues
- **💬 Comments System**: Add notes and updates to issues
- **🏢 Department Routing**: Automatic assignment to relevant departments
- **📈 Analytics**: Track trends and department performance
- **🔄 Status Updates**: Track issues through pending, in-progress, and resolved states

## 🚀 Quick Start

## 🛠️ Tech Stack
- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Node.js, Express.js  
- **Database:** SQLite  
- **Hosting:** Vercel (Frontend), Local/Express server (Backend)  
- **Other:** GPS API, File Uploads  

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone or download the project**
   ```bash
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
   - Citizens Portal: https://civic-issue-reporter-l4dvpsfak-prajjwals-projects-3400e066.vercel.app
   - Admin Dashboard: https://civic-issue-reporter-l4dvpsfak-prajjwals-projects-3400e066.vercel.app/admin.html

## 📁 Project Structure

```
civic-issue-reporter/
├── backend/
│   ├── server.js           # Express server and API endpoints
│   └── civic_issues.db     # SQLite database (auto-created)
├── public/
│   ├── index.html          # Citizens portal
│   ├── admin.html          # Admin dashboard
│   ├── css/
│   │   └── style.css       # Custom styles
│   └── js/
│       ├── app.js          # Citizens portal JavaScript
│       └── admin.js        # Admin dashboard JavaScript
├── uploads/                # Uploaded images directory
├── package.json            # Node.js dependencies
└── README.md              # This file
```

## 🔧 API Endpoints

### Issues Management
- `GET /api/issues` - Get all issues (with optional filters)
- `GET /api/issues/:id` - Get specific issue with comments
- `POST /api/issues` - Create new issue (multipart/form-data)
- `PUT /api/issues/:id` - Update issue status/details
- `DELETE /api/issues/:id` - Delete an issue

### Comments
- `POST /api/issues/:id/comments` - Add comment to issue

### Statistics
- `GET /api/statistics` - Get system statistics

## 📱 How to Use

### For Citizens:

1. **Report an Issue**
   - Open the application on your mobile device
   - Click "Report Issue" or scroll to the form
   - Select the issue category (Pothole, Streetlight, etc.)
   - Add a title and description
   - Use "Get My Location" button for automatic GPS location
   - Optionally upload a photo
   - Submit the report

2. **Track Issues**
   - View all reported issues in the "Recent Issues" section
   - Use filters to see issues by status
   - Check the interactive map for geographic distribution
   - Monitor community statistics

### For Administrators:

1. **Access Admin Panel**
   - Navigate to `/admin.html`
   - View dashboard with real-time statistics

2. **Manage Issues**
   - Click on "All Issues" tab to see complete list
   - Use filters to find specific issues
   - Click on any issue to view details
   - Update status, priority, department assignment
   - Add comments for internal notes

3. **View Analytics**
   - Check the Analytics tab for trends
   - Monitor department performance
   - Track resolution times

## 🎨 Issue Categories

- 🕳️ **Pothole** - Road damage and potholes
- 💡 **Street Light** - Malfunctioning streetlights
- 🗑️ **Trash/Litter** - Overflowing bins, illegal dumping
- 🎨 **Graffiti** - Vandalism and graffiti
- 💧 **Water Leak** - Broken pipes, water wastage
- 🚦 **Traffic Issue** - Signal problems, signage issues
- 🌳 **Park Maintenance** - Park and recreation issues
- 📝 **Other** - Miscellaneous civic problems

## 🏢 Automatic Department Assignment

Issues are automatically routed to appropriate departments:
- **Public Works**: Potholes, Graffiti
- **Electrical**: Streetlights
- **Sanitation**: Trash/Litter
- **Water Department**: Water Leaks
- **Traffic Management**: Traffic Issues
- **Parks & Recreation**: Park Maintenance

## 🔐 Security Features

- Input sanitization to prevent XSS attacks
- File upload restrictions (images only, 5MB max)
- HTML escaping for user-generated content
- CORS enabled for API access

## 📊 Database Schema

### Issues Table
- `id` - Unique identifier
- `title` - Issue title
- `description` - Detailed description
- `category` - Issue category
- `status` - Current status (pending/in_progress/resolved)
- `priority` - Priority level (low/normal/high)
- `latitude/longitude` - GPS coordinates
- `address` - Street address
- `image_url` - Uploaded image path
- `reporter_name/contact` - Optional contact info
- `department` - Assigned department
- `created_at/updated_at/resolved_at` - Timestamps

### Comments Table
- `id` - Unique identifier
- `issue_id` - Related issue
- `comment` - Comment text
- `author` - Comment author
- `created_at` - Timestamp

## 🌐 Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📈 Future Enhancements

Potential improvements for production version:
- User authentication system
- Email/SMS notifications
- Advanced analytics and reporting
- Mobile native apps (iOS/Android)
- Integration with government systems
- Multi-language support
- Citizen feedback and ratings
- Scheduled maintenance tracking
- Budget and resource allocation
- Historical data analysis

## 🤝 Contributing

This is an MVP demonstration. For production deployment:
1. Implement proper authentication
2. Use a production database (PostgreSQL/MySQL)
3. Add environment variables for configuration
4. Implement proper error handling and logging
5. Add automated testing
6. Set up CI/CD pipeline
7. Implement rate limiting and security headers

## 📝 License

This project is created as an MVP demonstration for the Government of Jharkhand's Department of Higher and Technical Education.

## 🆘 Support

For issues or questions:
1. Check the browser console for errors
2. Ensure all dependencies are installed
3. Verify Node.js version compatibility
4. Check that ports 3000 is available

## 👥 Credits

Developed as part of the Clean & Green Technology initiative for improving civic engagement and government accountability in Jharkhand.

---

**Note**: This is a Minimum Viable Product (MVP) for demonstration purposes. Production deployment would require additional security measures, scalability improvements, and integration with existing government systems.
