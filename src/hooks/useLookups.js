import { useState, useEffect, useCallback, useRef } from 'react';
import { apiCall } from '../config/api';

// Cache configuration for lookups
const LOOKUP_CACHE_KEY = 'lookups_cache';
const LOOKUP_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes (lookups change less frequently)

export const useLookups = () => {
    const [lookups, setLookups] = useState({
        universities: [],
        courses: [],
        batches: [],
        coursePackages: [],
        courseModes: [],
        nationalities: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastFetch, setLastFetch] = useState(null);

    // Refs to track state
    const isInitialized = useRef(false);

    // Load cached lookups from localStorage
    const loadCachedLookups = useCallback(() => {
        try {
            const cached = localStorage.getItem(LOOKUP_CACHE_KEY);
            if (cached) {
                const { data, timestamp } = JSON.parse(cached);
                const now = Date.now();

                // Check if cache is still valid
                if (now - timestamp < LOOKUP_CACHE_DURATION) {
                    setLookups(data);
                    setLastFetch(timestamp);
                    return true; // Cache is valid
                }
            }
        } catch (err) {
            console.warn('Failed to load cached lookups:', err);
        }
        return false; // Cache is invalid or doesn't exist
    }, []);

    // Save lookups to cache
    const saveToCache = useCallback((data) => {
        try {
            const cacheData = {
                data,
                timestamp: Date.now()
            };
            localStorage.setItem(LOOKUP_CACHE_KEY, JSON.stringify(cacheData));
        } catch (err) {
            console.warn('Failed to save lookups to cache:', err);
        }
    }, []);

    // Clear lookups cache
    const clearCache = useCallback(() => {
        try {
            localStorage.removeItem(LOOKUP_CACHE_KEY);
        } catch (err) {
            console.warn('Failed to clear lookups cache:', err);
        }
    }, []);

    // Check if we need to fetch fresh lookups
    const shouldFetchFreshLookups = useCallback(() => {
        // If we have no cached data, we need to fetch
        if (!loadCachedLookups()) {
            return true;
        }

        // If cache is expired, we need to fetch
        const now = Date.now();
        if (lastFetch && (now - lastFetch > LOOKUP_CACHE_DURATION)) {
            return true;
        }

        // If we have recent data, no need to fetch
        return false;
    }, [lastFetch, loadCachedLookups]);

    const fetchLookups = useCallback(async (forceRefresh = false) => {
        // Don't fetch if we have recent data and not forcing refresh
        if (!forceRefresh && !shouldFetchFreshLookups()) {
            return lookups;
        }

        setLoading(true);
        setError(null);

        try {
            const [uniRes, courseRes, batchRes, packageRes, modeRes, nationRes] = await Promise.all([
                apiCall("/universities"),
                apiCall("/courses"),
                apiCall("/batch-preferences"),
                apiCall("/course-packages"),
                apiCall("/course-modes"),
                apiCall("/nationalities"),
            ]);

            const lookupsData = {
                universities: uniRes || [],
                courses: courseRes || [],
                batches: batchRes || [],
                coursePackages: packageRes || [],
                courseModes: modeRes || [],
                nationalities: nationRes || []
            };

            setLookups(lookupsData);
            setLastFetch(Date.now());
            saveToCache(lookupsData);

            return lookupsData;
        } catch (err) {
            setError(err.message);
            console.error('Failed to fetch lookups:', err);
            return lookups;
        } finally {
            setLoading(false);
        }
    }, [lookups, shouldFetchFreshLookups, saveToCache]);

    // Initialize lookups on mount
    useEffect(() => {
        if (!isInitialized.current) {
            isInitialized.current = true;

            // Try to load from cache first
            const cacheValid = loadCachedLookups();

            // If cache is invalid or doesn't exist, fetch fresh data
            if (!cacheValid) {
                fetchLookups();
            }
        }
    }, [loadCachedLookups, fetchLookups]);

    return {
        lookups,
        loading,
        error,
        lastFetch,
        fetchLookups: () => fetchLookups(false),
        refreshLookups: () => fetchLookups(true), // Force refresh
        clearCache,
    };
}; 