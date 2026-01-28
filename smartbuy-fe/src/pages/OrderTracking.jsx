import { useState, useEffect } from 'react';
import { ordersAPI } from '../services/api';
import { formatVND } from '../utils/currency';
import { getStatusColor, getStatusText, statusSteps, getCurrentStepIndex } from '../utils/orderStatus';

function OrderTracking() {
    // Get orderNumber and email from URL params or sessionStorage
    const urlParams = new URLSearchParams(window.location.search);
    const sessionOrderNumber = sessionStorage.getItem('trackOrderNumber');
    const sessionEmail = sessionStorage.getItem('trackEmail');
    
    const initialOrderNumber = urlParams.get('order') || sessionOrderNumber || '';
    const initialEmail = urlParams.get('email') || sessionEmail || '';

    const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
    const [email, setEmail] = useState(initialEmail);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Auto-load order if orderNumber and email are provided
    useEffect(() => {
        if (initialOrderNumber && initialEmail) {
            handleAutoLoad(initialOrderNumber, initialEmail);
            // Clear sessionStorage after loading
            sessionStorage.removeItem('trackOrderNumber');
            sessionStorage.removeItem('trackEmail');
        }
    }, []);

    const handleAutoLoad = async (orderNum, orderEmail) => {
        setLoading(true);
        setError('');
        setOrder(null);

        try {
            const data = await ordersAPI.track(orderNum.trim(), orderEmail.trim());
            setOrder(data);
        } catch (err) {
            console.error('Track order error:', err);
            setError(err.message || 'Không tìm thấy đơn hàng. Vui lòng kiểm tra lại thông tin.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!orderNumber.trim() || !email.trim()) {
            setError('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        setLoading(true);
        setError('');
        setOrder(null);

        try {
            const data = await ordersAPI.track(orderNumber.trim(), email.trim());
            setOrder(data);
        } catch (err) {
            console.error('Track order error:', err);
            setError(err.message || 'Không tìm thấy đơn hàng. Vui lòng kiểm tra lại thông tin.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="mx-auto max-w-4xl px-4 py-10">
            <h1 className="text-3xl font-semibold text-slate-900 mb-8">
                Tra cứu đơn hàng
            </h1>

            {/* Search Form */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm mb-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Mã đơn hàng
                        </label>
                        <input
                            type="text"
                            value={orderNumber}
                            onChange={(e) => setOrderNumber(e.target.value)}
                            placeholder="VD: SB25010100001"
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Email đặt hàng
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@example.com"
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                    </div>
                    {error && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
                    >
                        {loading ? 'Đang tìm kiếm...' : 'Tra cứu đơn hàng'}
                    </button>
                </form>
            </div>

            {/* Order Details */}
            {order && (
                <div className="space-y-6">
                    {/* Order Info */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-900">
                                    Đơn hàng #{order.orderNumber}
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">
                                    Đặt ngày: {new Date(order.createdAt).toLocaleString('vi-VN')}
                                </p>
                            </div>
                            <span className={`rounded-full px-4 py-2 text-xs font-semibold ${getStatusColor(order.status)}`}>
                                {getStatusText(order.status)}
                            </span>
                        </div>

                        {/* Status Timeline */}
                        {order.status !== 'cancelled' && (
                            <div className="mb-6">
                                <div className="flex items-center justify-between">
                                    {statusSteps.map((step, index) => {
                                        const currentIndex = getCurrentStepIndex(order.status);
                                        const isActive = index <= currentIndex;
                                        const isCurrent = index === currentIndex;
                                        const IconComponent = step.icon;

                                        return (
                                            <div key={step.key} className="flex flex-1 items-center">
                                                <div className="flex flex-col items-center">
                                                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                                        isActive ? 'bg-primary text-white' : 'bg-slate-200 text-slate-400'
                                                    } ${isCurrent ? 'ring-4 ring-primary/30' : ''}`}>
                                                        <IconComponent className="h-5 w-5" />
                                                    </div>
                                                    <p className={`mt-2 text-xs font-medium ${
                                                        isActive ? 'text-slate-900' : 'text-slate-400'
                                                    }`}>
                                                        {step.label}
                                                    </p>
                                                </div>
                                                {index < statusSteps.length - 1 && (
                                                    <div className={`h-1 flex-1 ${
                                                        index < currentIndex ? 'bg-primary' : 'bg-slate-200'
                                                    }`} />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Customer Info */}
                        <div className="grid gap-4 sm:grid-cols-2 border-t border-slate-200 pt-4">
                            <div>
                                <p className="text-xs font-semibold uppercase text-slate-500 mb-2">
                                    Thông tin khách hàng
                                </p>
                                <p className="text-sm font-medium text-slate-900">{order.customerInfo.name}</p>
                                <p className="text-sm text-slate-600">{order.customerInfo.email}</p>
                                <p className="text-sm text-slate-600">{order.customerInfo.phone}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase text-slate-500 mb-2">
                                    Địa chỉ giao hàng
                                </p>
                                <p className="text-sm text-slate-600">
                                    {order.customerInfo.address.street}
                                    {order.customerInfo.address.ward && `, ${order.customerInfo.address.ward}`}
                                    {order.customerInfo.address.district && `, ${order.customerInfo.address.district}`}
                                    {order.customerInfo.address.city && `, ${order.customerInfo.address.city}`}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">
                            Sản phẩm đã đặt
                        </h3>
                        <div className="space-y-3">
                            {order.items.map((item) => (
                                <div key={item._id} className="flex items-center gap-4 rounded-2xl border border-slate-100 p-3">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="h-16 w-16 rounded-lg object-cover"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium text-slate-900">{item.name}</p>
                                        <p className="text-sm text-slate-500">
                                            {formatVND(item.price)} x {item.quantity}
                                        </p>
                                    </div>
                                    <p className="font-semibold text-slate-900">
                                        {formatVND(item.subtotal)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-600">Tạm tính</span>
                                <span className="font-medium">{formatVND(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">Phí vận chuyển</span>
                                <span className="font-medium">
                                    {order.shippingFee === 0 ? 'Miễn phí' : formatVND(order.shippingFee)}
                                </span>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Giảm giá</span>
                                    <span className="font-medium">-{formatVND(order.discount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-semibold">
                                <span>Tổng cộng</span>
                                <span className="text-primary">{formatVND(order.total)}</span>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-600">Phương thức thanh toán:</span>
                                <span className="font-medium text-slate-900">
                                    {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : order.paymentMethod}
                                </span>
                            </div>
                            <div className="mt-2 flex items-center justify-between text-sm">
                                <span className="text-slate-600">Trạng thái thanh toán:</span>
                                <span className={`font-medium ${
                                    order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
                                }`}>
                                    {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Status History */}
                    {order.statusHistory && order.statusHistory.length > 0 && (
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">
                                Lịch sử đơn hàng
                            </h3>
                            <div className="space-y-3">
                                {order.statusHistory.map((history, index) => (
                                    <div key={index} className="flex gap-3 text-sm">
                                        <div className="flex flex-col items-center">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                ●
                                            </div>
                                            {index < order.statusHistory.length - 1 && (
                                                <div className="h-full w-px bg-slate-200" />
                                            )}
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <p className="font-medium text-slate-900">
                                                {getStatusText(history.status)}
                                            </p>
                                            {history.note && (
                                                <p className="text-slate-600">{history.note}</p>
                                            )}
                                            <p className="text-xs text-slate-400 mt-1">
                                                {new Date(history.updatedAt).toLocaleString('vi-VN')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default OrderTracking;
