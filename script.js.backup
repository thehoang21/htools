// --- MODAL LOGIC ---
const resetModal = document.getElementById('resetModal');
const resetModalBackdrop = document.getElementById('resetModalBackdrop');
const resetModalPanel = document.getElementById('resetModalPanel');

function showResetModal() {
    resetModal.classList.remove('hidden');
    setTimeout(() => {
        resetModalBackdrop.classList.remove('opacity-0');
        resetModalPanel.classList.remove('scale-95', 'opacity-0');
        resetModalPanel.classList.add('scale-100', 'opacity-100');
    }, 10);
    if (navigator.vibrate) navigator.vibrate(20);
}

function closeResetModal() {
    resetModalBackdrop.classList.add('opacity-0');
    resetModalPanel.classList.remove('scale-100', 'opacity-100');
    resetModalPanel.classList.add('scale-95', 'opacity-0');
    setTimeout(() => { resetModal.classList.add('hidden'); }, 200);
}

function confirmReset() {
    localStorage.removeItem(STORAGE_KEY);
    
    // Reset inputs to default values
    document.getElementById('startTime').value = "07:30";
    document.getElementById('endTime').value = "18:00";
    document.getElementById('breakStart').value = "11:30";
    document.getElementById('breakEnd').value = "13:00";
    document.getElementById('otThreshold').value = "17:00";
    document.getElementById('otCoeff').value = "1.5";
    document.getElementById('workDays').value = "27";

    // Recalculate and update UI
    calculate();

    // Close modal
    closeResetModal();
}

// --- SCROLL TO TOP BUTTON ---
const scrollToTopBtn = document.getElementById('scrollToTopBtn');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
});

function scrollToTop() {
    // Smooth scroll với easing tốt hơn
    const duration = 600; // 600ms
    const start = window.pageYOffset;
    const startTime = performance.now();
    
    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }
    
    function scroll(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = easeInOutCubic(progress);
        
        window.scrollTo(0, start * (1 - easeProgress));
        
        if (progress < 1) {
            requestAnimationFrame(scroll);
        }
    }
    
    requestAnimationFrame(scroll);
}

// --- SIDEBAR & TABS LOGIC ---
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('mobileOverlay');
const collapseIcon = document.getElementById('collapseIcon');

function toggleMobileSidebar() {
    const isClosed = sidebar.classList.contains('-translate-x-full');
    if (isClosed) {
        sidebar.classList.remove('-translate-x-full');
        overlay.classList.remove('hidden');
    } else {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
    }
}

function toggleSidebarCollapse() {
    const isCollapsed = sidebar.classList.contains('w-20');
    if (!isCollapsed) {
        sidebar.classList.remove('w-64');
        sidebar.classList.add('w-20', 'sidebar-collapsed');
        collapseIcon.innerText = 'chevron_right';
    } else {
        sidebar.classList.remove('w-20', 'sidebar-collapsed');
        sidebar.classList.add('w-64');
        collapseIcon.innerText = 'chevron_left';
    }
}

function toggleSubmenu(id) {
    const submenu = document.getElementById(id);
    const arrow = document.getElementById('arrow-' + id);
    
    if (submenu && submenu.classList.contains('hidden')) {
        submenu.classList.remove('hidden');
        if (arrow) arrow.style.transform = 'rotate(180deg)';
    } else if (submenu) {
        submenu.classList.add('hidden');
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    }
}

function switchTab(tabName) {
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const navItem = document.getElementById('nav-' + tabName);
    if (navItem) {
        navItem.classList.add('active');
        
        // Auto expand parent submenu
        const parentSubmenu = navItem.closest('[id^="submenu-"]');
        if (parentSubmenu) {
            const submenu = parentSubmenu;
            const arrow = document.getElementById('arrow-' + submenu.id);
            
            if (submenu.classList.contains('hidden')) {
                submenu.classList.remove('hidden');
                if (arrow) arrow.style.transform = 'rotate(180deg)';
            }
        }
    }

    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    const activeContent = document.getElementById('tab-' + tabName);
    activeContent.classList.remove('hidden');
    activeContent.classList.remove('opacity-0');
    activeContent.classList.add('animate-fade-in');

    const titles = {
        'home': 'Trang chủ',
        'time': 'Thời gian',
        'calculator': 'Tính Công',
        'salary': 'Tính Lương Tháng',
        'tax': 'Tính Thuế TNCN',
        'compound': 'Tính Lãi Suất Kép',
        'sorting': 'Biểu Diễn Thuật Toán',
        'typing': 'Kiểm Tra Tốc Độ Gõ',
        'countries': 'Thông Tin Quốc Gia',
        'physics': 'Mô Phỏng Vật Lý',
        'solar': 'Khám Phá Hệ Mặt Trời',
        'bmi': 'Công cụ tính BMI/BMR',
        'json': 'JSON Formatter',
        'css': 'Trình Tạo CSS',
        'regex': 'Regex Tester',
        'markdown': 'Markdown Previewer'
    };
    document.getElementById('pageTitle').innerText = titles[tabName];

    if (tabName === 'bmi') {
        calculateBMI();
    }

    if (tabName === 'time') {
        initTime();
    } else if (tabName === 'sorting') {
        initSorting();
    } else if (tabName === 'typing') {
        initTypingTest();
    } else if (tabName === 'countries') {
        initCountries();
    } else if (tabName === 'physics') {
        initPhysics();
    } else if (tabName === 'solar') {
        initSolarSystem();
    }

    if (window.innerWidth < 1024) {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
    }
}

// --- CALCULATION LOGIC ---
const STORAGE_KEY = 'tinhcong_settings_v9';

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

function timeToMins(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

function fmt(num, decimals = 2) {
    return num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: decimals });
}

function fmtVND(n) {
    return Math.round(n).toLocaleString('en-US');
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

    document.getElementById('displayDays').innerText = workDays;
    document.getElementById('dailyNormalMins').innerText = normalMins + ' phút';
    document.getElementById('dailyOtRawMins').innerText = otRawMins + ' phút';
    document.getElementById('dailyTotalConvertedMins').innerText = fmt(totalConvertedMins) + ' phút';
    document.getElementById('dailyCong').innerText = fmt(dailyCong, 4);
    document.getElementById('monthlyMins').innerText = fmt(monthTotalMins);
    document.getElementById('monthlyHours').innerText = fmt(monthTotalHours, 2);
    document.getElementById('monthlyCong').innerText = fmt(monthTotalCong, 4);
    document.getElementById('monthlyCongRounded').innerText = Math.floor(monthTotalCong) + ' công';

    const report = `BẢNG TÍNH CÔNG CHI TIẾT
==============================
1. CẤU HÌNH
• Ca làm việc: ${document.getElementById('startTime').value} → ${document.getElementById('endTime').value}
• Nghỉ trưa:   ${document.getElementById('breakStart').value} → ${document.getElementById('breakEnd').value}
• Tính OT từ:  ${document.getElementById('otThreshold').value} (Hệ số ${otCoeff})
• Số ngày làm: ${workDays} ngày

2. KẾT QUẢ 1 NGÀY
• Giờ làm thường: ${normalMins} phút (${(normalMins/60).toFixed(2)}h)
• Giờ OT thực tế: ${otRawMins} phút (${(otRawMins/60).toFixed(2)}h)
• Quy đổi công:   ${normalMins} + (${otRawMins} × ${otCoeff}) = ${fmt(totalConvertedMins)} phút
=> Số công/ngày:  ${fmt(dailyCong, 4)} công

3. TỔNG KẾT THÁNG (${workDays} ngày)
• Tổng thời gian: ${fmt(monthTotalHours, 2)} giờ
• Tổng số công:   ${fmt(monthTotalCong, 4)} công
• Làm tròn xuống: ${Math.floor(monthTotalCong)} công
==============================`;
    document.getElementById('reportText').value = report;
}

function exportToWord() {
    const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, Header } = docx;

    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const breakStart = document.getElementById('breakStart').value;
    const breakEnd = document.getElementById('breakEnd').value;
    const otThreshold = document.getElementById('otThreshold').value;
    const otCoeff = document.getElementById('otCoeff').value;
    const workDays = document.getElementById('workDays').value;
    
    const start = timeToMins(startTime);
    const end = timeToMins(endTime);
    const breakStartMins = timeToMins(breakStart);
    const breakEndMins = timeToMins(breakEnd);
    const otThresholdMins = timeToMins(otThreshold);
    const otCoeffVal = parseFloat(otCoeff);
    const workDaysVal = parseFloat(workDays);
    
    let breakDuration = 0;
    if (breakEndMins > breakStartMins) breakDuration = breakEndMins - breakStartMins;
    let totalPresentMins = end - start;
    let actualWorkMins = totalPresentMins - breakDuration;
    let normalMins = 0;
    let otRawMins = 0;
    if (end > otThresholdMins) {
        otRawMins = end - otThresholdMins;
        normalMins = actualWorkMins - otRawMins; 
    } else {
        otRawMins = 0;
        normalMins = actualWorkMins;
    }
    const otConvertedMins = otRawMins * otCoeffVal;
    const totalConvertedMins = normalMins + otConvertedMins;
    const dailyHours = totalConvertedMins / 60;
    const dailyCong = dailyHours / 8;
    const monthTotalMins = totalConvertedMins * workDaysVal;
    const monthTotalHours = monthTotalMins / 60;
    const monthTotalCong = monthTotalHours / 8;

    const doc = new Document({
        sections: [{
            properties: {},
            headers: {
                default: new Header({
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: "HTools",
                                    color: "E2E8F0",
                                    size: 60,
                                    bold: true,
                                }),
                            ],
                            alignment: AlignmentType.RIGHT,
                        }),
                    ],
                }),
            },
            children: [
                new Paragraph({
                    text: "BẢNG TÍNH CÔNG CHI TIẾT",
                    heading: HeadingLevel.HEADING_1,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 300 }
                }),
                
                new Paragraph({
                    text: "1. CẤU HÌNH",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 100 }
                }),
                new Paragraph({ text: `• Ca làm việc: ${startTime} → ${endTime}`, bullet: { level: 0 } }),
                new Paragraph({ text: `• Nghỉ trưa: ${breakStart} → ${breakEnd}`, bullet: { level: 0 } }),
                new Paragraph({ text: `• Tính OT từ: ${otThreshold} (Hệ số ${otCoeff})`, bullet: { level: 0 } }),
                new Paragraph({ text: `• Số ngày làm: ${workDays} ngày`, bullet: { level: 0 } }),

                new Paragraph({
                    text: "2. KẾT QUẢ 1 NGÀY",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 100 }
                }),
                new Paragraph({ text: `• Giờ làm thường: ${normalMins} phút (${(normalMins/60).toFixed(2)}h)`, bullet: { level: 0 } }),
                new Paragraph({ text: `• Giờ OT thực tế: ${otRawMins} phút (${(otRawMins/60).toFixed(2)}h)`, bullet: { level: 0 } }),
                new Paragraph({ text: `• Quy đổi công: ${normalMins} + (${otRawMins} × ${otCoeff}) = ${fmt(totalConvertedMins)} phút`, bullet: { level: 0 } }),
                new Paragraph({ 
                    children: [
                        new TextRun({ text: "=> Số công/ngày: ", bold: true }),
                        new TextRun({ text: `${fmt(dailyCong, 4)} công`, bold: true, color: "2563EB" })
                    ],
                    bullet: { level: 0 } 
                }),

                new Paragraph({
                    text: `3. TỔNG KẾT THÁNG (${workDays} ngày)`,
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 100 }
                }),
                new Paragraph({ text: `• Tổng thời gian: ${fmt(monthTotalHours, 2)} giờ`, bullet: { level: 0 } }),
                new Paragraph({ text: `• Tổng số công: ${fmt(monthTotalCong, 4)} công`, bullet: { level: 0 } }),
                new Paragraph({ 
                    children: [
                        new TextRun({ text: "• Làm tròn xuống: ", bold: true }),
                        new TextRun({ text: `${Math.floor(monthTotalCong)} công`, bold: true, color: "16A34A" })
                    ],
                    bullet: { level: 0 } 
                }),
                
                new Paragraph({
                    text: `Xuất lúc: ${new Date().toLocaleString('vi-VN')}`,
                    alignment: AlignmentType.RIGHT,
                    spacing: { before: 400 }
                })
            ],
        }]
    });

    Packer.toBlob(doc).then(blob => {
        saveAs(blob, "Bang_Tinh_Cong_HTools.docx");
    });
}

function copyReport() {
    const copyText = document.getElementById("reportText");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
    if (navigator.vibrate) navigator.vibrate(50);
    const btn = document.querySelector('button[onclick="copyReport()"]');
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<span class="material-symbols-outlined text-[16px] mr-1.5">check</span> Đã sao chép';
    btn.classList.add('bg-green-600', 'hover:bg-green-700', 'text-white', 'border-transparent');
    setTimeout(() => {
        btn.innerHTML = originalContent;
        btn.classList.remove('bg-green-600', 'hover:bg-green-700', 'border-transparent');
    }, 2000);
}

// --- SALARY CALCULATION LOGIC ---
function formatCurrencyInput(input) {
    let value = input.value.replace(/\D/g, '');
    if (value === '') {
        input.value = '';
        return;
    }
    input.value = parseInt(value).toLocaleString('en-US');
}

function parseCurrency(valueStr) {
    if (!valueStr) return 0;
    return parseInt(valueStr.replace(/,/g, '')) || 0;
}

function resetSalaryForm() {
    document.getElementById('salaryGross').value = '0';
    document.getElementById('salaryInsurance').value = '';
    document.getElementById('actualWorkDays').value = '26';
    document.getElementById('paidLeaveDays').value = '0';
    document.getElementById('dependents').value = '0';
    document.getElementById('allowance').value = '0';
    document.getElementById('otherDeductions').value = '0';
    calculateSalary();
}

function calculateSalary() {
    saveSettings();
    
    const salaryGross = parseCurrency(document.getElementById('salaryGross').value);
    const salaryInsuranceInput = parseCurrency(document.getElementById('salaryInsurance').value);
    const salaryInsurance = salaryInsuranceInput > 0 ? salaryInsuranceInput : salaryGross;
    
    const actualWorkDays = parseFloat(document.getElementById('actualWorkDays').value) || 0;
    const paidLeaveDays = parseFloat(document.getElementById('paidLeaveDays').value) || 0;
    const dependents = parseInt(document.getElementById('dependents').value) || 0;
    const allowance = parseCurrency(document.getElementById('allowance').value);
    const otherDeductions = parseCurrency(document.getElementById('otherDeductions').value);

    const totalDays = actualWorkDays + paidLeaveDays;
    let totalSalaryFromDays = 0;

    if (totalDays === 0) {
        totalSalaryFromDays = 0;
    } else if (totalDays < 22) {
        totalSalaryFromDays = (salaryGross / 22) * totalDays;
    } else if (totalDays <= 26) {
        totalSalaryFromDays = salaryGross;
    } else {
        totalSalaryFromDays = (salaryGross / 26) * totalDays;
    }

    const salaryByWork = totalDays > 0 ? (totalSalaryFromDays * actualWorkDays / totalDays) : 0;
    const salaryByLeave = (salaryInsurance / 26) * paidLeaveDays;
    const grossTotal = salaryByWork + salaryByLeave + allowance;

    const BASE_SALARY = 2340000;
    const REGION_MIN_WAGE = 4960000;
    const MAX_BHXH_BASE = 20 * BASE_SALARY;
    const MAX_BHTN_BASE = 20 * REGION_MIN_WAGE;

    const bhxhBase = Math.min(salaryInsurance, MAX_BHXH_BASE);
    const bhtnBase = Math.min(salaryInsurance, MAX_BHTN_BASE);

    const bhxh = bhxhBase * 0.08;
    const bhyt = bhxhBase * 0.015;
    const bhtn = bhtnBase * 0.01;
    
    const totalInsurance = bhxh + bhyt + bhtn;

    const PERSONAL_DEDUCTION = 11000000;
    const DEPENDENT_DEDUCTION = 4400000;
    
    const totalDeductionsForTax = totalInsurance + PERSONAL_DEDUCTION + (dependents * DEPENDENT_DEDUCTION);
    const taxableIncome = Math.max(0, grossTotal - totalDeductionsForTax);
    
    let pit = 0;
    if (taxableIncome > 0) {
        if (taxableIncome <= 5000000) pit = taxableIncome * 0.05;
        else if (taxableIncome <= 10000000) pit = (taxableIncome * 0.1) - 250000;
        else if (taxableIncome <= 18000000) pit = (taxableIncome * 0.15) - 750000;
        else if (taxableIncome <= 32000000) pit = (taxableIncome * 0.2) - 1650000;
        else if (taxableIncome <= 52000000) pit = (taxableIncome * 0.25) - 3250000;
        else if (taxableIncome <= 80000000) pit = (taxableIncome * 0.3) - 5850000;
        else pit = (taxableIncome * 0.35) - 9850000;
    }

    const netSalary = grossTotal - totalInsurance - otherDeductions - pit;

    const fmtCurrency = (n) => Math.round(n).toLocaleString('en-US') + ' ₫';
    
    document.getElementById('outSalaryWork').innerText = fmtCurrency(salaryByWork);
    document.getElementById('outWorkDays').innerText = `(${actualWorkDays} ngày)`;
    
    document.getElementById('outSalaryLeave').innerText = fmtCurrency(salaryByLeave);
    document.getElementById('outLeaveDays').innerText = `(${paidLeaveDays} ngày)`;
    
    document.getElementById('outAllowance').innerText = '+' + fmtCurrency(allowance);
    
    document.getElementById('outGrossTotal').innerText = fmtCurrency(grossTotal);
    
    document.getElementById('outBHXH').innerText = '-' + fmtCurrency(bhxh);
    document.getElementById('outBHYT').innerText = '-' + fmtCurrency(bhyt);
    document.getElementById('outBHTN').innerText = '-' + fmtCurrency(bhtn);
    document.getElementById('outOtherDeductions').innerText = '-' + fmtCurrency(otherDeductions);
    
    const displayTotalDeductions = totalInsurance + otherDeductions;
    document.getElementById('outTotalDeductions').innerText = '-' + fmtCurrency(displayTotalDeductions);
    
    document.getElementById('outNetSalary').innerText = fmtCurrency(netSalary);
    document.getElementById('outPIT').innerText = fmtCurrency(pit);
}

function exportSalaryReport() {
    const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, Header } = docx;

    const salaryGross = parseCurrency(document.getElementById('salaryGross').value);
    const salaryInsuranceInput = parseCurrency(document.getElementById('salaryInsurance').value);
    const salaryInsurance = salaryInsuranceInput > 0 ? salaryInsuranceInput : salaryGross;

    const actualWorkDays = parseFloat(document.getElementById('actualWorkDays').value) || 0;
    const paidLeaveDays = parseFloat(document.getElementById('paidLeaveDays').value) || 0;
    const dependents = parseInt(document.getElementById('dependents').value) || 0;
    const allowance = parseCurrency(document.getElementById('allowance').value);
    const otherDeductions = parseCurrency(document.getElementById('otherDeductions').value);

    const totalDays = actualWorkDays + paidLeaveDays;
    let totalSalaryFromDays = 0;
    if (totalDays === 0) totalSalaryFromDays = 0;
    else if (totalDays < 22) totalSalaryFromDays = (salaryGross / 22) * totalDays;
    else if (totalDays <= 26) totalSalaryFromDays = salaryGross;
    else totalSalaryFromDays = (salaryGross / 26) * totalDays;

    const salaryByWork = totalDays > 0 ? (totalSalaryFromDays * actualWorkDays / totalDays) : 0;
    const salaryByLeave = (salaryInsurance / 26) * paidLeaveDays;
    const grossTotal = salaryByWork + salaryByLeave + allowance;

    const BASE_SALARY = 2340000;
    const REGION_MIN_WAGE = 4960000;
    const MAX_BHXH_BASE = 20 * BASE_SALARY;
    const MAX_BHTN_BASE = 20 * REGION_MIN_WAGE;
    const bhxhBase = Math.min(salaryInsurance, MAX_BHXH_BASE);
    const bhtnBase = Math.min(salaryInsurance, MAX_BHTN_BASE);
    const bhxh = bhxhBase * 0.08;
    const bhyt = bhxhBase * 0.015;
    const bhtn = bhtnBase * 0.01;
    const totalInsurance = bhxh + bhyt + bhtn;

    const PERSONAL_DEDUCTION = 11000000;
    const DEPENDENT_DEDUCTION = 4400000;
    const totalDeductionsForTax = totalInsurance + PERSONAL_DEDUCTION + (dependents * DEPENDENT_DEDUCTION);
    const taxableIncome = Math.max(0, grossTotal - totalDeductionsForTax);

    let pit = 0;
    if (taxableIncome > 0) {
        if (taxableIncome <= 5000000) pit = taxableIncome * 0.05;
        else if (taxableIncome <= 10000000) pit = (taxableIncome * 0.1) - 250000;
        else if (taxableIncome <= 18000000) pit = (taxableIncome * 0.15) - 750000;
        else if (taxableIncome <= 32000000) pit = (taxableIncome * 0.2) - 1650000;
        else if (taxableIncome <= 52000000) pit = (taxableIncome * 0.25) - 3250000;
        else if (taxableIncome <= 80000000) pit = (taxableIncome * 0.3) - 5850000;
        else pit = (taxableIncome * 0.35) - 9850000;
    }

    const netSalary = grossTotal - totalInsurance - otherDeductions - pit;
    const fmtVND = (n) => Math.round(n).toLocaleString('en-US') + ' VND';

    const doc = new Document({
        sections: [{
            properties: {
                page: {
                    margin: { top: 720, right: 720, bottom: 720, left: 720 },
                },
            },
            headers: {
                default: new Header({
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: "HTools",
                                    color: "E2E8F0",
                                    size: 80,
                                    bold: true,
                                }),
                            ],
                            alignment: AlignmentType.RIGHT,
                        }),
                    ],
                }),
            },
            children: [
                new Paragraph({
                    text: "PHIẾU LƯƠNG CHI TIẾT",
                    heading: HeadingLevel.HEADING_1,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 300 },
                }),
                new Paragraph({
                    text: `Tháng: ${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 500 },
                }),
                new Paragraph({
                    text: "A. TỔNG THU NHẬP (GROSS)",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 100 },
                }),
                new Paragraph({ text: `1. Lương theo ngày công (${actualWorkDays} ngày): ${fmtVND(salaryByWork)}`, bullet: { level: 0 } }),
                new Paragraph({ text: `2. Lương ngày nghỉ (${paidLeaveDays} ngày): ${fmtVND(salaryByLeave)}`, bullet: { level: 0 } }),
                new Paragraph({ text: `3. Phụ cấp & Thưởng: ${fmtVND(allowance)}`, bullet: { level: 0 } }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "=> Tổng Gross: ", bold: true }),
                        new TextRun({ text: fmtVND(grossTotal), bold: true })
                    ],
                    bullet: { level: 0 } 
                }),

                new Paragraph({
                    text: "B. CÁC KHOẢN KHẤU TRỪ",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 100 }
                }),
                new Paragraph({ text: `1. Bảo hiểm xã hội (8%): ${fmtVND(bhxh)}`, bullet: { level: 0 } }),
                new Paragraph({ text: `2. Bảo hiểm y tế (1.5%): ${fmtVND(bhyt)}`, bullet: { level: 0 } }),
                new Paragraph({ text: `3. Bảo hiểm thất nghiệp (1%): ${fmtVND(bhtn)}`, bullet: { level: 0 } }),
                new Paragraph({ text: `4. Khấu trừ khác: ${fmtVND(otherDeductions)}`, bullet: { level: 0 } }),
                new Paragraph({ text: `5. Thuế TNCN: ${fmtVND(pit)}`, bullet: { level: 0 } }),
                new Paragraph({ 
                    children: [
                        new TextRun({ text: "=> Tổng khấu trừ: ", bold: true }),
                        new TextRun({ text: fmtVND(totalInsurance + otherDeductions + pit), bold: true, color: "DC2626" })
                    ],
                    bullet: { level: 0 } 
                }),

                new Paragraph({
                    text: "C. LƯƠNG THỰC NHẬN (NET)",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 400, after: 100 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: fmtVND(netSalary),
                            bold: true,
                            size: 48,
                            color: "16A34A"
                        })
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 }
                }),

                new Paragraph({
                    text: "Lưu ý: Cách tính lương này áp dụng cho Công ty Cổ phần Thương mại và Dược phẩm Ngọc Thiện",
                    alignment: AlignmentType.CENTER,
                    italics: true,
                    size: 16,
                    color: "64748B"
                }),
                new Paragraph({
                    text: `Xuất lúc: ${new Date().toLocaleString('vi-VN')}`,
                    alignment: AlignmentType.RIGHT,
                    spacing: { before: 400 },
                    size: 16,
                    color: "94A3B8"
                })
            ],
        }]
    });

    Packer.toBlob(doc).then((blob) => {
        saveAs(blob, "Phieu_Luong_HTools.docx");
    });
}

// --- TAX CALCULATOR LOGIC ---
const BASE_SALARY_2024 = 2340000; // NĐ 73/2024/NĐ-CP
// Regional Minimum Wage (NĐ 128/2025/NĐ-CP - Using 2024 values as baseline/placeholder if exact 2025 not available)
const REGION_MIN_WAGE = {
    1: 4960000,
    2: 4410000,
    3: 3860000,
    4: 3450000
};

function calculateTax() {
    // 1. Get Inputs
    const gross = parseCurrency(document.getElementById('taxGross').value) || 0;
    let insuranceSalary = parseCurrency(document.getElementById('taxInsuranceSalary').value);
    if (!insuranceSalary) insuranceSalary = gross; // Default to gross if empty

    const dependents = parseInt(document.getElementById('taxDependents').value) || 0;
    const region = parseInt(document.getElementById('taxRegion').value) || 1;
    
    const hasBHXH = document.getElementById('checkBHXH').checked;
    const hasBHYT = document.getElementById('checkBHYT').checked;
    const hasBHTN = document.getElementById('checkBHTN').checked;

    // 2. Calculate Insurance
    // BHXH/BHYT Cap: 20 * Base Salary
    const capSocialHealth = 20 * BASE_SALARY_2024;
    // BHTN Cap: 20 * Regional Min Wage
    const capUnemployment = 20 * REGION_MIN_WAGE[region];

    const salaryForSocialHealth = Math.min(insuranceSalary, capSocialHealth);
    const salaryForUnemployment = Math.min(insuranceSalary, capUnemployment);

    const bhxh = hasBHXH ? salaryForSocialHealth * 0.08 : 0;
    const bhyt = hasBHYT ? salaryForSocialHealth * 0.015 : 0;
    const bhtn = hasBHTN ? salaryForUnemployment * 0.01 : 0;
    const totalInsurance = bhxh + bhyt + bhtn;

    // 3. Calculate TNTT (Income Before Tax)
    const tntt = gross - totalInsurance;

    // 4. Calculate Deductions
    const selfDeduction = 11000000;
    const dependentDeduction = dependents * 4400000;
    const totalDeduction = selfDeduction + dependentDeduction;

    // 5. Calculate TNCT (Taxable Income)
    const tnct = Math.max(0, tntt - totalDeduction);

    // 6. Calculate Tax (Progressive)
    let tax = 0;
    const brackets = [
        { limit: 5000000, rate: 0.05, tax: 0 },
        { limit: 10000000, rate: 0.10, tax: 0 },
        { limit: 18000000, rate: 0.15, tax: 0 },
        { limit: 32000000, rate: 0.20, tax: 0 },
        { limit: 52000000, rate: 0.25, tax: 0 },
        { limit: 80000000, rate: 0.30, tax: 0 },
        { limit: Infinity, rate: 0.35, tax: 0 }
    ];

    let remainingIncome = tnct;
    let previousLimit = 0;

    for (let i = 0; i < brackets.length; i++) {
        if (remainingIncome <= 0) break;
        
        const range = brackets[i].limit - previousLimit;
        const taxableAmount = Math.min(remainingIncome, range);
        
        brackets[i].tax = taxableAmount * brackets[i].rate;
        tax += brackets[i].tax;
        
        remainingIncome -= taxableAmount;
        previousLimit = brackets[i].limit;
    }

    // 7. Net Salary
    const net = gross - totalInsurance - tax;

    // 8. Update UI
    document.getElementById('resTaxGross').innerText = fmtVND(gross);
    document.getElementById('resTaxBHXH').innerText = fmtVND(bhxh);
    document.getElementById('resTaxBHYT').innerText = fmtVND(bhyt);
    document.getElementById('resTaxBHTN').innerText = fmtVND(bhtn);
    document.getElementById('resTaxTNTT').innerText = fmtVND(tntt);
    document.getElementById('resTaxSelfDeduction').innerText = fmtVND(selfDeduction);
    document.getElementById('resTaxDependentDeduction').innerText = fmtVND(dependentDeduction);
    document.getElementById('resTaxTNCT').innerText = fmtVND(tnct);
    document.getElementById('resTaxValue').innerText = fmtVND(tax);
    // document.getElementById('resTaxNet').innerText = fmtVND(net); // Removed as per new UI request (or keep if needed, but user image doesn't emphasize it as much as the table)

    // Update Detailed Tax Table
    const detailTableBody = document.getElementById('taxDetailBody');
    if (detailTableBody) {
        detailTableBody.innerHTML = '';
        const bracketLabels = [
            "Đến 5 triệu VNĐ",
            "Trên 5 triệu VNĐ đến 10 triệu VNĐ",
            "Trên 10 triệu VNĐ đến 18 triệu VNĐ",
            "Trên 18 triệu VNĐ đến 32 triệu VNĐ",
            "Trên 32 triệu VNĐ đến 52 triệu VNĐ",
            "Trên 52 triệu VNĐ đến 80 triệu VNĐ",
            "Trên 80 triệu VNĐ"
        ];
        
        brackets.forEach((bracket, index) => {
            const row = document.createElement('tr');
            row.className = "border-b border-slate-100 last:border-0 hover:bg-slate-50";
            row.innerHTML = `
                <td class="py-2 px-3 text-right text-slate-600">${bracketLabels[index]}</td>
                <td class="py-2 px-3 text-center text-slate-600">${bracket.rate * 100}%</td>
                <td class="py-2 px-3 text-right font-medium text-slate-800">${fmtVND(bracket.tax)}</td>
            `;
            detailTableBody.appendChild(row);
        });
    }
}

function exportTaxReport() {
    const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, Header, Table, TableRow, TableCell, WidthType, BorderStyle } = docx;

    // Get input values
    const gross = parseCurrency(document.getElementById('taxGross').value) || 0;
    let insuranceSalary = parseCurrency(document.getElementById('taxInsuranceSalary').value);
    if (!insuranceSalary) insuranceSalary = gross;
    const dependents = parseInt(document.getElementById('taxDependents').value) || 0;
    const region = parseInt(document.getElementById('taxRegion').value) || 1;
    
    const hasBHXH = document.getElementById('checkBHXH').checked;
    const hasBHYT = document.getElementById('checkBHYT').checked;
    const hasBHTN = document.getElementById('checkBHTN').checked;

    // Calculate values
    const capSocialHealth = 20 * BASE_SALARY_2024;
    const capUnemployment = 20 * REGION_MIN_WAGE[region];
    const salaryForSocialHealth = Math.min(insuranceSalary, capSocialHealth);
    const salaryForUnemployment = Math.min(insuranceSalary, capUnemployment);

    const bhxh = hasBHXH ? salaryForSocialHealth * 0.08 : 0;
    const bhyt = hasBHYT ? salaryForSocialHealth * 0.015 : 0;
    const bhtn = hasBHTN ? salaryForUnemployment * 0.01 : 0;
    const totalInsurance = bhxh + bhyt + bhtn;

    const tntt = gross - totalInsurance;
    const selfDeduction = 11000000;
    const dependentDeduction = dependents * 4400000;
    const totalDeduction = selfDeduction + dependentDeduction;
    const tnct = Math.max(0, tntt - totalDeduction);

    // Calculate tax with brackets
    const brackets = [
        { limit: 5000000, rate: 0.05, tax: 0 },
        { limit: 10000000, rate: 0.10, tax: 0 },
        { limit: 18000000, rate: 0.15, tax: 0 },
        { limit: 32000000, rate: 0.20, tax: 0 },
        { limit: 52000000, rate: 0.25, tax: 0 },
        { limit: 80000000, rate: 0.30, tax: 0 },
        { limit: Infinity, rate: 0.35, tax: 0 }
    ];

    let tax = 0;
    let remainingIncome = tnct;
    let previousLimit = 0;

    for (let i = 0; i < brackets.length; i++) {
        if (remainingIncome <= 0) break;
        const range = brackets[i].limit - previousLimit;
        const taxableAmount = Math.min(remainingIncome, range);
        brackets[i].tax = taxableAmount * brackets[i].rate;
        tax += brackets[i].tax;
        remainingIncome -= taxableAmount;
        previousLimit = brackets[i].limit;
    }

    const net = gross - totalInsurance - tax;
    const fmtVND = (n) => Math.round(n).toLocaleString('en-US') + ' VND';

    const doc = new Document({
        sections: [{
            properties: {
                page: {
                    margin: { top: 720, right: 720, bottom: 720, left: 720 },
                },
            },
            headers: {
                default: new Header({
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: "HTools",
                                    color: "E2E8F0",
                                    size: 80,
                                    bold: true,
                                }),
                            ],
                            alignment: AlignmentType.RIGHT,
                        }),
                    ],
                }),
            },
            children: [
                new Paragraph({
                    text: "BẢNG TÍNH THUẾ THU NHẬP CÁ NHÂN",
                    heading: HeadingLevel.HEADING_1,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 300 },
                }),
                new Paragraph({
                    text: `Tháng: ${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 500 },
                }),
                new Paragraph({
                    text: "A. THÔNG TIN ĐẦU VÀO",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 100 },
                }),
                new Paragraph({ text: `Thu nhập tháng (Gross): ${fmtVND(gross)}`, bullet: { level: 0 } }),
                new Paragraph({ text: `Lương đóng bảo hiểm: ${fmtVND(insuranceSalary)}`, bullet: { level: 0 } }),
                new Paragraph({ text: `Số người phụ thuộc: ${dependents}`, bullet: { level: 0 } }),
                new Paragraph({ text: `Vùng lương tối thiểu: Vùng ${regionMap[region]}`, bullet: { level: 0 } }),

                new Paragraph({
                    text: "B. CÁC KHOẢN BẢO HIỂM",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 100 },
                }),
                new Paragraph({ text: `Bảo hiểm xã hội (8%): ${fmtVND(bhxh)}`, bullet: { level: 0 } }),
                new Paragraph({ text: `Bảo hiểm y tế (1.5%): ${fmtVND(bhyt)}`, bullet: { level: 0 } }),
                new Paragraph({ text: `Bảo hiểm thất nghiệp (1%): ${fmtVND(bhtn)}`, bullet: { level: 0 } }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "=> Tổng bảo hiểm: ", bold: true }),
                        new TextRun({ text: fmtVND(totalInsurance), bold: true })
                    ],
                    bullet: { level: 0 }
                }),

                new Paragraph({
                    text: "C. THU NHẬP VÀ GIẢM TRỪ",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 100 },
                }),
                new Paragraph({ text: `Thu nhập trước thuế: ${fmtVND(tntt)}`, bullet: { level: 0 } }),
                new Paragraph({ text: `Giảm trừ bản thân: ${fmtVND(selfDeduction)}`, bullet: { level: 0 } }),
                new Paragraph({ text: `Giảm trừ người phụ thuộc: ${fmtVND(dependentDeduction)}`, bullet: { level: 0 } }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "=> Thu nhập chịu thuế: ", bold: true }),
                        new TextRun({ text: fmtVND(tnct), bold: true })
                    ],
                    bullet: { level: 0 }
                }),

                new Paragraph({
                    text: "D. CHI TIẾT THUẾ THU NHẬP CÁ NHÂN",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 400, after: 100 },
                }),

                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ text: "Mức chịu thuế", bold: true })], shading: { fill: "E2E8F0" } }),
                                new TableCell({ children: [new Paragraph({ text: "Thuế suất", bold: true, alignment: AlignmentType.CENTER })], shading: { fill: "E2E8F0" } }),
                                new TableCell({ children: [new Paragraph({ text: "Tiền nộp", bold: true, alignment: AlignmentType.RIGHT })], shading: { fill: "E2E8F0" } }),
                            ],
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph("Đến 5 triệu VNĐ")] }),
                                new TableCell({ children: [new Paragraph({ text: "5%", alignment: AlignmentType.CENTER })] }),
                                new TableCell({ children: [new Paragraph({ text: fmtVND(brackets[0].tax), alignment: AlignmentType.RIGHT })] }),
                            ],
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph("Trên 5 triệu VNĐ đến 10 triệu VNĐ")] }),
                                new TableCell({ children: [new Paragraph({ text: "10%", alignment: AlignmentType.CENTER })] }),
                                new TableCell({ children: [new Paragraph({ text: fmtVND(brackets[1].tax), alignment: AlignmentType.RIGHT })] }),
                            ],
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph("Trên 10 triệu VNĐ đến 18 triệu VNĐ")] }),
                                new TableCell({ children: [new Paragraph({ text: "15%", alignment: AlignmentType.CENTER })] }),
                                new TableCell({ children: [new Paragraph({ text: fmtVND(brackets[2].tax), alignment: AlignmentType.RIGHT })] }),
                            ],
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph("Trên 18 triệu VNĐ đến 32 triệu VNĐ")] }),
                                new TableCell({ children: [new Paragraph({ text: "20%", alignment: AlignmentType.CENTER })] }),
                                new TableCell({ children: [new Paragraph({ text: fmtVND(brackets[3].tax), alignment: AlignmentType.RIGHT })] }),
                            ],
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph("Trên 32 triệu VNĐ đến 52 triệu VNĐ")] }),
                                new TableCell({ children: [new Paragraph({ text: "25%", alignment: AlignmentType.CENTER })] }),
                                new TableCell({ children: [new Paragraph({ text: fmtVND(brackets[4].tax), alignment: AlignmentType.RIGHT })] }),
                            ],
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph("Trên 52 triệu VNĐ đến 80 triệu VNĐ")] }),
                                new TableCell({ children: [new Paragraph({ text: "30%", alignment: AlignmentType.CENTER })] }),
                                new TableCell({ children: [new Paragraph({ text: fmtVND(brackets[5].tax), alignment: AlignmentType.RIGHT })] }),
                            ],
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph("Trên 80 triệu VNĐ")] }),
                                new TableCell({ children: [new Paragraph({ text: "35%", alignment: AlignmentType.CENTER })] }),
                                new TableCell({ children: [new Paragraph({ text: fmtVND(brackets[6].tax), alignment: AlignmentType.RIGHT })] }),
                            ],
                        }),
                    ],
                }),

                new Paragraph({
                    text: "E. KẾT QUẢ CUỐI CÙNG",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 400, after: 100 },
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `Thuế TNCN phải nộp: ${fmtVND(tax)}`,
                            bold: true,
                            size: 28,
                            color: "DC2626"
                        })
                    ],
                    spacing: { after: 200 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `Lương NET: ${fmtVND(net)}`,
                            bold: true,
                            size: 32,
                            color: "16A34A"
                        })
                    ],
                    spacing: { after: 400 }
                }),

                new Paragraph({
                    text: "Lưu ý: Bảng tính thuế này chỉ mang tính chất tham khảo",
                    alignment: AlignmentType.CENTER,
                    italics: true,
                    size: 16,
                    color: "64748B"
                }),
                new Paragraph({
                    text: `Xuất lúc: ${new Date().toLocaleString('vi-VN')}`,
                    alignment: AlignmentType.RIGHT,
                    spacing: { before: 400 },
                    size: 16,
                    color: "94A3B8"
                })
            ],
        }]
    });

    Packer.toBlob(doc).then((blob) => {
        saveAs(blob, "Bang_Tinh_Thue_TNCN_HTools.docx");
    });
}

// --- COMPOUND INTEREST LOGIC ---
function toggleRegionDropdown(event) {
    event.stopPropagation();
    const menu = document.getElementById('regionDropdownMenu');
    const arrow = document.getElementById('regionDropdownArrow');
    
    // Close other dropdowns if open
    const freqMenu = document.getElementById('frequencyDropdownMenu');
    if (freqMenu && !freqMenu.classList.contains('hidden')) {
        freqMenu.classList.add('hidden');
        const freqArrow = document.getElementById('frequencyDropdownArrow');
        if (freqArrow) freqArrow.style.transform = 'rotate(0deg)';
    }

    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        if (arrow) arrow.style.transform = 'rotate(180deg)';
    } else {
        menu.classList.add('hidden');
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    }
}

function selectRegion(value, text) {
    document.getElementById('taxRegion').value = value;
    document.getElementById('regionSelectedText').innerText = text;
    
    // Update UI selection state
    document.querySelectorAll('.region-option').forEach(option => {
        const checkIcon = option.querySelector('.check-icon');
        if (option.dataset.value == value) {
            option.classList.add('bg-blue-50', 'text-blue-700');
            checkIcon.classList.remove('opacity-0');
        } else {
            option.classList.remove('bg-blue-50', 'text-blue-700');
            checkIcon.classList.add('opacity-0');
        }
    });

    // Close dropdown
    const menu = document.getElementById('regionDropdownMenu');
    const arrow = document.getElementById('regionDropdownArrow');
    menu.classList.add('hidden');
    if (arrow) arrow.style.transform = 'rotate(0deg)';
    
    // Trigger calculation
    calculateTax();
}

function toggleFrequencyDropdown(event) {
    event.stopPropagation();
    const menu = document.getElementById('frequencyDropdownMenu');
    const arrow = document.getElementById('frequencyDropdownArrow');
    
    // Close other dropdowns if open
    const regionMenu = document.getElementById('regionDropdownMenu');
    if (regionMenu && !regionMenu.classList.contains('hidden')) {
        regionMenu.classList.add('hidden');
        const regionArrow = document.getElementById('regionDropdownArrow');
        if (regionArrow) regionArrow.style.transform = 'rotate(0deg)';
    }

    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        arrow.style.transform = 'rotate(180deg)';
    } else {
        menu.classList.add('hidden');
        arrow.style.transform = 'rotate(0deg)';
    }
}

function selectFrequency(value, text) {
    const input = document.getElementById('compoundFrequency');
    const textSpan = document.getElementById('frequencySelectedText');
    const menu = document.getElementById('frequencyDropdownMenu');
    const arrow = document.getElementById('frequencyDropdownArrow');

    input.value = value;
    textSpan.innerText = text;

    // Update UI selection state
    document.querySelectorAll('.frequency-option').forEach(option => {
        const checkIcon = option.querySelector('.check-icon');
        if (option.dataset.value == value) {
            option.classList.add('bg-blue-50', 'text-blue-700');
            checkIcon.classList.remove('opacity-0');
        } else {
            option.classList.remove('bg-blue-50', 'text-blue-700');
            checkIcon.classList.add('opacity-0');
        }
    });

    // Close dropdown
    menu.classList.add('hidden');
    arrow.style.transform = 'rotate(0deg)';
    
    // Trigger calculation
    calculateCompoundInterest();
}

// Close dropdown when clicking outside (Updated to handle both dropdowns)
document.addEventListener('click', function(event) {
    // Region Dropdown
    const regionMenu = document.getElementById('regionDropdownMenu');
    const regionBtn = document.getElementById('regionDropdownBtn');
    if (regionMenu && !regionMenu.classList.contains('hidden') && !regionBtn.contains(event.target) && !regionMenu.contains(event.target)) {
        regionMenu.classList.add('hidden');
        const arrow = document.getElementById('regionDropdownArrow');
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    }

    // Frequency Dropdown
    const freqMenu = document.getElementById('frequencyDropdownMenu');
    const freqBtn = document.getElementById('frequencyDropdownBtn');
    if (freqMenu && !freqMenu.classList.contains('hidden') && !freqBtn.contains(event.target) && !freqMenu.contains(event.target)) {
        freqMenu.classList.add('hidden');
        const arrow = document.getElementById('frequencyDropdownArrow');
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    }
});

function calculateCompoundInterest() {
    const principal = parseCurrency(document.getElementById('compoundPrincipal').value) || 0;
    const rate = parseFloat(document.getElementById('compoundRate').value) || 0;
    const years = parseFloat(document.getElementById('compoundYears').value) || 0;
    const frequency = parseInt(document.getElementById('compoundFrequency').value) || 12;
    const contribution = parseCurrency(document.getElementById('compoundContribution').value) || 0;

    let balance = principal;
    let totalPrincipal = principal;
    const months = years * 12;
    const rateDecimal = rate / 100;

    // Loop through each month
    for (let i = 1; i <= months; i++) {
        // Add monthly contribution
        balance += contribution;
        totalPrincipal += contribution;

        // Apply interest based on frequency
        // Frequency 12: Apply every month (i % 1 === 0)
        // Frequency 4: Apply every 3 months (i % 3 === 0)
        // Frequency 1: Apply every 12 months (i % 12 === 0)
        
        const monthsPerPeriod = 12 / frequency;
        
        if (i % monthsPerPeriod === 0) {
            const interest = balance * (rateDecimal / frequency);
            balance += interest;
        }
    }

    const totalInterest = balance - totalPrincipal;

    document.getElementById('resCompoundTotal').innerText = fmtVND(balance) + ' ₫';
    document.getElementById('resCompoundPrincipal').innerText = fmtVND(totalPrincipal) + ' ₫';
    document.getElementById('resCompoundInterest').innerText = fmtVND(totalInterest) + ' ₫';
}

// --- TIME LOGIC ---
let timeMap = null;
let timeClockInterval = null;
let countryMetadata = {}; // Cache for country data

function initTime() {
    startTimeClock();
    initMap();
    fetchCountryMetadata();
}

function fetchCountryMetadata() {
    // Fetch all countries data once to improve speed and get capitals/timezones
    fetch('https://restcountries.com/v3.1/all?fields=name,capital,cca3,timezones')
        .then(res => res.json())
        .then(data => {
            data.forEach(country => {
                if (country.cca3) {
                    countryMetadata[country.cca3] = {
                        name: country.name.official || country.name.common,
                        capital: country.capital ? country.capital[0] : '',
                        timezones: country.timezones || []
                    };
                }
            });
        })
        .catch(err => console.error('Error fetching country metadata:', err));
}

function startTimeClock() {
    if (timeClockInterval) clearInterval(timeClockInterval);
    
    const updateClock = () => {
        const now = new Date();
        const dateEl = document.getElementById('timeDate');
        const timeEl = document.getElementById('timeClock');
        
        if (dateEl && timeEl) {
            const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dateEl.innerText = now.toLocaleDateString('vi-VN', dateOptions);
            timeEl.innerText = now.toLocaleTimeString('vi-VN', { hour12: false });
        }
    };
    
    updateClock();
    timeClockInterval = setInterval(updateClock, 1000);
}

function initMap() {
    if (timeMap) {
        // If map exists, just invalidate size
        setTimeout(() => {
            timeMap.invalidateSize();
        }, 100);
        return;
    }
    
    const mapContainer = document.getElementById('worldMap');
    if (!mapContainer) return;

    // Initialize map
    timeMap = L.map('worldMap', {
        center: [20, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 6,
        zoomControl: false,
        attributionControl: false
    });

    // Add Tile Layer (CartoDB Voyager for a clean look)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(timeMap);

    // Add Zoom Control to bottom right
    L.control.zoom({
        position: 'bottomright'
    }).addTo(timeMap);

    // Fetch and add GeoJSON for countries
    fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, {
                style: {
                    fillColor: '#3b82f6',
                    weight: 1,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.1
                },
                onEachFeature: onEachFeature
            }).addTo(timeMap);
        })
        .catch(err => console.error('Error loading map data:', err));
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: (e) => {
            const countryId = feature.id; // CCA3 code
            const countryName = feature.properties.name;
            showCountryInfo(countryId, countryName, e.latlng);
            highlightFeature(e); // Keep highlighted
        }
    });
}

function highlightFeature(e) {
    const layer = e.target;
    layer.setStyle({
        weight: 2,
        color: '#2563eb',
        dashArray: '',
        fillOpacity: 0.3
    });
    layer.bringToFront();
}

function resetHighlight(e) {
    const layer = e.target;
    // Reset to default style
    layer.setStyle({
        fillColor: '#3b82f6',
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.1
    });
}

// Helper to parse "UTC+07:00" to hours (float)
function parseUtcOffset(offsetStr) {
    if (!offsetStr || offsetStr === 'UTC') return 0;
    // Remove "UTC"
    const sign = offsetStr.includes('+') ? 1 : -1;
    const parts = offsetStr.replace('UTC', '').replace('+', '').replace('-', '').split(':');
    const hours = parseInt(parts[0]);
    const minutes = parts[1] ? parseInt(parts[1]) : 0;
    return sign * (hours + (minutes / 60));
}

async function showCountryInfo(countryId, fallbackName, latlng) {
    const overlay = document.getElementById('countryInfoOverlay');
    const nameEl = document.getElementById('overlayCountryName');
    const dateEl = document.getElementById('overlayDate');
    const timeEl = document.getElementById('overlayTime');
    const timezoneEl = document.getElementById('overlayTimezone');
    
    // Determine display name (Official Name)
    let displayName = fallbackName;
    let meta = null;
    
    if (countryMetadata[countryId]) {
        meta = countryMetadata[countryId];
        displayName = meta.name; // Official name
    }

    // Show loading state
    nameEl.innerText = displayName;
    dateEl.innerText = 'Đang tính toán...';
    timeEl.innerText = '--:--';
    timezoneEl.innerText = '...';
    
    overlay.classList.remove('translate-y-[120%]');
    
    try {
        // Calculate time locally using cached timezone data
        let offset = 0;
        let timezoneStr = 'UTC';

        if (meta && meta.timezones && meta.timezones.length > 0) {
            if (meta.timezones.length === 1) {
                timezoneStr = meta.timezones[0];
                offset = parseUtcOffset(timezoneStr);
            } else {
                // Estimate based on longitude: Longitude / 15 = Offset
                const estimatedOffset = Math.round(latlng.lng / 15);
                
                // Find closest timezone in the list
                let minDiff = Infinity;
                let bestTz = meta.timezones[0];
                
                meta.timezones.forEach(tz => {
                    const tzOffset = parseUtcOffset(tz);
                    const diff = Math.abs(tzOffset - estimatedOffset);
                    if (diff < minDiff) {
                        minDiff = diff;
                        bestTz = tz;
                    }
                });
                
                timezoneStr = bestTz;
                offset = parseUtcOffset(bestTz);
            }
        } else {
            // Fallback: Estimate purely on longitude if no metadata
            offset = Math.round(latlng.lng / 15);
            const sign = offset >= 0 ? '+' : '-';
            timezoneStr = `UTC${sign}${Math.abs(offset)}:00 (Ước tính)`;
        }

        // Calculate target time
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const targetTime = new Date(utc + (3600000 * offset));

        // Update UI
        dateEl.innerText = targetTime.toLocaleDateString('vi-VN');
        timeEl.innerText = targetTime.toLocaleTimeString('vi-VN', { hour12: false });
        timezoneEl.innerText = timezoneStr;
        
    } catch (error) {
        console.error(error);
        dateEl.innerText = 'Lỗi';
        timeEl.innerText = 'Lỗi';
    }
}

function closeCountryOverlay() {
    const overlay = document.getElementById('countryInfoOverlay');
    overlay.classList.add('translate-y-[120%]');
}

// --- SORTING VISUALIZER LOGIC ---
let sortingArray = [];
let isSorting = false;
let isPaused = false;
let sortingSpeed = 50;

function initSorting() {
    generateNewArray();
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        const dropdown = document.getElementById('algoDropdownMenu');
        const btn = document.getElementById('algoDropdownBtn');
        if (!dropdown || !btn) return;
        
        if (!btn.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.classList.add('hidden');
            document.getElementById('algoDropdownArrow').classList.remove('rotate-180');
        }
    });
}

function toggleAlgoDropdown(event) {
    event.stopPropagation();
    const dropdown = document.getElementById('algoDropdownMenu');
    const arrow = document.getElementById('algoDropdownArrow');
    const btn = document.getElementById('algoDropdownBtn');
    
    if (btn.disabled) return;

    dropdown.classList.toggle('hidden');
    arrow.classList.toggle('rotate-180');
}

function selectAlgo(value, text) {
    document.getElementById('sortAlgorithm').value = value;
    document.getElementById('algoSelectedText').innerText = text;
    
    // Update check icons
    document.querySelectorAll('.algo-option').forEach(option => {
        const check = option.querySelector('.check-icon');
        const textSpan = option.querySelector('span');
        if (option.dataset.value === value) {
            check.classList.remove('opacity-0');
            check.classList.add('opacity-100');
            textSpan.classList.add('text-blue-700');
            textSpan.classList.add('font-semibold');
        } else {
            check.classList.remove('opacity-100');
            check.classList.add('opacity-0');
            textSpan.classList.remove('text-blue-700');
            textSpan.classList.remove('font-semibold');
        }
    });
    
    // Close dropdown
    document.getElementById('algoDropdownMenu').classList.add('hidden');
    document.getElementById('algoDropdownArrow').classList.remove('rotate-180');
}

function generateNewArray() {
    if (isSorting) return;
    
    const container = document.getElementById('sortingContainer');
    const size = parseInt(document.getElementById('arraySize').value);
    container.innerHTML = '';
    sortingArray = [];
    
    for (let i = 0; i < size; i++) {
        const value = Math.floor(Math.random() * 100) + 5; // 5 to 100
        sortingArray.push(value);
        
        const bar = document.createElement('div');
        bar.style.height = `${value}%`;
        bar.style.width = `${100/size}%`;
        bar.className = 'bg-blue-500 rounded-t-sm transition-all duration-100';
        bar.id = `bar-${i}`;
        container.appendChild(bar);
    }
}

function resetSorting() {
    isSorting = false;
    isPaused = false;
    
    const btn = document.getElementById('startSortBtn');
    btn.innerHTML = '<span class="material-symbols-outlined text-[20px]">play_arrow</span> Bắt đầu';
    btn.classList.remove('bg-red-600', 'hover:bg-red-700', 'shadow-red-200', 'bg-amber-500', 'hover:bg-amber-600', 'shadow-amber-200');
    btn.classList.add('bg-blue-600', 'hover:bg-blue-700', 'shadow-blue-200');
    
    document.getElementById('arraySize').disabled = false;
    document.getElementById('sortSpeed').disabled = false;
    document.getElementById('algoDropdownBtn').disabled = false;
    document.getElementById('algoDropdownBtn').classList.remove('opacity-50', 'cursor-not-allowed');
    
    generateNewArray();
}

function getSpeedDelay() {
    const speedVal = parseInt(document.getElementById('sortSpeed').value);
    // Map 1-100 to 500ms-5ms
    return 505 - (speedVal * 5);
}

async function sleep(ms) {
    // If paused, wait until unpaused or stopped
    while (isPaused && isSorting) {
        await new Promise(resolve => setTimeout(resolve, 50));
    }
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function startSorting() {
    const btn = document.getElementById('startSortBtn');
    
    // If currently sorting
    if (isSorting) {
        if (isPaused) {
            // RESUME
            isPaused = false;
            btn.innerHTML = '<span class="material-symbols-outlined text-[15px]">pause</span> Tạm dừng';
            btn.classList.remove('bg-blue-600', 'hover:bg-blue-700', 'shadow-blue-200');
            btn.classList.add('bg-amber-500', 'hover:bg-amber-600', 'shadow-amber-200');
        } else {
            // PAUSE
            isPaused = true;
            btn.innerHTML = '<span class="material-symbols-outlined text-[15px]">play_arrow</span> Tiếp tục';
            btn.classList.remove('bg-amber-500', 'hover:bg-amber-600', 'shadow-amber-200');
            btn.classList.add('bg-blue-600', 'hover:bg-blue-700', 'shadow-blue-200');
        }
        return;
    }

    // START NEW SORT
    isSorting = true;
    isPaused = false;
    
    // Change button to Pause
    btn.innerHTML = '<span class="material-symbols-outlined text-[20px]">pause</span> Tạm dừng';
    btn.classList.remove('bg-blue-600', 'hover:bg-blue-700', 'shadow-blue-200');
    btn.classList.add('bg-amber-500', 'hover:bg-amber-600', 'shadow-amber-200');
    
    document.getElementById('arraySize').disabled = true;
    document.getElementById('sortSpeed').disabled = true;
    document.getElementById('algoDropdownBtn').disabled = true;
    document.getElementById('algoDropdownBtn').classList.add('opacity-50', 'cursor-not-allowed');
    
    const algorithm = document.getElementById('sortAlgorithm').value;
    
    if (algorithm === 'bubble') {
        await bubbleSort();
    } else if (algorithm === 'quick') {
        await quickSort(0, sortingArray.length - 1);
    } else if (algorithm === 'selection') {
        await selectionSort();
    } else if (algorithm === 'insertion') {
        await insertionSort();
    } else if (algorithm === 'merge') {
        await mergeSort(0, sortingArray.length - 1);
    }
    
    // If finished naturally (not stopped by reset)
    if (isSorting) {
        isSorting = false;
        isPaused = false;
        btn.innerHTML = '<span class="material-symbols-outlined text-[20px]">play_arrow</span> Bắt đầu';
        btn.classList.remove('bg-amber-500', 'hover:bg-amber-600', 'shadow-amber-200');
        btn.classList.add('bg-blue-600', 'hover:bg-blue-700', 'shadow-blue-200');
        
        document.getElementById('arraySize').disabled = false;
        document.getElementById('sortSpeed').disabled = false;
        document.getElementById('algoDropdownBtn').disabled = false;
        document.getElementById('algoDropdownBtn').classList.remove('opacity-50', 'cursor-not-allowed');
    }
}

async function bubbleSort() {
    const len = sortingArray.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - i - 1; j++) {
            if (!isSorting) return;
            
            changeColor(j, 'yellow');
            changeColor(j + 1, 'yellow');
            await sleep(getSpeedDelay());
            
            if (sortingArray[j] > sortingArray[j + 1]) {
                changeColor(j, 'red');
                changeColor(j + 1, 'red');
                await sleep(getSpeedDelay());
                
                swap(j, j + 1);
            }
            
            changeColor(j, 'blue');
            changeColor(j + 1, 'blue');
        }
        changeColor(len - i - 1, 'green');
    }
}

async function selectionSort() {
    const len = sortingArray.length;
    for (let i = 0; i < len; i++) {
        if (!isSorting) return;
        let minIdx = i;
        changeColor(i, 'red'); // Current position
        
        for (let j = i + 1; j < len; j++) {
            if (!isSorting) return;
            changeColor(j, 'yellow'); // Scanning
            await sleep(getSpeedDelay());
            
            if (sortingArray[j] < sortingArray[minIdx]) {
                if (minIdx !== i) changeColor(minIdx, 'blue'); // Reset old min
                minIdx = j;
                changeColor(minIdx, 'red'); // New min
            } else {
                changeColor(j, 'blue');
            }
        }
        
        if (minIdx !== i) {
            swap(i, minIdx);
        }
        changeColor(minIdx, 'blue');
        changeColor(i, 'green'); // Sorted
    }
}

async function insertionSort() {
    const len = sortingArray.length;
    changeColor(0, 'green'); // First element is trivially sorted
    
    for (let i = 1; i < len; i++) {
        if (!isSorting) return;
        
        let key = sortingArray[i];
        let j = i - 1;
        
        changeColor(i, 'yellow'); // Element to insert
        await sleep(getSpeedDelay());
        
        while (j >= 0 && sortingArray[j] > key) {
            if (!isSorting) return;
            
            changeColor(j, 'red'); // Compare
            await sleep(getSpeedDelay());
            
            sortingArray[j + 1] = sortingArray[j];
            updateBarHeight(j + 1, sortingArray[j]);
            changeColor(j + 1, 'green'); // Part of sorted section
            
            // Temporarily color j as red to show movement
            changeColor(j, 'red'); 
            
            j = j - 1;
            
            // Restore color of the moved element (it was part of sorted)
            if (j >= 0) changeColor(j, 'green');
        }
        sortingArray[j + 1] = key;
        updateBarHeight(j + 1, key);
        changeColor(j + 1, 'green');
    }
}

async function mergeSort(start, end) {
    if (!isSorting) return;
    if (start >= end) {
        return;
    }
    
    const mid = Math.floor((start + end) / 2);
    
    await mergeSort(start, mid);
    await mergeSort(mid + 1, end);
    
    await merge(start, mid, end);
}

async function merge(start, mid, end) {
    if (!isSorting) return;
    
    let left = start;
    let right = mid + 1;
    let tempArr = [];
    
    // Visualize the range being merged
    for(let i=start; i<=end; i++) {
        changeColor(i, 'yellow');
    }
    await sleep(getSpeedDelay());

    while (left <= mid && right <= end) {
        if (!isSorting) return;
        
        // Highlight comparison
        changeColor(left, 'red');
        changeColor(right, 'red');
        await sleep(getSpeedDelay());
        
        if (sortingArray[left] <= sortingArray[right]) {
            tempArr.push(sortingArray[left]);
            changeColor(left, 'yellow'); // Done comparing
            left++;
        } else {
            tempArr.push(sortingArray[right]);
            changeColor(right, 'yellow'); // Done comparing
            right++;
        }
    }
    
    while (left <= mid) {
        if (!isSorting) return;
        tempArr.push(sortingArray[left]);
        changeColor(left, 'yellow');
        left++;
    }
    
    while (right <= end) {
        if (!isSorting) return;
        tempArr.push(sortingArray[right]);
        changeColor(right, 'yellow');
        right++;
    }
    
    // Copy back to original array and visualize
    for (let i = 0; i < tempArr.length; i++) {
        if (!isSorting) return;
        
        sortingArray[start + i] = tempArr[i];
        updateBarHeight(start + i, tempArr[i]);
        changeColor(start + i, 'green'); // Merged part is sorted relative to itself
        await sleep(getSpeedDelay());
    }
}

async function quickSort(start, end) {
    if (!isSorting) return;
    if (start >= end) {
        if (start >= 0 && start < sortingArray.length) changeColor(start, 'green');
        return;
    }
    
    let index = await partition(start, end);
    if (!isSorting) return;
    
    await Promise.all([
        quickSort(start, index - 1),
        quickSort(index + 1, end)
    ]);
}

async function partition(start, end) {
    let pivotIndex = start;
    let pivotValue = sortingArray[end];
    
    changeColor(end, 'red'); // Pivot
    
    for (let i = start; i < end; i++) {
        if (!isSorting) return start;
        
        changeColor(i, 'yellow');
        await sleep(getSpeedDelay());
        
        if (sortingArray[i] < pivotValue) {
            swap(i, pivotIndex);
            changeColor(pivotIndex, 'blue'); // Reset old pivot pos color
            pivotIndex++;
        } else {
            changeColor(i, 'blue');
        }
    }
    
    swap(pivotIndex, end);
    changeColor(end, 'blue');
    changeColor(pivotIndex, 'green'); // Pivot sorted
    
    return pivotIndex;
}

function swap(i, j) {
    const temp = sortingArray[i];
    sortingArray[i] = sortingArray[j];
    sortingArray[j] = temp;
    
    updateBarHeight(i, sortingArray[i]);
    updateBarHeight(j, sortingArray[j]);
}

function updateBarHeight(index, value) {
    const bar = document.getElementById(`bar-${index}`);
    if (bar) bar.style.height = `${value}%`;
}

function changeColor(index, color) {
    const bar = document.getElementById(`bar-${index}`);
    if (!bar) return;
    
    const colors = {
        'blue': 'bg-blue-500',
        'yellow': 'bg-yellow-400',
        'red': 'bg-red-500',
        'green': 'bg-green-500'
    };
    
    // Remove all color classes
    Object.values(colors).forEach(c => bar.classList.remove(c));
    // Add new color
    bar.classList.add(colors[color]);
}

// --- TYPING SPEED TEST LOGIC ---
const SAMPLE_TEXTS_EN = [
    "The quick brown fox jumps over the lazy dog",
    "Pack my box with five dozen liquor jugs",
    "How vexingly quick daft zebras jump",
    "Sphinx of black quartz judge my vow",
    "Two driven jocks help fax my big quiz",
    "Life is like a box of chocolates you never know what you are going to get",
    "To be or not to be that is the question",
    "All that glitters is not gold",
    "A journey of a thousand miles begins with a single step",
    "Knowledge is power but enthusiasm pulls the switch",
    "Success is not final failure is not fatal it is the courage to continue that counts",
    "In the middle of difficulty lies opportunity",
    "Happiness depends upon ourselves",
    "Believe you can and you are halfway there",
    "It does not matter how slowly you go as long as you do not stop",
    "The only way to do great work is to love what you do",
    "Change your thoughts and you change your world",
    "It always seems impossible until it is done",
    "Keep your face always toward the sunshine and shadows will fall behind you",
    "The best way to predict the future is to create it"
];

const SAMPLE_TEXTS_VI = [
    "Trăm năm trong cõi người ta chữ tài chữ mệnh khéo là ghét nhau",
    "Trải qua một cuộc bể dâu những điều trông thấy mà đau đớn lòng",
    "Lạ gì bỉ sắc tư phong trời xanh quen thói má hồng đánh ghen",
    "Cảo thơm lần giở trước đèn phong tình cổ lục còn truyền sử xanh",
    "Rằng năm Gia Tĩnh triều Minh bốn phương phẳng lặng hai kinh vững vàng",
    "Có hai chị em Thúy Kiều là con gái đầu lòng của vương viên ngoại",
    "Đầu lòng hai ả tố nga Thúy Kiều là chị em là Thúy Vân",
    "Mai cốt cách tuyết tinh thần mỗi người một vẻ mười phân vẹn mười",
    "Vân xem trang trọng khác vời khuôn trăng đầy đặn nét ngài nở nang",
    "Hoa cười ngọc thốt đoan trang mây thua nước tóc tuyết nhường màu da",
    "Kiều càng sắc sảo mặn mà so bề tài sắc lại là phần hơn",
    "Làn thu thủy nét xuân sơn hoa ghen thua thắm liễu hờn kém xanh",
    "Một hai nghiêng nước nghiêng thành sắc đành đòi một tài đành họa hai",
    "Thông minh vốn sẵn tính trời pha nghề thi họa đủ mùi ca ngâm",
    "Cung thương làu bậc ngũ âm nghề riêng ăn đứt hồ cầm một trương",
    "Khúc nhà tay lựa nên chương một thiên bạc mệnh lại càng não nhân",
    "Phong lưu rất mực hồng quần xuân xanh xấp xỉ tới tuần cập kê",
    "Êm đềm trướng rủ màn che tường đông ong bướm đi về mặc ai",
    "Ngày xuân con én đưa thoi thiều quang chín chục đã ngoài sáu mươi",
    "Cỏ non xanh tận chân trời cành lê trắng điểm một vài bông hoa"
];

let typingTimer = null;
let timeLeft = 60;
let timeLimit = 60;
let isTyping = false;
let totalChars = 0;
let correctChars = 0;
let wpmHistory = [];
let typingChart = null;
let currentText = "";
let currentLang = 'vi';

function initTypingTest() {
    resetTypingTest();
    
    // Setup Input Listener
    const input = document.getElementById('typingInput');
    input.removeEventListener('input', handleTyping); // Prevent duplicates
    input.addEventListener('input', handleTyping);
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(event) {
        ['lang', 'time'].forEach(type => {
            const dropdown = document.getElementById(`${type}DropdownMenu`);
            const btn = document.getElementById(`${type}DropdownBtn`);
            if (!dropdown || !btn) return;
            
            if (!btn.contains(event.target) && !dropdown.contains(event.target)) {
                dropdown.classList.add('hidden');
                document.getElementById(`${type}DropdownArrow`).classList.remove('rotate-180');
            }
        });
    });
}

function toggleTypingDropdown(type) {
    // Close other dropdowns first
    ['lang', 'time'].forEach(t => {
        if (t !== type) {
            document.getElementById(`${t}DropdownMenu`).classList.add('hidden');
            document.getElementById(`${t}DropdownArrow`).classList.remove('rotate-180');
        }
    });

    const dropdown = document.getElementById(`${type}DropdownMenu`);
    const arrow = document.getElementById(`${type}DropdownArrow`);
    
    dropdown.classList.toggle('hidden');
    arrow.classList.toggle('rotate-180');
}

function selectTypingOption(type, value, text) {
    document.getElementById(`${type}SelectedText`).innerText = text;
    
    // Update check icons
    document.querySelectorAll(`.typing-option-${type}`).forEach(option => {
        const check = option.querySelector('.check-icon');
        const textSpan = option.querySelector('span');
        if (option.dataset.value === value) {
            check.classList.remove('opacity-0');
            check.classList.add('opacity-100');
            textSpan.classList.add('text-blue-700');
            textSpan.classList.add('font-semibold');
        } else {
            check.classList.remove('opacity-100');
            check.classList.add('opacity-0');
            textSpan.classList.remove('text-blue-700');
            textSpan.classList.remove('font-semibold');
        }
    });
    
    // Close dropdown
    document.getElementById(`${type}DropdownMenu`).classList.add('hidden');
    document.getElementById(`${type}DropdownArrow`).classList.remove('rotate-180');

    // Logic updates
    if (type === 'lang') {
        currentLang = value;
        document.getElementById('typingLang').value = value;
        resetTypingTest();
    } else if (type === 'time') {
        timeLimit = parseInt(value);
        document.getElementById('timeLimitSelect').value = value;
        resetTypingTest();
    }
}

function generateText() {
    // Generate random text (about 50 words)
    let text = "";
    const source = currentLang === 'vi' ? SAMPLE_TEXTS_VI : SAMPLE_TEXTS_EN;
    
    for(let i=0; i<10; i++) {
        text += source[Math.floor(Math.random() * source.length)] + " ";
    }
    currentText = text.trim();
    
    const display = document.getElementById('typingTextDisplay');
    display.innerHTML = '';
    
    // Split into spans for individual character styling
    currentText.split('').forEach(char => {
        const span = document.createElement('span');
        span.innerText = char;
        display.appendChild(span);
    });
}

function resetTypingTest() {
    clearInterval(typingTimer);
    isTyping = false;
    timeLeft = timeLimit;
    totalChars = 0;
    correctChars = 0;
    wpmHistory = [];
    
    document.getElementById('typingInput').value = '';
    document.getElementById('typingInput').disabled = false;
    document.getElementById('typingInput').focus();
    
    document.getElementById('timeDisplay').innerText = timeLeft + 's';
    document.getElementById('wpmDisplay').innerText = '0';
    document.getElementById('accuracyDisplay').innerText = '100%';
    document.getElementById('charCountDisplay').innerText = '0';
    document.getElementById('focusOverlay').classList.remove('hidden');
    
    generateText();
    initChart();
}

function handleTyping(e) {
    if (!isTyping) {
        startTyping();
    }
    
    const inputVal = e.target.value;
    const spans = document.getElementById('typingTextDisplay').querySelectorAll('span');
    
    totalChars = inputVal.length;
    correctChars = 0;
    
    // Update UI for each character
    spans.forEach((span, index) => {
        const char = inputVal[index];
        
        if (char == null) {
            span.classList.remove('text-green-600', 'text-red-500', 'bg-red-100', 'bg-green-100');
            span.classList.add('text-slate-400');
        } else if (char === span.innerText) {
            span.classList.remove('text-slate-400', 'text-red-500', 'bg-red-100');
            span.classList.add('text-green-600', 'bg-green-100');
            correctChars++;
        } else {
            span.classList.remove('text-slate-400', 'text-green-600', 'bg-green-100');
            span.classList.add('text-red-500', 'bg-red-100');
        }
    });
    
    // Auto scroll to current line if needed (simple implementation)
    // In a real app, we'd calculate offsetTop
    
    updateStats();
    
    // If finished text, generate more
    if (inputVal.length >= currentText.length) {
        generateText();
        e.target.value = ''; // Clear input but keep stats? 
        // For simplicity, let's just append text or reset input. 
        // Resetting input complicates index matching.
        // Let's just generate a very long text initially or append.
        // For this version, let's just stop if they finish (unlikely with 10 sentences)
    }
}

function startTyping() {
    isTyping = true;
    document.getElementById('focusOverlay').classList.add('hidden');
    
    typingTimer = setInterval(() => {
        timeLeft--;
        document.getElementById('timeDisplay').innerText = timeLeft + 's';
        
        // Update WPM every second for chart
        const timeElapsed = timeLimit - timeLeft;
        const wpm = Math.round((correctChars / 5) / (timeElapsed / 60));
        if (timeElapsed > 0) {
            updateChart(timeElapsed, wpm);
        }
        
        if (timeLeft <= 0) {
            endTypingTest();
        }
    }, 1000);
}

function endTypingTest() {
    clearInterval(typingTimer);
    isTyping = false;
    document.getElementById('typingInput').disabled = true;
    
    // Final Stats
    updateStats();
}

function updateStats() {
    const timeElapsed = timeLimit - timeLeft;
    if (timeElapsed === 0) return;
    
    const wpm = Math.round((correctChars / 5) / (timeElapsed / 60));
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
    
    document.getElementById('wpmDisplay').innerText = wpm;
    document.getElementById('accuracyDisplay').innerText = accuracy + '%';
    document.getElementById('charCountDisplay').innerText = correctChars;
}

function initChart() {
    const ctx = document.getElementById('typingChart').getContext('2d');
    
    if (typingChart) {
        typingChart.destroy();
    }
    
    typingChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'WPM',
                data: [],
                borderColor: 'rgb(37, 99, 235)', // blue-600
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#f1f5f9' // slate-100
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            animation: {
                duration: 0
            }
        }
    });
}

function updateChart(time, wpm) {
    if (!typingChart) return;
    
    typingChart.data.labels.push(time + 's');
    typingChart.data.datasets[0].data.push(wpm);
    typingChart.update();
}

// --- COUNTRIES INFO LOGIC ---
let allCountries = [];
let filteredCountries = [];
let currentView = 'list';
let selectedContinent = '';
let currentPage = 1;
let itemsPerPage = 5; // Mặc định 5 dòng

async function initCountries() {
    if (allCountries.length === 0) {
        await loadCountries();
    } else {
        updateStats();
        renderCountries(allCountries);
    }
}

async function loadCountries() {
    const loading = document.getElementById('countriesLoading');
    const grid = document.getElementById('countriesGrid');
    
    loading.style.display = 'block';
    grid.innerHTML = '';
    
    try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,population,area,region,subregion,flags,languages,currencies');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        allCountries = await response.json();
        
        // Sort alphabetically by common name
        allCountries.sort((a, b) => {
            const nameA = a.name.common.toLowerCase();
            const nameB = b.name.common.toLowerCase();
            return nameA.localeCompare(nameB);
        });
        
        filteredCountries = allCountries;
        updateStats();
        renderCountries(allCountries);
    } catch (error) {
        console.error('Error loading countries:', error);
        grid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <div class="text-red-500 mb-2">
                    <span class="material-symbols-outlined text-[48px]">error</span>
                </div>
                <p class="text-red-600 font-semibold mb-2">Không thể tải dữ liệu</p>
                <p class="text-slate-500 text-sm mb-4">Vui lòng kiểm tra kết nối mạng và thử lại</p>
                <button onclick="loadCountries()" 
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <span class="material-symbols-outlined text-[18px] mr-1 align-middle">refresh</span>
                    Thử lại
                </button>
            </div>
        `;
    } finally {
        loading.style.display = 'none';
    }
}

function updateStats() {
    document.getElementById('totalCountries').textContent = allCountries.length;
    document.getElementById('africaCount').textContent = allCountries.filter(c => c.region === 'Africa').length;
    document.getElementById('americasCount').textContent = allCountries.filter(c => c.region === 'Americas').length;
    document.getElementById('asiaCount').textContent = allCountries.filter(c => c.region === 'Asia').length;
    document.getElementById('europeCount').textContent = allCountries.filter(c => c.region === 'Europe').length;
    document.getElementById('oceaniaCount').textContent = allCountries.filter(c => c.region === 'Oceania').length;
}

function setCountryView(view) {
    currentView = view;
    const grid = document.getElementById('countriesGrid');
    const list = document.getElementById('countriesList');
    const cardsBtn = document.getElementById('viewCardsBtn');
    const listBtn = document.getElementById('viewListBtn');
    
    if (view === 'cards') {
        grid.classList.remove('hidden');
        grid.classList.add('grid');
        list.classList.add('hidden');
        cardsBtn.classList.add('bg-slate-50');
        cardsBtn.querySelector('span').classList.add('text-blue-600');
        cardsBtn.querySelector('span').classList.remove('text-slate-600');
        listBtn.classList.remove('bg-slate-50');
        listBtn.querySelector('span').classList.remove('text-blue-600');
        listBtn.querySelector('span').classList.add('text-slate-600');
    } else {
        list.classList.remove('hidden');
        grid.classList.add('hidden');
        grid.classList.remove('grid');
        listBtn.classList.add('bg-slate-50');
        listBtn.querySelector('span').classList.add('text-blue-600');
        listBtn.querySelector('span').classList.remove('text-slate-600');
        cardsBtn.classList.remove('bg-slate-50');
        cardsBtn.querySelector('span').classList.remove('text-blue-600');
        cardsBtn.querySelector('span').classList.add('text-slate-600');
    }
    
    renderCountries(filteredCountries);
}

function toggleContinentDropdown() {
    const menu = document.getElementById('continentDropdownMenu');
    const arrow = document.getElementById('continentDropdownArrow');
    
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        if (arrow) arrow.style.transform = 'rotate(180deg)';
    } else {
        menu.classList.add('hidden');
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    }
}

function selectContinent(value, text) {
    selectedContinent = value;
    document.getElementById('continentFilterText').textContent = text;
    
    // Close dropdown and reset arrow
    const menu = document.getElementById('continentDropdownMenu');
    const arrow = document.getElementById('continentDropdownArrow');
    menu.classList.add('hidden');
    if (arrow) arrow.style.transform = 'rotate(0deg)';
    
    filterCountries();
}

function renderCountries(countries) {
    const grid = document.getElementById('countriesGrid');
    const list = document.getElementById('countriesList');
    
    if (countries.length === 0) {
        const emptyMsg = '<div class="col-span-full text-center py-12 text-slate-500">Không tìm thấy quốc gia nào.</div>';
        grid.innerHTML = emptyMsg;
        list.innerHTML = emptyMsg;
        document.getElementById('paginationControls').style.display = 'none';
        return;
    }
    
    document.getElementById('paginationControls').style.display = 'flex';
    const totalPages = Math.ceil(countries.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedCountries = countries.slice(startIndex, endIndex);
    
    if (currentView === 'cards') {
        renderCardsView(paginatedCountries);
    } else {
        renderListView(paginatedCountries);
    }
    
    updatePagination(countries.length, totalPages);
}

function renderCardsView(countries) {
    const grid = document.getElementById('countriesGrid');
    grid.innerHTML = countries.map(country => {
        const name = country.name.common;
        const officialName = country.name.official;
        const capital = country.capital ? country.capital[0] : 'Không có';
        const population = country.population ? country.population.toLocaleString('vi-VN') : 'N/A';
        const area = country.area ? country.area.toLocaleString('vi-VN') : 'N/A';
        const region = country.region || 'N/A';
        const flag = country.flags.svg || country.flags.png;
        const nameVi = translateCountryName(name);
        
        return `
            <div class="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 hover:border-blue-300">
                <div class="p-3">
                    <!-- Flag and Title -->
                    <div class="flex items-start gap-2 mb-2 pb-2 border-b border-slate-100">
                        <img src="${flag}" alt="${name}" class="w-14 h-10 object-cover rounded border border-slate-200 shrink-0">
                        <div class="flex-1 min-w-0">
                            <h3 class="text-sm font-bold text-slate-800 truncate">${name}</h3>
                            <p class="text-[10px] text-slate-500 truncate">${nameVi}</p>
                        </div>
                    </div>
                    
                    <!-- Official Names -->
                    <div class="mb-2 pb-2 border-b border-slate-100 space-y-1">
                        <div class="text-[10px]">
                            <span class="text-slate-400">Tiếng Việt:</span>
                            <p class="text-slate-700 font-medium leading-tight mt-0.5">${translateOfficialName(name)}</p>
                        </div>
                        <div class="text-[10px]">
                            <span class="text-slate-400">Tiếng Anh:</span>
                            <p class="text-slate-700 font-medium leading-tight mt-0.5">${officialName}</p>
                        </div>
                    </div>
                    
                    <!-- Country Info -->
                    <div class="space-y-1 text-xs">
                        <div class="flex items-center gap-1.5">
                            <span class="material-symbols-outlined text-blue-600 text-[14px]">location_city</span>
                            <span class="text-slate-500 truncate">${capital}</span>
                        </div>
                        <div class="flex items-center gap-1.5">
                            <span class="material-symbols-outlined text-green-600 text-[14px]">groups</span>
                            <span class="text-slate-500 truncate">${population}</span>
                        </div>
                        <div class="flex items-center gap-1.5">
                            <span class="material-symbols-outlined text-orange-600 text-[14px]">straighten</span>
                            <span class="text-slate-500 truncate">${area} km²</span>
                        </div>
                        <div class="flex items-center gap-1.5">
                            <span class="material-symbols-outlined text-purple-600 text-[14px]">public</span>
                            <span class="text-slate-500 truncate">${region}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderListView(countries) {
    const list = document.getElementById('countriesList');
    
    list.innerHTML = countries.map((country, index) => {
        const name = country.name.common;
        const officialName = country.name.official;
        const capital = country.capital ? country.capital[0] : 'Không có';
        const population = country.population ? country.population.toLocaleString('vi-VN') : 'N/A';
        const area = country.area ? country.area.toLocaleString('vi-VN') : 'N/A';
        const region = country.region || 'N/A';
        const subregion = country.subregion || '';
        const flag = country.flags.svg || country.flags.png;
        const languages = country.languages ? Object.values(country.languages).join(', ') : 'N/A';
        const currencies = country.currencies ? Object.values(country.currencies).map(c => c.name).join(', ') : 'N/A';
        const nameVi = translateCountryName(name);
        const nativeName = country.name.nativeName ? Object.values(country.name.nativeName)[0]?.official || officialName : officialName;
        
        return `
            <div class="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <button onclick="toggleCountryAccordion(${index})" class="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div class="flex items-center gap-3">
                        <img src="${flag}" alt="${name}" class="w-12 h-8 object-cover rounded border border-slate-200">
                        <div class="text-left">
                            <h3 class="font-semibold text-slate-800">${name}</h3>
                            <p class="text-xs text-slate-500">${capital} • ${region}</p>
                        </div>
                    </div>
                    <span class="material-symbols-outlined text-slate-400 transition-transform duration-300 accordion-icon-${index}">expand_more</span>
                </button>
                <div id="accordion-${index}" class="accordion-content border-t border-slate-100">
                    <div class="p-4 bg-slate-50/50">
                        <!-- Full Names Section -->
                        <div class="mb-4 pb-4 border-b border-slate-200">
                            <h4 class="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Tên đầy đủ</h4>
                            <div class="space-y-1.5 text-sm">
                                <div>
                                    <span class="text-slate-500 text-xs">Tiếng Việt:</span>
                                    <span class="font-medium text-slate-800 ml-1">${nameVi} - ${translateOfficialName(name)}</span>
                                </div>
                                <div>
                                    <span class="text-slate-500 text-xs">English:</span>
                                    <span class="font-medium text-slate-800 ml-1">${name} - ${officialName}</span>
                                </div>
                                <div>
                                    <span class="text-slate-500 text-xs">Native:</span>
                                    <span class="font-medium text-slate-800 ml-1">${nativeName}</span>
                                </div>
                            </div>
                        </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div class="flex items-start gap-2">
                            <span class="material-symbols-outlined text-blue-600 text-[18px] shrink-0">location_city</span>
                            <div class="flex-1">
                                <span class="text-slate-500 block text-xs">Thủ đô</span>
                                <span class="font-medium text-slate-800">${capital}</span>
                            </div>
                        </div>
                        <div class="flex items-start gap-2">
                            <span class="material-symbols-outlined text-green-600 text-[18px] shrink-0">groups</span>
                            <div class="flex-1">
                                <span class="text-slate-500 block text-xs">Dân số</span>
                                <span class="font-medium text-slate-800">${population}</span>
                            </div>
                        </div>
                        <div class="flex items-start gap-2">
                            <span class="material-symbols-outlined text-orange-600 text-[18px] shrink-0">straighten</span>
                            <div class="flex-1">
                                <span class="text-slate-500 block text-xs">Diện tích</span>
                                <span class="font-medium text-slate-800">${area} km²</span>
                            </div>
                        </div>
                        <div class="flex items-start gap-2">
                            <span class="material-symbols-outlined text-purple-600 text-[18px] shrink-0">public</span>
                            <div class="flex-1">
                                <span class="text-slate-500 block text-xs">Châu lục</span>
                                <span class="font-medium text-slate-800">${region}</span>
                                ${subregion ? `<span class="text-slate-400 text-xs">(${subregion})</span>` : ''}
                            </div>
                        </div>
                        <div class="flex items-start gap-2">
                            <span class="material-symbols-outlined text-red-600 text-[18px] shrink-0">translate</span>
                            <div class="flex-1">
                                <span class="text-slate-500 block text-xs">Ngôn ngữ</span>
                                <span class="font-medium text-slate-800">${languages}</span>
                            </div>
                        </div>
                        <div class="flex items-start gap-2">
                            <span class="material-symbols-outlined text-yellow-600 text-[18px] shrink-0">payments</span>
                            <div class="flex-1">
                                <span class="text-slate-500 block text-xs">Tiền tệ</span>
                                <span class="font-medium text-slate-800">${currencies}</span>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function toggleCountryAccordion(index) {
    const accordion = document.getElementById(`accordion-${index}`);
    const icon = document.querySelector(`.accordion-icon-${index}`);
    
    if (accordion.classList.contains('open')) {
        accordion.classList.remove('open');
        icon.style.transform = 'rotate(0deg)';
    } else {
        accordion.classList.add('open');
        icon.style.transform = 'rotate(180deg)';
    }
}

function translateCountryName(englishName) {
    const translations = {
        'Vietnam': 'Việt Nam', 'United States': 'Hoa Kỳ', 'United Kingdom': 'Vương Quốc Anh',
        'China': 'Trung Quốc', 'Japan': 'Nhật Bản', 'South Korea': 'Hàn Quốc',
        'North Korea': 'Triều Tiên', 'France': 'Pháp', 'Germany': 'Đức', 'Italy': 'Ý',
        'Spain': 'Tây Ban Nha', 'Russia': 'Nga', 'India': 'Ấn Độ', 'Thailand': 'Thái Lan',
        'Singapore': 'Singapore', 'Malaysia': 'Malaysia', 'Indonesia': 'Indonesia',
        'Philippines': 'Philippines', 'Australia': 'Úc', 'New Zealand': 'New Zealand',
        'Canada': 'Canada', 'Mexico': 'Mexico', 'Brazil': 'Brazil', 'Argentina': 'Argentina',
        'South Africa': 'Nam Phi', 'Egypt': 'Ai Cập', 'Turkey': 'Thổ Nhĩ Kỳ',
        'Saudi Arabia': 'Ả Rập Saudi', 'United Arab Emirates': 'Các Tiểu Vương Quốc Ả Rập Thống Nhất',
        'Netherlands': 'Hà Lan', 'Belgium': 'Bỉ', 'Switzerland': 'Thụy Sĩ',
        'Sweden': 'Thụy Điển', 'Norway': 'Na Uy', 'Denmark': 'Đan Mạch',
        'Finland': 'Phần Lan', 'Poland': 'Ba Lan', 'Greece': 'Hy Lạp',
        'Portugal': 'Bồ Đào Nha', 'Algeria': 'Algeria', 'Afghanistan': 'Afghanistan',
        'Åland Islands': 'Đảo Åland', 'Albania': 'Albania', 'American Samoa': 'Samoa thuộc Mỹ',
        'Andorra': 'Andorra', 'Angola': 'Angola', 'Anguilla': 'Anguilla',
        'Taiwan': 'Đài Loan', 'Austria': 'Áo', 'Iceland': 'Iceland', 'Ireland': 'Ireland',
        'Israel': 'Israel', 'Palestine': 'Palestine', 'Iraq': 'Iraq', 'Iran': 'Iran',
        'Jordan': 'Jordan', 'Kuwait': 'Kuwait', 'Lebanon': 'Lê-ba-nông', 'Libya': 'Libya',
        'Morocco': 'Ma-rốc', 'Tunisia': 'Tunisia', 'Sudan': 'Sudan', 'Somalia': 'Somalia',
        'Ethiopia': 'Ethiopia', 'Kenya': 'Kenya', 'Tanzania': 'Tanzania', 'Uganda': 'Uganda',
        'Nigeria': 'Nigeria', 'Ghana': 'Ghana', 'Cameroon': 'Cameroon', 'Zimbabwe': 'Zimbabwe',
        'Mozambique': 'Mozambique', 'Madagascar': 'Madagascar', 'Botswana': 'Botswana',
        'Namibia': 'Namibia', 'Zambia': 'Zambia', 'Pakistan': 'Pakistan', 'Bangladesh': 'Bangladesh',
        'Sri Lanka': 'Sri Lanka', 'Myanmar': 'Myanmar', 'Laos': 'Lào', 'Cambodia': 'Campuchia',
        'Brunei': 'Brunei', 'Mongolia': 'Mông Cổ', 'Kazakhstan': 'Kazakhstan',
        'Uzbekistan': 'Uzbekistan', 'Kyrgyzstan': 'Kyrgyzstan', 'Tajikistan': 'Tajikistan',
        'Turkmenistan': 'Turkmenistan', 'Azerbaijan': 'Azerbaijan', 'Armenia': 'Armenia',
        'Georgia': 'Gruzia', 'Ukraine': 'Ukraine', 'Belarus': 'Belarus', 'Moldova': 'Moldova',
        'Romania': 'România', 'Bulgaria': 'Bulgaria', 'Serbia': 'Serbia', 'Croatia': 'Croatia',
        'Bosnia and Herzegovina': 'Bosnia và Herzegovina', 'Montenegro': 'Montenegro',
        'North Macedonia': 'Bắc Macedonia', 'Kosovo': 'Kosovo', 'Slovenia': 'Slovenia',
        'Slovakia': 'Slovakia', 'Czech Republic': 'Cộng hòa Séc', 'Hungary': 'Hungary',
        'Lithuania': 'Lithuania', 'Latvia': 'Latvia', 'Estonia': 'Estonia',
        'Chile': 'Chile', 'Peru': 'Peru', 'Colombia': 'Colombia', 'Venezuela': 'Venezuela',
        'Ecuador': 'Ecuador', 'Bolivia': 'Bolivia', 'Paraguay': 'Paraguay', 'Uruguay': 'Uruguay',
        'Costa Rica': 'Costa Rica', 'Panama': 'Panama', 'Nicaragua': 'Nicaragua',
        'Honduras': 'Honduras', 'El Salvador': 'El Salvador', 'Guatemala': 'Guatemala',
        'Belize': 'Belize', 'Jamaica': 'Jamaica', 'Cuba': 'Cuba', 'Haiti': 'Haiti',
        'Dominican Republic': 'Cộng hòa Dominica', 'Puerto Rico': 'Puerto Rico',
        'Trinidad and Tobago': 'Trinidad và Tobago', 'Fiji': 'Fiji', 'Papua New Guinea': 'Papua New Guinea',
        'New Caledonia': 'New Caledonia', 'Vanuatu': 'Vanuatu', 'Solomon Islands': 'Quần đảo Solomon',
        'Samoa': 'Samoa', 'Tonga': 'Tonga', 'Palau': 'Palau', 'Micronesia': 'Micronesia',
        'Marshall Islands': 'Quần đảo Marshall', 'Kiribati': 'Kiribati', 'Tuvalu': 'Tuvalu',
        'Nauru': 'Nauru', 'Qatar': 'Qatar', 'Bahrain': 'Bahrain', 'Oman': 'Oman', 'Yemen': 'Yemen'
    };
    return translations[englishName] || englishName;
}

function translateOfficialName(englishName) {
    const translations = {
        'Vietnam': 'Cộng hòa Xã hội Chủ nghĩa Việt Nam',
        'United States': 'Hợp chủng quốc Hoa Kỳ',
        'United Kingdom': 'Vương quốc Liên hiệp Anh và Bắc Ireland',
        'China': 'Cộng hòa Nhân dân Trung Hoa',
        'Taiwan': 'Trung Hoa Dân Quốc (Đài Loan)',
        'Japan': 'Nhật Bản Quốc',
        'South Korea': 'Đại Hàn Dân Quốc',
        'North Korea': 'Cộng hòa Dân chủ Nhân dân Triều Tiên',
        'France': 'Cộng hòa Pháp',
        'Germany': 'Cộng hòa Liên bang Đức',
        'Italy': 'Cộng hòa Ý',
        'Spain': 'Vương quốc Tây Ban Nha',
        'Russia': 'Liên bang Nga',
        'India': 'Cộng hòa Ấn Độ',
        'Thailand': 'Vương quốc Thái Lan',
        'Singapore': 'Cộng hòa Singapore',
        'Malaysia': 'Malaysia',
        'Indonesia': 'Cộng hòa Indonesia',
        'Philippines': 'Cộng hòa Philippines',
        'Australia': 'Liên bang Úc',
        'New Zealand': 'New Zealand',
        'Canada': 'Canada',
        'Mexico': 'Hợp chủng quốc Mexico',
        'Brazil': 'Cộng hòa Liên bang Brazil',
        'Argentina': 'Cộng hòa Argentina',
        'South Africa': 'Cộng hòa Nam Phi',
        'Egypt': 'Cộng hòa Ả Rập Ai Cập',
        'Turkey': 'Cộng hòa Thổ Nhĩ Kỳ',
        'Saudi Arabia': 'Vương quốc Ả Rập Saudi',
        'United Arab Emirates': 'Các Tiểu Vương quốc Ả Rập Thống Nhất',
        'Netherlands': 'Vương quốc Hà Lan',
        'Belgium': 'Vương quốc Bỉ',
        'Switzerland': 'Liên bang Thụy Sĩ',
        'Sweden': 'Vương quốc Thụy Điển',
        'Norway': 'Vương quốc Na Uy',
        'Denmark': 'Vương quốc Đan Mạch',
        'Finland': 'Cộng hòa Phần Lan',
        'Poland': 'Cộng hòa Ba Lan',
        'Greece': 'Cộng hòa Hy Lạp',
        'Portugal': 'Cộng hòa Bồ Đào Nha',
        'Austria': 'Cộng hòa Áo',
        'Iceland': 'Cộng hòa Iceland',
        'Ireland': 'Cộng hòa Ireland',
        'Algeria': 'Cộng hòa Dân chủ Nhân dân Algeria',
        'Afghanistan': 'Nước Cộng hòa Hồi giáo Afghanistan',
        'Åland Islands': 'Đảo Åland',
        'Albania': 'Cộng hòa Albania',
        'American Samoa': 'Lãnh thổ Samoa thuộc Mỹ',
        'Andorra': 'Công quốc Andorra',
        'Angola': 'Cộng hòa Angola',
        'Anguilla': 'Anguilla',
        'Israel': 'Quốc gia Israel',
        'Palestine': 'Quốc gia Palestine',
        'Iraq': 'Cộng hòa Iraq',
        'Iran': 'Cộng hòa Hồi giáo Iran',
        'Jordan': 'Vương quốc Há-sê-mi Jordan',
        'Kuwait': 'Quốc gia Kuwait',
        'Lebanon': 'Cộng hòa Lê-ba-nông',
        'Libya': 'Quốc gia Libya',
        'Morocco': 'Vương quốc Ma-rốc',
        'Tunisia': 'Cộng hòa Tunisia',
        'Pakistan': 'Cộng hòa Hồi giáo Pakistan',
        'Bangladesh': 'Cộng hòa Nhân dân Bangladesh',
        'Sri Lanka': 'Cộng hòa Dân chủ Xã hội chủ nghĩa Sri Lanka',
        'Myanmar': 'Cộng hòa Liên bang Myanmar',
        'Laos': 'Cộng hòa Dân chủ Nhân dân Lào',
        'Cambodia': 'Vương quốc Campuchia',
        'Brunei': 'Quốc gia Brunei Darussalam',
        'Mongolia': 'Mông Cổ',
        'Romania': 'România',
        'Czech Republic': 'Cộng hòa Séc',
        'Chile': 'Cộng hòa Chile',
        'Peru': 'Cộng hòa Peru',
        'Colombia': 'Cộng hòa Colombia',
        'Venezuela': 'Cộng hòa Bô-li-va Venezuela',
        'Ecuador': 'Cộng hòa Ecuador',
        'Cuba': 'Cộng hòa Cuba',
        'Dominican Republic': 'Cộng hòa Dominica'
    };
    
    // If translation exists, return it
    if (translations[englishName]) {
        return translations[englishName];
    }
    
    // Auto-translate using pattern matching
    return autoTranslateOfficialName(englishName);
}

function autoTranslateOfficialName(officialName) {
    // Common patterns for auto-translation
    let translated = officialName;
    
    // Republic patterns
    if (officialName.includes('Republic of')) {
        const country = officialName.replace('Republic of', '').trim();
        const countryVi = translateCountryName(country) || country;
        translated = `Cộng hòa ${countryVi}`;
    }
    else if (officialName.includes('Islamic Republic of')) {
        const country = officialName.replace('Islamic Republic of', '').trim();
        const countryVi = translateCountryName(country) || country;
        translated = `Cộng hòa Hồi giáo ${countryVi}`;
    }
    else if (officialName.includes('Democratic Republic of')) {
        const country = officialName.replace('Democratic Republic of', '').trim();
        const countryVi = translateCountryName(country) || country;
        translated = `Cộng hòa Dân chủ ${countryVi}`;
    }
    else if (officialName.includes('Federal Republic of')) {
        const country = officialName.replace('Federal Republic of', '').trim();
        const countryVi = translateCountryName(country) || country;
        translated = `Cộng hòa Liên bang ${countryVi}`;
    }
    else if (officialName.includes('People\'s Republic of')) {
        const country = officialName.replace('People\'s Republic of', '').trim();
        const countryVi = translateCountryName(country) || country;
        translated = `Cộng hòa Nhân dân ${countryVi}`;
    }
    // Kingdom patterns
    else if (officialName.includes('Kingdom of')) {
        const country = officialName.replace('Kingdom of', '').trim();
        const countryVi = translateCountryName(country) || country;
        translated = `Vương quốc ${countryVi}`;
    }
    // Federation patterns
    else if (officialName.includes('Federation of')) {
        const country = officialName.replace('Federation of', '').trim();
        const countryVi = translateCountryName(country) || country;
        translated = `Liên bang ${countryVi}`;
    }
    // State patterns
    else if (officialName.includes('State of')) {
        const country = officialName.replace('State of', '').trim();
        const countryVi = translateCountryName(country) || country;
        translated = `Quốc gia ${countryVi}`;
    }
    // Commonwealth patterns
    else if (officialName.includes('Commonwealth of')) {
        const country = officialName.replace('Commonwealth of', '').trim();
        const countryVi = translateCountryName(country) || country;
        translated = `Khối thịnh vượng chung ${countryVi}`;
    }
    // Principality patterns
    else if (officialName.includes('Principality of')) {
        const country = officialName.replace('Principality of', '').trim();
        const countryVi = translateCountryName(country) || country;
        translated = `Công quốc ${countryVi}`;
    }
    // Sultanate patterns
    else if (officialName.includes('Sultanate of')) {
        const country = officialName.replace('Sultanate of', '').trim();
        const countryVi = translateCountryName(country) || country;
        translated = `Quốc vương ${countryVi}`;
    }
    // Territory patterns
    else if (officialName.includes('Territory of the French Southern and Antarctic Lands')) {
        translated = 'Lãnh thổ phía Nam và Nam Cực thuộc Pháp';
    }
    else if (officialName.includes('Territory of')) {
        const remaining = officialName.replace('Territory of', '').trim();
        translated = `Lãnh thổ ${remaining}`;
    }
    // Special cases
    else if (officialName.includes('Gabonese Republic')) {
        translated = 'Cộng hòa Gabon';
    }
    else if (officialName.includes('Syrian Arab Republic')) {
        translated = 'Cộng hòa Ả Rập Syria';
    }
    else if (officialName.includes('Lao People\'s Democratic Republic')) {
        translated = 'Cộng hòa Dân chủ Nhân dân Lào';
    }
    else if (officialName.includes('Democratic People\'s Republic of Korea')) {
        translated = 'Cộng hòa Dân chủ Nhân dân Triều Tiên';
    }
    else if (officialName.includes('Bolivarian Republic of Venezuela')) {
        translated = 'Cộng hòa Bô-li-va Venezuela';
    }
    else if (officialName.includes('Republic of the Union of Myanmar')) {
        translated = 'Cộng hòa Liên bang Myanmar';
    }
    
    return translated;
}

let filterTimeout;
function filterCountries() {
    clearTimeout(filterTimeout);
    filterTimeout = setTimeout(() => {
        performFilterCountries();
    }, 300);
}

function performFilterCountries() {
    const searchTerm = document.getElementById('countrySearch').value.toLowerCase();
    
    filteredCountries = allCountries.filter(country => {
        // Tìm kiếm theo tên tiếng Anh
        const commonName = country.name.common.toLowerCase();
        const officialName = country.name.official ? country.name.official.toLowerCase() : '';
        
        // Tìm kiếm theo tên tiếng Việt
        const vietnameseName = translateCountryName(country.name.common).toLowerCase();
        const vietnameseOfficialName = translateOfficialName(country.name.common).toLowerCase();
        
        // Tìm kiếm theo thủ đô
        const capitalMatch = country.capital && country.capital[0] ? country.capital[0].toLowerCase().includes(searchTerm) : false;
        
        const matchesSearch = commonName.includes(searchTerm) ||
                            officialName.includes(searchTerm) ||
                            vietnameseName.includes(searchTerm) ||
                            vietnameseOfficialName.includes(searchTerm) ||
                            capitalMatch;
        
        const matchesContinent = !selectedContinent || country.region === selectedContinent;
        
        return matchesSearch && matchesContinent;
    });
    
    currentPage = 1;
    renderCountries(filteredCountries);
}

function updatePagination(totalItems, totalPages) {
    const pageInfo = document.getElementById('pageInfo');
    const totalCountriesInfo = document.getElementById('totalCountriesInfo');
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    const pageNumbers = document.getElementById('pageNumbers');
    
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    
    pageInfo.textContent = `${startItem}-${endItem}`;
    totalCountriesInfo.textContent = totalItems;
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    
    // Render page numbers - responsive for mobile
    let pageNumbersHTML = '';
    const isMobile = window.innerWidth < 640; // sm breakpoint
    
    // Button size classes - smaller on mobile
    const btnSizeClasses = isMobile ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';
    const ellipsisSizeClasses = isMobile ? 'w-4 h-8' : 'w-8 h-10';
    
    if (totalPages <= (isMobile ? 4 : 7)) {
        // Nếu ít trang, hiển thị tất cả
        for (let i = 1; i <= totalPages; i++) {
            const isActive = i === currentPage;
            pageNumbersHTML += `<button onclick="goToPage(${i})" class="${btnSizeClasses} rounded-lg border transition-colors touch-manipulation ${isActive ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100'}">${i}</button>`;
        }
    } else {
        // Mobile: hiển thị 1, 2 ... (n-1), n
        // Desktop: hiển thị 1, 2, 3 ... (n-2), (n-1), n
        const showStart = isMobile ? 2 : 3; // Số nút đầu
        const showEnd = isMobile ? 2 : 3;   // Số nút cuối
        
        // Hiển thị các trang đầu
        for (let i = 1; i <= showStart; i++) {
            const isActive = i === currentPage;
            pageNumbersHTML += `<button onclick="goToPage(${i})" class="${btnSizeClasses} rounded-lg border transition-colors touch-manipulation ${isActive ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100'}">${i}</button>`;
        }
        
        // Ellipsis giữa
        if (currentPage > showStart + 1 && currentPage < totalPages - showEnd) {
            pageNumbersHTML += `<span class="${ellipsisSizeClasses} flex items-center justify-center text-slate-400">...</span>`;
            // Hiển thị trang hiện tại nếu ở giữa
            pageNumbersHTML += `<button onclick="goToPage(${currentPage})" class="${btnSizeClasses} rounded-lg border transition-colors touch-manipulation bg-blue-600 text-white border-blue-600">${currentPage}</button>`;
            pageNumbersHTML += `<span class="${ellipsisSizeClasses} flex items-center justify-center text-slate-400">...</span>`;
        } else {
            pageNumbersHTML += `<span class="${ellipsisSizeClasses} flex items-center justify-center text-slate-400">...</span>`;
        }
        
        // Hiển thị các trang cuối
        for (let i = totalPages - showEnd + 1; i <= totalPages; i++) {
            const isActive = i === currentPage;
            pageNumbersHTML += `<button onclick="goToPage(${i})" class="${btnSizeClasses} rounded-lg border transition-colors touch-manipulation ${isActive ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100'}">${i}</button>`;
        }
    }
    
    pageNumbers.innerHTML = pageNumbersHTML;
}

function changePage(direction) {
    if (direction === 'prev' && currentPage > 1) {
        currentPage--;
    } else if (direction === 'next') {
        const totalPages = Math.ceil(filteredCountries.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
        }
    }
    renderCountries(filteredCountries);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToPage(page) {
    currentPage = page;
    renderCountries(filteredCountries);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Items per page custom dropdown
function toggleItemsPerPageDropdown(event) {
    if (event) event.stopPropagation();
    const menu = document.getElementById('itemsPerPageMenu');
    const arrow = document.getElementById('itemsPerPageArrow');
    const isHidden = menu.classList.contains('hidden');
    
    if (isHidden) {
        menu.classList.remove('hidden');
        arrow.style.transform = 'rotate(180deg)';
    } else {
        menu.classList.add('hidden');
        arrow.style.transform = 'rotate(0deg)';
    }
}

function selectItemsPerPage(value) {
    const input = document.getElementById('itemsPerPageValue');
    const textSpan = document.getElementById('itemsPerPageText');
    const menu = document.getElementById('itemsPerPageMenu');
    const arrow = document.getElementById('itemsPerPageArrow');
    
    // Update value and text
    input.value = value;
    textSpan.innerText = value;
    itemsPerPage = value;
    
    // Update visual selection state
    document.querySelectorAll('.items-per-page-option').forEach(option => {
        const checkIcon = option.querySelector('.check-icon');
        if (parseInt(option.dataset.value) === value) {
            checkIcon.classList.remove('hidden');
        } else {
            checkIcon.classList.add('hidden');
        }
    });
    
    // Close dropdown
    menu.classList.add('hidden');
    arrow.style.transform = 'rotate(0deg)';
    
    // Reset về trang 1 và render lại
    currentPage = 1;
    renderCountries(filteredCountries);
}

// Close items per page dropdown when clicking outside
document.addEventListener('click', function(event) {
    const menu = document.getElementById('itemsPerPageMenu');
    const btn = document.getElementById('itemsPerPageBtn');
    if (menu && btn && !menu.classList.contains('hidden') && !btn.contains(event.target) && !menu.contains(event.target)) {
        menu.classList.add('hidden');
        const arrow = document.getElementById('itemsPerPageArrow');
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    }
});

// --- PHYSICS SIMULATION LOGIC ---
let physicsCanvas, physicsCtx;
let physicsObjects = [];
let physicsAnimationId = null;
let isPhysicsRunning = false;
let physicsMode = 'bouncing'; // 'bouncing', 'gravity', 'solar'
let physicsSpeed = 1;
let collisionCount = 0;
let lastFrameTime = 0;
let fps = 0;

// Solar system data
const solarSystemData = [
    { name: 'Mặt Trời', color: '#FDB813', radius: 30, orbitRadius: 0, speed: 0, angle: 0 },
    { name: 'Sao Thủy', color: '#B5B5B5', radius: 4, orbitRadius: 50, speed: 0.04, angle: 0 },
    { name: 'Sao Kim', color: '#E6C87A', radius: 6, orbitRadius: 75, speed: 0.03, angle: Math.PI / 3 },
    { name: 'Trái Đất', color: '#6B93D6', radius: 7, orbitRadius: 105, speed: 0.02, angle: Math.PI },
    { name: 'Sao Hỏa', color: '#C1440E', radius: 5, orbitRadius: 140, speed: 0.016, angle: Math.PI * 1.5 },
    { name: 'Sao Mộc', color: '#D8CA9D', radius: 14, orbitRadius: 190, speed: 0.008, angle: Math.PI / 4 },
    { name: 'Sao Thổ', color: '#F4D59E', radius: 12, orbitRadius: 240, speed: 0.006, angle: Math.PI * 0.8 },
    { name: 'Sao Thiên Vương', color: '#D1E7E7', radius: 9, orbitRadius: 285, speed: 0.004, angle: Math.PI * 1.2 },
    { name: 'Sao Hải Vương', color: '#5B5DDF', radius: 8, orbitRadius: 325, speed: 0.003, angle: Math.PI * 0.6 }
];

function initPhysics() {
    physicsCanvas = document.getElementById('physicsCanvas');
    if (!physicsCanvas) return;
    
    physicsCtx = physicsCanvas.getContext('2d');
    resizePhysicsCanvas();
    
    // Use ResizeObserver for better responsiveness (e.g. sidebar toggle)
    const resizeObserver = new ResizeObserver(() => {
        resizePhysicsCanvas();
    });
    resizeObserver.observe(physicsCanvas.parentElement);
    
    // Initialize based on current mode
    setPhysicsMode(physicsMode);
}

function resizePhysicsCanvas() {
    if (!physicsCanvas) return;
    const container = physicsCanvas.parentElement;
    physicsCanvas.width = container.clientWidth;
    physicsCanvas.height = 500;
    
    // Redraw if not running
    if (!isPhysicsRunning) {
        drawPhysics();
    }
}

function setPhysicsMode(mode) {
    physicsMode = mode;
    
    // Update button states
    document.querySelectorAll('.physics-mode-btn').forEach(btn => {
        btn.classList.remove('bg-blue-600', 'text-white', 'shadow-md');
        btn.classList.add('bg-white', 'text-slate-600', 'border', 'border-slate-200', 'hover:bg-slate-50');
    });
    
    const activeBtn = document.getElementById(mode === 'bouncing' ? 'btnBouncingBalls' : 
                                              mode === 'gravity' ? 'btnGravity' : 'btnSolarSystem');
    if (activeBtn) {
        activeBtn.classList.remove('bg-white', 'text-slate-600', 'border', 'border-slate-200', 'hover:bg-slate-50');
        activeBtn.classList.add('bg-blue-600', 'text-white', 'shadow-md');
    }
    
    // Show/hide ball count control
    const ballCountControl = document.getElementById('ballCountControl');
    const solarLegend = document.getElementById('solarLegend');
    
    if (ballCountControl) {
        ballCountControl.style.display = (mode === 'bouncing' || mode === 'gravity') ? 'flex' : 'none';
    }
    if (solarLegend) {
        solarLegend.classList.toggle('hidden', mode !== 'solar');
        if (mode === 'solar') {
            populateSolarLegend();
        }
    }
    
    // Reset simulation
    resetPhysicsSimulation();
}

function populateSolarLegend() {
    const container = document.getElementById('solarLegendContent');
    if (!container) return;
    
    container.innerHTML = solarSystemData.map(planet => `
        <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded-full" style="background-color: ${planet.color}"></div>
            <span class="text-slate-600">${planet.name}</span>
        </div>
    `).join('');
}

function createBouncingBalls(count) {
    const balls = [];
    for (let i = 0; i < count; i++) {
        const radius = Math.random() * 15 + 10;
        balls.push({
            x: Math.random() * (physicsCanvas.width - radius * 2) + radius,
            y: Math.random() * (physicsCanvas.height - radius * 2) + radius,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            radius: radius,
            color: `hsl(${Math.random() * 360}, 70%, 60%)`,
            mass: radius
        });
    }
    return balls;
}

function createGravityObjects(count) {
    const objects = [];
    for (let i = 0; i < count; i++) {
        const radius = Math.random() * 12 + 8;
        objects.push({
            x: Math.random() * (physicsCanvas.width - radius * 2) + radius,
            y: Math.random() * 100 + radius, // Start near top
            vx: (Math.random() - 0.5) * 4,
            vy: 0,
            radius: radius,
            color: `hsl(${Math.random() * 60 + 180}, 70%, 60%)`, // Blue-green colors
            mass: radius,
            grounded: false
        });
    }
    return objects;
}

function createSolarSystem() {
    return solarSystemData.map(planet => ({
        ...planet,
        angle: planet.angle
    }));
}

function togglePhysicsSimulation() {
    if (isPhysicsRunning) {
        stopPhysicsSimulation();
    } else {
        startPhysicsSimulation();
    }
}

function startPhysicsSimulation() {
    if (isPhysicsRunning) return;
    
    isPhysicsRunning = true;
    collisionCount = 0;
    lastFrameTime = performance.now();
    
    const playBtn = document.getElementById('physicsPlayBtn');
    const playIcon = document.getElementById('physicsPlayIcon');
    const playText = document.getElementById('physicsPlayText');
    
    if (playBtn) {
        playBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
        playBtn.classList.add('bg-amber-500', 'hover:bg-amber-600');
    }
    if (playIcon) playIcon.textContent = 'pause';
    if (playText) playText.textContent = 'Tạm dừng';
    
    physicsLoop();
}

function stopPhysicsSimulation() {
    isPhysicsRunning = false;
    
    if (physicsAnimationId) {
        cancelAnimationFrame(physicsAnimationId);
        physicsAnimationId = null;
    }
    
    const playBtn = document.getElementById('physicsPlayBtn');
    const playIcon = document.getElementById('physicsPlayIcon');
    const playText = document.getElementById('physicsPlayText');
    
    if (playBtn) {
        playBtn.classList.remove('bg-amber-500', 'hover:bg-amber-600');
        playBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
    }
    if (playIcon) playIcon.textContent = 'play_arrow';
    if (playText) playText.textContent = 'Tiếp tục';
}

function resetPhysicsSimulation() {
    stopPhysicsSimulation();
    collisionCount = 0;
    
    const count = parseInt(document.getElementById('ballCount')?.value) || 10;
    
    if (physicsMode === 'bouncing') {
        physicsObjects = createBouncingBalls(count);
    } else if (physicsMode === 'gravity') {
        physicsObjects = createGravityObjects(count);
    } else if (physicsMode === 'solar') {
        physicsObjects = createSolarSystem();
    }
    
    // Reset button text
    const playText = document.getElementById('physicsPlayText');
    if (playText) playText.textContent = 'Bắt đầu';
    
    drawPhysics();
    updatePhysicsInfo();
}

function addBalls() {
    if (physicsMode === 'solar') return;
    
    const count = parseInt(document.getElementById('ballCount')?.value) || 5;
    
    if (physicsMode === 'bouncing') {
        physicsObjects = physicsObjects.concat(createBouncingBalls(count));
    } else if (physicsMode === 'gravity') {
        physicsObjects = physicsObjects.concat(createGravityObjects(count));
    }
    
    updatePhysicsInfo();
    if (!isPhysicsRunning) drawPhysics();
}

function togglePhysicsSpeedDropdown(event) {
    event.stopPropagation();
    const menu = document.getElementById('physicsSpeedMenu');
    const arrow = document.getElementById('physicsSpeedArrow');
    
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        if (arrow) arrow.style.transform = 'rotate(180deg)';
    } else {
        menu.classList.add('hidden');
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    }
}

function setPhysicsSpeed(speed) {
    physicsSpeed = speed;
    const label = document.getElementById('physicsSpeedLabel');
    if (label) label.textContent = `${speed.toFixed(1)}x`;
    
    // Update active state in dropdown
    const options = document.querySelectorAll('.physics-speed-option');
    options.forEach(opt => {
        const val = parseFloat(opt.getAttribute('data-value'));
        const checkIcon = opt.querySelector('.material-symbols-outlined');
        
        if (val === speed) {
            opt.classList.remove('text-slate-600', 'hover:bg-slate-50', 'hover:text-slate-900');
            opt.classList.add('text-blue-600', 'bg-blue-50', 'font-medium');
            checkIcon.classList.remove('opacity-0', 'group-hover:opacity-100');
        } else {
            opt.classList.add('text-slate-600', 'hover:bg-slate-50', 'hover:text-slate-900');
            opt.classList.remove('text-blue-600', 'bg-blue-50', 'font-medium');
            checkIcon.classList.add('opacity-0', 'group-hover:opacity-100');
        }
    });

    const menu = document.getElementById('physicsSpeedMenu');
    const arrow = document.getElementById('physicsSpeedArrow');
    if (menu) menu.classList.add('hidden');
    if (arrow) arrow.style.transform = 'rotate(0deg)';
}

function physicsLoop() {
    if (!isPhysicsRunning) return;
    
    const currentTime = performance.now();
    const deltaTime = (currentTime - lastFrameTime) / 1000;
    fps = Math.round(1 / deltaTime);
    lastFrameTime = currentTime;
    
    updatePhysics(deltaTime * physicsSpeed);
    drawPhysics();
    updatePhysicsInfo();
    
    physicsAnimationId = requestAnimationFrame(physicsLoop);
}

function updatePhysics(dt) {
    if (physicsMode === 'bouncing') {
        updateBouncingBalls(dt);
    } else if (physicsMode === 'gravity') {
        updateGravityObjects(dt);
    } else if (physicsMode === 'solar') {
        updateSolarSystem(dt);
    }
}

function updateBouncingBalls(dt) {
    const gravity = 0; // No gravity for bouncing mode
    const damping = 0.999;
    const bounce = 0.95;
    
    for (let i = 0; i < physicsObjects.length; i++) {
        const ball = physicsObjects[i];
        
        // Apply velocity
        ball.x += ball.vx * dt * 60;
        ball.y += ball.vy * dt * 60;
        ball.vy += gravity * dt * 60;
        
        // Wall collisions
        if (ball.x - ball.radius < 0) {
            ball.x = ball.radius;
            ball.vx = -ball.vx * bounce;
            collisionCount++;
        }
        if (ball.x + ball.radius > physicsCanvas.width) {
            ball.x = physicsCanvas.width - ball.radius;
            ball.vx = -ball.vx * bounce;
            collisionCount++;
        }
        if (ball.y - ball.radius < 0) {
            ball.y = ball.radius;
            ball.vy = -ball.vy * bounce;
            collisionCount++;
        }
        if (ball.y + ball.radius > physicsCanvas.height) {
            ball.y = physicsCanvas.height - ball.radius;
            ball.vy = -ball.vy * bounce;
            collisionCount++;
        }
        
        // Ball-to-ball collisions
        for (let j = i + 1; j < physicsObjects.length; j++) {
            const other = physicsObjects[j];
            const dx = other.x - ball.x;
            const dy = other.y - ball.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minDist = ball.radius + other.radius;
            
            if (dist < minDist) {
                // Collision detected
                collisionCount++;
                
                // Normalize collision vector
                const nx = dx / dist;
                const ny = dy / dist;
                
                // Relative velocity
                const dvx = ball.vx - other.vx;
                const dvy = ball.vy - other.vy;
                const dvn = dvx * nx + dvy * ny;
                
                // Don't process if moving apart
                if (dvn > 0) continue;
                
                // Impulse
                const restitution = 0.9;
                const impulse = (-(1 + restitution) * dvn) / (1/ball.mass + 1/other.mass);
                
                ball.vx -= impulse * nx / ball.mass;
                ball.vy -= impulse * ny / ball.mass;
                other.vx += impulse * nx / other.mass;
                other.vy += impulse * ny / other.mass;
                
                // Separate balls
                const overlap = minDist - dist;
                const separationX = overlap * nx * 0.5;
                const separationY = overlap * ny * 0.5;
                ball.x -= separationX;
                ball.y -= separationY;
                other.x += separationX;
                other.y += separationY;
            }
        }
        
        // Apply damping
        ball.vx *= damping;
        ball.vy *= damping;
    }
}

function updateGravityObjects(dt) {
    const gravity = 980; // pixels per second squared
    const bounce = 0.7;
    const friction = 0.99;
    
    for (let obj of physicsObjects) {
        if (!obj.grounded) {
            obj.vy += gravity * dt;
        }
        
        obj.x += obj.vx * dt;
        obj.y += obj.vy * dt;
        
        // Floor collision
        if (obj.y + obj.radius > physicsCanvas.height) {
            obj.y = physicsCanvas.height - obj.radius;
            if (Math.abs(obj.vy) > 20) {
                obj.vy = -obj.vy * bounce;
                collisionCount++;
            } else {
                obj.vy = 0;
                obj.grounded = true;
            }
        }
        
        // Wall collisions
        if (obj.x - obj.radius < 0) {
            obj.x = obj.radius;
            obj.vx = -obj.vx * bounce;
            collisionCount++;
        }
        if (obj.x + obj.radius > physicsCanvas.width) {
            obj.x = physicsCanvas.width - obj.radius;
            obj.vx = -obj.vx * bounce;
            collisionCount++;
        }
        
        // Apply friction when grounded
        if (obj.grounded) {
            obj.vx *= friction;
        }
        
        // Check if still grounded
        if (obj.y + obj.radius < physicsCanvas.height - 1) {
            obj.grounded = false;
        }
    }
}

function updateSolarSystem(dt) {
    for (let planet of physicsObjects) {
        if (planet.orbitRadius > 0) {
            planet.angle += planet.speed * dt * 60;
        }
    }
}

function drawPhysics() {
    if (!physicsCtx || !physicsCanvas) return;
    
    // Clear canvas
    physicsCtx.fillStyle = '#0f172a';
    physicsCtx.fillRect(0, 0, physicsCanvas.width, physicsCanvas.height);
    
    if (physicsMode === 'bouncing' || physicsMode === 'gravity') {
        drawBalls();
    } else if (physicsMode === 'solar') {
        drawSolarSystem();
    }
}

function drawBalls() {
    for (let obj of physicsObjects) {
        // Shadow
        physicsCtx.beginPath();
        physicsCtx.arc(obj.x + 2, obj.y + 2, obj.radius, 0, Math.PI * 2);
        physicsCtx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        physicsCtx.fill();
        
        // Ball
        const gradient = physicsCtx.createRadialGradient(
            obj.x - obj.radius * 0.3, obj.y - obj.radius * 0.3, 0,
            obj.x, obj.y, obj.radius
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
        gradient.addColorStop(0.5, obj.color);
        gradient.addColorStop(1, obj.color);
        
        physicsCtx.beginPath();
        physicsCtx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
        physicsCtx.fillStyle = gradient;
        physicsCtx.fill();
    }
}

function drawSolarSystem() {
    const centerX = physicsCanvas.width / 2;
    const centerY = physicsCanvas.height / 2;
    
    // Draw orbit paths
    for (let planet of physicsObjects) {
        if (planet.orbitRadius > 0) {
            physicsCtx.beginPath();
            physicsCtx.arc(centerX, centerY, planet.orbitRadius, 0, Math.PI * 2);
            physicsCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            physicsCtx.lineWidth = 1;
            physicsCtx.stroke();
        }
    }
    
    // Draw planets
    for (let planet of physicsObjects) {
        let x, y;
        
        if (planet.orbitRadius === 0) {
            // Sun at center
            x = centerX;
            y = centerY;
        } else {
            x = centerX + Math.cos(planet.angle) * planet.orbitRadius;
            y = centerY + Math.sin(planet.angle) * planet.orbitRadius;
        }
        
        // Glow effect for Sun
        if (planet.name === 'Mặt Trời') {
            const glow = physicsCtx.createRadialGradient(x, y, 0, x, y, planet.radius * 2);
            glow.addColorStop(0, 'rgba(253, 184, 19, 0.8)');
            glow.addColorStop(0.5, 'rgba(253, 184, 19, 0.3)');
            glow.addColorStop(1, 'rgba(253, 184, 19, 0)');
            physicsCtx.beginPath();
            physicsCtx.arc(x, y, planet.radius * 2, 0, Math.PI * 2);
            physicsCtx.fillStyle = glow;
            physicsCtx.fill();
        }
        
        // Planet body
        const gradient = physicsCtx.createRadialGradient(
            x - planet.radius * 0.3, y - planet.radius * 0.3, 0,
            x, y, planet.radius
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        gradient.addColorStop(0.5, planet.color);
        gradient.addColorStop(1, planet.color);
        
        physicsCtx.beginPath();
        physicsCtx.arc(x, y, planet.radius, 0, Math.PI * 2);
        physicsCtx.fillStyle = gradient;
        physicsCtx.fill();
        
        // Saturn's rings
        if (planet.name === 'Sao Thổ') {
            physicsCtx.beginPath();
            physicsCtx.ellipse(x, y, planet.radius * 1.8, planet.radius * 0.4, 0, 0, Math.PI * 2);
            physicsCtx.strokeStyle = '#C9B896';
            physicsCtx.lineWidth = 3;
            physicsCtx.stroke();
        }
    }
}

function updatePhysicsInfo() {
    const objectCount = document.getElementById('physicsObjectCount');
    const fpsDisplay = document.getElementById('physicsFPS');
    const collisionsDisplay = document.getElementById('physicsCollisions');
    const energyDisplay = document.getElementById('physicsEnergy');
    
    if (objectCount) objectCount.textContent = physicsObjects.length;
    if (fpsDisplay) fpsDisplay.textContent = isPhysicsRunning ? fps : 0;
    if (collisionsDisplay) collisionsDisplay.textContent = collisionCount;
    
    // Calculate total kinetic energy
    let totalEnergy = 0;
    if (physicsMode !== 'solar') {
        for (let obj of physicsObjects) {
            const speed = Math.sqrt(obj.vx * obj.vx + obj.vy * obj.vy);
            totalEnergy += 0.5 * obj.mass * speed * speed;
        }
    }
    if (energyDisplay) energyDisplay.textContent = Math.round(totalEnergy);
}

// --- SOLAR SYSTEM EXPLORER LOGIC ---
const planetsData = [
    {
        name: "Mercury",
        vietnameseName: "Sao Thủy",
        description: "Hành tinh nhỏ nhất và gần Mặt Trời nhất. Nó có bề mặt đầy miệng núi lửa giống như Mặt Trăng.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Mercury_in_true_color.jpg/290px-Mercury_in_true_color.jpg",
        stats: {
            diameter: "4,880 km",
            mass: "3.30 × 10^23 kg",
            distanceFromSun: "57.9 triệu km",
            orbitalPeriod: "88 ngày",
            rotationPeriod: "58.6 ngày",
            moons: 0
        },
        color: "text-slate-500"
    },
    {
        name: "Venus",
        vietnameseName: "Sao Kim",
        description: "Hành tinh nóng nhất hệ mặt trời do hiệu ứng nhà kính dày đặc. Nó quay ngược chiều so với hầu hết các hành tinh khác.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Venus-real_color.jpg/290px-Venus-real_color.jpg",
        stats: {
            diameter: "12,104 km",
            mass: "4.87 × 10^24 kg",
            distanceFromSun: "108.2 triệu km",
            orbitalPeriod: "225 ngày",
            rotationPeriod: "243 ngày",
            moons: 0
        },
        color: "text-yellow-600"
    },
    {
        name: "Earth",
        vietnameseName: "Trái Đất",
        description: "Hành tinh duy nhất được biết đến có sự sống. Bề mặt được bao phủ 71% bởi nước.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/290px-The_Earth_seen_from_Apollo_17.jpg",
        stats: {
            diameter: "12,742 km",
            mass: "5.97 × 10^24 kg",
            distanceFromSun: "149.6 triệu km",
            orbitalPeriod: "365.25 ngày",
            rotationPeriod: "24 giờ",
            moons: 1
        },
        color: "text-blue-600"
    },
    {
        name: "Mars",
        vietnameseName: "Sao Hỏa",
        description: "Được gọi là Hành tinh Đỏ do oxit sắt trên bề mặt. Có ngọn núi cao nhất hệ mặt trời (Olympus Mons).",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/290px-OSIRIS_Mars_true_color.jpg",
        stats: {
            diameter: "6,779 km",
            mass: "6.39 × 10^23 kg",
            distanceFromSun: "227.9 triệu km",
            orbitalPeriod: "687 ngày",
            rotationPeriod: "24.6 giờ",
            moons: 2
        },
        color: "text-red-600"
    },
    {
        name: "Jupiter",
        vietnameseName: "Sao Mộc",
        description: "Hành tinh lớn nhất hệ mặt trời. Nổi tiếng với Vết Đỏ Lớn, một cơn bão khổng lồ đã tồn tại hàng trăm năm.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg/290px-Jupiter_and_its_shrunken_Great_Red_Spot.jpg",
        stats: {
            diameter: "139,820 km",
            mass: "1.90 × 10^27 kg",
            distanceFromSun: "778.5 triệu km",
            orbitalPeriod: "11.86 năm",
            rotationPeriod: "9.9 giờ",
            moons: 79
        },
        color: "text-orange-600"
    },
    {
        name: "Saturn",
        vietnameseName: "Sao Thổ",
        description: "Nổi tiếng với hệ thống vành đai rực rỡ và phức tạp nhất. Là hành tinh có mật độ thấp nhất (nhẹ hơn nước).",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/290px-Saturn_during_Equinox.jpg",
        stats: {
            diameter: "116,460 km",
            mass: "5.68 × 10^26 kg",
            distanceFromSun: "1.4 tỷ km",
            orbitalPeriod: "29.45 năm",
            rotationPeriod: "10.7 giờ",
            moons: 82
        },
        color: "text-yellow-500"
    },
    {
        name: "Uranus",
        vietnameseName: "Sao Thiên Vương",
        description: "Hành tinh băng khổng lồ với trục quay nghiêng gần 90 độ. Có màu xanh nhạt do khí metan trong khí quyển.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Uranus2.jpg/290px-Uranus2.jpg",
        stats: {
            diameter: "50,724 km",
            mass: "8.68 × 10^25 kg",
            distanceFromSun: "2.87 tỷ km",
            orbitalPeriod: "84 năm",
            rotationPeriod: "17.2 giờ",
            moons: 27
        },
        color: "text-cyan-500"
    },
    {
        name: "Neptune",
        vietnameseName: "Sao Hải Vương",
        description: "Hành tinh xa nhất và có gió mạnh nhất hệ mặt trời. Có màu xanh đậm rực rỡ.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg/290px-Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg",
        stats: {
            diameter: "49,244 km",
            mass: "1.02 × 10^26 kg",
            distanceFromSun: "4.5 tỷ km",
            orbitalPeriod: "164.8 năm",
            rotationPeriod: "16.1 giờ",
            moons: 14
        },
        color: "text-blue-700"
    }
];

let solarInitialized = false;

function initSolarSystem() {
    if (solarInitialized) return;
    renderPlanets(planetsData);
    solarInitialized = true;
}

function renderPlanets(planets) {
    const grid = document.getElementById('planetsGrid');
    grid.innerHTML = '';

    planets.forEach(planet => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col';
        
        card.innerHTML = `
            <div class="h-48 overflow-hidden bg-slate-900 relative group">
                <img src="${planet.image}" alt="${planet.name}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                <div class="absolute bottom-3 left-4">
                    <h3 class="text-xl font-bold text-white">${planet.vietnameseName}</h3>
                    <p class="text-slate-300 text-sm">${planet.name}</p>
                </div>
            </div>
            <div class="p-4 flex-1 flex flex-col">
                <p class="text-slate-600 text-sm mb-4 line-clamp-3">${planet.description}</p>
                
                <div class="mt-auto space-y-2">
                    <div class="flex justify-between text-xs border-b border-slate-100 pb-2">
                        <span class="text-slate-500">Đường kính</span>
                        <span class="font-medium text-slate-700">${planet.stats.diameter}</span>
                    </div>
                    <div class="flex justify-between text-xs border-b border-slate-100 pb-2">
                        <span class="text-slate-500">Khoảng cách</span>
                        <span class="font-medium text-slate-700">${planet.stats.distanceFromSun}</span>
                    </div>
                    <div class="flex justify-between text-xs border-b border-slate-100 pb-2">
                        <span class="text-slate-500">Chu kỳ quỹ đạo</span>
                        <span class="font-medium text-slate-700">${planet.stats.orbitalPeriod}</span>
                    </div>
                    <div class="flex justify-between text-xs">
                        <span class="text-slate-500">Số mặt trăng</span>
                        <span class="font-medium text-slate-700">${planet.stats.moons}</span>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterPlanets() {
    const query = document.getElementById('solarSearch').value.toLowerCase();
    const filtered = planetsData.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.vietnameseName.toLowerCase().includes(query)
    );
    renderPlanets(filtered);
}

// --- SOLAR SYSTEM 3D VIEW ---
let solar3DScene, solar3DCamera, solar3DRenderer, solar3DControls;
let solar3DObjects = [];
let solar3DAnimationId;
let isSolar3DInitialized = false;
let solarRaycaster, solarMouse;
let focusedPlanet = null;
let solarSpeed = 1.0;

function setSolarView(view) {
    const btnList = document.getElementById('btnSolarList');
    const btn3D = document.getElementById('btnSolar3D');
    const grid = document.getElementById('planetsGrid');
    const container3D = document.getElementById('solar3DContainer');
    const searchContainer = document.getElementById('solarSearchContainer');
    const speedControl = document.getElementById('solarSpeedControl');

    if (view === 'list') {
        btnList.className = 'flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all bg-white text-blue-600 shadow-sm';
        btn3D.className = 'flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all text-slate-500 hover:text-slate-700';
        
        grid.classList.remove('hidden');
        container3D.classList.add('hidden');
        searchContainer.classList.remove('opacity-50', 'pointer-events-none');
        if (speedControl) speedControl.classList.add('hidden');
        
        if (solar3DAnimationId) cancelAnimationFrame(solar3DAnimationId);
    } else {
        btnList.className = 'flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all text-slate-500 hover:text-slate-700';
        btn3D.className = 'flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all bg-white text-blue-600 shadow-sm';
        
        grid.classList.add('hidden');
        container3D.classList.remove('hidden');
        searchContainer.classList.add('opacity-50', 'pointer-events-none');
        if (speedControl) speedControl.classList.remove('hidden');

        if (!isSolar3DInitialized) {
            initSolar3D();
        } else {
            animateSolar3D();
        }
    }
}

function initSolar3D() {
    const container = document.getElementById('solar3DCanvas');
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    solar3DScene = new THREE.Scene();
    solar3DScene.background = new THREE.Color(0x050b14); // Darker background

    // Camera
    solar3DCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
    // Adjust initial camera for mobile
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
        solar3DCamera.position.set(0, 250, 500); // Further back on mobile
    } else {
        solar3DCamera.position.set(0, 200, 400);
    }

    // Renderer
    solar3DRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    solar3DRenderer.setSize(width, height);
    solar3DRenderer.shadowMap.enabled = true;
    solar3DRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimize for mobile
    container.appendChild(solar3DRenderer.domElement);

    // Controls
    solar3DControls = new THREE.OrbitControls(solar3DCamera, solar3DRenderer.domElement);
    solar3DControls.enableDamping = true;
    solar3DControls.dampingFactor = 0.05;
    solar3DControls.minDistance = 50; // Prevent too close zoom
    solar3DControls.maxDistance = 800; // Prevent too far zoom
    solar3DControls.enablePan = true; // Allow panning on mobile
    solar3DControls.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN // 2 fingers for zoom+pan
    };

    // Raycaster for interaction
    solarRaycaster = new THREE.Raycaster();
    solarMouse = new THREE.Vector2();
    
    // Mouse click
    solar3DRenderer.domElement.addEventListener('click', onSolar3DClick, false);
    
    // Touch tap (fix for mobile)
    let touchStartTime = 0;
    let touchStartPos = new THREE.Vector2();
    
    solar3DRenderer.domElement.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            touchStartTime = Date.now();
            touchStartPos.set(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: false });
    
    solar3DRenderer.domElement.addEventListener('touchend', (e) => {
        if (e.changedTouches.length === 1) {
            const touchEndTime = Date.now();
            const touchEndPos = new THREE.Vector2(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
            const distance = touchStartPos.distanceTo(touchEndPos);
            const duration = touchEndTime - touchStartTime;
            
            // If tap is quick (< 500ms) and didn't move much (< 10px)
            if (duration < 500 && distance < 10) {
                // Prevent ghost click
                if (e.cancelable) e.preventDefault();
                
                const fakeEvent = {
                    clientX: touchEndPos.x,
                    clientY: touchEndPos.y
                };
                onSolar3DClick(fakeEvent);
            }
        }
    }, { passive: false });

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x333333); // Softer ambient
    solar3DScene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 2, 1000); // Sun light
    solar3DScene.add(pointLight);

    // Stars
    addStars();

    // Sun
    const sunGeometry = new THREE.SphereGeometry(20, 64, 64);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffdd00 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.userData = { name: 'Sun', isPlanet: true };
    solar3DScene.add(sun);
    
    // Glow effect for Sun
    const sunGlowGeo = new THREE.SphereGeometry(24, 64, 64);
    const sunGlowMat = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.2 });
    const sunGlow = new THREE.Mesh(sunGlowGeo, sunGlowMat);
    solar3DScene.add(sunGlow);

    // Planets Data
    const planets3D = [
        { name: "Mercury", color: 0xaaaaaa, size: 2, distance: 35, speed: 0.04, roughness: 0.7 },
        { name: "Venus", color: 0xe3bb76, size: 4, distance: 50, speed: 0.015, roughness: 0.5 },
        { name: "Earth", color: 0x2233ff, size: 4.2, distance: 70, speed: 0.01, roughness: 0.6 },
        { name: "Mars", color: 0xff3300, size: 3, distance: 90, speed: 0.008, roughness: 0.8 },
        { name: "Jupiter", color: 0xdcae96, size: 12, distance: 140, speed: 0.004, roughness: 0.4 },
        { name: "Saturn", color: 0xf4d03f, size: 10, distance: 190, speed: 0.003, roughness: 0.4, ring: { inner: 14, outer: 22, color: 0xc0a392 } },
        { name: "Uranus", color: 0x73c6b6, size: 7, distance: 240, speed: 0.002, roughness: 0.5 },
        { name: "Neptune", color: 0x2e86c1, size: 7, distance: 280, speed: 0.001, roughness: 0.5 }
    ];

    solar3DObjects = [];

    planets3D.forEach(p => {
        // Orbit path
        const orbitGeo = new THREE.RingGeometry(p.distance - 0.2, p.distance + 0.2, 256);
        const orbitMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa, side: THREE.DoubleSide, transparent: true, opacity: 0.15 });
        const orbit = new THREE.Mesh(orbitGeo, orbitMat);
        orbit.rotation.x = Math.PI / 2;
        solar3DScene.add(orbit);

        // Soft glow around orbit for visibility
        const orbitGlowGeo = new THREE.RingGeometry(p.distance - 0.6, p.distance + 0.6, 128);
        const orbitGlowMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa, side: THREE.DoubleSide, transparent: true, opacity: 0.05 });
        const orbitGlow = new THREE.Mesh(orbitGlowGeo, orbitGlowMat);
        orbitGlow.rotation.x = Math.PI / 2;
        solar3DScene.add(orbitGlow);

        // Planet Group
        const planetGroup = new THREE.Group();
        solar3DScene.add(planetGroup);

        // Planet Mesh
        const geometry = new THREE.SphereGeometry(p.size, 64, 64);
        const material = new THREE.MeshStandardMaterial({ 
            color: p.color, 
            roughness: p.roughness,
            metalness: 0.1
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = p.distance;
        mesh.userData = { name: p.name, isPlanet: true };
        
        // Add to group
        planetGroup.add(mesh);

        // Rings for Saturn
        if (p.ring) {
            const ringGeo = new THREE.RingGeometry(p.ring.inner, p.ring.outer, 64);
            const ringMat = new THREE.MeshStandardMaterial({ 
                color: p.ring.color, 
                side: THREE.DoubleSide, 
                transparent: true, 
                opacity: 0.8,
                roughness: 0.8
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = Math.PI / 2;
            mesh.add(ring);
        }

        // Store for animation
        solar3DObjects.push({
            group: planetGroup,
            mesh: mesh,
            speed: p.speed,
            name: p.name,
            distance: p.distance,
            size: p.size
        });
    });

    // Handle Resize
    window.addEventListener('resize', onWindowResize, false);

    isSolar3DInitialized = true;
    animateSolar3D();
}

function onSolar3DClick(event) {
    const container = document.getElementById('solar3DCanvas');
    const rect = container.getBoundingClientRect();
    
    solarMouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
    solarMouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

    solarRaycaster.setFromCamera(solarMouse, solar3DCamera);

    const meshes = solar3DObjects.map(obj => obj.mesh);
    // Include Sun for interaction
    const sunObj = solar3DScene.children.find(ch => ch.userData && ch.userData.name === 'Sun');
    if (sunObj) meshes.push(sunObj);
    const intersects = solarRaycaster.intersectObjects(meshes);

    if (intersects.length > 0) {
        const object = intersects[0].object;
        const planetName = object.userData.name;
        const planetObj = planetName === 'Sun'
            ? { mesh: object, name: 'Sun', size: 20 }
            : solar3DObjects.find(p => p.name === planetName);
        if (planetObj) focusPlanet(planetObj);
    } else {
        // Click outside to reset
        focusedPlanet = null;
        document.getElementById('planetInfo3D').classList.add('hidden');
    }
}

function focusPlanet(planetObj) {
    // Close any existing info card
    const infoCard = document.getElementById('planetInfo3D');
    if (!infoCard.classList.contains('hidden')) {
        infoCard.classList.add('hidden');
    }

    focusedPlanet = planetObj;

    // Show Info Card
    const nameEl = document.getElementById('p3dName');
    const descEl = document.getElementById('p3dDesc');
    const statsEl = document.getElementById('p3dStats');

    const data = planetsData.find(p => p.name === planetObj.name);

    if (data || planetObj.name === 'Sun') {
        if (planetObj.name === 'Sun') {
            nameEl.innerHTML = `<span class="w-2 h-6 bg-yellow-400 rounded-full block mr-2"></span>Mặt Trời`;
            nameEl.className = `text-xl font-bold mb-2 flex items-center text-amber-400`;
            descEl.textContent = 'Ngôi sao ở trung tâm hệ mặt trời, cung cấp năng lượng và ánh sáng cho các hành tinh. Nhiệt độ bề mặt ~5,500°C.';
            statsEl.innerHTML = `
                <div><span class="text-slate-500">Đường kính:</span> <span class="text-white">1,392,700 km</span></div>
                <div><span class="text-slate-500">Khối lượng:</span> <span class="text-white">1.989 × 10^30 kg</span></div>
                <div><span class="text-slate-500">Loại sao:</span> <span class="text-white">G-type (dải chính)</span></div>
                <div><span class="text-slate-500">Khoảng cách Trái Đất:</span> <span class="text-white">~149.6 triệu km</span></div>
            `;
        } else {
            nameEl.innerHTML = `<span class="w-2 h-6 bg-blue-500 rounded-full block mr-2"></span>${data.vietnameseName}`;
            nameEl.className = `text-xl font-bold mb-2 flex items-center ${data.color}`;
            descEl.textContent = data.description;
            statsEl.innerHTML = `
                <div><span class="text-slate-500">Đường kính:</span> <span class="text-white">${data.stats.diameter}</span></div>
                <div><span class="text-slate-500">Khoảng cách:</span> <span class="text-white">${data.stats.distanceFromSun}</span></div>
                <div><span class="text-slate-500">Chu kỳ:</span> <span class="text-white">${data.stats.orbitalPeriod}</span></div>
                <div><span class="text-slate-500">Mặt trăng:</span> <span class="text-white">${data.stats.moons}</span></div>
            `;
        }

        // Add close button functionality
        const closeButton = document.getElementById('planetInfoClose');
        if (closeButton) {
            closeButton.onclick = () => {
                infoCard.classList.add('hidden');
                focusedPlanet = null;
            };
        }

        infoCard.classList.remove('hidden');
    }
}

function addStars() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i < 2000; i++) {
        vertices.push(
            THREE.MathUtils.randFloatSpread(2000),
            THREE.MathUtils.randFloatSpread(2000),
            THREE.MathUtils.randFloatSpread(2000)
        );
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const material = new THREE.PointsMaterial({ color: 0xffffff, size: 1.2, transparent: true, opacity: 0.8 });
    const stars = new THREE.Points(geometry, material);
    solar3DScene.add(stars);
}

function onWindowResize() {
    if (!solar3DCamera || !solar3DRenderer) return;
    const container = document.getElementById('solar3DContainer');
    if (container.classList.contains('hidden')) return;
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    solar3DCamera.aspect = width / height;
    solar3DCamera.updateProjectionMatrix();
    solar3DRenderer.setSize(width, height);
}

function animateSolar3D() {
    solar3DAnimationId = requestAnimationFrame(animateSolar3D);
    
    solar3DObjects.forEach(obj => {
        obj.group.rotation.y += obj.speed * solarSpeed;
        obj.mesh.rotation.y += 0.02; // Self rotation
    });

    // Camera following logic
    if (focusedPlanet) {
        // Smooth scale-up effect for focused object
        const currentScale = focusedPlanet.mesh.scale.x;
        const targetScale = 1.35; // enlarge
        const newScale = currentScale + (targetScale - currentScale) * 0.08;
        focusedPlanet.mesh.scale.set(newScale, newScale, newScale);

        const targetVec = new THREE.Vector3();
        focusedPlanet.mesh.getWorldPosition(targetVec);
        
        // Smoothly move controls target to planet
        solar3DControls.target.lerp(targetVec, 0.05);
        
        // Calculate desired camera position (offset from planet)
        // Offset depends on planet size to ensure it fills view nicely but not too close
        const offsetDistance = focusedPlanet.size * 4 + 10;
        const relativeOffset = new THREE.Vector3(offsetDistance, offsetDistance * 0.5, offsetDistance);
        const desiredCamPos = targetVec.clone().add(relativeOffset);
        
        // Smoothly move camera
        solar3DCamera.position.lerp(desiredCamPos, 0.05);

        // Update Info Card Position
        const infoCard = document.getElementById('planetInfo3D');
        if (!infoCard.classList.contains('hidden')) {
            const isMobile = window.innerWidth < 640; // sm breakpoint
            
            if (isMobile) {
                // On mobile: fixed bottom center (already styled with Tailwind classes)
                // No need to reposition dynamically
                infoCard.style.transform = '';
                infoCard.style.top = 'auto';
                infoCard.style.left = '50%';
                infoCard.style.bottom = '1rem';
            } else {
                // On desktop: floating label next to planet
                const labelPos = targetVec.clone();
                labelPos.y += focusedPlanet.size * 1.5; // Slightly above center
                labelPos.x += focusedPlanet.size * 1.5; // Slightly right

                labelPos.project(solar3DCamera);

                const container = document.getElementById('solar3DCanvas');
                const x = (labelPos.x * .5 + .5) * container.clientWidth;
                const y = (labelPos.y * -.5 + .5) * container.clientHeight;

                // Add some offset in pixels
                infoCard.style.transform = `translate(${x + 20}px, ${y - 20}px)`;
                infoCard.style.top = '0';
                infoCard.style.left = '0';
                infoCard.style.bottom = 'auto';
            }
        }
    }

    solar3DControls.update();
    solar3DRenderer.render(solar3DScene, solar3DCamera);
}

function toggleSolarSpeedDropdown(event) {
    event.stopPropagation();
    const menu = document.getElementById('solarSpeedMenu');
    const arrow = document.getElementById('solarSpeedArrow');
    
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        if (arrow) arrow.style.transform = 'rotate(180deg)';
    } else {
        menu.classList.add('hidden');
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    }
}

function setSolarSpeed(speed) {
    solarSpeed = speed;
    const label = document.getElementById('solarSpeedLabel');
    if (label) label.textContent = `${speed.toFixed(1)}x`;
    
    // Update active state in dropdown
    const options = document.querySelectorAll('.speed-option');
    options.forEach(opt => {
        const val = parseFloat(opt.getAttribute('data-value'));
        const checkIcon = opt.querySelector('.material-symbols-outlined');
        
        if (val === speed) {
            opt.classList.remove('text-slate-600', 'hover:bg-slate-50', 'hover:text-slate-900');
            opt.classList.add('text-blue-600', 'bg-blue-50', 'font-medium');
            checkIcon.classList.remove('opacity-0', 'group-hover:opacity-100');
        } else {
            opt.classList.add('text-slate-600', 'hover:bg-slate-50', 'hover:text-slate-900');
            opt.classList.remove('text-blue-600', 'bg-blue-50', 'font-medium');
            checkIcon.classList.add('opacity-0', 'group-hover:opacity-100');
        }
    });

    const menu = document.getElementById('solarSpeedMenu');
    const arrow = document.getElementById('solarSpeedArrow');
    if (menu) menu.classList.add('hidden');
    if (arrow) arrow.style.transform = 'rotate(0deg)';
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    // Solar Speed Menu
    const solarMenu = document.getElementById('solarSpeedMenu');
    const solarBtn = document.getElementById('solarSpeedBtn');
    if (solarMenu && !solarMenu.classList.contains('hidden') && solarBtn && !solarBtn.contains(e.target) && !solarMenu.contains(e.target)) {
        solarMenu.classList.add('hidden');
        const arrow = document.getElementById('solarSpeedArrow');
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    }

    // Physics Speed Menu
    const physicsMenu = document.getElementById('physicsSpeedMenu');
    const physicsBtn = document.getElementById('physicsSpeedBtn');
    if (physicsMenu && !physicsMenu.classList.contains('hidden') && physicsBtn && !physicsBtn.contains(e.target) && !physicsMenu.contains(e.target)) {
        physicsMenu.classList.add('hidden');
        const arrow = document.getElementById('physicsSpeedArrow');
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    }
    
    // Continent Dropdown
    const continentMenu = document.getElementById('continentDropdownMenu');
    const continentBtn = document.getElementById('continentFilterBtn');
    if (continentMenu && !continentMenu.classList.contains('hidden') && continentBtn && !continentBtn.contains(e.target) && !continentMenu.contains(e.target)) {
        continentMenu.classList.add('hidden');
        const arrow = document.getElementById('continentDropdownArrow');
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    }

    // BMI Activity Dropdown
    const bmiMenu = document.getElementById('bmiActivityMenu');
    const bmiBtn = document.getElementById('bmiActivityBtn');
    if (bmiMenu && !bmiMenu.classList.contains('hidden') && bmiBtn && !bmiBtn.contains(e.target) && !bmiMenu.contains(e.target)) {
        bmiMenu.classList.add('hidden');
        const arrow = document.getElementById('bmiActivityArrow');
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    }
});

// BMI Activity Dropdown Logic
function toggleActivityDropdown() {
    const menu = document.getElementById('bmiActivityMenu');
    const arrow = document.getElementById('bmiActivityArrow');
    
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        arrow.style.transform = 'rotate(180deg)';
    } else {
        menu.classList.add('hidden');
        arrow.style.transform = 'rotate(0deg)';
    }
}

function setActivityLevel(value, label) {
    document.getElementById('bmiActivity').value = value;
    document.getElementById('bmiActivityLabel').innerText = label;
    
    // Update active state
    const options = document.querySelectorAll('.activity-option');
    options.forEach(opt => {
        const val = parseFloat(opt.getAttribute('data-value'));
        const checkIcon = opt.querySelector('.material-symbols-outlined');
        
        if (val === value) {
            opt.classList.remove('text-slate-600', 'hover:bg-slate-50', 'hover:text-slate-900');
            opt.classList.add('text-blue-600', 'bg-blue-50', 'font-medium');
            checkIcon.classList.remove('opacity-0');
        } else {
            opt.classList.add('text-slate-600', 'hover:bg-slate-50', 'hover:text-slate-900');
            opt.classList.remove('text-blue-600', 'bg-blue-50', 'font-medium');
            checkIcon.classList.add('opacity-0');
        }
    });

    toggleActivityDropdown();
    calculateBMI();
}

// BMI/BMR Calculator Logic
function calculateBMI() {
    const height = parseFloat(document.getElementById('bmiHeight').value);
    const weight = parseFloat(document.getElementById('bmiWeight').value);
    const age = parseInt(document.getElementById('bmiAge').value);
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const activity = parseFloat(document.getElementById('bmiActivity').value);

    if (!height || !weight || !age) return;

    // Calculate BMI
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    
    // Update BMI Display
    document.getElementById('bmiValue').innerText = bmi.toFixed(1);
    
    let status = '';
    let colorClass = '';
    let progress = 0;

    if (bmi < 18.5) {
        status = 'Thiếu cân';
        colorClass = 'text-blue-600 bg-blue-50';
        progress = 15;
    } else if (bmi < 24.9) {
        status = 'Bình thường';
        colorClass = 'text-green-600 bg-green-50';
        progress = 50;
    } else if (bmi < 29.9) {
        status = 'Thừa cân';
        colorClass = 'text-orange-600 bg-orange-50';
        progress = 75;
    } else {
        status = 'Béo phì';
        colorClass = 'text-red-600 bg-red-50';
        progress = 100;
    }

    const statusEl = document.getElementById('bmiStatus');
    statusEl.innerText = status;
    statusEl.className = `text-sm font-medium px-3 py-1 rounded-full inline-block ${colorClass}`;
    
    document.getElementById('bmiProgress').style.width = `${progress}%`;
    
    // Update Circle Color
    const circle = document.getElementById('bmiCircle');
    circle.className = `w-16 h-16 rounded-full border-4 flex items-center justify-center transition-colors ${colorClass.replace('bg-', 'border-').replace('50', '100')}`;
    circle.querySelector('span').className = `material-symbols-outlined text-3xl ${colorClass.split(' ')[0]}`;

    // Calculate BMR (Mifflin-St Jeor Equation)
    let bmr = 0;
    if (gender === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    // Calculate TDEE
    const tdee = bmr * activity;

    document.getElementById('bmrValue').innerText = Math.round(bmr).toLocaleString();
    document.getElementById('tdeeValue').innerText = Math.round(tdee).toLocaleString();
}

// JSON Formatter Logic
function formatJSON() {
    const input = document.getElementById('jsonInput').value;
    const output = document.getElementById('jsonOutput');
    const errorBox = document.getElementById('jsonError');
    const errorMessage = document.getElementById('jsonErrorMessage');

    if (!input.trim()) {
        output.value = '';
        errorBox.classList.add('hidden');
        return;
    }

    try {
        const parsed = JSON.parse(input);
        output.value = JSON.stringify(parsed, null, 4);
        errorBox.classList.add('hidden');
    } catch (e) {
        output.value = '';
        errorBox.classList.remove('hidden');
        errorMessage.textContent = e.message;
    }
}

function minifyJSON() {
    const input = document.getElementById('jsonInput').value;
    const output = document.getElementById('jsonOutput');
    const errorBox = document.getElementById('jsonError');
    const errorMessage = document.getElementById('jsonErrorMessage');

    if (!input.trim()) {
        output.value = '';
        errorBox.classList.add('hidden');
        return;
    }

    try {
        const parsed = JSON.parse(input);
        output.value = JSON.stringify(parsed);
        errorBox.classList.add('hidden');
    } catch (e) {
        output.value = '';
        errorBox.classList.remove('hidden');
        errorMessage.textContent = e.message;
    }
}

function copyJSON() {
    const output = document.getElementById('jsonOutput');
    if (!output.value) return;
    
    output.select();
    document.execCommand('copy');
    
    // Visual feedback
    const btn = event.currentTarget;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<span class="material-symbols-outlined text-[16px]">check</span> Copied';
    btn.classList.add('text-green-600', 'border-green-200', 'bg-green-50');
    
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.classList.remove('text-green-600', 'border-green-200', 'bg-green-50');
    }, 2000);
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    switchTab('home');
});




// --- CSS GENERATOR LOGIC ---
let currentCssTool = 'shadow';

function switchCssTool(tool) {
    currentCssTool = tool;
    
    // Update buttons
    document.querySelectorAll('.css-tool-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-blue-50', 'text-blue-600', 'ring-1', 'ring-blue-200');
        btn.classList.add('text-slate-600', 'hover:bg-slate-50', 'hover:text-slate-900');
    });
    
    const activeBtn = document.getElementById(`btn-css-${tool}`);
    activeBtn.classList.remove('text-slate-600', 'hover:bg-slate-50', 'hover:text-slate-900');
    activeBtn.classList.add('active', 'bg-blue-50', 'text-blue-600', 'ring-1', 'ring-blue-200');
    
    // Show/Hide controls
    document.querySelectorAll('.css-controls').forEach(el => el.classList.add('hidden'));
    document.getElementById(`controls-${tool}`).classList.remove('hidden');
    
    // Reset preview box styles that might conflict
    const preview = document.getElementById('css-preview-box');
    preview.style = ''; // Clear inline styles
    preview.className = "w-48 h-48 bg-white border border-slate-200 flex items-center justify-center transition-all duration-200 shadow-sm"; // Reset classes

    // Re-apply current tool styles
    updateCSS();
}

function updateCSS() {
    const preview = document.getElementById('css-preview-box');
    const output = document.getElementById('css-output');
    
    // Helper to hex to rgba
    const hexToRgba = (hex, alpha) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    if (currentCssTool === 'shadow') {
        const x = document.getElementById('shadow-x').value;
        const y = document.getElementById('shadow-y').value;
        const blur = document.getElementById('shadow-blur').value;
        const spread = document.getElementById('shadow-spread').value;
        const opacity = document.getElementById('shadow-opacity').value;
        const color = document.getElementById('shadow-color').value;
        const inset = document.getElementById('shadow-inset').checked;
        
        // Update labels
        document.getElementById('val-shadow-x').innerText = `${x}px`;
        document.getElementById('val-shadow-y').innerText = `${y}px`;
        document.getElementById('val-shadow-blur').innerText = `${blur}px`;
        document.getElementById('val-shadow-spread').innerText = `${spread}px`;
        document.getElementById('val-shadow-opacity').innerText = opacity;
        
        const rgba = hexToRgba(color, opacity);
        const shadowValue = `${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px ${rgba}`;
        
        preview.style.boxShadow = shadowValue;
        output.value = `box-shadow: ${shadowValue};`;
        
    } else if (currentCssTool === 'gradient') {
        const type = document.getElementById('gradient-type').value;
        const angle = document.getElementById('gradient-angle').value;
        const color1 = document.getElementById('gradient-color1').value;
        const color2 = document.getElementById('gradient-color2').value;
        
        // Update labels
        document.getElementById('val-gradient-angle').innerText = `${angle}deg`;
        
        // Toggle angle slider visibility
        const angleGroup = document.getElementById('gradient-angle-group');
        if (type === 'radial') {
            angleGroup.classList.add('hidden');
        } else {
            angleGroup.classList.remove('hidden');
        }
        
        let gradientValue = '';
        if (type === 'linear') {
            gradientValue = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
        } else {
            gradientValue = `radial-gradient(circle, ${color1}, ${color2})`;
        }
        
        preview.style.background = gradientValue;
        output.value = `background: ${gradientValue};`;
        
    } else if (currentCssTool === 'radius') {
        const isIndividual = document.getElementById('radius-individual').checked;
        const individualControls = document.getElementById('radius-individual-controls');
        const allControl = document.getElementById('radius-all').parentElement;
        
        let radiusValue = '';
        
        if (isIndividual) {
            individualControls.classList.remove('opacity-50', 'pointer-events-none');
            allControl.classList.add('opacity-50', 'pointer-events-none');
            
            const tl = document.getElementById('radius-tl').value;
            const tr = document.getElementById('radius-tr').value;
            const br = document.getElementById('radius-br').value;
            const bl = document.getElementById('radius-bl').value;
            
            document.getElementById('val-radius-tl').innerText = `${tl}px`;
            document.getElementById('val-radius-tr').innerText = `${tr}px`;
            document.getElementById('val-radius-br').innerText = `${br}px`;
            document.getElementById('val-radius-bl').innerText = `${bl}px`;
            
            radiusValue = `${tl}px ${tr}px ${br}px ${bl}px`;
        } else {
            individualControls.classList.add('opacity-50', 'pointer-events-none');
            allControl.classList.remove('opacity-50', 'pointer-events-none');
            
            const all = document.getElementById('radius-all').value;
            document.getElementById('val-radius-all').innerText = `${all}px`;
            
            radiusValue = `${all}px`;
        }
        
        preview.style.borderRadius = radiusValue;
        // Add a border so radius is visible if background is white
        preview.style.border = '4px solid #3b82f6'; 
        output.value = `border-radius: ${radiusValue};`;
    }
}

function copyCssCode() {
    const output = document.getElementById('css-output');
    output.select();
    document.execCommand('copy');
    
    // Visual feedback
    const btn = document.querySelector('#tab-css button[onclick="copyCssCode()"]');
    const originalContent = btn.innerHTML;
    btn.innerHTML = `<span class="material-symbols-outlined text-[16px]">check</span> Copied!`;
    btn.classList.add('text-green-400');
    
    setTimeout(() => {
        btn.innerHTML = originalContent;
        btn.classList.remove('text-green-400');
    }, 2000);
}

// Initialize CSS Generator
// We can call this safely because script.js is loaded at the end of body
updateCSS();

// --- CUSTOM DROPDOWN LOGIC ---
function toggleGradientTypeDropdown() {
    const menu = document.getElementById('gradient-type-menu');
    const arrow = document.getElementById('gradient-type-arrow');
    
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        arrow.style.transform = 'rotate(180deg)';
        
        // Close on outside click
        const closeDropdown = (e) => {
            if (!e.target.closest('#controls-gradient .relative')) {
                menu.classList.add('hidden');
                arrow.style.transform = 'rotate(0deg)';
                document.removeEventListener('click', closeDropdown);
            }
        };
        setTimeout(() => {
            document.addEventListener('click', closeDropdown);
        }, 0);
    } else {
        menu.classList.add('hidden');
        arrow.style.transform = 'rotate(0deg)';
    }
}

function selectGradientType(value, label) {
    // Update hidden input
    document.getElementById('gradient-type').value = value;
    
    // Update button label
    document.getElementById('gradient-type-label').innerText = label;
    
    // Update checkmarks
    document.getElementById('check-linear').classList.add('hidden');
    document.getElementById('check-radial').classList.add('hidden');
    document.getElementById(`check-${value}`).classList.remove('hidden');
    
    // Close dropdown
    document.getElementById('gradient-type-menu').classList.add('hidden');
    document.getElementById('gradient-type-arrow').style.transform = 'rotate(0deg)';
    
    // Trigger CSS update
    updateCSS();
}
