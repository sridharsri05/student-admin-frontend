import { useState, useEffect } from 'react';
import { apiCall } from '@/config/api';

export const useBatchSchedule = (startDate, endDate) => {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams();
                if (startDate) params.append('startDate', startDate);
                if (endDate) params.append('endDate', endDate);
                const data = await apiCall(`/batches/schedule${params.toString() ? '?' + params.toString() : ''}`);
                setSchedule(data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [startDate, endDate]);

    return { schedule, loading, error };
}; 