import apiClient from './apiClient';

// Auth API
export const authAPI = {
    login: async (credentials) => {
        return apiClient.post('/auth/login', credentials);
    },

    register: async (userData) => {
        return apiClient.post('/auth/register', userData);
    },

    logout: async () => {
        return apiClient.post('/auth/logout');
    }
};

export default authAPI;
