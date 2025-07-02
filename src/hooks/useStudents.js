
import { useState, useEffect } from 'react';
import { apiCall } from '../config/api';
import { useToast } from './use-toast';

export const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchStudents = async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams(params).toString();
      const endpoint = `/students${queryParams ? `?${queryParams}` : ''}`;
      const data = await apiCall(endpoint);
      setStudents(data.students || []);
      return data;
    } catch (err) {
      setError(err.message);
      toast({
        title: "Error fetching students",
        description: err.message,
        variant: "destructive",
      });
      return { students: [], total: 0 };
    } finally {
      setLoading(false);
    }
  };

  const createStudent = async (studentData) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiCall('/students', {
        method: 'POST',
        body: JSON.stringify(studentData),
      });
      
      toast({
        title: "Student registered successfully!",
        description: "The student has been added to the system.",
      });
      
      // Refresh the students list
      await fetchStudents();
      return data;
    } catch (err) {
      setError(err.message);
      toast({
        title: "Registration failed",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateStudent = async (id, studentData) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiCall(`/students/${id}`, {
        method: 'PUT',
        body: JSON.stringify(studentData),
      });
      
      toast({
        title: "Student updated successfully!",
        description: "The student information has been updated.",
      });
      
      await fetchStudents();
      return data;
    } catch (err) {
      setError(err.message);
      toast({
        title: "Update failed",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await apiCall(`/students/${id}`, {
        method: 'DELETE',
      });
      
      toast({
        title: "Student deleted successfully!",
        description: "The student has been removed from the system.",
      });
      
      await fetchStudents();
    } catch (err) {
      setError(err.message);
      toast({
        title: "Delete failed",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return {
    students,
    loading,
    error,
    fetchStudents,
    createStudent,
    updateStudent,
    deleteStudent,
  };
};
