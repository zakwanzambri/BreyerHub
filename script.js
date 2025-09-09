// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

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

// Add some sample data for demonstration (can be removed in production)
document.addEventListener('DOMContentLoaded', function() {
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
