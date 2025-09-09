# 🔥 Firebase Setup Instructions

## Quick Setup (5 Minutes)

### 1. Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Create a project"
3. Name it: "CivicConnect-Jharkhand"
4. Disable Google Analytics (not needed)
5. Click "Create Project"

### 2. Enable Authentication
1. In Firebase Console, click "Authentication" in left menu
2. Click "Get Started"
3. Enable these sign-in methods:
   - **Google**: Click, Enable, Select your email, Save
   - **Phone**: Click, Enable, Save

### 3. Create Firestore Database
1. Click "Firestore Database" in left menu
2. Click "Create Database"
3. Choose "Start in test mode" (for hackathon)
4. Select location: "asia-south1 (Mumbai)"
5. Click "Enable"

### 4. Get Your Config
1. Click the gear icon ⚙️ → "Project settings"
2. Scroll down to "Your apps"
3. Click "</>" (Web) icon
4. Register app name: "CivicConnect"
5. Copy the firebaseConfig object

### 5. Update Your Code
Replace the config in `public/js/firebase-config.js` with your config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

## That's It! 🎉

Your app now has:
- ✅ Google Login
- ✅ Phone OTP Login
- ✅ Permanent data storage
- ✅ Real-time updates
- ✅ User authentication

## Testing
1. Click "Login" → "Continue with Google"
2. Sign in with your Google account
3. Submit an issue
4. See it appear in Community Impact with real data!

## For Phone Auth Testing
- Use your real phone number
- Format: +91XXXXXXXXXX (for India)
- You'll receive a real OTP via SMS

## Important Notes
- Data is now permanently stored in Firestore
- All users can read/write (test mode)
- For production, add security rules
- Free tier: 50K reads/20K writes per day
