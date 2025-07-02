
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

export const exportPaymentsToPDF = async (payments, analytics, filters = {}) => {
    try {
        // Dynamic import for jsPDF
        const jsPDF = (await import('jspdf')).default;
        const doc = new jsPDF();

        // Header
        doc.setFontSize(20);
        doc.setTextColor(0, 212, 255);
        doc.text('Payment Report', 20, 30);

        // Date and filters
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 20, 50);

        if (filters.dateFrom && filters.dateTo) {
            doc.text(`Period: ${format(new Date(filters.dateFrom), 'PPP')} - ${format(new Date(filters.dateTo), 'PPP')}`, 20, 60);
        }

        // Summary
        doc.setFontSize(16);
        doc.text('Payment Summary', 20, 80);

        let yPos = 95;
        doc.setFontSize(12);
        doc.text(`Total Revenue: ₹${analytics.totalRevenue?.toLocaleString() || 0}`, 20, yPos);
        yPos += 10;
        doc.text(`Successful Payments: ${analytics.successfulPayments || 0}`, 20, yPos);
        yPos += 10;
        doc.text(`Pending Payments: ₹${analytics.pendingPayments?.toLocaleString() || 0}`, 20, yPos);
        yPos += 10;
        doc.text(`Failed Payments: ${analytics.failedPayments || 0}`, 20, yPos);

        // Payment details
        yPos += 30;
        doc.setFontSize(16);
        doc.text('Payment Details', 20, yPos);

        yPos += 15;
        doc.setFontSize(10);

        payments.forEach((payment, index) => {
            if (yPos > 250) {
                doc.addPage();
                yPos = 30;
            }

            const studentName = payment.students?.name || payment.studentName || 'Unknown';
            const amount = payment.amount || 0;
            const status = payment.status || 'Unknown';
            const date = payment.created_at || payment.date || 'Unknown';

            doc.text(`${index + 1}. ${studentName} - ₹${amount} - ${status} - ${date}`, 20, yPos);
            yPos += 8;
        });

        doc.save(`payment-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
        return true;
    } catch (error) {
        console.error('PDF export error:', error);
        throw new Error('Failed to export PDF');
    }
};

export const exportPaymentsToExcel = (payments, analytics, filters = {}) => {
    try {
        const workbook = XLSX.utils.book_new();

        // Summary sheet
        const summaryData = [
            ['Payment Report Summary'],
            ['Generated on:', format(new Date(), 'PPP')],
            [''],
            ['Metric', 'Value'],
            ['Total Revenue', `₹${analytics.totalRevenue?.toLocaleString() || 0}`],
            ['Successful Payments', analytics.successfulPayments || 0],
            ['Pending Payments', `₹${analytics.pendingPayments?.toLocaleString() || 0}`],
            ['Failed Payments', analytics.failedPayments || 0]
        ];

        if (filters.dateFrom && filters.dateTo) {
            summaryData.splice(2, 0, [`Period: ${format(new Date(filters.dateFrom), 'PPP')} - ${format(new Date(filters.dateTo), 'PPP')}`]);
        }

        const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

        // Payments sheet
        const paymentsData = payments.map(payment => ({
            'Student Name': payment.students?.name || payment.studentName || 'Unknown',
            'Amount': payment.amount || 0,
            'Status': payment.status || 'Unknown',
            'Payment Method': payment.payment_method || payment.method || 'Unknown',
            'Date': payment.created_at || payment.date || 'Unknown',
            'Transaction ID': payment.transaction_id || payment.id || 'Unknown',
            'Notes': payment.notes || ''
        }));

        const paymentsSheet = XLSX.utils.json_to_sheet(paymentsData);
        XLSX.utils.book_append_sheet(workbook, paymentsSheet, 'Payments');

        // Monthly revenue sheet
        if (analytics.monthlyRevenue && analytics.monthlyRevenue.length > 0) {
            const monthlySheet = XLSX.utils.json_to_sheet(analytics.monthlyRevenue);
            XLSX.utils.book_append_sheet(workbook, monthlySheet, 'Monthly Revenue');
        }

        XLSX.writeFile(workbook, `payment-report-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
        return true;
    } catch (error) {
        console.error('Excel export error:', error);
        throw new Error('Failed to export Excel');
    }
};