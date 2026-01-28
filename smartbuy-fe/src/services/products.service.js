import apiClient from './apiClient';

// Products API
export const productsAPI = {
    // Get all products with filters
    getAll: async (filters = {}) => {
        const params = {};
        
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                if (Array.isArray(value)) {
                    params[key] = value.join(',');
                } else {
                    params[key] = value;
                }
            }
        });

        const response = await apiClient.get('/products', { params });
        return response.data;
    },

    // Get product by ID
    getById: async (id) => {
        const response = await apiClient.get(`/products/${id}`);
        return response.data;
    },

    // Get featured products
    getFeatured: async (limit = 8) => {
        const response = await apiClient.get('/products/featured', { params: { limit } });
        return response.data;
    },

    // Get best sellers
    getBestSellers: async (limit = 8) => {
        const response = await apiClient.get('/products/best-sellers', { params: { limit } });
        return response.data;
    },

    // Get sale products
    getSale: async (limit = 10) => {
        const response = await apiClient.get('/products/sale', { params: { limit } });
        return response.data;
    },

    // Get products by category
    getByCategory: async (category, limit = 20) => {
        const response = await apiClient.get(`/products/category/${category}`, { params: { limit } });
        return response.data;
    },

    // Get products by BMI category
    getByBMI: async (bmiCategory, limit = 10) => {
        const response = await apiClient.get(`/products/bmi/${encodeURIComponent(bmiCategory)}`, { params: { limit } });
        return response.data;
    },

    // Get related products
    getRelated: async (id) => {
        const response = await apiClient.get(`/products/${id}/related`);
        return response.data;
    },

    // Get product statistics
    getStats: async () => {
        const response = await apiClient.get('/products/stats');
        return response.data;
    },

    // Search products
    search: async (query, filters = {}) => {
        const response = await apiClient.get('/products', { 
            params: { search: query, ...filters } 
        });
        return response.data;
    },

    // Admin: Create product
    create: async (productData, token) => {
        return apiClient.post('/products', productData, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    // Admin: Update product
    update: async (id, productData, token) => {
        return apiClient.put(`/products/${id}`, productData, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    // Admin: Delete product
    delete: async (id, token) => {
        return apiClient.delete(`/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
};

export default productsAPI;
