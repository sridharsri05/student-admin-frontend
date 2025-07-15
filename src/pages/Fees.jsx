import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  Plus, Edit2, Trash2, DollarSign, Calendar, BookOpen, 
  RefreshCcw, ChevronUp, ChevronDown, Search, AlertCircle, ArrowDownUp,
  FileText, Receipt, Download, Loader2
} from 'lucide-react';
import { useFees } from '@/hooks/useFees';
import { usePayments } from '@/hooks/usePayments';
import { useStudents } from '@/hooks/useStudents';
import { useLocation } from 'react-router-dom';
import { PaymentForm } from '@/components/payments/PaymentForm';
import { EMIManagement } from '@/components/payments/EMIManagement';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Pagination } from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search-input";
import { Skeleton } from "@/components/ui/skeleton";
import { downloadPDFFromAPI } from "@/utils/pdfGenerator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const Fees = () => {
  // Use 'refetch' from the hooks and alias them locally as 'refreshFees' and 'refreshPayments'
  const { feeStructures, createFee, updateFee, deleteFee, loading: feesLoading, refetch: refreshFees } = useFees();
  const { payments: studentPayments, analytics, loading: paymentsLoading, createPayment, deletePayment, refetch: refreshPayments } = usePayments();
  const { students } = useStudents();
  const location = useLocation();

  // Form state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFee, setEditingFee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'recurring',
    amount: '',
    frequency: 'monthly',
    category: 'tuition',
    description: '',
    dueDate: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  // Delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [feeToDelete, setFeeToDelete] = useState(null);

  // Delete payment confirmation dialog
  const [paymentDeleteDialogOpen, setPaymentDeleteDialogOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState(null);
  
  // Pagination state
  const [feeCurrentPage, setFeeCurrentPage] = useState(1);
  const [paymentCurrentPage, setPaymentCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filtering and sorting
  const [feeFilter, setFeeFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [feeSort, setFeeSort] = useState({ field: 'name', direction: 'asc' });
  const [paymentSort, setPaymentSort] = useState({ field: 'dueDate', direction: 'desc' });

  // Data refreshing
  const [refreshing, setRefreshing] = useState(false);
  
  // PDF download state
  const [downloadingPDF, setDownloadingPDF] = useState({
    paymentId: null,
    type: null
  });
  
  // For handling student from URL params
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentLoading, setStudentLoading] = useState(false);
  
  // Check for student parameter in URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const studentId = queryParams.get('studentId');
    const isNewRegistration = queryParams.get('isNewRegistration') === 'true';
    
    if (!studentId) return;
    
    const findAndSetStudent = async () => {
      setStudentLoading(true);
      
      try {
        // For new registrations, use a different approach with more retries and longer delays
        if (isNewRegistration) {
          console.log("Handling newly registered student:", studentId);
          
          // Try multiple times with increasing delays
          let student = null;
          let attempts = 0;
          const maxAttempts = 5;
          
          while (!student && attempts < maxAttempts) {
            attempts++;
            const delay = attempts * 1000; // Increase delay with each attempt
            console.log(`Attempt ${attempts}/${maxAttempts} - waiting ${delay}ms`);
            
            // Wait before trying
            await new Promise(resolve => setTimeout(resolve, delay));
            
            try {
              const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://student-server-ten.vercel.app/api'}/students/${studentId}`);
              
              if (response.ok) {
                student = await response.json();
                console.log("Successfully fetched newly registered student:", student.name);
                break;
              }
            } catch (err) {
              console.log(`Attempt ${attempts} failed:`, err.message);
            }
          }
          
          if (student) {
            setSelectedStudent(student);
            setPaymentDialogOpen(true);
            
            // Remove the isNewRegistration flag from URL but keep the studentId
            const url = new URL(window.location);
            url.searchParams.delete('isNewRegistration');
            window.history.replaceState({}, '', url);
          } else {
            throw new Error('Failed to fetch newly registered student after multiple attempts');
          }
        } else {
          // Standard flow for existing students
          // First check if student exists in current students array
          if (students && students.length > 0) {
            const student = students.find(s => s._id === studentId);
            if (student) {
              console.log("Found student in local data:", student.name);
              setSelectedStudent(student);
              // Automatically open payment dialog for the student
              setPaymentDialogOpen(true);
              setStudentLoading(false);
              return;
            }
          }
          
          // If not found in current array or array is empty, fetch directly
          console.log("Fetching student data for ID:", studentId);
          
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://student-server-ten.vercel.app/api'}/students/${studentId}`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch student');
          }
          
          const student = await response.json();
          if (student) {
            console.log("Fetched student data:", student.name);
            setSelectedStudent(student);
            // Automatically open payment dialog for the student
            setPaymentDialogOpen(true);
          }
        }
      } catch (error) {
        console.error("Failed to fetch student:", error);
        toast({
          title: "Student Data Loading",
          description: "Please wait a moment while we load the student data, or try refreshing the page.",
          variant: "warning",
          duration: 5000
        });
      } finally {
        setStudentLoading(false);
      }
    };
    
    findAndSetStudent();
  }, [location.search, students]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }
    
    if (!formData.amount) {
      errors.amount = "Amount is required";
    } else if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      errors.amount = "Amount must be a positive number";
    }
    
    if (formData.type === 'recurring' && formData.dueDate) {
      const day = parseInt(formData.dueDate);
      if (isNaN(day) || day < 1 || day > 31) {
        errors.dueDate = "Day must be between 1 and 31";
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user types in field
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please check the form for errors",
        variant: "destructive",
      });
      return;
    }

    const feeData = {
      ...formData,
      amount: parseFloat(formData.amount),
      dueDate: formData.dueDate ? parseInt(formData.dueDate) : null,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const action = editingFee ? 'update' : 'create';
    try {
      if (editingFee) {
        await updateFee(editingFee._id || editingFee.id, feeData);
        toast({
          title: 'Fee structure updated',
          description: 'The fee structure has been successfully updated.',
        });
      } else {
        await createFee(feeData);
        toast({
          title: 'Fee structure created',
          description: 'New fee structure has been successfully created.',
        });
      }
    } catch (error) {
      toast({
        title: `Failed to ${action} fee structure`,
        description: error.message || `An error occurred while trying to ${action} the fee structure.`,
        variant: "destructive",
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'recurring',
      amount: '',
      frequency: 'monthly',
      category: 'tuition',
      description: '',
      dueDate: ''
    });
    setFormErrors({});
    setEditingFee(null);
    setDialogOpen(false);
  };

  const handleEdit = (fee) => {
    setEditingFee(fee);
    setFormData({
      name: fee.name,
      type: fee.type,
      amount: fee.amount.toString(),
      frequency: fee.frequency,
      category: fee.category,
      description: fee.description,
      dueDate: fee.dueDate ? fee.dueDate.toString() : ''
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  const confirmDelete = (fee) => {
    setFeeToDelete(fee);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!feeToDelete) return;
    
    try {
      await deleteFee(feeToDelete._id || feeToDelete.id);
      toast({
        title: 'Fee structure deleted',
        description: 'The fee structure has been successfully deleted.',
      });
    } catch (error) {
      toast({
        title: 'Failed to delete fee structure',
        description: error.message || 'An error occurred while trying to delete the fee structure.',
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setFeeToDelete(null);
    }
  };

  const confirmDeletePayment = (payment) => {
    setPaymentToDelete(payment);
    setPaymentDeleteDialogOpen(true);
  };

  const handleDeletePayment = async () => {
    if (!paymentToDelete) return;
    
    try {
      await deletePayment(paymentToDelete._id || paymentToDelete.id);
      toast({
        title: 'Payment deleted',
        description: 'The payment has been successfully deleted.',
      });
    } catch (error) {
      toast({
        title: 'Failed to delete payment',
        description: error.message || 'An error occurred while trying to delete the payment.',
        variant: "destructive",
      });
    } finally {
      setPaymentDeleteDialogOpen(false);
      setPaymentToDelete(null);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      completed: 'paid',
      paid: 'paid',
      pending: 'pending',
      failed: 'overdue',
      overdue: 'overdue',
      partial: 'partial'
    };
    const key = map[status] || 'pending';
    const variants = {
      paid: 'default',
      pending: 'secondary',
      overdue: 'destructive',
      partial: 'outline'
    };
    return (
      <Badge variant={variants[key]}>
        {key.charAt(0).toUpperCase() + key.slice(1)}
      </Badge>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleCreatePayment = async (data) => {
    try {
      const result = await createPayment(data);
      
      // Refresh the payments list
      await refreshPayments();
      
      toast({ 
        title: 'Payment successfully recorded',
        description: `Payment of ${formatCurrency(data.totalAmount || data.amount || 0)} recorded for ${data.studentName || selectedStudent?.name || 'student'}.`,
      });
      
      // Close dialog and clean up
      setPaymentDialogOpen(false);
      
      // Return the payment ID for potential further actions
      return result;
    } catch (error) {
      toast({
        title: 'Failed to save payment',
        description: error.message || 'An error occurred while trying to save the payment.',
        variant: "destructive",
      });
      return null;
    }
  };

  const handleRefreshData = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refreshFees(), refreshPayments()]);
      toast({
        title: 'Data refreshed',
        description: 'All fee and payment data has been refreshed.',
      });
    } catch (error) {
      toast({
        title: 'Refresh failed',
        description: 'Failed to refresh data. Please try again.',
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  // Sorting and filtering
  const handleSortFees = (field) => {
    setFeeSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSortPayments = (field) => {
    setPaymentSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (field, sort) => {
    if (field !== sort.field) return <ArrowDownUp className="w-3 h-3 ml-1" />;
    return sort.direction === 'asc' ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />;
  };

  // Apply filtering and sorting
  const filteredFeeStructures = feeStructures
    .filter(fee => 
      fee.name.toLowerCase().includes(feeFilter.toLowerCase()) ||
      fee.category.toLowerCase().includes(feeFilter.toLowerCase())
    )
    .sort((a, b) => {
      const field = feeSort.field;
      const aValue = field === 'amount' ? parseFloat(a[field]) : a[field];
      const bValue = field === 'amount' ? parseFloat(b[field]) : b[field];
      
      if (feeSort.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const filteredPayments = studentPayments
    .filter(payment => {
      const studentName = payment.student?.name || payment.studentName || '';
      const feeName = payment.feeStructure?.name || payment.feeName || payment.courseName || '';
      const status = payment.status || '';
      
      return studentName.toLowerCase().includes(paymentFilter.toLowerCase()) ||
             feeName.toLowerCase().includes(paymentFilter.toLowerCase()) ||
             status.toLowerCase().includes(paymentFilter.toLowerCase());
    })
    .sort((a, b) => {
      const field = paymentSort.field;
      
      // Special handling for nested fields
      let aValue, bValue;
      
      if (field === 'student') {
        aValue = a.student?.name || a.studentName || '';
        bValue = b.student?.name || b.studentName || '';
      } else if (field === 'feeName') {
        aValue = a.feeStructure?.name || a.feeName || a.courseName || '';
        bValue = b.feeStructure?.name || b.feeName || b.courseName || '';
      } else if (field === 'amount') {
        aValue = parseFloat(a.totalAmount || a.amount || 0);
        bValue = parseFloat(b.totalAmount || b.amount || 0);
      } else {
        aValue = a[field];
        bValue = b[field];
      }
      
      if (paymentSort.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Pagination
  const paginatedFees = filteredFeeStructures.slice(
    (feeCurrentPage - 1) * itemsPerPage,
    feeCurrentPage * itemsPerPage
  );
  
  const paginatedPayments = filteredPayments.slice(
    (paymentCurrentPage - 1) * itemsPerPage,
    paymentCurrentPage * itemsPerPage
  );
  
  const feePageCount = Math.ceil(filteredFeeStructures.length / itemsPerPage);
  const paymentPageCount = Math.ceil(filteredPayments.length / itemsPerPage);

  const handleDownloadPDF = async (payment, type) => {
    if (!payment || !payment.student || !payment._id) {
      toast({
        title: "Missing information",
        description: "Cannot download PDF: Missing student or payment information",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setDownloadingPDF({ paymentId: payment._id, type });
      
      const studentId = payment.student._id || payment.studentId;
      const paymentId = payment._id || payment.id;
      
      const endpoint = `/payments/${studentId}/${paymentId}/${type}`;
      const filename = type === 'invoice' 
        ? `invoice-${payment.invoiceNumber || paymentId}.pdf` 
        : `receipt-${payment.receiptNumber || paymentId}.pdf`;
      
      await downloadPDFFromAPI(endpoint, filename);
      
      toast({
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} downloaded`,
        description: `The ${type} has been successfully downloaded.`,
      });
    } catch (error) {
      console.error(`Error downloading ${type}:`, error);
      toast({
        title: `Failed to download ${type}`,
        description: error.message || `An error occurred while trying to download the ${type}.`,
        variant: "destructive",
      });
    } finally {
      setDownloadingPDF({ paymentId: null, type: null });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient flex items-center gap-2">
            <DollarSign className="w-8 h-8 text-neon-green" />
            Fees Management
          </h1>
          <p className="text-muted-foreground mt-1">Manage fee structures and track payments</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleRefreshData} 
            disabled={refreshing || feesLoading || paymentsLoading}
          >
            <RefreshCcw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gradient-to-r from-neon-green to-neon-cyan hover:from-neon-green/80 hover:to-neon-cyan/80"
              onClick={() => setEditingFee(null)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Fee Structure
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingFee ? 'Edit Fee Structure' : 'Create Fee Structure'}
              </DialogTitle>
              <DialogDescription>
                {editingFee ? 'Modify the existing fee structure' : 'Add a new fee structure for students'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Fee Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Monthly Tuition Fee"
                      className={formErrors.name ? "border-red-500" : ""}
                  />
                    {formErrors.name && (
                      <p className="text-sm text-red-500">{formErrors.name}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="amount">Amount <span className="text-red-500">*</span></Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    placeholder="0.00"
                      className={formErrors.amount ? "border-red-500" : ""}
                  />
                    {formErrors.amount && (
                      <p className="text-sm text-red-500">{formErrors.amount}</p>
                    )}
                  </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fee Type</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recurring">Recurring</SelectItem>
                      <SelectItem value="one-time">One-time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {formData.type === 'recurring' && (
                  <div className="space-y-2">
                    <Label>Frequency</Label>
                    <Select value={formData.frequency} onValueChange={(value) => handleInputChange('frequency', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tuition">Tuition</SelectItem>
                      <SelectItem value="admission">Admission</SelectItem>
                      <SelectItem value="facility">Facility</SelectItem>
                      <SelectItem value="exam">Exam</SelectItem>
                      <SelectItem value="transport">Transport</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {formData.type === 'recurring' && (
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date (Day of Month)</Label>
                    <Input
                      id="dueDate"
                      type="number"
                      min="1"
                      max="31"
                      value={formData.dueDate}
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      placeholder="5"
                        className={formErrors.dueDate ? "border-red-500" : ""}
                    />
                      {formErrors.dueDate && (
                        <p className="text-sm text-red-500">{formErrors.dueDate}</p>
                      )}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of the fee"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingFee ? 'Update' : 'Create'} Fee Structure
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Fee Structures */}
      <Card className="glass border-white/10 hover-lift">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
          <CardTitle className="flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Fee Structures
          </CardTitle>
          <CardDescription>
            Manage different types of fees for your institution
          </CardDescription>
          </div>
          
          <SearchInput
              placeholder="Filter fee structures..."
              value={feeFilter}
              onChange={(e) => {
                setFeeFilter(e.target.value);
              setFeeCurrentPage(1);
              }}
            />
        </CardHeader>
        <CardContent>
          {feesLoading ? (
            <Table aria-busy="true">
              <TableBody>
                {[...Array(itemsPerPage)].map((_, idx) => (
                  <TableRow key={idx} className="h-10">
                    <TableCell><Skeleton className="h-3 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-3 w-14" /></TableCell>
                    <TableCell><Skeleton className="h-3 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-3 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-3 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-3 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-3 w-14" /></TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-4" />
              </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : filteredFeeStructures.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
              <h3 className="font-semibold text-lg">No fee structures found</h3>
              <p className="text-muted-foreground">
                {feeFilter ? "No matches for your filter. Try a different search term." : "Start by adding a new fee structure."}
              </p>
            </div>
          ) : (
            <>
          <Table>
            <TableHeader className="glass border-b bg-white/5 backdrop-blur-sm">
              <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => handleSortFees('name')}>
                      <div className="flex items-center">
                        Name {getSortIcon('name', feeSort)}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSortFees('type')}>
                      <div className="flex items-center">
                        Type {getSortIcon('type', feeSort)}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSortFees('amount')}>
                      <div className="flex items-center">
                        Amount {getSortIcon('amount', feeSort)}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSortFees('frequency')}>
                      <div className="flex items-center">
                        Frequency {getSortIcon('frequency', feeSort)}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSortFees('category')}>
                      <div className="flex items-center">
                        Category {getSortIcon('category', feeSort)}
                      </div>
                    </TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                  {paginatedFees.map((fee) => (
                <TableRow key={fee._id || fee.id}>
                  <TableCell className="font-medium">{fee.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {fee.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(fee.amount)}</TableCell>
                  <TableCell>{fee.frequency}</TableCell>
                  <TableCell>{fee.category}</TableCell>
                  <TableCell>
                    {fee.dueDate ? `${fee.dueDate}${fee.frequency === 'monthly' ? 'th of month' : ''}` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={fee.isActive ? 'default' : 'secondary'}>
                      {fee.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(fee)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                            onClick={() => confirmDelete(fee)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
              
              {feePageCount > 1 && (
                <div className="flex justify-center mt-4">
                  <Pagination>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFeeCurrentPage(p => Math.max(1, p - 1))}
                      disabled={feeCurrentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="mx-4">
                      Page {feeCurrentPage} of {feePageCount}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFeeCurrentPage(p => Math.min(feePageCount, p + 1))}
                      disabled={feeCurrentPage === feePageCount}
                    >
                      Next
                    </Button>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Payment Tracking */}
      <Card className="glass border-white/10 hover-lift">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
          <CardTitle className="flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Payment Tracking
          </CardTitle>
          <CardDescription>
            Track student payments and outstanding fees
          </CardDescription>
          </div>

          <div className="flex items-center space-x-2">
            <SearchInput
                placeholder="Filter payments..."
                value={paymentFilter}
                onChange={(e) => {
                  setPaymentFilter(e.target.value);
                setPaymentCurrentPage(1);
                }}
              />

          <Dialog open={paymentDialogOpen} onOpenChange={(isOpen) => {
              if (!isOpen) {
                // Clean up when dialog is closed
                setSelectedStudent(null);
                // Remove studentId from URL when dialog is closed
                const url = new URL(window.location);
                url.searchParams.delete('studentId');
                window.history.replaceState({}, '', url);
              }
              setPaymentDialogOpen(isOpen);
            }}>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-neon-green to-neon-cyan hover:from-neon-green/80 hover:to-neon-cyan/80"
                onClick={() => setPaymentDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-1" /> Add Payment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg flex flex-col" style={{maxHeight:'80vh'}}>
              <DialogHeader className="shrink-0">
                <DialogTitle>Add Payment {selectedStudent ? `for ${selectedStudent.name}` : ''}</DialogTitle>
                {selectedStudent && 
                  <p className="text-sm text-muted-foreground mt-2">
                    Student ID: {selectedStudent._id}, Roll Number: {selectedStudent.rollNumber || 'N/A'}
                  </p>
                }
              </DialogHeader>
              <div className="overflow-y-auto flex-1">
                <PaymentForm 
                  student={selectedStudent}
                  onSubmit={(data) => {
                    handleCreatePayment(data);
                    setSelectedStudent(null); // Clear the selected student
                    const url = new URL(window.location);
                    url.searchParams.delete('studentId');
                    window.history.replaceState({}, '', url);
                  }}
                  onCancel={() => {
                    setPaymentDialogOpen(false);
                    setSelectedStudent(null); // Clear the selected student
                    const url = new URL(window.location);
                    url.searchParams.delete('studentId');
                    window.history.replaceState({}, '', url);
                  }}
                />
              </div>
            </DialogContent>
          </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {paymentsLoading ? (
            <Table aria-busy="true">
              <TableBody>
                {[...Array(itemsPerPage)].map((_, idx) => (
                  <TableRow key={idx} className="h-10">
                    <TableCell><Skeleton className="h-3 w-36" /></TableCell>
                    <TableCell><Skeleton className="h-3 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-3 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-3 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-3 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-3 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-3 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-3 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-3 w-20" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : filteredPayments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
              <h3 className="font-semibold text-lg">No payments found</h3>
              <p className="text-muted-foreground">
                {paymentFilter ? "No matches for your filter. Try a different search term." : "Start by adding a new payment."}
              </p>
            </div>
          ) : (
            <>
          <Table>
            <TableHeader className="glass border-b bg-white/5 backdrop-blur-sm">
              <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => handleSortPayments('student')}>
                      <div className="flex items-center">
                        Student {getSortIcon('student', paymentSort)}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSortPayments('feeName')}>
                      <div className="flex items-center">
                        Fee Type {getSortIcon('feeName', paymentSort)}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSortPayments('amount')}>
                      <div className="flex items-center">
                        Amount {getSortIcon('amount', paymentSort)}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSortPayments('dueDate')}>
                      <div className="flex items-center">
                        Due Date {getSortIcon('dueDate', paymentSort)}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSortPayments('paidDate')}>
                      <div className="flex items-center">
                        Paid Date {getSortIcon('paidDate', paymentSort)}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSortPayments('status')}>
                      <div className="flex items-center">
                        Status {getSortIcon('status', paymentSort)}
                      </div>
                    </TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                  {paginatedPayments.map((payment) => (
                <TableRow key={payment._id || payment.id}>
                  <TableCell className="font-medium">
                    <div>
                      <p>{payment.student?.name || payment.studentName || 'N/A'}</p>
                      <p className="text-sm text-muted-foreground">{payment.student?.rollNumber || payment.studentId || ''}</p>
                    </div>
                  </TableCell>
                  <TableCell>{payment.feeStructure?.name || payment.feeName || payment.courseName || 'N/A'}</TableCell>
                  <TableCell>{formatCurrency(payment.totalAmount || payment.amount)}</TableCell>
                  <TableCell>
                    {(payment.status === 'paid' || payment.status === 'completed') 
                      ? 'Paid' 
                      : payment.dueDate 
                        ? payment.dueDate.substring(0,10) 
                        : 'N/A'}
                  </TableCell>
                  <TableCell>{
                    payment.paidDate
                      ? payment.paidDate.substring(0, 10)
                      : payment.status === 'completed'
                        ? (payment.createdAt || '').substring(0, 10)
                        : 'Not paid'
                  }</TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell>{payment.paymentMethod || 'N/A'}</TableCell>
                  <TableCell>{payment.transactionId || payment._id || 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleDownloadPDF(payment, 'invoice')}
                              disabled={downloadingPDF.paymentId === payment._id}
                            >
                              {downloadingPDF.paymentId === payment._id && downloadingPDF.type === 'invoice' ? (
                                <Loader2 className="h-4 w-4 animate-spin text-neon-cyan" />
                              ) : (
                                <FileText className="h-4 w-4 text-neon-cyan" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Download Invoice</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      {/* Only show receipt download if payment has deposit or is paid */}
                      {(payment.depositAmount > 0 || payment.status === 'completed') && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleDownloadPDF(payment, 'receipt')}
                                disabled={downloadingPDF.paymentId === payment._id}
                              >
                                {downloadingPDF.paymentId === payment._id && downloadingPDF.type === 'receipt' ? (
                                  <Loader2 className="h-4 w-4 animate-spin text-neon-green" />
                                ) : (
                                  <Receipt className="h-4 w-4 text-neon-green" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Download Receipt</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}

                      {/* Delete Payment Button */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => confirmDeletePayment(payment)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete Payment</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
              
              {paymentPageCount > 1 && (
                <div className="flex justify-center mt-4">
                  <Pagination>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPaymentCurrentPage(p => Math.max(1, p - 1))}
                      disabled={paymentCurrentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="mx-4">
                      Page {paymentCurrentPage} of {paymentPageCount}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPaymentCurrentPage(p => Math.min(paymentPageCount, p + 1))}
                      disabled={paymentCurrentPage === paymentPageCount}
                    >
                      Next
                    </Button>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* EMI Management */}
      <Card className="glass border-white/10 hover-lift">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              EMI Management
            </CardTitle>
            <CardDescription>
              Manage installment payments for students
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <EMIManagement />
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass border-white/10 hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fee Structures</CardTitle>
            <BookOpen className="h-4 w-4 text-neon-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neon-purple">{feeStructures.length}</div>
            <p className="text-xs text-muted-foreground">
              {feeStructures.filter(f => f.isActive).length} active
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass border-white/10 hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Calendar className="h-4 w-4 text-neon-cyan" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neon-cyan">
              {studentPayments.filter(p => p.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting payment
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass border-white/10 hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Payments</CardTitle>
            <DollarSign className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {analytics?.failedPayments || studentPayments.filter(p => p.status === 'overdue').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass border-white/10 hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
            <DollarSign className="h-4 w-4 text-neon-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neon-green">
              {formatCurrency(
                analytics?.totalRevenue || 
                studentPayments
                  .filter(p => p.status === 'paid' || p.status === 'completed')
                  .reduce((sum, p) => sum + (p.totalAmount || p.amount || 0), 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the fee structure
              {feeToDelete ? ` "${feeToDelete.name}"` : ''}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete payment confirmation dialog */}
      <AlertDialog open={paymentDeleteDialogOpen} onOpenChange={setPaymentDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the payment
              {paymentToDelete ? ` for ${paymentToDelete.student?.name || paymentToDelete.studentName || 'this student'}` : ''}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeletePayment} 
              className="bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
