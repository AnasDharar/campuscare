// Mental Health Assessment System

// Initialize global testResults array if it doesn't exist
if (!window.testResults) {
    window.testResults = JSON.parse(localStorage.getItem('campuscare-testResults') || '[]');
}

// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('campuscare-theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme();
        this.setupEventListeners();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateThemeIcon();
    }

    updateThemeIcon() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (this.currentTheme === 'dark') {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('campuscare-theme', this.currentTheme);
        this.applyTheme();
    }

    setupEventListeners() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
}

// Mental Health Test System for CampusCare
class MentalHealthTestSystem {
    constructor() {
        this.currentTest = null;
        this.currentQuestionIndex = 0;
        this.responses = {};
        this.testData = this.initializeTestData();
        
        this.initializeEventListeners();
        this.themeManager = new ThemeManager();
        this.showScreen('test-selection');
    }

    initializeTestData() {
        return {
            phq9: {
                title: "PHQ-9 Depression Assessment",
                questions: [
                    "Little interest or pleasure in doing things",
                    "Feeling down, depressed, or hopeless",
                    "Trouble falling or staying asleep, or sleeping too much",
                    "Feeling tired or having little energy",
                    "Poor appetite or overeating",
                    "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
                    "Trouble concentrating on things, such as reading the newspaper or watching television",
                    "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
                    "Thoughts that you would be better off dead or of hurting yourself in some way"
                ],
                options: [
                    { value: 0, text: "Not at all" },
                    { value: 1, text: "Several days" },
                    { value: 2, text: "More than half the days" },
                    { value: 3, text: "Nearly every day" }
                ],
                scoring: {
                    ranges: [
                        { min: 0, max: 4, category: "Minimal Depression", class: "minimal", description: "Your responses suggest minimal depression symptoms. Continue monitoring your mental health." },
                        { min: 5, max: 9, category: "Mild Depression", class: "mild", description: "Your responses suggest mild depression symptoms. Consider speaking with a counselor or healthcare provider." },
                        { min: 10, max: 14, category: "Moderate Depression", class: "moderate", description: "Your responses suggest moderate depression symptoms. We recommend consulting with a mental health professional." },
                        { min: 15, max: 19, category: "Moderately Severe Depression", class: "severe", description: "Your responses suggest moderately severe depression symptoms. Please consider seeking professional help." },
                        { min: 20, max: 27, category: "Severe Depression", class: "very-severe", description: "Your responses suggest severe depression symptoms. We strongly recommend immediate consultation with a mental health professional." }
                    ]
                }
            },
            gad7: {
                title: "GAD-7 Anxiety Assessment",
                questions: [
                    "Feeling nervous, anxious or on edge",
                    "Not being able to stop or control worrying",
                    "Worrying too much about different things",
                    "Trouble relaxing",
                    "Being so restless that it is hard to sit still",
                    "Becoming easily annoyed or irritable",
                    "Feeling afraid as if something awful might happen"
                ],
                options: [
                    { value: 0, text: "Not at all" },
                    { value: 1, text: "Several days" },
                    { value: 2, text: "More than half the days" },
                    { value: 3, text: "Nearly every day" }
                ],
                scoring: {
                    ranges: [
                        { min: 0, max: 4, category: "Minimal Anxiety", class: "minimal", description: "Your responses suggest minimal anxiety symptoms. Your anxiety levels appear to be within normal range." },
                        { min: 5, max: 9, category: "Mild Anxiety", class: "mild", description: "Your responses suggest mild anxiety symptoms. Consider stress management techniques and monitor your symptoms." },
                        { min: 10, max: 14, category: "Moderate Anxiety", class: "moderate", description: "Your responses suggest moderate anxiety symptoms. Consider consulting with a mental health professional." },
                        { min: 15, max: 21, category: "Severe Anxiety", class: "severe", description: "Your responses suggest severe anxiety symptoms. We recommend seeking professional help for anxiety management." }
                    ]
                }
            },
            pss10: {
                title: "PSS-10 Perceived Stress Scale",
                questions: [
                    "How often have you been upset because of something that happened unexpectedly?",
                    "How often have you felt that you were unable to control the important things in your life?",
                    "How often have you felt nervous and stressed?",
                    "How often have you felt confident about your ability to handle your personal problems?", // Reverse scored
                    "How often have you felt that things were going your way?", // Reverse scored
                    "How often have you found that you could not cope with all the things that you had to do?",
                    "How often have you been able to control irritations in your life?", // Reverse scored
                    "How often have you felt that you were on top of things?", // Reverse scored
                    "How often have you been angered because of things that happened that were outside of your control?",
                    "How often have you felt difficulties were piling up so high that you could not overcome them?"
                ],
                reverseScored: [3, 4, 6, 7], // 0-indexed question numbers that are reverse scored
                options: [
                    { value: 0, text: "Never" },
                    { value: 1, text: "Almost never" },
                    { value: 2, text: "Sometimes" },
                    { value: 3, text: "Fairly often" },
                    { value: 4, text: "Very often" }
                ],
                scoring: {
                    ranges: [
                        { min: 0, max: 13, category: "Low Stress", class: "minimal", description: "Your stress levels appear to be low and manageable. Continue with your current coping strategies." },
                        { min: 14, max: 26, category: "Moderate Stress", class: "mild", description: "Your stress levels are moderate. Consider implementing stress management techniques." },
                        { min: 27, max: 40, category: "High Stress", class: "severe", description: "Your stress levels are high. We recommend seeking support and professional stress management guidance." }
                    ]
                }
            },
            sleep: {
                title: "Sleep Quality Assessment",
                questions: [
                    "During the past week, how often have you had trouble falling asleep?",
                    "During the past week, how often have you had trouble staying asleep?",
                    "During the past week, how often have you woken up too early and couldn't get back to sleep?",
                    "During the past week, how often have you felt unrested during the day, regardless of how many hours of sleep you had?",
                    "Overall, how would you rate your sleep quality during the past week?"
                ],
                options: [
                    { value: 0, text: "Not during the past week" },
                    { value: 1, text: "Less than once a week" },
                    { value: 2, text: "Once or twice a week" },
                    { value: 3, text: "Three or more times a week" }
                ],
                lastQuestionOptions: [
                    { value: 0, text: "Very good" },
                    { value: 1, text: "Fairly good" },
                    { value: 2, text: "Fairly bad" },
                    { value: 3, text: "Very bad" }
                ],
                scoring: {
                    ranges: [
                        { min: 0, max: 4, category: "Good Sleep Quality", class: "minimal", description: "Your sleep quality appears to be good. Continue maintaining healthy sleep habits." },
                        { min: 5, max: 8, category: "Fair Sleep Quality", class: "mild", description: "Your sleep quality is fair. Consider improving sleep hygiene and establishing better bedtime routines." },
                        { min: 9, max: 12, category: "Poor Sleep Quality", class: "moderate", description: "Your sleep quality is poor. Consider consulting with a healthcare provider about sleep improvement strategies." },
                        { min: 13, max: 15, category: "Very Poor Sleep Quality", class: "severe", description: "Your sleep quality is very poor. We recommend consulting with a healthcare provider or sleep specialist." }
                    ]
                }
            }
        };
    }

    initializeEventListeners() {
        // Test selection
        document.querySelectorAll('.test-card').forEach(card => {
            card.addEventListener('click', () => {
                const testType = card.dataset.test;
                this.startTest(testType);
            });
        });

        // Navigation buttons
        document.getElementById('back-to-selection').addEventListener('click', () => {
            this.showScreen('test-selection');
            this.resetTest();
        });

        document.getElementById('prev-btn').addEventListener('click', () => {
            this.previousQuestion();
        });

        document.getElementById('next-btn').addEventListener('click', () => {
            this.nextQuestion();
        });

        document.getElementById('submit-btn').addEventListener('click', () => {
            this.submitTest();
        });

        // Results actions
        document.getElementById('take-another').addEventListener('click', () => {
            this.showScreen('test-selection');
            this.resetTest();
        });
    }

    startTest(testType) {
        this.currentTest = testType;
        this.currentQuestionIndex = 0;
        this.responses = {};
        
        const testInfo = this.testData[testType];
        document.getElementById('current-test-title').textContent = testInfo.title;
        
        this.showScreen('test-taking');
        this.renderQuestion();
        this.updateProgress();
        this.updateNavigationButtons();
    }

    renderQuestion() {
        const testInfo = this.testData[this.currentTest];
        const question = testInfo.questions[this.currentQuestionIndex];
        
        document.getElementById('question-number').textContent = `Question ${this.currentQuestionIndex + 1}`;
        document.getElementById('question-text').textContent = question;
        
        // Determine which options to use
        let options = testInfo.options;
        if (this.currentTest === 'sleep' && this.currentQuestionIndex === 4) {
            options = testInfo.lastQuestionOptions;
        }
        
        // Render options
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';
        
        options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option';
            
            const radioId = `q${this.currentQuestionIndex}_option${index}`;
            const isSelected = this.responses[`q${this.currentQuestionIndex}`] === option.value;
            
            if (isSelected) {
                optionDiv.classList.add('selected');
            }
            
            optionDiv.innerHTML = `
                <input type="radio" 
                       id="${radioId}" 
                       name="question${this.currentQuestionIndex}" 
                       value="${option.value}"
                       ${isSelected ? 'checked' : ''}>
                <label for="${radioId}">${option.text}</label>
            `;
            
            optionDiv.addEventListener('click', () => {
                this.selectOption(option.value);
            });
            
            optionsContainer.appendChild(optionDiv);
        });
    }

    selectOption(value) {
        this.responses[`q${this.currentQuestionIndex}`] = value;
        
        // Update visual selection
        document.querySelectorAll('.option').forEach(option => {
            option.classList.remove('selected');
        });
        
        const selectedInput = document.querySelector(`input[value="${value}"]`);
        selectedInput.checked = true;
        selectedInput.closest('.option').classList.add('selected');
        
        this.updateNavigationButtons();
    }

    updateProgress() {
        const testInfo = this.testData[this.currentTest];
        const totalQuestions = testInfo.questions.length;
        const progress = ((this.currentQuestionIndex + 1) / totalQuestions) * 100;
        
        document.getElementById('progress-fill').style.width = `${progress}%`;
        document.getElementById('progress-text').textContent = `Question ${this.currentQuestionIndex + 1} of ${totalQuestions}`;
    }

    updateNavigationButtons() {
        const testInfo = this.testData[this.currentTest];
        const totalQuestions = testInfo.questions.length;
        const hasResponse = this.responses[`q${this.currentQuestionIndex}`] !== undefined;
        
        // Previous button
        document.getElementById('prev-btn').disabled = this.currentQuestionIndex === 0;
        
        // Next/Submit button
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');
        
        if (this.currentQuestionIndex === totalQuestions - 1) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
            submitBtn.disabled = !hasResponse;
        } else {
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
            nextBtn.disabled = !hasResponse;
        }
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.renderQuestion();
            this.updateProgress();
            this.updateNavigationButtons();
        }
    }

    nextQuestion() {
        const testInfo = this.testData[this.currentTest];
        if (this.currentQuestionIndex < testInfo.questions.length - 1) {
            this.currentQuestionIndex++;
            this.renderQuestion();
            this.updateProgress();
            this.updateNavigationButtons();
        }
    }

    calculateScore() {
        const testInfo = this.testData[this.currentTest];
        let totalScore = 0;
        
        for (let i = 0; i < testInfo.questions.length; i++) {
            let score = this.responses[`q${i}`] || 0;
            
            // Handle reverse scoring for PSS-10
            if (this.currentTest === 'pss10' && testInfo.reverseScored.includes(i)) {
                score = 4 - score; // Reverse the score (0->4, 1->3, 2->2, 3->1, 4->0)
            }
            
            totalScore += score;
        }
        
        return totalScore;
    }

    getScoreCategory(score) {
        const testInfo = this.testData[this.currentTest];
        const ranges = testInfo.scoring.ranges;
        
        for (const range of ranges) {
            if (score >= range.min && score <= range.max) {
                return range;
            }
        }
        
        return ranges[ranges.length - 1]; // Default to highest category
    }

    submitTest() {
        const score = this.calculateScore();
        const category = this.getScoreCategory(score);
        const testInfo = this.testData[this.currentTest];
        
        // Calculate max possible score
        let maxScore;
        if (this.currentTest === 'pss10') {
            maxScore = 40; // 10 questions × 4 points each
        } else if (this.currentTest === 'sleep') {
            maxScore = 15; // 5 questions × 3 points each
        } else if (this.currentTest === 'gad7') {
            maxScore = 21; // 7 questions × 3 points each
        } else { // phq9
            maxScore = 27; // 9 questions × 3 points each
        }
        
        // Store results for display
        this.currentResults = {
            testName: this.currentTest.toUpperCase(),
            title: testInfo.title,
            score: score,
            maxScore: maxScore,
            category: category.category,
            categoryClass: category.class,
            description: category.description,
            responses: { ...this.responses },
            date: new Date().toISOString()
        };
        
        this.showResults();
        this.saveTestToProfile();
    }

    saveTestToProfile() {
        // Create test result object with all required fields
        const testResult = {
            testName: this.currentResults.testName,
            score: this.currentResults.score,
            responses: Object.values(this.responses), // Convert responses object to array
            date: new Date().toISOString() // Full ISO timestamp
        };

        // Add to global testResults array
        window.testResults.unshift(testResult);
        
        // Keep only the 20 most recent tests
        if (window.testResults.length > 20) {
            window.testResults.splice(20);
        }
        
        // Save to localStorage for persistence
        localStorage.setItem('campuscare-testResults', JSON.stringify(window.testResults));
        
        // Also save to legacy format for profile page compatibility
        const legacyResult = {
            id: Date.now(),
            name: this.currentResults.testName,
            date: new Date().toISOString().split('T')[0],
            score: this.currentResults.score,
            maxScore: this.currentResults.maxScore,
            category: this.currentResults.category
        };
        
        const existingTests = JSON.parse(localStorage.getItem('campuscare-tests') || '[]');
        existingTests.unshift(legacyResult);
        if (existingTests.length > 10) {
            existingTests.splice(10);
        }
        localStorage.setItem('campuscare-tests', JSON.stringify(existingTests));
        
        // Trigger profile page update if it's open
        this.notifyProfileUpdate();
    }

    notifyProfileUpdate() {
        // Use localStorage event to communicate between pages
        localStorage.setItem('campuscare-profile-update', Date.now().toString());
        
        // Also dispatch custom event for same-page updates
        window.dispatchEvent(new CustomEvent('testResultsUpdated', {
            detail: { testResults: window.testResults }
        }));
    }

    showResults() {
        const results = this.currentResults;
        
        document.getElementById('results-title').textContent = `${results.title} Results`;
        document.getElementById('results-date').textContent = new Date(results.date).toLocaleDateString();
        document.getElementById('score-value').textContent = results.score;
        document.getElementById('score-total').textContent = `/ ${results.maxScore}`;
        
        const categoryBadge = document.getElementById('category-badge');
        categoryBadge.textContent = results.category;
        categoryBadge.className = `category-badge ${results.categoryClass}`;
        
        document.getElementById('category-description').textContent = results.description;
        
        this.showScreen('test-results');
    }



    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    resetTest() {
        this.currentTest = null;
        this.currentQuestionIndex = 0;
        this.responses = {};
        this.currentResults = null;
    }

}

// Initialize the test system when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.testSystem = new MentalHealthTestSystem();
});
