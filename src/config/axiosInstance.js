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

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
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
                const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });

                const newToken = refreshResponse.data.token;
                localStorage.setItem('authToken', newToken);

                axiosInstance.defaults.headers.Authorization = 'Bearer ' + newToken;
                originalRequest.headers.Authorization = 'Bearer ' + newToken;

                processQueue(null, newToken);

                return axiosInstance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);

                // Optionally clear tokens and force logout
                localStorage.removeItem('authToken');
                window.location.href = '/login'; // Redirect to login

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
