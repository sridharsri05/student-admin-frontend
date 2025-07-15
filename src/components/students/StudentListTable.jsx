import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { useStudents } from "@/hooks/useStudents";
import { DialogDescription } from "@/components/ui/dialog";

export const StudentListTable = ({ searchTerm = "", filteredStudents = [] }) => {
  const { deleteStudent } = useStudents();

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteStudent(id);
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  return (
    <Card className="glass border-white/10">
      <CardHeader>
        <CardTitle className="text-gradient">Student List</CardTitle>
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
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Phone</TableHead>
                  <TableHead className="hidden sm:table-cell">Batch</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student._id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{student.name}</div>
                        <div className="text-xs text-muted-foreground md:hidden">{student.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{student.email}</TableCell>
                    <TableCell className="hidden lg:table-cell">{student.phone}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {student.batchPreference ? (
                        <Badge variant="outline" className="text-xs">
                          {student.batchPreference.name}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">No Batch</Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge className="bg-neon-green/20 text-neon-green text-xs">
                        {student.status || "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 sm:gap-2">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3">
                          <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(student._id)}
                          className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
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
