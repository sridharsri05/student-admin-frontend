import { useState, useEffect } from 'react';
import { apiCall } from '../config/api';
import { useToast } from './use-toast';

export const useFees = () => {
    const [feeStructures, setFeeStructures] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { toast } = useToast();

    const fetchFees = async () => {
        setLoading(true);
        try {
            const data = await apiCall('/fee-structures');
            setFeeStructures(data.feeStructures || []);
            setError(null);
        } catch (err) {
            setError(err.message);
            toast({
                title: 'Error fetching fee structures',
                description: err.message,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const createFee = async (feeData) => {
        setLoading(true);
        try {
            const created = await apiCall('/fee-structures', {
                method: 'POST',
                body: JSON.stringify(feeData),
            });
            toast({ title: 'Fee structure created' });
            await fetchFees();
            return created;
        } catch (err) {
            setError(err.message);
            toast({
                title: 'Error creating fee',
                description: err.message,
                variant: 'destructive',
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateFee = async (feeId, feeData) => {
        setLoading(true);
        try {
            const updated = await apiCall(`/fee-structures/${feeId}`, {
                method: 'PUT',
                body: JSON.stringify(feeData),
            });
            toast({ title: 'Fee structure updated' });
            await fetchFees();
            return updated;
        } catch (err) {
            setError(err.message);
            toast({
                title: 'Error updating fee',
                description: err.message,
                variant: 'destructive',
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteFee = async (feeId) => {
        setLoading(true);
        try {
            await apiCall(`/fee-structures/${feeId}`, {
                method: 'DELETE',
            });
            toast({ title: 'Fee structure deleted' });
            await fetchFees();
        } catch (err) {
            setError(err.message);
            toast({
                title: 'Error deleting fee',
                description: err.message,
                variant: 'destructive',
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFees();
    }, []);

    return {
        feeStructures,
        loading,
        error,
        fetchFees,
        createFee,
        updateFee,
        deleteFee,
        refetch: fetchFees,
    };
}; 