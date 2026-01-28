import { useState } from 'react';
import { ordersAPI } from '../services/api';
import { useLocale } from '../i18n/LocaleContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { formatVND } from '../utils/currency';

function Checkout({ onNavigate }) {
    const { t } = useLocale();
    const { cart, clearCart } = useCart();
    const { user, token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [orderNumber, setOrderNumber] = useState('');
    
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        street: '',
        city: 'Hà Nội',
        district: '',
        ward: '',
        note: '',
        paymentMethod: 'cod'
    });

    const [errors, setErrors] = useState({});

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const shippingFee = subtotal >= 200000 ? 0 : 30000;
    const total = subtotal + shippingFee;

    const handleChange = (field) => (e) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
        // Clear error when user types
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) newErrors.name = 'Vui lòng nhập họ tên';
        if (!formData.email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Vui lòng nhập số điện thoại';
        } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Số điện thoại không hợp lệ';
        }
        if (!formData.street.trim()) newErrors.street = 'Vui lòng nhập địa chỉ';
        if (!formData.district.trim()) newErrors.district = 'Vui lòng nhập quận/huyện';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        if (cart.length === 0) {
            setError('Giỏ hàng trống');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const orderData = {
                customerInfo: {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    address: {
                        street: formData.street,
                        city: formData.city,
                        district: formData.district,
                        ward: formData.ward,
                        note: formData.note
                    }
                },
                items: cart.map(item => ({
                    product: item.id || item._id,
                    quantity: item.quantity || 1
                })),
                paymentMethod: formData.paymentMethod,
                note: formData.note
            };

            const response = await ordersAPI.create(orderData, token);
            
            if (response.success) {
                setOrderNumber(response.data.orderNumber);
                clearCart();
            }
        } catch (err) {
            console.error('Order error:', err);
            setError(err.message || 'Đặt hàng thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    // Success screen
    if (orderNumber) {
        return (
            <div className="mx-auto max-w-2xl px-4 py-16 text-center">
                <div className="rounded-3xl border border-green-200 bg-green-50 p-8">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white">
                        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-green-800 mb-2">
                        Đặt hàng thành công!
                    </h2>
                    <p className="text-green-700 mb-4">
                        Mã đơn hàng của bạn:
                    </p>
                    <p className="text-3xl font-bold text-green-900 mb-6">
                        {orderNumber}
                    </p>
                    <p className="text-sm text-green-600 mb-6">
                        Chúng tôi đã gửi email xác nhận đến <strong>{formData.email}</strong>
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <button
                            onClick={() => onNavigate('shop')}
                            className="rounded-full bg-green-500 px-6 py-3 text-sm font-semibold text-white hover:bg-green-600"
                        >
                            Tiếp tục mua sắm
                        </button>
                        <button
                            onClick={() => onNavigate('my-orders')}
                            className="rounded-full border border-green-500 px-6 py-3 text-sm font-semibold text-green-700 hover:bg-green-50"
                        >
                            Đơn hàng của tôi
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-10">
            <div className="mb-6">
                <button
                    onClick={() => onNavigate('cart')}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-primary"
                >
                    ← Quay lại giỏ hàng
                </button>
            </div>

            <h1 className="text-3xl font-semibold text-slate-900 mb-8">Thanh toán</h1>

            {error && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Customer Info */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">
                            Thông tin khách hàng
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Họ và tên *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange('name')}
                                    className={`w-full rounded-2xl border ${errors.name ? 'border-red-300' : 'border-slate-200'} px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30`}
                                    placeholder="Nguyễn Văn A"
                                />
                                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange('email')}
                                    className={`w-full rounded-2xl border ${errors.email ? 'border-red-300' : 'border-slate-200'} px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30`}
                                    placeholder="email@example.com"
                                />
                                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Số điện thoại *
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange('phone')}
                                    className={`w-full rounded-2xl border ${errors.phone ? 'border-red-300' : 'border-slate-200'} px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30`}
                                    placeholder="0987654321"
                                />
                                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">
                            Địa chỉ giao hàng
                        </h2>
                        <div className="grid gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Địa chỉ *
                                </label>
                                <input
                                    type="text"
                                    value={formData.street}
                                    onChange={handleChange('street')}
                                    className={`w-full rounded-2xl border ${errors.street ? 'border-red-300' : 'border-slate-200'} px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30`}
                                    placeholder="Số nhà, tên đường"
                                />
                                {errors.street && <p className="mt-1 text-xs text-red-500">{errors.street}</p>}
                            </div>
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Phường/Xã
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.ward}
                                        onChange={handleChange('ward')}
                                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                                        placeholder="Phường/Xã"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Quận/Huyện *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.district}
                                        onChange={handleChange('district')}
                                        className={`w-full rounded-2xl border ${errors.district ? 'border-red-300' : 'border-slate-200'} px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30`}
                                        placeholder="Quận/Huyện"
                                    />
                                    {errors.district && <p className="mt-1 text-xs text-red-500">{errors.district}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Tỉnh/Thành phố
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={handleChange('city')}
                                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Ghi chú
                                </label>
                                <textarea
                                    value={formData.note}
                                    onChange={handleChange('note')}
                                    rows={3}
                                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    placeholder="Ghi chú thêm về đơn hàng (tùy chọn)"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">
                            Phương thức thanh toán
                        </h2>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 cursor-pointer hover:border-primary">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="cod"
                                    checked={formData.paymentMethod === 'cod'}
                                    onChange={handleChange('paymentMethod')}
                                    className="h-4 w-4 text-primary"
                                />
                                <div>
                                    <p className="font-medium text-slate-900">Thanh toán khi nhận hàng (COD)</p>
                                    <p className="text-xs text-slate-500">Thanh toán bằng tiền mặt khi nhận hàng</p>
                                </div>
                            </label>
                            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 cursor-pointer hover:border-primary opacity-50">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="bank_transfer"
                                    disabled
                                    className="h-4 w-4 text-primary"
                                />
                                <div>
                                    <p className="font-medium text-slate-900">Chuyển khoản ngân hàng</p>
                                    <p className="text-xs text-slate-500">Đang phát triển</p>
                                </div>
                            </label>
                        </div>
                    </div>
                </form>

                {/* Order Summary */}
                <div className="space-y-6">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sticky top-4">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">
                            Đơn hàng của bạn
                        </h2>
                        
                        <div className="space-y-3 mb-4">
                            {cart.map((item) => (
                                <div key={item.id} className="flex items-center gap-3 text-sm">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="h-12 w-12 rounded-lg object-cover"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium text-slate-900">{item.name}</p>
                                        <p className="text-slate-500">x{item.quantity || 1}</p>
                                    </div>
                                    <p className="font-semibold text-slate-900">
                                        {formatVND(item.price * (item.quantity || 1))}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-slate-200 pt-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-600">Tạm tính</span>
                                <span className="font-medium">{formatVND(subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">Phí vận chuyển</span>
                                <span className="font-medium">
                                    {shippingFee === 0 ? 'Miễn phí' : formatVND(shippingFee)}
                                </span>
                            </div>
                            {subtotal < 200000 && (
                                <p className="text-xs text-slate-500">
                                    Mua thêm {formatVND(200000 - subtotal)} để được miễn phí ship
                                </p>
                            )}
                            <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-semibold">
                                <span>Tổng cộng</span>
                                <span className="text-primary">{formatVND(total)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading || cart.length === 0}
                            className="mt-6 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Đang xử lý...' : 'Đặt hàng'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
