import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Calendar, Clock, CreditCard, DollarSign, CalendarDays, AlertCircle, Send, Search, User } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import axiosInstance from '@/config/axiosInstance';
import { useStudents } from '@/hooks/useStudents';

export const EMIManagement = ({ studentId, paymentId }) => {
  const [emiPayments, setEmiPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEmi, setSelectedEmi] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const { toast } = useToast();
  const { students } = useStudents();
  
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: 'cash',
    transactionId: '',
    notes: ''
  });
  
  const [useOnlinePayment, setUseOnlinePayment] = useState(false);
  const [filterStudentId, setFilterStudentId] = useState(studentId || "all");
  const [searchTerm, setSearchTerm] = useState("");
  const [groupedEmiPayments, setGroupedEmiPayments] = useState({});
  const [expandedStudentId, setExpandedStudentId] = useState(studentId || null);
  
  useEffect(() => {
    fetchEmiPayments();
  }, [studentId, paymentId, filterStudentId]);
  
  // If studentId prop changes, update the expanded student
  useEffect(() => {
    if (studentId) {
      setExpandedStudentId(studentId);
    }
  }, [studentId]);
  
  const fetchEmiPayments = async () => {
    setLoading(true);
    try {
      let endpoint = '/payments/emi';
      if (paymentId) {
        endpoint += `?payment=${paymentId}`;
      } else if (filterStudentId && filterStudentId !== 'all') {
        endpoint += `?student=${filterStudentId}`;
      }
      
      const response = await axiosInstance.get(endpoint);
      
      // Group EMI payments by student
      const grouped = response.data.reduce((acc, emi) => {
        // Handle null student object
        if (!emi.student) {
          // Use a special key for EMIs with no student
          const unknownStudentId = 'unknown';
          if (!acc[unknownStudentId]) {
            acc[unknownStudentId] = {
              student: { _id: unknownStudentId, name: 'Unknown Student' },
              payments: []
            };
          }
          acc[unknownStudentId].payments.push(emi);
          return acc;
        }

        // Normal case with student object
        const studentId = emi.student._id || emi.student;
        if (!acc[studentId]) {
          acc[studentId] = {
            student: emi.student,
            payments: []
          };
        }
        acc[studentId].payments.push(emi);
        return acc;
      }, {});
      
      setGroupedEmiPayments(grouped);
      setEmiPayments(response.data);
    } catch (error) {
      console.error('Error fetching EMI payments:', error);
      toast({
        title: 'Failed to load EMI payments',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleStudentClick = (studentId) => {
    setExpandedStudentId(expandedStudentId === studentId ? null : studentId);
  };
  
  const handlePayEmi = (emi) => {
    setSelectedEmi(emi);
    setFormData({
      amount: emi.amount.toString(),
      paymentMethod: 'cash',
      transactionId: '',
      notes: ''
    });
    setDialogOpen(true);
  };
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const confirmPayment = () => {
    setConfirmDialogOpen(true);
  };
  
  const handlePaymentSubmit = async () => {
    if (useOnlinePayment) {
      handleOnlinePayment();
      return;
    }
    
    try {
      await axiosInstance.put(`/payments/emi/${selectedEmi._id}`, {
        status: 'paid',
        paidDate: new Date().toISOString(),
        paymentMethod: formData.paymentMethod,
        transactionId: formData.transactionId,
        notes: formData.notes
      });
      
      toast({
        title: 'EMI payment recorded',
        description: 'The payment has been successfully recorded',
      });
      
      fetchEmiPayments();
      setDialogOpen(false);
      setConfirmDialogOpen(false);
    } catch (error) {
      console.error('Error recording EMI payment:', error);
      toast({
        title: 'Failed to record payment',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive'
      });
    }
  };
  
  const handleOnlinePayment = async () => {
    try {
      // Check if selectedEmi exists
      if (!selectedEmi || !selectedEmi._id) {
        toast({
          title: 'Payment Error',
          description: 'Missing payment information. Please try again.',
          variant: 'destructive'
        });
        return;
      }

      // Handle case where student might be null
      let studentId = null;
      if (selectedEmi.student) {
        studentId = typeof selectedEmi.student === 'object' ? selectedEmi.student._id : selectedEmi.student;
      }

      console.log("Sending EMI payment request:", {
        emiPaymentId: selectedEmi._id,
        amount: selectedEmi.amount,
        studentId: studentId,
        currency: 'INR'
      });

      const response = await axiosInstance.post('/stripe/create-emi-payment-intent', {
        emiPaymentId: selectedEmi._id,
        // Only send amount if it's a valid number
        ...(selectedEmi.amount && !isNaN(parseFloat(selectedEmi.amount)) && { amount: parseFloat(selectedEmi.amount) }),
        // Make sure we're sending a valid studentId
        ...(studentId && { studentId }),
        currency: 'INR'
      });
      
      console.log("Payment intent response:", response.data);
      
      if (!response.data || !response.data.clientSecret) {
        toast({
          title: 'Payment Error',
          description: 'Could not create payment session. Please try again later.',
          variant: 'destructive'
        });
        return;
      }
      
      // Redirect to checkout page with the payment intent data
      window.location.href = `/checkout?clientSecret=${response.data.clientSecret}&paymentId=${selectedEmi._id}&emiPayment=true`;
      
      setDialogOpen(false);
    } catch (error) {
      console.error('Error initiating online EMI payment:', error);
      toast({
        title: 'Failed to initiate online payment',
        description: error.response?.data?.message || error.message || 'An unexpected error occurred',
        variant: 'destructive'
      });
    }
  };
  
  const sendReminder = async (emi) => {
    try {
      await axiosInstance.post(`/emi-payments/${emi._id}/remind`, {
        method: 'whatsapp'
      });
      
      toast({
        title: 'Reminder sent',
        description: 'Payment reminder has been sent via WhatsApp',
      });
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast({
        title: 'Failed to send reminder',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive'
      });
    }
  };
  
  const getStatusBadge = (status) => {
    const variants = {
      paid: 'default',
      pending: 'secondary',
      overdue: 'destructive',
      processing: 'warning',
      cancelled: 'outline'
    };
    
    return (
      <Badge variant={variants[status] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };
  
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return format(new Date(dateStr), 'dd MMM yyyy');
  };
  
  return (
    <div>
      <Card className="glass border-white/10 hover-lift">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="flex items-center">
                <CalendarDays className="mr-2 h-5 w-5 text-neon-cyan" />
                EMI Payment Schedule
              </CardTitle>
              <CardDescription>
                Manage installment payments for students
              </CardDescription>
            </div>
            
            {/* Filter and search controls */}
            {!studentId && (
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <div className="flex-1">
                  <Select 
                    value={filterStudentId} 
                    onValueChange={setFilterStudentId}
                  >
                    <SelectTrigger className="w-full md:w-[200px] glass border-white/20">
                      <SelectValue placeholder="Filter by student" />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/20 bg-card">
                      <SelectItem value="all">All Students</SelectItem>
                      {students.map(student => (
                        <SelectItem key={student._id} value={student._id}>
                          {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 glass border-white/20"
                  />
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan"></div>
            </div>
          ) : emiPayments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
              <h3 className="font-semibold text-lg">No EMI payments found</h3>
              <p className="text-muted-foreground">
                {filterStudentId ? "This student doesn't have any EMI payments scheduled." : "No EMI payments are currently scheduled."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Always show student list with expandable sections by default */}
              {true ? (
                Object.entries(groupedEmiPayments)
                  .filter(([_, group]) => {
                    // Apply student filter if specified
                    if (filterStudentId && filterStudentId !== 'all') {
                      return group.student._id === filterStudentId || group.student === filterStudentId;
                    }
                    
                    // Apply search filter
                    if (!searchTerm) return true;
                    const student = group.student;
                    const studentName = typeof student === 'object' ? student.name || '' : '';
                    return studentName.toLowerCase().includes(searchTerm.toLowerCase());
                  })
                  .map(([studentId, group]) => {
                    const student = group.student;
                    const studentName = typeof student === 'object' ? student.name : 'Unknown Student';
                    const studentEmail = typeof student === 'object' ? student.email : '';
                    const studentPhone = typeof student === 'object' ? student.phone : '';
                    const isExpanded = expandedStudentId === studentId;
                    
                    // Calculate payment stats
                    const totalPayments = group.payments.length;
                    const paidPayments = group.payments.filter(p => p.status === 'paid').length;
                    const overduePayments = group.payments.filter(p => p.status === 'overdue').length;
                    const pendingPayments = group.payments.filter(p => p.status === 'pending').length;
                    const totalAmount = group.payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
                    const paidAmount = group.payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
                    
                    return (
                      <Card key={studentId} className="glass border-white/10 overflow-hidden">
                        <div 
                          className={`p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 ${isExpanded ? 'bg-white/5' : ''}`}
                          onClick={() => handleStudentClick(studentId)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-neon-cyan/20 flex items-center justify-center">
                              <User className="h-5 w-5 text-neon-cyan" />
                            </div>
                            <div>
                              <h3 className="font-medium">{studentName}</h3>
                              <div className="text-xs text-muted-foreground flex flex-col sm:flex-row sm:gap-2">
                                {studentEmail && <span>{studentEmail}</span>}
                                {studentPhone && (
                                  <span className="flex items-center">
                                    {studentEmail && <span className="hidden sm:inline mx-1">•</span>}
                                    {studentPhone}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="hidden md:flex gap-2 items-center">
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">Total Installments</p>
                                <p className="font-medium">{totalPayments}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">Paid</p>
                                <p className="font-medium text-neon-green">{paidPayments}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">Pending</p>
                                <p className="font-medium text-amber-400">{pendingPayments}</p>
                              </div>
                              {overduePayments > 0 && (
                                <div className="text-right">
                                  <p className="text-xs text-muted-foreground">Overdue</p>
                                  <p className="font-medium text-red-400">{overduePayments}</p>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center">
                              <div className="text-right mr-4">
                                <p className="text-xs text-muted-foreground">Amount</p>
                                <p className="font-medium">
                                  {formatCurrency(totalAmount)}
                                </p>
                              </div>
                              <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="m6 9 6 6 6-6"/>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {isExpanded && (
                          <div className="border-t border-white/10">
                            <div className="overflow-x-auto">
                              <Table>
                                <TableHeader className="glass border-b bg-white/5 backdrop-blur-sm">
                                  <TableRow>
                                    <TableHead>Installment</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Paid Date</TableHead>
                                    <TableHead>Payment Method</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {group.payments.map((emi) => (
                                    <TableRow key={emi._id}>
                                      <TableCell>#{emi.installmentNumber}</TableCell>
                                      <TableCell className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                        {formatDate(emi.dueDate)}
                                      </TableCell>
                                      <TableCell>{formatCurrency(emi.amount)}</TableCell>
                                      <TableCell>{getStatusBadge(emi.status)}</TableCell>
                                      <TableCell>
                                        {emi.paidDate ? (
                                          <div className="flex items-center">
                                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                            {formatDate(emi.paidDate)}
                                          </div>
                                        ) : (
                                          'Not Paid'
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        {emi.paymentMethod ? (
                                          <div className="flex items-center">
                                            <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                                            {emi.paymentMethod}
                                          </div>
                                        ) : (
                                          '-'
                                        )}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        <div className="flex justify-end space-x-2">
                                          {/* Pay Button */}
                                          {emi.status !== 'paid' && (
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handlePayEmi(emi);
                                              }}
                                              className="bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
                                            >
                                              <DollarSign className="h-4 w-4 mr-1" />
                                              Pay
                                            </Button>
                                          )}
                                          
                                          {/* Reminder Button */}
                                          {(emi.status === 'pending' || emi.status === 'overdue') && (
                                            <TooltipProvider>
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      sendReminder(emi);
                                                    }}
                                                  >
                                                    <Send className="h-4 w-4" />
                                                  </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                  <p>Send Payment Reminder</p>
                                                </TooltipContent>
                                              </Tooltip>
                                            </TooltipProvider>
                                          )}
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        )}
                      </Card>
                    );
                  })
              ) : (
                <Table>
                  <TableHeader className="glass border-b bg-white/5 backdrop-blur-sm">
                    <TableRow>
                      <TableHead>Installment</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Paid Date</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {emiPayments
                      .filter(emi => {
                        if (!searchTerm) return true;
                        const student = emi.student;
                        const studentName = typeof student === 'object' ? student.name || '' : '';
                        return studentName.toLowerCase().includes(searchTerm.toLowerCase());
                      })
                      .map((emi) => (
                        <TableRow key={emi._id}>
                          <TableCell>#{emi.installmentNumber}</TableCell>
                          <TableCell className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            {formatDate(emi.dueDate)}
                          </TableCell>
                          <TableCell>{formatCurrency(emi.amount)}</TableCell>
                          <TableCell>{getStatusBadge(emi.status)}</TableCell>
                          <TableCell>
                            {emi.paidDate ? (
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                {formatDate(emi.paidDate)}
                              </div>
                            ) : (
                              'Not Paid'
                            )}
                          </TableCell>
                          <TableCell>
                            {emi.paymentMethod ? (
                              <div className="flex items-center">
                                <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                                {emi.paymentMethod}
                              </div>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              {/* Pay Button */}
                              {emi.status !== 'paid' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handlePayEmi(emi)}
                                  className="bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
                                >
                                  <DollarSign className="h-4 w-4 mr-1" />
                                  Pay
                                </Button>
                              )}
                              
                              {/* Reminder Button */}
                              {(emi.status === 'pending' || emi.status === 'overdue') && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => sendReminder(emi)}
                                      >
                                        <Send className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Send Payment Reminder</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record EMI Payment</DialogTitle>
            <DialogDescription>
              Enter payment details for installment #{selectedEmi?.installmentNumber}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex justify-between items-center">
              <span>Amount:</span>
              <span className="font-semibold">{selectedEmi ? formatCurrency(selectedEmi.amount) : ''}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Due Date:</span>
              <span className="font-semibold">{selectedEmi ? formatDate(selectedEmi.dueDate) : ''}</span>
            </div>
            
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant={formData.paymentMethod === 'cash' && !useOnlinePayment ? "default" : "outline"}
                  className={formData.paymentMethod === 'cash' && !useOnlinePayment ? "bg-neon-green text-black" : ""}
                  onClick={() => {
                    handleInputChange('paymentMethod', 'cash');
                    setUseOnlinePayment(false);
                  }}
                >
                  Cash
                </Button>
                <Button
                  type="button"
                  variant={formData.paymentMethod === 'card' && !useOnlinePayment ? "default" : "outline"}
                  className={formData.paymentMethod === 'card' && !useOnlinePayment ? "bg-neon-green text-black" : ""}
                  onClick={() => {
                    handleInputChange('paymentMethod', 'card');
                    setUseOnlinePayment(false);
                  }}
                >
                  Card
                </Button>
                <Button
                  type="button"
                  variant={formData.paymentMethod === 'online' || useOnlinePayment ? "default" : "outline"}
                  className={formData.paymentMethod === 'online' || useOnlinePayment ? "bg-neon-green text-black" : ""}
                  onClick={() => {
                    handleInputChange('paymentMethod', 'online');
                    setUseOnlinePayment(true);
                  }}
                >
                  Online
                </Button>
              </div>
            </div>
            
            {!useOnlinePayment && (
              <div className="space-y-2">
                <Label htmlFor="transactionId">Transaction ID (Optional)</Label>
                <Input
                  id="transactionId"
                  value={formData.transactionId}
                  onChange={(e) => handleInputChange('transactionId', e.target.value)}
                  placeholder="Enter transaction reference"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Add any additional notes"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={useOnlinePayment ? handleOnlinePayment : confirmPayment}>
              {useOnlinePayment ? 'Proceed to Online Payment' : 'Record Payment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Payment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this EMI payment as paid? This action will record the payment and update the student's payment status.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePaymentSubmit}>
              Confirm Payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}; 