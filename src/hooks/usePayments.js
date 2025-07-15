
import { useState, useEffect } from 'react';
import { apiCall } from '../config/api';

export const usePayments = () => {
    const [payments, setPayments] = useState([]);
    const [analytics, setAnalytics] = useState({
        totalRevenue: 0,
        pendingPayments: 0,
        successfulPayments: 0,
        failedPayments: 0,
        monthlyRevenue: [],
        statusCounts: {},
        paymentMethodDistribution: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPayments = async (filters = {}) => {
        try {
            setLoading(true);
            const response = await apiCall('/payments', {
                method: 'GET',
                params: filters
            });
            setPayments(response.payments || []);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Fetch payments error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAnalytics = async (dateRange = {}) => {
        try {
            const response = await apiCall('/payments/analytics', {
                method: 'GET',
                params: dateRange
            });
            setAnalytics(response);
        } catch (err) {
            console.error('Fetch analytics error:', err);
        }
    };

    const createPayment = async (paymentData) => {
        try {
            const response = await apiCall('/payments', {
                method: 'POST',
                body: JSON.stringify(paymentData)
            });
            await fetchPayments();
            await fetchAnalytics();
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const updatePayment = async (paymentId, paymentData) => {
        try {
            const response = await apiCall(`/payments/${paymentId}`, {
                method: 'PUT',
                body: JSON.stringify(paymentData)
            });
            await fetchPayments();
            await fetchAnalytics();
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const deletePayment = async (paymentId) => {
        try {
            await apiCall(`/payments/${paymentId}`, {
                method: 'DELETE'
            });
            await fetchPayments();
            await fetchAnalytics();
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const refetch = async (filters = {}) => {
        setLoading(true);
        try {
            await Promise.all([
                fetchPayments(filters),
                fetchAnalytics(filters)
            ]);
        } catch (err) {
            setError(err.message);
            console.error('Refetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Load payments and analytics when component mounts
    useEffect(() => {
        refetch();
    }, []);

    return {
        payments,
        analytics,
        loading,
        error,
        fetchPayments,
        fetchAnalytics,
        createPayment,
        updatePayment,
        deletePayment,
        refetch
    };
};