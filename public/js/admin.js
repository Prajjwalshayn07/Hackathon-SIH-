// Admin Dashboard JavaScript

const API_URL = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api`;
let allIssues = [];
let charts = {};
let currentIssueId = null;

// Check admin authentication
function checkAdminAuth() {
    return sessionStorage.getItem('adminAuth') === 'true';
}

// Initialize Admin Dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Simple admin authentication
    if (!checkAdminAuth()) {
        const password = prompt('Enter admin password:');
        if (password !== 'admin123') { // Change this to your desired password
            alert('Access denied!');
            window.location.href = 'index.html';
            return;
        } else {
            sessionStorage.setItem('adminAuth', 'true');
        }
    }
    
    loadDashboardData();
    setupNavigation();
    setupEventListeners();
    
    // Refresh data every 30 seconds
    setInterval(loadDashboardData, 30000);
});

// Setup Navigation
function setupNavigation() {
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.dataset.tab) {
                e.preventDefault();
                switchTab(this.dataset.tab);
                
                // Update active state
                document.querySelectorAll('.sidebar .nav-link').forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

// Setup Event Listeners
function setupEventListeners() {
    document.getElementById('saveChangesBtn').addEventListener('click', saveIssueChanges);
}

// Switch Tab
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    
    document.getElementById(tabName).style.display = 'block';
    
    // Load specific tab data
    if (tabName === 'issues') {
        loadAllIssues();
    } else if (tabName === 'analytics') {
        loadAnalytics();
    }
}

// Load Dashboard Data
async function loadDashboardData() {
    try {
        // Load issues from localStorage
        const issues = JSON.parse(localStorage.getItem('civicIssues')) || [];
        allIssues = issues;
        
        // Calculate statistics from local data
        const stats = calculateStatistics(issues);
        
        updateStatistics(stats);
        updateCharts(stats);
        
        // Display recent issues
        displayRecentIssues(issues.slice(0, 5));
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Calculate statistics from issues
function calculateStatistics(issues) {
    const stats = {
        total: issues.length,
        byStatus: [],
        byCategory: [],
        byDepartment: []
    };
    
    // Count by status
    const statusCounts = {};
    const categoryCounts = {};
    const departmentCounts = {};
    
    issues.forEach(issue => {
        // Status
        statusCounts[issue.status] = (statusCounts[issue.status] || 0) + 1;
        
        // Category
        categoryCounts[issue.category] = (categoryCounts[issue.category] || 0) + 1;
        
        // Department
        const dept = issue.department || 'Unassigned';
        departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
    });
    
    // Convert to array format
    stats.byStatus = Object.entries(statusCounts).map(([status, count]) => ({ status, count }));
    stats.byCategory = Object.entries(categoryCounts).map(([category, count]) => ({ category, count }));
    stats.byDepartment = Object.entries(departmentCounts).map(([department, count]) => ({ department, count }));
    
    return stats;
}

// Update Statistics
function updateStatistics(stats) {
    const total = stats.total || 0;
    document.getElementById('statTotal').textContent = total;
    
    const statusCounts = {
        pending: 0,
        in_progress: 0,
        resolved: 0
    };
    
    if (stats.byStatus) {
        stats.byStatus.forEach(item => {
            statusCounts[item.status] = item.count;
        });
    }
    
    document.getElementById('statPending').textContent = statusCounts.pending;
    document.getElementById('statInProgress').textContent = statusCounts.in_progress;
    document.getElementById('statResolved').textContent = statusCounts.resolved;
    
    // Add visual feedback for status changes
    animateStatusChange('statPending', statusCounts.pending);
    animateStatusChange('statInProgress', statusCounts.in_progress);
    animateStatusChange('statResolved', statusCounts.resolved);
}

// Animate status change with visual feedback
function animateStatusChange(elementId, newValue) {
    const element = document.getElementById(elementId);
    if (element) {
        const currentValue = parseInt(element.textContent);
        if (currentValue !== newValue) {
            element.style.transform = 'scale(1.2)';
            element.style.transition = 'transform 0.3s ease';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 300);
        }
    }
}

// Update Charts
function updateCharts(stats) {
    // Category Chart
    if (stats.byCategory) {
        const categoryCtx = document.getElementById('categoryChart').getContext('2d');
        
        if (charts.category) {
            charts.category.destroy();
        }
        
        charts.category = new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: stats.byCategory.map(item => formatCategory(item.category)),
                datasets: [{
                    data: stats.byCategory.map(item => item.count),
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9F40',
                        '#FF6384',
                        '#C9CBCF'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // Department Chart
    if (stats.byDepartment) {
        const deptCtx = document.getElementById('departmentChart').getContext('2d');
        
        if (charts.department) {
            charts.department.destroy();
        }
        
        charts.department = new Chart(deptCtx, {
            type: 'bar',
            data: {
                labels: stats.byDepartment.map(item => item.department || 'Unassigned'),
                datasets: [{
                    label: 'Issues',
                    data: stats.byDepartment.map(item => item.count),
                    backgroundColor: '#36A2EB'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }
}

// Display Recent Issues
function displayRecentIssues(issues) {
    const container = document.getElementById('recentIssuesTable');
    
    if (issues.length === 0) {
        container.innerHTML = '<p>No recent issues.</p>';
        return;
    }
    
    container.innerHTML = `
        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${issues.map(issue => `
                        <tr>
                            <td>#${issue.id}</td>
                            <td>${escapeHtml(issue.title)}</td>
                            <td>${formatCategory(issue.category)}</td>
                            <td><span class="badge badge-${issue.status}">${formatStatus(issue.status)}</span></td>
                            <td>${formatDate(issue.created_at)}</td>
                            <td>
                                <button class="btn btn-sm btn-primary" onclick="viewIssueDetail(${issue.id})">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Load All Issues
async function loadAllIssues() {
    try {
        const issues = JSON.parse(localStorage.getItem('civicIssues')) || [];
        allIssues = issues;
        displayIssuesTable(allIssues);
    } catch (error) {
        console.error('Error loading issues:', error);
    }
}

// Display Issues Table
function displayIssuesTable(issues) {
    const tbody = document.getElementById('issuesTableBody');
    
    if (issues.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">No issues found.</td></tr>';
        return;
    }
    
    tbody.innerHTML = issues.map(issue => `
        <tr>
            <td>#${issue.id}</td>
            <td>${escapeHtml(issue.title)}</td>
            <td>${formatCategory(issue.category)}</td>
            <td>
                <span class="badge badge-${issue.status}">${formatStatus(issue.status)}</span>
                <div class="btn-group btn-group-sm mt-1" role="group">
                    ${issue.status !== 'pending' ? '' : `
                        <button class="btn btn-sm btn-outline-info" onclick="quickUpdateStatus('${issue.id}', 'in_progress')" title="Start Progress">
                            <i class="fas fa-play"></i>
                        </button>
                    `}
                    ${issue.status !== 'resolved' ? `
                        <button class="btn btn-sm btn-outline-success" onclick="quickUpdateStatus('${issue.id}', 'resolved')" title="Mark Resolved">
                            <i class="fas fa-check"></i>
                        </button>
                    ` : ''}
                    ${issue.status === 'resolved' ? `
                        <button class="btn btn-sm btn-outline-warning" onclick="quickUpdateStatus('${issue.id}', 'pending')" title="Reopen">
                            <i class="fas fa-undo"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
            <td><span class="priority-${issue.priority}">${issue.priority}</span></td>
            <td>${issue.department || 'Unassigned'}</td>
            <td>${formatDate(issue.created_at)}</td>
            <td class="action-buttons">
                <button class="btn btn-sm btn-primary" onclick="viewIssueDetail('${issue.id}')" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-warning" onclick="editIssue('${issue.id}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteIssue('${issue.id}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Apply Filters
function applyFilters() {
    const status = document.getElementById('filterStatus').value;
    const category = document.getElementById('filterCategory').value;
    const priority = document.getElementById('filterPriority').value;
    
    let filtered = allIssues;
    
    if (status) {
        filtered = filtered.filter(issue => issue.status === status);
    }
    if (category) {
        filtered = filtered.filter(issue => issue.category === category);
    }
    if (priority) {
        filtered = filtered.filter(issue => issue.priority === priority);
    }
    
    displayIssuesTable(filtered);
}

// Reset Filters
function resetFilters() {
    document.getElementById('filterStatus').value = '';
    document.getElementById('filterCategory').value = '';
    document.getElementById('filterPriority').value = '';
    displayIssuesTable(allIssues);
}

// View Issue Detail
async function viewIssueDetail(issueId) {
    try {
        const issues = JSON.parse(localStorage.getItem('civicIssues')) || [];
        const issue = issues.find(i => i.id === issueId || i.id === `issue_${issueId}`);
        
        if (!issue) {
            alert('Issue not found');
            return;
        }
        
        const comments = [];
        
        currentIssueId = issueId;
        
        const modalBody = document.getElementById('issueDetailBody');
        modalBody.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <h6>Issue Information</h6>
                    <p><strong>ID:</strong> #${issue.id}</p>
                    <p><strong>Title:</strong> ${escapeHtml(issue.title)}</p>
                    <p><strong>Category:</strong> ${formatCategory(issue.category)}</p>
                    <p><strong>Priority:</strong> <span class="priority-${issue.priority}">${issue.priority}</span></p>
                    <p><strong>Status:</strong> <span class="badge badge-${issue.status}">${formatStatus(issue.status)}</span></p>
                    <p><strong>Department:</strong> ${issue.department || 'Unassigned'}</p>
                    <p><strong>Created:</strong> ${formatDate(issue.created_at)}</p>
                    ${issue.resolved_at ? `<p><strong>Resolved:</strong> ${formatDate(issue.resolved_at)}</p>` : ''}
                </div>
                <div class="col-md-6">
                    <h6>Reporter Information</h6>
                    <p><strong>Name:</strong> ${escapeHtml(issue.reporter_name) || 'Anonymous'}</p>
                    <p><strong>Contact:</strong> ${escapeHtml(issue.reporter_contact) || 'Not provided'}</p>
                    <p><strong>Location:</strong> ${escapeHtml(issue.address) || 'Not specified'}</p>
                    ${issue.latitude && issue.longitude ? `<p><strong>Coordinates:</strong> ${issue.latitude}, ${issue.longitude}</p>` : ''}
                </div>
            </div>
            
            <div class="row mt-3">
                <div class="col-12">
                    <h6>Description</h6>
                    <p>${escapeHtml(issue.description) || 'No description provided'}</p>
                </div>
            </div>
            
            ${issue.image_url ? `
                <div class="row mt-3">
                    <div class="col-12">
                        <h6>Attached Image</h6>
                        <img src="${issue.image_url}" alt="Issue image" class="img-fluid" style="max-height: 300px;">
                    </div>
                </div>
            ` : ''}
            
            <div class="row mt-3">
                <div class="col-12">
                    <h6>🔧 Update Issue Status</h6>
                    <div class="alert alert-info">
                        <strong>Quick Status Update:</strong>
                        <div class="btn-group mt-2" role="group">
                            <button type="button" class="btn btn-warning" onclick="quickUpdateStatus('${issue.id}', 'pending')">
                                <i class="fas fa-clock"></i> Set Pending
                            </button>
                            <button type="button" class="btn btn-info" onclick="quickUpdateStatus('${issue.id}', 'in_progress')">
                                <i class="fas fa-spinner"></i> Set In Progress
                            </button>
                            <button type="button" class="btn btn-success" onclick="quickUpdateStatus('${issue.id}', 'resolved')">
                                <i class="fas fa-check"></i> Mark Resolved
                            </button>
                        </div>
                    </div>
                    <form id="updateForm">
                        <div class="row">
                            <div class="col-md-4">
                                <label>Current Status</label>
                                <select class="form-select" id="updateStatus">
                                    <option value="pending" ${issue.status === 'pending' ? 'selected' : ''}>Pending</option>
                                    <option value="in_progress" ${issue.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
                                    <option value="resolved" ${issue.status === 'resolved' ? 'selected' : ''}>Resolved</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label>Priority</label>
                                <select class="form-select" id="updatePriority">
                                    <option value="low" ${issue.priority === 'low' ? 'selected' : ''}>Low</option>
                                    <option value="normal" ${issue.priority === 'normal' ? 'selected' : ''}>Normal</option>
                                    <option value="high" ${issue.priority === 'high' ? 'selected' : ''}>High</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label>Assigned To</label>
                                <input type="text" class="form-control" id="updateAssignedTo" value="${issue.assigned_to || ''}" placeholder="Staff name">
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-md-6">
                                <label>Department</label>
                                <select class="form-select" id="updateDepartment">
                                    <option value="General">General</option>
                                    <option value="Public Works" ${issue.department === 'Public Works' ? 'selected' : ''}>Public Works</option>
                                    <option value="Electrical" ${issue.department === 'Electrical' ? 'selected' : ''}>Electrical</option>
                                    <option value="Sanitation" ${issue.department === 'Sanitation' ? 'selected' : ''}>Sanitation</option>
                                    <option value="Water Department" ${issue.department === 'Water Department' ? 'selected' : ''}>Water Department</option>
                                    <option value="Traffic Management" ${issue.department === 'Traffic Management' ? 'selected' : ''}>Traffic Management</option>
                                    <option value="Parks & Recreation" ${issue.department === 'Parks & Recreation' ? 'selected' : ''}>Parks & Recreation</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label>Notes</label>
                                <textarea class="form-control" id="updateNotes" rows="1">${issue.notes || ''}</textarea>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            
            <div class="row mt-3">
                <div class="col-12">
                    <h6>Comments & Updates</h6>
                    <div class="mb-2">
                        <div class="input-group">
                            <input type="text" class="form-control" id="newComment" placeholder="Add a comment...">
                            <button class="btn btn-primary" onclick="addComment(${issueId})">
                                <i class="fas fa-comment"></i> Add
                            </button>
                        </div>
                    </div>
                    <div id="commentsSection" style="max-height: 200px; overflow-y: auto;">
                        ${comments.length > 0 ? comments.map(comment => `
                            <div class="border-bottom pb-2 mb-2">
                                <small class="text-muted">${comment.author} - ${formatDate(comment.created_at)}</small>
                                <p class="mb-0">${escapeHtml(comment.comment)}</p>
                            </div>
                        `).join('') : '<p class="text-muted">No comments yet.</p>'}
                    </div>
                </div>
            </div>
        `;
        
        const modal = new bootstrap.Modal(document.getElementById('issueDetailModal'));
        modal.show();
    } catch (error) {
        console.error('Error loading issue details:', error);
        alert('Error loading issue details');
    }
}

// Edit Issue (opens detail modal in edit mode)
function editIssue(issueId) {
    viewIssueDetail(issueId);
}

// Quick Update Status (One-click status change)
function quickUpdateStatus(issueId, newStatus) {
    if (!issueId) return;
    
    // Confirm the action
    const statusText = newStatus.replace('_', ' ').toUpperCase();
    if (!confirm(`Are you sure you want to change the status to ${statusText}?`)) {
        return;
    }
    
    try {
        // Update in localStorage
        const issues = JSON.parse(localStorage.getItem('civicIssues')) || [];
        const issueIndex = issues.findIndex(i => 
            i.id === issueId || 
            i.id === `issue_${issueId}` ||
            i.id == issueId
        );
        
        if (issueIndex !== -1) {
            const oldStatus = issues[issueIndex].status;
            issues[issueIndex].status = newStatus;
            issues[issueIndex].updated_at = new Date().toISOString();
            
            // If marking as resolved, add resolution time
            if (newStatus === 'resolved' && oldStatus !== 'resolved') {
                issues[issueIndex].resolved_at = new Date().toISOString();
            }
            
            localStorage.setItem('civicIssues', JSON.stringify(issues));
            
            // Show success message with visual feedback
            const alertClass = newStatus === 'resolved' ? 'success' : 
                              newStatus === 'in_progress' ? 'info' : 'warning';
            
            // Update the modal content to show the new status
            const statusBadge = document.querySelector('#issueDetailModal .badge');
            if (statusBadge) {
                statusBadge.className = `badge badge-${newStatus}`;
                statusBadge.textContent = formatStatus(newStatus);
            }
            
            // Update the select dropdown
            const statusSelect = document.getElementById('updateStatus');
            if (statusSelect) {
                statusSelect.value = newStatus;
            }
            
            alert(`✅ Status updated to ${statusText}!`);
            
            // Reload data to update statistics
            loadDashboardData();
            loadAllIssues();
            
            // Close and reopen the modal to refresh
            bootstrap.Modal.getInstance(document.getElementById('issueDetailModal')).hide();
            setTimeout(() => viewIssueDetail(issueId), 500);
        } else {
            alert('Issue not found');
        }
    } catch (error) {
        console.error('Error updating status:', error);
        alert('Error updating status');
    }
}

// Save Issue Changes
async function saveIssueChanges() {
    if (!currentIssueId) return;
    
    const updateData = {
        status: document.getElementById('updateStatus').value,
        priority: document.getElementById('updatePriority').value,
        assigned_to: document.getElementById('updateAssignedTo').value,
        department: document.getElementById('updateDepartment').value,
        notes: document.getElementById('updateNotes').value
    };
    
    try {
        // Update in localStorage
        const issues = JSON.parse(localStorage.getItem('civicIssues')) || [];
        const issueIndex = issues.findIndex(i => i.id === currentIssueId || i.id === `issue_${currentIssueId}`);
        
        if (issueIndex !== -1) {
            issues[issueIndex] = { ...issues[issueIndex], ...updateData, updated_at: new Date().toISOString() };
            localStorage.setItem('civicIssues', JSON.stringify(issues));
            
            alert('Issue updated successfully!');
            bootstrap.Modal.getInstance(document.getElementById('issueDetailModal')).hide();
            loadAllIssues();
            loadDashboardData();
        } else {
            alert('Issue not found');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error updating issue');
    }
}

// Add Comment
async function addComment(issueId) {
    const commentText = document.getElementById('newComment').value.trim();
    
    if (!commentText) {
        alert('Please enter a comment');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/issues/${issueId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                comment: commentText,
                author: 'Admin'
            })
        });
        
        if (response.ok) {
            document.getElementById('newComment').value = '';
            viewIssueDetail(issueId); // Reload the modal
        } else {
            alert('Error adding comment');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Network error');
    }
}

// Delete Issue
async function deleteIssue(issueId) {
    if (!confirm('Are you sure you want to delete this issue?')) {
        return;
    }
    
    try {
        // Delete from localStorage
        const issues = JSON.parse(localStorage.getItem('civicIssues')) || [];
        const filteredIssues = issues.filter(i => i.id !== issueId && i.id !== `issue_${issueId}`);
        
        if (filteredIssues.length < issues.length) {
            localStorage.setItem('civicIssues', JSON.stringify(filteredIssues));
            alert('Issue deleted successfully');
            loadAllIssues();
            loadDashboardData();
        } else {
            alert('Issue not found');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error deleting issue');
    }
}

// Load Analytics
async function loadAnalytics() {
    // Generate sample trend data (in production, this would come from the API)
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        last7Days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
    }
    
    const trendsCtx = document.getElementById('trendsChart').getContext('2d');
    
    if (charts.trends) {
        charts.trends.destroy();
    }
    
    charts.trends = new Chart(trendsCtx, {
        type: 'line',
        data: {
            labels: last7Days,
            datasets: [{
                label: 'New Issues',
                data: [5, 7, 3, 8, 4, 6, 9], // Sample data
                borderColor: '#36A2EB',
                tension: 0.1
            }, {
                label: 'Resolved Issues',
                data: [3, 5, 2, 6, 3, 4, 7], // Sample data
                borderColor: '#4BC0C0',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    // Update department performance
    const deptPerf = document.getElementById('departmentPerformance');
    deptPerf.innerHTML = `
        <table class="table table-sm">
            <thead>
                <tr>
                    <th>Department</th>
                    <th>Open</th>
                    <th>Resolved</th>
                    <th>Avg. Time</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Public Works</td>
                    <td>12</td>
                    <td>45</td>
                    <td>2.3 days</td>
                </tr>
                <tr>
                    <td>Sanitation</td>
                    <td>8</td>
                    <td>32</td>
                    <td>1.5 days</td>
                </tr>
                <tr>
                    <td>Electrical</td>
                    <td>5</td>
                    <td>28</td>
                    <td>3.1 days</td>
                </tr>
            </tbody>
        </table>
    `;
}

// Utility Functions
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text ? text.replace(/[&<>"']/g, m => map[m]) : '';
}

function formatStatus(status) {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function formatCategory(category) {
    return category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

// Authentication Functions
function checkAuth() {
    const isAuthenticated = sessionStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
        window.location.href = 'login.html';
        return false;
    }
    
    // Check session timeout (30 minutes)
    const loginTime = sessionStorage.getItem('adminLoginTime');
    if (loginTime) {
        const timeDiff = new Date() - new Date(loginTime);
        const thirtyMinutes = 30 * 60 * 1000;
        
        if (timeDiff > thirtyMinutes) {
            sessionStorage.clear();
            alert('Session expired. Please login again.');
            window.location.href = 'login.html';
            return false;
        }
    }
    
    return true;
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.clear();
        window.location.href = 'login.html';
    }
}

// Check auth on page load
checkAuth();

// Check auth every 5 minutes
setInterval(checkAuth, 5 * 60 * 1000);
