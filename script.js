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
        'calculator': 'Tính Công',
        'salary': 'Tính Lương Tháng',
        'tax': 'Tính Thuế TNCN'
    };
    document.getElementById('pageTitle').innerText = titles[tabName];

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

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const menu = document.getElementById('regionDropdownMenu');
    const btn = document.getElementById('regionDropdownBtn');
    
    if (menu && !menu.classList.contains('hidden') && !btn.contains(event.target) && !menu.contains(event.target)) {
        menu.classList.add('hidden');
        const arrow = document.getElementById('regionDropdownArrow');
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    }
});

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
