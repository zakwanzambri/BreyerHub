// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section, .main-section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all nav links and sections
            navLinks.forEach(nav => nav.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked nav link
            this.classList.add('active');
            
            // Show corresponding section
            const targetSection = document.getElementById(this.dataset.section);
            if (targetSection) {
                targetSection.classList.add('active');
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
        } else {
            console.log('PWA: Notification permission denied');
        }
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
