
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
        statusCounts: {}
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

    const updatePaymentStatus = async (paymentId, status, notes = '') => {
        try {
            const response = await apiCall(`/payments/${paymentId}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status, notes })
            });
            await fetchPayments();
            await fetchAnalytics();
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const getPendingPayments = async () => {
        try {
            const response = await apiCall('/payments/pending');
            return response.pendingPayments || [];
        } catch (err) {
            console.error('Get pending payments error:', err);
            return [];
        }
    };

    useEffect(() => {
        fetchPayments();
        fetchAnalytics();
    }, []);

    return {
        payments,
        analytics,
        loading,
        error,
        fetchPayments,
        fetchAnalytics,
        createPayment,
        updatePaymentStatus,
        getPendingPayments,
        refetch: () => {
            fetchPayments();
            fetchAnalytics();
        }
    };
};