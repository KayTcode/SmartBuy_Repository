import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocale } from '../i18n/LocaleContext';

function Register({ onNavigate }) {
    const { register } = useAuth();
    const { t } = useLocale();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (field) => (e) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
        setErrorMessage('');
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Vui lòng nhập họ tên';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }
        
        if (!formData.password) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }
        
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu không khớp';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setErrorMessage('');

        try {
            const result = await register(formData.name, formData.email, formData.password);
            
            if (result.success) {
                // Redirect to home
                onNavigate('home');
            } else {
                setErrorMessage(result.message || 'Đăng ký thất bại');
            }
        } catch (error) {
            console.error('Register error:', error);
            setErrorMessage(error.message || 'Đăng ký thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-md px-4 py-16">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <h1 className="text-3xl font-semibold text-slate-900 mb-2 text-center">
                    Đăng ký
                </h1>
                <p className="text-sm text-slate-600 mb-6 text-center">
                    Tạo tài khoản mới để bắt đầu mua sắm
                </p>

                {errorMessage && (
                    <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Họ và tên
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
                            Email
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
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={handleChange('password')}
                            className={`w-full rounded-2xl border ${errors.password ? 'border-red-300' : 'border-slate-200'} px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30`}
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Xác nhận mật khẩu
                        </label>
                        <input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange('confirmPassword')}
                            className={`w-full rounded-2xl border ${errors.confirmPassword ? 'border-red-300' : 'border-slate-200'} px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30`}
                            placeholder="••••••••"
                        />
                        {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-600">
                    Đã có tài khoản?{' '}
                    <button
                        onClick={() => onNavigate('login')}
                        className="font-semibold text-primary hover:text-primary-dark"
                    >
                        Đăng nhập
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Register;
