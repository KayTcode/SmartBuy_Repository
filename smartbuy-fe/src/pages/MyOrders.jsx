import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ordersAPI } from '../services/api';
import { formatVND } from '../utils/currency';
import { getStatusColor, getStatusText } from '../utils/orderStatus';

function MyOrders({ onNavigate }) {
    const { user, token, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!authLoading) {
            if (user && token) {
                fetchOrders();
            } else {
                setLoading(false);
            }
        }
    }, [user, token, authLoading]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await ordersAPI.getMyOrders(1, 20, token);
            console.log('Orders response:', response); // Debug log
            // apiClient already returns response.data, so response = { success: true, data: [...], pagination: {...} }
            setOrders(response.data || []);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError(err.message || 'Không thể tải đơn hàng');
        } finally {
            setLoading(false);
        }
    };


    if (!user) {
        return (
            <div className="mx-auto max-w-4xl px-4 py-16 text-center">
                <p className="text-slate-600 mb-4">Vui lòng đăng nhập để xem đơn hàng</p>
                <button
                    onClick={() => onNavigate('login')}
                    className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark"
                >
                    Đăng nhập
                </button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="mx-auto max-w-6xl px-4 py-16 text-center">
                <p className="text-slate-600">Đang tải...</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl px-4 py-10">
            <h1 className="text-3xl font-semibold text-slate-900 mb-8">
                Đơn hàng của tôi
            </h1>

            {error && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            {orders.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
                    <p className="text-slate-600 mb-4">Bạn chưa có đơn hàng nào</p>
                    <button
                        onClick={() => onNavigate('shop')}
                        className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark"
                    >
                        Mua sắm ngay
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">
                                        Đơn hàng #{order.orderNumber}
                                    </h3>
                                    <p className="text-sm text-slate-500 mt-1">
                                        {new Date(order.createdAt).toLocaleString('vi-VN')}
                                    </p>
                                </div>
                                <span className={`rounded-full px-4 py-2 text-xs font-semibold ${getStatusColor(order.status)}`}>
                                    {getStatusText(order.status)}
                                </span>
                            </div>

                            <div className="space-y-2 mb-4">
                                {order.items.slice(0, 2).map((item) => (
                                    <div key={item._id} className="flex items-center gap-3 text-sm">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="h-12 w-12 rounded-lg object-cover"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium text-slate-900">{item.name}</p>
                                            <p className="text-slate-500">x{item.quantity}</p>
                                        </div>
                                        <p className="font-semibold text-slate-900">
                                            {formatVND(item.subtotal)}
                                        </p>
                                    </div>
                                ))}
                                {order.items.length > 2 && (
                                    <p className="text-sm text-slate-500">
                                        +{order.items.length - 2} sản phẩm khác
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                                <div>
                                    <p className="text-sm text-slate-600">Tổng cộng</p>
                                    <p className="text-lg font-semibold text-primary">
                                        {formatVND(order.total)}
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        // Store order info in sessionStorage for OrderTracking to read
                                        sessionStorage.setItem('trackOrderNumber', order.orderNumber);
                                        sessionStorage.setItem('trackEmail', order.customerInfo.email);
                                        onNavigate('track');
                                    }}
                                    className="rounded-full border border-primary px-6 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-white transition"
                                >
                                    Xem chi tiết
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyOrders;
