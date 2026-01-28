import apiClient from './apiClient';

// Orders API
export const ordersAPI = {
    // Create new order (guest or logged in)
    create: async (orderData, token = null) => {
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        return apiClient.post('/orders', orderData, config);
    },

    // Get all orders (Admin)
    getAll: async (filters = {}, token) => {
        const params = {};
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params[key] = value;
        });
        
        return apiClient.get('/orders', {
            params,
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    // Get order by ID
    getById: async (id, token) => {
        return apiClient.get(`/orders/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    // Get order by order number (public)
    getByNumber: async (orderNumber) => {
        const response = await apiClient.get(`/orders/number/${orderNumber}`);
        return response.data;
    },

    // Track order (public - by order number + email)
    track: async (orderNumber, email) => {
        const response = await apiClient.get('/orders/track', {
            params: { orderNumber, email }
        });
        return response.data;
    },

    // Get user's orders
    getMyOrders: async (page = 1, limit = 10, token) => {
        return apiClient.get('/orders/my-orders', {
            params: { page, limit },
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    // Cancel order
    cancel: async (id, reason, token) => {
        return apiClient.put(`/orders/${id}/cancel`, 
            { reason },
            { headers: { Authorization: `Bearer ${token}` } }
        );
    },

    // Admin: Update order status
    updateStatus: async (id, status, note, token) => {
        return apiClient.put(`/orders/${id}/status`,
            { status, note },
            { headers: { Authorization: `Bearer ${token}` } }
        );
    },

    // Admin: Update payment status
    updatePayment: async (id, paymentStatus, token) => {
        return apiClient.put(`/orders/${id}/payment`,
            { paymentStatus },
            { headers: { Authorization: `Bearer ${token}` } }
        );
    },

    // Admin: Get order statistics
    getStats: async (token) => {
        return apiClient.get('/orders/stats', {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    // Admin: Delete order
    delete: async (id, token) => {
        return apiClient.delete(`/orders/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
};

export default ordersAPI;
