import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Filter, X } from "lucide-react";

export const PaymentFilters = () => {
  const [filters, setFilters] = useState({
    dateFrom: null,
    dateTo: null,
    amountMin: "",
    amountMax: "",
    status: "all",
    paymentMethod: "all",
    studentBatch: "all",
  });

  const [appliedFilters, setAppliedFilters] = useState([]);

  const handleApplyFilters = () => {
    console.log("Applying filters:", filters);
    // Here you would make API call with filters

    // Mock applied filters for UI demonstration
    const newAppliedFilters = [];
    if (filters.status !== "all")
      newAppliedFilters.push({ type: "status", value: filters.status });
    if (filters.paymentMethod !== "all")
      newAppliedFilters.push({ type: "method", value: filters.paymentMethod });
    if (filters.amountMin)
      newAppliedFilters.push({ type: "min-amount", value: `₹${filters.amountMin}+` });
    if (filters.amountMax)
      newAppliedFilters.push({ type: "max-amount", value: `₹${filters.amountMax}-` });

    setAppliedFilters(newAppliedFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      dateFrom: null,
      dateTo: null,
      amountMin: "",
      amountMax: "",
      status: "all",
      paymentMethod: "all",
      studentBatch: "all",
    });
    setAppliedFilters([]);
  };

  const removeFilter = (filterToRemove) => {
    setAppliedFilters(appliedFilters.filter((filter) => filter !== filterToRemove));
  };

  return (
    <div className="space-y-6">
      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="text-gradient flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Advanced Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Date Range */}
            <div className="space-y-2">
              <Label>Date Range</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="glass border-white/20">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {filters.dateFrom ? filters.dateFrom.toDateString() : "From"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 glass border-white/20">
                    <Calendar
                      mode="single"
                      selected={filters.dateFrom}
                      onSelect={(date) => setFilters({ ...filters, dateFrom: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="glass border-white/20">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {filters.dateTo ? filters.dateTo.toDateString() : "To"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 glass border-white/20">
                    <Calendar
                      mode="single"
                      selected={filters.dateTo}
                      onSelect={(date) => setFilters({ ...filters, dateTo: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Amount Range */}
            <div className="space-y-2">
              <Label>Amount Range</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.amountMin}
                  onChange={(e) => setFilters({ ...filters, amountMin: e.target.value })}
                  className="glass border-white/20"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.amountMax}
                  onChange={(e) => setFilters({ ...filters, amountMax: e.target.value })}
                  className="glass border-white/20"
                />
              </div>
            </div>

            {/* Payment Status */}
            <div className="space-y-2">
              <Label>Payment Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters({ ...filters, status: value })}
              >
                <SelectTrigger className="glass border-white/20">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="glass border-white/20 bg-card">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select
                value={filters.paymentMethod}
                onValueChange={(value) =>
                  setFilters({ ...filters, paymentMethod: value })
                }
              >
                <SelectTrigger className="glass border-white/20">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent className="glass border-white/20 bg-card">
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Student Batch */}
            <div className="space-y-2">
              <Label>Student Batch</Label>
              <Select
                value={filters.studentBatch}
                onValueChange={(value) => setFilters({ ...filters, studentBatch: value })}
              >
                <SelectTrigger className="glass border-white/20">
                  <SelectValue placeholder="Select batch" />
                </SelectTrigger>
                <SelectContent className="glass border-white/20 bg-card">
                  <SelectItem value="all">All Batches</SelectItem>
                  <SelectItem value="batch-2024-1">Batch 2024-1</SelectItem>
                  <SelectItem value="batch-2024-2">Batch 2024-2</SelectItem>
                  <SelectItem value="batch-2023-4">Batch 2023-4</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleApplyFilters}
              className="bg-gradient-to-r from-neon-green to-neon-cyan hover:from-neon-green/80 hover:to-neon-cyan/80"
            >
              Apply Filters
            </Button>
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="border-white/20 hover:bg-white/10"
            >
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Applied Filters */}
      {appliedFilters.length > 0 && (
        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle className="text-sm">Applied Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {appliedFilters.map((filter, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-primary/20 text-primary px-3 py-1 rounded-full text-sm"
                >
                  <span>{filter.value}</span>
                  <button
                    onClick={() => removeFilter(filter)}
                    className="hover:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
