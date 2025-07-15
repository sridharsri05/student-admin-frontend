import axios from 'axios';

const API_BASE_URL = 'https://student-server-ten.vercel.app/api'


// const API_BASE_URL = import.meta.env.PROD
//     ? 'https://student-server-ten.vercel.app/api'
//     : import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // If your backend uses httpOnly cookies for refresh
});

// Request interceptor: add access token if available
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Track refresh state to avoid multiple refreshes
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

// Response interceptor: handle 401 and retry
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check if config is available
        if (!originalRequest) return Promise.reject(error);

        // Prevent infinite loops
        if (originalRequest._isRetry) {
            return Promise.reject(error);
        }

        const status = error.response?.status;
        const isAuthError = status === 401 || (status === 403 && (error.response.data?.error || '').toLowerCase().includes('invalid token'));

        if (isAuthError && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = 'Bearer ' + token;
                        return axiosInstance(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshResponse = await axios.get(`${API_BASE_URL}/auth/refresh`, {
                    withCredentials: true
                });

                if (!refreshResponse.data || !refreshResponse.data.accessToken) {
                    throw new Error('No access token in refresh response');
                }

                const newToken = refreshResponse.data.accessToken;
                localStorage.setItem('authToken', newToken);

                axiosInstance.defaults.headers.Authorization = 'Bearer ' + newToken;
                originalRequest.headers.Authorization = 'Bearer ' + newToken;

                processQueue(null, newToken);

                return axiosInstance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);

                // Clear tokens and user data but don't redirect immediately
                localStorage.removeItem('authToken');
                localStorage.removeItem('userData');

                // Only redirect to login if we're not already on the login page
                if (!window.location.pathname.includes('/login')) {
                    // Use a timeout to prevent immediate redirect during in-flight requests
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 100);
                }

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
