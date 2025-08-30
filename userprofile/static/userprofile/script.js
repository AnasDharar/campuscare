// CampusCare Profile Page JavaScript

class ProfileManager {
    constructor() {
        this.currentTheme = localStorage.getItem('campuscare-theme') || 'light';
        this.userProfile = this.loadUserProfile();
        this.therapies = this.loadTherapies();
        this.tests = this.loadTests();
        this.testResults = this.loadTestResults();
        
        this.init();
    }

    init() {
        this.setupTheme();
        this.setupEventListeners();
        this.renderProfile();
        this.renderTherapies();
        this.renderTests();
        this.renderAppointments();
        this.setCurrentDate();
    }

    // Theme Management
    setupTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateThemeIcon();
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('campuscare-theme', this.currentTheme);
        this.updateThemeIcon();
    }

    updateThemeIcon() {
        const themeToggle = document.getElementById('themeToggle');
        const icon = themeToggle.querySelector('i');
        
        if (this.currentTheme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }

    // Event Listeners
    setupEventListeners() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Profile form submission
        document.getElementById('profileForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProfile();
        });

        // Therapy form submission
        document.getElementById('therapyForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTherapy();
        });

        // Test form submission
        document.getElementById('testResultForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTest();
        });

        // Listen for test results updates from other pages
        window.addEventListener('storage', (e) => {
            if (e.key === 'campuscare-profile-update') {
                this.testResults = this.loadTestResults();
                this.renderTests();
            }
        });

        // Listen for same-page test results updates
        window.addEventListener('testResultsUpdated', (e) => {
            this.testResults = e.detail.testResults;
            this.renderTests();
        });
    }

    // Profile Management
    loadUserProfile() {
        const saved = localStorage.getItem('campuscare-user-profile');
        if (saved) {
            return JSON.parse(saved);
        }
        
        // Default profile
        return {
            username: 'student123',
            fullName: 'Alex Johnson',
            collegeName: 'University of Technology',
            email: 'alex.johnson@university.edu'
        };
    }

    saveProfile() {
        const formData = new FormData(document.getElementById('profileForm'));
        
        this.userProfile = {
            username: formData.get('username'),
            fullName: formData.get('fullName'),
            collegeName: formData.get('collegeName'),
            email: formData.get('email') || ''
        };

        localStorage.setItem('campuscare-user-profile', JSON.stringify(this.userProfile));
        this.renderProfile();
        this.toggleEditMode();
        
        // Show success message
        this.showNotification('Profile updated successfully!', 'success');
    }

    renderProfile() {
        document.getElementById('displayName').textContent = this.userProfile.fullName;
        document.getElementById('displayCollege').textContent = this.userProfile.collegeName;
        document.getElementById('displayEmail').textContent = this.userProfile.email || 'No email provided';
        
        // Populate edit form
        document.getElementById('username').value = this.userProfile.username;
        document.getElementById('fullName').value = this.userProfile.fullName;
        document.getElementById('collegeName').value = this.userProfile.collegeName;
        document.getElementById('email').value = this.userProfile.email || '';
    }

    // Therapy Management
    loadTherapies() {
        const saved = localStorage.getItem('campuscare-therapies');
        return saved ? JSON.parse(saved) : [
            {
                id: 1,
                date: '2024-01-15',
                notes: 'Discussed stress management techniques and coping strategies for exam anxiety.'
            },
            {
                id: 2,
                date: '2024-01-08',
                notes: 'Explored mindfulness exercises and breathing techniques for daily stress relief.'
            }
        ];
    }

    addTherapy() {
        const formData = new FormData(document.getElementById('therapyForm'));
        
        const newTherapy = {
            id: Date.now(),
            date: formData.get('sessionDate'),
            notes: formData.get('sessionNotes')
        };

        this.therapies.unshift(newTherapy);
        localStorage.setItem('campuscare-therapies', JSON.stringify(this.therapies));
        
        this.renderTherapies();
        this.closeTherapyModal();
        this.showNotification('Therapy session added successfully!', 'success');
    }

    renderTherapies() {
        const therapiesList = document.getElementById('therapiesList');
        const noTherapies = document.getElementById('noTherapies');
        
        if (this.therapies.length === 0) {
            therapiesList.style.display = 'none';
            noTherapies.style.display = 'block';
            return;
        }

        therapiesList.style.display = 'block';
        noTherapies.style.display = 'none';
        
        therapiesList.innerHTML = this.therapies.map(therapy => `
            <div class="therapy-item">
                <div class="therapy-header">
                    <div class="therapy-date">${this.formatDate(therapy.date)}</div>
                    <button class="delete-btn" onclick="profileManager.removeTherapy(${therapy.id})" title="Delete session">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="therapy-notes">${therapy.notes}</div>
            </div>
        `).join('');
    }

    removeTherapy(therapyId) {
        if (confirm('Are you sure you want to delete this therapy session?')) {
            this.therapies = this.therapies.filter(therapy => therapy.id !== therapyId);
            localStorage.setItem('campuscare-therapies', JSON.stringify(this.therapies));
            this.renderTherapies();
            this.showNotification('Therapy session deleted successfully!', 'success');
        }
    }

    // Test Management
    loadTests() {
        const saved = localStorage.getItem('campuscare-tests');
        return saved ? JSON.parse(saved) : [
            {
                id: 1,
                name: 'PHQ-9 (Depression)',
                date: '2024-01-20',
                score: 12,
                maxScore: 27
            },
            {
                id: 2,
                name: 'GAD-7 (Anxiety)',
                date: '2024-01-18',
                score: 8,
                maxScore: 21
            },
            {
                id: 3,
                name: 'PSS-10 (Stress)',
                date: '2024-01-15',
                score: 18,
                maxScore: 40
            }
        ];
    }

    addTest() {
        const formData = new FormData(document.getElementById('testResultForm'));
        
        const newTest = {
            id: Date.now(),
            name: formData.get('testName'),
            date: formData.get('testDate'),
            score: parseInt(formData.get('testScore')),
            maxScore: parseInt(formData.get('maxScore'))
        };

        this.tests.unshift(newTest);
        
        // Keep only the 10 most recent tests
        if (this.tests.length > 10) {
            this.tests = this.tests.slice(0, 10);
        }
        
        localStorage.setItem('campuscare-tests', JSON.stringify(this.tests));
        
        this.renderTests();
        this.closeTestModal();
        this.showNotification('Test result added successfully!', 'success');
    }

    renderTests() {
        const testsList = document.getElementById('testsList');
        const noTests = document.getElementById('noTests');
        
        // Combine legacy tests and new testResults
        const allTests = [...this.tests];
        
        // Add testResults to the display
        this.testResults.forEach(result => {
            // Determine category based on test type and score
            let category = '';
            let maxScore = 0;
            
            if (result.testName === 'PHQ-9') {
                maxScore = 27;
                if (result.score <= 4) category = 'Minimal';
                else if (result.score <= 9) category = 'Mild';
                else if (result.score <= 14) category = 'Moderate';
                else if (result.score <= 19) category = 'Moderately Severe';
                else category = 'Severe';
            } else if (result.testName === 'GAD-7') {
                maxScore = 21;
                if (result.score <= 4) category = 'Minimal';
                else if (result.score <= 9) category = 'Mild';
                else if (result.score <= 14) category = 'Moderate';
                else category = 'Severe';
            } else if (result.testName === 'PSS-10') {
                maxScore = 40;
                if (result.score <= 13) category = 'Low';
                else if (result.score <= 26) category = 'Moderate';
                else category = 'High';
            } else if (result.testName === 'Sleep Quality Test') {
                maxScore = 15;
                if (result.score <= 5) category = 'Good';
                else if (result.score <= 10) category = 'Fair';
                else category = 'Poor';
            }
            
            allTests.push({
                name: result.testName,
                score: result.score,
                maxScore: maxScore,
                category: category,
                date: result.date
            });
        });
        
        if (allTests.length === 0) {
            testsList.style.display = 'none';
            noTests.style.display = 'block';
            return;
        }

        testsList.style.display = 'block';
        noTests.style.display = 'none';
        
        // Sort by date (newest first) and show only the 5 most recent tests
        const recentTests = allTests
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);
        
        testsList.innerHTML = recentTests.map(test => `
            <div class="test-item">
                <div class="test-header">
                    <span class="test-name">${test.name}</span>
                    <span class="test-score">${test.score}/${test.maxScore}</span>
                </div>
                <div class="test-details">
                    ${test.category ? `<div class="test-category">${test.category}</div>` : ''}
                    <div class="test-date">${this.formatDate(test.date)}</div>
                </div>
            </div>
        `).join('');
    }

    // Test Results Management
    loadTestResults() {
        return JSON.parse(localStorage.getItem('campuscare-testResults') || '[]');
    }

    // Appointment Management
    loadAppointments() {
        return JSON.parse(localStorage.getItem('campuscare-appointments') || '[]');
    }

    renderAppointments() {
        const upcomingAppointments = document.getElementById('upcomingAppointments');
        const noAppointments = document.getElementById('noAppointments');
        
        if (!upcomingAppointments) return;
        
        const appointments = this.loadAppointments();
        const now = new Date();
        const futureAppointments = appointments
            .filter(apt => new Date(apt.date + 'T' + apt.time) > now)
            .sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time));
        
        if (futureAppointments.length === 0) {
            upcomingAppointments.style.display = 'none';
            noAppointments.style.display = 'block';
            return;
        }

        upcomingAppointments.style.display = 'block';
        noAppointments.style.display = 'none';
        
        upcomingAppointments.innerHTML = futureAppointments.map(apt => `
            <div class="appointment-item">
                <div class="appointment-header">
                    <span class="appointment-type">${this.getAppointmentTypeLabel(apt.type)}</span>
                    <div class="appointment-actions">
                        <span class="appointment-status">Scheduled</span>
                        <button class="btn-cancel" onclick="cancelAppointment('${apt.id}')" title="Cancel Appointment">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <div class="appointment-details">
                    <div class="appointment-datetime">
                        <i class="fas fa-calendar"></i> ${this.formatDate(apt.date)}
                        <i class="fas fa-clock"></i> ${this.formatTime(apt.time)}
                    </div>
                    ${apt.notes ? `<div class="appointment-notes">${apt.notes}</div>` : ''}
                </div>
            </div>
        `).join('');
    }

    getAppointmentTypeLabel(type) {
        const types = {
            'counseling': 'Individual Counseling',
            'group': 'Group Therapy',
            'psychiatric': 'Psychiatric Consultation',
            'crisis': 'Crisis Intervention'
        };
        return types[type] || type;
    }

    formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    }

    // Utility Functions
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    setCurrentDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('sessionDate').value = today;
        document.getElementById('testDate').value = today;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 0.5rem;
            padding: 1rem 1.5rem;
            box-shadow: var(--shadow-lg);
            z-index: 1001;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}



// Global function for canceling appointments
function cancelAppointment(appointmentId) {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
        return;
    }

    // Load appointments from localStorage
    let appointments = JSON.parse(localStorage.getItem('campuscare-appointments') || '[]');
    
    // Remove the appointment with the matching ID
    appointments = appointments.filter(apt => apt.id !== appointmentId);
    
    // Save updated appointments back to localStorage
    localStorage.setItem('campuscare-appointments', JSON.stringify(appointments));
    
    // Refresh appointments display
    window.profileManager.renderAppointments();
    
    // Show success message
    window.profileManager.showNotification('Appointment cancelled successfully!', 'success');
}

// Global function for booking appointments
function bookAppointment() {
    const type = document.getElementById('appointmentType').value;
    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;
    const notes = document.getElementById('appointmentNotes').value;

    if (!type || !date || !time) {
        alert('Please fill in all required fields.');
        return;
    }

    // Check if the selected date/time is in the future
    const appointmentDateTime = new Date(date + 'T' + time);
    const now = new Date();
    
    if (appointmentDateTime <= now) {
        alert('Please select a future date and time.');
        return;
    }

    const appointment = {
        id: Date.now().toString(),
        type: type,
        date: date,
        time: time,
        notes: notes,
        status: 'scheduled',
        createdAt: new Date().toISOString()
    };

    // Save to localStorage
    const appointments = JSON.parse(localStorage.getItem('campuscare-appointments') || '[]');
    appointments.push(appointment);
    localStorage.setItem('campuscare-appointments', JSON.stringify(appointments));

    // Clear form
    document.getElementById('appointmentType').value = '';
    document.getElementById('appointmentDate').value = '';
    document.getElementById('appointmentTime').value = '';
    document.getElementById('appointmentNotes').value = '';

    // Refresh appointments display
    window.profileManager.renderAppointments();
    
    // Show success message
    window.profileManager.showNotification('Appointment booked successfully!', 'success');
}

// Global Functions (for HTML onclick handlers)
function toggleEditMode() {
    const editForm = document.getElementById('editForm');
    editForm.classList.toggle('hidden');
}

function addTherapySession() {
    document.getElementById('therapyModal').classList.remove('hidden');
    document.getElementById('sessionDate').focus();
}

function closeTherapyModal() {
    document.getElementById('therapyModal').classList.add('hidden');
    document.getElementById('therapyForm').reset();
}

function addTestResult() {
    document.getElementById('testModal').classList.remove('hidden');
    document.getElementById('testName').focus();
}

function closeTestModal() {
    document.getElementById('testModal').classList.add('hidden');
    document.getElementById('testResultForm').reset();
}

function bookAppointment() {
    const type = document.getElementById('appointmentType').value;
    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;
    const notes = document.getElementById('appointmentNotes').value;

    if (!type || !date || !time) {
        alert('Please fill in all required fields.');
        return;
    }

    // Check if the selected date/time is in the future
    const appointmentDateTime = new Date(date + 'T' + time);
    const now = new Date();
    
    if (appointmentDateTime <= now) {
        alert('Please select a future date and time.');
        return;
    }

    const appointment = {
        id: Date.now().toString(),
        type: type,
        date: date,
        time: time,
        notes: notes,
        status: 'scheduled',
        createdAt: new Date().toISOString()
    };

    // Save to localStorage
    const appointments = JSON.parse(localStorage.getItem('campuscare-appointments') || '[]');
    appointments.push(appointment);
    localStorage.setItem('campuscare-appointments', JSON.stringify(appointments));

    // Clear form
    document.getElementById('appointmentType').value = '';
    document.getElementById('appointmentDate').value = '';
    document.getElementById('appointmentTime').value = '';
    document.getElementById('appointmentNotes').value = '';

    // Refresh appointments display
    window.profileManager.renderAppointments();
    
    // Show success message
    window.profileManager.showNotification('Appointment booked successfully!', 'success');
}

// Initialize the profile manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.profileManager = new ProfileManager();
});

// Close modals when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.add('hidden');
    }
});

// Close modals with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
    }
});
