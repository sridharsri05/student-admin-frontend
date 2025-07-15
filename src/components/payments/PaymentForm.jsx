import { useState, useEffect } from "react";
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
import { CalendarIcon, CreditCard, Receipt, FileText, Tag } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import {
  generateInvoicePDF,
  generateReceiptPDF,
  downloadPDF,
  downloadPDFFromAPI
} from "@/utils/pdfGenerator";
import { getUltraMsg } from "@/components/whatsapp/UltraMsgService";
import { useFees } from '@/hooks/useFees';
import { useStudents } from '@/hooks/useStudents';
import { useLookups } from '@/hooks/useLookups';
import { useDiscounts } from '@/hooks/useDiscounts';
import { Badge } from "@/components/ui/badge";
import axiosInstance from '@/config/axiosInstance';

export const PaymentForm = ({ student, onSubmit, onCancel, hideButtons }) => {
  const { feeStructures } = useFees();
  const { students } = useStudents();
  const { lookups } = useLookups();
  const { validateDiscountCode, applyDiscount } = useDiscounts();
  
  const [formData, setFormData] = useState({
    studentId: student?._id || student?.id || "",
    courseId: "",
    courseName: "",
    totalAmount: "",
    depositAmount: "",
    installmentMonths: 1,
    paymentMethod: "",
    notes: "",
    dueDate: new Date(),
    feeStructure: "",
    discountCode: "",
  });

  // Initialize student name for display if provided
  const [studentName, setStudentName] = useState(student?.name || "");
  const [studentLoaded, setStudentLoaded] = useState(!!student);

  const [installments, setInstallments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [discountInfo, setDiscountInfo] = useState(null);
  const [discountLoading, setDiscountLoading] = useState(false);
  const [originalAmount, setOriginalAmount] = useState("");

  // Add payment gateway states
  const [useOnlinePayment, setUseOnlinePayment] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  const studentOptions = students.length ? students : [];

  useEffect(() => {
    if (student && (student._id || student.id)) {
      console.log("Student data received in PaymentForm:", student);
      setFormData(prev => ({
        ...prev,
        studentId: student._id || student.id,
      }));
      setStudentName(student.name || "");
      setStudentLoaded(true);
    }
  }, [student]);

  useEffect(() => {
    // Reset discount info when course or fee structure changes
    if (discountInfo) {
      setDiscountInfo(null);
      setFormData(prev => ({
        ...prev,
        discountCode: "",
      }));
    }
  }, [formData.courseId, formData.feeStructure]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      let updated = { ...prev, [field]: value };

      // If studentId changes, update student name
      if (field === 'studentId') {
        const selectedStudent = studentOptions.find(s => s._id === value);
        if (selectedStudent) {
          setStudentName(selectedStudent.name || "");
        }
      }
      
      // If courseId changes, auto-fill courseName, totalAmount, and installmentMonths
      if (field === 'courseId') {
        const selected = lookups.courses.find(c => c._id === value);
        if (selected) {
          updated.courseName = selected.name;
          updated.totalAmount = selected.fees?.toString() || '';
          updated.installmentMonths = selected.defaultInstallments?.toString() || '1';
          setOriginalAmount(selected.fees?.toString() || '');
        }
      }

      // If feeStructure changes, auto-set dueDate if possible
      if (field === 'feeStructure') {
        const selected = feeStructures.find(f => (f._id || f.id) === value);
        if (selected && selected.dueDate) {
          // Calculate next occurrence of due day (e.g., 5th of this or next month)
          const today = new Date();
          let due = new Date(today.getFullYear(), today.getMonth(), selected.dueDate);
          if (due < today) {
            due = new Date(today.getFullYear(), today.getMonth() + 1, selected.dueDate);
          }
          updated.dueDate = due.toISOString().split('T')[0];
        } else {
          // Default to today
          updated.dueDate = new Date().toISOString().split('T')[0];
        }
      }

      // Auto-calculate installments when relevant fields change
      if (
        field === "totalAmount" ||
        field === "depositAmount" ||
        field === "installmentMonths" ||
        field === "courseId"
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
    } else {
      setInstallments([]);
    }
  };

  const handleValidateDiscount = async () => {
    if (!formData.discountCode) {
      toast({
        title: "Discount Code Required",
        description: "Please enter a discount code.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.totalAmount) {
      toast({
        title: "Amount Required",
        description: "Please enter the total amount before applying a discount.",
        variant: "destructive",
      });
      return;
    }

    setDiscountLoading(true);
    try {
      const result = await validateDiscountCode({
        code: formData.discountCode,
        courseId: formData.courseId,
        feeStructureId: formData.feeStructure,
        amount: parseFloat(formData.totalAmount)
      });

      setDiscountInfo(result);
      
      // Apply discount to total amount
      if (result.valid) {
        setFormData(prev => ({
          ...prev,
          totalAmount: result.finalAmount.toString()
        }));
        
        // Recalculate installments with new total amount
        calculateInstallments({
          ...formData,
          totalAmount: result.finalAmount.toString()
        });
        
        toast({
          title: "Discount Applied",
          description: `Discount of ${result.discountAmount} applied successfully.`,
        });
      }
    } catch (error) {
      // Error toast is shown in the hook
    } finally {
      setDiscountLoading(false);
    }
  };

  const handleRemoveDiscount = () => {
    setDiscountInfo(null);
    setFormData(prev => ({
      ...prev,
      discountCode: "",
      totalAmount: originalAmount
    }));
    
    // Recalculate installments with original amount
    calculateInstallments({
      ...formData,
      totalAmount: originalAmount
    });
  };

  const handleOnlinePayment = async (paymentData) => {
    setPaymentProcessing(true);
    setPaymentError(null);
    
    try {
      // First create the payment record
      const paymentResponse = await axiosInstance.post('/payments', paymentData);
      const { _id: paymentId } = paymentResponse.data;
      
      // For online payments, always create a payment intent with Stripe
      // This ensures students can pay the full amount online
      try {
      const intentResponse = await axiosInstance.post('/stripe/create-payment-intent', {
        paymentId,
        currency: 'INR'
      });
      
      // Redirect to checkout page with the payment intent data
      window.location.href = `/checkout?clientSecret=${intentResponse.data.clientSecret}&paymentId=${paymentId}`;
      } catch (error) {
        // If Stripe returns an error about zero amount, handle it gracefully
        if (error.response?.data?.error === 'Payment amount must be greater than 0') {
          // This means the deposit equals the total amount
          // Update the payment status to completed
          await axiosInstance.patch(`/payments/${paymentId}/status`, { status: 'completed' });
          
          toast({
            title: "Payment Completed",
            description: "Your payment has been recorded successfully. The full amount has been covered.",
          });
          
          // Redirect to success page directly
          window.location.href = `/payment-success?paymentId=${paymentId}`;
        } else {
          // For other errors, show the error message
          throw error;
        }
      }
    } catch (error) {
      console.error('Error initiating online payment:', error);
      setPaymentError(error.response?.data?.error || 'Failed to initiate payment');
      setPaymentProcessing(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Check required fields
    if (!student && !formData.studentId) {
      errors.studentId = "Student is required";
    }
    
    if (!formData.courseId) {
      errors.courseId = "Course is required";
    }
    
    if (!formData.courseName || formData.courseName.trim() === "") {
      errors.courseName = "Course name is required";
    }
    
    if (!formData.totalAmount || parseFloat(formData.totalAmount) <= 0) {
      errors.totalAmount = "Total amount must be greater than 0";
    }
    
    if (!formData.paymentMethod) {
      errors.paymentMethod = "Payment method is required";
    }
    
    if (!formData.feeStructure) {
      errors.feeStructure = "Fee structure is required";
    }
    
    // Display errors if any
    if (Object.keys(errors).length > 0) {
      const errorMessages = Object.values(errors).join(", ");
      toast({
        title: "Validation Error",
        description: errorMessages,
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Determine correct payment status based on deposit and total amount
    let paymentStatus = 'pending';
    const totalAmount = parseFloat(formData.totalAmount) || 0;
    const depositAmount = parseFloat(formData.depositAmount) || 0;
    
    if (depositAmount >= totalAmount) {
      paymentStatus = 'completed'; // Full payment
    } else if (depositAmount > 0) {
      paymentStatus = 'partial'; // Partial payment with deposit
    } else {
      paymentStatus = 'pending'; // No deposit yet
    }
    
    const paymentData = {
      student: student?._id || student?.id || formData.studentId,
      studentName: studentName || student?.name || "Unknown",  // Include student name for display
      course: formData.courseId,
      courseName: formData.courseName,
      totalAmount: parseFloat(formData.totalAmount) || 0,
      depositAmount: parseFloat(formData.depositAmount) || 0,
      paymentMethod: formData.paymentMethod,
      dueDate: formData.dueDate,
      // For online payments, always keep status as pending until Stripe confirms payment
      status: useOnlinePayment ? 'pending' : paymentStatus,
      notes: formData.notes,
      feeStructure: formData.feeStructure,
      installmentPlan: installments.length > 0 ? {
        installments: installments,
        totalMonths: parseInt(formData.installmentMonths) || 1
      } : null,
      discountCode: formData.discountCode || null,
      discountAmount: discountInfo?.discountAmount || 0
    };
    
    if (useOnlinePayment) {
      await handleOnlinePayment(paymentData);
    } else {
      // Existing submission logic for offline payments
      if (onSubmit) onSubmit(paymentData);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="text-gradient flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Add Payment {student ? `for ${studentName}` : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form id="payment-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Student & Fee Structure Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!student && (
                <div className="space-y-2">
                  <Label>Student <span className="text-red-500">*</span></Label>
                  <Select value={formData.studentId} onValueChange={(val)=>handleInputChange('studentId', val)}>
                    <SelectTrigger className="glass border-white/20">
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/20 bg-card max-h-60 overflow-y-auto">
                      {studentOptions.map(st => (
                        <SelectItem key={st._id} value={st._id}>{st.name} ({st.rollNumber})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Select the student making the payment.</p>
                </div>
              )}
              <div className="space-y-2">
                <Label>Fee Structure <span className="text-red-500">*</span></Label>
                <Select value={formData.feeStructure} onValueChange={(val)=>handleInputChange('feeStructure', val)}>
                  <SelectTrigger className="glass border-white/20">
                    <SelectValue placeholder="Select fee type" />
                  </SelectTrigger>
                  <SelectContent className="glass border-white/20 bg-card">
                    {feeStructures.map(fs => (
                      <SelectItem key={fs._id || fs.id} value={fs._id || fs.id}>{fs.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Choose the type of fee this payment is for.</p>
              </div>
            </div>

            {/* Course Dropdown and Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Course <span className="text-red-500">*</span></Label>
                <Select value={formData.courseId} onValueChange={val => handleInputChange('courseId', val)}>
                  <SelectTrigger className="glass border-white/20">
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent className="glass border-white/20 bg-card max-h-60 overflow-y-auto">
                    {lookups.courses.map(course => (
                      <SelectItem key={course._id} value={course._id}>{course.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Choose the course for which payment is being made.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="courseName">Course Name <span className="text-red-500">*</span></Label>
                <Input
                  id="courseName"
                  value={formData.courseName}
                  onChange={(e) => handleInputChange("courseName", e.target.value)}
                  placeholder="Enter course name"
                  className="glass border-white/20"
                  required
                />
                <p className="text-xs text-muted-foreground">You can override the course name if needed.</p>
              </div>
            </div>

            {/* Discount Section */}
            <div className="space-y-2">
              <Label htmlFor="discountCode">Discount Code</Label>
              <div className="flex gap-2">
                <Input
                  id="discountCode"
                  value={formData.discountCode}
                  onChange={(e) => handleInputChange("discountCode", e.target.value.toUpperCase())}
                  placeholder="Enter discount code"
                  className="glass border-white/20"
                  disabled={discountInfo !== null}
                />
                {discountInfo ? (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleRemoveDiscount}
                    className="shrink-0"
                  >
                    Remove
                  </Button>
                ) : (
                  <Button 
                    type="button" 
                    onClick={handleValidateDiscount} 
                    disabled={discountLoading || !formData.discountCode}
                    className="shrink-0"
                  >
                    Apply
                  </Button>
                )}
              </div>
              {discountInfo && (
                <div className="mt-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {discountInfo.discount.type === 'percentage' 
                      ? `${discountInfo.discount.value}% off` 
                      : `₹${discountInfo.discount.value} off`}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    Original amount: ₹{originalAmount} | Discount: ₹{discountInfo.discountAmount.toFixed(2)}
                  </p>
                </div>
              )}
              <p className="text-xs text-muted-foreground">Enter a valid discount code if applicable.</p>
            </div>

            {/* Payment Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalAmount">Total Course Fee (₹) <span className="text-red-500">*</span></Label>
                <Input
                  id="totalAmount"
                  type="number"
                  value={formData.totalAmount}
                  onChange={(e) => handleInputChange("totalAmount", e.target.value)}
                  placeholder="Enter total amount"
                  className="glass border-white/20"
                  required
                />
                <p className="text-xs text-muted-foreground">Enter the full fee for the course.</p>
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
                <p className="text-xs text-muted-foreground">If a partial payment is made, enter the amount here.</p>
              </div>
              {/* Show installment months only if there is remaining balance */}
              {(() => {
                const total = parseFloat(formData.totalAmount) || 0;
                const deposit = parseFloat(formData.depositAmount) || 0;
                const remaining = total - deposit;
                if (remaining > 0) {
                  return (
                    <div className="space-y-2">
                      <Label htmlFor="installmentMonths">Installment Months</Label>
                      <Input
                        id="installmentMonths"
                        type="number"
                        min={1}
                        value={formData.installmentMonths}
                        onChange={(e) => handleInputChange("installmentMonths", e.target.value)}
                        placeholder="1"
                        className="glass border-white/20"
                      />
                      <p className="text-xs text-muted-foreground">Number of months to split the remaining fee (after deposit).</p>
                    </div>
                  );
                }
                return null;
              })()}
              </div>

            {/* Payment Method */}
              <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method <span className="text-red-500">*</span></Label>
              <Select value={formData.paymentMethod} onValueChange={(val)=>{
                handleInputChange('paymentMethod', val);
                // Automatically set useOnlinePayment flag when online option is selected
                setUseOnlinePayment(val === 'online');
              }}>
                  <SelectTrigger className="glass border-white/20">
                  <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent className="glass border-white/20 bg-card">
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="online">Online Payment (Stripe)</SelectItem>
                  </SelectContent>
                </Select>
              <p className="text-xs text-muted-foreground">How was the payment received?</p>
              </div>

            {/* Due Date - only shown if not fully paid */}
            {(() => {
              const total = parseFloat(formData.totalAmount) || 0;
              const deposit = parseFloat(formData.depositAmount) || 0;
              const isFullyPaid = total > 0 && deposit >= total;
              
              if (!isFullyPaid) {
                return (
                  <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date <span className="text-red-500">*</span></Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate instanceof Date ? formData.dueDate.toISOString().split("T")[0] : formData.dueDate}
                    onChange={(e) => handleInputChange("dueDate", e.target.value)}
                    className="glass border-white/20"
                    required
                  />
                  <p className="text-xs text-muted-foreground">Date by which the payment is due.</p>
                </div>
                );
              }
              return null;
            })()}

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Any additional notes (optional)"
                className="glass border-white/20 min-h-16"
              />
              <p className="text-xs text-muted-foreground">Add any extra information about this payment.</p>
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

            {useOnlinePayment && (
              <div className="p-4 border rounded-md bg-blue-50 mb-4">
                <h3 className="text-md font-medium mb-2">Online Payment</h3>
                <p className="text-sm text-gray-600 mb-4">
                  You will be redirected to a secure payment page to complete your payment.
                </p>
                {paymentError && (
                  <div className="p-2 mb-4 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                    {paymentError}
                  </div>
                )}
              </div>
            )}

            {!hideButtons && (
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" type="button" onClick={onCancel}>
                Cancel
              </Button>
                <Button type="submit" disabled={loading || paymentProcessing}>
                  {paymentProcessing ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Processing...
                    </>
                  ) : useOnlinePayment ? (
                    'Proceed to Payment'
                  ) : (
                    'Save Payment'
                  )}
                </Button>
            </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
