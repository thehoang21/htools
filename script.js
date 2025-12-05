// 1. Sidebar Toggle (Mobile) - Optimized
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('mobileOverlay');

function toggleMobileSidebar() {
    const isClosed = sidebar.classList.contains('-translate-x-full');
    if (isClosed) {
        // Mở sidebar
        overlay.classList.remove('hidden');
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                sidebar.classList.remove('-translate-x-full');
                overlay.classList.remove('opacity-0');
            });
        });
    } else {
        // Đóng sidebar
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('opacity-0');
        setTimeout(() => {
            overlay.classList.add('hidden');
        }, 300);
    }
}

// 2. Sidebar Collapse (Desktop)
function toggleSidebarCollapse() {
    const isCollapsed = sidebar.classList.contains('sidebar-collapsed');
    const icon = document.getElementById('collapseIcon');

    if (isCollapsed) {
        // Expand
        sidebar.classList.remove('w-20', 'sidebar-collapsed');
        sidebar.classList.add('w-64');
        icon.innerText = 'chevron_left';
    } else {
        // Collapse
        sidebar.classList.remove('w-64');
        sidebar.classList.add('w-20', 'sidebar-collapsed');
        icon.innerText = 'chevron_right';
    }
}

// 3. Tab Switching
function switchTab(tabName) {
    // Update Navigation UI
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.remove('active');
    });
    document.getElementById('nav-' + tabName).classList.add('active');

    // Show Content
    document.querySelectorAll('.tab-content').forEach(el => {
        el.classList.add('hidden');
    });
    const activeContent = document.getElementById('tab-' + tabName);
    activeContent.classList.remove('hidden');

    // Trigger simple animation
    activeContent.classList.remove('opacity-0');
    activeContent.classList.add('animate-fade-in');

    // Update Header Title
    const titles = {
        'calculator': 'Tính Công',
        'grammar': 'Kiểm Tra Ngữ Pháp',
        'salary': 'Tính Lương Tháng'
    };
    document.getElementById('pageTitle').innerText = titles[tabName];

    // Close mobile sidebar if open
    if (window.innerWidth < 1024) {
        toggleMobileSidebar();
    }
}


// --- EXISTING CALCULATION LOGIC ---
const STORAGE_KEY = 'tinhcong_settings_v5';

function loadSettings() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        const settings = JSON.parse(saved);
        document.querySelectorAll('.save-target').forEach(input => {
            if (settings[input.id] !== undefined) {
                input.value = settings[input.id];
            }
        });
    }
}

function saveSettings() {
    const settings = {};
    document.querySelectorAll('.save-target').forEach(input => {
        settings[input.id] = input.value;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function resetData() {
    if (navigator.vibrate) navigator.vibrate(20);
    if (confirm('Bạn có chắc muốn đặt lại dữ liệu?')) {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
    }
}

function timeToMins(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

function fmt(num, decimals = 2) {
    return num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: decimals });
}

function calculate() {
    saveSettings();

    const start = timeToMins(document.getElementById('startTime').value);
    const end = timeToMins(document.getElementById('endTime').value);
    const breakStart = timeToMins(document.getElementById('breakStart').value);
    const breakEnd = timeToMins(document.getElementById('breakEnd').value);
    const otThreshold = timeToMins(document.getElementById('otThreshold').value);

    const otCoeff = parseFloat(document.getElementById('otCoeff').value);
    const workDays = parseFloat(document.getElementById('workDays').value);
    const standardWorkDayHours = 8;

    let breakDuration = 0;
    if (breakEnd > breakStart) breakDuration = breakEnd - breakStart;

    let totalPresentMins = end - start;
    let actualWorkMins = totalPresentMins - breakDuration;

    let normalMins = 0;
    let otRawMins = 0;

    if (end > otThreshold) {
        otRawMins = end - otThreshold;
        normalMins = actualWorkMins - otRawMins;
    } else {
        otRawMins = 0;
        normalMins = actualWorkMins;
    }

    const otConvertedMins = otRawMins * otCoeff;
    const totalConvertedMins = normalMins + otConvertedMins;

    const dailyHours = totalConvertedMins / 60;
    const dailyCong = dailyHours / standardWorkDayHours;

    const monthTotalMins = totalConvertedMins * workDays;
    const monthTotalHours = monthTotalMins / 60;
    const monthTotalCong = monthTotalHours / standardWorkDayHours;

    // UI Updates
    document.getElementById('displayDays').innerText = workDays;
    document.getElementById('dailyNormalMins').innerText = normalMins + ' phút';
    document.getElementById('dailyOtRawMins').innerText = otRawMins + ' phút';
    document.getElementById('dailyTotalConvertedMins').innerText = fmt(totalConvertedMins) + ' phút';
    document.getElementById('dailyCong').innerText = fmt(dailyCong, 4);

    document.getElementById('monthlyMins').innerText = fmt(monthTotalMins);
    document.getElementById('monthlyHours').innerText = fmt(monthTotalHours, 2);
    document.getElementById('monthlyCong').innerText = fmt(monthTotalCong, 4);
    document.getElementById('monthlyCongRounded').innerText = Math.floor(monthTotalCong) + ' công';

    // Report Generation
    const report = `BẢNG TÍNH CÔNG CHI TIẾT
==============================
1. CẤU HÌNH
• Ca làm việc: ${document.getElementById('startTime').value} → ${document.getElementById('endTime').value}
• Nghỉ trưa:   ${document.getElementById('breakStart').value} → ${document.getElementById('breakEnd').value}
• Tính OT từ:  ${document.getElementById('otThreshold').value} (Hệ số ${otCoeff})
• Số ngày làm: ${workDays} ngày

2. KẾT QUẢ 1 NGÀY
• Giờ làm thường: ${normalMins} phút (${(normalMins / 60).toFixed(2)}h)
• Giờ OT thực tế: ${otRawMins} phút (${(otRawMins / 60).toFixed(2)}h)
• Quy đổi công:   ${normalMins} + (${otRawMins} × ${otCoeff}) = ${fmt(totalConvertedMins)} phút
=> Số công/ngày:  ${fmt(dailyCong, 4)} công

3. TỔNG KẾT THÁNG (${workDays} ngày)
• Tổng thời gian: ${fmt(monthTotalHours, 2)} giờ
• Tổng số công:   ${fmt(monthTotalCong, 4)} công
• Làm tròn xuống: ${Math.floor(monthTotalCong)} công
==============================`;
    document.getElementById('reportText').value = report;
}

function copyReport() {
    const copyText = document.getElementById("reportText");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
    
    showNotification({
        type: 'success',
        title: 'Sao chép thành công',
        message: 'Báo cáo tính công đã được sao chép vào clipboard.',
        buttons: [{ text: 'OK', style: 'success' }]
    });
    
    if (navigator.vibrate) navigator.vibrate(50);

    const btn = document.querySelector('button[onclick="copyReport()"]');
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<span class="material-symbols-outlined text-[16px] mr-1.5">check</span> Đã sao chép';
    
    // Remove original classes and add success classes
    btn.classList.remove('bg-slate-900', 'hover:bg-slate-800');
    btn.classList.add('bg-green-600', 'hover:bg-green-700');

    setTimeout(() => {
        btn.innerHTML = originalContent;
        btn.classList.remove('bg-green-600', 'hover:bg-green-700');
        btn.classList.add('bg-slate-900', 'hover:bg-slate-800');
    }, 2000);
}

// Init
loadSettings();
calculate();

// ===== IPAD DETECTION & OPTIMIZATIONS =====
function isIPad() {
    return (navigator.userAgent.match(/iPad/i) || 
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
}

function getIPadOrientation() {
    return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
}

if (isIPad()) {
    document.body.classList.add('is-ipad');
    document.body.classList.add(`ipad-${getIPadOrientation()}`);
    
    // Update orientation class on rotate
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            document.body.classList.remove('ipad-portrait', 'ipad-landscape');
            document.body.classList.add(`ipad-${getIPadOrientation()}`);
            
            // Adjust sidebar on orientation change
            const isLandscape = getIPadOrientation() === 'landscape';
            if (isLandscape && window.innerWidth >= 1024) {
                // Auto-expand sidebar in landscape
                if (sidebar.classList.contains('sidebar-collapsed')) {
                    toggleSidebarCollapse();
                }
            }
        }, 100);
    });
    
    // Prevent double-tap zoom on iPad
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, { passive: false });
}

// Auto-adjust sidebar on window resize (iPad rotation, split view)
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const width = window.innerWidth;
        
        // iPad Portrait or Split View: collapse sidebar
        if (isIPad() && width >= 768 && width < 1024) {
            if (!sidebar.classList.contains('sidebar-collapsed')) {
                sidebar.classList.add('sidebar-collapsed', 'w-20');
                sidebar.classList.remove('w-64');
            }
        }
        
        // iPad Landscape: expand sidebar
        if (isIPad() && width >= 1024) {
            if (sidebar.classList.contains('sidebar-collapsed')) {
                sidebar.classList.remove('sidebar-collapsed', 'w-20');
                sidebar.classList.add('w-64');
            }
        }
    }, 150);
});

// --- GRAMMAR CHECKER LOGIC (COMPLETE IMPLEMENTATION) ---
let currentMatches = [];
let originalText = ''; // Lưu văn bản gốc
let correctedText = ''; // Lưu văn bản đã sửa
const grammarInput = document.getElementById('grammarInput');
const grammarOutput = document.getElementById('grammarOutput');
const grammarLoading = document.getElementById('grammarLoading');
const grammarTooltip = document.getElementById('grammarTooltip');
const fixAllBtn = document.getElementById('fixAllBtn');
const copyOutputBtn = document.getElementById('copyOutputBtn');
const errorCountEl = document.getElementById('errorCount');
const errorBadge = document.getElementById('errorBadge');

// Debounced updateStats for better performance
let statsTimeout;
function updateStats() {
    clearTimeout(statsTimeout);
    statsTimeout = setTimeout(() => {
        const text = grammarInput.value;
        const charCount = text.length;
        document.getElementById('charCount').innerText = charCount.toLocaleString();
    }, 100);
}

function clearGrammar() {
    grammarInput.value = '';
    originalText = '';
    correctedText = '';
    grammarOutput.innerHTML = `<div class="flex flex-col items-center justify-center h-full text-center py-20">
        <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-5">
            <span class="material-symbols-outlined text-slate-400 text-[40px]">search</span>
        </div>
        <span class="text-slate-400 text-sm font-medium mb-1">Kết quả sẽ hiển thị tại đây</span>
        <span class="text-slate-300 text-xs">Nhấn "Kiểm tra ngay" để bắt đầu</span>
    </div>`;
    currentMatches = [];
    fixAllBtn.classList.add('hidden');
    copyOutputBtn.classList.add('hidden');
    errorBadge.classList.add('hidden');
    grammarTooltip.classList.add('hidden');
    document.getElementById('totalErrors').innerText = '0';
    updateStats();
}

async function pasteFromClipboard() {
    try {
        const text = await navigator.clipboard.readText();
        grammarInput.value = text;
        updateStats();
        if (navigator.vibrate) navigator.vibrate(20);
        showNotification({
            type: 'success',
            title: 'Dán thành công',
            message: 'Văn bản đã được dán từ clipboard.',
            buttons: [{ text: 'OK', style: 'success' }]
        });
    } catch (err) {
        showNotification({
            type: 'error',
            title: 'Lỗi clipboard',
            message: 'Không thể truy cập clipboard. Vui lòng dán thủ công (Ctrl+V).',
            buttons: [{ text: 'Đã hiểu', style: 'danger' }]
        });
    }
}

async function checkGrammar() {
    const text = grammarInput.value.trim();
    if (!text) {
        showNotification({
            type: 'warning',
            title: 'Thiếu văn bản',
            message: 'Vui lòng nhập văn bản tiếng Anh cần kiểm tra.',
            buttons: [{ text: 'Đã hiểu', style: 'primary', onClick: () => { closeNotification(); grammarInput.focus(); } }]
        });
        return;
    }

    if (text.length > 20000) {
        showNotification({
            type: 'warning',
            title: 'Văn bản quá dài',
            message: 'Vui lòng giới hạn dưới 20,000 ký tự.',
            buttons: [{ text: 'OK', style: 'primary' }]
        });
        return;
    }

    // Lưu văn bản gốc
    originalText = text;
    correctedText = text;

    grammarLoading.classList.remove('hidden');
    fixAllBtn.classList.add('hidden');
    copyOutputBtn.classList.add('hidden');
    errorBadge.classList.add('hidden');
    grammarTooltip.classList.add('hidden');
    
    try {
        const response = await fetch('https://api.languagetool.org/v2/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                text: text,
                language: 'en-US',
                enabledOnly: false,
                level: 'picky', // Chế độ kiểm tra kỹ lưỡng
                enabledCategories: 'TYPOS,GRAMMAR,PUNCTUATION,CASING,STYLE,SEMANTICS,CONFUSED_WORDS' // Tất cả loại lỗi
            })
        });

        if (!response.ok) throw new Error('API request failed');

        const data = await response.json();
        currentMatches = data.matches;
        renderHighlights(correctedText, currentMatches);
        
        if (navigator.vibrate) navigator.vibrate(50);
    } catch (error) {
        grammarOutput.innerHTML = `<div class="flex flex-col items-center justify-center h-full text-center py-20">
            <div class="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-5">
                <span class="material-symbols-outlined text-red-500 text-[40px]">error</span>
            </div>
            <span class="text-red-600 text-sm font-semibold mb-2">Lỗi kết nối</span>
            <span class="text-slate-500 text-xs">Không thể kết nối đến server. Vui lòng thử lại.</span>
        </div>`;
        console.error(error);
    } finally {
        grammarLoading.classList.add('hidden');
    }
}

function renderHighlights(text, matches) {
    const errorCount = matches.length;
    document.getElementById('totalErrors').innerText = errorCount;

    if (matches.length === 0) {
        grammarOutput.innerHTML = `<div class="flex flex-col items-center justify-center h-full text-center py-20">
            <div class="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-5 animate-bounce">
                <span class="material-symbols-outlined text-green-600 text-[56px]">check_circle</span>
            </div>
            <span class="text-green-700 text-lg font-bold mb-2">Xuất sắc!</span>
            <span class="text-slate-600 text-sm">Không tìm thấy lỗi ngữ pháp nào.</span>
        </div>`;
        copyOutputBtn.classList.add('hidden');
        errorBadge.classList.add('hidden');
        return;
    }

    fixAllBtn.classList.remove('hidden');
    copyOutputBtn.classList.remove('hidden');
    errorBadge.classList.remove('hidden');
    errorCountEl.innerText = matches.length;

    let html = '';
    let lastIndex = 0;

    matches.sort((a, b) => a.offset - b.offset);

    matches.forEach((match, index) => {
        html += escapeHtml(text.slice(lastIndex, match.offset));
        
        const errorText = escapeHtml(text.slice(match.offset, match.offset + match.length));
        const replacements = JSON.stringify(match.replacements.slice(0, 5).map(r => r.value));
        const message = escapeHtml(match.message || 'Lỗi ngữ pháp');
        
        html += `<span class="error-highlight" onclick="showTooltip(event, ${index})" data-replacements='${replacements}' data-message='${message}' title="${message}">${errorText}</span>`;
        
        lastIndex = match.offset + match.length;
    });

    html += escapeHtml(text.slice(lastIndex));
    grammarOutput.innerHTML = html;
}

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

function showTooltip(event, matchIndex) {
    event.stopPropagation();
    const target = event.currentTarget;
    const replacements = JSON.parse(target.dataset.replacements);
    const message = target.dataset.message;
    
    document.getElementById('tooltipMessage').innerText = message;
    
    const listEl = document.getElementById('suggestionList');
    listEl.innerHTML = '';

    if (replacements.length === 0) {
        listEl.innerHTML = '<div class="text-xs text-slate-500 italic p-3 text-center bg-slate-50 rounded-lg border border-slate-200">Không có gợi ý thay thế</div>';
    } else {
        replacements.forEach((rep, idx) => {
            const btn = document.createElement('button');
            btn.className = 'text-left px-3.5 py-2.5 text-sm hover:bg-indigo-50 text-slate-700 rounded-lg transition-all font-medium border border-transparent hover:border-indigo-200 flex items-center gap-2 group';
            btn.innerHTML = `
                <span class="material-symbols-outlined text-indigo-600 text-[16px] group-hover:scale-110 transition-transform">check_small</span>
                <span>${escapeHtml(rep)}</span>
            `;
            btn.onclick = () => applyFix(matchIndex, rep);
            listEl.appendChild(btn);
        });
    }

    const rect = target.getBoundingClientRect();
    let left = rect.left + window.scrollX;
    let top = rect.bottom + window.scrollY + 10;

    const tooltipWidth = 320;
    const tooltipHeight = 280;

    if (left + tooltipWidth > window.innerWidth) {
        left = window.innerWidth - tooltipWidth - 20;
    }
    
    if (top + tooltipHeight > window.innerHeight + window.scrollY) {
        top = rect.top + window.scrollY - tooltipHeight - 10;
    }

    grammarTooltip.style.left = `${Math.max(10, left)}px`;
    grammarTooltip.style.top = `${top}px`;
    grammarTooltip.classList.remove('hidden');
}

function hideTooltip() {
    grammarTooltip.classList.add('hidden');
}

async function recheckCorrectedText() {
    grammarLoading.classList.remove('hidden');
    grammarTooltip.classList.add('hidden');
    
    try {
        const response = await fetch('https://api.languagetool.org/v2/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                text: correctedText,
                language: 'en-US',
                enabledOnly: false,
                level: 'picky', // Chế độ kiểm tra kỹ lưỡng
                enabledCategories: 'TYPOS,GRAMMAR,PUNCTUATION,CASING,STYLE,SEMANTICS,CONFUSED_WORDS' // Tất cả loại lỗi
            })
        });

        if (!response.ok) throw new Error('API request failed');

        const data = await response.json();
        currentMatches = data.matches;
        renderHighlights(correctedText, currentMatches);
        
        if (navigator.vibrate) navigator.vibrate(50);
    } catch (error) {
        console.error(error);
        showNotification({
            type: 'error',
            title: 'Lỗi kiểm tra',
            message: 'Không thể kiểm tra lại văn bản. Vui lòng thử lại.',
            buttons: [{ text: 'OK', style: 'danger' }]
        });
    } finally {
        grammarLoading.classList.add('hidden');
    }
}

function applyFix(matchIndex, replacement) {
    const match = currentMatches[matchIndex];
    if (!match) return;

    // Áp dụng sửa lỗi vào correctedText, KHÔNG thay đổi grammarInput
    const pre = correctedText.slice(0, match.offset);
    const post = correctedText.slice(match.offset + match.length);
    
    correctedText = pre + replacement + post;

    grammarTooltip.classList.add('hidden');
    
    if (navigator.vibrate) navigator.vibrate(30);
    
    // Kiểm tra lại văn bản đã sửa
    recheckCorrectedText();
}

function fixAllErrors() {
    if (currentMatches.length === 0) return;

    showNotification({
        type: 'confirm',
        title: 'Xác nhận sửa lỗi',
        message: `Bạn có chắc muốn tự động sửa tất cả ${currentMatches.length} lỗi không?`,
        buttons: [
            { text: 'Hủy', style: 'secondary', onClick: closeNotification },
            { 
                text: 'Sửa tất cả', 
                style: 'primary', 
                onClick: () => {
                    closeNotification();
                    
                    let text = correctedText;
                    const fixableMatches = currentMatches.filter(m => m.replacements && m.replacements.length > 0);
                    
                    fixableMatches.sort((a, b) => b.offset - a.offset);

                    fixableMatches.forEach(match => {
                        const replacement = match.replacements[0].value;
                        const pre = text.slice(0, match.offset);
                        const post = text.slice(match.offset + match.length);
                        text = pre + replacement + post;
                    });

                    correctedText = text;
                    
                    if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
                    
                    // Kiểm tra lại văn bản đã sửa
                    recheckCorrectedText();
                    
                    showNotification({
                        type: 'success',
                        title: 'Hoàn thành',
                        message: `Đã sửa ${fixableMatches.length} lỗi thành công!`,
                        buttons: [{ text: 'OK', style: 'success' }]
                    });
                }
            }
        ]
    });
}

function copyOutput() {
    // Copy văn bản đã sửa (correctedText), không phải HTML
    const outputText = correctedText || grammarOutput.innerText;
    navigator.clipboard.writeText(outputText).then(() => {
        showNotification({
            type: 'success',
            title: 'Sao chép thành công',
            message: 'Văn bản đã được sao chép vào clipboard.',
            buttons: [{ text: 'OK', style: 'success' }]
        });
        
        const btn = copyOutputBtn;
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<span class="material-symbols-outlined text-[16px]">check</span><span class="hidden sm:inline ml-1.5">Đã copy</span>';
        btn.classList.add('!bg-green-50', '!text-green-700', '!border-green-300');
        
        if (navigator.vibrate) navigator.vibrate(30);
        
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.classList.remove('!bg-green-50', '!text-green-700', '!border-green-300');
        }, 2000);
    }).catch(err => {
        showNotification({
            type: 'error',
            title: 'Lỗi sao chép',
            message: 'Không thể sao chép. Vui lòng chọn và copy thủ công.',
            buttons: [{ text: 'OK', style: 'danger' }]
        });
    });
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.error-highlight') && !e.target.closest('.grammar-tooltip')) {
        grammarTooltip.classList.add('hidden');
    }
});

// Initialize grammar stats on page load
if (grammarInput) {
    updateStats();
}

// ===== NOTIFICATION MODAL SYSTEM =====
function showNotification(options) {
    const modal = document.getElementById('notificationModal');
    const backdrop = document.getElementById('notificationBackdrop');
    const panel = document.getElementById('notificationPanel');
    const iconEl = document.getElementById('notificationIcon');
    const titleEl = document.getElementById('notificationTitle');
    const messageEl = document.getElementById('notificationMessage');
    const buttonsEl = document.getElementById('notificationButtons');
    
    // Set type (success, error, warning, info, confirm)
    const type = options.type || 'info';
    const title = options.title || 'Thông báo';
    const message = options.message || '';
    const buttons = options.buttons || [{ text: 'OK', style: 'primary', onClick: closeNotification }];
    
    // Configure icon and colors
    const config = {
        success: {
            icon: 'check_circle',
            iconClass: 'text-green-600',
            bgClass: 'bg-green-50',
            ringClass: 'ring-green-50/50'
        },
        error: {
            icon: 'error',
            iconClass: 'text-red-600',
            bgClass: 'bg-red-50',
            ringClass: 'ring-red-50/50'
        },
        warning: {
            icon: 'warning',
            iconClass: 'text-amber-600',
            bgClass: 'bg-amber-50',
            ringClass: 'ring-amber-50/50'
        },
        info: {
            icon: 'info',
            iconClass: 'text-blue-600',
            bgClass: 'bg-blue-50',
            ringClass: 'ring-blue-50/50'
        },
        confirm: {
            icon: 'help',
            iconClass: 'text-indigo-600',
            bgClass: 'bg-indigo-50',
            ringClass: 'ring-indigo-50/50'
        }
    };
    
    const cfg = config[type];
    
    // Update icon
    iconEl.className = `w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ${cfg.bgClass} ${cfg.ringClass}`;
    iconEl.querySelector('span').className = `material-symbols-outlined text-[32px] ${cfg.iconClass}`;
    iconEl.querySelector('span').textContent = cfg.icon;
    
    // Update content
    titleEl.textContent = title;
    messageEl.textContent = message;
    
    // Create buttons
    buttonsEl.innerHTML = '';
    buttons.forEach(btn => {
        const button = document.createElement('button');
        const buttonStyles = {
            primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200',
            success: 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200',
            danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200',
            secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700'
        };
        
        button.className = `flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all active:scale-95 ${buttonStyles[btn.style] || buttonStyles.secondary}`;
        button.textContent = btn.text;
        button.onclick = () => {
            if (btn.onClick) btn.onClick();
            else closeNotification();
        };
        buttonsEl.appendChild(button);
    });
    
    // Show modal
    modal.classList.remove('hidden');
    setTimeout(() => {
        backdrop.classList.remove('opacity-0');
        panel.classList.remove('scale-95', 'opacity-0');
        panel.classList.add('scale-100', 'opacity-100', 'modal-animate-in');
    }, 10);
    
    if (navigator.vibrate) navigator.vibrate(30);
}

function closeNotification() {
    const modal = document.getElementById('notificationModal');
    const backdrop = document.getElementById('notificationBackdrop');
    const panel = document.getElementById('notificationPanel');
    
    backdrop.classList.add('opacity-0');
    panel.classList.remove('scale-100', 'opacity-100', 'modal-animate-in');
    panel.classList.add('scale-95', 'opacity-0');
    
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 200);
}

// Keyboard support for modal
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('notificationModal');
    if (!modal.classList.contains('hidden') && e.key === 'Escape') {
        closeNotification();
    }
});

// Reset Modal Functions (for Calculator tab)
function showResetModal() {
    const modal = document.getElementById('resetModal');
    const backdrop = document.getElementById('resetModalBackdrop');
    const panel = document.getElementById('resetModalPanel');
    
    modal.classList.remove('hidden');
    setTimeout(() => {
        backdrop.classList.remove('opacity-0');
        panel.classList.remove('scale-95', 'opacity-0');
        panel.classList.add('scale-100', 'opacity-100');
    }, 10);
}

function closeResetModal() {
    const modal = document.getElementById('resetModal');
    const backdrop = document.getElementById('resetModalBackdrop');
    const panel = document.getElementById('resetModalPanel');
    
    backdrop.classList.add('opacity-0');
    panel.classList.remove('scale-100', 'opacity-100');
    panel.classList.add('scale-95', 'opacity-0');
    
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 200);
}

function confirmReset() {
    if (navigator.vibrate) navigator.vibrate(50);
    localStorage.removeItem(STORAGE_KEY);
    closeResetModal();
    setTimeout(() => {
        location.reload();
    }, 300);
}

// --- SCROLL TO TOP FUNCTIONALITY (Mobile Only) - Optimized ---
const scrollToTopBtn = document.getElementById('scrollToTopBtn');
const mainContent = document.getElementById('mainContent');

if (mainContent && scrollToTopBtn) {
    let scrollTimeout;
    let ticking = false;
    
    // Throttle scroll event with requestAnimationFrame
    mainContent.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollTop = mainContent.scrollTop;
                
                if (scrollTop > 200) {
                    scrollToTopBtn.style.transform = 'translateY(0) scale(1)';
                    scrollToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
                    scrollToTopBtn.classList.add('opacity-100');
                } else {
                    scrollToTopBtn.style.transform = 'translateY(20px) scale(0.8)';
                    scrollToTopBtn.classList.add('opacity-0', 'pointer-events-none');
                    scrollToTopBtn.classList.remove('opacity-100');
                }
                
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

function scrollToTop() {
    if (!mainContent) return;
    
    const start = mainContent.scrollTop;
    const duration = 400;
    const startTime = performance.now();
    
    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = easeInOutCubic(progress);
        
        mainContent.scrollTop = start * (1 - easeProgress);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
    if (navigator.vibrate) navigator.vibrate(20);
}