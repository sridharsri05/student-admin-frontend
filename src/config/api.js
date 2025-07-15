
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
