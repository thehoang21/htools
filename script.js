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
    location.reload();
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

function switchTab(tabName) {
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.getElementById('nav-' + tabName).classList.add('active');

    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    const activeContent = document.getElementById('tab-' + tabName);
    activeContent.classList.remove('hidden');
    activeContent.classList.remove('opacity-0');
    activeContent.classList.add('animate-fade-in');

    const titles = {
        'time': 'Thời gian',
        'calculator': 'Tính Công',
        'salary': 'Tính Lương Tháng',
        'tax': 'Tính Thuế TNCN',
        'compound': 'Tính Lãi Suất Kép',
        'sorting': 'Biểu Diễn Thuật Toán',
        'typing': 'Kiểm Tra Tốc Độ Gõ'
    };
    document.getElementById('pageTitle').innerText = titles[tabName];

    if (tabName === 'time') {
        initTime();
    } else if (tabName === 'sorting') {
        initSorting();
    } else if (tabName === 'typing') {
        initTypingTest();
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
        btn.classList.remove('bg-green-600', 'hover:bg-green-700', 'text-white', 'border-transparent');
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

loadSettings();
calculate();
calculateSalary();
calculateTax();

// Initialize time tab on first load (it's the default tab)
setTimeout(() => {
    if (document.getElementById('tab-time') && !document.getElementById('tab-time').classList.contains('hidden')) {
        initTime();
    }
}, 100);

// --- CUSTOM DROPDOWN LOGIC ---
function toggleRegionDropdown(event) {
    if (event) {
        event.stopPropagation();
    }
    const menu = document.getElementById('regionDropdownMenu');
    const arrow = document.getElementById('regionDropdownArrow');
    const isHidden = menu.classList.contains('hidden');
    
    if (isHidden) {
        menu.classList.remove('hidden');
        arrow.style.transform = 'rotate(180deg)';
    } else {
        menu.classList.add('hidden');
        arrow.style.transform = 'rotate(0deg)';
    }
}

function selectRegion(value, text) {
    const input = document.getElementById('taxRegion');
    const textSpan = document.getElementById('regionSelectedText');
    const menu = document.getElementById('regionDropdownMenu');
    const arrow = document.getElementById('regionDropdownArrow');
    
    // Update value and text
    input.value = value;
    textSpan.innerText = text;
    
    // Update visual selection state
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
    menu.classList.add('hidden');
    arrow.style.transform = 'rotate(0deg)';
    
    // Trigger calculation
    calculateTax();
    saveSettings(); 
}

// Initialize dropdown state on load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const input = document.getElementById('taxRegion');
        if (input) {
            const regionMap = {
                '1': 'Vùng I (4.960.000đ)',
                '2': 'Vùng II (4.410.000đ)',
                '3': 'Vùng III (3.860.000đ)',
                '4': 'Vùng IV (3.450.000đ)'
            };
            const val = input.value || '1';
            const textSpan = document.getElementById('regionSelectedText');
            if (textSpan && regionMap[val]) {
                textSpan.innerText = regionMap[val];
                
                document.querySelectorAll('.region-option').forEach(option => {
                    const checkIcon = option.querySelector('.check-icon');
                    if (option.dataset.value == val) {
                        option.classList.add('bg-blue-50', 'text-blue-700');
                        checkIcon.classList.remove('opacity-0');
                    } else {
                        option.classList.remove('bg-blue-50', 'text-blue-700');
                        checkIcon.classList.add('opacity-0');
                    }
                });
            }
        }
    }, 100);
});

// --- EXPORT TAX REPORT ---
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

    const regionMap = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV' };

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
        timeEl.innerText = targetTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
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


