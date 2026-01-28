import { useCart } from '../contexts/CartContext';
import { useLocale } from '../i18n/LocaleContext';
import { IconTrash } from '../components/icons';
import { formatVND } from '../utils/currency';

function Cart({ onNavigate }) {
    const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();
    const { t } = useLocale();

    const subtotal = getCartTotal();
    const shippingFee = subtotal >= 200000 ? 0 : 30000;
    const total = subtotal + shippingFee;

    const handleCheckout = () => {
        if (cart.length > 0) {
            onNavigate('checkout');
        }
    };

    if (cart.length === 0) {
        return (
            <div className="mx-auto max-w-4xl px-4 py-16 text-center">
                <div className="rounded-3xl border border-slate-200 bg-white p-12">
                    <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                        Giỏ hàng trống
                    </h2>
                    <p className="text-slate-600 mb-6">
                        Bạn chưa có sản phẩm nào trong giỏ hàng
                    </p>
                    <button
                        onClick={() => onNavigate('shop')}
                        className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark"
                    >
                        Tiếp tục mua sắm
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-10">
            <h1 className="text-3xl font-semibold text-slate-900 mb-8">
                Giỏ hàng ({getCartCount()} sản phẩm)
            </h1>

            <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
                {/* Cart Items */}
                <div className="space-y-4">
                    {cart.map((item) => (
                        <div
                            key={item.id}
                            className="flex gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
                        >
                            <img
                                src={item.image}
                                alt={item.name}
                                className="h-24 w-24 rounded-2xl object-cover"
                            />
                            <div className="flex flex-1 flex-col justify-between">
                                <div>
                                    <h3 className="font-semibold text-slate-900">{item.name}</h3>
                                    <p className="text-sm text-slate-500 mt-1">{item.category}</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:border-primary hover:text-primary"
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:border-primary hover:text-primary"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <p className="text-lg font-semibold text-slate-900">
                                        {formatVND(item.price * item.quantity)}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500"
                                aria-label="Xóa sản phẩm"
                            >
                                <IconTrash className="h-5 w-5" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="space-y-6">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sticky top-4">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">
                            Tổng đơn hàng
                        </h2>
                        
                        <div className="space-y-3 border-b border-slate-200 pb-4 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Tạm tính</span>
                                <span className="font-medium">{formatVND(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
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
                        </div>

                        <div className="flex justify-between text-lg font-semibold mb-6">
                            <span>Tổng cộng</span>
                            <span className="text-primary">{formatVND(total)}</span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark"
                        >
                            Thanh toán
                        </button>

                        <button
                            onClick={() => onNavigate('shop')}
                            className="mt-3 w-full rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Tiếp tục mua sắm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;
