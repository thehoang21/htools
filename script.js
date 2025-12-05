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
                'salary': 'Tính Lương Tháng'
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
            const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, Header, Footer } = docx;

            // Recalculate values to ensure freshness
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
                                            color: "E2E8F0", // Very light gray
                                            size: 60, // 30pt
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
                        
                        // 1. CẤU HÌNH
                        new Paragraph({
                            text: "1. CẤU HÌNH",
                            heading: HeadingLevel.HEADING_2,
                            spacing: { before: 200, after: 100 }
                        }),
                        new Paragraph({ text: `• Ca làm việc: ${startTime} → ${endTime}`, bullet: { level: 0 } }),
                        new Paragraph({ text: `• Nghỉ trưa: ${breakStart} → ${breakEnd}`, bullet: { level: 0 } }),
                        new Paragraph({ text: `• Tính OT từ: ${otThreshold} (Hệ số ${otCoeff})`, bullet: { level: 0 } }),
                        new Paragraph({ text: `• Số ngày làm: ${workDays} ngày`, bullet: { level: 0 } }),

                        // 2. KẾT QUẢ 1 NGÀY
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

                        // 3. TỔNG KẾT THÁNG
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
                        
                        // Footer
                        new Paragraph({
                            text: `Xuất lúc: ${new Date().toLocaleString('vi-VN')}`,
                            alignment: AlignmentType.RIGHT,
                            spacing: { before: 400 },
                            style: "Subtitle"
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
            // Remove non-digit chars
            let value = input.value.replace(/\D/g, '');
            if (value === '') {
                input.value = '';
                return;
            }
            // Format with commas
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
            
            // 1. Get Inputs
            const salaryGross = parseCurrency(document.getElementById('salaryGross').value);
            const salaryInsuranceInput = parseCurrency(document.getElementById('salaryInsurance').value);
            const salaryInsurance = salaryInsuranceInput > 0 ? salaryInsuranceInput : salaryGross;
            
            const actualWorkDays = parseFloat(document.getElementById('actualWorkDays').value) || 0;
            const paidLeaveDays = parseFloat(document.getElementById('paidLeaveDays').value) || 0;
            const dependents = parseInt(document.getElementById('dependents').value) || 0;
            const allowance = parseCurrency(document.getElementById('allowance').value);
            const otherDeductions = parseCurrency(document.getElementById('otherDeductions').value);
            const stdWorkDays = parseFloat(document.getElementById('stdWorkDays').value) || 26;

            // 2. Calculate Income
            // Logic:
            // - Dưới 22 công: (Lương thỏa thuận / 22) × Số ngày công thực tế
            // - Từ 22 - 26 công: 100% Lương thỏa thuận
            // - Trên 26 công: (Lương thỏa thuận / 26) × Số ngày công thực tế
            
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

            // Split for display
            const salaryByWork = totalDays > 0 ? (totalSalaryFromDays * actualWorkDays / totalDays) : 0;
            
            // Paid Leave Salary: Based on Insurance Salary / 26 * Paid Leave Days
            const salaryByLeave = (salaryInsurance / 26) * paidLeaveDays;
            
            const grossTotal = salaryByWork + salaryByLeave + allowance;

            // 3. Calculate Insurance (Vietnam 2025 Rules)
            // Base Salary (Lương cơ sở) = 2,340,000 VND (from 1/7/2024)
            // Max BHXH/BHYT Base = 20 * 2,340,000 = 46,800,000
            // Max BHTN Base (Region 1) = 20 * 4,960,000 = 99,200,000
            
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

            // 4. Calculate PIT (Thuế TNCN)
            // Taxable Income = Gross Total - Insurance - Personal Deductions
            // Note: Allowance might be tax-exempt (e.g. lunch, phone), but for simplicity we assume taxable unless specified.
            // Usually Lunch (730k) is exempt. We'll assume "Allowance" is fully taxable for this simple tool, 
            // or user subtracts exempt part from input.
            
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

            // 5. Final Net
            const totalDeductions = totalInsurance + otherDeductions + pit; // PIT is deducted from Net payout usually? 
            // Wait, Net = Gross - Insurance - PIT - Other Deductions.
            // The UI shows "Total Deductions" (B) which includes Insurance + Other.
            // Then Net = Gross - Total Deductions (B) - PIT? Or is PIT included in B?
            // In the UI image: "B. Các khoản khấu trừ" lists Insurance + Other.
            // Then "Tổng khấu trừ" (Total Deductions).
            // Then "Lương thực nhận (NET)".
            // Then "Thuế TNCN" is listed separately at bottom.
            // Usually Net = Gross - Insurance - Other - PIT.
            // I will calculate Net = Gross - Insurance - Other - PIT.
            
            const netSalary = grossTotal - totalInsurance - otherDeductions - pit;

            // 6. Update UI
            const fmt = (n) => Math.round(n).toLocaleString('en-US') + ' ₫';
            
            document.getElementById('outSalaryWork').innerText = fmt(salaryByWork);
            document.getElementById('outWorkDays').innerText = `(${actualWorkDays} ngày)`;
            
            document.getElementById('outSalaryLeave').innerText = fmt(salaryByLeave);
            document.getElementById('outLeaveDays').innerText = `(${paidLeaveDays} ngày)`;
            
            document.getElementById('outAllowance').innerText = '+' + fmt(allowance);
            
            document.getElementById('outGrossTotal').innerText = fmt(grossTotal);
            
            document.getElementById('outBHXH').innerText = '-' + fmt(bhxh);
            document.getElementById('outBHYT').innerText = '-' + fmt(bhyt);
            document.getElementById('outBHTN').innerText = '-' + fmt(bhtn);
            document.getElementById('outOtherDeductions').innerText = '-' + fmt(otherDeductions);
            
            const displayTotalDeductions = totalInsurance + otherDeductions; // Excludes PIT in the "Total Deductions" line usually, or includes?
            // Let's follow standard: Total Deductions usually means Insurance + Union Fee etc. PIT is separate.
            document.getElementById('outTotalDeductions').innerText = '-' + fmt(displayTotalDeductions);
            
            document.getElementById('outNetSalary').innerText = fmt(netSalary);
            document.getElementById('outPIT').innerText = fmt(pit);
        }

        function exportSalaryReport() {
            const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, Header, Table, TableRow, TableCell, WidthType, BorderStyle } = docx;

            // 1. Get Inputs & Recalculate (to get raw numbers)
            const salaryGross = parseCurrency(document.getElementById('salaryGross').value);
            const salaryInsuranceInput = parseCurrency(document.getElementById('salaryInsurance').value);
            const salaryInsurance = salaryInsuranceInput > 0 ? salaryInsuranceInput : salaryGross;
            
            const actualWorkDays = parseFloat(document.getElementById('actualWorkDays').value) || 0;
            const paidLeaveDays = parseFloat(document.getElementById('paidLeaveDays').value) || 0;
            const dependents = parseInt(document.getElementById('dependents').value) || 0;
            const allowance = parseCurrency(document.getElementById('allowance').value);
            const otherDeductions = parseCurrency(document.getElementById('otherDeductions').value);
            const stdWorkDays = parseFloat(document.getElementById('stdWorkDays').value) || 26;

            // Calculation Logic (Same as calculateSalary)
            const totalDays = actualWorkDays + paidLeaveDays;
            let totalSalaryFromDays = 0;
            if (totalDays === 0) totalSalaryFromDays = 0;
            else if (totalDays < 22) totalSalaryFromDays = (salaryGross / 22) * totalDays;
            else if (totalDays <= 26) totalSalaryFromDays = salaryGross;
            else totalSalaryFromDays = (salaryGross / 26) * totalDays;

            const salaryByWork = totalDays > 0 ? (totalSalaryFromDays * actualWorkDays / totalDays) : 0;
            
            // Paid Leave Salary: Based on Insurance Salary / 26 * Paid Leave Days
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
            const fmt = (n) => Math.round(n).toLocaleString('en-US') + ' VND';

            // 2. Create Document
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
                                            color: "E2E8F0", // Watermark style
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
                            spacing: { after: 300 }
                        }),
                        new Paragraph({
                            text: `Tháng: ${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
                            alignment: AlignmentType.CENTER,
                            spacing: { after: 500 }
                        }),

                        // A. INCOME
                        new Paragraph({
                            text: "A. TỔNG THU NHẬP (GROSS)",
                            heading: HeadingLevel.HEADING_2,
                            spacing: { before: 200, after: 100 }
                        }),
                        new Paragraph({ text: `1. Lương theo ngày công (${actualWorkDays} ngày): ${fmt(salaryByWork)}`, bullet: { level: 0 } }),
                        new Paragraph({ text: `2. Lương ngày nghỉ (${paidLeaveDays} ngày): ${fmt(salaryByLeave)}`, bullet: { level: 0 } }),
                        new Paragraph({ text: `3. Phụ cấp & Thưởng: ${fmt(allowance)}`, bullet: { level: 0 } }),
                        new Paragraph({ 
                            children: [
                                new TextRun({ text: "=> Tổng Gross: ", bold: true }),
                                new TextRun({ text: fmt(grossTotal), bold: true })
                            ],
                            bullet: { level: 0 } 
                        }),

                        // B. DEDUCTIONS
                        new Paragraph({
                            text: "B. CÁC KHOẢN KHẤU TRỪ",
                            heading: HeadingLevel.HEADING_2,
                            spacing: { before: 200, after: 100 }
                        }),
                        new Paragraph({ text: `1. Bảo hiểm xã hội (8%): ${fmt(bhxh)}`, bullet: { level: 0 } }),
                        new Paragraph({ text: `2. Bảo hiểm y tế (1.5%): ${fmt(bhyt)}`, bullet: { level: 0 } }),
                        new Paragraph({ text: `3. Bảo hiểm thất nghiệp (1%): ${fmt(bhtn)}`, bullet: { level: 0 } }),
                        new Paragraph({ text: `4. Khấu trừ khác: ${fmt(otherDeductions)}`, bullet: { level: 0 } }),
                        new Paragraph({ text: `5. Thuế TNCN: ${fmt(pit)}`, bullet: { level: 0 } }),
                        new Paragraph({ 
                            children: [
                                new TextRun({ text: "=> Tổng khấu trừ: ", bold: true }),
                                new TextRun({ text: fmt(totalInsurance + otherDeductions + pit), bold: true, color: "DC2626" })
                            ],
                            bullet: { level: 0 } 
                        }),

                        // NET SALARY
                        new Paragraph({
                            text: "C. LƯƠNG THỰC NHẬN (NET)",
                            heading: HeadingLevel.HEADING_2,
                            spacing: { before: 400, after: 100 }
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: fmt(netSalary),
                                    bold: true,
                                    size: 48, // 24pt
                                    color: "16A34A"
                                })
                            ],
                            alignment: AlignmentType.CENTER,
                            spacing: { after: 400 }
                        }),

                        // Footer Note
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

            Packer.toBlob(doc).then(blob => {
                saveAs(blob, "Phieu_Luong_HTools.docx");
            });
        }

        loadSettings();
        calculate();
        calculateSalary(); // Initial calculation for salary tab
