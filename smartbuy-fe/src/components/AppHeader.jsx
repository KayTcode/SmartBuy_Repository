import { useMemo, useState } from 'react';
import { translations } from '../i18n/translations.js';
import { useLocale } from '../i18n/LocaleContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useCart } from '../contexts/CartContext.jsx';
import { formatVND } from '../utils/currency.js';
import {
  IconArrowRight,
  IconCart,
  IconChevronDown,
  IconHeart,
  IconMapPin,
  IconPhone,
  IconSearch,
  IconUser,
  IconLogout
} from './icons.jsx';

function AppHeader({ activePage = 'home', onNavigate = () => {} }) {
  const { locale, setLocale, t } = useLocale();
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartCount, getCartTotal } = useCart();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const cartCount = getCartCount();
  const cartTotal = getCartTotal();

  const navItems = useMemo(
    () => [
      { key: 'home', label: t('header.nav.home'), type: 'page' },
      { key: 'shop', label: t('header.nav.shop'), type: 'page' },
      { key: 'blog', label: t('header.nav.blog'), type: 'page' },
      { key: 'about', label: t('header.nav.about'), type: 'page' },
      { key: 'contact', label: t('header.nav.contact'), type: 'page' },
      { key: 'mealPlanner', label: t('header.nav.mealPlanner'), type: 'page' },
      {key: 'bmi', label: 'Đo BMI sức khỏe', type: 'page' },
      {key: 'eatClean' , label: 'Món ăn dinh dưỡng', type: 'page' }
    ],
    [t]
  );

  const languageOptions = useMemo(
    () => Object.entries(translations).map(([key, value]) => ({ key, label: value.language })),
    []
  );

  return (
    <header className="bg-white shadow-sm">
      <div className="border-b border-slate-800/30 bg-slate-900 text-xs text-slate-200">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-2 sm:text-sm">
          <div className="flex items-center gap-2">
            <IconMapPin className="h-4 w-4 text-primary" />
            <span>{t('header.location')}</span>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1 font-medium">
              <select
                className="rounded-md border border-slate-700 bg-transparent px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-100 outline-none focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm"
                value={locale}
                onChange={(event) => setLocale(event.target.value)}
              >
                {languageOptions.map((option) => (
                  <option key={option.key} value={option.key} className="text-slate-900">
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 font-medium text-slate-100 transition hover:text-white"
                >
                  <IconUser className="h-4 w-4" />
                  <span>{user?.name}</span>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-slate-200 bg-white shadow-lg z-50">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onNavigate('my-orders');
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      Đơn hàng của tôi
                    </button>
                    {user?.role === 'admin' && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onNavigate('admin-dashboard');
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 border-t border-slate-200"
                      >
                        🔧 Admin Panel
                      </button>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                        onNavigate('home');
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-slate-200"
                    >
                      <IconLogout className="h-4 w-4" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="font-medium text-slate-100 transition hover:text-white"
              >
                {t('header.signIn')}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-2">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="Smart Buy" className="h-[100px] w-[100px] "/>
          </div>

          <form className="relative flex w-full max-w-2xl items-center rounded-full border border-slate-200 bg-white pl-5 pr-1 shadow-sm shadow-slate-200/40">
            <IconSearch className="h-5 w-5 text-slate-400" />
            <input
              type="search"
              className="w-full border-none bg-transparent px-3 py-3 text-sm focus:outline-none focus:ring-0"
              placeholder={t('header.searchPlaceholder')}
            />
            <button
              type="submit"
              className="flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
            >
              {t('header.searchButton')}
              <IconArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-primary hover:text-primary"
            >
              <IconHeart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-[18px] items-center justify-center rounded-full bg-primary-light px-1 text-xs font-semibold text-primary-dark">
                0
              </span>
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('cart')}
                className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-primary hover:text-primary"
              >
                <IconCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-[18px] items-center justify-center rounded-full bg-primary-light px-1 text-xs font-semibold text-primary-dark">
                    {cartCount}
                  </span>
                )}
              </button>
              <div className="hidden text-left text-sm font-medium text-slate-600 sm:block">
                <div className="text-xs uppercase text-slate-400">
                  {t('header.cartLabel')}
                </div>
                <div className="font-semibold text-slate-900">
                  {formatVND(cartTotal)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-slate-200 pt-4 md:flex-row md:items-center">
          <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-600 md:gap-6">
            {navItems.map((item) =>
              item.type === 'page' ? (
                <button
                  type="button"
                  key={item.key}
                  className={`relative pb-1 transition hover:text-primary ${
                    activePage === item.key ? 'text-primary' : ''
                  }`}
                  onClick={() => onNavigate(item.key)}
                >
                  {item.label}
                  {activePage === item.key ? (
                    <span className="absolute inset-x-0 -bottom-[6px] h-0.5 rounded-full bg-primary" />
                  ) : null}
                </button>
              ) : (
                <a
                  key={item.key}
                  href={`#${item.key}`}
                  className="transition hover:text-primary"
                >
                  {item.label}
                </a>
              )
            )}
          </nav>
          <div className="flex items-center gap-3 text-sm text-slate-700">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <IconPhone className="h-5 w-5" />
            </span>
            <div>
              <div className="text-xs uppercase text-slate-400">{t('header.hotlineLabel')}</div>
              <a href="tel:0397877618" className="font-semibold text-slate-900">
                0397877618
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
