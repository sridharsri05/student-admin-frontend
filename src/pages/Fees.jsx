
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
import { Plus, Edit2, Trash2, DollarSign, Calendar, BookOpen } from 'lucide-react';

export const Fees = () => {
  const [feeStructures, setFeeStructures] = useState([
    {
      id: 1,
      name: 'Monthly Tuition Fee',
      type: 'recurring',
      amount: 500,
      frequency: 'monthly',
      category: 'tuition',
      description: 'Regular monthly tuition fee',
      isActive: true,
      dueDate: 5, // 5th of every month
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'Admission Fee',
      type: 'one-time',
      amount: 200,
      frequency: 'once',
      category: 'admission',
      description: 'One-time admission processing fee',
      isActive: true,
      dueDate: null,
      createdAt: '2024-01-10'
    },
    {
      id: 3,
      name: 'Lab Fee',
      type: 'recurring',
      amount: 100,
      frequency: 'quarterly',
      category: 'facility',
      description: 'Laboratory usage and maintenance fee',
      isActive: true,
      dueDate: 1, // 1st of quarter months
      createdAt: '2024-01-20'
    }
  ]);

  const [studentPayments, setStudentPayments] = useState([
    {
      id: 1,
      studentId: 'STU001',
      studentName: 'John Doe',
      feeStructureId: 1,
      feeName: 'Monthly Tuition Fee',
      amount: 500,
      dueDate: '2024-12-05',
      paidDate: '2024-12-03',
      status: 'paid',
      paymentMethod: 'card',
      transactionId: 'TXN001'
    },
    {
      id: 2,
      studentId: 'STU002',
      studentName: 'Jane Smith',
      feeStructureId: 1,
      feeName: 'Monthly Tuition Fee',
      amount: 500,
      dueDate: '2024-12-05',
      paidDate: null,
      status: 'pending',
      paymentMethod: null,
      transactionId: null
    },
    {
      id: 3,
      studentId: 'STU003',
      studentName: 'Mike Johnson',
      feeStructureId: 1,
      feeName: 'Monthly Tuition Fee',
      amount: 525, // with late fee
      dueDate: '2024-11-05',
      paidDate: null,
      status: 'overdue',
      paymentMethod: null,
      transactionId: null
    }
  ]);

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

  useEffect(() => {
    // Load data from localStorage
    const savedFees = localStorage.getItem('eduflow-fees');
    const savedPayments = localStorage.getItem('eduflow-payments');
    
    if (savedFees) {
      setFeeStructures(JSON.parse(savedFees));
    }
    if (savedPayments) {
      setStudentPayments(JSON.parse(savedPayments));
    }
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.amount) {
      toast({
        title: "Please fill required fields",
        description: "Name and amount are required.",
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

    if (editingFee) {
      // Update existing fee
      const updatedFees = feeStructures.map(fee => 
        fee.id === editingFee.id ? { ...fee, ...feeData } : fee
      );
      setFeeStructures(updatedFees);
      localStorage.setItem('eduflow-fees', JSON.stringify(updatedFees));
      
      toast({
        title: "Fee structure updated",
        description: "The fee structure has been successfully updated.",
      });
    } else {
      // Create new fee
      const newFee = {
        ...feeData,
        id: Date.now()
      };
      const updatedFees = [...feeStructures, newFee];
      setFeeStructures(updatedFees);
      localStorage.setItem('eduflow-fees', JSON.stringify(updatedFees));
      
      toast({
        title: "Fee structure created",
        description: "New fee structure has been successfully created.",
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
    setDialogOpen(true);
  };

  const handleDelete = (feeId) => {
    const updatedFees = feeStructures.filter(fee => fee.id !== feeId);
    setFeeStructures(updatedFees);
    localStorage.setItem('eduflow-fees', JSON.stringify(updatedFees));
    
    toast({
      title: "Fee structure deleted",
      description: "The fee structure has been successfully deleted.",
    });
  };

  const getStatusBadge = (status) => {
    const variants = {
      paid: 'default',
      pending: 'secondary',
      overdue: 'destructive'
    };
    
    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fees Management</h1>
          <p className="text-muted-foreground">Manage fee structures and track payments</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingFee(null)}>
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
                  <Label htmlFor="name">Fee Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Monthly Tuition Fee"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    placeholder="0.00"
                  />
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
                    />
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

      {/* Fee Structures */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Fee Structures
          </CardTitle>
          <CardDescription>
            Manage different types of fees for your institution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feeStructures.map((fee) => (
                <TableRow key={fee.id}>
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
                        onClick={() => handleDelete(fee.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Payment Tracking
          </CardTitle>
          <CardDescription>
            Track student payments and outstanding fees
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Fee Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Paid Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Transaction ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">
                    <div>
                      <p>{payment.studentName}</p>
                      <p className="text-sm text-muted-foreground">{payment.studentId}</p>
                    </div>
                  </TableCell>
                  <TableCell>{payment.feeName}</TableCell>
                  <TableCell>{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>{payment.dueDate}</TableCell>
                  <TableCell>{payment.paidDate || 'Not paid'}</TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell>{payment.paymentMethod || 'N/A'}</TableCell>
                  <TableCell>{payment.transactionId || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fee Structures</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feeStructures.length}</div>
            <p className="text-xs text-muted-foreground">
              {feeStructures.filter(f => f.isActive).length} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {studentPayments.filter(p => p.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting payment
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Payments</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {studentPayments.filter(p => p.status === 'overdue').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                studentPayments
                  .filter(p => p.status === 'paid')
                  .reduce((sum, p) => sum + p.amount, 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
