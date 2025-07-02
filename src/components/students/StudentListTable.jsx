
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Eye, Search } from "lucide-react";
import { useStudents } from "@/hooks/useStudents";

export const StudentListTable = ({ searchTerm = "" }) => {
  const { students, loading, deleteStudent } = useStudents();
  const [localSearch, setLocalSearch] = useState("");

  const filteredStudents = students.filter(student => {
    const searchStr = (searchTerm || localSearch).toLowerCase();
    return (
      student.name?.toLowerCase().includes(searchStr) ||
      student.email?.toLowerCase().includes(searchStr) ||
      student.phone?.toLowerCase().includes(searchStr)
    );
  });

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteStudent(id);
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  if (loading) {
    return (
      <Card className="glass border-white/10">
        <CardContent className="p-6">
          <div className="text-center">Loading students...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass border-white/10">
      <CardHeader>
        <CardTitle className="text-gradient">Student List</CardTitle>
        {!searchTerm && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-10 glass border-white/20"
            />
          </div>
        )}
      </CardHeader>
      <CardContent>
        {filteredStudents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No students found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.phone}</TableCell>
                    <TableCell>
                      {student.batches ? (
                        <Badge variant="outline">
                          {student.batches.name}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">No Batch</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-neon-green/20 text-neon-green">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(student.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
