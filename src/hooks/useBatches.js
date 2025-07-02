
import { useState, useEffect } from 'react';
import { apiCall } from '../config/api';
import { useToast } from './use-toast';

export const useBatches = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchBatches = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiCall('/batches');
      setBatches(data.batches || []);
      return data;
    } catch (err) {
      setError(err.message);
      toast({
        title: "Error fetching batches",
        description: err.message,
        variant: "destructive",
      });
      return { batches: [] };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  return {
    batches,
    loading,
    error,
    fetchBatches,
  };
};
