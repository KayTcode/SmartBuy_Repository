import axios from 'axios';

// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9999/api';

// Create axios instance
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // You can add auth token here if needed
        // const token = localStorage.getItem('token');
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => {
        // Return the data directly
        return response.data;
    },
    (error) => {
        // Handle errors
        const message = error.response?.data?.error?.message 
            || error.response?.data?.message 
            || error.message 
            || 'API request failed';
        
        console.error('API Error:', message);
        
        // Create a custom error object
        const customError = new Error(message);
        customError.status = error.response?.status;
        customError.data = error.response?.data;
        
        return Promise.reject(customError);
    }
);

export default apiClient;
