import { useState, useEffect } from 'react';
import { apiCall } from '../config/api';
import { useToast } from './use-toast';

export const useBatches = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState({});
  const [lastFetch, setLastFetch] = useState(null);
  const { toast } = useToast();

  const fetchBatches = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiCall('/batches');
      setBatches(data.batches || []);
      setAnalytics(data.analytics || {});
      setLastFetch(Date.now());
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
    analytics,
    lastFetch,
    fetchBatches,
    createBatch: async (batchData) => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiCall('/batches', {
          method: 'POST',
          body: JSON.stringify(batchData)
        });
        setBatches(prev => [...prev, data]);
        toast({
          title: 'Batch created',
          description: 'The batch was added successfully.',
        });
        await fetchBatches();
        return data;
      } catch (err) {
        setError(err.message);
        toast({
          title: 'Error creating batch',
          description: err.message,
          variant: 'destructive',
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    updateBatch: async (batchId, batchData) => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiCall(`/batches/${batchId}`, {
          method: 'PUT',
          body: JSON.stringify(batchData)
        });
        setBatches(prev => prev.map(b => b._id === batchId ? { ...b, ...data } : b));
        toast({
          title: 'Batch updated',
          description: 'Changes have been saved.',
        });
        await fetchBatches();
        return data;
      } catch (err) {
        setError(err.message);
        toast({
          title: 'Error updating batch',
          description: err.message,
          variant: 'destructive',
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    deleteBatch: async (batchId) => {
      setLoading(true);
      setError(null);
      try {
        await apiCall(`/batches/${batchId}`, {
          method: 'DELETE',
        });
        // Remove from local state after successful delete
        setBatches(prev => prev.filter(batch => batch._id !== batchId));
        toast({
          title: 'Batch deleted',
          description: 'The batch has been removed.',
        });
        await fetchBatches();
      } catch (err) {
        setError(err.message);
        toast({
          title: 'Error deleting batch',
          description: err.message,
          variant: 'destructive',
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
  };
};
