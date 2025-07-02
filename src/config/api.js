
// const API_BASE_URL = process.env.NODE_ENV === 'production' 
//   ? 'https://your-backend-url.com/api'  // Replace with your actual backend URL
//   : 'http://localhost:5000/api';

// export const apiConfig = {
//   baseUrl: API_BASE_URL,
//   endpoints: {
//     students: '/students',
//     batches: '/batches',
//     payments: '/payments',
//     fees: '/fees',
//     settings: '/settings',
//     reports: '/reports',
//     whatsapp: '/whatsapp',
//     auth: '/auth'
//   }
// };

// export const apiCall = async (endpoint, options = {}) => {
//   const url = `${API_BASE_URL}${endpoint}`;
//   const defaultOptions = {
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   };

//   // Add auth token if available
//   const token = localStorage.getItem('authToken');
//   if (token) {
//     defaultOptions.headers.Authorization = `Bearer ${token}`;
//   }

//   const config = {
//     ...defaultOptions,
//     ...options,
//     headers: {
//       ...defaultOptions.headers,
//       ...options.headers,
//     },
//   };

//   try {
//     const response = await fetch(url, config);

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('API call failed:', error);
//     throw error;
//   }
// };

import axiosInstance from './axiosInstance';

export const apiCall = async (endpoint, options = {}) => {
  try {
    const config = {
      url: endpoint,
      method: options.method || 'GET',
      data: typeof options.body === 'string' ? JSON.parse(options.body) : options.body,
      params: options.params,
      ...options,
    };

    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    console.error('API call failed:', error);

    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Request failed');
    } else {
      throw new Error(error.message || 'Request failed');
    }
  }
};
