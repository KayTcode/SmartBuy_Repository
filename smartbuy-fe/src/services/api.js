// Main API exports - Re-export all services
export { productsAPI } from './products.service';
export { ordersAPI } from './orders.service';
export { authAPI } from './auth.service';
export { default as apiClient } from './apiClient';

// Default export for convenience
import productsAPI from './products.service';
import ordersAPI from './orders.service';
import authAPI from './auth.service';

export default {
    products: productsAPI,
    orders: ordersAPI,
    auth: authAPI,
};
