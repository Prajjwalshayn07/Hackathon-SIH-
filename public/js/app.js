// Civic Issue Reporter - Main Application JavaScript

const API_URL = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api`;
let map;
let markers = [];
let currentFilter = 'all';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    loadIssues();
    loadStatistics();
    setupEventListeners();
    
    // Refresh data every 30 seconds
    setInterval(() => {
        loadIssues();
        loadStatistics();
    }, 30000);
});

// Initialize Leaflet Map
function initializeMap() {
    // Default center (Ranchi, Jharkhand)
    const defaultCenter = [23.3441, 85.3096];
    
    map = L.map('issuesMap').setView(defaultCenter, 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}

// Setup Event Listeners
function setupEventListeners() {
    // Report Form Submit
    document.getElementById('reportForm').addEventListener('submit', handleFormSubmit);
    
    // Get Location Button
    document.getElementById('getLocationBtn').addEventListener('click', getCurrentLocation);
    
    // Image Upload Preview
    document.getElementById('image').addEventListener('change', handleImagePreview);
    
    // Filter Buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', handleFilterClick);
    });
}

// Handle Form Submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('category', document.getElementById('category').value);
    formData.append('priority', document.querySelector('input[name="priority"]:checked').value);
    formData.append('latitude', document.getElementById('latitude').value);
    formData.append('longitude', document.getElementById('longitude').value);
    formData.append('address', document.getElementById('address').value);
    formData.append('reporter_name', document.getElementById('reporter_name').value);
    formData.append('reporter_contact', document.getElementById('reporter_contact').value);
    
    const imageFile = document.getElementById('image').files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    }
    
    try {
        const response = await fetch(`${API_URL}/issues`, {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            const data = await response.json();
            showSuccessModal(data.id);
            document.getElementById('reportForm').reset();
            document.getElementById('imagePreview').innerHTML = '';
            loadIssues();
            loadStatistics();
        } else {
            alert('Error submitting report. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Network error. Please check your connection.');
    }
}

// Get Current Location
function getCurrentLocation() {
    const statusDiv = document.getElementById('locationStatus');
    
    if (!navigator.geolocation) {
        statusDiv.textContent = 'Geolocation is not supported by your browser';
        return;
    }
    
    statusDiv.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Getting location...';
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            document.getElementById('latitude').value = lat;
            document.getElementById('longitude').value = lon;
            
            // Reverse geocoding to get address
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
                const data = await response.json();
                document.getElementById('address').value = data.display_name || `${lat}, ${lon}`;
                statusDiv.innerHTML = '<i class="fas fa-check text-success"></i> Location obtained';
            } catch (error) {
                document.getElementById('address').value = `${lat}, ${lon}`;
                statusDiv.innerHTML = '<i class="fas fa-check text-success"></i> Coordinates obtained';
            }
        },
        (error) => {
            statusDiv.innerHTML = '<i class="fas fa-times text-danger"></i> Unable to get location';
            console.error('Error:', error);
        }
    );
}

// Handle Image Preview
function handleImagePreview(e) {
    const file = e.target.files[0];
    const previewDiv = document.getElementById('imagePreview');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewDiv.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width: 100%; height: auto; border-radius: 5px;">`;
        };
        reader.readAsDataURL(file);
    } else {
        previewDiv.innerHTML = '';
    }
}

// Load Issues
async function loadIssues() {
    try {
        const response = await fetch(`${API_URL}/issues`);
        const data = await response.json();
        
        displayIssues(data.issues);
        updateMapMarkers(data.issues);
    } catch (error) {
        console.error('Error loading issues:', error);
    }
}

// Display Issues in List
function displayIssues(issues) {
    const container = document.getElementById('issuesContainer');
    
    // Filter issues based on current filter
    let filteredIssues = issues;
    if (currentFilter !== 'all') {
        filteredIssues = issues.filter(issue => issue.status === currentFilter);
    }
    
    if (filteredIssues.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="text-center">No issues found.</p></div>';
        return;
    }
    
    container.innerHTML = filteredIssues.map(issue => `
        <div class="col-md-6 col-lg-4 mb-3">
            <div class="card issue-card ${issue.status}">
                ${issue.image_url ? `<img src="${issue.image_url}" class="card-img-top" alt="Issue image" style="height: 200px; object-fit: cover;">` : ''}
                <div class="card-body">
                    <h5 class="card-title">${escapeHtml(issue.title)}</h5>
                    <p class="card-text">
                        <span class="badge badge-${issue.status}">${formatStatus(issue.status)}</span>
                        <span class="badge bg-secondary">${formatCategory(issue.category)}</span>
                        <span class="priority-${issue.priority}">
                            <i class="fas fa-exclamation-circle"></i> ${issue.priority}
                        </span>
                    </p>
                    <p class="card-text small">${escapeHtml(issue.description || 'No description')}</p>
                    <p class="card-text">
                        <small class="text-muted">
                            <i class="fas fa-map-marker-alt"></i> ${escapeHtml(issue.address || 'Location not specified')}
                        </small>
                    </p>
                    <p class="card-text">
                        <small class="text-muted">
                            <i class="fas fa-clock"></i> ${formatDate(issue.created_at)}
                        </small>
                    </p>
                    ${issue.department ? `<p class="card-text"><small class="text-muted"><i class="fas fa-building"></i> ${issue.department}</small></p>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Update Map Markers
function updateMapMarkers(issues) {
    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    
    // Add new markers
    issues.forEach(issue => {
        if (issue.latitude && issue.longitude) {
            const markerColor = getMarkerColor(issue.status);
            const marker = L.circleMarker([issue.latitude, issue.longitude], {
                radius: 8,
                fillColor: markerColor,
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            });
            
            marker.bindPopup(`
                <div>
                    <strong>${escapeHtml(issue.title)}</strong><br>
                    <span class="badge badge-${issue.status}">${formatStatus(issue.status)}</span><br>
                    <small>${escapeHtml(issue.description || 'No description')}</small><br>
                    <small><i class="fas fa-clock"></i> ${formatDate(issue.created_at)}</small>
                </div>
            `);
            
            marker.addTo(map);
            markers.push(marker);
        }
    });
}

// Get Marker Color Based on Status
function getMarkerColor(status) {
    switch(status) {
        case 'pending': return '#ffc107';
        case 'in_progress': return '#0dcaf0';
        case 'resolved': return '#198754';
        default: return '#6c757d';
    }
}

// Load Statistics
async function loadStatistics() {
    try {
        const response = await fetch(`${API_URL}/statistics`);
        const stats = await response.json();
        
        document.getElementById('totalIssues').textContent = stats.total || 0;
        
        const statusCounts = {
            pending: 0,
            in_progress: 0,
            resolved: 0
        };
        
        stats.byStatus.forEach(item => {
            statusCounts[item.status] = item.count;
        });
        
        document.getElementById('pendingIssues').textContent = statusCounts.pending;
        document.getElementById('inProgressIssues').textContent = statusCounts.in_progress;
        document.getElementById('resolvedIssues').textContent = statusCounts.resolved;
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

// Handle Filter Click
function handleFilterClick(e) {
    const filterValue = e.target.dataset.filter;
    currentFilter = filterValue;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.target.classList.add('active');
    
    // Reload issues with filter
    loadIssues();
}

// Show Success Modal
function showSuccessModal(issueId) {
    document.getElementById('issueId').textContent = issueId;
    const modal = new bootstrap.Modal(document.getElementById('successModal'));
    modal.show();
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
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}
