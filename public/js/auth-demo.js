// Demo Authentication System (Works without Firebase)
// This is for demonstration purposes - replace with real Firebase in production

// Simulated user database
const demoUsers = JSON.parse(localStorage.getItem('demoUsers')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Initialize auth state
document.addEventListener('DOMContentLoaded', function() {
    checkAuthState();
});

// Check authentication state
function checkAuthState() {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        updateUIForSignedInUser(currentUser);
    } else {
        updateUIForSignedOutUser();
    }
}

// Google Sign In (Demo)
async function handleGoogleLogin() {
    try {
        // Simulate Google login
        const user = {
            uid: 'google_' + Date.now(),
            displayName: 'Demo User',
            email: 'demo@gmail.com',
            photoURL: 'https://ui-avatars.com/api/?name=Demo+User&background=667eea&color=fff',
            provider: 'google'
        };
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        currentUser = user;
        
        // Update UI
        updateUIForSignedInUser(user);
        
        // Close modal
        const modals = document.querySelectorAll('.modal.show');
        modals.forEach(modal => {
            const bsModal = bootstrap.Modal.getInstance(modal);
            if (bsModal) bsModal.hide();
        });
        
        // Show success
        alert(`Welcome ${user.displayName}!`);
        
        // Redirect after a moment
        setTimeout(() => {
            if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
                window.location.href = 'report.html';
            }
        }, 1000);
        
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
}

// Phone login functions
let phoneOTPSent = false;
let sentOTP = '';

function showPhoneInput() {
    document.getElementById('phoneInputSection').style.display = 'block';
}

function showPhoneInputRegister() {
    document.getElementById('phoneInputSectionRegister').style.display = 'block';
}

async function handlePhoneLogin() {
    const phoneNumber = document.getElementById('phoneNumber').value;
    if (!phoneNumber) {
        alert('Please enter a phone number');
        return;
    }
    
    // Generate random 6-digit OTP
    sentOTP = Math.floor(100000 + Math.random() * 900000).toString();
    phoneOTPSent = true;
    
    // Show OTP in alert (in real app, this would be sent via SMS)
    alert(`Demo OTP: ${sentOTP}\n(In production, this would be sent via SMS)`);
    
    // Show OTP input section
    document.getElementById('phoneInputSection').style.display = 'none';
    document.getElementById('otpInputSection').style.display = 'block';
}

async function handlePhoneRegister() {
    const phoneNumber = document.getElementById('phoneNumberRegister').value;
    if (!phoneNumber) {
        alert('Please enter a phone number');
        return;
    }
    
    // Generate random 6-digit OTP
    sentOTP = Math.floor(100000 + Math.random() * 900000).toString();
    phoneOTPSent = true;
    
    // Show OTP in alert
    alert(`Demo OTP: ${sentOTP}\n(In production, this would be sent via SMS)`);
    
    // Show OTP input section
    document.getElementById('phoneInputSectionRegister').style.display = 'none';
    document.getElementById('otpInputSectionRegister').style.display = 'block';
}

async function handleOTPVerification() {
    const otpCode = document.getElementById('otpCode').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    
    if (!otpCode) {
        alert('Please enter the OTP');
        return;
    }
    
    if (otpCode !== sentOTP) {
        alert('Invalid OTP. Please try again.');
        return;
    }
    
    // Create user session
    const user = {
        uid: 'phone_' + Date.now(),
        phoneNumber: phoneNumber,
        displayName: phoneNumber,
        provider: 'phone'
    };
    
    // Save to localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
    currentUser = user;
    
    // Update UI
    updateUIForSignedInUser(user);
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
    if (modal) modal.hide();
    
    alert('Login successful!');
    
    // Redirect
    setTimeout(() => {
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
            window.location.href = 'report.html';
        }
    }, 1000);
}

async function handleOTPVerificationRegister() {
    const otpCode = document.getElementById('otpCodeRegister').value;
    const phoneNumber = document.getElementById('phoneNumberRegister').value;
    
    if (!otpCode) {
        alert('Please enter the OTP');
        return;
    }
    
    if (otpCode !== sentOTP) {
        alert('Invalid OTP. Please try again.');
        return;
    }
    
    // Create user session
    const user = {
        uid: 'phone_' + Date.now(),
        phoneNumber: phoneNumber,
        displayName: phoneNumber,
        provider: 'phone'
    };
    
    // Save to localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
    currentUser = user;
    
    // Update UI
    updateUIForSignedInUser(user);
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
    if (modal) modal.hide();
    
    alert('Registration successful!');
    
    // Redirect
    setTimeout(() => {
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
            window.location.href = 'report.html';
        }
    }, 1000);
}

// Sign Out
async function signOut() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    updateUIForSignedOutUser();
    alert('You have been signed out');
    
    // Redirect to home
    if (!window.location.pathname.includes('index.html') && window.location.pathname !== '/') {
        window.location.href = 'index.html';
    }
}

// UI Update functions
function updateUIForSignedInUser(user) {
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

// Issue Management (using localStorage instead of Firestore)
async function submitIssueToFirestore(issueData) {
    try {
        // Get existing issues
        const issues = JSON.parse(localStorage.getItem('civicIssues')) || [];
        
        // Add new issue
        const newIssue = {
            ...issueData,
            id: 'issue_' + Date.now(),
            userId: currentUser ? currentUser.uid : 'anonymous',
            userEmail: currentUser ? (currentUser.email || currentUser.phoneNumber) : 'anonymous',
            createdAt: new Date().toISOString(),
            status: 'pending'
        };
        
        issues.unshift(newIssue);
        
        // Save to localStorage
        localStorage.setItem('civicIssues', JSON.stringify(issues));
        
        console.log('Issue submitted with ID:', newIssue.id);
        return newIssue.id;
    } catch (error) {
        console.error('Error submitting issue:', error);
        throw error;
    }
}

async function getIssuesFromFirestore() {
    try {
        const issues = JSON.parse(localStorage.getItem('civicIssues')) || [];
        return issues;
    } catch (error) {
        console.error('Error getting issues:', error);
        return [];
    }
}

async function getStatisticsFromFirestore() {
    try {
        const issues = JSON.parse(localStorage.getItem('civicIssues')) || [];
        
        let pending = 0, inProgress = 0, resolved = 0;
        issues.forEach(issue => {
            if (issue.status === 'pending') pending++;
            else if (issue.status === 'in_progress') inProgress++;
            else if (issue.status === 'resolved') resolved++;
        });
        
        return {
            total: issues.length,
            pending,
            inProgress,
            resolved
        };
    } catch (error) {
        console.error('Error getting statistics:', error);
        return { total: 0, pending: 0, inProgress: 0, resolved: 0 };
    }
}
