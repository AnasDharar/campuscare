// CampusCare Profile Page JavaScript

class ProfileManager {
    constructor() {
        this.currentTheme = localStorage.getItem('campuscare-theme') || 'light';
        this.userProfile = this.loadUserProfile();
        this.therapies = this.loadTherapies();
        this.tests = this.loadTests();
        
        this.init();
    }

    init() {
        this.setupTheme();
        this.setupEventListeners();
        this.renderProfile();
        this.renderTherapies();
        this.renderTests();
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
        
        if (this.tests.length === 0) {
            testsList.style.display = 'none';
            noTests.style.display = 'block';
            return;
        }

        testsList.style.display = 'block';
        noTests.style.display = 'none';
        
        // Show only the 3 most recent tests
        const recentTests = this.tests.slice(0, 3);
        
        testsList.innerHTML = recentTests.map(test => `
            <div class="test-item">
                <div class="test-header">
                    <span class="test-name">${test.name}</span>
                    <span class="test-score">${test.score}/${test.maxScore}</span>
                </div>
                <div class="test-date">${this.formatDate(test.date)}</div>
            </div>
        `).join('');
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



// Initialize the profile manager when the page loads
let profileManager;
document.addEventListener('DOMContentLoaded', () => {
    profileManager = new ProfileManager();
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
