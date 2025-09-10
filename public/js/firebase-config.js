// Firebase Configuration for CivicConnect
// This provides authentication and database services

// Firebase configuration - Using a working demo project
// For production, replace with your own Firebase config from console.firebase.google.com
const firebaseConfig = {
    apiKey: "AIzaSyDOCAbC123dEf456GhI789jKl012mNOp345",
    authDomain: "civic-connect-demo.firebaseapp.com",
    projectId: "civic-connect-demo",
    storageBucket: "civic-connect-demo.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456789"
};

// Note: Since we don't have a real Firebase project, authentication won't work
// For now, we'll use localStorage to simulate authentication

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = firebase.auth();
const db = firebase.firestore();

// Enable offline persistence for Firestore
db.enablePersistence()
    .catch((err) => {
        if (err.code == 'failed-precondition') {
            console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code == 'unimplemented') {
            console.log('The current browser does not support offline persistence');
        }
    });

// Google Auth Provider
const googleProvider = new firebase.auth.GoogleAuthProvider();

// Configure reCAPTCHA for phone auth
window.recaptchaVerifier = null;

function setupRecaptcha(buttonId) {
    if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(buttonId, {
            'size': 'invisible',
            'callback': (response) => {
                console.log('reCAPTCHA solved');
            }
        });
    }
}

// Google Sign In
async function signInWithGoogle() {
    try {
        const result = await auth.signInWithPopup(googleProvider);
        const user = result.user;
        
        // Save user data to Firestore
        await db.collection('users').doc(user.uid).set({
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        
        console.log('User signed in:', user.displayName);
        return user;
    } catch (error) {
        console.error('Error during Google sign in:', error);
        throw error;
    }
}

// Phone Number Sign In
async function signInWithPhone(phoneNumber) {
    try {
        setupRecaptcha('phone-auth-button');
        const appVerifier = window.recaptchaVerifier;
        
        const confirmationResult = await auth.signInWithPhoneNumber(phoneNumber, appVerifier);
        window.confirmationResult = confirmationResult;
        
        return confirmationResult;
    } catch (error) {
        console.error('Error during phone sign in:', error);
        throw error;
    }
}

// Verify OTP
async function verifyOTP(code) {
    try {
        if (!window.confirmationResult) {
            throw new Error('No confirmation result available');
        }
        
        const result = await window.confirmationResult.confirm(code);
        const user = result.user;
        
        // Save user data to Firestore
        await db.collection('users').doc(user.uid).set({
            phoneNumber: user.phoneNumber,
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        
        console.log('User signed in with phone:', user.phoneNumber);
        return user;
    } catch (error) {
        console.error('Error verifying OTP:', error);
        throw error;
    }
}

// Sign Out
async function signOut() {
    try {
        await auth.signOut();
        console.log('User signed out');
    } catch (error) {
        console.error('Error signing out:', error);
    }
}

// Check auth state
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        console.log('User is signed in:', user.email || user.phoneNumber);
        updateUIForSignedInUser(user);
    } else {
        // User is signed out
        console.log('User is signed out');
        updateUIForSignedOutUser();
    }
});

// UI Update functions
function updateUIForSignedInUser(user) {
    // Hide login/register buttons
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
        authButtons.innerHTML = `
            <div class="dropdown">
                <button class="btn btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <i class="fas fa-user-circle"></i> ${user.displayName || user.phoneNumber || 'User'}
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="report.html">My Reports</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" onclick="signOut()">Sign Out</a></li>
                </ul>
            </div>
        `;
    }
}

function updateUIForSignedOutUser() {
    // Show login/register buttons
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
        authButtons.innerHTML = `
            <button class="btn btn-auth btn-login" data-bs-toggle="modal" data-bs-target="#loginModal">
                <i class="fas fa-sign-in-alt"></i> Login
            </button>
            <button class="btn btn-auth btn-register" data-bs-toggle="modal" data-bs-target="#registerModal">
                <i class="fas fa-user-plus"></i> Register
            </button>
        `;
    }
}

// Issues Management with Firestore
async function submitIssueToFirestore(issueData) {
    try {
        const user = auth.currentUser;
        const issueWithMetadata = {
            ...issueData,
            userId: user ? user.uid : 'anonymous',
            userEmail: user ? (user.email || user.phoneNumber) : 'anonymous',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'pending'
        };
        
        const docRef = await db.collection('issues').add(issueWithMetadata);
        console.log('Issue submitted with ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error submitting issue:', error);
        throw error;
    }
}

async function getIssuesFromFirestore() {
    try {
        const snapshot = await db.collection('issues')
            .orderBy('createdAt', 'desc')
            .limit(50)
            .get();
        
        const issues = [];
        snapshot.forEach(doc => {
            issues.push({ id: doc.id, ...doc.data() });
        });
        
        return issues;
    } catch (error) {
        console.error('Error getting issues:', error);
        return [];
    }
}

async function getStatisticsFromFirestore() {
    try {
        const snapshot = await db.collection('issues').get();
        
        let pending = 0, inProgress = 0, resolved = 0;
        snapshot.forEach(doc => {
            const status = doc.data().status;
            if (status === 'pending') pending++;
            else if (status === 'in_progress') inProgress++;
            else if (status === 'resolved') resolved++;
        });
        
        return {
            total: snapshot.size,
            pending,
            inProgress,
            resolved
        };
    } catch (error) {
        console.error('Error getting statistics:', error);
        return { total: 0, pending: 0, inProgress: 0, resolved: 0 };
    }
}
