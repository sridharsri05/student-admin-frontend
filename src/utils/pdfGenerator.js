import { jsPDF } from 'jspdf';
import axiosInstance from '@/config/axiosInstance';

/**
 * Download a PDF from the backend API
 * @param {string} endpoint - API endpoint to fetch the PDF from
 * @param {string} filename - Filename for the downloaded PDF
 */
export const downloadPDFFromAPI = async (endpoint, filename) => {
  try {
    console.log(`Downloading PDF from: ${endpoint}`);

    // Use axios directly for blob response
    const response = await axiosInstance({
      url: endpoint,
      method: 'GET',
      responseType: 'blob', // Important for binary data
    });

    // Check if response is actually a PDF or an error message
    const contentType = response.headers['content-type'];
    if (contentType && contentType.includes('application/json')) {
      // This is probably an error response, not a PDF
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onload = () => {
          try {
            const errorData = JSON.parse(reader.result);
            console.error('Error from API:', errorData);
            reject(new Error(errorData.error || 'Failed to generate PDF'));
          } catch (e) {
            reject(new Error('Invalid response from server'));
          }
        };
        reader.onerror = () => reject(new Error('Error reading response'));
        reader.readAsText(response.data);
      });
    }

    // Create a blob URL and trigger download
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log(`PDF downloaded successfully: ${filename}`);
    return true;
  } catch (error) {
    console.error('Error downloading PDF from API:', error);
    throw error.message ? error : new Error('Failed to download PDF from server');
  }
};

export const generateInvoicePDF = (studentData, paymentData) => {
  return new Promise((resolve) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(0, 212, 255); // Neon cyan color
    doc.text('EduFlow Academy', 20, 30);
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('INVOICE', 160, 30);

    // Invoice details
    doc.setFontSize(12);
    doc.text(`Invoice #: INV-${paymentData.invoiceNumber}`, 20, 50);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 60);
    doc.text(`Due Date: ${paymentData.dueDate}`, 20, 70);

    // Student details
    doc.text('Bill To:', 20, 90);
    doc.text(`${studentData.name}`, 20, 100);
    doc.text(`${studentData.email}`, 20, 110);
    doc.text(`${studentData.phone}`, 20, 120);

    // Payment details table
    doc.text('Payment Details:', 20, 140);

    // Table headers
    doc.setFillColor(240, 240, 240);
    doc.rect(20, 150, 170, 10, 'F');
    doc.text('Description', 25, 157);
    doc.text('Amount', 150, 157);

    // Table content
    let yPos = 167;
    doc.text(`Course Fee - ${paymentData.courseName}`, 25, yPos);
    doc.text(`₹${paymentData.totalAmount}`, 150, yPos);

    if (paymentData.deposit > 0) {
      yPos += 10;
      doc.text('Deposit Paid', 25, yPos);
      doc.text(`-₹${paymentData.deposit}`, 150, yPos);
    }

    // Total
    yPos += 20;
    doc.setFontSize(14);
    doc.text('Total Due:', 120, yPos);
    doc.text(`₹${paymentData.totalAmount - paymentData.deposit}`, 150, yPos);

    // Installment schedule
    if (paymentData.installments && paymentData.installments.length > 0) {
      yPos += 20;
      doc.setFontSize(12);
      doc.text('Installment Schedule:', 20, yPos);

      paymentData.installments.forEach((installment, index) => {
        yPos += 10;
        doc.text(`${installment.month}: ₹${installment.amount}`, 25, yPos);
      });
    }

    // Footer
    doc.setFontSize(10);
    doc.text('Thank you for your business!', 20, 280);
    doc.text('EduFlow Academy - Your Success is Our Mission', 20, 290);

    const pdfBlob = doc.output('blob');
    resolve(pdfBlob);
  });
};

export const generateReceiptPDF = (studentData, paymentData) => {
  return new Promise((resolve) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(0, 212, 255);
    doc.text('EduFlow Academy', 20, 30);
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('PAYMENT RECEIPT', 140, 30);

    // Receipt details
    doc.setFontSize(12);
    doc.text(`Receipt #: RCP-${paymentData.receiptNumber}`, 20, 50);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 60);
    doc.text(`Payment Method: ${paymentData.paymentMethod}`, 20, 70);

    // Student details
    doc.text('Received From:', 20, 90);
    doc.text(`${studentData.name}`, 20, 100);
    doc.text(`${studentData.email}`, 20, 110);

    // Payment details
    doc.setFillColor(240, 240, 240);
    doc.rect(20, 130, 170, 10, 'F');
    doc.text('Description', 25, 137);
    doc.text('Amount', 150, 137);

    doc.text(`Payment for ${paymentData.description}`, 25, 150);
    doc.text(`₹${paymentData.amount}`, 150, 150);

    // Total
    doc.setFontSize(14);
    doc.text('Amount Received:', 100, 170);
    doc.text(`₹${paymentData.amount}`, 150, 170);

    // Footer
    doc.setFontSize(10);
    doc.text('This is a computer generated receipt.', 20, 220);
    doc.text('Thank you for your payment!', 20, 230);

    const pdfBlob = doc.output('blob');
    resolve(pdfBlob);
  });
};

export const downloadPDF = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
