/**
 * Format number to Vietnamese currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatVND = (amount) => {
    if (amount === null || amount === undefined) return '0₫';
    
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

/**
 * Format number to Vietnamese currency without symbol
 * @param {number} amount - Amount to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (amount) => {
    if (amount === null || amount === undefined) return '0';
    
    return new Intl.NumberFormat('vi-VN').format(amount);
};

export default formatVND;
