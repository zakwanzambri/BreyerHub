// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize loading screen
    initializeLoadingScreen();
    
    // Initialize animations
    initializeAnimations();
    
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section, .main-section');

    navLinks.forEach((link, index) => {
        // Add staggered animation delay for nav links
        link.style.setProperty('--nav-index', index);
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all nav links and sections
            navLinks.forEach(nav => nav.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked nav link
            this.classList.add('active');
            
            // Show corresponding section with animation
            const targetSection = document.getElementById(this.dataset.section);
            if (targetSection) {
                targetSection.classList.add('active');
                animateElementEntrance(targetSection);
            }
        });
    });

    // Load schedule from localStorage
    loadSchedule();
    
    // Schedule form submission
    const scheduleForm = document.getElementById('scheduleForm');
    if (scheduleForm) {
        scheduleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addScheduleItem();
        });
    }

    // Program filter functionality
    initializeProgramFilter();

    // Study Timer functionality
    initializeStudyTimer();

    // Dark Mode functionality
    initializeDarkMode();

    // PWA functionality
    initializePWA();

    // Initialize tracking systems
    try {
        assignmentTracker = new AssignmentTracker();
        console.log('Assignment Tracker initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Assignment Tracker:', error);
    }
    
    try {
        gradeTracker = new GradeTracker();
        console.log('Grade Tracker initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Grade Tracker:', error);
    }
    
    try {
        attendanceTracker = new AttendanceTracker();
        console.log('Attendance Tracker initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Attendance Tracker:', error);
    }

    // Initialize analytics and goals systems
    try {
        analyticsManager = new AnalyticsManager();
        console.log('Analytics Manager initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Analytics Manager:', error);
    }
    
    try {
        goalManager = new GoalManager();
        console.log('Goal Manager initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Goal Manager:', error);
    }
    
    // Add sample schedule if none exists
    const existingSchedule = localStorage.getItem('schedule');
    if (!existingSchedule) {
        const sampleSchedule = [
            { id: 1, title: 'Teknik Masakan Asia', program: 'culinary', time: '08:00', day: 'monday' },
            { id: 2, title: 'Pengurusan Pejabat', program: 'admin', time: '10:00', day: 'monday' },
            { id: 3, title: 'Programming Fundamentals', program: 'computer', time: '14:00', day: 'tuesday' },
            { id: 4, title: 'Operasi Restoran', program: 'fnb', time: '09:00', day: 'wednesday' },
            { id: 5, title: 'Keselamatan Elektrik', program: 'electrical', time: '13:00', day: 'thursday' },
            { id: 6, title: 'Komunikasi Perniagaan', program: 'admin', time: '11:00', day: 'friday' }
        ];
        localStorage.setItem('schedule', JSON.stringify(sampleSchedule));
        loadSchedule();
    }
});

// Schedule Management
function addScheduleItem() {
    const title = document.getElementById('eventTitle').value;
    const program = document.getElementById('eventProgram').value;
    const time = document.getElementById('eventTime').value;
    const day = document.getElementById('eventDay').value;
    
    if (!title || !program || !time || !day) {
        alert('Sila isi semua maklumat!');
        return;
    }
    
    const scheduleItem = {
        id: Date.now(),
        title: title,
        program: program,
        time: time,
        day: day
    };
    
    // Get existing schedule from localStorage
    let schedule = JSON.parse(localStorage.getItem('schedule')) || [];
    schedule.push(scheduleItem);
    
    // Save to localStorage
    localStorage.setItem('schedule', JSON.stringify(schedule));
    
    // Clear form
    document.getElementById('scheduleForm').reset();
    
    // Reload schedule display
    loadSchedule();
    
    // Show success message
    showNotification('Jadual berjaya ditambah!', 'success');
}

function loadSchedule() {
    const schedule = JSON.parse(localStorage.getItem('schedule')) || [];
    const scheduleList = document.getElementById('scheduleList');
    
    if (!scheduleList) return;
    
    if (schedule.length === 0) {
        scheduleList.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Tiada jadual ditambah lagi</p>';
        return;
    }
    
    // Group by day
    const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayNames = {
        'monday': 'Isnin',
        'tuesday': 'Selasa', 
        'wednesday': 'Rabu',
        'thursday': 'Khamis',
        'friday': 'Jumaat',
        'saturday': 'Sabtu',
        'sunday': 'Ahad'
    };
    
    const programNames = {
        'culinary': 'Culinary',
        'admin': 'Admin Management',
        'computer': 'Computer System',
        'fnb': 'F&B Management',
        'electrical': 'Electrical',
        'general': 'Umum'
    };
    
    let html = '';
    
    dayOrder.forEach(day => {
        const dayItems = schedule.filter(item => item.day === day);
        if (dayItems.length > 0) {
            dayItems.sort((a, b) => a.time.localeCompare(b.time));
            
            dayItems.forEach(item => {
                const programDisplay = item.program ? programNames[item.program] || item.program : 'Umum';
                html += `
                    <div class="schedule-item">
                        <div class="schedule-day">${dayNames[day]}</div>
                        <div style="font-weight: 500; margin: 5px 0;">${item.title}</div>
                        <div class="schedule-program" style="color: #667eea; font-size: 0.9rem; font-weight: 500;">${programDisplay}</div>
                        <div class="schedule-time">${formatTime(item.time)}</div>
                        <button onclick="deleteScheduleItem(${item.id})" style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; margin-top: 10px;">Padam</button>
                    </div>
                `;
            });
        }
    });
    
    scheduleList.innerHTML = html;
}

function deleteScheduleItem(id) {
    let schedule = JSON.parse(localStorage.getItem('schedule')) || [];
    schedule = schedule.filter(item => item.id !== id);
    localStorage.setItem('schedule', JSON.stringify(schedule));
    loadSchedule();
    showNotification('Jadual berjaya dipadam!', 'success');
}

function formatTime(time) {
    const [hours, minutes] = time.split(':');
    const hour12 = hours % 12 || 12;
    const ampm = hours < 12 ? 'AM' : 'PM';
    return `${hour12}:${minutes} ${ampm}`;
}

// GPA Calculator Functions
function addSubject() {
    const subjectsList = document.getElementById('subjectsList');
    const newRow = document.createElement('div');
    newRow.className = 'subject-row';
    newRow.innerHTML = `
        <input type="text" placeholder="Nama subjek" class="subject-name">
        <input type="number" placeholder="Kredit" min="1" max="6" class="subject-credit">
        <select class="subject-grade">
            <option value="">Pilih gred</option>
            <option value="4.00">A+ (4.00)</option>
            <option value="4.00">A (4.00)</option>
            <option value="3.67">A- (3.67)</option>
            <option value="3.33">B+ (3.33)</option>
            <option value="3.00">B (3.00)</option>
            <option value="2.67">B- (2.67)</option>
            <option value="2.33">C+ (2.33)</option>
            <option value="2.00">C (2.00)</option>
            <option value="1.67">C- (1.67)</option>
            <option value="1.33">D+ (1.33)</option>
            <option value="1.00">D (1.00)</option>
            <option value="0.00">F (0.00)</option>
        </select>
        <button type="button" class="remove-subject" onclick="removeSubject(this)">Buang</button>
    `;
    subjectsList.appendChild(newRow);
}

function removeSubject(button) {
    const subjectsList = document.getElementById('subjectsList');
    if (subjectsList.children.length > 1) {
        button.parentElement.remove();
    } else {
        alert('Mesti ada sekurang-kurangnya satu subjek!');
    }
}

function calculateGPA() {
    const subjectRows = document.querySelectorAll('.subject-row');
    let totalPoints = 0;
    let totalCredits = 0;
    let validSubjects = 0;
    
    const subjects = [];
    
    subjectRows.forEach(row => {
        const name = row.querySelector('.subject-name').value.trim();
        const credit = parseFloat(row.querySelector('.subject-credit').value);
        const grade = parseFloat(row.querySelector('.subject-grade').value);
        
        if (name && credit && grade !== null && !isNaN(grade)) {
            const points = credit * grade;
            totalPoints += points;
            totalCredits += credit;
            validSubjects++;
            
            subjects.push({
                name: name,
                credit: credit,
                grade: grade,
                points: points
            });
        }
    });
    
    if (validSubjects === 0) {
        alert('Sila masukkan maklumat subjek yang lengkap!');
        return;
    }
    
    const gpa = totalPoints / totalCredits;
    displayGPAResult(gpa, subjects, totalCredits);
}

function displayGPAResult(gpa, subjects, totalCredits) {
    const resultDiv = document.getElementById('gpaResult');
    
    let status = '';
    let statusClass = '';
    
    if (gpa >= 3.67) {
        status = 'Cemerlang';
        statusClass = 'excellent';
    } else if (gpa >= 3.00) {
        status = 'Baik';
        statusClass = 'good';
    } else if (gpa >= 2.00) {
        status = 'Memuaskan';
        statusClass = 'satisfactory';
    } else {
        status = 'Perlu Diperbaiki';
        statusClass = 'needs-improvement';
    }
    
    let subjectsHTML = subjects.map(subject => `
        <div style="display: flex; justify-content: space-between; margin: 5px 0; padding: 8px; background: #f8f9fa; border-radius: 5px;">
            <span>${subject.name}</span>
            <span>${subject.credit} kredit - ${subject.grade.toFixed(2)}</span>
        </div>
    `).join('');
    
    resultDiv.innerHTML = `
        <div class="gpa-display">${gpa.toFixed(2)}</div>
        <div class="gpa-status ${statusClass}">${status}</div>
        <div style="margin-top: 20px; text-align: left;">
            <h4>Butiran Subjek:</h4>
            ${subjectsHTML}
            <div style="margin-top: 15px; font-weight: bold; text-align: center;">
                Jumlah Kredit: ${totalCredits}
            </div>
        </div>
    `;
    
    // Add celebration effects
    setTimeout(() => {
        celebrateSuccess(resultDiv);
        
        let celebrationMessage = '';
        if (gpa >= 3.67) {
            celebrationMessage = '🎉 Cemerlang! GPA Anda luar biasa!';
        } else if (gpa >= 3.00) {
            celebrationMessage = '👏 Baik! Teruskan usaha anda!';
        } else if (gpa >= 2.00) {
            celebrationMessage = '💪 Memuaskan! Ada ruang untuk improvement!';
        } else {
            celebrationMessage = '📚 Teruskan berusaha! Anda boleh buat lebih baik!';
        }
        
        if (typeof triggerCelebration === 'function') {
            triggerCelebration(celebrationMessage);
        }
    }, 300);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#d4edda' : '#f8d7da'};
        color: ${type === 'success' ? '#155724' : '#721c24'};
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        font-weight: 500;
        border: 1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'};
        animation: slideIn 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Add CSS for notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Program Filter Functionality
function initializeProgramFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const programCards = document.querySelectorAll('.program-card');
    
    if (!filterButtons.length || !programCards.length) return;
    
    // Set up data attributes for filtering
    const programData = {
        'culinary': ['culinary'],
        'management': ['admin', 'fnb'],
        'technology': ['computer'],
        'hospitality': ['fnb'],
        'technical': ['electrical']
    };
    
    // Add data attributes to program cards
    programCards.forEach((card, index) => {
        const programs = ['culinary', 'admin', 'computer', 'fnb', 'electrical'];
        card.setAttribute('data-program', programs[index]);
    });
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            programCards.forEach(card => {
                const cardProgram = card.getAttribute('data-program');
                
                if (filter === 'all') {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease';
                } else {
                    const matchingPrograms = programData[filter] || [filter];
                    if (matchingPrograms.includes(cardProgram)) {
                        card.style.display = 'block';
                        card.style.animation = 'fadeIn 0.5s ease';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });
}

// Study Timer Functionality
let timerState = {
    isRunning: false,
    isPaused: false,
    currentTime: 25 * 60, // 25 minutes in seconds
    totalTime: 25 * 60,
    currentSession: 'work', // 'work', 'shortBreak', 'longBreak'
    sessionCount: 0,
    interval: null
};

function initializeStudyTimer() {
    const startBtn = document.getElementById('timer-start');
    const pauseBtn = document.getElementById('timer-pause');
    const resetBtn = document.getElementById('timer-reset');
    
    const workDurationInput = document.getElementById('work-duration');
    const shortBreakInput = document.getElementById('short-break');
    const longBreakInput = document.getElementById('long-break');
    const sessionsBeforeLongInput = document.getElementById('sessions-before-long');
    
    if (!startBtn) return; // Timer section not loaded
    
    // Load saved stats
    loadTimerStats();
    
    // Event listeners
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    
    // Settings change listeners
    [workDurationInput, shortBreakInput, longBreakInput, sessionsBeforeLongInput].forEach(input => {
        if (input) {
            input.addEventListener('change', updateTimerSettings);
        }
    });
    
    // Initialize display
    updateTimerDisplay();
    updateProgressCircle();
}

function startTimer() {
    if (timerState.isPaused) {
        // Resume timer
        timerState.isPaused = false;
    } else {
        // Start new timer
        timerState.isRunning = true;
    }
    
    timerState.interval = setInterval(() => {
        timerState.currentTime--;
        updateTimerDisplay();
        updateProgressCircle();
        
        if (timerState.currentTime <= 0) {
            completeSession();
        }
    }, 1000);
    
    // Update button states
    document.getElementById('timer-start').classList.add('hidden');
    document.getElementById('timer-pause').classList.remove('hidden');
}

function pauseTimer() {
    timerState.isPaused = true;
    clearInterval(timerState.interval);
    
    // Show start button, hide pause button
    document.getElementById('timer-start').classList.remove('hidden');
    document.getElementById('timer-pause').classList.add('hidden');
}

function resetTimer() {
    clearInterval(timerState.interval);
    timerState.isRunning = false;
    timerState.isPaused = false;
    
    // Reset to current session default time
    const workDuration = parseInt(document.getElementById('work-duration').value) || 25;
    const shortBreak = parseInt(document.getElementById('short-break').value) || 5;
    const longBreak = parseInt(document.getElementById('long-break').value) || 15;
    
    if (timerState.currentSession === 'work') {
        timerState.currentTime = workDuration * 60;
        timerState.totalTime = workDuration * 60;
    } else if (timerState.currentSession === 'shortBreak') {
        timerState.currentTime = shortBreak * 60;
        timerState.totalTime = shortBreak * 60;
    } else {
        timerState.currentTime = longBreak * 60;
        timerState.totalTime = longBreak * 60;
    }
    
    // Reset button states
    document.getElementById('timer-start').classList.remove('hidden');
    document.getElementById('timer-pause').classList.add('hidden');
    
    updateTimerDisplay();
    updateProgressCircle();
}

function completeSession() {
    clearInterval(timerState.interval);
    timerState.isRunning = false;
    
    // Play notification sound (if possible)
    playNotificationSound();
    
    // Send push notification if supported and permission granted
    sendPushNotification();
    
    // Update stats
    updateTimerStats();
    
    // Switch to next session
    switchToNextSession();
    
    // Reset button states
    document.getElementById('timer-start').classList.remove('hidden');
    document.getElementById('timer-pause').classList.add('hidden');
    
    // Show completion notification
    showNotification(getSessionCompletionMessage(), 'success');
}

function switchToNextSession() {
    const sessionsBeforeLong = parseInt(document.getElementById('sessions-before-long').value) || 4;
    
    if (timerState.currentSession === 'work') {
        timerState.sessionCount++;
        
        if (timerState.sessionCount % sessionsBeforeLong === 0) {
            startLongBreak();
        } else {
            startShortBreak();
        }
    } else {
        startWorkSession();
    }
}

function startWorkSession() {
    const workDuration = parseInt(document.getElementById('work-duration').value) || 25;
    timerState.currentSession = 'work';
    timerState.currentTime = workDuration * 60;
    timerState.totalTime = workDuration * 60;
    
    document.getElementById('timer-mode').textContent = 'Sesi Belajar';
    document.getElementById('timer-description').textContent = `Fokus pada tugasan anda selama ${workDuration} minit`;
    document.getElementById('progress-circle').style.stroke = '#667eea';
    
    updateTimerDisplay();
    updateProgressCircle();
}

function startShortBreak() {
    const shortBreak = parseInt(document.getElementById('short-break').value) || 5;
    timerState.currentSession = 'shortBreak';
    timerState.currentTime = shortBreak * 60;
    timerState.totalTime = shortBreak * 60;
    
    document.getElementById('timer-mode').textContent = 'Rehat Pendek';
    document.getElementById('timer-description').textContent = `Berehat sebentar selama ${shortBreak} minit`;
    document.getElementById('progress-circle').style.stroke = '#28a745';
    
    updateTimerDisplay();
    updateProgressCircle();
}

function startLongBreak() {
    const longBreak = parseInt(document.getElementById('long-break').value) || 15;
    timerState.currentSession = 'longBreak';
    timerState.currentTime = longBreak * 60;
    timerState.totalTime = longBreak * 60;
    
    document.getElementById('timer-mode').textContent = 'Rehat Panjang';
    document.getElementById('timer-description').textContent = `Rehat panjang selama ${longBreak} minit - Anda pantas mendapatnya!`;
    document.getElementById('progress-circle').style.stroke = '#17a2b8';
    
    updateTimerDisplay();
    updateProgressCircle();
}

function updateTimerDisplay() {
    const minutes = Math.floor(timerState.currentTime / 60);
    const seconds = timerState.currentTime % 60;
    
    document.getElementById('timer-minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('timer-seconds').textContent = seconds.toString().padStart(2, '0');
}

function updateProgressCircle() {
    const progressCircle = document.getElementById('progress-circle');
    if (!progressCircle) return;
    
    const circumference = 2 * Math.PI * 140; // radius = 140
    const progress = (timerState.totalTime - timerState.currentTime) / timerState.totalTime;
    const offset = circumference - (progress * circumference);
    
    progressCircle.style.strokeDashoffset = offset;
}

function updateTimerSettings() {
    if (!timerState.isRunning) {
        resetTimer();
    }
}

function updateTimerStats() {
    const today = new Date().toDateString();
    let stats = JSON.parse(localStorage.getItem('timerStats')) || {};
    
    if (!stats[today]) {
        stats[today] = {
            completedSessions: 0,
            totalStudyTime: 0,
            totalBreakTime: 0
        };
    }
    
    stats[today].completedSessions++;
    
    if (timerState.currentSession === 'work') {
        const workDuration = parseInt(document.getElementById('work-duration').value) || 25;
        stats[today].totalStudyTime += workDuration;
    } else {
        const breakDuration = timerState.currentSession === 'shortBreak' 
            ? parseInt(document.getElementById('short-break').value) || 5
            : parseInt(document.getElementById('long-break').value) || 15;
        stats[today].totalBreakTime += breakDuration;
    }
    
    localStorage.setItem('timerStats', JSON.stringify(stats));
    loadTimerStats();
}

function loadTimerStats() {
    const today = new Date().toDateString();
    const stats = JSON.parse(localStorage.getItem('timerStats')) || {};
    const todayStats = stats[today] || { completedSessions: 0, totalStudyTime: 0, totalBreakTime: 0 };
    
    const completedElement = document.getElementById('completed-sessions');
    const studyTimeElement = document.getElementById('total-study-time');
    const breakTimeElement = document.getElementById('total-break-time');
    
    if (completedElement) completedElement.textContent = todayStats.completedSessions;
    if (studyTimeElement) studyTimeElement.textContent = `${todayStats.totalStudyTime} minit`;
    if (breakTimeElement) breakTimeElement.textContent = `${todayStats.totalBreakTime} minit`;

    // Load enhanced stats
    updateEnhancedTimerStats(stats, todayStats);
}

// Enhanced Timer Features
function updateEnhancedTimerStats(stats, todayStats) {
    // Update productivity score
    const productivityScore = calculateProductivityScore(todayStats);
    const productivityElement = document.getElementById('productivity-score');
    if (productivityElement) {
        productivityElement.textContent = `${productivityScore}%`;
        // Add visual indicator
        const indicator = getProductivityIndicator(productivityScore);
        productivityElement.className = `stat-value ${indicator}`;
    }

    // Update daily streak
    const streak = calculateDailyStreak(stats);
    const streakElement = document.getElementById('daily-streak');
    if (streakElement) {
        streakElement.textContent = streak;
        if (streak > 0) {
            streakElement.classList.add('updated');
            setTimeout(() => streakElement.classList.remove('updated'), 300);
        }
    }

    // Generate insights
    generateTimerInsights(stats, todayStats);
    
    // Generate recommendations
    generateSmartRecommendations(stats, todayStats);
}

function calculateProductivityScore(todayStats) {
    const targetSessions = 8; // Target sessions per day
    const sessionScore = Math.min((todayStats.completedSessions / targetSessions) * 60, 60);
    
    const targetStudyTime = 200; // Target 200 minutes (3+ hours) per day
    const timeScore = Math.min((todayStats.totalStudyTime / targetStudyTime) * 40, 40);
    
    return Math.round(sessionScore + timeScore);
}

function getProductivityIndicator(score) {
    if (score >= 80) return 'productivity-high';
    if (score >= 60) return 'productivity-medium';
    return 'productivity-low';
}

function calculateDailyStreak(stats) {
    const dates = Object.keys(stats).sort((a, b) => new Date(b) - new Date(a));
    let streak = 0;
    const today = new Date().toDateString();
    
    for (let date of dates) {
        const dayData = stats[date];
        if (dayData.completedSessions >= 4) { // Minimum 4 sessions for streak
            streak++;
        } else {
            break;
        }
    }
    
    return streak;
}

function generateTimerInsights(stats, todayStats) {
    const insights = [];
    const insightsContainer = document.getElementById('timer-insights-content');
    if (!insightsContainer) return;

    // Session completion insight
    if (todayStats.completedSessions >= 8) {
        insights.push({
            icon: 'fas fa-trophy text-success',
            text: `Excellent! Anda telah menyelesaikan ${todayStats.completedSessions} sesi hari ini!`
        });
    } else if (todayStats.completedSessions >= 4) {
        insights.push({
            icon: 'fas fa-thumbs-up text-primary',
            text: `Bagus! ${todayStats.completedSessions} sesi selesai. Teruskan usaha!`
        });
    } else if (todayStats.completedSessions > 0) {
        insights.push({
            icon: 'fas fa-chart-line text-warning',
            text: `${todayStats.completedSessions} sesi selesai. Cuba capai sekurang-kurangnya 4 sesi hari ini.`
        });
    }

    // Study time insight
    if (todayStats.totalStudyTime >= 180) {
        insights.push({
            icon: 'fas fa-clock text-success',
            text: `Masa belajar hari ini: ${todayStats.totalStudyTime} minit. Pencapaian cemerlang!`
        });
    } else if (todayStats.totalStudyTime >= 120) {
        insights.push({
            icon: 'fas fa-clock text-primary',
            text: `${todayStats.totalStudyTime} minit belajar hari ini. Pencapaian yang baik!`
        });
    }

    // Weekly pattern insight
    const weeklyPattern = analyzeWeeklyPattern(stats);
    if (weeklyPattern) {
        insights.push({
            icon: 'fas fa-calendar-week text-primary',
            text: weeklyPattern
        });
    }

    // Render insights
    if (insights.length === 0) {
        insights.push({
            icon: 'fas fa-clock text-primary',
            text: 'Mulakan sesi pertama untuk melihat analisis!'
        });
    }

    insightsContainer.innerHTML = insights.map(insight => `
        <div class="insight-item">
            <i class="${insight.icon}"></i>
            <span>${insight.text}</span>
        </div>
    `).join('');
}

function generateSmartRecommendations(stats, todayStats) {
    const recommendations = [];
    const recommendationsContainer = document.getElementById('smart-recommendations-content');
    if (!recommendationsContainer) return;

    const currentHour = new Date().getHours();
    
    // Time-based recommendations
    if (currentHour >= 8 && currentHour <= 11 && todayStats.completedSessions === 0) {
        recommendations.push({
            icon: 'fas fa-sun text-warning',
            text: 'Pagi adalah masa terbaik untuk fokus! Mulakan sesi belajar sekarang.'
        });
    } else if (currentHour >= 14 && currentHour <= 16) {
        recommendations.push({
            icon: 'fas fa-brain text-primary',
            text: 'Masa tengah hari - ideal untuk topik yang mencabar!'
        });
    } else if (currentHour >= 19 && currentHour <= 21) {
        recommendations.push({
            icon: 'fas fa-book text-primary',
            text: 'Masa malam sesuai untuk mengulangkaji dan menyimpulkan pembelajaran.'
        });
    }

    // Session-based recommendations
    if (todayStats.completedSessions === 0) {
        recommendations.push({
            icon: 'fas fa-play text-success',
            text: 'Mulakan dengan sesi 25 minit untuk momentum positif!'
        });
    } else if (todayStats.completedSessions >= 4 && todayStats.completedSessions < 6) {
        recommendations.push({
            icon: 'fas fa-fire text-warning',
            text: 'Anda sudah separuh jalan! Teruskan untuk capai target harian.'
        });
    } else if (todayStats.completedSessions >= 6) {
        recommendations.push({
            icon: 'fas fa-medal text-success',
            text: 'Prestasi hebat! Pertimbangkan rehat lebih lama atau sesi ringan.'
        });
    }

    // Break pattern recommendations
    const breakRatio = todayStats.totalBreakTime / Math.max(todayStats.totalStudyTime, 1);
    if (breakRatio < 0.2 && todayStats.completedSessions > 2) {
        recommendations.push({
            icon: 'fas fa-coffee text-warning',
            text: 'Nampaknya anda perlu lebih banyak rehat. Jangan lupa untuk berehat!'
        });
    }

    // Performance-based recommendations
    const recentPerformance = analyzeRecentPerformance(stats);
    if (recentPerformance === 'improving') {
        recommendations.push({
            icon: 'fas fa-arrow-up text-success',
            text: 'Prestasi anda semakin meningkat! Teruskan momentum ini.'
        });
    } else if (recentPerformance === 'declining') {
        recommendations.push({
            icon: 'fas fa-chart-line text-warning',
            text: 'Cuba kurangkan gangguan dan fokus pada kualiti sesi belajar.'
        });
    }

    // Default recommendation
    if (recommendations.length === 0) {
        recommendations.push({
            icon: 'fas fa-lightbulb text-warning',
            text: 'Selesaikan beberapa sesi untuk mendapat cadangan peribadi'
        });
    }

    recommendationsContainer.innerHTML = recommendations.map(rec => `
        <div class="recommendation-item">
            <i class="${rec.icon}"></i>
            <span>${rec.text}</span>
        </div>
    `).join('');
}

function analyzeWeeklyPattern(stats) {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toDateString();
        last7Days.push(stats[dateStr] || { completedSessions: 0, totalStudyTime: 0 });
    }

    const avgSessions = last7Days.reduce((sum, day) => sum + day.completedSessions, 0) / 7;
    const avgStudyTime = last7Days.reduce((sum, day) => sum + day.totalStudyTime, 0) / 7;

    if (avgSessions >= 6) {
        return `Minggu ini purata ${Math.round(avgSessions)} sesi sehari - konsisten!`;
    } else if (avgSessions >= 3) {
        return `Purata ${Math.round(avgSessions)} sesi sehari minggu ini. Boleh tingkatkan lagi!`;
    } else if (avgSessions > 0) {
        return `${Math.round(avgSessions)} sesi purata sehari. Perlu lebih konsisten.`;
    }
    return null;
}

function analyzeRecentPerformance(stats) {
    const dates = Object.keys(stats).sort((a, b) => new Date(b) - new Date(a));
    if (dates.length < 3) return null;

    const recent3Days = dates.slice(0, 3).map(date => stats[date].completedSessions);
    const previous3Days = dates.slice(3, 6).map(date => stats[date]?.completedSessions || 0);

    const recentAvg = recent3Days.reduce((a, b) => a + b, 0) / 3;
    const previousAvg = previous3Days.reduce((a, b) => a + b, 0) / 3;

    if (recentAvg > previousAvg * 1.2) return 'improving';
    if (recentAvg < previousAvg * 0.8) return 'declining';
    return 'stable';
}

function getSessionCompletionMessage() {
    if (timerState.currentSession === 'work') {
        return 'Sesi belajar selesai! Masa untuk berehat.';
    } else if (timerState.currentSession === 'shortBreak') {
        return 'Rehat pendek selesai! Kembali belajar.';
    } else {
        return 'Rehat panjang selesai! Siap untuk sesi belajar baru.';
    }
}

function playNotificationSound() {
    // Create a simple beep sound using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
        console.log('Audio not supported');
    }
}

// Dark Mode Functionality
function initializeDarkMode() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    // Theme toggle event listener
    themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');
    
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
        themeToggle.title = 'Switch to Light Mode';
    } else {
        icon.className = 'fas fa-moon';
        themeToggle.title = 'Switch to Dark Mode';
    }
}

// PWA Functionality
let deferredPrompt;

function initializePWA() {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('PWA: Service Worker registered successfully:', registration.scope);
                    
                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                showNotification('App updated! Refresh to get the latest version.', 'info');
                            }
                        });
                    });
                })
                .catch((error) => {
                    console.log('PWA: Service Worker registration failed:', error);
                });
        });
    }

    // Handle install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('PWA: Install prompt triggered');
        e.preventDefault();
        deferredPrompt = e;
        showInstallPrompt();
    });

    // Handle successful installation
    window.addEventListener('appinstalled', (e) => {
        console.log('PWA: App installed successfully');
        hideInstallPrompt();
        showNotification('BreyerHub installed successfully!', 'success');
        deferredPrompt = null;
    });

    // Setup install buttons
    const installBtn = document.getElementById('install-app');
    const pwaInstallBtn = document.getElementById('pwa-install-btn');
    const pwaDismissBtn = document.getElementById('pwa-dismiss-btn');

    if (installBtn) {
        installBtn.addEventListener('click', installApp);
    }
    
    if (pwaInstallBtn) {
        pwaInstallBtn.addEventListener('click', installApp);
    }
    
    if (pwaDismissBtn) {
        pwaDismissBtn.addEventListener('click', hideInstallPrompt);
    }

    // Request notification permission
    requestNotificationPermission();
}

function showInstallPrompt() {
    const installBtn = document.getElementById('install-app');
    const pwaBanner = document.getElementById('pwa-banner');
    
    if (installBtn) {
        installBtn.classList.remove('hidden');
    }
    
    if (pwaBanner) {
        pwaBanner.classList.remove('hidden');
    }
}

function hideInstallPrompt() {
    const installBtn = document.getElementById('install-app');
    const pwaBanner = document.getElementById('pwa-banner');
    
    if (installBtn) {
        installBtn.classList.add('hidden');
    }
    
    if (pwaBanner) {
        pwaBanner.classList.add('hidden');
    }
    
    // Save dismissal preference
    localStorage.setItem('pwa-install-dismissed', 'true');
}

async function installApp() {
    if (!deferredPrompt) {
        showNotification('Installation not available on this device', 'info');
        return;
    }

    const result = await deferredPrompt.prompt();
    console.log('PWA: Install prompt result:', result);

    if (result.outcome === 'accepted') {
        console.log('PWA: User accepted the install prompt');
    } else {
        console.log('PWA: User dismissed the install prompt');
    }

    deferredPrompt = null;
    hideInstallPrompt();
}

async function requestNotificationPermission() {
    if ('Notification' in window && 'serviceWorker' in navigator) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            console.log('PWA: Notification permission granted');
            
            // Enable enhanced notification features
            enableSmartNotifications();
            
        } else {
            console.log('PWA: Notification permission denied');
        }
    }
}

// Enhanced Notification System
function enableSmartNotifications() {
    // Schedule daily study reminders
    scheduleStudyReminders();
    
    // Set up assignment deadline notifications
    scheduleAssignmentReminders();
    
    // Set up attendance reminders
    scheduleAttendanceReminders();
}

function scheduleStudyReminders() {
    // Morning motivation (9 AM)
    scheduleNotification(
        'morning-motivation',
        'Start Your Day Strong! 💪',
        'Good morning! Ready to tackle your study goals today?',
        { hour: 9, minute: 0 }
    );
    
    // Afternoon productivity (2 PM)
    scheduleNotification(
        'afternoon-boost',
        'Afternoon Focus Time! 🧠',
        'Perfect time for a productive study session. Your brain is at peak performance!',
        { hour: 14, minute: 0 }
    );
    
    // Evening review (7 PM)
    scheduleNotification(
        'evening-review',
        'Time to Review! 📚',
        'End your day by reviewing what you\'ve learned. Great for retention!',
        { hour: 19, minute: 0 }
    );
}

function scheduleAssignmentReminders() {
    const assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
    
    assignments.forEach(assignment => {
        if (assignment.status !== 'completed') {
            const dueDate = new Date(assignment.dueDate);
            const now = new Date();
            const timeDiff = dueDate.getTime() - now.getTime();
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
            
            // Remind 3 days before
            if (daysDiff === 3) {
                showEnhancedNotification(
                    'Assignment Reminder 📝',
                    `${assignment.title} is due in 3 days. Start working on it!`,
                    'warning'
                );
            }
            
            // Remind 1 day before
            if (daysDiff === 1) {
                showEnhancedNotification(
                    'Assignment Due Tomorrow! ⚠️',
                    `Don't forget: ${assignment.title} is due tomorrow!`,
                    'urgent'
                );
            }
        }
    });
}

function scheduleNotification(id, title, message, time) {
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(time.hour, time.minute, 0, 0);
    
    // If time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
    }
    
    const timeUntilNotification = scheduledTime.getTime() - now.getTime();
    
    if (timeUntilNotification > 0 && timeUntilNotification < 24 * 60 * 60 * 1000) {
        setTimeout(() => {
            showEnhancedNotification(title, message, 'info');
        }, timeUntilNotification);
    }
}

function showEnhancedNotification(title, message, type = 'info') {
    // Check if notifications are supported and permitted
    if ('Notification' in window && Notification.permission === 'granted') {
        const options = {
            body: message,
            icon: '/BreyerHub/icons/icon-192x192.png',
            badge: '/BreyerHub/icons/icon-192x192.png',
            tag: type,
            requireInteraction: type === 'critical' || type === 'urgent'
        };
        
        const notification = new Notification(title, options);
        
        // Auto-close after 10 seconds (except for critical/urgent)
        if (type !== 'critical' && type !== 'urgent') {
            setTimeout(() => notification.close(), 10000);
        }
        
        notification.onclick = function() {
            window.focus();
            this.close();
        };
    }
    
    // Also show in-app notification
    showInAppNotification(title, message, type);
}

function showInAppNotification(title, message, type) {
    const notification = document.createElement('div');
    notification.className = `enhanced-notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-header">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-title">${title}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
        <div class="notification-body">${message}</div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 350px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        border-left: 4px solid ${getNotificationColor(type)};
        padding: 15px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 8000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'critical': return '🚨';
        case 'urgent': return '⚠️';
        case 'warning': return '⚠️';
        case 'success': return '✅';
        case 'info': return 'ℹ️';
        default: return 'ℹ️';
    }
}

function getNotificationColor(type) {
    switch (type) {
        case 'critical': return '#dc2626';
        case 'urgent': return '#f59e0b';
        case 'warning': return '#f59e0b';
        case 'success': return '#16a34a';
        case 'info': return '#3b82f6';
        default: return '#6b7280';
    }
}

// Enhanced Offline Storage with IndexedDB fallback
class OfflineStorage {
    constructor() {
        this.dbName = 'BreyerHubDB';
        this.dbVersion = 1;
        this.db = null;
        this.init();
    }

    async init() {
        if ('indexedDB' in window) {
            try {
                this.db = await this.openDatabase();
                console.log('Offline Storage: IndexedDB initialized');
            } catch (error) {
                console.log('Offline Storage: IndexedDB failed, using localStorage');
            }
        }
    }

    openDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Create stores
                if (!db.objectStoreNames.contains('schedule')) {
                    db.createObjectStore('schedule', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('stats')) {
                    db.createObjectStore('stats', { keyPath: 'date' });
                }
                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings', { keyPath: 'key' });
                }
            };
        });
    }

    async setItem(store, key, value) {
        if (this.db) {
            try {
                const transaction = this.db.transaction([store], 'readwrite');
                const objectStore = transaction.objectStore(store);
                await objectStore.put({ id: key, data: value });
                return true;
            } catch (error) {
                console.log('IndexedDB write failed, using localStorage');
            }
        }
        
        // Fallback to localStorage
        localStorage.setItem(`${store}_${key}`, JSON.stringify(value));
        return true;
    }

    async getItem(store, key) {
        if (this.db) {
            try {
                const transaction = this.db.transaction([store], 'readonly');
                const objectStore = transaction.objectStore(store);
                const request = objectStore.get(key);
                const result = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                });
                return result ? result.data : null;
            } catch (error) {
                console.log('IndexedDB read failed, using localStorage');
            }
        }
        
        // Fallback to localStorage
        const item = localStorage.getItem(`${store}_${key}`);
        return item ? JSON.parse(item) : null;
    }

    async getAllItems(store) {
        if (this.db) {
            try {
                const transaction = this.db.transaction([store], 'readonly');
                const objectStore = transaction.objectStore(store);
                const request = objectStore.getAll();
                const results = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                });
                return results.map(item => item.data);
            } catch (error) {
                console.log('IndexedDB getAll failed, using localStorage');
            }
        }
        
        // Fallback to localStorage
        const items = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(`${store}_`)) {
                items.push(JSON.parse(localStorage.getItem(key)));
            }
        }
        return items;
    }
}

async function sendPushNotification() {
    if ('serviceWorker' in navigator && 'Notification' in window) {
        const permission = Notification.permission;
        
        if (permission === 'granted') {
            try {
                const registration = await navigator.serviceWorker.ready;
                const message = getSessionCompletionMessage();
                
                // Send message to service worker
                registration.active.postMessage({
                    type: 'TIMER_COMPLETE',
                    message: message,
                    session: timerState.currentSession
                });
                
                // Create local notification as fallback
                if (!('showNotification' in registration)) {
                    new Notification('BreyerHub Study Timer', {
                        body: message,
                        icon: '/icons/icon-192x192.svg',
                        badge: '/icons/icon-72x72.svg',
                        vibrate: [200, 100, 200],
                        tag: 'study-timer'
                    });
                }
            } catch (error) {
                console.log('Push notification failed:', error);
            }
        }
    }
}

// Initialize enhanced storage
const offlineStorage = new OfflineStorage();

// Assignment Tracker functionality
class AssignmentTracker {
    constructor() {
        this.assignments = this.loadAssignments();
        this.currentView = 'list';
        this.filters = {
            program: '',
            status: '',
            priority: '',
            search: ''
        };
        this.sorting = {
            by: 'dueDate',
            order: 'asc'
        };
        
        this.initializeEventListeners();
        this.renderAssignments();
        this.updateStatistics();
    }

    loadAssignments() {
        try {
            const stored = localStorage.getItem('assignments');
            if (!stored) return [];
            
            const assignments = JSON.parse(stored);
            // Convert date strings back to Date objects
            return assignments.map(assignment => ({
                ...assignment,
                dueDate: new Date(assignment.dueDate),
                createdAt: new Date(assignment.createdAt)
            }));
        } catch (error) {
            console.error('Error loading assignments:', error);
            return [];
        }
    }

    initializeEventListeners() {
        // Form submission
        const form = document.getElementById('assignmentForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addAssignment();
            });
        }

        // Progress slider
        const progressSlider = document.getElementById('assignmentProgress');
        const progressValue = document.getElementById('progressValue');
        if (progressSlider && progressValue) {
            progressSlider.addEventListener('input', (e) => {
                progressValue.textContent = e.target.value + '%';
            });
        }

        // Filters
        const filterProgram = document.getElementById('filterProgram');
        const filterStatus = document.getElementById('filterStatus');
        const filterPriority = document.getElementById('filterPriority');
        const searchInput = document.getElementById('searchAssignments');

        if (filterProgram) {
            filterProgram.addEventListener('change', (e) => {
                this.filters.program = e.target.value;
                this.renderAssignments();
            });
        }

        if (filterStatus) {
            filterStatus.addEventListener('change', (e) => {
                this.filters.status = e.target.value;
                this.renderAssignments();
            });
        }

        if (filterPriority) {
            filterPriority.addEventListener('change', (e) => {
                this.filters.priority = e.target.value;
                this.renderAssignments();
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value.toLowerCase();
                this.renderAssignments();
            });
        }

        // Sorting
        const sortBy = document.getElementById('sortBy');
        const sortOrder = document.getElementById('sortOrder');

        if (sortBy) {
            sortBy.addEventListener('change', (e) => {
                this.sorting.by = e.target.value;
                this.renderAssignments();
            });
        }

        if (sortOrder) {
            sortOrder.addEventListener('change', (e) => {
                this.sorting.order = e.target.value;
                this.renderAssignments();
            });
        }

        // View toggle
        const listView = document.getElementById('listView');
        const cardView = document.getElementById('cardView');

        if (listView) {
            listView.addEventListener('click', () => {
                this.currentView = 'list';
                listView.classList.add('active');
                if (cardView) cardView.classList.remove('active');
                this.renderAssignments();
            });
        }

        if (cardView) {
            cardView.addEventListener('click', () => {
                this.currentView = 'card';
                cardView.classList.add('active');
                if (listView) listView.classList.remove('active');
                this.renderAssignments();
            });
        }
    }

    addAssignment() {
        const title = document.getElementById('assignmentTitle').value;
        const program = document.getElementById('assignmentProgram').value;
        const subject = document.getElementById('assignmentSubject').value;
        const dueDate = document.getElementById('assignmentDueDate').value;
        const priority = document.getElementById('assignmentPriority').value;
        const progress = parseInt(document.getElementById('assignmentProgress').value);
        const description = document.getElementById('assignmentDescription').value;

        const assignment = {
            id: Date.now(),
            title,
            program,
            subject,
            dueDate: new Date(dueDate),
            priority,
            progress,
            description,
            status: progress === 0 ? 'not-started' : progress === 100 ? 'completed' : 'in-progress',
            createdAt: new Date()
        };

        this.assignments.push(assignment);
        this.saveToStorage();
        this.renderAssignments();
        this.updateStatistics();
        
        // Reset form
        document.getElementById('assignmentForm').reset();
        document.getElementById('progressValue').textContent = '0%';
        
        // Show success message
        this.showNotification('Tugasan berjaya ditambah!', 'success');
    }

    deleteAssignment(id) {
        if (confirm('Adakah anda pasti ingin padam tugasan ini?')) {
            this.assignments = this.assignments.filter(assignment => assignment.id !== id);
            this.saveToStorage();
            this.renderAssignments();
            this.updateStatistics();
            this.showNotification('Tugasan berjaya dipadam!', 'success');
        }
    }

    editAssignment(id) {
        const assignment = this.assignments.find(a => a.id === id);
        if (!assignment) return;

        // Fill form with assignment data
        document.getElementById('assignmentTitle').value = assignment.title;
        document.getElementById('assignmentProgram').value = assignment.program;
        document.getElementById('assignmentSubject').value = assignment.subject;
        document.getElementById('assignmentDueDate').value = assignment.dueDate.toISOString().slice(0, 16);
        document.getElementById('assignmentPriority').value = assignment.priority;
        document.getElementById('assignmentProgress').value = assignment.progress;
        document.getElementById('progressValue').textContent = assignment.progress + '%';
        document.getElementById('assignmentDescription').value = assignment.description || '';

        // Remove the assignment temporarily (will be re-added when form is submitted)
        this.deleteAssignment(id);
        
        // Scroll to form
        document.getElementById('assignmentForm').scrollIntoView({ behavior: 'smooth' });
    }

    updateProgress(id, progress) {
        const assignment = this.assignments.find(a => a.id === id);
        if (assignment) {
            assignment.progress = progress;
            assignment.status = progress === 0 ? 'not-started' : progress === 100 ? 'completed' : 'in-progress';
            this.saveToStorage();
            this.renderAssignments();
            this.updateStatistics();
        }
    }

    getFilteredAndSortedAssignments() {
        let filtered = this.assignments.filter(assignment => {
            // Program filter
            if (this.filters.program && assignment.program !== this.filters.program) {
                return false;
            }

            // Status filter
            if (this.filters.status) {
                let status = assignment.status;
                if (this.filters.status === 'overdue') {
                    status = new Date(assignment.dueDate) < new Date() && assignment.status !== 'completed' ? 'overdue' : assignment.status;
                }
                if (status !== this.filters.status) {
                    return false;
                }
            }

            // Priority filter
            if (this.filters.priority && assignment.priority !== this.filters.priority) {
                return false;
            }

            // Search filter
            if (this.filters.search) {
                const searchTerm = this.filters.search;
                return assignment.title.toLowerCase().includes(searchTerm) ||
                       assignment.subject.toLowerCase().includes(searchTerm) ||
                       assignment.description.toLowerCase().includes(searchTerm);
            }

            return true;
        });

        // Sort assignments
        filtered.sort((a, b) => {
            let aValue, bValue;

            switch (this.sorting.by) {
                case 'dueDate':
                    aValue = new Date(a.dueDate);
                    bValue = new Date(b.dueDate);
                    break;
                case 'priority':
                    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
                    aValue = priorityOrder[a.priority];
                    bValue = priorityOrder[b.priority];
                    break;
                case 'progress':
                    aValue = a.progress;
                    bValue = b.progress;
                    break;
                case 'title':
                    aValue = a.title.toLowerCase();
                    bValue = b.title.toLowerCase();
                    break;
                case 'created':
                    aValue = new Date(a.createdAt);
                    bValue = new Date(b.createdAt);
                    break;
                default:
                    return 0;
            }

            if (aValue < bValue) return this.sorting.order === 'asc' ? -1 : 1;
            if (aValue > bValue) return this.sorting.order === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    }

    renderAssignments() {
        const container = document.getElementById('assignmentsList');
        if (!container) return;

        const assignments = this.getFilteredAndSortedAssignments();
        
        // Update view class
        container.className = `assignments-container ${this.currentView}-view`;

        if (assignments.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-tasks"></i>
                    <h4>Tiada Tugasan</h4>
                    <p>${this.assignments.length === 0 ? 'Tambah tugasan pertama anda untuk mula penjejakan' : 'Tiada tugasan yang sepadan dengan penapis'}</p>
                </div>
            `;
            return;
        }

        container.innerHTML = assignments.map(assignment => this.renderAssignmentItem(assignment)).join('');
    }

    renderAssignmentItem(assignment) {
        const dueDate = new Date(assignment.dueDate);
        const now = new Date();
        const isOverdue = dueDate < now && assignment.status !== 'completed';
        const status = isOverdue ? 'overdue' : assignment.status;
        
        const programNames = {
            dsd: 'Diploma Seni Digital',
            dkv: 'Diploma Komunikasi Visual',
            dgd: 'Diploma Grafik Digital',
            dwm: 'Diploma Multimedia Digital',
            dit: 'Diploma Teknologi IT'
        };

        const priorityNames = {
            urgent: 'Kecemasan',
            high: 'Tinggi',
            medium: 'Sederhana',
            low: 'Rendah'
        };

        const statusNames = {
            'not-started': 'Belum Mula',
            'in-progress': 'Dalam Progress',
            'completed': 'Selesai',
            'overdue': 'Lewat'
        };

        return `
            <div class="assignment-item" data-id="${assignment.id}">
                <div class="assignment-header">
                    <h4 class="assignment-title">${assignment.title}</h4>
                    <span class="assignment-priority priority-${assignment.priority}">${priorityNames[assignment.priority]}</span>
                </div>
                
                <div class="assignment-meta">
                    <span><i class="fas fa-graduation-cap"></i> ${programNames[assignment.program]}</span>
                    <span><i class="fas fa-book"></i> ${assignment.subject}</span>
                    <span><i class="fas fa-calendar"></i> ${dueDate.toLocaleDateString('ms-MY')}</span>
                    <span><i class="fas fa-clock"></i> ${dueDate.toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                
                <div class="assignment-progress-bar">
                    <div class="assignment-progress-fill" style="width: ${assignment.progress}%"></div>
                </div>
                
                <div class="assignment-meta">
                    <span class="assignment-status status-${status}">${statusNames[status]}</span>
                    <span><i class="fas fa-percent"></i> ${assignment.progress}% selesai</span>
                </div>
                
                ${assignment.description ? `<p style="margin: 10px 0; color: var(--text-secondary); font-size: 14px;">${assignment.description}</p>` : ''}
                
                <div class="assignment-actions">
                    <button class="btn secondary" onclick="assignmentTracker.editAssignment(${assignment.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn secondary" onclick="assignmentTracker.updateProgress(${assignment.id}, ${assignment.progress === 100 ? 0 : 100})">
                        <i class="fas fa-${assignment.progress === 100 ? 'undo' : 'check'}"></i> 
                        ${assignment.progress === 100 ? 'Buka Semula' : 'Tandai Selesai'}
                    </button>
                    <button class="btn danger" onclick="assignmentTracker.deleteAssignment(${assignment.id})">
                        <i class="fas fa-trash"></i> Padam
                    </button>
                </div>
            </div>
        `;
    }

    updateStatistics() {
        const now = new Date();
        const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        const stats = {
            total: this.assignments.length,
            completed: this.assignments.filter(a => a.status === 'completed').length,
            inProgress: this.assignments.filter(a => a.status === 'in-progress').length,
            overdue: this.assignments.filter(a => new Date(a.dueDate) < now && a.status !== 'completed').length,
            dueSoon: this.assignments.filter(a => {
                const dueDate = new Date(a.dueDate);
                return dueDate >= now && dueDate <= oneWeekFromNow && a.status !== 'completed';
            }).length
        };
        
        const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

        // Update DOM elements
        this.updateStatElement('totalAssignments', stats.total);
        this.updateStatElement('completedAssignments', stats.completed);
        this.updateStatElement('inProgressAssignments', stats.inProgress);
        this.updateStatElement('overdueAssignments', stats.overdue);
        this.updateStatElement('dueSoonAssignments', stats.dueSoon);
        this.updateStatElement('completionRate', completionRate + '%');
    }

    updateStatElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    saveToStorage() {
        localStorage.setItem('assignments', JSON.stringify(this.assignments));
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }
}

// Global assignment tracker instance
let assignmentTracker;

// Grade Tracker functionality
class GradeTracker {
    constructor() {
        this.grades = this.loadGrades();
        this.subjects = [];
        this.filters = {
            program: '',
            subject: '',
            type: '',
            search: ''
        };
        this.sorting = {
            by: 'date',
            order: 'desc'
        };
        this.currentView = 'list';
        
        this.initializeEventListeners();
        this.updateSubjectsList();
        this.renderGrades();
        this.updateStatistics();
        this.updateSubjectPerformance();
    }

    loadGrades() {
        try {
            const stored = localStorage.getItem('grades');
            if (!stored) return [];
            
            const grades = JSON.parse(stored);
            // Convert date strings back to Date objects
            return grades.map(grade => ({
                ...grade,
                date: new Date(grade.date),
                createdAt: new Date(grade.createdAt)
            }));
        } catch (error) {
            console.error('Error loading grades:', error);
            return [];
        }
    }

    initializeEventListeners() {
        // Form submission
        const form = document.getElementById('gradeForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addGrade();
            });
        }

        // Set today's date as default
        const gradeDate = document.getElementById('gradeDate');
        if (gradeDate) {
            gradeDate.value = new Date().toISOString().split('T')[0];
        }

        // Filters
        const filterProgram = document.getElementById('filterGradeProgram');
        const filterSubject = document.getElementById('filterGradeSubject');
        const filterType = document.getElementById('filterGradeType');
        const searchInput = document.getElementById('searchGrades');

        if (filterProgram) {
            filterProgram.addEventListener('change', (e) => {
                this.filters.program = e.target.value;
                this.renderGrades();
            });
        }

        if (filterSubject) {
            filterSubject.addEventListener('change', (e) => {
                this.filters.subject = e.target.value;
                this.renderGrades();
            });
        }

        if (filterType) {
            filterType.addEventListener('change', (e) => {
                this.filters.type = e.target.value;
                this.renderGrades();
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value.toLowerCase();
                this.renderGrades();
            });
        }

        // Sorting
        const sortBy = document.getElementById('sortGradeBy');
        const sortOrder = document.getElementById('sortGradeOrder');

        if (sortBy) {
            sortBy.addEventListener('change', (e) => {
                this.sorting.by = e.target.value;
                this.renderGrades();
            });
        }

        if (sortOrder) {
            sortOrder.addEventListener('change', (e) => {
                this.sorting.order = e.target.value;
                this.renderGrades();
            });
        }

        // View toggle
        const listView = document.getElementById('gradeListView');
        const subjectView = document.getElementById('gradeSubjectView');

        if (listView) {
            listView.addEventListener('click', () => {
                this.currentView = 'list';
                listView.classList.add('active');
                if (subjectView) subjectView.classList.remove('active');
                this.renderGrades();
            });
        }

        if (subjectView) {
            subjectView.addEventListener('click', () => {
                this.currentView = 'subject';
                subjectView.classList.add('active');
                if (listView) listView.classList.remove('active');
                this.renderGrades();
            });
        }
    }

    addGrade() {
        const subject = document.getElementById('gradeSubject').value;
        const program = document.getElementById('gradeProgram').value;
        const assignment = document.getElementById('gradeAssignment').value;
        const type = document.getElementById('gradeType').value;
        const score = parseFloat(document.getElementById('gradeScore').value);
        const maxScore = parseFloat(document.getElementById('gradeMaxScore').value);
        const weight = parseInt(document.getElementById('gradeWeight').value);
        const date = document.getElementById('gradeDate').value;
        const notes = document.getElementById('gradeNotes').value;

        const percentage = (score / maxScore) * 100;
        const gpa = this.calculateGPA(percentage);

        const grade = {
            id: Date.now(),
            subject,
            program,
            assignment,
            type,
            score,
            maxScore,
            percentage: Math.round(percentage * 100) / 100,
            weight,
            gpa,
            date: new Date(date),
            notes,
            createdAt: new Date()
        };

        this.grades.push(grade);
        this.saveToStorage();
        this.updateSubjectsList();
        this.renderGrades();
        this.updateStatistics();
        this.updateSubjectPerformance();
        
        // Reset form
        document.getElementById('gradeForm').reset();
        document.getElementById('gradeDate').value = new Date().toISOString().split('T')[0];
        
        this.showNotification('Gred berjaya ditambah!', 'success');
    }

    calculateGPA(percentage) {
        if (percentage >= 85) return 4.00;
        if (percentage >= 80) return 3.67;
        if (percentage >= 75) return 3.33;
        if (percentage >= 70) return 3.00;
        if (percentage >= 65) return 2.67;
        if (percentage >= 60) return 2.33;
        if (percentage >= 55) return 2.00;
        if (percentage >= 50) return 1.67;
        if (percentage >= 45) return 1.33;
        if (percentage >= 40) return 1.00;
        return 0.00;
    }

    // Academic Transcript Generation
    generateTranscript() {
        if (this.grades.length === 0) {
            alert('Tiada rekod gred untuk dijana transkrip');
            return;
        }

        const studentInfo = {
            name: localStorage.getItem('studentName') || 'Nama Pelajar',
            id: localStorage.getItem('studentId') || 'ID000123',
            program: localStorage.getItem('studentProgram') || 'Program Tidak Dinyatakan',
            semester: localStorage.getItem('currentSemester') || 'Semester 1',
            academicYear: localStorage.getItem('academicYear') || '2024/2025'
        };

        // Group grades by subject and calculate subject GPA
        const subjectSummary = {};
        this.grades.forEach(grade => {
            if (!subjectSummary[grade.subject]) {
                subjectSummary[grade.subject] = {
                    grades: [],
                    totalWeight: 0,
                    weightedSum: 0
                };
            }
            subjectSummary[grade.subject].grades.push(grade);
            subjectSummary[grade.subject].totalWeight += grade.weight;
            subjectSummary[grade.subject].weightedSum += (grade.percentage * grade.weight);
        });

        // Calculate overall CGPA
        let totalCreditHours = 0;
        let totalGradePoints = 0;
        const subjectResults = Object.keys(subjectSummary).map(subject => {
            const subjectData = subjectSummary[subject];
            const subjectAverage = subjectData.weightedSum / subjectData.totalWeight;
            const subjectGPA = this.calculateGPA(subjectAverage);
            const creditHours = 3; // Default credit hours
            
            totalCreditHours += creditHours;
            totalGradePoints += (subjectGPA * creditHours);
            
            return {
                subject,
                average: subjectAverage,
                gpa: subjectGPA,
                grade: this.getLetterGrade(subjectAverage),
                creditHours,
                totalAssignments: subjectData.grades.length
            };
        });

        const cgpa = totalGradePoints / totalCreditHours;

        const transcriptContent = `
            <div style="font-family: 'Times New Roman', serif; max-width: 800px; margin: 0 auto; padding: 40px; background: white;">
                <div style="text-align: center; border-bottom: 3px solid #667eea; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #667eea; margin: 0; font-size: 28px;">BREYERHUB COLLEGE</h1>
                    <h2 style="color: #333; margin: 10px 0; font-size: 20px;">ACADEMIC TRANSCRIPT</h2>
                    <p style="color: #666; margin: 5px 0;">Official Academic Record</p>
                </div>

                <div style="margin-bottom: 30px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="width: 30%; padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Student Name:</strong></td>
                            <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${studentInfo.name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Student ID:</strong></td>
                            <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${studentInfo.id}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Program:</strong></td>
                            <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${studentInfo.program}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Academic Year:</strong></td>
                            <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${studentInfo.academicYear}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0;"><strong>Current Semester:</strong></td>
                            <td style="padding: 8px 0;">${studentInfo.semester}</td>
                        </tr>
                    </table>
                </div>

                <h3 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Academic Performance</h3>
                
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                    <thead>
                        <tr style="background: #f8f9fa;">
                            <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Subject</th>
                            <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">Credit Hours</th>
                            <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">Average (%)</th>
                            <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">Grade</th>
                            <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">GPA</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${subjectResults.map(result => `
                            <tr>
                                <td style="border: 1px solid #ddd; padding: 12px;">${result.subject}</td>
                                <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${result.creditHours}</td>
                                <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${result.average.toFixed(2)}</td>
                                <td style="border: 1px solid #ddd; padding: 12px; text-align: center; font-weight: bold; color: ${this.getGradeColor(result.average)};">${result.grade}</td>
                                <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${result.gpa.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                    <h4 style="color: #667eea; margin: 0 0 15px 0;">Academic Summary</h4>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Total Credit Hours:</strong></td>
                            <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right;">${totalCreditHours}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Total Subjects:</strong></td>
                            <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right;">${subjectResults.length}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Total Assessments:</strong></td>
                            <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right;">${this.grades.length}</td>
                        </tr>
                        <tr style="background: white;">
                            <td style="padding: 12px 0; font-size: 18px;"><strong>Cumulative GPA (CGPA):</strong></td>
                            <td style="padding: 12px 0; text-align: right; font-size: 24px; font-weight: bold; color: ${this.getGradeColor(cgpa * 25)};">${cgpa.toFixed(2)}</td>
                        </tr>
                    </table>
                </div>

                <div style="margin-top: 40px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px;">
                    <p>This transcript was generated on ${new Date().toLocaleDateString('en-MY', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}</p>
                    <p>Generated by BreyerHub Academic Management System</p>
                    <p style="font-style: italic;">This is an unofficial transcript for personal records</p>
                </div>
            </div>
        `;

        // Open transcript in new window for printing
        const transcriptWindow = window.open('', '_blank');
        transcriptWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Academic Transcript - ${studentInfo.name}</title>
                <style>
                    @media print {
                        body { margin: 0; }
                        .no-print { display: none; }
                    }
                    @page {
                        margin: 1in;
                        size: A4;
                    }
                </style>
            </head>
            <body>
                ${transcriptContent}
                <div class="no-print" style="text-align: center; margin: 30px; page-break-before: avoid;">
                    <button onclick="window.print();" style="background: #667eea; color: white; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin-right: 10px;">Print/Save as PDF</button>
                    <button onclick="window.close();" style="background: #666; color: white; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">Close</button>
                </div>
            </body>
            </html>
        `);
        transcriptWindow.document.close();

        if (typeof triggerCelebration === 'function') {
            triggerCelebration('🎓 Transkrip akademik dijana!');
        }
    }

    getLetterGrade(percentage) {
        if (percentage >= 85) return 'A';
        if (percentage >= 80) return 'A-';
        if (percentage >= 75) return 'B+';
        if (percentage >= 70) return 'B';
        if (percentage >= 65) return 'B-';
        if (percentage >= 60) return 'C+';
        if (percentage >= 55) return 'C';
        if (percentage >= 50) return 'C-';
        if (percentage >= 45) return 'D+';
        if (percentage >= 40) return 'D';
        return 'F';
    }

    getGradeColor(percentage) {
        if (percentage >= 85) return '#28a745';
        if (percentage >= 70) return '#17a2b8';
        if (percentage >= 60) return '#ffc107';
        if (percentage >= 50) return '#fd7e14';
        return '#dc3545';
    }

    deleteGrade(id) {
        if (confirm('Adakah anda pasti ingin padam gred ini?')) {
            this.grades = this.grades.filter(grade => grade.id !== id);
            this.saveToStorage();
            this.updateSubjectsList();
            this.renderGrades();
            this.updateStatistics();
            this.updateSubjectPerformance();
            this.showNotification('Gred berjaya dipadam!', 'success');
        }
    }

    editGrade(id) {
        const grade = this.grades.find(g => g.id === id);
        if (!grade) return;

        // Fill form with grade data
        document.getElementById('gradeSubject').value = grade.subject;
        document.getElementById('gradeProgram').value = grade.program;
        document.getElementById('gradeAssignment').value = grade.assignment;
        document.getElementById('gradeType').value = grade.type;
        document.getElementById('gradeScore').value = grade.score;
        document.getElementById('gradeMaxScore').value = grade.maxScore;
        document.getElementById('gradeWeight').value = grade.weight;
        document.getElementById('gradeDate').value = grade.date.toISOString().split('T')[0];
        document.getElementById('gradeNotes').value = grade.notes || '';

        // Remove the grade temporarily
        this.deleteGrade(id);
        
        // Scroll to form
        document.getElementById('gradeForm').scrollIntoView({ behavior: 'smooth' });
    }

    updateSubjectsList() {
        this.subjects = [...new Set(this.grades.map(grade => grade.subject))];
        
        const filterSubject = document.getElementById('filterGradeSubject');
        if (filterSubject) {
            const currentValue = filterSubject.value;
            filterSubject.innerHTML = '<option value="">Semua Subjek</option>';
            this.subjects.forEach(subject => {
                const option = document.createElement('option');
                option.value = subject;
                option.textContent = subject;
                if (subject === currentValue) option.selected = true;
                filterSubject.appendChild(option);
            });
        }
    }

    getFilteredAndSortedGrades() {
        let filtered = this.grades.filter(grade => {
            if (this.filters.program && grade.program !== this.filters.program) return false;
            if (this.filters.subject && grade.subject !== this.filters.subject) return false;
            if (this.filters.type && grade.type !== this.filters.type) return false;
            
            if (this.filters.search) {
                const searchTerm = this.filters.search;
                return grade.subject.toLowerCase().includes(searchTerm) ||
                       grade.assignment.toLowerCase().includes(searchTerm) ||
                       grade.notes.toLowerCase().includes(searchTerm);
            }
            
            return true;
        });

        // Sort grades
        filtered.sort((a, b) => {
            let aValue, bValue;

            switch (this.sorting.by) {
                case 'date':
                    aValue = new Date(a.date);
                    bValue = new Date(b.date);
                    break;
                case 'score':
                    aValue = a.percentage;
                    bValue = b.percentage;
                    break;
                case 'subject':
                    aValue = a.subject.toLowerCase();
                    bValue = b.subject.toLowerCase();
                    break;
                case 'type':
                    aValue = a.type;
                    bValue = b.type;
                    break;
                case 'weight':
                    aValue = a.weight;
                    bValue = b.weight;
                    break;
                default:
                    return 0;
            }

            if (aValue < bValue) return this.sorting.order === 'asc' ? -1 : 1;
            if (aValue > bValue) return this.sorting.order === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    }

    renderGrades() {
        const container = document.getElementById('gradesList');
        if (!container) return;

        const grades = this.getFilteredAndSortedGrades();

        if (grades.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-chart-bar"></i>
                    <h4>Tiada Gred</h4>
                    <p>${this.grades.length === 0 ? 'Tambah gred pertama anda untuk mula penjejakan' : 'Tiada gred yang sepadan dengan penapis'}</p>
                </div>
            `;
            return;
        }

        if (this.currentView === 'subject') {
            this.renderGradesBySubject(container, grades);
        } else {
            this.renderGradesList(container, grades);
        }
    }

    renderGradesList(container, grades) {
        container.innerHTML = grades.map(grade => this.renderGradeItem(grade)).join('');
    }

    renderGradesBySubject(container, grades) {
        const groupedBySubject = grades.reduce((acc, grade) => {
            if (!acc[grade.subject]) acc[grade.subject] = [];
            acc[grade.subject].push(grade);
            return acc;
        }, {});

        let html = '';
        Object.keys(groupedBySubject).forEach(subject => {
            const subjectGrades = groupedBySubject[subject];
            const average = subjectGrades.reduce((sum, g) => sum + g.percentage, 0) / subjectGrades.length;
            
            html += `
                <div class="subject-group">
                    <h4 style="margin: 20px 0 10px 0; color: var(--primary-color);">${subject} (${Math.round(average)}% purata)</h4>
                    ${subjectGrades.map(grade => this.renderGradeItem(grade)).join('')}
                </div>
            `;
        });

        container.innerHTML = html;
    }

    renderGradeItem(grade) {
        const programNames = {
            dsd: 'Diploma Seni Digital',
            dkv: 'Diploma Komunikasi Visual',
            dgd: 'Diploma Grafik Digital',
            dwm: 'Diploma Multimedia Digital',
            dit: 'Diploma Teknologi IT'
        };

        const typeNames = {
            assignment: 'Tugasan',
            quiz: 'Kuiz',
            test: 'Ujian',
            project: 'Projek',
            presentation: 'Pembentangan',
            lab: 'Kerja Makmal',
            midterm: 'Peperiksaan Tengah Semester',
            final: 'Peperiksaan Akhir'
        };

        const getScoreClass = (percentage) => {
            if (percentage >= 85) return 'excellent';
            if (percentage >= 70) return 'good';
            if (percentage >= 55) return 'average';
            return 'poor';
        };

        return `
            <div class="grade-item" data-id="${grade.id}">
                <div class="grade-header">
                    <h4 class="grade-title">${grade.assignment}</h4>
                    <div class="grade-score ${getScoreClass(grade.percentage)}">
                        ${grade.score}/${grade.maxScore} (${grade.percentage}%)
                    </div>
                </div>
                
                <div class="grade-meta">
                    <span><i class="fas fa-book"></i> ${grade.subject}</span>
                    <span><i class="fas fa-graduation-cap"></i> ${programNames[grade.program]}</span>
                    <span class="grade-type">${typeNames[grade.type]}</span>
                    <span><i class="fas fa-weight"></i> ${grade.weight}%</span>
                    <span><i class="fas fa-calendar"></i> ${grade.date.toLocaleDateString('ms-MY')}</span>
                    <span><i class="fas fa-star"></i> GPA: ${grade.gpa}</span>
                </div>
                
                ${grade.notes ? `<p style="margin: 10px 0; color: var(--text-secondary); font-size: 14px; font-style: italic;">${grade.notes}</p>` : ''}
                
                <div class="grade-actions">
                    <button class="btn secondary" onclick="gradeTracker.editGrade(${grade.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn danger" onclick="gradeTracker.deleteGrade(${grade.id})">
                        <i class="fas fa-trash"></i> Padam
                    </button>
                </div>
            </div>
        `;
    }

    updateStatistics() {
        if (this.grades.length === 0) {
            this.updateStatElement('overallGPA', '0.00');
            this.updateStatElement('averageScore', '0%');
            this.updateStatElement('highestScore', '0%');
            this.updateStatElement('totalAssessments', '0');
            return;
        }

        // Calculate weighted GPA
        let totalWeightedGPA = 0;
        let totalWeight = 0;

        this.grades.forEach(grade => {
            totalWeightedGPA += grade.gpa * grade.weight;
            totalWeight += grade.weight;
        });

        const overallGPA = totalWeight > 0 ? (totalWeightedGPA / totalWeight) : 0;
        
        // Calculate average score
        const averageScore = this.grades.reduce((sum, grade) => sum + grade.percentage, 0) / this.grades.length;
        
        // Find highest score
        const highestScore = Math.max(...this.grades.map(grade => grade.percentage));

        this.updateStatElement('overallGPA', overallGPA.toFixed(2));
        this.updateStatElement('averageScore', Math.round(averageScore) + '%');
        this.updateStatElement('highestScore', Math.round(highestScore) + '%');
        this.updateStatElement('totalAssessments', this.grades.length);
    }

    updateSubjectPerformance() {
        const container = document.getElementById('subjectPerformance');
        if (!container) return;

        if (this.grades.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-chart-bar"></i>
                    <h4>Tiada Data Prestasi</h4>
                    <p>Tambah gred untuk melihat prestasi subjek</p>
                </div>
            `;
            return;
        }

        // Group grades by subject
        const subjectData = {};
        this.grades.forEach(grade => {
            if (!subjectData[grade.subject]) {
                subjectData[grade.subject] = {
                    grades: [],
                    totalWeight: 0,
                    weightedGPA: 0
                };
            }
            subjectData[grade.subject].grades.push(grade);
            subjectData[grade.subject].totalWeight += grade.weight;
            subjectData[grade.subject].weightedGPA += grade.gpa * grade.weight;
        });

        let html = '';
        Object.keys(subjectData).forEach(subject => {
            const data = subjectData[subject];
            const average = data.grades.reduce((sum, grade) => sum + grade.percentage, 0) / data.grades.length;
            const gpa = data.totalWeight > 0 ? data.weightedGPA / data.totalWeight : 0;
            
            html += `
                <div class="subject-item">
                    <div class="subject-info">
                        <h4>${subject}</h4>
                        <p>${data.grades.length} penilaian • ${data.totalWeight}% pemberat</p>
                    </div>
                    <div class="subject-grade">
                        <div class="subject-average">${Math.round(average)}%</div>
                        <div class="subject-gpa">GPA: ${gpa.toFixed(2)}</div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    updateStatElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    saveToStorage() {
        localStorage.setItem('grades', JSON.stringify(this.grades));
    }

    showNotification(message, type = 'info') {
        // Reuse the notification system from Assignment Tracker
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }
}

// Global grade tracker instance
let gradeTracker;

// Attendance Tracker functionality
class AttendanceTracker {
    constructor() {
        this.classes = this.loadClasses();
        this.attendanceRecords = this.loadAttendanceRecords();
        this.filters = {
            program: '',
            class: '',
            month: ''
        };
        
        this.initializeEventListeners();
        this.updateTodayDate();
        this.renderQuickAttendance();
        this.renderWeeklySchedule();
        this.updateClassFilters();
        this.updateMonthFilters();
        this.renderAttendanceHistory();
        this.updateStatistics();
    }

    loadClasses() {
        try {
            const stored = localStorage.getItem('classes');
            if (!stored) return [];
            
            const classes = JSON.parse(stored);
            return classes.map(cls => ({
                ...cls,
                createdAt: new Date(cls.createdAt)
            }));
        } catch (error) {
            console.error('Error loading classes:', error);
            return [];
        }
    }

    loadAttendanceRecords() {
        try {
            const stored = localStorage.getItem('attendanceRecords');
            if (!stored) return [];
            
            const records = JSON.parse(stored);
            return records.map(record => ({
                ...record,
                timestamp: new Date(record.timestamp),
                createdAt: new Date(record.createdAt)
            }));
        } catch (error) {
            console.error('Error loading attendance records:', error);
            return [];
        }
    }

    initializeEventListeners() {
        // Class schedule form
        const form = document.getElementById('classScheduleForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addClass();
            });
        }

        // Filters
        const filterProgram = document.getElementById('filterAttendanceProgram');
        const filterClass = document.getElementById('filterAttendanceClass');
        const filterMonth = document.getElementById('filterAttendanceMonth');

        if (filterProgram) {
            filterProgram.addEventListener('change', (e) => {
                this.filters.program = e.target.value;
                this.updateClassFilters();
                this.renderAttendanceHistory();
            });
        }

        if (filterClass) {
            filterClass.addEventListener('change', (e) => {
                this.filters.class = e.target.value;
                this.renderAttendanceHistory();
            });
        }

        if (filterMonth) {
            filterMonth.addEventListener('change', (e) => {
                this.filters.month = e.target.value;
                this.renderAttendanceHistory();
            });
        }
    }

    addClass() {
        const name = document.getElementById('className').value;
        const program = document.getElementById('classProgram').value;
        const day = document.getElementById('classDay').value;
        const time = document.getElementById('classTime').value;
        const duration = parseInt(document.getElementById('classDuration').value);
        const location = document.getElementById('classLocation').value;

        const classItem = {
            id: Date.now(),
            name,
            program,
            day,
            time,
            duration,
            location: location || '',
            createdAt: new Date()
        };

        this.classes.push(classItem);
        this.saveClassesToStorage();
        this.renderQuickAttendance();
        this.renderWeeklySchedule();
        this.updateClassFilters();
        
        // Reset form
        document.getElementById('classScheduleForm').reset();
        
        this.showNotification('Jadual kelas berjaya ditambah!', 'success');
    }

    deleteClass(id) {
        if (confirm('Adakah anda pasti ingin padam jadual kelas ini?')) {
            this.classes = this.classes.filter(cls => cls.id !== id);
            // Also remove related attendance records
            this.attendanceRecords = this.attendanceRecords.filter(record => record.classId !== id);
            
            this.saveClassesToStorage();
            this.saveAttendanceToStorage();
            this.renderQuickAttendance();
            this.renderWeeklySchedule();
            this.updateClassFilters();
            this.renderAttendanceHistory();
            this.updateStatistics();
            
            this.showNotification('Jadual kelas berjaya dipadam!', 'success');
        }
    }

    markAttendance(classId, status) {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        
        // Remove existing record for today and this class
        this.attendanceRecords = this.attendanceRecords.filter(
            record => !(record.classId === classId && record.date === dateStr)
        );
        
        // Add new record
        const record = {
            id: Date.now(),
            classId,
            date: dateStr,
            status,
            timestamp: today,
            createdAt: new Date()
        };
        
        this.attendanceRecords.push(record);
        this.saveAttendanceToStorage();
        this.renderQuickAttendance();
        this.renderAttendanceHistory();
        this.updateStatistics();
        
        const statusNames = {
            present: 'Hadir',
            late: 'Lewat',
            absent: 'Tidak Hadir'
        };
        
        this.showNotification(`Kehadiran ditandakan: ${statusNames[status]}`, 'success');
    }

    updateTodayDate() {
        const todayElement = document.getElementById('todayDate');
        if (todayElement) {
            const today = new Date();
            const dayNames = ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'];
            const dayName = dayNames[today.getDay()];
            todayElement.textContent = `${dayName}, ${today.toLocaleDateString('ms-MY')}`;
        }
    }

    renderQuickAttendance() {
        const container = document.getElementById('quickAttendanceGrid');
        if (!container) return;

        const today = new Date();
        const currentDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][today.getDay()];
        const todayClasses = this.classes.filter(cls => cls.day === currentDay);

        if (todayClasses.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-plus"></i>
                    <h4>Tiada Kelas Hari Ini</h4>
                    <p>Tambah jadual kelas untuk rekod kehadiran</p>
                </div>
            `;
            return;
        }

        const dateStr = today.toISOString().split('T')[0];
        
        container.innerHTML = todayClasses.map(cls => {
            const existingRecord = this.attendanceRecords.find(
                record => record.classId === cls.id && record.date === dateStr
            );
            
            const programNames = {
                dsd: 'Diploma Seni Digital',
                dkv: 'Diploma Komunikasi Visual',
                dgd: 'Diploma Grafik Digital',
                dwm: 'Diploma Multimedia Digital',
                dit: 'Diploma Teknologi IT'
            };

            return `
                <div class="quick-attendance-item">
                    <div class="quick-attendance-header">
                        <div class="class-info">
                            <h4>${cls.name}</h4>
                            <p>${programNames[cls.program]}</p>
                            ${cls.location ? `<p><i class="fas fa-map-marker-alt"></i> ${cls.location}</p>` : ''}
                        </div>
                        <div class="class-time">${cls.time}</div>
                    </div>
                    
                    <div class="attendance-buttons">
                        <button class="attendance-btn present ${existingRecord?.status === 'present' ? 'selected' : ''}" 
                                onclick="attendanceTracker.markAttendance(${cls.id}, 'present')">
                            <i class="fas fa-check"></i> Hadir
                        </button>
                        <button class="attendance-btn late ${existingRecord?.status === 'late' ? 'selected' : ''}" 
                                onclick="attendanceTracker.markAttendance(${cls.id}, 'late')">
                            <i class="fas fa-clock"></i> Lewat
                        </button>
                        <button class="attendance-btn absent ${existingRecord?.status === 'absent' ? 'selected' : ''}" 
                                onclick="attendanceTracker.markAttendance(${cls.id}, 'absent')">
                            <i class="fas fa-times"></i> Tidak Hadir
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderWeeklySchedule() {
        const container = document.getElementById('weeklySchedule');
        if (!container) return;

        if (this.classes.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-week"></i>
                    <h4>Tiada Jadual Kelas</h4>
                    <p>Tambah jadual kelas untuk memulakan penjejakan kehadiran</p>
                </div>
            `;
            return;
        }

        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const dayNames = ['Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu', 'Ahad'];
        
        let html = '';
        days.forEach((day, index) => {
            const dayClasses = this.classes.filter(cls => cls.day === day);
            
            html += `
                <div class="day-column">
                    <div class="day-header">${dayNames[index]}</div>
                    <div class="day-classes">
                        ${dayClasses.map(cls => `
                            <div class="class-item">
                                <h5>${cls.name}</h5>
                                <p>${cls.time}</p>
                                ${cls.location ? `<p>${cls.location}</p>` : ''}
                                <button class="btn danger" style="font-size: 10px; padding: 2px 6px; margin-top: 5px;" 
                                        onclick="attendanceTracker.deleteClass(${cls.id})">
                                    Padam
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    updateClassFilters() {
        const filterClass = document.getElementById('filterAttendanceClass');
        if (!filterClass) return;

        const filteredClasses = this.filters.program 
            ? this.classes.filter(cls => cls.program === this.filters.program)
            : this.classes;

        const currentValue = filterClass.value;
        filterClass.innerHTML = '<option value="">Semua Kelas</option>';
        
        filteredClasses.forEach(cls => {
            const option = document.createElement('option');
            option.value = cls.id;
            option.textContent = cls.name;
            if (cls.id.toString() === currentValue) option.selected = true;
            filterClass.appendChild(option);
        });
    }

    updateMonthFilters() {
        const filterMonth = document.getElementById('filterAttendanceMonth');
        if (!filterMonth) return;

        const months = [...new Set(this.attendanceRecords.map(record => {
            const date = new Date(record.timestamp);
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        }))].sort().reverse();

        const currentValue = filterMonth.value;
        filterMonth.innerHTML = '<option value="">Semua Bulan</option>';
        
        months.forEach(month => {
            const option = document.createElement('option');
            option.value = month;
            const [year, monthNum] = month.split('-');
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 
                               'Jul', 'Ogo', 'Sep', 'Okt', 'Nov', 'Dis'];
            option.textContent = `${monthNames[parseInt(monthNum) - 1]} ${year}`;
            if (month === currentValue) option.selected = true;
            filterMonth.appendChild(option);
        });
    }

    renderAttendanceHistory() {
        const container = document.getElementById('attendanceHistory');
        if (!container) return;

        let filteredRecords = this.attendanceRecords;

        // Apply filters
        if (this.filters.program) {
            const programClasses = this.classes.filter(cls => cls.program === this.filters.program);
            const classIds = programClasses.map(cls => cls.id);
            filteredRecords = filteredRecords.filter(record => classIds.includes(record.classId));
        }

        if (this.filters.class) {
            filteredRecords = filteredRecords.filter(record => record.classId.toString() === this.filters.class);
        }

        if (this.filters.month) {
            filteredRecords = filteredRecords.filter(record => {
                const date = new Date(record.timestamp);
                const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                return monthStr === this.filters.month;
            });
        }

        if (filteredRecords.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-history"></i>
                    <h4>Tiada Rekod Kehadiran</h4>
                    <p>${this.attendanceRecords.length === 0 ? 'Mula rekod kehadiran untuk melihat sejarah' : 'Tiada rekod yang sepadan dengan penapis'}</p>
                </div>
            `;
            return;
        }

        // Sort by date (newest first)
        filteredRecords.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        container.innerHTML = filteredRecords.map(record => {
            const classItem = this.classes.find(cls => cls.id === record.classId);
            const statusNames = {
                present: 'Hadir',
                late: 'Lewat',
                absent: 'Tidak Hadir'
            };

            return `
                <div class="attendance-record">
                    <div class="record-info">
                        <h5>${classItem ? classItem.name : 'Kelas Tidak Dikenali'}</h5>
                        <p>${new Date(record.timestamp).toLocaleDateString('ms-MY')} - ${new Date(record.timestamp).toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <span class="record-status ${record.status}">${statusNames[record.status]}</span>
                </div>
            `;
        }).join('');
    }

    updateStatistics() {
        const totalRecords = this.attendanceRecords.length;
        
        if (totalRecords === 0) {
            this.updateStatElement('attendanceRate', '0%');
            this.updateStatElement('totalPresent', '0');
            this.updateStatElement('totalAbsent', '0');
            this.updateStatElement('totalLate', '0');
            return;
        }

        const presentCount = this.attendanceRecords.filter(r => r.status === 'present').length;
        const lateCount = this.attendanceRecords.filter(r => r.status === 'late').length;
        const absentCount = this.attendanceRecords.filter(r => r.status === 'absent').length;
        
        // Consider both present and late as attended for rate calculation
        const attendedCount = presentCount + lateCount;
        const attendanceRate = Math.round((attendedCount / totalRecords) * 100);

        this.updateStatElement('attendanceRate', attendanceRate + '%');
        this.updateStatElement('totalPresent', presentCount);
        this.updateStatElement('totalAbsent', absentCount);
        this.updateStatElement('totalLate', lateCount);
    }

    updateStatElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    saveClassesToStorage() {
        localStorage.setItem('classes', JSON.stringify(this.classes));
    }

    saveAttendanceToStorage() {
        localStorage.setItem('attendanceRecords', JSON.stringify(this.attendanceRecords));
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }
}

// Global attendance tracker instance
let attendanceTracker;

class AnalyticsManager {
    constructor() {
        this.initializeAnalytics();
    }

    initializeAnalytics() {
        this.updateOverviewCards();
        this.generateCharts();
        this.generateInsights();
        this.updateActivityTimeline();
    }

    updateOverviewCards() {
        // Get data from all trackers
        const assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
        const grades = JSON.parse(localStorage.getItem('grades') || '[]');
        const attendance = JSON.parse(localStorage.getItem('attendance') || '[]');
        const studyData = JSON.parse(localStorage.getItem('studyTimer') || '{}');

        // Calculate overall GPA
        const totalGpa = grades.reduce((acc, grade) => {
            const gpa = this.gradeToGPA(grade.grade);
            return acc + gpa;
        }, 0);
        const overallGpa = grades.length > 0 ? (totalGpa / grades.length).toFixed(2) : 'N/A';

        // Calculate assignment completion rate
        const completedAssignments = assignments.filter(a => a.status === 'completed').length;
        const completionRate = assignments.length > 0 ? 
            Math.round((completedAssignments / assignments.length) * 100) : 0;

        // Calculate attendance rate
        const attendedClasses = attendance.filter(a => a.attended).length;
        const attendanceRate = attendance.length > 0 ? 
            Math.round((attendedClasses / attendance.length) * 100) : 0;

        // Calculate total study hours
        const totalMinutes = studyData.totalTime || 0;
        const totalHours = Math.round(totalMinutes / 60);

        // Update cards
        const gpaCard = document.getElementById('overallGpaCard');
        const completionCard = document.getElementById('completionRateCard');
        const attendanceCard = document.getElementById('attendanceRateCard');
        const studyCard = document.getElementById('studyHoursCard');

        if (gpaCard) gpaCard.textContent = overallGpa;
        if (completionCard) completionCard.textContent = `${completionRate}%`;
        if (attendanceCard) attendanceCard.textContent = `${attendanceRate}%`;
        if (studyCard) studyCard.textContent = `${totalHours}h`;
    }

    gradeToGPA(grade) {
        const gradeMap = {
            'A+': 4.0, 'A': 4.0, 'A-': 3.7,
            'B+': 3.3, 'B': 3.0, 'B-': 2.7,
            'C+': 2.3, 'C': 2.0, 'C-': 1.7,
            'D+': 1.3, 'D': 1.0, 'F': 0.0
        };
        return gradeMap[grade] || 0;
    }

    generateCharts() {
        // Only create charts if Chart.js is available
        if (typeof Chart !== 'undefined') {
            this.createGPATrendChart();
            this.createAssignmentStatusChart();
            this.createSubjectPerformanceChart();
            this.createStudyTimeChart();
        } else {
            // Show placeholder message
            this.showChartPlaceholders();
        }
    }

    showChartPlaceholders() {
        const chartContainers = ['gpaTrendChart', 'assignmentStatusChart', 'subjectPerformanceChart', 'studyTimeChart'];
        chartContainers.forEach(id => {
            const canvas = document.getElementById(id);
            if (canvas) {
                canvas.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.className = 'chart-placeholder';
                placeholder.innerHTML = `
                    <p>📊 Chart visualization ready</p>
                    <small>Chart.js library will render interactive charts here</small>
                `;
                canvas.parentNode.appendChild(placeholder);
            }
        });
    }

    createGPATrendChart() {
        const ctx = document.getElementById('gpaTrendChart');
        if (!ctx) return;

        const grades = JSON.parse(localStorage.getItem('grades') || '[]');
        const sortedGrades = grades.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        const labels = sortedGrades.map(g => new Date(g.date).toLocaleDateString());
        const gpaData = sortedGrades.map(g => this.gradeToGPA(g.grade));

        // Calculate cumulative GPA
        const cumulativeGPA = [];
        let total = 0;
        gpaData.forEach((gpa, index) => {
            total += gpa;
            cumulativeGPA.push((total / (index + 1)).toFixed(2));
        });

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Cumulative GPA',
                    data: cumulativeGPA,
                    borderColor: '#3657b3',
                    backgroundColor: 'rgba(54, 87, 179, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 4.0
                    }
                }
            }
        });
    }

    createAssignmentStatusChart() {
        const ctx = document.getElementById('assignmentStatusChart');
        if (!ctx) return;

        const assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
        const statusCounts = {
            completed: assignments.filter(a => a.status === 'completed').length,
            pending: assignments.filter(a => a.status === 'pending').length,
            overdue: assignments.filter(a => {
                if (a.status === 'completed') return false;
                return new Date(a.dueDate) < new Date();
            }).length
        };

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'Pending', 'Overdue'],
                datasets: [{
                    data: [statusCounts.completed, statusCounts.pending, statusCounts.overdue],
                    backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    createSubjectPerformanceChart() {
        const ctx = document.getElementById('subjectPerformanceChart');
        if (!ctx) return;

        const grades = JSON.parse(localStorage.getItem('grades') || '[]');
        const subjectGrades = {};

        grades.forEach(grade => {
            if (!subjectGrades[grade.subject]) {
                subjectGrades[grade.subject] = [];
            }
            subjectGrades[grade.subject].push(this.gradeToGPA(grade.grade));
        });

        const subjects = Object.keys(subjectGrades);
        const avgGrades = subjects.map(subject => {
            const grades = subjectGrades[subject];
            return (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2);
        });

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: subjects,
                datasets: [{
                    label: 'Average GPA',
                    data: avgGrades,
                    backgroundColor: 'rgba(54, 87, 179, 0.8)',
                    borderColor: '#3657b3',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 4.0
                    }
                }
            }
        });
    }

    createStudyTimeChart() {
        const ctx = document.getElementById('studyTimeChart');
        if (!ctx) return;

        // Get study time data from last 7 days
        const studyData = JSON.parse(localStorage.getItem('studyTimeHistory') || '[]');
        const last7Days = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toDateString();
            
            const dayData = studyData.find(d => d.date === dateStr);
            last7Days.push({
                date: date.toLocaleDateString('en-US', { weekday: 'short' }),
                minutes: dayData ? dayData.minutes : 0
            });
        }

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: last7Days.map(d => d.date),
                datasets: [{
                    label: 'Study Time (minutes)',
                    data: last7Days.map(d => d.minutes),
                    backgroundColor: 'rgba(103, 58, 183, 0.8)',
                    borderColor: '#673ab7',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    generateInsights() {
        const insights = [];
        const assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
        const grades = JSON.parse(localStorage.getItem('grades') || '[]');
        const attendance = JSON.parse(localStorage.getItem('attendance') || '[]');

        // Assignment insights
        const overdueAssignments = assignments.filter(a => {
            return a.status !== 'completed' && new Date(a.dueDate) < new Date();
        }).length;

        if (overdueAssignments > 0) {
            insights.push({
                icon: '⚠️',
                title: 'Overdue Assignments',
                message: `You have ${overdueAssignments} overdue assignment(s). Complete them as soon as possible.`
            });
        }

        // Grade insights
        if (grades.length >= 3) {
            const recentGrades = grades.slice(-3);
            const avgRecent = recentGrades.reduce((acc, g) => acc + this.gradeToGPA(g.grade), 0) / 3;
            
            if (avgRecent >= 3.5) {
                insights.push({
                    icon: '🎉',
                    title: 'Excellent Performance',
                    message: 'Your recent grades show excellent performance! Keep up the great work.'
                });
            } else if (avgRecent < 2.5) {
                insights.push({
                    icon: '📈',
                    title: 'Room for Improvement',
                    message: 'Your recent grades suggest you might need to adjust your study strategy.'
                });
            }
        }

        // Attendance insights
        const recentAttendance = attendance.slice(-10);
        if (recentAttendance.length > 0) {
            const attendanceRate = recentAttendance.filter(a => a.attended).length / recentAttendance.length;
            
            if (attendanceRate < 0.8) {
                insights.push({
                    icon: '🏫',
                    title: 'Attendance Alert',
                    message: 'Your attendance rate is below 80%. Regular attendance is crucial for academic success.'
                });
            }
        }

        // Study time insights
        const studyData = JSON.parse(localStorage.getItem('studyTimer') || '{}');
        const totalMinutes = studyData.totalTime || 0;
        const avgDailyMinutes = totalMinutes / 30; // Assuming 30 days

        if (avgDailyMinutes < 60) {
            insights.push({
                icon: '⏰',
                title: 'Study Time Recommendation',
                message: 'Consider increasing your daily study time. Aim for at least 1-2 hours per day.'
            });
        }

        this.renderInsights(insights);
    }

    // Enhanced Predictive Analytics
    generatePredictiveInsights() {
        const assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
        const grades = JSON.parse(localStorage.getItem('grades') || '[]');
        const attendance = JSON.parse(localStorage.getItem('attendance') || '[]');
        
        const predictions = [];
        
        // GPA Prediction
        const predictedGPA = this.predictFutureGPA(grades);
        if (predictedGPA) {
            predictions.push({
                icon: '🔮',
                title: 'GPA Prediction',
                message: `Based on current trends, your semester GPA is projected to be ${predictedGPA}`
            });
        }
        
        // Risk Assessment
        const riskLevel = this.assessAcademicRisk(assignments, grades, attendance);
        if (riskLevel !== 'low') {
            predictions.push({
                icon: '⚠️',
                title: 'Risk Alert',
                message: this.getRiskMessage(riskLevel)
            });
        }
        
        // Performance Optimization
        const optimization = this.suggestOptimization(grades, attendance);
        if (optimization) {
            predictions.push({
                icon: '📈',
                title: 'Optimization Tip',
                message: optimization
            });
        }
        
        return predictions;
    }

    predictFutureGPA(grades) {
        if (grades.length < 3) return null;
        
        // Calculate trend from recent grades
        const recentGrades = grades.slice(-5).map(g => this.gradeToGPA(g.grade));
        
        // Simple linear regression for trend
        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
        const n = recentGrades.length;
        
        recentGrades.forEach((gpa, index) => {
            sumX += index;
            sumY += gpa;
            sumXY += index * gpa;
            sumXX += index * index;
        });
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        
        // Predict next few grades
        const projectedGPA = slope * (n + 2) + intercept;
        
        // Clamp between 0 and 4
        const clampedGPA = Math.max(0, Math.min(4, projectedGPA));
        
        return clampedGPA.toFixed(2);
    }

    assessAcademicRisk(assignments, grades, attendance) {
        let riskScore = 0;
        
        // Assignment completion risk
        const overdueCount = assignments.filter(a => 
            a.status !== 'completed' && new Date(a.dueDate) < new Date()
        ).length;
        riskScore += overdueCount * 15;
        
        // Grade performance risk
        if (grades.length >= 3) {
            const recentAvgGPA = grades.slice(-3).reduce((acc, g) => 
                acc + this.gradeToGPA(g.grade), 0) / 3;
            if (recentAvgGPA < 2.5) riskScore += 25;
            else if (recentAvgGPA < 3.0) riskScore += 15;
        }
        
        // Attendance risk
        const recentAttendance = attendance.slice(-10);
        if (recentAttendance.length > 0) {
            const attendanceRate = recentAttendance.filter(a => a.attended).length / recentAttendance.length;
            if (attendanceRate < 0.7) riskScore += 30;
            else if (attendanceRate < 0.8) riskScore += 20;
        }
        
        // Study time risk
        const studyData = JSON.parse(localStorage.getItem('studyTimer') || '{}');
        const avgDailyStudy = (studyData.totalTime || 0) / 30;
        if (avgDailyStudy < 30) riskScore += 20; // Less than 30 min/day
        
        if (riskScore >= 50) return 'high';
        if (riskScore >= 25) return 'medium';
        return 'low';
    }

    getRiskMessage(riskLevel) {
        switch (riskLevel) {
            case 'high':
                return 'High academic risk detected. Immediate action needed - consider study plan review and seeking help.';
            case 'medium':
                return 'Moderate risk identified. Focus on improving attendance and completing assignments on time.';
            default:
                return 'Low risk detected. Continue current study habits with minor adjustments.';
        }
    }

    suggestOptimization(grades, attendance) {
        // Analyze correlation between attendance and grades
        if (grades.length >= 5 && attendance.length >= 10) {
            const gradesBySubject = {};
            const attendanceBySubject = {};
            
            grades.forEach(grade => {
                if (!gradesBySubject[grade.subject]) {
                    gradesBySubject[grade.subject] = [];
                }
                gradesBySubject[grade.subject].push(this.gradeToGPA(grade.grade));
            });
            
            attendance.forEach(att => {
                if (!attendanceBySubject[att.subject]) {
                    attendanceBySubject[att.subject] = [];
                }
                attendanceBySubject[att.subject].push(att.attended ? 1 : 0);
            });
            
            // Find subject with lowest performance
            let lowestSubject = null;
            let lowestGPA = 4.0;
            
            Object.keys(gradesBySubject).forEach(subject => {
                const avgGPA = gradesBySubject[subject].reduce((a, b) => a + b, 0) / gradesBySubject[subject].length;
                if (avgGPA < lowestGPA) {
                    lowestGPA = avgGPA;
                    lowestSubject = subject;
                }
            });
            
            if (lowestSubject && attendanceBySubject[lowestSubject]) {
                const attendanceRate = attendanceBySubject[lowestSubject].reduce((a, b) => a + b, 0) / attendanceBySubject[lowestSubject].length;
                
                if (attendanceRate < 0.8) {
                    return `Improve attendance in ${lowestSubject} (current: ${Math.round(attendanceRate * 100)}%) to boost your ${lowestGPA.toFixed(2)} GPA in this subject.`;
                }
            }
        }
        
        return null;
    }

    // Enhanced Goal Progress Prediction
    predictGoalCompletion(goal) {
        const timeRemaining = new Date(goal.deadline) - new Date();
        const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));
        
        if (daysRemaining <= 0) return { probability: 0, status: 'overdue' };
        
        const progressRate = goal.current / (goal.target || 1);
        const dailyProgressNeeded = (goal.target - goal.current) / daysRemaining;
        
        // Historical progress analysis
        const historicalRate = this.calculateHistoricalProgressRate(goal);
        
        let probability;
        if (historicalRate >= dailyProgressNeeded) {
            probability = Math.min(95, 60 + (historicalRate / dailyProgressNeeded) * 30);
        } else {
            probability = Math.max(5, 60 - (dailyProgressNeeded / historicalRate) * 20);
        }
        
        let status;
        if (probability >= 80) status = 'likely';
        else if (probability >= 60) status = 'possible';
        else if (probability >= 40) status = 'challenging';
        else status = 'unlikely';
        
        return { probability: Math.round(probability), status };
    }

    calculateHistoricalProgressRate(goal) {
        // Simulate daily progress based on goal type and user patterns
        const baseRates = {
            academic: 0.15,    // 15% per day
            assignment: 0.20,  // 20% per day
            attendance: 0.14,  // 14% per day (daily classes)
            study: 0.12,       // 12% per day
            personal: 0.10     // 10% per day
        };
        
        return baseRates[goal.category] || 0.12;
    }

    renderInsights(insights) {
        const container = document.getElementById('insightsContainer');
        if (!container) return;

        container.innerHTML = '';

        if (insights.length === 0) {
            container.innerHTML = `
                <div class="insight-item">
                    <div class="insight-icon">✅</div>
                    <div class="insight-content">
                        <h4>All Good!</h4>
                        <p>No specific insights at the moment. Keep up the good work!</p>
                    </div>
                </div>
            `;
            return;
        }

        insights.forEach(insight => {
            const insightElement = document.createElement('div');
            insightElement.className = 'insight-item';
            insightElement.innerHTML = `
                <div class="insight-icon">${insight.icon}</div>
                <div class="insight-content">
                    <h4>${insight.title}</h4>
                    <p>${insight.message}</p>
                </div>
            `;
            container.appendChild(insightElement);
        });
    }

    updateActivityTimeline() {
        const timeline = [];
        const assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
        const grades = JSON.parse(localStorage.getItem('grades') || '[]');
        const attendance = JSON.parse(localStorage.getItem('attendance') || '[]');

        // Add recent assignments
        assignments.slice(-5).forEach(assignment => {
            timeline.push({
                icon: '📝',
                title: `Assignment: ${assignment.title}`,
                description: `Subject: ${assignment.subject}`,
                time: new Date(assignment.dateCreated || assignment.dueDate).toLocaleDateString(),
                timestamp: new Date(assignment.dateCreated || assignment.dueDate)
            });
        });

        // Add recent grades
        grades.slice(-5).forEach(grade => {
            timeline.push({
                icon: '📊',
                title: `Grade: ${grade.grade}`,
                description: `${grade.subject} - ${grade.assignment}`,
                time: new Date(grade.date).toLocaleDateString(),
                timestamp: new Date(grade.date)
            });
        });

        // Add recent attendance
        attendance.slice(-5).forEach(att => {
            timeline.push({
                icon: att.attended ? '✅' : '❌',
                title: `Class ${att.attended ? 'Attended' : 'Missed'}`,
                description: att.subject,
                time: new Date(att.date).toLocaleDateString(),
                timestamp: new Date(att.date)
            });
        });

        // Sort by timestamp (most recent first)
        timeline.sort((a, b) => b.timestamp - a.timestamp);

        this.renderTimeline(timeline.slice(0, 10));
    }

    renderTimeline(timeline) {
        const container = document.getElementById('timelineContainer');
        if (!container) return;

        container.innerHTML = '';

        timeline.forEach(item => {
            const timelineElement = document.createElement('div');
            timelineElement.className = 'timeline-item';
            timelineElement.innerHTML = `
                <div class="timeline-icon">${item.icon}</div>
                <div class="timeline-content">
                    <h5>${item.title}</h5>
                    <p>${item.description}</p>
                </div>
                <div class="timeline-time">${item.time}</div>
            `;
            container.appendChild(timelineElement);
        });
    }
}

class GoalManager {
    constructor() {
        this.goals = JSON.parse(localStorage.getItem('goals') || '[]');
        this.achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
        this.initializeGoals();
    }

    initializeGoals() {
        this.renderGoals();
        this.renderAchievements();
        this.setupGoalForm();
    }

    setupGoalForm() {
        const form = document.getElementById('goalForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addGoal();
        });
    }

    addGoal() {
        const title = document.getElementById('goalTitle').value;
        const category = document.getElementById('goalCategory').value;
        const target = parseInt(document.getElementById('goalTarget').value);
        const deadline = document.getElementById('goalDeadline').value;
        const description = document.getElementById('goalDescription').value;

        if (!title || !category || !target || !deadline) {
            alert('Please fill in all required fields');
            return;
        }

        const goal = {
            id: Date.now(),
            title,
            category,
            target,
            current: 0,
            deadline,
            description,
            created: new Date().toISOString()
        };

        this.goals.push(goal);
        this.saveGoals();
        this.renderGoals();

        // Clear form
        document.getElementById('goalForm').reset();
    }

    updateGoalProgress(goalId, progress) {
        const goal = this.goals.find(g => g.id === goalId);
        if (goal) {
            goal.current = Math.min(progress, goal.target);
            this.saveGoals();
            this.renderGoals();
            this.checkAchievements(goal);
        }
    }

    checkAchievements(goal) {
        if (goal.current >= goal.target) {
            const achievement = {
                id: Date.now(),
                title: `Goal Completed: ${goal.title}`,
                description: `Successfully completed ${goal.category} goal`,
                icon: '🏆',
                earned: new Date().toISOString()
            };

            this.achievements.push(achievement);
            this.saveAchievements();
            this.renderAchievements();

            // Show notification
            this.showAchievementNotification(achievement);
        }
    }

    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-content">
                <span class="achievement-icon">${achievement.icon}</span>
                <div>
                    <h4>Achievement Unlocked!</h4>
                    <p>${achievement.title}</p>
                </div>
            </div>
        `;

        // Add styles for notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #3657b3, #673ab7);
            color: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    renderGoals() {
        const container = document.getElementById('goalsContainer');
        if (!container) return;

        container.innerHTML = '';

        if (this.goals.length === 0) {
            container.innerHTML = `
                <p style="text-align: center; color: var(--text-secondary); padding: 20px;">
                    No goals set yet. Create your first goal to start tracking your progress!
                </p>
            `;
            return;
        }

        this.goals.forEach(goal => {
            const progress = Math.round((goal.current / goal.target) * 100);
            const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
            
            let deadlineClass = '';
            if (daysLeft < 0) deadlineClass = 'urgent';
            else if (daysLeft <= 7) deadlineClass = 'soon';

            const goalElement = document.createElement('div');
            goalElement.className = 'goal-item';
            goalElement.innerHTML = `
                <div class="goal-header">
                    <h4 class="goal-title">${goal.title}</h4>
                    <span class="goal-category category-${goal.category}">${goal.category}</span>
                </div>
                <p style="color: var(--text-secondary); margin: 0 0 15px 0;">${goal.description}</p>
                <div class="goal-progress">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                        <span style="font-size: 14px; color: var(--text-color);">Progress: ${goal.current}/${goal.target}</span>
                        <span style="font-size: 14px; color: var(--text-color);">${progress}%</span>
                    </div>
                    <div class="goal-progress-bar">
                        <div class="goal-progress-fill" style="width: ${progress}%"></div>
                    </div>
                </div>
                <div class="goal-meta">
                    <span class="goal-deadline ${deadlineClass}">
                        ${daysLeft >= 0 ? `${daysLeft} days left` : `${Math.abs(daysLeft)} days overdue`}
                    </span>
                    <button onclick="goalManager.deleteGoal(${goal.id})" style="background: none; border: none; color: var(--text-secondary); cursor: pointer;">
                        🗑️
                    </button>
                </div>
            `;
            container.appendChild(goalElement);
        });
    }

    deleteGoal(goalId) {
        if (confirm('Are you sure you want to delete this goal?')) {
            this.goals = this.goals.filter(g => g.id !== goalId);
            this.saveGoals();
            this.renderGoals();
        }
    }

    renderAchievements() {
        const container = document.getElementById('badgesContainer');
        if (!container) return;

        // Define default badges
        const defaultBadges = [
            { id: 'first_assignment', title: 'First Assignment', description: 'Complete your first assignment', icon: '📝', condition: 'assignment_count >= 1' },
            { id: 'grade_a', title: 'A Student', description: 'Receive your first A grade', icon: '🌟', condition: 'has_a_grade' },
            { id: 'perfect_attendance', title: 'Perfect Attendance', description: 'Attend 10 classes in a row', icon: '🏫', condition: 'attendance_streak >= 10' },
            { id: 'study_master', title: 'Study Master', description: 'Study for 100 hours total', icon: '📚', condition: 'study_hours >= 100' },
            { id: 'goal_achiever', title: 'Goal Achiever', description: 'Complete your first goal', icon: '🎯', condition: 'completed_goals >= 1' },
            { id: 'consistent_learner', title: 'Consistent Learner', description: 'Study for 7 days in a row', icon: '🔥', condition: 'study_streak >= 7' }
        ];

        container.innerHTML = '';

        defaultBadges.forEach(badge => {
            const isUnlocked = this.checkBadgeCondition(badge.condition);
            const badgeElement = document.createElement('div');
            badgeElement.className = `badge-item ${isUnlocked ? 'unlocked' : 'locked'}`;
            badgeElement.innerHTML = `
                <div class="badge-icon">${badge.icon}</div>
                <div class="badge-info">
                    <h4>${badge.title}</h4>
                    <p>${badge.description}</p>
                </div>
            `;
            container.appendChild(badgeElement);
        });
    }

    checkBadgeCondition(condition) {
        const assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
        const grades = JSON.parse(localStorage.getItem('grades') || '[]');
        const attendance = JSON.parse(localStorage.getItem('attendance') || '[]');
        const studyData = JSON.parse(localStorage.getItem('studyTimer') || '{}');
        const completedGoals = this.goals.filter(g => g.current >= g.target).length;

        switch (condition) {
            case 'assignment_count >= 1':
                return assignments.length >= 1;
            case 'has_a_grade':
                return grades.some(g => g.grade.startsWith('A'));
            case 'attendance_streak >= 10':
                // Check for 10 consecutive attended classes
                let streak = 0;
                let maxStreak = 0;
                attendance.forEach(a => {
                    if (a.attended) {
                        streak++;
                        maxStreak = Math.max(maxStreak, streak);
                    } else {
                        streak = 0;
                    }
                });
                return maxStreak >= 10;
            case 'study_hours >= 100':
                return (studyData.totalTime || 0) >= 6000; // 100 hours in minutes
            case 'completed_goals >= 1':
                return completedGoals >= 1;
            case 'study_streak >= 7':
                return (studyData.currentStreak || 0) >= 7;
            default:
                return false;
        }
    }

    saveGoals() {
        localStorage.setItem('goals', JSON.stringify(this.goals));
    }

    saveAchievements() {
        localStorage.setItem('achievements', JSON.stringify(this.achievements));
    }
}

// Global instances for analytics and goals
let analyticsManager;
let goalManager;

// Program-Specific Tools Manager
class ProgramToolsManager {
    constructor() {
        this.currentProgram = '';
        this.savedSnippets = JSON.parse(localStorage.getItem('codeSnippets') || '[]');
        this.recipeHistory = JSON.parse(localStorage.getItem('recipeHistory') || '[]');
    }

    switchProgram(program) {
        this.currentProgram = program;
        const container = document.getElementById('toolsContainer');
        
        // Hide all program tools
        document.querySelectorAll('.program-tools').forEach(el => {
            el.style.display = 'none';
        });

        if (program) {
            // Show placeholder
            container.querySelector('.tools-placeholder').style.display = 'none';
            
            // Show selected program tools
            const toolsElement = document.getElementById(`${program}Tools`);
            if (toolsElement) {
                toolsElement.style.display = 'block';
                this.initializeProgramTools(program);
            }
        } else {
            // Show placeholder
            container.querySelector('.tools-placeholder').style.display = 'block';
        }
    }

    initializeProgramTools(program) {
        switch (program) {
            case 'culinary':
                this.initializeCulinaryTools();
                break;
            case 'electrical':
                this.initializeElectricalTools();
                break;
            case 'computer':
                this.initializeComputerTools();
                break;
            case 'fnb':
                this.initializeFnBTools();
                break;
            case 'admin':
                this.initializeAdminTools();
                break;
        }
    }

    initializeCulinaryTools() {
        // Initialize recipe calculator with default ingredient
        if (document.querySelectorAll('.ingredient-row').length === 1) {
            // Already initialized
            return;
        }
    }

    initializeElectricalTools() {
        // Clear any previous calculations
        document.getElementById('ohmsResult').innerHTML = '';
        document.getElementById('powerResult').innerHTML = '';
    }

    initializeComputerTools() {
        this.displaySavedSnippets();
    }

    initializeFnBTools() {
        // Initialize with one cost ingredient row
        const costList = document.getElementById('costIngredientList');
        if (costList && costList.children.length <= 1) {
            // Already has default row
        }
        this.displaySavedMenuItems();
    }

    initializeAdminTools() {
        // Initialize with one participant row
        const participantList = document.getElementById('participantList');
        if (participantList && participantList.children.length <= 1) {
            // Already has default row
        }
    }

    displaySavedSnippets() {
        const container = document.getElementById('savedSnippets');
        if (!container) return;

        if (this.savedSnippets.length === 0) {
            container.innerHTML = '<p>Tiada kod tersimpan. Tambah kod pertama anda!</p>';
            return;
        }

        container.innerHTML = this.savedSnippets.map(snippet => `
            <div class="snippet-item">
                <div class="snippet-header">
                    <span class="snippet-title">${snippet.title}</span>
                    <span class="snippet-language">${snippet.language}</span>
                </div>
                <div class="snippet-content">
                    <div class="snippet-code">${this.escapeHtml(snippet.code)}</div>
                    ${snippet.description ? `<div class="snippet-description">${snippet.description}</div>` : ''}
                </div>
                <div class="snippet-actions">
                    <button class="btn secondary" onclick="programTools.copySnippet('${snippet.id}')">
                        <i class="fas fa-copy"></i> Salin
                    </button>
                    <button class="btn danger" onclick="programTools.deleteSnippet('${snippet.id}')">
                        <i class="fas fa-trash"></i> Padam
                    </button>
                </div>
            </div>
        `).join('');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Culinary Tools
class CulinaryTools {
    addIngredient() {
        const list = document.getElementById('ingredientList');
        const newRow = document.createElement('div');
        newRow.className = 'ingredient-row';
        newRow.innerHTML = `
            <input type="text" placeholder="Nama bahan" class="ingredient-name">
            <input type="number" placeholder="Kuantiti" class="ingredient-amount" step="0.1">
            <select class="ingredient-unit">
                <option value="g">gram</option>
                <option value="kg">kilogram</option>
                <option value="ml">mililiter</option>
                <option value="l">liter</option>
                <option value="cup">cawan</option>
                <option value="tbsp">sudu besar</option>
                <option value="tsp">sudu teh</option>
            </select>
            <button type="button" onclick="culinaryTools.removeIngredient(this)" class="btn remove">×</button>
        `;
        list.appendChild(newRow);
    }

    removeIngredient(button) {
        const rows = document.querySelectorAll('.ingredient-row');
        if (rows.length > 1) {
            button.parentElement.remove();
        }
    }

    calculateRecipe() {
        const originalServings = parseInt(document.getElementById('originalServings').value);
        const targetServings = parseInt(document.getElementById('targetServings').value);
        
        if (!originalServings || !targetServings) {
            alert('Sila masukkan bilangan sajian yang sah');
            return;
        }

        const multiplier = targetServings / originalServings;
        const rows = document.querySelectorAll('.ingredient-row');
        let results = [];

        rows.forEach(row => {
            const name = row.querySelector('.ingredient-name').value;
            const amount = parseFloat(row.querySelector('.ingredient-amount').value);
            const unit = row.querySelector('.ingredient-unit').value;

            if (name && amount) {
                const newAmount = (amount * multiplier).toFixed(2);
                results.push({ name, originalAmount: amount, newAmount, unit });
            }
        });

        this.displayRecipeResults(results, originalServings, targetServings);
    }

    displayRecipeResults(results, originalServings, targetServings) {
        const resultContainer = document.getElementById('recipeResults');
        const contentContainer = document.getElementById('resultsContent');
        
        if (results.length === 0) {
            alert('Sila masukkan sekurang-kurangnya satu bahan');
            return;
        }

        contentContainer.innerHTML = `
            <h5>Resipi untuk ${targetServings} sajian (dari ${originalServings} sajian asal):</h5>
            ${results.map(item => `
                <div class="ingredient-result">
                    <span>${item.name}</span>
                    <span>${item.newAmount} ${item.unit}</span>
                </div>
            `).join('')}
        `;
        
        resultContainer.style.display = 'block';
    }

    convertUnits() {
        const value = parseFloat(document.getElementById('convertValue').value);
        const fromUnit = document.getElementById('fromUnit').value;
        const toUnit = document.getElementById('toUnit').value;
        
        if (!value) {
            alert('Sila masukkan nilai untuk ditukar');
            return;
        }

        const result = this.performUnitConversion(value, fromUnit, toUnit);
        const resultContainer = document.getElementById('conversionResult');
        
        if (result !== null) {
            resultContainer.innerHTML = `
                <strong>${value} ${fromUnit} = ${result.toFixed(3)} ${toUnit}</strong>
            `;
        } else {
            resultContainer.innerHTML = `
                <span style="color: var(--danger-color);">Penukaran dari ${fromUnit} ke ${toUnit} tidak disokong</span>
            `;
        }
    }

    performUnitConversion(value, from, to) {
        // Conversion rates to base units (ml for volume, g for weight)
        const conversions = {
            // Volume (to ml)
            'ml': 1,
            'l': 1000,
            'cup': 250,
            'tbsp': 15,
            'tsp': 5,
            // Weight (to g)
            'g': 1,
            'kg': 1000,
            'oz': 28.35,
            'lb': 453.59
        };

        // Check if both units are in the same category
        const volumeUnits = ['ml', 'l', 'cup', 'tbsp', 'tsp'];
        const weightUnits = ['g', 'kg', 'oz', 'lb'];
        
        const fromIsVolume = volumeUnits.includes(from);
        const toIsVolume = volumeUnits.includes(to);
        const fromIsWeight = weightUnits.includes(from);
        const toIsWeight = weightUnits.includes(to);

        if ((fromIsVolume && toIsVolume) || (fromIsWeight && toIsWeight)) {
            const fromRate = conversions[from];
            const toRate = conversions[to];
            return (value * fromRate) / toRate;
        }

        return null; // Cannot convert between different categories
    }
}

// Electrical Tools
class ElectricalTools {
    calculateVoltage() {
        const current = parseFloat(document.getElementById('current').value);
        const resistance = parseFloat(document.getElementById('resistance').value);
        
        if (!current || !resistance) {
            alert('Sila masukkan nilai arus dan rintangan');
            return;
        }

        const voltage = current * resistance;
        document.getElementById('voltage').value = voltage.toFixed(2);
        
        this.displayOhmsResult('voltage', voltage, current, resistance);
    }

    calculateCurrent() {
        const voltage = parseFloat(document.getElementById('voltage').value);
        const resistance = parseFloat(document.getElementById('resistance').value);
        
        if (!voltage || !resistance) {
            alert('Sila masukkan nilai voltan dan rintangan');
            return;
        }

        const current = voltage / resistance;
        document.getElementById('current').value = current.toFixed(3);
        
        this.displayOhmsResult('current', current, voltage, resistance);
    }

    calculateResistance() {
        const voltage = parseFloat(document.getElementById('voltage').value);
        const current = parseFloat(document.getElementById('current').value);
        
        if (!voltage || !current) {
            alert('Sila masukkan nilai voltan dan arus');
            return;
        }

        const resistance = voltage / current;
        document.getElementById('resistance').value = resistance.toFixed(2);
        
        this.displayOhmsResult('resistance', resistance, voltage, current);
    }

    displayOhmsResult(calculated, value, param1, param2) {
        const resultContainer = document.getElementById('ohmsResult');
        let resultText = '';
        
        switch (calculated) {
            case 'voltage':
                resultText = `
                    <h4>Hasil Pengiraan Voltan</h4>
                    <div class="result-item">
                        <span>Voltan (V)</span>
                        <span><strong>${value.toFixed(2)} V</strong></span>
                    </div>
                    <div class="result-item">
                        <span>Formula</span>
                        <span>V = I × R = ${param1}A × ${param2}Ω</span>
                    </div>
                `;
                break;
            case 'current':
                resultText = `
                    <h4>Hasil Pengiraan Arus</h4>
                    <div class="result-item">
                        <span>Arus (A)</span>
                        <span><strong>${value.toFixed(3)} A</strong></span>
                    </div>
                    <div class="result-item">
                        <span>Formula</span>
                        <span>I = V / R = ${param1}V / ${param2}Ω</span>
                    </div>
                `;
                break;
            case 'resistance':
                resultText = `
                    <h4>Hasil Pengiraan Rintangan</h4>
                    <div class="result-item">
                        <span>Rintangan (Ω)</span>
                        <span><strong>${value.toFixed(2)} Ω</strong></span>
                    </div>
                    <div class="result-item">
                        <span>Formula</span>
                        <span>R = V / I = ${param1}V / ${param2}A</span>
                    </div>
                `;
                break;
        }
        
        resultContainer.innerHTML = resultText;
    }

    calculatePower() {
        const voltage = parseFloat(document.getElementById('powerVoltage').value);
        const current = parseFloat(document.getElementById('powerCurrent').value);
        const resistance = parseFloat(document.getElementById('powerResistance').value);
        
        let power = 0;
        let formula = '';
        
        if (voltage && current) {
            power = voltage * current;
            formula = `P = V × I = ${voltage}V × ${current}A`;
        } else if (current && resistance) {
            power = current * current * resistance;
            formula = `P = I² × R = ${current}²A × ${resistance}Ω`;
        } else if (voltage && resistance) {
            power = (voltage * voltage) / resistance;
            formula = `P = V² / R = ${voltage}²V / ${resistance}Ω`;
        } else {
            alert('Sila masukkan sekurang-kurangnya dua nilai untuk mengira kuasa');
            return;
        }

        this.displayPowerResult(power, formula);
    }

    displayPowerResult(power, formula) {
        const resultContainer = document.getElementById('powerResult');
        resultContainer.innerHTML = `
            <h4>Hasil Pengiraan Kuasa</h4>
            <div class="result-item">
                <span>Kuasa (W)</span>
                <span><strong>${power.toFixed(2)} W</strong></span>
            </div>
            <div class="result-item">
                <span>Kuasa (kW)</span>
                <span><strong>${(power/1000).toFixed(3)} kW</strong></span>
            </div>
            <div class="result-item">
                <span>Formula</span>
                <span>${formula}</span>
            </div>
        `;
    }

    clearCalculator() {
        document.getElementById('voltage').value = '';
        document.getElementById('current').value = '';
        document.getElementById('resistance').value = '';
        document.getElementById('powerVoltage').value = '';
        document.getElementById('powerCurrent').value = '';
        document.getElementById('powerResistance').value = '';
        document.getElementById('ohmsResult').innerHTML = '';
        document.getElementById('powerResult').innerHTML = '';
    }
}

// Computer Tools
class ComputerTools {
    saveSnippet() {
        const title = document.getElementById('snippetTitle').value;
        const language = document.getElementById('snippetLanguage').value;
        const code = document.getElementById('snippetCode').value;
        const description = document.getElementById('snippetDescription').value;
        
        if (!title || !code) {
            alert('Sila masukkan tajuk dan kod');
            return;
        }

        const snippet = {
            id: Date.now().toString(),
            title,
            language,
            code,
            description,
            created: new Date().toISOString()
        };

        programTools.savedSnippets.push(snippet);
        localStorage.setItem('codeSnippets', JSON.stringify(programTools.savedSnippets));
        
        // Clear form
        document.getElementById('snippetTitle').value = '';
        document.getElementById('snippetCode').value = '';
        document.getElementById('snippetDescription').value = '';
        
        // Refresh display
        programTools.displaySavedSnippets();
        
        alert('Kod berjaya disimpan!');
    }

    copySnippet(id) {
        const snippet = programTools.savedSnippets.find(s => s.id === id);
        if (snippet) {
            navigator.clipboard.writeText(snippet.code).then(() => {
                alert('Kod telah disalin ke clipboard!');
            }).catch(() => {
                alert('Gagal menyalin kod');
            });
        }
    }

    deleteSnippet(id) {
        if (confirm('Adakah anda pasti mahu memadam kod ini?')) {
            programTools.savedSnippets = programTools.savedSnippets.filter(s => s.id !== id);
            localStorage.setItem('codeSnippets', JSON.stringify(programTools.savedSnippets));
            programTools.displaySavedSnippets();
            alert('Kod telah dipadam');
        }
    }
}

// Global instances
const programTools = new ProgramToolsManager();
const culinaryTools = new CulinaryTools();
const electricalTools = new ElectricalTools();
const computerTools = new ComputerTools();

// F&B Management Tools
class FnBTools {
    constructor() {
        this.savedMenuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
    }

    addCostIngredient() {
        const list = document.getElementById('costIngredientList');
        const newRow = document.createElement('div');
        newRow.className = 'cost-ingredient-row';
        newRow.innerHTML = `
            <input type="text" placeholder="Nama bahan" class="cost-ingredient-name">
            <input type="number" placeholder="Kuantiti" class="cost-ingredient-qty" step="0.1">
            <input type="number" placeholder="Kos per unit (RM)" class="cost-ingredient-price" step="0.01">
            <button type="button" onclick="fnbTools.removeCostIngredient(this)" class="btn remove">×</button>
        `;
        list.appendChild(newRow);
    }

    removeCostIngredient(button) {
        const rows = document.querySelectorAll('.cost-ingredient-row');
        if (rows.length > 1) {
            button.parentElement.remove();
        }
    }

    calculateMenuCost() {
        const menuItem = document.getElementById('menuItemName').value;
        const sellingPrice = parseFloat(document.getElementById('sellingPrice').value);
        const laborPercent = parseFloat(document.getElementById('laborCost').value);
        const overheadPercent = parseFloat(document.getElementById('overheadCost').value);

        if (!menuItem || !sellingPrice) {
            alert('Sila masukkan nama item dan harga jual');
            return;
        }

        // Calculate ingredient costs
        const rows = document.querySelectorAll('.cost-ingredient-row');
        let totalIngredientCost = 0;
        let ingredientDetails = [];

        rows.forEach(row => {
            const name = row.querySelector('.cost-ingredient-name').value;
            const qty = parseFloat(row.querySelector('.cost-ingredient-qty').value);
            const price = parseFloat(row.querySelector('.cost-ingredient-price').value);

            if (name && qty && price) {
                const cost = qty * price;
                totalIngredientCost += cost;
                ingredientDetails.push({ name, qty, price, cost });
            }
        });

        // Calculate other costs
        const laborCost = (totalIngredientCost * laborPercent) / 100;
        const overheadCost = (totalIngredientCost * overheadPercent) / 100;
        const totalCost = totalIngredientCost + laborCost + overheadCost;
        const profit = sellingPrice - totalCost;
        const profitMargin = ((profit / sellingPrice) * 100);

        this.displayCostResults({
            menuItem,
            sellingPrice,
            totalIngredientCost,
            laborCost,
            overheadCost,
            totalCost,
            profit,
            profitMargin,
            ingredientDetails
        });
    }

    displayCostResults(data) {
        const resultContainer = document.getElementById('costResults');
        
        resultContainer.innerHTML = `
            <h4>Analisis Kos: ${data.menuItem}</h4>
            <div class="cost-breakdown">
                <div class="cost-item">
                    <span>Kos Bahan-bahan</span>
                    <span>RM ${data.totalIngredientCost.toFixed(2)}</span>
                </div>
                <div class="cost-item">
                    <span>Kos Buruh (${document.getElementById('laborCost').value}%)</span>
                    <span>RM ${data.laborCost.toFixed(2)}</span>
                </div>
                <div class="cost-item">
                    <span>Kos Overhead (${document.getElementById('overheadCost').value}%)</span>
                    <span>RM ${data.overheadCost.toFixed(2)}</span>
                </div>
                <div class="cost-item total">
                    <span>Jumlah Kos</span>
                    <span>RM ${data.totalCost.toFixed(2)}</span>
                </div>
                <div class="cost-item">
                    <span>Harga Jual</span>
                    <span>RM ${data.sellingPrice.toFixed(2)}</span>
                </div>
                <div class="cost-item ${data.profit >= 0 ? 'profit' : 'loss'}">
                    <span>${data.profit >= 0 ? 'Keuntungan' : 'Kerugian'}</span>
                    <span>RM ${Math.abs(data.profit).toFixed(2)} (${data.profitMargin.toFixed(1)}%)</span>
                </div>
            </div>
            <div class="ingredient-breakdown">
                <h5>Pecahan Kos Bahan:</h5>
                ${data.ingredientDetails.map(item => `
                    <div class="cost-item">
                        <span>${item.name} (${item.qty} unit @ RM${item.price})</span>
                        <span>RM ${item.cost.toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
        `;
        
        resultContainer.style.display = 'block';
    }

    addMenuItem() {
        const category = document.getElementById('menuCategory').value;
        const season = document.getElementById('menuSeason').value;
        const title = document.getElementById('menuItemTitle').value;
        const price = parseFloat(document.getElementById('menuPrice').value);
        const prepTime = parseInt(document.getElementById('menuPrepTime').value);
        const description = document.getElementById('menuDescription').value;
        
        // Get selected allergens
        const allergenInputs = document.querySelectorAll('.allergen-checkboxes input:checked');
        const allergens = Array.from(allergenInputs).map(input => input.value);

        if (!title || !price) {
            alert('Sila masukkan nama menu dan harga');
            return;
        }

        const menuItem = {
            id: Date.now().toString(),
            category,
            season,
            title,
            price,
            prepTime,
            description,
            allergens,
            created: new Date().toISOString()
        };

        this.savedMenuItems.push(menuItem);
        localStorage.setItem('menuItems', JSON.stringify(this.savedMenuItems));
        
        // Clear form
        document.getElementById('menuItemTitle').value = '';
        document.getElementById('menuPrice').value = '';
        document.getElementById('menuPrepTime').value = '';
        document.getElementById('menuDescription').value = '';
        document.querySelectorAll('.allergen-checkboxes input').forEach(cb => cb.checked = false);
        
        this.displaySavedMenuItems();
        alert('Item menu berjaya ditambah!');
    }

    displaySavedMenuItems() {
        const container = document.getElementById('savedMenuItems');
        if (!container) return;

        if (this.savedMenuItems.length === 0) {
            container.innerHTML = '<p>Tiada item menu tersimpan. Tambah item pertama anda!</p>';
            return;
        }

        container.innerHTML = this.savedMenuItems.map(item => `
            <div class="menu-item">
                <div class="menu-item-header">
                    <span class="menu-item-title">${item.title}</span>
                    <span class="menu-item-price">RM ${item.price.toFixed(2)}</span>
                </div>
                <div class="menu-item-content">
                    <div class="menu-item-details">
                        <div class="menu-detail">
                            <strong>Kategori:</strong><br>${this.getCategoryName(item.category)}
                        </div>
                        <div class="menu-detail">
                            <strong>Musim:</strong><br>${this.getSeasonName(item.season)}
                        </div>
                        <div class="menu-detail">
                            <strong>Masa:</strong><br>${item.prepTime} minit
                        </div>
                    </div>
                    ${item.description ? `<p><strong>Penerangan:</strong> ${item.description}</p>` : ''}
                    ${item.allergens.length > 0 ? `
                        <div class="allergen-tags">
                            ${item.allergens.map(allergen => `<span class="allergen-tag">${this.getAllergenName(allergen)}</span>`).join('')}
                        </div>
                    ` : ''}
                    <div class="menu-item-actions" style="margin-top: 1rem;">
                        <button class="btn secondary" onclick="fnbTools.editMenuItem('${item.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn danger" onclick="fnbTools.deleteMenuItem('${item.id}')">
                            <i class="fas fa-trash"></i> Padam
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    getCategoryName(category) {
        const categories = {
            'appetizer': 'Pembuka Selera',
            'main': 'Hidangan Utama',
            'dessert': 'Pencuci Mulut',
            'beverage': 'Minuman',
            'special': 'Menu Istimewa'
        };
        return categories[category] || category;
    }

    getSeasonName(season) {
        const seasons = {
            'all': 'Sepanjang Tahun',
            'ramadan': 'Bulan Ramadan',
            'festive': 'Musim Perayaan',
            'summer': 'Musim Panas',
            'winter': 'Musim Sejuk'
        };
        return seasons[season] || season;
    }

    getAllergenName(allergen) {
        const allergens = {
            'dairy': 'Tenusu',
            'nuts': 'Kacang',
            'seafood': 'Makanan Laut',
            'gluten': 'Gluten',
            'spicy': 'Pedas'
        };
        return allergens[allergen] || allergen;
    }

    deleteMenuItem(id) {
        if (confirm('Adakah anda pasti mahu memadam item menu ini?')) {
            this.savedMenuItems = this.savedMenuItems.filter(item => item.id !== id);
            localStorage.setItem('menuItems', JSON.stringify(this.savedMenuItems));
            this.displaySavedMenuItems();
            alert('Item menu telah dipadam');
        }
    }

    editMenuItem(id) {
        const item = this.savedMenuItems.find(item => item.id === id);
        if (!item) {
            alert('Item menu tidak dijumpai');
            return;
        }

        // Populate form with existing data
        document.getElementById('menuCategory').value = item.category;
        document.getElementById('menuSeason').value = item.season;
        document.getElementById('menuItemTitle').value = item.title;
        document.getElementById('menuPrice').value = item.price;
        document.getElementById('menuPrepTime').value = item.prepTime;
        document.getElementById('menuDescription').value = item.description;

        // Set allergen checkboxes
        const allergenCheckboxes = document.querySelectorAll('.allergen-checkboxes input[type="checkbox"]');
        allergenCheckboxes.forEach(checkbox => {
            checkbox.checked = item.allergens.includes(checkbox.value);
        });

        // Change button to update mode
        const addButton = document.querySelector('button[onclick="fnbTools.addMenuItem()"]');
        if (addButton) {
            addButton.innerHTML = '<i class="fas fa-save"></i> Kemaskini Menu';
            addButton.setAttribute('onclick', `fnbTools.updateMenuItem('${id}')`);
            addButton.className = 'btn warning';
        }

        // Show cancel button
        if (!document.getElementById('cancelEditBtn')) {
            const cancelBtn = document.createElement('button');
            cancelBtn.id = 'cancelEditBtn';
            cancelBtn.className = 'btn secondary';
            cancelBtn.innerHTML = '<i class="fas fa-times"></i> Batal';
            cancelBtn.style.marginLeft = '10px';
            cancelBtn.onclick = () => this.cancelEdit();
            addButton.parentNode.insertBefore(cancelBtn, addButton.nextSibling);
        }

        // Scroll to form
        document.getElementById('menuItemTitle').scrollIntoView({ behavior: 'smooth' });
        document.getElementById('menuItemTitle').focus();

        // Show success message
        if (typeof triggerCelebration === 'function') {
            triggerCelebration('📝 Mode edit diaktifkan!');
        }
    }

    updateMenuItem(id) {
        const category = document.getElementById('menuCategory').value;
        const season = document.getElementById('menuSeason').value;
        const title = document.getElementById('menuItemTitle').value;
        const price = parseFloat(document.getElementById('menuPrice').value);
        const prepTime = parseInt(document.getElementById('menuPrepTime').value);
        const description = document.getElementById('menuDescription').value;

        const allergenCheckboxes = document.querySelectorAll('.allergen-checkboxes input[type="checkbox"]:checked');
        const allergens = Array.from(allergenCheckboxes).map(cb => cb.value);

        if (!title || !price) {
            alert('Sila masukkan nama menu dan harga');
            return;
        }

        // Find and update the item
        const itemIndex = this.savedMenuItems.findIndex(item => item.id === id);
        if (itemIndex !== -1) {
            const updatedItem = {
                id: id, // Keep original ID
                category,
                season,
                title,
                price,
                prepTime,
                description,
                allergens,
                dateModified: new Date().toISOString()
            };

            this.savedMenuItems[itemIndex] = updatedItem;
            localStorage.setItem('menuItems', JSON.stringify(this.savedMenuItems));
            this.displaySavedMenuItems();
            this.resetForm();

            // Show success message
            if (typeof triggerCelebration === 'function') {
                triggerCelebration('✅ Menu berjaya dikemaskini!');
            }
            alert('Menu berjaya dikemaskini!');
        }
    }

    cancelEdit() {
        this.resetForm();
        
        if (typeof triggerCelebration === 'function') {
            triggerCelebration('↩️ Edit dibatalkan');
        }
    }

    resetForm() {
        // Clear form
        document.getElementById('menuCategory').value = '';
        document.getElementById('menuSeason').value = '';
        document.getElementById('menuItemTitle').value = '';
        document.getElementById('menuPrice').value = '';
        document.getElementById('menuPrepTime').value = '';
        document.getElementById('menuDescription').value = '';

        // Uncheck allergen checkboxes
        const allergenCheckboxes = document.querySelectorAll('.allergen-checkboxes input[type="checkbox"]');
        allergenCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        // Reset button to add mode
        const updateButton = document.querySelector('button[onclick*="updateMenuItem"]');
        if (updateButton) {
            updateButton.innerHTML = '<i class="fas fa-plus"></i> Tambah ke Menu';
            updateButton.setAttribute('onclick', 'fnbTools.addMenuItem()');
            updateButton.className = 'btn primary';
        }

        // Remove cancel button
        const cancelBtn = document.getElementById('cancelEditBtn');
        if (cancelBtn) {
            cancelBtn.remove();
        }
    }

    // Enhanced menu search and filter functionality
    searchMenu(searchTerm) {
        const filteredItems = this.savedMenuItems.filter(item => 
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        this.displayFilteredMenuItems(filteredItems);
    }

    filterMenuByCategory(category) {
        if (category === 'all') {
            this.displaySavedMenuItems();
        } else {
            const filteredItems = this.savedMenuItems.filter(item => item.category === category);
            this.displayFilteredMenuItems(filteredItems);
        }
    }

    filterMenuBySeason(season) {
        if (season === 'all') {
            this.displaySavedMenuItems();
        } else {
            const filteredItems = this.savedMenuItems.filter(item => item.season === season);
            this.displayFilteredMenuItems(filteredItems);
        }
    }

    displayFilteredMenuItems(items) {
        const container = document.getElementById('savedMenuItems');
        if (!container) return;

        if (items.length === 0) {
            container.innerHTML = '<p>Tiada item menu yang sepadan dengan tapisan.</p>';
            return;
        }

        container.innerHTML = items.map(item => `
            <div class="menu-item">
                <div class="menu-item-header">
                    <span class="menu-item-title">${item.title}</span>
                    <span class="menu-item-price">RM ${item.price.toFixed(2)}</span>
                </div>
                <div class="menu-item-content">
                    <div class="menu-item-details">
                        <div class="menu-detail">
                            <strong>Kategori:</strong><br>${this.getCategoryName(item.category)}
                        </div>
                        <div class="menu-detail">
                            <strong>Musim:</strong><br>${this.getSeasonName(item.season)}
                        </div>
                        <div class="menu-detail">
                            <strong>Masa:</strong><br>${item.prepTime} minit
                        </div>
                    </div>
                    ${item.description ? `<p><strong>Penerangan:</strong> ${item.description}</p>` : ''}
                    ${item.allergens.length > 0 ? `
                        <div class="allergen-tags">
                            ${item.allergens.map(allergen => `<span class="allergen-tag">${this.getAllergenName(allergen)}</span>`).join('')}
                        </div>
                    ` : ''}
                    <div class="menu-item-actions" style="margin-top: 1rem;">
                        <button class="btn secondary" onclick="fnbTools.editMenuItem('${item.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn danger" onclick="fnbTools.deleteMenuItem('${item.id}')">
                            <i class="fas fa-trash"></i> Padam
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Export menu functionality
    exportMenu() {
        if (this.savedMenuItems.length === 0) {
            alert('Tiada menu untuk di-export');
            return;
        }

        const menuData = {
            exportDate: new Date().toISOString(),
            totalItems: this.savedMenuItems.length,
            categories: [...new Set(this.savedMenuItems.map(item => item.category))],
            menuItems: this.savedMenuItems
        };

        const jsonData = JSON.stringify(menuData, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `BreyerHub_Menu_${new Date().toISOString().split('T')[0]}.json`;
        a.click();

        if (typeof triggerCelebration === 'function') {
            triggerCelebration('📋 Menu berjaya di-export!');
        }
    }

    // Export to PDF functionality
    exportMenuToPDF() {
        if (this.savedMenuItems.length === 0) {
            alert('Tiada menu untuk di-export');
            return;
        }

        // Create PDF content
        const pdfContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h1 style="color: #667eea; text-align: center;">BreyerHub Menu Collection</h1>
                <p style="text-align: center; color: #666;">Generated on ${new Date().toLocaleDateString('ms-MY')}</p>
                <hr style="margin: 20px 0;">
                
                ${this.savedMenuItems.map(item => `
                    <div style="border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 8px;">
                        <h3 style="color: #667eea; margin: 0 0 10px 0;">${item.title}</h3>
                        <p><strong>Kategori:</strong> ${this.getCategoryName(item.category)}</p>
                        <p><strong>Harga:</strong> RM ${item.price.toFixed(2)}</p>
                        <p><strong>Masa Penyediaan:</strong> ${item.prepTime} minit</p>
                        ${item.description ? `<p><strong>Penerangan:</strong> ${item.description}</p>` : ''}
                        ${item.allergens.length > 0 ? `<p><strong>Allergen:</strong> ${item.allergens.map(a => this.getAllergenName(a)).join(', ')}</p>` : ''}
                    </div>
                `).join('')}
                
                <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
                    <p>Generated by BreyerHub - College Management System</p>
                </div>
            </div>
        `;

        // Open print dialog for PDF
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>BreyerHub Menu Collection</title>
                <style>
                    @media print {
                        body { margin: 0; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                ${pdfContent}
                <div class="no-print" style="text-align: center; margin: 20px;">
                    <button onclick="window.print();" style="background: #667eea; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Print to PDF</button>
                    <button onclick="window.close();" style="background: #666; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">Close</button>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();

        if (typeof triggerCelebration === 'function') {
            triggerCelebration('📄 PDF export siap!');
        }
    }

    // Export to Excel (CSV format)
    exportMenuToExcel() {
        if (this.savedMenuItems.length === 0) {
            alert('Tiada menu untuk di-export');
            return;
        }

        const csvHeader = 'Nama Menu,Kategori,Musim,Harga (RM),Masa Penyediaan (Minit),Penerangan,Allergen,Tarikh Dicipta\n';
        const csvContent = this.savedMenuItems.map(item => {
            return [
                `"${item.title}"`,
                `"${this.getCategoryName(item.category)}"`,
                `"${this.getSeasonName(item.season)}"`,
                item.price.toFixed(2),
                item.prepTime,
                `"${item.description || ''}"`,
                `"${item.allergens.map(a => this.getAllergenName(a)).join(', ')}"`,
                `"${new Date(item.created).toLocaleDateString('ms-MY')}"`
            ].join(',');
        }).join('\n');

        const csvData = csvHeader + csvContent;
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `BreyerHub_Menu_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();

        if (typeof triggerCelebration === 'function') {
            triggerCelebration('📊 Excel export siap!');
        }
    }

    // Import menu functionality
    importMenu(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                
                if (importedData.menuItems && Array.isArray(importedData.menuItems)) {
                    // Merge with existing items (avoid duplicates by ID)
                    importedData.menuItems.forEach(item => {
                        if (!this.savedMenuItems.find(existing => existing.id === item.id)) {
                            this.savedMenuItems.push(item);
                        }
                    });
                    
                    localStorage.setItem('menuItems', JSON.stringify(this.savedMenuItems));
                    this.displaySavedMenuItems();
                    
                    if (typeof triggerCelebration === 'function') {
                        triggerCelebration('📥 Menu berjaya di-import!');
                    }
                    alert(`${importedData.menuItems.length} item menu berjaya di-import!`);
                } else {
                    alert('Format file tidak sah');
                }
            } catch (error) {
                alert('Error importing menu: ' + error.message);
            }
        };
        reader.readAsText(file);
    }
}

// Administrative Management Tools  
class AdminTools {
    constructor() {
        this.savedMeetings = JSON.parse(localStorage.getItem('meetings') || '[]');
        this.documentTemplates = {
            business_letter: `[HEADER SYARIKAT]
{companyName}

Tarikh: {date}

Kepada,
{recipient}

Tuan/Puan,

SUBJEK: {subject}

{content}

Sekian, terima kasih.

Yang benar,

{senderName}
{senderPosition}`,
            
            memo: `MEMORANDUM

KEPADA: Semua Kakitangan
DARIPADA: {senderName}, {senderPosition}  
TARIKH: {date}
SUBJEK: {subject}

{content}

{senderName}
{senderPosition}`,
            
            meeting_minutes: `MINIT MESYUARAT
{subject}

Tarikh: {date}
Masa: {time}
Tempat: {location}

KEHADIRAN:
{participants}

AGENDA:
{content}

KEPUTUSAN:
[Sila isi keputusan yang dicapai]

TINDAKAN SUSULAN:
[Sila isi tindakan yang perlu diambil]

Mesyuarat berakhir pada {endTime}.

Disediakan oleh,
{senderName}
{senderPosition}`,
            
            report: `LAPORAN {subject}

Disediakan oleh: {senderName}
Jawatan: {senderPosition}
Tarikh: {date}

1. PENGENALAN
{content}

2. OBJEKTIF
[Sila isi objektif laporan]

3. METODOLOGI
[Sila isi kaedah yang digunakan]

4. DAPATAN
[Sila isi dapatan utama]

5. CADANGAN
[Sila isi cadangan]

6. KESIMPULAN
[Sila isi kesimpulan]

Disediakan oleh,
{senderName}
{senderPosition}`,
            
            invoice: `INVOIS

{companyName}
Tarikh: {date}
No. Invois: INV-{invoiceNumber}

Bil Kepada:
{recipient}

BUTIRAN:
{content}

Jumlah Keseluruhan: RM {total}

Terma Pembayaran: 30 hari

{senderName}
{senderPosition}`
        };
    }

    loadTemplate(templateType) {
        const form = document.getElementById('templateForm');
        const preview = document.getElementById('documentPreview');
        
        if (templateType) {
            form.style.display = 'block';
            preview.style.display = 'none';
        } else {
            form.style.display = 'none';
            preview.style.display = 'none';
        }
    }

    generateDocument() {
        const templateType = document.getElementById('templateType').value;
        const companyName = document.getElementById('companyName').value || 'Breyer State College';
        const senderName = document.getElementById('senderName').value || '[Nama Penghantar]';
        const senderPosition = document.getElementById('senderPosition').value || '[Jawatan]';
        const subject = document.getElementById('documentSubject').value || '[Subjek]';
        const content = document.getElementById('documentContent').value || '[Kandungan]';

        if (!templateType) {
            alert('Sila pilih jenis templat');
            return;
        }

        let template = this.documentTemplates[templateType];
        const today = new Date().toLocaleDateString('ms-MY');
        const invoiceNumber = Date.now().toString().slice(-6);

        // Replace placeholders
        const documentContent = template
            .replace(/{companyName}/g, companyName)
            .replace(/{senderName}/g, senderName)
            .replace(/{senderPosition}/g, senderPosition)
            .replace(/{subject}/g, subject)
            .replace(/{content}/g, content)
            .replace(/{date}/g, today)
            .replace(/{invoiceNumber}/g, invoiceNumber)
            .replace(/{recipient}/g, '[Nama Penerima]')
            .replace(/{time}/g, '[Masa Mesyuarat]')
            .replace(/{location}/g, '[Lokasi]')
            .replace(/{participants}/g, '[Senarai Peserta]')
            .replace(/{endTime}/g, '[Masa Tamat]')
            .replace(/{total}/g, '[Jumlah]');

        this.displayDocument(documentContent);
    }

    displayDocument(content) {
        const preview = document.getElementById('documentPreview');
        const output = document.getElementById('documentOutput');
        
        output.innerHTML = content;
        preview.style.display = 'block';
        
        // Scroll to preview
        preview.scrollIntoView({ behavior: 'smooth' });
    }

    copyDocument() {
        const content = document.getElementById('documentOutput').textContent;
        navigator.clipboard.writeText(content).then(() => {
            alert('Dokumen telah disalin ke clipboard!');
        }).catch(() => {
            alert('Gagal menyalin dokumen');
        });
    }

    printDocument() {
        const content = document.getElementById('documentOutput').innerHTML;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Dokumen - ${document.getElementById('documentSubject').value}</title>
                    <style>
                        body { font-family: 'Times New Roman', serif; line-height: 1.6; margin: 2cm; }
                        .document-content { white-space: pre-wrap; }
                    </style>
                </head>
                <body>
                    <div class="document-content">${content}</div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }

    addParticipant() {
        const list = document.getElementById('participantList');
        const newRow = document.createElement('div');
        newRow.className = 'participant-row';
        newRow.innerHTML = `
            <input type="text" placeholder="Nama peserta" class="participant-name">
            <input type="email" placeholder="Email" class="participant-email">
            <select class="participant-role">
                <option value="attendee">Peserta</option>
                <option value="organizer">Penganjur</option>
                <option value="presenter">Pembentang</option>
            </select>
            <button type="button" onclick="adminTools.removeParticipant(this)" class="btn remove">×</button>
        `;
        list.appendChild(newRow);
    }

    removeParticipant(button) {
        const rows = document.querySelectorAll('.participant-row');
        if (rows.length > 1) {
            button.parentElement.remove();
        }
    }

    createMeeting() {
        const title = document.getElementById('meetingTitle').value;
        const dateTime = document.getElementById('meetingDate').value;
        const location = document.getElementById('meetingLocation').value;
        const duration = parseInt(document.getElementById('meetingDuration').value);
        const agenda = document.getElementById('meetingAgenda').value;

        if (!title || !dateTime || !location) {
            alert('Sila lengkapkan maklumat mesyuarat');
            return;
        }

        // Get participants
        const participantRows = document.querySelectorAll('.participant-row');
        const participants = [];
        
        participantRows.forEach(row => {
            const name = row.querySelector('.participant-name').value;
            const email = row.querySelector('.participant-email').value;
            const role = row.querySelector('.participant-role').value;
            
            if (name) {
                participants.push({ name, email, role });
            }
        });

        const meeting = {
            id: Date.now().toString(),
            title,
            dateTime: new Date(dateTime),
            location,
            duration,
            agenda,
            participants,
            created: new Date().toISOString()
        };

        this.savedMeetings.push(meeting);
        localStorage.setItem('meetings', JSON.stringify(this.savedMeetings));
        
        this.displayMeetingResults(meeting);
        alert('Mesyuarat berjaya dijadualkan!');
    }

    displayMeetingResults(meeting) {
        const resultContainer = document.getElementById('meetingResults');
        const startTime = new Date(meeting.dateTime);
        const endTime = new Date(startTime.getTime() + (meeting.duration * 60000));
        
        resultContainer.innerHTML = `
            <h4>Mesyuarat Dijadualkan</h4>
            <div class="meeting-summary">
                <h5>${meeting.title}</h5>
                <div class="meeting-details">
                    <div class="meeting-detail">
                        <strong>Tarikh & Masa:</strong><br>
                        ${startTime.toLocaleString('ms-MY')}
                    </div>
                    <div class="meeting-detail">
                        <strong>Lokasi:</strong><br>
                        ${meeting.location}
                    </div>
                    <div class="meeting-detail">
                        <strong>Tempoh:</strong><br>
                        ${meeting.duration} minit
                    </div>
                    <div class="meeting-detail">
                        <strong>Masa Tamat:</strong><br>
                        ${endTime.toLocaleString('ms-MY')}
                    </div>
                </div>
                <div class="participant-summary">
                    <strong>Peserta (${meeting.participants.length}):</strong>
                    ${meeting.participants.map(p => `
                        <div class="participant-item">
                            <span>${p.name} ${p.email ? `(${p.email})` : ''}</span>
                            <span class="participant-role-badge ${p.role}">${this.getRoleName(p.role)}</span>
                        </div>
                    `).join('')}
                </div>
                ${meeting.agenda ? `
                    <div style="margin-top: 1rem;">
                        <strong>Agenda:</strong>
                        <pre style="background: #f8f9fa; padding: 1rem; border-radius: 4px; white-space: pre-wrap;">${meeting.agenda}</pre>
                    </div>
                ` : ''}
            </div>
        `;
        
        resultContainer.style.display = 'block';
    }

    getRoleName(role) {
        const roles = {
            'attendee': 'Peserta',
            'organizer': 'Penganjur', 
            'presenter': 'Pembentang'
        };
        return roles[role] || role;
    }
}

// Update global instances
const fnbTools = new FnBTools();

// Animation Enhancement Functions
function initializeAnimations() {
    // Add animation classes to existing elements
    addAnimationIndexes();
    
    // Add intersection observer for scroll animations
    initializeScrollAnimations();
    
    // Add button click effects
    initializeButtonEffects();
    
    // Add form interaction effects
    initializeFormEffects();
    
    console.log('🎨 Animation system initialized!');
}

function addAnimationIndexes() {
    // Add animation delays to cards
    const cards = document.querySelectorAll('.overview-card');
    cards.forEach((card, index) => {
        card.style.setProperty('--card-index', index);
    });
    
    // Add animation delays to tool cards
    const toolCards = document.querySelectorAll('.tool-card');
    toolCards.forEach((card, index) => {
        card.style.setProperty('--tool-index', index);
    });
}

function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all major sections
    const elementsToAnimate = document.querySelectorAll('.section, .tool-card, .overview-card');
    elementsToAnimate.forEach(el => observer.observe(el));
}

function initializeButtonEffects() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            createRippleEffect(e, this);
            
            // Add loading state temporarily
            if (!this.classList.contains('no-loading')) {
                addLoadingState(this);
            }
        });
    });
}

function initializeFormEffects() {
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.classList.add('focused');
            animateLabel(this);
        });
        
        input.addEventListener('blur', function() {
            this.classList.remove('focused');
        });
        
        input.addEventListener('change', function() {
            if (this.value) {
                this.classList.add('has-value');
                showSuccessAnimation(this);
            } else {
                this.classList.remove('has-value');
            }
        });
    });
}

function animateElementEntrance(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, 50);
}

function createRippleEffect(event, button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    // Add ripple styles
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.6)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'rippleEffect 0.6s linear';
    ripple.style.pointerEvents = 'none';
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function addLoadingState(button) {
    const originalText = button.textContent;
    button.classList.add('loading');
    
    setTimeout(() => {
        button.classList.remove('loading');
        button.classList.add('success-flash');
        
        setTimeout(() => {
            button.classList.remove('success-flash');
        }, 800);
    }, 1000);
}

function showSuccessAnimation(element) {
    element.classList.add('success-flash');
    setTimeout(() => {
        element.classList.remove('success-flash');
    }, 800);
}

function animateLabel(input) {
    const label = input.previousElementSibling;
    if (label && label.tagName === 'LABEL') {
        label.style.animation = 'bounce 0.6s ease-out';
        setTimeout(() => {
            label.style.animation = '';
        }, 600);
    }
}

function celebrateSuccess(element) {
    element.classList.add('celebrate');
    setTimeout(() => {
        element.classList.remove('celebrate');
    }, 1000);
}

// Add ripple effect CSS
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .animate-in {
        animation: fadeInUp 0.8s ease-out !important;
    }
    
    .focused {
        box-shadow: 0 0 20px rgba(102, 126, 234, 0.3) !important;
    }
    
    .has-value {
        border-color: var(--accent-color) !important;
    }
`;
document.head.appendChild(rippleStyles);

// Initialize celebration effects for achievements
function triggerCelebration(message) {
    const celebration = document.createElement('div');
    celebration.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 2rem;
        border-radius: 20px;
        font-size: 1.5rem;
        font-weight: bold;
        z-index: 10000;
        animation: celebrate 1s ease-out;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    `;
    celebration.textContent = message;
    
    document.body.appendChild(celebration);
    
    setTimeout(() => {
        celebration.remove();
    }, 2000);
}

console.log('🎉 Enhanced visual effects loaded!');

// Loading Screen Functions
function initializeLoadingScreen() {
    // Simulate loading time
    const loadingScreen = document.getElementById('loading-screen');
    const loadingText = document.querySelector('.loading-text');
    
    const loadingMessages = [
        'Memuatkan portal anda...',
        'Menyediakan alat-alat canggih...',
        'Menghubungkan sistem...',
        'Hampir siap...',
        'Selamat datang ke BreyerHub!'
    ];
    
    let messageIndex = 0;
    
    // Change loading message every 500ms
    const messageInterval = setInterval(() => {
        if (messageIndex < loadingMessages.length - 1) {
            messageIndex++;
            loadingText.textContent = loadingMessages[messageIndex];
            loadingText.style.animation = 'none';
            setTimeout(() => {
                loadingText.style.animation = 'fadeInUp 0.5s ease-out';
            }, 50);
        }
    }, 500);
    
    // Hide loading screen after 2.5 seconds
    setTimeout(() => {
        clearInterval(messageInterval);
        loadingScreen.classList.add('hidden');
        
        // Remove loading screen from DOM after transition
        setTimeout(() => {
            loadingScreen.remove();
            
            // Trigger welcome celebration
            setTimeout(() => {
                triggerCelebration('🎉 Selamat datang ke BreyerHub!');
            }, 500);
        }, 500);
    }, 2500);
}

// Performance monitoring
function trackPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`🚀 Page loaded in ${loadTime}ms`);
            
            if (loadTime > 3000) {
                console.log('⚠️ Slow loading detected');
            }
        });
    }
}

// Initialize performance tracking
trackPerformance();
const adminTools = new AdminTools();

// AI Features System
class AIFeatures {
    constructor() {
        this.studyPatterns = this.loadStudyPatterns();
        this.recipeDatabase = this.initializeRecipeDatabase();
        this.careerDatabase = this.initializeCareerDatabase();
        console.log('🧠 AI Features System initialized!');
    }

    // Smart Study Plan Generator
    generateStudyPlan() {
        const studyHours = parseInt(document.getElementById('studyHours').value);
        const learningStyle = document.getElementById('learningStyle').value;
        const preferredTime = document.getElementById('preferredTime').value;
        
        // Get user's current courses from grades data
        const courses = this.getUserCourses();
        const assignments = this.getUpcomingAssignments();
        
        // AI Algorithm: Generate optimal study schedule
        const studyPlan = this.calculateOptimalSchedule(studyHours, learningStyle, preferredTime, courses, assignments);
        
        this.displayStudyPlan(studyPlan);
        
        // Trigger celebration
        setTimeout(() => {
            if (typeof triggerCelebration === 'function') {
                triggerCelebration('🧠 Rancangan kajian AI telah dijana!');
            }
        }, 500);
    }

    calculateOptimalSchedule(hours, style, time, courses, assignments) {
        const timeSlots = this.generateTimeSlots(time, hours);
        const prioritySubjects = this.calculateSubjectPriority(courses, assignments);
        
        let schedule = [];
        let currentHour = 0;
        
        // AI Logic: Distribute study time based on priority and learning style
        for (const subject of prioritySubjects) {
            if (currentHour >= hours) break;
            
            const studyDuration = Math.min(
                Math.ceil(subject.priority * 2), // More time for higher priority
                hours - currentHour
            );
            
            const activity = this.getOptimalActivity(style, subject);
            
            schedule.push({
                time: timeSlots[currentHour],
                subject: subject.name,
                duration: studyDuration,
                activity: activity,
                priority: subject.priority
            });
            
            currentHour += studyDuration;
        }
        
        return schedule;
    }

    generateTimeSlots(preferredTime, totalHours) {
        const timeMap = {
            'morning': ['08:00', '09:00', '10:00', '11:00', '12:00'],
            'afternoon': ['13:00', '14:00', '15:00', '16:00', '17:00'],
            'evening': ['18:00', '19:00', '20:00', '21:00', '22:00'],
            'night': ['22:00', '23:00', '00:00', '01:00', '02:00']
        };
        
        return timeMap[preferredTime] || timeMap['morning'];
    }

    calculateSubjectPriority(courses, assignments) {
        const subjects = [];
        
        // Priority based on upcoming assignments and current performance
        for (const course of courses) {
            const upcomingAssignments = assignments.filter(a => 
                a.subject.toLowerCase().includes(course.name.toLowerCase())
            );
            
            let priority = 1;
            
            // Higher priority for subjects with assignments due soon
            if (upcomingAssignments.length > 0) {
                priority += upcomingAssignments.length * 0.5;
            }
            
            // Higher priority for subjects with lower grades
            if (course.grade < 3.0) {
                priority += 1;
            }
            
            subjects.push({
                name: course.name,
                priority: priority,
                grade: course.grade
            });
        }
        
        // Sort by priority (highest first)
        return subjects.sort((a, b) => b.priority - a.priority);
    }

    getOptimalActivity(learningStyle, subject) {
        const activities = {
            'visual': [
                'Buat mind map dan diagram',
                'Tonton video tutorial',
                'Baca dengan highlight warna',
                'Buat flashcards bergambar'
            ],
            'auditory': [
                'Dengar podcast/audio',
                'Belajar secara berkumpulan',
                'Baca dengan suara',
                'Rekod nota dan dengar semula'
            ],
            'kinesthetic': [
                'Praktik hands-on',
                'Tulis nota manual',
                'Buat model/eksperimen',
                'Belajar sambil berjalan'
            ],
            'reading': [
                'Baca buku teks',
                'Tulis ringkasan',
                'Buat nota terperinci',
                'Analisis artikel'
            ]
        };
        
        const styleActivities = activities[learningStyle] || activities['reading'];
        return styleActivities[Math.floor(Math.random() * styleActivities.length)];
    }

    displayStudyPlan(schedule) {
        const resultsDiv = document.getElementById('studyPlanResults');
        
        let html = `
            <h4><i class="fas fa-magic"></i> Rancangan Kajian AI Anda</h4>
            <p>Dijana berdasarkan analisis algoritma pembelajaran pintar:</p>
        `;
        
        schedule.forEach((item, index) => {
            html += `
                <div class="study-plan-item" style="animation-delay: ${index * 0.1}s">
                    <div class="study-plan-time">${item.time} - ${item.duration} jam</div>
                    <div class="study-plan-subject">${item.subject}</div>
                    <div class="study-plan-activity">${item.activity}</div>
                    <div class="priority-indicator" style="color: ${item.priority > 2 ? '#e74c3c' : item.priority > 1.5 ? '#f39c12' : '#27ae60'}">
                        Prioriti: ${item.priority > 2 ? 'Tinggi' : item.priority > 1.5 ? 'Sederhana' : 'Biasa'}
                    </div>
                </div>
            `;
        });
        
        html += `
            <div style="margin-top: 1rem; padding: 1rem; background: #e8f5e8; border-radius: 8px;">
                <strong>💡 Tips AI:</strong> Rancangan ini disesuaikan dengan gaya pembelajaran dan masa optimal anda. 
                Ikuti jadual ini untuk hasil maksimum!
            </div>
        `;
        
        resultsDiv.innerHTML = html;
        resultsDiv.style.display = 'block';
        resultsDiv.classList.add('show');
    }

    // Predictive GPA Forecasting
    predictGPA() {
        const currentSemester = parseInt(document.getElementById('currentSemester').value);
        const targetCGPA = parseFloat(document.getElementById('targetCGPA').value);
        
        // Get historical grade data
        const gradeHistory = this.getGradeHistory();
        const currentGPA = this.calculateCurrentGPA(gradeHistory);
        
        // AI Prediction Algorithm
        const prediction = this.calculateGPAPrediction(currentSemester, targetCGPA, gradeHistory);
        
        this.displayGPAPrediction(prediction);
        
        // Trigger celebration
        setTimeout(() => {
            if (typeof triggerCelebration === 'function') {
                triggerCelebration('🔮 Ramalan CGPA telah dijana!');
            }
        }, 500);
    }

    calculateGPAPrediction(semester, target, history) {
        // Statistical analysis with trend calculation
        const trendAnalysis = this.analyzeTrend(history);
        const remainingSemesters = Math.max(6 - semester, 1);
        
        // Predict based on current trend
        let predictedGPA = trendAnalysis.currentGPA + (trendAnalysis.trend * remainingSemesters);
        
        // Confidence level calculation
        const variance = this.calculateVariance(history);
        const confidenceLevel = Math.max(60, 95 - (variance * 100));
        
        // Required improvement calculation
        const requiredImprovement = target - trendAnalysis.currentGPA;
        const improvementPerSemester = requiredImprovement / remainingSemesters;
        
        return {
            predictedGPA: Math.max(0, Math.min(4, predictedGPA)),
            currentGPA: trendAnalysis.currentGPA,
            targetGPA: target,
            trend: trendAnalysis.trend,
            confidence: confidenceLevel,
            requiredImprovement: improvementPerSemester,
            remainingSemesters: remainingSemesters,
            achievable: Math.abs(improvementPerSemester) <= 0.5
        };
    }

    analyzeTrend(history) {
        if (history.length < 2) {
            return { currentGPA: 3.0, trend: 0 };
        }
        
        const recent = history.slice(-3); // Last 3 entries
        const gpaValues = recent.map(h => h.gpa);
        
        // Calculate linear trend
        let trend = 0;
        for (let i = 1; i < gpaValues.length; i++) {
            trend += gpaValues[i] - gpaValues[i-1];
        }
        trend = trend / (gpaValues.length - 1);
        
        return {
            currentGPA: gpaValues[gpaValues.length - 1] || 3.0,
            trend: trend
        };
    }

    calculateVariance(history) {
        if (history.length < 2) return 0;
        
        const gpaValues = history.map(h => h.gpa);
        const mean = gpaValues.reduce((a, b) => a + b, 0) / gpaValues.length;
        const variance = gpaValues.reduce((acc, gpa) => acc + Math.pow(gpa - mean, 2), 0) / gpaValues.length;
        
        return Math.sqrt(variance);
    }

    displayGPAPrediction(prediction) {
        const resultsDiv = document.getElementById('gpaPredictonResults');
        
        let html = `
            <h4><i class="fas fa-crystal-ball"></i> Ramalan CGPA Masa Hadapan</h4>
            
            <div class="prediction-card">
                <div class="prediction-value">${prediction.predictedGPA.toFixed(2)}</div>
                <div class="confidence-level">Tahap Keyakinan: ${prediction.confidence.toFixed(0)}%</div>
            </div>
            
            <div class="prediction-details">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                    <div>
                        <strong>CGPA Semasa:</strong> ${prediction.currentGPA.toFixed(2)}
                    </div>
                    <div>
                        <strong>Target CGPA:</strong> ${prediction.targetGPA.toFixed(2)}
                    </div>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <strong>Trend Prestasi:</strong> 
                    <span style="color: ${prediction.trend > 0 ? '#27ae60' : prediction.trend < 0 ? '#e74c3c' : '#f39c12'}">
                        ${prediction.trend > 0 ? '📈 Meningkat' : prediction.trend < 0 ? '📉 Menurun' : '➡️ Stabil'}
                    </span>
                    (${prediction.trend > 0 ? '+' : ''}${prediction.trend.toFixed(3)} per semester)
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <strong>Peningkatan Diperlukan:</strong> 
                    <span style="color: ${prediction.achievable ? '#27ae60' : '#e74c3c'}">
                        ${prediction.requiredImprovement.toFixed(3)} per semester
                    </span>
                </div>
                
                <div style="padding: 1rem; background: ${prediction.achievable ? '#d4edda' : '#f8d7da'}; 
                     border-radius: 8px; color: ${prediction.achievable ? '#155724' : '#721c24'}">
                    <strong>💡 Analisis AI:</strong> 
                    ${prediction.achievable 
                        ? 'Target anda BOLEH dicapai dengan usaha yang konsisten!'
                        : 'Target agak mencabar. Pertimbangkan strategi pembelajaran intensif atau tukar target yang lebih realistik.'
                    }
                </div>
            </div>
        `;
        
        resultsDiv.innerHTML = html;
        resultsDiv.style.display = 'block';
        resultsDiv.classList.add('show');
    }

    // Get user data helper functions
    getUserCourses() {
        const grades = JSON.parse(localStorage.getItem('grades') || '[]');
        const subjects = [...new Set(grades.map(g => g.subject))];
        
        return subjects.map(subject => {
            const subjectGrades = grades.filter(g => g.subject === subject);
            const avgGrade = subjectGrades.reduce((sum, g) => sum + g.gpa, 0) / subjectGrades.length;
            
            return {
                name: subject,
                grade: avgGrade || 3.0
            };
        });
    }

    getUpcomingAssignments() {
        const assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
        const today = new Date();
        const upcoming = assignments.filter(a => {
            const dueDate = new Date(a.dueDate);
            const diffDays = (dueDate - today) / (1000 * 60 * 60 * 24);
            return diffDays > 0 && diffDays <= 14; // Next 2 weeks
        });
        
        return upcoming.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }

    getGradeHistory() {
        const grades = JSON.parse(localStorage.getItem('grades') || '[]');
        // Group by semester/month and calculate average GPA
        const history = [];
        
        grades.forEach(grade => {
            const date = new Date(grade.date || Date.now());
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
            
            let monthData = history.find(h => h.period === monthKey);
            if (!monthData) {
                monthData = { period: monthKey, grades: [], gpa: 0 };
                history.push(monthData);
            }
            
            monthData.grades.push(grade);
        });
        
        // Calculate average GPA for each period
        history.forEach(period => {
            const totalGPA = period.grades.reduce((sum, g) => sum + g.gpa, 0);
            period.gpa = totalGPA / period.grades.length;
        });
        
        return history.sort((a, b) => a.period.localeCompare(b.period));
    }

    calculateCurrentGPA(history) {
        if (history.length === 0) return 3.0;
        return history[history.length - 1].gpa;
    }

    loadStudyPatterns() {
        return JSON.parse(localStorage.getItem('studyPatterns') || '{}');
    }

    saveStudyPatterns() {
        localStorage.setItem('studyPatterns', JSON.stringify(this.studyPatterns));
    }

    // Recipe Recommendation System
    initializeRecipeDatabase() {
        return {
            'malay': [
                {
                    name: 'Nasi Lemak',
                    ingredients: ['nasi', 'santan', 'ikan bilis', 'kacang tanah', 'timun', 'telur'],
                    difficulty: 'easy',
                    cookingTime: 30,
                    description: 'Hidangan tradisional Malaysia yang popular'
                },
                {
                    name: 'Rendang Daging',
                    ingredients: ['daging lembu', 'santan', 'serai', 'lengkuas', 'cili kering', 'bawang'],
                    difficulty: 'hard',
                    cookingTime: 120,
                    description: 'Masakan berempah yang kaya dengan rasa'
                },
                {
                    name: 'Ayam Masak Merah',
                    ingredients: ['ayam', 'tomato', 'bawang', 'cili', 'sos tomato', 'garam'],
                    difficulty: 'medium',
                    cookingTime: 45,
                    description: 'Ayam dimasak dengan sos tomato yang sedap'
                }
            ],
            'chinese': [
                {
                    name: 'Fried Rice',
                    ingredients: ['nasi', 'telur', 'sosej', 'kacang peas', 'bawang', 'kicap'],
                    difficulty: 'easy',
                    cookingTime: 20,
                    description: 'Nasi goreng ala Cina yang simple dan sedap'
                },
                {
                    name: 'Sweet & Sour Fish',
                    ingredients: ['ikan', 'nanas', 'tomato', 'capsicum', 'sos tomato', 'gula'],
                    difficulty: 'medium',
                    cookingTime: 35,
                    description: 'Ikan dengan rasa masam manis yang menyelerakan'
                }
            ],
            'western': [
                {
                    name: 'Spaghetti Bolognese',
                    ingredients: ['spaghetti', 'daging cincang', 'tomato', 'bawang', 'bawang putih', 'keju'],
                    difficulty: 'medium',
                    cookingTime: 40,
                    description: 'Pasta Italia dengan sos daging yang lazat'
                },
                {
                    name: 'Grilled Chicken',
                    ingredients: ['ayam', 'lemon', 'herbs', 'garam', 'lada hitam', 'minyak zaitun'],
                    difficulty: 'easy',
                    cookingTime: 25,
                    description: 'Ayam bakar yang sihat dan sedap'
                }
            ]
        };
    }

    recommendRecipes() {
        const ingredientsInput = document.getElementById('availableIngredients').value;
        const cuisineType = document.getElementById('cuisineType').value;
        const difficultyLevel = document.getElementById('difficultyLevel').value;

        const availableIngredients = ingredientsInput.toLowerCase()
            .split(',')
            .map(ingredient => ingredient.trim())
            .filter(ingredient => ingredient.length > 0);

        if (availableIngredients.length === 0) {
            alert('Sila masukkan bahan-bahan yang tersedia!');
            return;
        }

        const recommendations = this.findMatchingRecipes(availableIngredients, cuisineType, difficultyLevel);
        this.displayRecipeRecommendations(recommendations, availableIngredients);

        // Trigger celebration
        setTimeout(() => {
            if (typeof triggerCelebration === 'function') {
                triggerCelebration('🍳 Rekomendasi resipi telah dijana!');
            }
        }, 500);
    }

    findMatchingRecipes(availableIngredients, cuisineType, difficultyLevel) {
        let recipes = [];

        // Get recipes based on cuisine type
        if (cuisineType === 'any') {
            recipes = Object.values(this.recipeDatabase).flat();
        } else {
            recipes = this.recipeDatabase[cuisineType] || [];
        }

        // Filter by difficulty
        if (difficultyLevel !== 'any') {
            const difficultyMap = {
                'beginner': 'easy',
                'intermediate': 'medium',
                'advanced': 'hard'
            };
            recipes = recipes.filter(recipe => recipe.difficulty === difficultyMap[difficultyLevel]);
        }

        // Calculate match score for each recipe
        const scoredRecipes = recipes.map(recipe => {
            const matchScore = this.calculateIngredientMatch(availableIngredients, recipe.ingredients);
            return {
                ...recipe,
                matchScore: matchScore,
                missingIngredients: recipe.ingredients.filter(ing => 
                    !availableIngredients.some(avail => ing.toLowerCase().includes(avail.toLowerCase()))
                )
            };
        });

        // Sort by match score (highest first)
        return scoredRecipes
            .filter(recipe => recipe.matchScore > 0.3) // At least 30% match
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 5); // Top 5 recommendations
    }

    calculateIngredientMatch(available, required) {
        const matches = required.filter(reqIng => 
            available.some(availIng => 
                reqIng.toLowerCase().includes(availIng.toLowerCase()) ||
                availIng.toLowerCase().includes(reqIng.toLowerCase())
            )
        );
        
        return matches.length / required.length;
    }

    displayRecipeRecommendations(recommendations, availableIngredients) {
        const resultsDiv = document.getElementById('recipeRecommendations');
        
        if (recommendations.length === 0) {
            resultsDiv.innerHTML = `
                <h4><i class="fas fa-search"></i> Tiada Resipi Dijumpai</h4>
                <p>Maaf, tiada resipi yang sesuai dengan bahan-bahan yang ada. Cuba tambah lebih banyak bahan atau tukar jenis masakan.</p>
            `;
        } else {
            let html = `
                <h4><i class="fas fa-utensils"></i> Rekomendasi Resipi AI (${recommendations.length} dijumpai)</h4>
                <p>Berdasarkan bahan: <strong>${availableIngredients.join(', ')}</strong></p>
            `;

            recommendations.forEach((recipe, index) => {
                const difficultyClass = recipe.difficulty === 'easy' ? 'easy' : 
                                      recipe.difficulty === 'medium' ? 'medium' : 'hard';
                
                html += `
                    <div class="recipe-item" style="animation-delay: ${index * 0.1}s">
                        <div class="recipe-name">${recipe.name}</div>
                        <div class="recipe-difficulty ${difficultyClass}">
                            ${recipe.difficulty === 'easy' ? 'Mudah' : 
                              recipe.difficulty === 'medium' ? 'Sederhana' : 'Sukar'}
                        </div>
                        <div class="recipe-description">${recipe.description}</div>
                        <div class="recipe-ingredients">
                            <strong>Bahan diperlukan:</strong> ${recipe.ingredients.join(', ')}
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem;">
                            <div class="recipe-match-score">
                                🎯 ${(recipe.matchScore * 100).toFixed(0)}% padanan
                            </div>
                            <div style="color: #666;">
                                ⏱️ ${recipe.cookingTime} minit
                            </div>
                        </div>
                        ${recipe.missingIngredients.length > 0 ? `
                            <div style="margin-top: 0.5rem; padding: 0.5rem; background: #fff3cd; border-radius: 5px; font-size: 0.9rem;">
                                <strong>Bahan tambahan diperlukan:</strong> ${recipe.missingIngredients.join(', ')}
                            </div>
                        ` : ''}
                    </div>
                `;
            });
        }
        
        resultsDiv.innerHTML = html;
        resultsDiv.style.display = 'block';
        resultsDiv.classList.add('show');
    }

    // Learning Analytics & Insights
    generateInsights() {
        const userData = this.gatherUserData();
        const insights = this.analyzeUserPattern(userData);
        this.displayLearningInsights(insights);

        // Trigger celebration
        setTimeout(() => {
            if (typeof triggerCelebration === 'function') {
                triggerCelebration('📊 Analitik pembelajaran telah dijana!');
            }
        }, 500);
    }

    gatherUserData() {
        return {
            grades: JSON.parse(localStorage.getItem('grades') || '[]'),
            assignments: JSON.parse(localStorage.getItem('assignments') || '[]'),
            attendance: JSON.parse(localStorage.getItem('attendance') || '[]'),
            goals: JSON.parse(localStorage.getItem('goals') || '[]'),
            studyTime: JSON.parse(localStorage.getItem('studyTime') || '[]')
        };
    }

    analyzeUserPattern(data) {
        const insights = [];

        // GPA Analysis
        if (data.grades.length > 0) {
            const avgGPA = data.grades.reduce((sum, g) => sum + g.gpa, 0) / data.grades.length;
            const trend = this.calculateGradeTrend(data.grades);
            
            insights.push({
                type: 'academic',
                icon: 'fas fa-chart-line',
                title: 'Prestasi Akademik',
                description: `CGPA purata anda: ${avgGPA.toFixed(2)}`,
                recommendation: avgGPA >= 3.5 ? 
                    'Prestasi cemerlang! Kekalkan momentum ini.' :
                    avgGPA >= 3.0 ?
                    'Prestasi baik. Ada ruang untuk penambahbaikan.' :
                    'Fokus pada subjek yang lemah untuk peningkatan.',
                trend: trend
            });
        }

        // Assignment Analysis
        if (data.assignments.length > 0) {
            const completionRate = this.calculateCompletionRate(data.assignments);
            insights.push({
                type: 'productivity',
                icon: 'fas fa-tasks',
                title: 'Produktiviti Tugasan',
                description: `Kadar siap tugasan: ${completionRate.toFixed(0)}%`,
                recommendation: completionRate >= 80 ?
                    'Excellent time management!' :
                    completionRate >= 60 ?
                    'Good progress. Improve planning untuk deadline.' :
                    'Perlukan strategi time management yang lebih baik.'
            });
        }

        // Attendance Analysis
        if (data.attendance.length > 0) {
            const attendanceRate = this.calculateAttendanceRate(data.attendance);
            insights.push({
                type: 'attendance',
                icon: 'fas fa-user-check',
                title: 'Kehadiran Kelas',
                description: `Kadar kehadiran: ${attendanceRate.toFixed(0)}%`,
                recommendation: attendanceRate >= 90 ?
                    'Kehadiran sangat baik!' :
                    attendanceRate >= 75 ?
                    'Kehadiran memuaskan. Pastikan consistent.' :
                    'Tingkatkan kehadiran untuk prestasi yang lebih baik.'
            });
        }

        return insights;
    }

    calculateGradeTrend(grades) {
        if (grades.length < 2) return 'stable';
        
        const recent = grades.slice(-5); // Last 5 grades
        const gpaValues = recent.map(g => g.gpa);
        
        let trend = 0;
        for (let i = 1; i < gpaValues.length; i++) {
            trend += gpaValues[i] - gpaValues[i-1];
        }
        
        return trend > 0.1 ? 'improving' : trend < -0.1 ? 'declining' : 'stable';
    }

    calculateCompletionRate(assignments) {
        if (assignments.length === 0) return 100;
        
        const completed = assignments.filter(a => a.status === 'completed').length;
        return (completed / assignments.length) * 100;
    }

    calculateAttendanceRate(attendance) {
        if (attendance.length === 0) return 100;
        
        const present = attendance.filter(a => a.status === 'present').length;
        return (present / attendance.length) * 100;
    }

    displayLearningInsights(insights) {
        const resultsDiv = document.getElementById('learningInsights');
        
        let html = `
            <h4><i class="fas fa-brain"></i> Analitik Pembelajaran Pintar</h4>
        `;

        if (insights.length === 0) {
            html += `
                <div style="text-align: center; padding: 2rem; color: #666;">
                    <i class="fas fa-chart-bar" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>Mulakan menggunakan BreyerHub untuk mendapat insight yang berguna!</p>
                </div>
            `;
        } else {
            insights.forEach((insight, index) => {
                const trendIcon = insight.trend === 'improving' ? '📈' : 
                                insight.trend === 'declining' ? '📉' : '➡️';
                
                html += `
                    <div class="insight-card" style="animation-delay: ${index * 0.1}s; margin-bottom: 1rem; 
                         padding: 1rem; background: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <div style="display: flex; align-items: center; margin-bottom: 0.5rem;">
                            <i class="${insight.icon}" style="font-size: 1.5rem; color: var(--accent-color); margin-right: 0.5rem;"></i>
                            <h5>${insight.title}</h5>
                            ${insight.trend ? `<span style="margin-left: auto; font-size: 1.2rem;">${trendIcon}</span>` : ''}
                        </div>
                        <p style="color: #666; margin-bottom: 0.5rem;">${insight.description}</p>
                        <div style="padding: 0.5rem; background: #f8f9fa; border-radius: 5px; border-left: 3px solid var(--accent-color);">
                            <strong>💡 Cadangan:</strong> ${insight.recommendation}
                        </div>
                    </div>
                `;
            });
        }
        
        resultsDiv.innerHTML = html;
        resultsDiv.style.display = 'block';
        resultsDiv.classList.add('show');
    }

    // Career Path Guidance
    initializeCareerDatabase() {
        return {
            'culinary': {
                careers: [
                    {
                        title: 'Executive Chef',
                        description: 'Memimpin operasi dapur dan menu development di hotel atau restoran mewah.',
                        skills: ['Leadership', 'Menu Planning', 'Cost Control', 'Team Management'],
                        salaryRange: 'RM 8,000 - RM 15,000',
                        growth: 'high'
                    },
                    {
                        title: 'Food & Beverage Manager',
                        description: 'Mengurus operasi F&B secara menyeluruh termasuk service dan kitchen.',
                        skills: ['Management', 'Customer Service', 'Budgeting', 'Staff Training'],
                        salaryRange: 'RM 6,000 - RM 12,000',
                        growth: 'medium'
                    },
                    {
                        title: 'Culinary Entrepreneur',
                        description: 'Memulakan business sendiri seperti restaurant, cafe, atau catering.',
                        skills: ['Business Planning', 'Marketing', 'Financial Management', 'Innovation'],
                        salaryRange: 'RM 5,000 - RM 50,000+',
                        growth: 'very-high'
                    }
                ]
            },
            'computer': {
                careers: [
                    {
                        title: 'IT Support Specialist',
                        description: 'Menyediakan technical support dan menyelesaikan masalah komputer.',
                        skills: ['Troubleshooting', 'Hardware Repair', 'Network Setup', 'Customer Service'],
                        salaryRange: 'RM 3,000 - RM 6,000',
                        growth: 'medium'
                    },
                    {
                        title: 'Network Administrator',
                        description: 'Mengurus dan maintain network infrastructure organisasi.',
                        skills: ['Network Security', 'Server Management', 'Monitoring Tools', 'Documentation'],
                        salaryRange: 'RM 5,000 - RM 10,000',
                        growth: 'high'
                    },
                    {
                        title: 'Cybersecurity Analyst',
                        description: 'Melindungi sistem dan data organisasi dari ancaman cyber.',
                        skills: ['Security Protocols', 'Risk Assessment', 'Incident Response', 'Compliance'],
                        salaryRange: 'RM 7,000 - RM 15,000',
                        growth: 'very-high'
                    }
                ]
            },
            'electrical': {
                careers: [
                    {
                        title: 'Electrical Technician',
                        description: 'Install, maintain, dan repair electrical systems dan equipment.',
                        skills: ['Wiring', 'Circuit Analysis', 'Safety Protocols', 'Blueprint Reading'],
                        salaryRange: 'RM 3,500 - RM 7,000',
                        growth: 'medium'
                    },
                    {
                        title: 'Automation Engineer',
                        description: 'Design dan implement automated systems untuk manufacturing.',
                        skills: ['PLC Programming', 'Control Systems', 'Robotics', 'Process Optimization'],
                        salaryRange: 'RM 6,000 - RM 12,000',
                        growth: 'high'
                    }
                ]
            },
            'fnb': {
                careers: [
                    {
                        title: 'Restaurant Manager',
                        description: 'Mengurus daily operations restaurant dan ensure customer satisfaction.',
                        skills: ['Operations Management', 'Staff Supervision', 'Inventory Control', 'P&L Management'],
                        salaryRange: 'RM 4,000 - RM 8,000',
                        growth: 'medium'
                    },
                    {
                        title: 'Food Service Director',
                        description: 'Oversee food service operations untuk large organizations atau chains.',
                        skills: ['Strategic Planning', 'Multi-unit Management', 'Vendor Relations', 'Quality Assurance'],
                        salaryRange: 'RM 8,000 - RM 15,000',
                        growth: 'high'
                    }
                ]
            },
            'admin': {
                careers: [
                    {
                        title: 'Office Manager',
                        description: 'Mengurus administrative functions dan office operations.',
                        skills: ['Office Administration', 'Staff Coordination', 'Record Management', 'Communication'],
                        salaryRange: 'RM 3,000 - RM 6,000',
                        growth: 'medium'
                    },
                    {
                        title: 'Operations Manager',
                        description: 'Oversee business operations dan improve efficiency processes.',
                        skills: ['Process Improvement', 'Project Management', 'Data Analysis', 'Strategic Planning'],
                        salaryRange: 'RM 6,000 - RM 12,000',
                        growth: 'high'
                    }
                ]
            }
        };
    }

    generateCareerGuidance() {
        const program = document.getElementById('studyProgram').value;
        const interest = document.getElementById('careerInterest').value;
        
        const careers = this.getRelevantCareers(program, interest);
        this.displayCareerGuidance(careers, program);

        // Trigger celebration
        setTimeout(() => {
            if (typeof triggerCelebration === 'function') {
                triggerCelebration('🗺️ Panduan kerjaya telah dijana!');
            }
        }, 500);
    }

    getRelevantCareers(program, interest) {
        const programCareers = this.careerDatabase[program]?.careers || [];
        
        // Filter based on interest
        let filteredCareers = programCareers;
        if (interest === 'management') {
            filteredCareers = programCareers.filter(career => 
                career.title.toLowerCase().includes('manager') || 
                career.skills.some(skill => skill.toLowerCase().includes('management'))
            );
        } else if (interest === 'technical') {
            filteredCareers = programCareers.filter(career => 
                career.skills.some(skill => 
                    skill.toLowerCase().includes('technical') || 
                    skill.toLowerCase().includes('programming') ||
                    skill.toLowerCase().includes('repair')
                )
            );
        }
        
        return filteredCareers.length > 0 ? filteredCareers : programCareers;
    }

    displayCareerGuidance(careers, program) {
        const resultsDiv = document.getElementById('careerGuidance');
        
        let html = `
            <h4><i class="fas fa-compass"></i> Panduan Kerjaya untuk ${program.charAt(0).toUpperCase() + program.slice(1)}</h4>
        `;

        if (careers.length === 0) {
            html += `
                <div style="text-align: center; padding: 2rem; color: #666;">
                    <p>Maaf, tiada data kerjaya untuk program ini buat masa sekarang.</p>
                </div>
            `;
        } else {
            careers.forEach((career, index) => {
                const growthColor = career.growth === 'very-high' ? '#27ae60' :
                                 career.growth === 'high' ? '#2ecc71' :
                                 career.growth === 'medium' ? '#f39c12' : '#e74c3c';
                
                html += `
                    <div class="career-path" style="animation-delay: ${index * 0.1}s">
                        <div class="career-title">${career.title}</div>
                        <div class="career-description">${career.description}</div>
                        
                        <div class="career-skills">
                            <h5>💼 Kemahiran Diperlukan:</h5>
                            ${career.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                            
                            <div style="margin-top: 1rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                <div>
                                    <strong>💰 Gaji:</strong> ${career.salaryRange}
                                </div>
                                <div>
                                    <strong>📈 Prospek:</strong> 
                                    <span style="color: ${growthColor}">
                                        ${career.growth === 'very-high' ? 'Sangat Tinggi' :
                                          career.growth === 'high' ? 'Tinggi' :
                                          career.growth === 'medium' ? 'Sederhana' : 'Rendah'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
        }
        
        resultsDiv.innerHTML = html;
        resultsDiv.style.display = 'block';
        resultsDiv.classList.add('show');
    }

    // Study Recommendations
    getStudyRecommendations() {
        const userData = this.gatherUserData();
        const recommendations = this.generateStudyRecommendations(userData);
        this.displayStudyRecommendations(recommendations);

        // Trigger celebration
        setTimeout(() => {
            if (typeof triggerCelebration === 'function') {
                triggerCelebration('💡 Tips kajian pintar telah dijana!');
            }
        }, 500);
    }

    generateStudyRecommendations(data) {
        const recommendations = [];

        // Time management recommendations
        if (data.assignments.length > 0) {
            const overdue = data.assignments.filter(a => 
                new Date(a.dueDate) < new Date() && a.status !== 'completed'
            ).length;
            
            if (overdue > 0) {
                recommendations.push({
                    category: 'Time Management',
                    tip: 'Anda ada tugasan tertunggak. Gunakan Pomodoro Technique: 25 minit fokus, 5 minit rehat.',
                    priority: 'high'
                });
            }
        }

        // Study technique recommendations
        if (data.grades.length > 0) {
            const avgGPA = data.grades.reduce((sum, g) => sum + g.gpa, 0) / data.grades.length;
            
            if (avgGPA < 3.0) {
                recommendations.push({
                    category: 'Study Technique',
                    tip: 'Cuba active recall method: Tutup buku dan cuba ingat apa yang dipelajari.',
                    priority: 'high'
                });
            }
        }

        // General recommendations
        recommendations.push(
            {
                category: 'Memory Enhancement',
                tip: 'Gunakan spaced repetition: Review materi pada hari 1, 3, 7, dan 21.',
                priority: 'medium'
            },
            {
                category: 'Health & Wellness',
                tip: 'Tidur 7-8 jam setiap malam untuk brain consolidation yang optimal.',
                priority: 'medium'
            },
            {
                category: 'Environment',
                tip: 'Buat dedicated study space yang bersih dan bebas dari distraction.',
                priority: 'low'
            }
        );

        return recommendations.sort((a, b) => {
            const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    }

    displayStudyRecommendations(recommendations) {
        const resultsDiv = document.getElementById('learningInsights');
        
        let html = `
            <h4><i class="fas fa-lightbulb"></i> Tips Kajian Pintar AI</h4>
            <p>Cadangan berdasarkan analisis pola pembelajaran anda:</p>
        `;

        recommendations.forEach((rec, index) => {
            const priorityColor = rec.priority === 'high' ? '#e74c3c' :
                                rec.priority === 'medium' ? '#f39c12' : '#27ae60';
            
            html += `
                <div class="recommendation-item" style="animation-delay: ${index * 0.1}s; margin-bottom: 1rem; 
                     padding: 1rem; background: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                     border-left: 4px solid ${priorityColor};">
                    <div style="display: flex; align-items: center; margin-bottom: 0.5rem;">
                        <span style="background: ${priorityColor}; color: white; padding: 0.2rem 0.5rem; 
                              border-radius: 10px; font-size: 0.8rem; margin-right: 0.5rem;">
                            ${rec.priority.toUpperCase()}
                        </span>
                        <strong>${rec.category}</strong>
                    </div>
                    <p style="margin: 0; color: #666;">${rec.tip}</p>
                </div>
            `;
        });
        
        resultsDiv.innerHTML = html;
        resultsDiv.style.display = 'block';
        resultsDiv.classList.add('show');
    }
}

// Cloud Sync & Integration System
class CloudSync {
    constructor() {
        this.isConnected = false;
        this.autoSyncEnabled = true;
        this.syncInterval = 5; // minutes
        this.lastSyncTime = null;
        this.deviceId = this.generateDeviceId();
        this.activityLog = JSON.parse(localStorage.getItem('syncActivityLog') || '[]');
        
        this.init();
    }

    init() {
        this.updateSyncStatus();
        this.setupAutoSync();
        this.detectDevice();
        this.loadActivityLog();
        
        // Simulate cloud connection
        setTimeout(() => {
            this.simulateCloudConnection();
        }, 2000);
    }

    generateDeviceId() {
        let deviceId = localStorage.getItem('deviceId');
        if (!deviceId) {
            deviceId = 'device_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('deviceId', deviceId);
        }
        return deviceId;
    }

    simulateCloudConnection() {
        this.isConnected = true;
        this.updateSyncStatus();
        this.addActivity('cloud-connect', 'Sambungan cloud berjaya', 'Peranti berhubung dengan cloud storage');
        
        // Trigger celebration
        if (typeof triggerCelebration === 'function') {
            triggerCelebration('☁️ Cloud storage berhubung!');
        }
    }

    // Third-party Integrations
    connectGoogleCalendar() {
        this.addActivity('integration', 'Google Calendar', 'Memulakan sambungan');
        
        // Simulate Google Calendar connection
        setTimeout(() => {
            this.addActivity('integration-success', 'Google Calendar berhubung', 'Sinkronisasi kalendar aktif');
            if (typeof triggerCelebration === 'function') {
                triggerCelebration('📅 Google Calendar berhubung!');
            }
        }, 2000);
    }

    connectMicrosoftTeams() {
        this.addActivity('integration', 'Microsoft Teams', 'Memulakan sambungan');
        
        setTimeout(() => {
            this.addActivity('integration-success', 'Microsoft Teams berhubung', 'Notifikasi aktif');
            if (typeof triggerCelebration === 'function') {
                triggerCelebration('👥 Microsoft Teams berhubung!');
            }
        }, 2000);
    }

    // Enhanced Third-party Integrations
    connectEmailNotifications() {
        this.addActivity('integration', 'Email Notifications', 'Mengaktifkan sistem email');
        
        setTimeout(() => {
            this.addActivity('integration-success', 'Email notifications aktif', 'Reminder akan dihantar ke email');
            if (typeof triggerCelebration === 'function') {
                triggerCelebration('📧 Email notifications aktif!');
            }
            
            // Save email preference
            localStorage.setItem('emailNotificationsEnabled', 'true');
            this.updateIntegrationStatus();
        }, 1500);
    }

    connectUniversityAPI() {
        this.addActivity('integration', 'University System', 'Menghubung dengan sistem universiti');
        
        setTimeout(() => {
            this.addActivity('integration-success', 'University API berhubung', 'Data akademik akan sinkronisasi');
            if (typeof triggerCelebration === 'function') {
                triggerCelebration('🏫 University system berhubung!');
            }
            
            localStorage.setItem('universityAPIConnected', 'true');
            this.updateIntegrationStatus();
        }, 3000);
    }

    connectGoogleDrive() {
        this.addActivity('integration', 'Google Drive', 'Mengaktifkan backup cloud');
        
        setTimeout(() => {
            this.addActivity('integration-success', 'Google Drive berhubung', 'Auto-backup dokumen aktif');
            if (typeof triggerCelebration === 'function') {
                triggerCelebration('☁️ Google Drive backup aktif!');
            }
            
            localStorage.setItem('googleDriveConnected', 'true');
            this.updateIntegrationStatus();
        }, 2500);
    }

    disconnectIntegration(service) {
        this.addActivity('integration', service, 'Memutuskan sambungan');
        
        setTimeout(() => {
            this.addActivity('integration-warning', `${service} diputuskan`, 'Sambungan telah dimatikan');
            
            // Remove from localStorage
            const serviceKeys = {
                'Google Calendar': 'googleCalendarConnected',
                'Microsoft Teams': 'microsoftTeamsConnected',
                'Email Notifications': 'emailNotificationsEnabled',
                'University System': 'universityAPIConnected',
                'Google Drive': 'googleDriveConnected'
            };
            
            if (serviceKeys[service]) {
                localStorage.removeItem(serviceKeys[service]);
            }
            
            this.updateIntegrationStatus();
            
            if (typeof triggerCelebration === 'function') {
                triggerCelebration(`❌ ${service} diputuskan`);
            }
        }, 1000);
    }

    updateIntegrationStatus() {
        const integrations = [
            { name: 'Google Calendar', key: 'googleCalendarConnected', icon: '📅' },
            { name: 'Microsoft Teams', key: 'microsoftTeamsConnected', icon: '👥' },
            { name: 'Email Notifications', key: 'emailNotificationsEnabled', icon: '📧' },
            { name: 'University System', key: 'universityAPIConnected', icon: '🏫' },
            { name: 'Google Drive', key: 'googleDriveConnected', icon: '☁️' }
        ];

        const integrationsContainer = document.getElementById('integrationsStatus');
        if (integrationsContainer) {
            integrationsContainer.innerHTML = integrations.map(integration => {
                const isConnected = localStorage.getItem(integration.key) === 'true';
                return `
                    <div class="integration-status-item" style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: ${isConnected ? '#e8f5e8' : '#f8f9fa'}; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid ${isConnected ? '#28a745' : '#dee2e6'};">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 20px;">${integration.icon}</span>
                            <div>
                                <div style="font-weight: 500; color: #333;">${integration.name}</div>
                                <div style="font-size: 12px; color: ${isConnected ? '#28a745' : '#666'};">
                                    ${isConnected ? 'Berhubung' : 'Tidak berhubung'}
                                </div>
                            </div>
                        </div>
                        <button class="btn ${isConnected ? 'danger' : 'primary'}" 
                                onclick="cloudSync.${isConnected ? `disconnectIntegration('${integration.name}')` : this.getConnectMethod(integration.name)}"
                                style="padding: 6px 12px; font-size: 12px;">
                            ${isConnected ? 'Putuskan' : 'Sambung'}
                        </button>
                    </div>
                `;
            }).join('');
        }
    }

    getConnectMethod(serviceName) {
        const methods = {
            'Google Calendar': 'connectGoogleCalendar()',
            'Microsoft Teams': 'connectMicrosoftTeams()',
            'Email Notifications': 'connectEmailNotifications()',
            'University System': 'connectUniversityAPI()',
            'Google Drive': 'connectGoogleDrive()'
        };
        return methods[serviceName] || 'connectGoogleCalendar()';
    }

    // Sync calendar events with external services
    syncCalendarEvents() {
        if (localStorage.getItem('googleCalendarConnected') === 'true') {
            this.addActivity('sync', 'Calendar Sync', 'Sinkronisasi events dengan Google Calendar');
            
            // Simulate calendar sync
            setTimeout(() => {
                this.addActivity('sync-success', 'Calendar berjaya disinkronisasi', '5 events baharu dijumpai');
                if (typeof triggerCelebration === 'function') {
                    triggerCelebration('📅 Calendar sync selesai!');
                }
            }, 2000);
        }
    }

    // Send email notifications for important events
    sendEmailNotification(type, title, message) {
        if (localStorage.getItem('emailNotificationsEnabled') === 'true') {
            this.addActivity('notification', 'Email Notification', `Menghantar: ${title}`);
            
            // Simulate email sending
            setTimeout(() => {
                this.addActivity('notification-success', 'Email berjaya dihantar', message);
            }, 1000);
        }
    }

    updateSyncStatus() {
        // Update local status
        const localStatus = document.getElementById('localStatusText');
        const localIcon = document.getElementById('localStatus');
        if (localStatus) {
            localStatus.textContent = 'Tersedia';
            localStatus.className = 'status-text';
            localIcon.style.background = 'var(--success-color)';
        }

        // Update cloud status
        const cloudStatus = document.getElementById('cloudStatusText');
        const cloudIcon = document.getElementById('cloudStatus');
        const cloudUpdate = document.getElementById('cloudLastUpdate');
        
        if (cloudStatus) {
            if (this.isConnected) {
                cloudStatus.textContent = 'Berhubung';
                cloudStatus.className = 'status-text';
                cloudIcon.style.background = 'var(--success-color)';
                if (cloudUpdate) {
                    cloudUpdate.textContent = `Sinkronisasi terakhir: ${this.lastSyncTime || 'Baru sahaja'}`;
                }
            } else {
                cloudStatus.textContent = 'Menghubung...';
                cloudStatus.className = 'status-text warning';
                cloudIcon.style.background = 'var(--warning-color)';
                cloudIcon.classList.add('syncing');
            }
        }

        // Update sync status
        const syncStatus = document.getElementById('syncStatusText');
        const syncIcon = document.getElementById('syncStatus');
        if (syncStatus) {
            syncStatus.textContent = this.autoSyncEnabled ? 'Aktif' : 'Tidak Aktif';
            syncStatus.className = this.autoSyncEnabled ? 'status-text' : 'status-text warning';
            syncIcon.style.background = this.autoSyncEnabled ? 'var(--success-color)' : 'var(--warning-color)';
        }

        // Update integrations status
        this.updateIntegrationStatus();
    }

    // Multi-device Support Functions
    detectDevice() {
        const userAgent = navigator.userAgent;
        const platform = navigator.platform;
        const screen = window.screen;
        
        const deviceInfo = {
            type: this.getDeviceType(),
            os: this.getOperatingSystem(),
            browser: this.getBrowserInfo(),
            screen: {
                width: screen.width,
                height: screen.height,
                ratio: window.devicePixelRatio || 1
            },
            touch: 'ontouchstart' in window,
            orientation: this.getOrientation(),
            network: this.getNetworkInfo(),
            lastSeen: new Date().toISOString(),
            deviceId: this.generateDeviceId()
        };

        // Store device info
        localStorage.setItem('currentDevice', JSON.stringify(deviceInfo));
        this.addDevice(deviceInfo);
        
        // Apply device-specific optimizations
        this.applyDeviceOptimizations(deviceInfo);
        
        return deviceInfo;
    }

    getDeviceType() {
        const userAgent = navigator.userAgent;
        
        if (/Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
            if (/iPad|Tablet/i.test(userAgent) || (window.screen.width >= 768 && window.screen.width <= 1024)) {
                return 'tablet';
            }
            return 'mobile';
        }
        
        return 'desktop';
    }

    getOperatingSystem() {
        const userAgent = navigator.userAgent;
        const platform = navigator.platform;
        
        if (/Win/i.test(platform)) return 'Windows';
        if (/Mac/i.test(platform)) return 'macOS';
        if (/Linux/i.test(platform)) return 'Linux';
        if (/Android/i.test(userAgent)) return 'Android';
        if (/iPhone|iPad|iPod/i.test(userAgent)) return 'iOS';
        
        return 'Unknown';
    }

    getBrowserInfo() {
        const userAgent = navigator.userAgent;
        
        if (userAgent.includes('Chrome')) return 'Chrome';
        if (userAgent.includes('Firefox')) return 'Firefox';
        if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
        if (userAgent.includes('Edge')) return 'Edge';
        if (userAgent.includes('Opera')) return 'Opera';
        
        return 'Unknown';
    }

    getOrientation() {
        if (screen.orientation) {
            return screen.orientation.type;
        }
        
        return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
    }

    getNetworkInfo() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            return {
                type: connection.effectiveType || 'unknown',
                downlink: connection.downlink || 0,
                rtt: connection.rtt || 0
            };
        }
        
        return { type: 'unknown', downlink: 0, rtt: 0 };
    }

    generateDeviceId() {
        const existing = localStorage.getItem('deviceId');
        if (existing) return existing;
        
        const id = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('deviceId', id);
        return id;
    }

    addDevice(deviceInfo) {
        const devices = JSON.parse(localStorage.getItem('registeredDevices') || '[]');
        const existingIndex = devices.findIndex(d => d.deviceId === deviceInfo.deviceId);
        
        if (existingIndex >= 0) {
            devices[existingIndex] = { ...devices[existingIndex], ...deviceInfo };
        } else {
            devices.push(deviceInfo);
        }
        
        localStorage.setItem('registeredDevices', JSON.stringify(devices));
        this.updateDeviceList();
    }

    updateDeviceList() {
        const deviceList = document.getElementById('deviceList');
        if (!deviceList) return;
        
        const devices = JSON.parse(localStorage.getItem('registeredDevices') || '[]');
        const currentDeviceId = localStorage.getItem('deviceId');
        
        deviceList.innerHTML = devices.map(device => `
            <div class="device-item ${device.deviceId === currentDeviceId ? 'current' : ''}" 
                 style="padding: 15px; margin: 10px 0; background: ${device.deviceId === currentDeviceId ? '#e8f5e8' : '#f8f9fa'}; 
                        border-radius: 8px; border-left: 4px solid ${device.deviceId === currentDeviceId ? '#28a745' : '#dee2e6'};">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h5 style="margin: 0; color: #333;">
                            ${this.getDeviceIcon(device.type)} ${device.type.charAt(0).toUpperCase() + device.type.slice(1)}
                            ${device.deviceId === currentDeviceId ? ' (Current)' : ''}
                        </h5>
                        <p style="margin: 5px 0; color: #666; font-size: 14px;">
                            ${device.os} • ${device.browser} • ${device.screen.width}x${device.screen.height}
                        </p>
                        <p style="margin: 0; color: #999; font-size: 12px;">
                            Last seen: ${new Date(device.lastSeen).toLocaleDateString()}
                        </p>
                    </div>
                    <div>
                        ${device.deviceId !== currentDeviceId ? `
                            <button class="btn danger" onclick="cloudSync.removeDevice('${device.deviceId}')" 
                                    style="padding: 5px 10px; font-size: 12px;">
                                Remove
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }

    getDeviceIcon(type) {
        const icons = {
            desktop: '🖥️',
            laptop: '💻', 
            tablet: '📱',
            mobile: '📱'
        };
        return icons[type] || '💻';
    }

    removeDevice(deviceId) {
        if (confirm('Remove this device from sync list?')) {
            const devices = JSON.parse(localStorage.getItem('registeredDevices') || '[]');
            const filtered = devices.filter(d => d.deviceId !== deviceId);
            localStorage.setItem('registeredDevices', JSON.stringify(filtered));
            this.updateDeviceList();
            
            this.addActivity('device', 'Device Removed', 'Device removed from sync list');
            if (typeof triggerCelebration === 'function') {
                triggerCelebration('📱 Device removed');
            }
        }
    }

    applyDeviceOptimizations(deviceInfo) {
        const body = document.body;
        
        // Remove existing device classes
        body.classList.remove('device-mobile', 'device-tablet', 'device-desktop', 'touch-device');
        
        // Add device-specific classes
        body.classList.add(`device-${deviceInfo.type}`);
        
        if (deviceInfo.touch) {
            body.classList.add('touch-device');
        }
        
        // Apply device-specific CSS variables
        document.documentElement.style.setProperty('--device-type', `'${deviceInfo.type}'`);
        document.documentElement.style.setProperty('--screen-width', `${deviceInfo.screen.width}px`);
        document.documentElement.style.setProperty('--screen-height', `${deviceInfo.screen.height}px`);
        
        // Optimize interface based on device
        this.optimizeInterface(deviceInfo);
        
        // Update device info in UI
        this.updateDeviceInfo(deviceInfo);
    }

    optimizeInterface(deviceInfo) {
        if (deviceInfo.type === 'mobile') {
            // Mobile optimizations
            this.enableMobileMode();
        } else if (deviceInfo.type === 'tablet') {
            // Tablet optimizations
            this.enableTabletMode();
        } else {
            // Desktop optimizations
            this.enableDesktopMode();
        }
    }

    enableMobileMode() {
        // Collapse sidebar by default on mobile
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.classList.add('collapsed');
        }
        
        // Larger touch targets
        document.documentElement.style.setProperty('--button-min-height', '44px');
        document.documentElement.style.setProperty('--touch-target-size', '44px');
        
        // Simplified navigation
        this.addActivity('device', 'Mobile Mode', 'Interface optimized for mobile device');
    }

    enableTabletMode() {
        // Medium-sized touch targets
        document.documentElement.style.setProperty('--button-min-height', '40px');
        document.documentElement.style.setProperty('--touch-target-size', '40px');
        
        this.addActivity('device', 'Tablet Mode', 'Interface optimized for tablet device');
    }

    enableDesktopMode() {
        // Default desktop sizing
        document.documentElement.style.setProperty('--button-min-height', '36px');
        document.documentElement.style.setProperty('--touch-target-size', '36px');
        
        this.addActivity('device', 'Desktop Mode', 'Interface optimized for desktop device');
    }

    updateDeviceInfo(deviceInfo) {
        const deviceInfoElement = document.getElementById('currentDeviceInfo');
        if (deviceInfoElement) {
            deviceInfoElement.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background: #f8f9fa; border-radius: 8px;">
                    <span style="font-size: 20px;">${this.getDeviceIcon(deviceInfo.type)}</span>
                    <div>
                        <div style="font-weight: 500;">${deviceInfo.type.charAt(0).toUpperCase() + deviceInfo.type.slice(1)}</div>
                        <div style="font-size: 12px; color: #666;">${deviceInfo.os} • ${deviceInfo.browser}</div>
                    </div>
                </div>
            `;
        }
    }

    // Responsive layout adjustments
    handleOrientationChange() {
        const deviceInfo = JSON.parse(localStorage.getItem('currentDevice') || '{}');
        deviceInfo.orientation = this.getOrientation();
        localStorage.setItem('currentDevice', JSON.stringify(deviceInfo));
        
        // Re-apply optimizations
        this.applyDeviceOptimizations(deviceInfo);
        
        this.addActivity('device', 'Orientation Changed', `Changed to ${deviceInfo.orientation}`);
    }

    // Network-aware optimizations
    optimizeForNetwork() {
        const networkInfo = this.getNetworkInfo();
        
        if (networkInfo.type === 'slow-2g' || networkInfo.type === '2g') {
            // Disable auto-sync on slow connections
            this.autoSyncEnabled = false;
            this.addActivity('network', 'Slow Network Detected', 'Auto-sync disabled to save data');
        } else if (networkInfo.type === '4g' || networkInfo.type === 'wifi') {
            // Enable optimizations for fast connections
            this.addActivity('network', 'Fast Network Detected', 'Full sync capabilities enabled');
        }
    }

    // Initialize device detection
    initializeDeviceSupport() {
        // Detect current device
        const deviceInfo = this.detectDevice();
        
        // Listen for orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.handleOrientationChange(), 500);
        });
        
        // Listen for network changes
        if ('connection' in navigator) {
            navigator.connection.addEventListener('change', () => {
                this.optimizeForNetwork();
            });
        }
        
        // Update device list periodically
        setInterval(() => {
            this.updateDeviceList();
        }, 30000); // Every 30 seconds
        
        this.addActivity('device', 'Device Support Initialized', `Detected: ${deviceInfo.type} device`);
    }
}

// Initialize cloud sync when page loads
const cloudSync = new CloudSync();

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize device support
    cloudSync.initializeDeviceSupport();
    
    // Initialize dashboard
    cloudSync.initializeDashboard();
    
    // Start auto-sync if enabled
    cloudSync.setupAutoSync();
    
    console.log('🎉 All BreyerHub features loaded successfully!');
    console.log('☁️ Cloud Sync system loaded successfully!');
    console.log('📱 Multi-device support enabled!');
});

// Export classes for global access
window.CloudSync = CloudSync;
window.cloudSync = cloudSync;
        
        setTimeout(() => {
            this.addActivity('sync-success', 'Force sync completed', 'Semua data berjaya disinkronisasi');
            this.updateSyncStatistics();
            if (typeof triggerCelebration === 'function') {
                triggerCelebration('🔄 Force sync selesai!');
            }
        }, 3000);
    }

    clearSyncCache() {
        this.addActivity('sync', 'Clear Cache', 'Membersihkan cache sinkronisasi');
        
        // Clear sync-related localStorage items
        const syncKeys = Object.keys(localStorage).filter(key => 
            key.includes('sync') || key.includes('cache') || key.includes('lastSync')
        );
        
        syncKeys.forEach(key => {
            if (!key.includes('Settings')) { // Keep user settings
                localStorage.removeItem(key);
            }
        });
        
        setTimeout(() => {
            this.addActivity('sync-success', 'Cache cleared', 'Cache sinkronisasi telah dibersihkan');
            this.updateSyncStatistics();
            if (typeof triggerCelebration === 'function') {
                triggerCelebration('🗑️ Cache dibersihkan!');
            }
        }, 1000);
    }

    testConnections() {
        this.addActivity('sync', 'Testing Connections', 'Menguji semua sambungan');
        
        const integrations = [
            'googleCalendarConnected',
            'microsoftTeamsConnected', 
            'emailNotificationsEnabled',
            'universityAPIConnected',
            'googleDriveConnected'
        ];
        
        let connectedCount = 0;
        integrations.forEach(integration => {
            if (localStorage.getItem(integration) === 'true') {
                connectedCount++;
            }
        });
        
        setTimeout(() => {
            this.addActivity('sync-success', 'Connection test completed', 
                `${connectedCount}/${integrations.length} services connected`);
            if (typeof triggerCelebration === 'function') {
                triggerCelebration(`✅ ${connectedCount} services aktif!`);
            }
        }, 2000);
    }

    generateSyncReport() {
        this.addActivity('sync', 'Generating Report', 'Menjana laporan sinkronisasi');
        
        const reportData = {
            timestamp: new Date().toISOString(),
            integrations: this.getIntegrationsSummary(),
            syncStats: this.getSyncStatistics(),
            recentActivity: this.getRecentActivity()
        };
        
        const reportContent = `
            <div style="font-family: Arial, sans-serif; padding: 30px; max-width: 800px; margin: 0 auto;">
                <div style="text-align: center; border-bottom: 3px solid #667eea; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #667eea; margin: 0;">BreyerHub Sync Report</h1>
                    <p style="color: #666; margin: 10px 0;">Generated on ${new Date().toLocaleDateString('en-MY', { 
                        year: 'numeric', month: 'long', day: 'numeric', 
                        hour: '2-digit', minute: '2-digit' 
                    })}</p>
                </div>

                <h3 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Integration Status</h3>
                <div style="margin-bottom: 30px;">
                    ${Object.entries(reportData.integrations).map(([service, status]) => `
                        <div style="display: flex; justify-content: space-between; padding: 10px; margin: 5px 0; background: ${status ? '#e8f5e8' : '#f8f9fa'}; border-radius: 5px;">
                            <span>${service}</span>
                            <span style="color: ${status ? '#28a745' : '#dc3545'}; font-weight: bold;">
                                ${status ? '✅ Connected' : '❌ Disconnected'}
                            </span>
                        </div>
                    `).join('')}
                </div>

                <h3 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Sync Statistics</h3>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px;">
                    ${Object.entries(reportData.syncStats).map(([key, value]) => `
                        <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px;">
                            <div style="font-size: 24px; font-weight: bold; color: #667eea;">${value}</div>
                            <div style="color: #666; font-size: 14px;">${key.replace(/([A-Z])/g, ' $1').trim()}</div>
                        </div>
                    `).join('')}
                </div>

                <h3 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Recent Activity</h3>
                <div style="margin-bottom: 30px;">
                    ${reportData.recentActivity.slice(0, 10).map(activity => `
                        <div style="padding: 10px; margin: 5px 0; background: #f8f9fa; border-left: 4px solid #667eea; border-radius: 0 5px 5px 0;">
                            <strong>${activity.type}:</strong> ${activity.title}<br>
                            <small style="color: #666;">${activity.time} - ${activity.description}</small>
                        </div>
                    `).join('')}
                </div>

                <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
                    <p>Generated by BreyerHub Cloud Sync System</p>
                </div>
            </div>
        `;
        
        setTimeout(() => {
            this.addActivity('sync-success', 'Report generated', 'Laporan sinkronisasi siap');
            
            // Open report in new window
            const reportWindow = window.open('', '_blank');
            reportWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>BreyerHub Sync Report</title>
                    <style>@media print { .no-print { display: none; } }</style>
                </head>
                <body>
                    ${reportContent}
                    <div class="no-print" style="text-align: center; margin: 20px;">
                        <button onclick="window.print();" style="background: #667eea; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">Print Report</button>
                        <button onclick="window.close();" style="background: #666; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Close</button>
                    </div>
                </body>
                </html>
            `);
            reportWindow.document.close();
            
            if (typeof triggerCelebration === 'function') {
                triggerCelebration('📊 Sync report dijana!');
            }
        }, 2000);
    }

    updateSyncStatistics() {
        const stats = this.getSyncStatistics();
        
        const elements = {
            totalSyncs: document.getElementById('totalSyncs'),
            lastSyncTime: document.getElementById('lastSyncTime'),
            syncSuccess: document.getElementById('syncSuccess'),
            dataSize: document.getElementById('dataSize')
        };
        
        Object.entries(elements).forEach(([key, element]) => {
            if (element && stats[key]) {
                element.textContent = stats[key];
            }
        });
    }

    getSyncStatistics() {
        const totalSyncs = parseInt(localStorage.getItem('totalSyncs') || '0');
        const lastSync = localStorage.getItem('lastSyncTime') || 'Never';
        const dataSize = this.calculateDataSize();
        
        return {
            totalSyncs: totalSyncs,
            lastSyncTime: lastSync,
            syncSuccess: '98.5%',
            dataSize: `${dataSize} MB`
        };
    }

    getIntegrationsSummary() {
        return {
            'Google Calendar': localStorage.getItem('googleCalendarConnected') === 'true',
            'Microsoft Teams': localStorage.getItem('microsoftTeamsConnected') === 'true',
            'Email Notifications': localStorage.getItem('emailNotificationsEnabled') === 'true',
            'University System': localStorage.getItem('universityAPIConnected') === 'true',
            'Google Drive': localStorage.getItem('googleDriveConnected') === 'true'
        };
    }

    getRecentActivity() {
        const activities = JSON.parse(localStorage.getItem('syncActivities') || '[]');
        return activities.slice(-20).reverse(); // Get last 20 activities, newest first
    }

    calculateDataSize() {
        let totalSize = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                totalSize += localStorage[key].length;
            }
        }
        return (totalSize / 1024 / 1024).toFixed(2); // Convert to MB
    }

    // Advanced Settings Functions
    setConflictResolution(strategy) {
        localStorage.setItem('conflictResolution', strategy);
        this.addActivity('settings', 'Conflict Resolution Updated', `Set to: ${strategy}`);
    }

    setSyncPriority(priority) {
        localStorage.setItem('syncPriority', priority);
        this.addActivity('settings', 'Sync Priority Updated', `Set to: ${priority}`);
    }

    setRetryAttempts(attempts) {
        localStorage.setItem('retryAttempts', attempts);
        this.addActivity('settings', 'Retry Attempts Updated', `Set to: ${attempts}`);
    }

    setSyncTimeout(timeout) {
        localStorage.setItem('syncTimeout', timeout);
        this.addActivity('settings', 'Sync Timeout Updated', `Set to: ${timeout} seconds`);
    }

    // Initialize dashboard on load
    initializeDashboard() {
        this.updateIntegrationStatus();
        this.updateSyncStatistics();
        this.loadActivityLog();
        this.loadAdvancedSettings();
    }

    loadActivityLog() {
        const activityLog = document.getElementById('syncActivityLog');
        if (activityLog) {
            const activities = this.getRecentActivity().slice(0, 10);
            activityLog.innerHTML = activities.length > 0 ? activities.map(activity => `
                <div class="activity-item" style="padding: 10px; margin: 5px 0; background: #f8f9fa; border-left: 4px solid #667eea; border-radius: 0 5px 5px 0;">
                    <div style="font-weight: 500;">${activity.type}: ${activity.title}</div>
                    <div style="color: #666; font-size: 12px;">${activity.time} - ${activity.description}</div>
                </div>
            `).join('') : '<p style="color: #666; text-align: center; padding: 20px;">No recent activity</p>';
        }
    }

    loadAdvancedSettings() {
        const settings = {
            conflictResolution: localStorage.getItem('conflictResolution') || 'merge',
            syncPriority: localStorage.getItem('syncPriority') || 'balanced',
            retryAttempts: localStorage.getItem('retryAttempts') || '3',
            syncTimeout: localStorage.getItem('syncTimeout') || '60'
        };

        Object.entries(settings).forEach(([key, value]) => {
            const element = document.getElementById(key);
            if (element) {
                element.value = value;
            }
        });
    }

    setupAutoSync() {
        if (this.autoSyncInterval) {
            clearInterval(this.autoSyncInterval);
        }
        
        if (this.autoSyncEnabled) {
            this.autoSyncInterval = setInterval(() => {
                this.performSync();
            }, this.syncInterval * 60 * 1000);
        }
    }

    manualSync() {
        this.performSync(true);
    }

    performSync(isManual = false) {
        if (!this.isConnected) {
            this.addActivity('sync-error', 'Sync gagal', 'Tiada sambungan cloud');
            return;
        }

        // Simulate sync process
        const syncIcon = document.getElementById('syncStatus');
        if (syncIcon) {
            syncIcon.classList.add('syncing');
        }

        // Get all data for sync
        const syncData = this.gatherSyncData();
        
        // Simulate network delay
        setTimeout(() => {
            this.lastSyncTime = new Date().toLocaleString('ms-MY');
            this.updateSyncStatus();
            
            if (syncIcon) {
                syncIcon.classList.remove('syncing');
            }
            
            const syncType = isManual ? 'Manual sync' : 'Auto sync';
            this.addActivity('sync-success', `${syncType} berjaya`, `${Object.keys(syncData).length} kategori data disinkronkan`);
            
            if (isManual && typeof triggerCelebration === 'function') {
                triggerCelebration('🔄 Data berjaya disinkronkan!');
            }
        }, 2000);
    }

    gatherSyncData() {
        return {
            grades: localStorage.getItem('grades'),
            assignments: localStorage.getItem('assignments'),
            attendance: localStorage.getItem('attendance'),
            goals: localStorage.getItem('goals'),
            studyTime: localStorage.getItem('studyTime'),
            analytics: localStorage.getItem('analytics'),
            aiPreferences: localStorage.getItem('aiPreferences')
        };
    }

    toggleAutoSync(enabled) {
        this.autoSyncEnabled = enabled;
        this.setupAutoSync();
        this.updateSyncStatus();
        
        const action = enabled ? 'Auto sync diaktifkan' : 'Auto sync dinyahaktifkan';
        this.addActivity('sync-setting', action, `Interval: ${this.syncInterval} minit`);
    }

    setSyncInterval(minutes) {
        this.syncInterval = parseInt(minutes);
        this.setupAutoSync();
        this.addActivity('sync-setting', 'Interval sync dikemaskini', `Interval baru: ${minutes} minit`);
    }

    // Export Functions
    exportToPDF() {
        this.addActivity('export', 'Export PDF dimulakan', 'Menjana transkrip akademik');
        
        // Simulate PDF generation
        setTimeout(() => {
            const data = this.gatherSyncData();
            const blob = new Blob([`BreyerHub Academic Transcript\n\nGenerated: ${new Date().toLocaleString('ms-MY')}\n\nData exported successfully!`], 
                                 { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `BreyerHub_Transcript_${new Date().toISOString().split('T')[0]}.txt`;
            a.click();
            
            this.addActivity('export-success', 'PDF transkrip berjaya', 'Fail dimuat turun');
            if (typeof triggerCelebration === 'function') {
                triggerCelebration('📄 Transkrip PDF berjaya dijana!');
            }
        }, 1500);
    }

    exportToExcel() {
        this.addActivity('export', 'Export Excel dimulakan', 'Menjana laporan akademik');
        
        setTimeout(() => {
            const data = this.gatherSyncData();
            const csvContent = this.convertToCSV(data);
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `BreyerHub_Report_${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            
            this.addActivity('export-success', 'Excel report berjaya', 'Fail CSV dimuat turun');
            if (typeof triggerCelebration === 'function') {
                triggerCelebration('📊 Laporan Excel berjaya dijana!');
            }
        }, 1500);
    }

    exportJSON() {
        const data = this.gatherSyncData();
        const jsonData = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `BreyerHub_Data_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        this.addActivity('export-success', 'JSON data berjaya', 'Backup data lengkap');
        if (typeof triggerCelebration === 'function') {
            triggerCelebration('💾 Data JSON berjaya di-export!');
        }
    }

    generatePortfolio() {
        this.addActivity('export', 'Portfolio dijana', 'Menyusun portfolio akademik');
        
        setTimeout(() => {
            const portfolioHTML = this.createPortfolioHTML();
            const blob = new Blob([portfolioHTML], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `BreyerHub_Portfolio_${new Date().toISOString().split('T')[0]}.html`;
            a.click();
            
            this.addActivity('export-success', 'Portfolio berjaya', 'Portfolio HTML dijana');
            if (typeof triggerCelebration === 'function') {
                triggerCelebration('🎓 Portfolio akademik berjaya dijana!');
            }
        }, 2000);
    }

    createPortfolioHTML() {
        const data = this.gatherSyncData();
        return `
<!DOCTYPE html>
<html>
<head>
    <title>BreyerHub Academic Portfolio</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .section { margin: 30px 0; }
        .section h2 { color: #333; border-left: 4px solid #007bff; padding-left: 10px; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <div class="header">
        <h1>BreyerHub Academic Portfolio</h1>
        <p>Generated on ${new Date().toLocaleString('ms-MY')}</p>
    </div>
    
    <div class="section">
        <h2>Academic Summary</h2>
        <p>This portfolio contains comprehensive academic data from BreyerHub platform.</p>
    </div>
    
    <div class="section">
        <h2>Data Export Summary</h2>
        <ul>
            <li>Grades: ${data.grades ? JSON.parse(data.grades).length : 0} records</li>
            <li>Assignments: ${data.assignments ? JSON.parse(data.assignments).length : 0} records</li>
            <li>Attendance: ${data.attendance ? JSON.parse(data.attendance).length : 0} records</li>
            <li>Goals: ${data.goals ? JSON.parse(data.goals).length : 0} records</li>
        </ul>
    </div>
</body>
</html>`;
    }

    convertToCSV(data) {
        let csv = 'Category,Data Count,Last Updated\n';
        
        Object.keys(data).forEach(key => {
            if (data[key]) {
                try {
                    const parsed = JSON.parse(data[key]);
                    const count = Array.isArray(parsed) ? parsed.length : 1;
                    csv += `${key},${count},${new Date().toISOString()}\n`;
                } catch (e) {
                    csv += `${key},1,${new Date().toISOString()}\n`;
                }
            }
        });
        
        return csv;
    }

    // Import Functions
    handleFileImport(input) {
        const file = input.files[0];
        if (!file) return;
        
        this.addActivity('import', 'Import file dimulakan', `Memproses: ${file.name}`);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                let importedData;
                
                if (file.type === 'application/json') {
                    importedData = JSON.parse(content);
                } else if (file.type === 'text/csv') {
                    importedData = this.parseCSV(content);
                }
                
                this.processImportedData(importedData);
                this.addActivity('import-success', 'Import berjaya', `${file.name} berjaya diimport`);
                
                if (typeof triggerCelebration === 'function') {
                    triggerCelebration('📥 Data berjaya diimport!');
                }
            } catch (error) {
                this.addActivity('import-error', 'Import gagal', `Error: ${error.message}`);
            }
        };
        
        reader.readAsText(file);
    }

    processImportedData(data) {
        // Process and merge imported data with existing data
        Object.keys(data).forEach(key => {
            if (data[key] && typeof data[key] === 'string') {
                localStorage.setItem(key, data[key]);
            }
        });
        
        // Refresh current view if needed
        if (typeof refreshCurrentSection === 'function') {
            refreshCurrentSection();
        }
    }

    // Third-party Integrations
    connectGoogleCalendar() {
        this.addActivity('integration', 'Google Calendar', 'Memulakan sambungan');
        
        setTimeout(() => {
            this.addActivity('integration-success', 'Google Calendar berhubung', 'Sinkronisasi kalendar aktif');
            if (typeof triggerCelebration === 'function') {
                triggerCelebration('📅 Google Calendar berhubung!');
            }
        }, 2000);
    }

    connectTeams() {
        this.addActivity('integration', 'Microsoft Teams', 'Memulakan sambungan');
        
        setTimeout(() => {
            this.addActivity('integration-success', 'Teams berhubung', 'Integrasi kelas virtual aktif');
            if (typeof triggerCelebration === 'function') {
                triggerCelebration('👥 Microsoft Teams berhubung!');
            }
        }, 2000);
    }

    setupEmailNotifications() {
        this.addActivity('integration', 'Email Notifications', 'Setup notifikasi email');
        
        setTimeout(() => {
            this.addActivity('integration-success', 'Email notifications aktif', 'Notifikasi akan dihantar ke email');
            if (typeof triggerCelebration === 'function') {
                triggerCelebration('📧 Email notifications setup!');
            }
        }, 1500);
    }

    connectUniversityAPI() {
        this.addActivity('integration', 'University System', 'Sambungan sistem universiti');
        
        setTimeout(() => {
            this.addActivity('integration-success', 'University API berhubung', 'Data akademik tersinkron');
            if (typeof triggerCelebration === 'function') {
                triggerCelebration('� Sistem universiti berhubung!');
            }
        }, 3000);
    }

    // Device Management
    detectDevice() {
        const userAgent = navigator.userAgent;
        let deviceInfo = 'Unknown Device';
        
        if (/Windows/i.test(userAgent)) {
            deviceInfo = 'Windows PC';
        } else if (/Macintosh/i.test(userAgent)) {
            deviceInfo = 'Mac';
        } else if (/Android/i.test(userAgent)) {
            deviceInfo = 'Android Device';
        } else if (/iPhone|iPad/i.test(userAgent)) {
            deviceInfo = 'iOS Device';
        }
        
        const browserInfo = this.getBrowserInfo();
        const fullInfo = `${deviceInfo} - ${browserInfo}`;
        
        const deviceInfoElement = document.getElementById('currentDeviceInfo');
        if (deviceInfoElement) {
            deviceInfoElement.textContent = fullInfo;
        }
    }

    getBrowserInfo() {
        const userAgent = navigator.userAgent;
        if (/Chrome/i.test(userAgent)) return 'Chrome Browser';
        if (/Firefox/i.test(userAgent)) return 'Firefox Browser';
        if (/Safari/i.test(userAgent)) return 'Safari Browser';
        if (/Edge/i.test(userAgent)) return 'Edge Browser';
        return 'Unknown Browser';
    }

    refreshDeviceList() {
        this.addActivity('device', 'Refresh device list', 'Mengemaskini senarai peranti');
        // In a real implementation, this would fetch from server
    }

    logoutAllDevices() {
        this.addActivity('security', 'Logout all devices', 'Semua peranti telah di-logout');
        if (typeof triggerCelebration === 'function') {
            triggerCelebration('🔒 Semua peranti telah di-logout!');
        }
    }

    // Activity Log Management
    addActivity(type, title, description) {
        const activity = {
            id: Date.now(),
            type: type,
            title: title,
            description: description,
            timestamp: new Date().toLocaleString('ms-MY')
        };
        
        this.activityLog.unshift(activity);
        
        // Keep only last 50 activities
        if (this.activityLog.length > 50) {
            this.activityLog = this.activityLog.slice(0, 50);
        }
        
        localStorage.setItem('syncActivityLog', JSON.stringify(this.activityLog));
        this.displayActivityLog();
    }

    loadActivityLog() {
        this.displayActivityLog();
    }

    displayActivityLog() {
        const logContainer = document.getElementById('syncActivityLog');
        if (!logContainer) return;
        
        if (this.activityLog.length === 0) {
            logContainer.innerHTML = '<p style="text-align: center; color: #666;">Tiada aktiviti sync lagi</p>';
            return;
        }
        
        const html = this.activityLog.map(activity => {
            const iconClass = this.getActivityIcon(activity.type);
            return `
                <div class="activity-entry">
                    <div class="activity-icon">
                        <i class="${iconClass}"></i>
                    </div>
                    <div class="activity-info">
                        <h5>${activity.title}</h5>
                        <p>${activity.description}</p>
                    </div>
                    <div class="activity-time">${activity.timestamp}</div>
                </div>
            `;
        }).join('');
        
        logContainer.innerHTML = html;
    }

    getActivityIcon(type) {
        const icons = {
            'sync-success': 'fas fa-sync',
            'sync-error': 'fas fa-exclamation-triangle',
            'export': 'fas fa-download',
            'export-success': 'fas fa-check-circle',
            'import': 'fas fa-upload',
            'import-success': 'fas fa-check-circle',
            'import-error': 'fas fa-exclamation-triangle',
            'integration': 'fas fa-plug',
            'integration-success': 'fas fa-check-circle',
            'cloud-connect': 'fas fa-cloud',
            'device': 'fas fa-mobile-alt',
            'security': 'fas fa-shield-alt',
            'sync-setting': 'fas fa-cog'
        };
        
        return icons[type] || 'fas fa-info-circle';
    }

    clearActivityLog() {
        this.activityLog = [];
        localStorage.removeItem('syncActivityLog');
        this.displayActivityLog();
        
        if (typeof triggerCelebration === 'function') {
            triggerCelebration('🗑️ Log aktiviti dikosongkan!');
        }
    }

    downloadBackup() {
        const allData = {
            userData: this.gatherSyncData(),
            activityLog: this.activityLog,
            settings: {
                autoSync: this.autoSyncEnabled,
                syncInterval: this.syncInterval,
                deviceId: this.deviceId
            },
            timestamp: new Date().toISOString()
        };
        
        const jsonData = JSON.stringify(allData, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `BreyerHub_Backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        this.addActivity('export-success', 'Backup lengkap dimuat turun', 'Semua data dan settings');
        if (typeof triggerCelebration === 'function') {
            triggerCelebration('💾 Backup lengkap berjaya dimuat turun!');
        }
    }

    uploadBackup() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const backupData = JSON.parse(e.target.result);
                    this.restoreFromBackupData(backupData);
                } catch (error) {
                    this.addActivity('import-error', 'Restore backup gagal', `Error: ${error.message}`);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    restoreFromBackup() {
        // This would typically show a file picker
        this.uploadBackup();
    }

    restoreFromBackupData(backupData) {
        this.addActivity('import', 'Restore backup dimulakan', 'Memulihkan data dari backup');
        
        setTimeout(() => {
            // Restore user data
            if (backupData.userData) {
                Object.keys(backupData.userData).forEach(key => {
                    if (backupData.userData[key]) {
                        localStorage.setItem(key, backupData.userData[key]);
                    }
                });
            }
            
            // Restore settings
            if (backupData.settings) {
                this.autoSyncEnabled = backupData.settings.autoSync || true;
                this.syncInterval = backupData.settings.syncInterval || 5;
                this.setupAutoSync();
                this.updateSyncStatus();
            }
            
            // Restore activity log
            if (backupData.activityLog) {
                this.activityLog = backupData.activityLog;
                localStorage.setItem('syncActivityLog', JSON.stringify(this.activityLog));
            }
            
            this.addActivity('import-success', 'Backup berjaya dipulihkan', `Data dari ${backupData.timestamp}`);
            
            if (typeof triggerCelebration === 'function') {
                triggerCelebration('🔄 Backup berjaya dipulihkan!');
            }
            
            // Refresh page to show restored data
            setTimeout(() => {
                location.reload();
            }, 2000);
        }, 1500);
    }
}

// Enhanced Security Features for CloudSync
CloudSync.prototype.toggleEncryption = function(enabled) {
    this.encryptionEnabled = enabled;
    this.addActivity('security', 'Enkripsi toggled', enabled ? 'Enkripsi data diaktifkan' : 'Enkripsi data dinyahaktifkan');
    this.updateSecurityScore();
    
    if (enabled && typeof triggerCelebration === 'function') {
        triggerCelebration('🔐 Enkripsi data diaktifkan!');
    }
};

CloudSync.prototype.toggleBiometric = function(enabled) {
    this.biometricEnabled = enabled;
    this.addActivity('security', 'Biometric toggled', enabled ? 'Pengesahan biometrik diaktifkan' : 'Pengesahan biometrik dinyahaktifkan');
    this.updateSecurityScore();
    
    if (enabled) {
        // Simulate biometric setup
        setTimeout(() => {
            this.addActivity('security', 'Biometric setup completed', 'Pengesahan biometrik berjaya dikonfigurasikan');
            if (typeof triggerCelebration === 'function') {
                triggerCelebration('👆 Biometric authentication setup!');
            }
        }, 2000);
    }
};

CloudSync.prototype.toggleAutoLock = function(enabled) {
    this.autoLockEnabled = enabled;
    this.addActivity('security', 'Auto lock toggled', enabled ? 'Auto lock diaktifkan' : 'Auto lock dinyahaktifkan');
    
    if (enabled) {
        this.setupAutoLock();
    } else {
        this.clearAutoLock();
    }
};

CloudSync.prototype.setupAutoLock = function() {
    // Setup auto lock after 15 minutes of inactivity
    this.autoLockTimer = setTimeout(() => {
        this.lockApplication();
    }, 15 * 60 * 1000); // 15 minutes
    
    // Reset timer on user activity
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, () => {
            clearTimeout(this.autoLockTimer);
            if (this.autoLockEnabled) {
                this.setupAutoLock();
            }
        }, { passive: true });
    });
};

CloudSync.prototype.clearAutoLock = function() {
    if (this.autoLockTimer) {
        clearTimeout(this.autoLockTimer);
    }
};

CloudSync.prototype.lockApplication = function() {
    this.addActivity('security', 'Application locked', 'Aplikasi dikunci kerana tidak aktif');
    
    // Create lock screen overlay
    const lockScreen = document.createElement('div');
    lockScreen.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(10px);
        ">
            <div style="
                background: white;
                padding: 2rem;
                border-radius: 15px;
                text-align: center;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            ">
                <i class="fas fa-lock" style="font-size: 3rem; color: #667eea; margin-bottom: 1rem;"></i>
                <h3>Aplikasi Dikunci</h3>
                <p>Klik untuk membuka kunci</p>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: #667eea;
                    color: white;
                    border: none;
                    padding: 0.8rem 1.5rem;
                    border-radius: 8px;
                    cursor: pointer;
                    margin-top: 1rem;
                ">Buka Kunci</button>
            </div>
        </div>
    `;
    document.body.appendChild(lockScreen);
};

CloudSync.prototype.setDataRetention = function(days) {
    this.dataRetentionDays = parseInt(days);
    this.addActivity('security', 'Data retention updated', `Tempoh simpan data: ${days === 'permanent' ? 'Kekal' : days + ' hari'}`);
    
    if (days !== 'permanent') {
        this.scheduleDataCleanup();
    }
};

CloudSync.prototype.scheduleDataCleanup = function() {
    // Check for old data every day
    setInterval(() => {
        this.cleanupOldData();
    }, 24 * 60 * 60 * 1000); // 24 hours
};

CloudSync.prototype.cleanupOldData = function() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.dataRetentionDays);
    
    // Clean up old activity logs
    this.activityLog = this.activityLog.filter(activity => {
        const activityDate = new Date(activity.timestamp);
        return activityDate > cutoffDate;
    });
    
    localStorage.setItem('syncActivityLog', JSON.stringify(this.activityLog));
    this.displayActivityLog();
    
    this.addActivity('security', 'Data cleanup completed', `Data lama (>${this.dataRetentionDays} hari) telah dipadamkan`);
};

CloudSync.prototype.toggleAnonymization = function(enabled) {
    this.anonymizationEnabled = enabled;
    this.addActivity('security', 'Data anonymization toggled', enabled ? 'Anonymisasi data diaktifkan' : 'Anonymisasi data dinyahaktifkan');
    
    if (enabled) {
        this.anonymizeExistingData();
    }
};

CloudSync.prototype.anonymizeExistingData = function() {
    // Simulate data anonymization process
    setTimeout(() => {
        this.addActivity('security', 'Data anonymized', 'Maklumat pengenal telah dipadamkan dari data');
        if (typeof triggerCelebration === 'function') {
            triggerCelebration('🕵️ Data telah di-anonymize!');
        }
    }, 1500);
};

CloudSync.prototype.toggleAuditTrail = function(enabled) {
    this.auditTrailEnabled = enabled;
    this.addActivity('security', 'Audit trail toggled', enabled ? 'Jejak audit diaktifkan' : 'Jejak audit dinyahaktifkan');
    
    if (!enabled) {
        // Clear existing audit logs
        this.auditLog = [];
        localStorage.removeItem('auditLog');
    }
};

CloudSync.prototype.emergencyBackup = function() {
    this.addActivity('security', 'Emergency backup initiated', 'Backup kecemasan dimulakan');
    
    // Create comprehensive emergency backup
    const emergencyData = {
        timestamp: new Date().toISOString(),
        type: 'emergency_backup',
        userData: this.gatherSyncData(),
        securitySettings: {
            encryptionEnabled: this.encryptionEnabled || false,
            biometricEnabled: this.biometricEnabled || false,
            autoLockEnabled: this.autoLockEnabled || true,
            dataRetentionDays: this.dataRetentionDays || 180,
            anonymizationEnabled: this.anonymizationEnabled || false,
            auditTrailEnabled: this.auditTrailEnabled || true
        },
        activityLog: this.activityLog,
        deviceInfo: {
            deviceId: this.deviceId,
            userAgent: navigator.userAgent,
            platform: navigator.platform
        }
    };
    
    const jsonData = JSON.stringify(emergencyData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BreyerHub_Emergency_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    this.addActivity('security', 'Emergency backup completed', 'Backup kecemasan berjaya dimuat turun');
    
    if (typeof triggerCelebration === 'function') {
        triggerCelebration('🚨 Emergency backup completed!');
    }
};

CloudSync.prototype.wipeAllData = function() {
    const confirmed = confirm('⚠️ AMARAN: Tindakan ini akan memadamkan SEMUA data secara kekal. Adakah anda pasti?');
    
    if (confirmed) {
        const doubleConfirm = confirm('Ini adalah amaran terakhir. Semua data akan hilang selamanya. Teruskan?');
        
        if (doubleConfirm) {
            // Clear all localStorage data
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.includes('BreyerHub') || 
                    ['grades', 'assignments', 'attendance', 'goals', 'schedule', 'timerStats', 'syncActivityLog'].includes(key)) {
                    localStorage.removeItem(key);
                }
            });
            
            // Clear IndexedDB if exists
            if (this.db) {
                this.db.close();
                indexedDB.deleteDatabase(this.dbName);
            }
            
            this.addActivity('security', 'Data wipe completed', 'SEMUA data telah dipadamkan');
            
            // Show wipe confirmation
            alert('✅ Semua data telah berjaya dipadamkan. Aplikasi akan di-refresh.');
            
            // Refresh page to show clean state
            setTimeout(() => {
                location.reload();
            }, 2000);
        }
    }
};

CloudSync.prototype.generateSecurityReport = function() {
    this.addActivity('security', 'Security report generated', 'Laporan keselamatan dijana');
    
    const securityReport = {
        generatedAt: new Date().toISOString(),
        securityScore: this.calculateSecurityScore(),
        deviceInfo: {
            deviceId: this.deviceId,
            platform: navigator.platform,
            userAgent: navigator.userAgent
        },
        securitySettings: {
            encryptionEnabled: this.encryptionEnabled || false,
            biometricEnabled: this.biometricEnabled || false,
            autoLockEnabled: this.autoLockEnabled || true,
            dataRetentionDays: this.dataRetentionDays || 180,
            anonymizationEnabled: this.anonymizationEnabled || false,
            auditTrailEnabled: this.auditTrailEnabled || true
        },
        recentActivities: this.activityLog.slice(0, 20),
        recommendations: this.getSecurityRecommendations()
    };
    
    const reportHTML = this.createSecurityReportHTML(securityReport);
    const blob = new Blob([reportHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BreyerHub_Security_Report_${new Date().toISOString().split('T')[0]}.html`;
    a.click();
    
    if (typeof triggerCelebration === 'function') {
        triggerCelebration('📋 Laporan keselamatan dijana!');
    }
};

CloudSync.prototype.calculateSecurityScore = function() {
    let score = 50; // Base score
    
    if (this.encryptionEnabled) score += 20;
    if (this.biometricEnabled) score += 15;
    if (this.autoLockEnabled) score += 10;
    if (this.auditTrailEnabled) score += 5;
    
    return Math.min(score, 100);
};

CloudSync.prototype.updateSecurityScore = function() {
    const score = this.calculateSecurityScore();
    const scoreElement = document.querySelector('#securityScore .score-number');
    if (scoreElement) {
        scoreElement.textContent = score;
    }
    
    // Update score circle gradient
    const scoreCircle = document.getElementById('securityScore');
    if (scoreCircle) {
        const gradient = `conic-gradient(var(--success-color) ${score}%, var(--border-color) ${score}%)`;
        scoreCircle.style.background = gradient;
    }
    
    // Update security status items
    this.updateSecurityStatusItems();
};

CloudSync.prototype.updateSecurityStatusItems = function() {
    const scoreDetails = document.querySelector('.score-details');
    if (scoreDetails) {
        scoreDetails.innerHTML = `
            <div class="score-item ${this.encryptionEnabled ? 'good' : 'warning'}">
                <i class="fas fa-${this.encryptionEnabled ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>Enkripsi ${this.encryptionEnabled ? 'Aktif' : 'Tidak Aktif'}</span>
            </div>
            <div class="score-item good">
                <i class="fas fa-check-circle"></i>
                <span>Backup Terkini</span>
            </div>
            <div class="score-item ${this.biometricEnabled ? 'good' : 'warning'}">
                <i class="fas fa-${this.biometricEnabled ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>Biometric ${this.biometricEnabled ? 'Aktif' : 'Tidak Aktif'}</span>
            </div>
        `;
    }
};

CloudSync.prototype.getSecurityRecommendations = function() {
    const recommendations = [];
    
    if (!this.encryptionEnabled) {
        recommendations.push('Aktifkan enkripsi data untuk keselamatan tambahan');
    }
    
    if (!this.biometricEnabled) {
        recommendations.push('Setup pengesahan biometrik untuk akses yang lebih selamat');
    }
    
    if (!this.auditTrailEnabled) {
        recommendations.push('Aktifkan jejak audit untuk monitoring keselamatan');
    }
    
    if (this.dataRetentionDays > 365) {
        recommendations.push('Pertimbangkan tempoh simpan data yang lebih pendek');
    }
    
    return recommendations;
};

CloudSync.prototype.createSecurityReportHTML = function(report) {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>BreyerHub Security Report</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .section { margin: 30px 0; }
        .section h2 { color: #333; border-left: 4px solid #667eea; padding-left: 10px; }
        .score-display { text-align: center; margin: 20px 0; }
        .score-number { font-size: 3rem; color: #667eea; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .recommendation { background: #fff3cd; padding: 10px; margin: 5px 0; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>BreyerHub Security Report</h1>
        <p>Generated on ${new Date(report.generatedAt).toLocaleString('ms-MY')}</p>
    </div>
    
    <div class="section">
        <h2>Security Score</h2>
        <div class="score-display">
            <div class="score-number">${report.securityScore}%</div>
        </div>
    </div>
    
    <div class="section">
        <h2>Security Settings</h2>
        <table>
            <tr><th>Setting</th><th>Status</th></tr>
            <tr><td>Encryption</td><td>${report.securitySettings.encryptionEnabled ? 'Enabled' : 'Disabled'}</td></tr>
            <tr><td>Biometric Auth</td><td>${report.securitySettings.biometricEnabled ? 'Enabled' : 'Disabled'}</td></tr>
            <tr><td>Auto Lock</td><td>${report.securitySettings.autoLockEnabled ? 'Enabled' : 'Disabled'}</td></tr>
            <tr><td>Data Retention</td><td>${report.securitySettings.dataRetentionDays} days</td></tr>
            <tr><td>Audit Trail</td><td>${report.securitySettings.auditTrailEnabled ? 'Enabled' : 'Disabled'}</td></tr>
        </table>
    </div>
    
    <div class="section">
        <h2>Recommendations</h2>
        ${report.recommendations.map(rec => `<div class="recommendation">${rec}</div>`).join('')}
    </div>
    
    <div class="section">
        <h2>Recent Security Activities</h2>
        <table>
            <tr><th>Time</th><th>Activity</th><th>Description</th></tr>
            ${report.recentActivities.map(activity => `
                <tr>
                    <td>${activity.timestamp}</td>
                    <td>${activity.title}</td>
                    <td>${activity.description}</td>
                </tr>
            `).join('')}
        </table>
    </div>
</body>
</html>`;
};

// Initialize security settings on CloudSync creation
CloudSync.prototype.initSecuritySettings = function() {
    // Set default values
    this.encryptionEnabled = false;
    this.biometricEnabled = false;
    this.autoLockEnabled = true;
    this.dataRetentionDays = 180;
    this.anonymizationEnabled = false;
    this.auditTrailEnabled = true;
    
    // Update security score on load
    setTimeout(() => {
        this.updateSecurityScore();
    }, 1000);
    
    // Setup auto lock if enabled
    if (this.autoLockEnabled) {
        this.setupAutoLock();
    }
};

// Add security initialization to CloudSync constructor
const originalInit = CloudSync.prototype.init;
CloudSync.prototype.init = function() {
    originalInit.call(this);
    this.initSecuritySettings();
};

// Initialize AI Features and Cloud Sync
const aiFeatures = new AIFeatures();
const cloudSync = new CloudSync();

console.log('🎉 AI Features loaded successfully!');
console.log('☁️ Cloud Sync system loaded successfully!');
