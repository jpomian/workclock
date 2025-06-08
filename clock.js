document.addEventListener('DOMContentLoaded', () => {
    const hourMarks = document.getElementById('hour-marks');
    for (let i = 0; i < 12; i++) {
        const angle = (i * 30) * Math.PI / 180;
        const mark = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        mark.setAttribute('x1', 150 + Math.sin(angle) * 120);
        mark.setAttribute('y1', 150 - Math.cos(angle) * 120);
        mark.setAttribute('x2', 150 + Math.sin(angle) * 130);
        mark.setAttribute('y2', 150 - Math.cos(angle) * 130);
        hourMarks.appendChild(mark);
    }

    function updateClock() {
        const now = new Date();
        const hours = now.getHours() % 12;
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        const secondAngle = seconds * 6;
        const minuteAngle = minutes * 6 + seconds * 0.1;
        const hourAngle = hours * 30 + minutes * 0.5;

        document.getElementById('hour-hand').setAttribute('transform', `rotate(${hourAngle}, 150, 150)`);
        document.getElementById('minute-hand').setAttribute('transform', `rotate(${minuteAngle}, 150, 150)`);
        document.getElementById('second-hand').setAttribute('transform', `rotate(${secondAngle}, 150, 150)`);
    }

    const startBtn = document.getElementById('start-btn');
    const countdownDisplay = document.getElementById('countdown');
    let countdownTime = 7 * 3600 + 58 * 60; // 7 hours 58 minutes in seconds

    function formatTime(seconds) {
        const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${hrs}:${mins}:${secs}`;
    }

    function startCountdown() {
        startBtn.disabled = true;
        startBtn.classList.add('hidden');
        countdownDisplay.classList.remove('hidden');

        const timer = setInterval(() => {
            countdownTime--;
            countdownDisplay.textContent = formatTime(countdownTime);

            if (countdownTime <= 0) {
                clearInterval(timer);
                startBtn.disabled = false;
                startBtn.classList.remove('hidden');
                countdownDisplay.classList.add('hidden');
                countdownTime = 7 * 3600 + 58 * 60;
            }
        }, 1000);
    }

    startBtn.addEventListener('click', startCountdown);


    function updateTimer() {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        document.getElementById('clock').textContent = timeString;
    }

    updateTimer();
    setInterval(updateTimer, 1000);


    updateClock();
    setInterval(updateClock, 1000);

    const sidebarIcon = document.getElementById('sidebar-icon');
    const sidebar = document.getElementById('sidebar');
    const historyBody = document.getElementById('history-body');
    const breakHistory = [];

    sidebarIcon.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    document.getElementById('short-break').addEventListener('click', () => {
        addBreakEntry('short');
    });

    document.getElementById('long-break').addEventListener('click', () => {
        addBreakEntry('long');
    });

    function addBreakEntry(type) {
        const now = new Date();
        const entry = {
            time: now.toLocaleTimeString(),
            short: type === 'short' ? 'X' : '',
            long: type === 'long' ? 'X' : ''
        };

        breakHistory.push(entry);
        updateHistoryTable();
    }

    function updateHistoryTable() {
        historyBody.innerHTML = breakHistory.map(entry => `
            <tr>
                <td>${entry.time}</td>
                <td>${entry.short}</td>
                <td>${entry.long}</td>
            </tr>
        `).join('');
    }

    // Export
    document.getElementById('export-btn').addEventListener('click', () => {
        const content = [
            'Time\tShort Break\tLong Break',
            ...breakHistory.map(entry =>
                `${entry.time}\t${entry.short}\t${entry.long}`
            )
        ].join('\n');

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'przerwy.txt';
        a.click();
        URL.revokeObjectURL(url);
    });

    let clickCount = 0;
    let clickTimer;

    document.querySelector('.center-dot').addEventListener('click', () => {
        clickCount++;
        if (clickCount === 3) {
            showTerminal();
            clickCount = 0;
            clearTimeout(clickTimer);
        } else {
            clearTimeout(clickTimer);
            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 1000);
        }
    });

    document.getElementById('close-terminal').addEventListener('click', () => {
        document.getElementById('terminal-container').classList.add('hidden');
    });

    function showTerminal() {
        const terminal = document.getElementById('terminal-container');
        terminal.classList.remove('hidden');
        document.getElementById('wetty-terminal').src = '/wetty';
    }
});