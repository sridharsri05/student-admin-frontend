import { useState, useEffect, useCallback, useRef } from 'react';
import { apiCall } from '../config/api';
import { useToast } from './use-toast';

// Cache configuration
const CACHE_KEY = 'students_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);
  const { toast } = useToast();

  // Refs to track state
  const isInitialized = useRef(false);
  const lastUpdateTime = useRef(null);

  // Load cached data from localStorage
  const loadCachedData = useCallback(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const now = Date.now();

        // Check if cache is still valid
        if (now - timestamp < CACHE_DURATION) {
          setStudents(data);
          setLastFetch(timestamp);
          return true; // Cache is valid
        }
      }
    } catch (err) {
      console.warn('Failed to load cached data:', err);
    }
    return false; // Cache is invalid or doesn't exist
  }, []);

  // Save data to cache
  const saveToCache = useCallback((data) => {
    try {
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (err) {
      console.warn('Failed to save to cache:', err);
    }
  }, []);

  // Clear cache
  const clearCache = useCallback(() => {
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch (err) {
      console.warn('Failed to clear cache:', err);
    }
  }, []);

  // Check if we need to fetch fresh data
  const shouldFetchFreshData = useCallback(() => {
    // If we have no cached data, we need to fetch
    if (!loadCachedData()) {
      return true;
    }

    // If cache is expired, we need to fetch
    const now = Date.now();
    if (lastFetch && (now - lastFetch > CACHE_DURATION)) {
      return true;
    }

    // If we have recent data, no need to fetch
    return false;
  }, [lastFetch, loadCachedData]);

  const fetchStudents = useCallback(async (params = {}, forceRefresh = false) => {
    // Don't fetch if we have recent data and not forcing refresh
    if (!forceRefresh && !shouldFetchFreshData()) {
      return { students, total: students.length };
    }

    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams(params).toString();
      const endpoint = `/students${queryParams ? `?${queryParams}` : ''}`;
      const data = await apiCall(endpoint);
      const studentsData = data.students || [];

      setStudents(studentsData);
      setLastFetch(Date.now());
      saveToCache(studentsData);

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
  }, [students, shouldFetchFreshData, saveToCache, toast]);

  // Optimistic updates for better UX
  const updateLocalStudents = useCallback((updater) => {
    setStudents(prevStudents => {
      const newStudents = updater(prevStudents);
      saveToCache(newStudents);
      return newStudents;
    });
  }, [saveToCache]);

  const createStudent = useCallback(async (studentData) => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiCall('/students', {
        method: 'POST',
        body: JSON.stringify(studentData),
      });

      // Optimistically add to local state
      updateLocalStudents(prevStudents => [...prevStudents, data]);

      toast({
        title: "Student registered successfully!",
        description: "The student has been added to the system.",
      });

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
  }, [updateLocalStudents, toast]);

  const updateStudent = useCallback(async (id, studentData) => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiCall(`/students/${id}`, {
        method: 'PUT',
        body: JSON.stringify(studentData),
      });

      // Optimistically update local state
      updateLocalStudents(prevStudents =>
        prevStudents.map(student =>
          student._id === id ? { ...student, ...data } : student
        )
      );

      toast({
        title: "Student updated successfully!",
        description: "The student information has been updated.",
      });

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
  }, [updateLocalStudents, toast]);

  const deleteStudent = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      await apiCall(`/students/${id}`, {
        method: 'DELETE',
      });

      // Optimistically remove from local state
      updateLocalStudents(prevStudents =>
        prevStudents.filter(student => student._id !== id)
      );

      toast({
        title: "Student deleted successfully!",
        description: "The student has been removed from the system.",
      });
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
  }, [updateLocalStudents, toast]);

  // Get a single student by ID
  const getStudentById = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall(`/students/${id}`);
      return response.student;
    } catch (err) {
      setError(err.message);
      toast({
        title: "Error fetching student",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Initialize data on mount
  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;

      // Try to load from cache first
      const cacheValid = loadCachedData();

      // If cache is invalid or doesn't exist, fetch fresh data
      if (!cacheValid) {
        fetchStudents();
      }
    }
  }, [loadCachedData, fetchStudents]);

  // Refresh data when component becomes visible (optional)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && shouldFetchFreshData()) {
        fetchStudents();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [shouldFetchFreshData, fetchStudents]);

  return {
    students,
    loading,
    error,
    lastFetch,
    fetchStudents: (params) => fetchStudents(params, false),
    refreshStudents: (params) => fetchStudents(params, true), // Force refresh
    createStudent,
    updateStudent,
    deleteStudent,
    clearCache,
    getStudentById,
  };
};
