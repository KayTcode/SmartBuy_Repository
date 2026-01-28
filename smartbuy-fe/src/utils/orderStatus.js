/**
 * Order status utilities - Đảm bảo status mapping nhất quán trên toàn bộ ứng dụng
 */

import { IconFileText, IconCheckCircle, IconPackage, IconTruck, IconCelebration } from '../components/icons';

export const getStatusColor = (status) => {
    const colors = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-blue-100 text-blue-800',
        processing: 'bg-purple-100 text-purple-800',
        shipping: 'bg-indigo-100 text-indigo-800',
        delivered: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
};

export const getStatusText = (status) => {
    const texts = {
        pending: 'Chờ xác nhận',
        confirmed: 'Đã xác nhận',
        processing: 'Đang xử lý',
        shipping: 'Đang giao hàng',
        delivered: 'Đã giao hàng',
        cancelled: 'Đã hủy'
    };
    return texts[status] || status;
};

export const statusOptions = [
    { value: 'pending', label: 'Chờ xác nhận' },
    { value: 'confirmed', label: 'Đã xác nhận' },
    { value: 'processing', label: 'Đang xử lý' },
    { value: 'shipping', label: 'Đang giao hàng' },
    { value: 'delivered', label: 'Đã giao hàng' },
    { value: 'cancelled', label: 'Đã hủy' }
];

// Note: statusSteps icons are used as emoji strings in OrderTracking component
// They will be replaced with icon components in the component itself
export const statusSteps = [
    { key: 'pending', label: 'Chờ xác nhận', icon: IconFileText },
    { key: 'confirmed', label: 'Đã xác nhận', icon: IconCheckCircle },
    { key: 'processing', label: 'Đang xử lý', icon: IconPackage },
    { key: 'shipping', label: 'Đang giao', icon: IconTruck },
    { key: 'delivered', label: 'Đã giao', icon: IconCelebration }
];

export const getCurrentStepIndex = (status) => {
    return statusSteps.findIndex(step => step.key === status);
};
