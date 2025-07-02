import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, CreditCard, Receipt, FileText } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import {
  generateInvoicePDF,
  generateReceiptPDF,
  downloadPDF,
} from "@/utils/pdfGenerator";
import { getUltraMsg } from "@/components/whatsapp/UltraMsgService";

export const PaymentForm = ({ student, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    studentId: student?.id || "",
    courseName: "",
    totalAmount: "",
    depositAmount: "",
    installmentMonths: 1,
    paymentMethod: "",
    notes: "",
    dueDate: new Date(),
  });

  const [installments, setInstallments] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // Auto-calculate installments when relevant fields change
      if (
        field === "totalAmount" ||
        field === "depositAmount" ||
        field === "installmentMonths"
      ) {
        calculateInstallments(updated);
      }

      return updated;
    });
  };

  const calculateInstallments = (data) => {
    const total = parseFloat(data.totalAmount) || 0;
    const deposit = parseFloat(data.depositAmount) || 0;
    const remaining = total - deposit;
    const months = parseInt(data.installmentMonths) || 1;

    if (remaining > 0 && months > 0) {
      const monthlyAmount = remaining / months;
      const newInstallments = [];

      for (let i = 0; i < months; i++) {
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + i + 1);

        newInstallments.push({
          month: i + 1,
          amount: monthlyAmount.toFixed(2),
          dueDate: dueDate.toISOString().split("T")[0],
          status: "pending",
        });
      }

      setInstallments(newInstallments);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const paymentData = {
        ...formData,
        installments,
        invoiceNumber: `INV-${Date.now()}`,
        receiptNumber: `RCP-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      // Generate Invoice PDF
      const invoicePDF = await generateInvoicePDF(student, paymentData);
      downloadPDF(invoicePDF, `invoice-${paymentData.invoiceNumber}.pdf`);

      // If deposit is paid, generate receipt
      if (formData.depositAmount > 0) {
        const receiptData = {
          ...paymentData,
          amount: formData.depositAmount,
          description: `Deposit for ${formData.courseName}`,
          paymentMethod: formData.paymentMethod,
        };

        const receiptPDF = await generateReceiptPDF(student, receiptData);
        downloadPDF(receiptPDF, `receipt-${receiptData.receiptNumber}.pdf`);

        // Send WhatsApp notification
        try {
          const ultraMsg = getUltraMsg();
          const message = `Hello ${student.name}!\n\nYour payment has been received successfully.\n\nAmount: ₹${formData.depositAmount}\nCourse: ${formData.courseName}\nReceipt: ${receiptData.receiptNumber}\n\nThank you!\nEduFlow Academy`;

          await ultraMsg.sendMessage(student.phone, message);

          // Send receipt PDF via WhatsApp
          await ultraMsg.sendDocument(student.phone, receiptPDF, "Payment Receipt");
        } catch (whatsappError) {
          console.error("WhatsApp notification failed:", whatsappError);
          toast({
            title: "Payment Saved",
            description:
              "Payment saved but WhatsApp notification failed. Please check WhatsApp settings.",
            variant: "destructive",
          });
        }
      }

      // Save to database/storage
      onSubmit(paymentData);

      toast({
        title: "Payment Added Successfully",
        description: "Invoice and receipt generated. WhatsApp notification sent.",
      });
    } catch (error) {
      console.error("Payment processing error:", error);
      toast({
        title: "Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="text-gradient flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Add Payment for {student?.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="courseName">Course Name</Label>
                <Input
                  id="courseName"
                  value={formData.courseName}
                  onChange={(e) => handleInputChange("courseName", e.target.value)}
                  placeholder="Enter course name"
                  className="glass border-white/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalAmount">Total Course Fee (₹)</Label>
                <Input
                  id="totalAmount"
                  type="number"
                  value={formData.totalAmount}
                  onChange={(e) => handleInputChange("totalAmount", e.target.value)}
                  placeholder="Enter total amount"
                  className="glass border-white/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="depositAmount">Deposit Amount (₹)</Label>
                <Input
                  id="depositAmount"
                  type="number"
                  value={formData.depositAmount}
                  onChange={(e) => handleInputChange("depositAmount", e.target.value)}
                  placeholder="Enter deposit amount"
                  className="glass border-white/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="installmentMonths">Installment Months</Label>
                <Select
                  value={formData.installmentMonths.toString()}
                  onValueChange={(value) =>
                    handleInputChange("installmentMonths", parseInt(value))
                  }
                >
                  <SelectTrigger className="glass border-white/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass border-white/20 bg-card">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
                      <SelectItem key={month} value={month.toString()}>
                        {month} {month === 1 ? "Month" : "Months"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) => handleInputChange("paymentMethod", value)}
                >
                  <SelectTrigger className="glass border-white/20">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent className="glass border-white/20 bg-card">
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full glass border-white/20 justify-start"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dueDate ? format(formData.dueDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 glass border-white/20"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={formData.dueDate}
                      onSelect={(date) => handleInputChange("dueDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Additional notes..."
                className="glass border-white/20"
              />
            </div>

            {installments.length > 0 && (
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-sm">Installment Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {installments.map((installment, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 glass rounded"
                      >
                        <span>Month {installment.month}</span>
                        <span>₹{installment.amount}</span>
                        <span className="text-sm text-muted-foreground">
                          {installment.dueDate}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-neon-green to-neon-cyan hover:from-neon-green/80 hover:to-neon-cyan/80"
              >
                {loading ? "Processing..." : "Add Payment & Generate Invoice"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="border-white/20 hover:bg-white/10"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
