import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/config/axiosInstance';
import { toast } from '@/hooks/use-toast';

export const useDiscounts = () => {
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();

    // Fetch all discounts
    const { data: discounts = [], isLoading: isLoadingDiscounts } = useQuery({
        queryKey: ['discounts'],
        queryFn: async () => {
            try {
                const response = await api.get('/discounts');
                return response.data;
            } catch (error) {
                console.error('Error fetching discounts:', error);
                toast({
                    title: 'Error fetching discounts',
                    description: error.response?.data?.message || 'Failed to load discounts',
                    variant: 'destructive',
                });
                return [];
            }
        }
    });

    // Create a new discount
    const createDiscount = async (discountData) => {
        setLoading(true);
        try {
            const response = await api.post('/discounts', discountData);
            queryClient.invalidateQueries(['discounts']);
            setLoading(false);
            return response.data;
        } catch (error) {
            setLoading(false);
            console.error('Error creating discount:', error);
            toast({
                title: 'Error creating discount',
                description: error.response?.data?.message || 'Failed to create discount',
                variant: 'destructive',
            });
            throw error;
        }
    };

    // Update an existing discount
    const updateDiscount = async (id, discountData) => {
        setLoading(true);
        try {
            const response = await api.put(`/discounts/${id}`, discountData);
            queryClient.invalidateQueries(['discounts']);
            setLoading(false);
            return response.data;
        } catch (error) {
            setLoading(false);
            console.error('Error updating discount:', error);
            toast({
                title: 'Error updating discount',
                description: error.response?.data?.message || 'Failed to update discount',
                variant: 'destructive',
            });
            throw error;
        }
    };

    // Delete a discount
    const deleteDiscount = async (id) => {
        setLoading(true);
        try {
            const response = await api.delete(`/discounts/${id}`);
            queryClient.invalidateQueries(['discounts']);
            setLoading(false);
            return response.data;
        } catch (error) {
            setLoading(false);
            console.error('Error deleting discount:', error);
            toast({
                title: 'Error deleting discount',
                description: error.response?.data?.message || 'Failed to delete discount',
                variant: 'destructive',
            });
            throw error;
        }
    };

    // Validate a discount code
    const validateDiscountCode = async (data) => {
        setLoading(true);
        try {
            const response = await api.post('/discounts/validate', data);
            setLoading(false);
            return response.data;
        } catch (error) {
            setLoading(false);
            console.error('Error validating discount code:', error);
            toast({
                title: 'Invalid discount code',
                description: error.response?.data?.message || 'Failed to validate discount code',
                variant: 'destructive',
            });
            throw error;
        }
    };

    // Apply a discount code (increment usage count)
    const applyDiscount = async (code) => {
        setLoading(true);
        try {
            const response = await api.post('/discounts/apply', { code });
            setLoading(false);
            return response.data;
        } catch (error) {
            setLoading(false);
            console.error('Error applying discount:', error);
            toast({
                title: 'Error applying discount',
                description: error.response?.data?.message || 'Failed to apply discount',
                variant: 'destructive',
            });
            throw error;
        }
    };

    // Get available discounts for a specific course or fee structure
    const getAvailableDiscounts = async (courseId, feeStructureId) => {
        setLoading(true);
        try {
            const params = {};
            if (courseId) params.courseId = courseId;
            if (feeStructureId) params.feeStructureId = feeStructureId;

            const response = await api.get('/discounts/available', { params });
            setLoading(false);
            return response.data;
        } catch (error) {
            setLoading(false);
            console.error('Error fetching available discounts:', error);
            toast({
                title: 'Error fetching discounts',
                description: error.response?.data?.message || 'Failed to load available discounts',
                variant: 'destructive',
            });
            throw error;
        }
    };

    return {
        discounts,
        loading: loading || isLoadingDiscounts,
        createDiscount,
        updateDiscount,
        deleteDiscount,
        validateDiscountCode,
        applyDiscount,
        getAvailableDiscounts
    };
}; 