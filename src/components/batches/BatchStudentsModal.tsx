import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus } from "lucide-react";
import { useStudents } from "@/hooks/useStudents";
import { apiCall } from "@/config/api";

interface BatchStudentsModalProps {
  batchId: string;
  open: boolean;
  onClose: () => void;
}

const BatchStudentsModal = ({ batchId, open, onClose }: BatchStudentsModalProps) => {
  const { students, fetchStudents, refreshStudents } = useStudents();
  const [batchStudents, setBatchStudents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const loadBatchStudents = async () => {
    setLoading(true);
    try {
      const res = await apiCall(`/batches/${batchId}/students`);
      setBatchStudents(res || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadBatchStudents();
      fetchStudents();
    }
  }, [open]);

  const addStudent = async (studentId: string) => {
    setLoading(true);
    try {
      await apiCall(`/batches/${batchId}/students/${studentId}`, { method: "POST" });
      await loadBatchStudents();
      refreshStudents();
    } finally {
      setLoading(false);
    }
  };

  const removeStudent = async (studentId: string) => {
    if (!confirm("Remove student from batch?")) return;
    setLoading(true);
    try {
      await apiCall(`/batches/${batchId}/students/${studentId}`, { method: "DELETE" });
      setBatchStudents(prev => prev.filter(s => s._id !== studentId));
      refreshStudents();
    } finally {
      setLoading(false);
    }
  };

  const availableStudents = students.filter(
    (s) => !batchStudents.find((bs) => bs._id === s._id) && s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass border-white/10 w-full max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-gradient">Manage Students</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="current" className="w-full space-y-4">
          <TabsList className="glass border-white/20 w-full grid grid-cols-2">
            <TabsTrigger value="current" className="data-[state=active]:bg-primary/20">Current Students</TabsTrigger>
            <TabsTrigger value="add" className="data-[state=active]:bg-primary/20">Add Students</TabsTrigger>
          </TabsList>

          <TabsContent value="current">
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading students...</p>
            ) : batchStudents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No students in this batch.</p>
            ) : (
              <div className="max-h-64 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {batchStudents.map((stu) => (
                      <TableRow key={stu._id} className="hover:bg-white/5">
                        <TableCell>{stu.name}</TableCell>
                        <TableCell>{stu.email}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="icon" onClick={() => removeStudent(stu._id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="add">
            <Input placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} className="glass border-white/20 mb-3" />
            <div className="max-h-60 overflow-y-auto grid grid-cols-1 gap-2">
              {availableStudents.slice(0, 20).map((stu) => (
                <Card key={stu._id} className="glass border-white/10 hover-lift">
                  <CardContent className="p-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{stu.name}</p>
                      <p className="text-xs text-muted-foreground">{stu.email}</p>
                    </div>
                    <Button size="icon" onClick={() => addStudent(stu._id)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {availableStudents.length === 0 && <p className="text-sm text-muted-foreground">No matching students.</p>}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default BatchStudentsModal; 