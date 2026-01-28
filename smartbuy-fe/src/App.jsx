import { useEffect, useMemo, useState } from 'react';
import AppHeader from './components/AppHeader.jsx';
import AppFooter from './components/AppFooter.jsx';
import FloatingFacebookButton from './components/FloatingFacebookButton.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Shop from './pages/Shop.jsx';
import Blog from './pages/Blog.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import MealPlanner from './pages/MealPlanner.jsx';
import BMI from './pages/BMI.jsx';
import EatClean from './pages/EatClean.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderTracking from './pages/OrderTracking.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import MyOrders from './pages/MyOrders.jsx';
import AdminLayout from './components/AdminLayout.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import Users from './pages/admin/Users.jsx';
import Products from './pages/admin/Products.jsx';
import Categories from './pages/admin/Categories.jsx';
import AdminOrders from './pages/admin/Orders.jsx';
import { LocaleProvider, useLocale } from './i18n/LocaleContext.jsx';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { CartProvider } from './contexts/CartContext.jsx';
import { ToastProvider } from './contexts/ToastContext.jsx';
import { productsAPI } from './services/api.js';

function AppInner() {
  const { t } = useLocale();
  const { user } = useAuth();
  const [activePage, setActivePage] = useState('home');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(null);

  // Auto redirect admin to admin dashboard
  useEffect(() => {
    if (user && user.role === 'admin' && activePage === 'home') {
      setActivePage('admin-dashboard');
    }
  }, [user, activePage]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await productsAPI.getAll();
        setProducts(data);
        setError('');
      } catch (fetchError) {
        console.error('Error fetching products:', fetchError);
        setError(fetchError.message || 'load-error');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const applyRoute = () => {
      const path = window.location.pathname;
      const { page, productId } = parsePath(path);
      setActivePage(page);
      setSelectedProductId(productId ?? null);
    };

    applyRoute();
    window.addEventListener('popstate', applyRoute);
    return () => window.removeEventListener('popstate', applyRoute);
  }, []);

  const resolvedError =
    error === 'load-error' ? t('common.alertErrorDescription') : error || '';

  const selectedProduct = useMemo(
    () => products.find((item) => item.id === selectedProductId),
    [products, selectedProductId]
  );

  const relatedProducts = useMemo(() => {
    if (!selectedProduct) return [];
    return products
      .filter(
        (item) =>
          item.id !== selectedProduct.id && item.category === selectedProduct.category
      )
      .slice(0, 4);
  }, [products, selectedProduct]);

  useEffect(() => {
    if (activePage === 'product' && !loading && !selectedProduct) {
      setActivePage('shop');
    }
  }, [activePage, loading, selectedProduct]);

  const navigateTo = (pageKey, options = {}) => {
    let path = '/';
    if (pageKey === 'product' && options.productId) {
      path = `/product/${options.productId}`;
    } else if (pageKey !== 'home') {
      path = `/${pageKey}`;
    }
    
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (pageKey) => {
    navigateTo(pageKey);
  };

  const handleViewProduct = (product) => {
    if (!product) return;
    navigateTo('product', { productId: product.id });
  };

  const handleBackToShop = () => {
    navigateTo('shop');
  };

  const renderContent = () => {
    switch (activePage) {
      case 'home':
        return (
          <Home
            products={products}
            loading={loading}
            errorMessage={resolvedError}
            onExploreShop={() => handleNavigate('shop')}
            onNavigate={handleNavigate}
          />
        );
      case 'about':
        return <About />;
      case 'blog':
        return <Blog />;
      case 'contact':
        return <Contact />;
      case 'mealPlanner':
        return <MealPlanner products={products} loading={loading} />;
      case 'shop':
        return (
          <Shop
            products={products}
            loading={loading}
            error={resolvedError}
            onViewProduct={handleViewProduct}
          />
        );
      case 'product':
        return (
          <ProductDetail
            product={selectedProduct}
            relatedProducts={relatedProducts}
            onBack={handleBackToShop}
            onProductClick={handleViewProduct}
          />
        );
      case 'bmi':
        return <BMI />;
      case 'eatClean':
        return <EatClean />;
      case 'cart':
        return <Cart onNavigate={handleNavigate} />;
      case 'checkout':
        return <Checkout onNavigate={handleNavigate} />;
      case 'track':
        return <OrderTracking />;
      case 'login':
        return <Login onNavigate={handleNavigate} />;
      case 'register':
        return <Register onNavigate={handleNavigate} />;
      case 'my-orders':
        return <MyOrders onNavigate={handleNavigate} />;
      case 'admin-dashboard':
      case 'admin-users':
      case 'admin-products':
      case 'admin-categories':
      case 'admin-orders':
        if (user?.role !== 'admin') {
          return (
            <div className="text-center py-16">
              <p className="text-red-600 mb-4">Bạn không có quyền truy cập trang này</p>
              <button
                onClick={() => handleNavigate('home')}
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark"
              >
                Về trang chủ
              </button>
            </div>
          );
        }
        return (
          <AdminLayout activePage={activePage} onNavigate={handleNavigate}>
            {activePage === 'admin-dashboard' && <Dashboard />}
            {activePage === 'admin-users' && <Users />}
            {activePage === 'admin-products' && <Products />}
            {activePage === 'admin-categories' && <Categories />}
            {activePage === 'admin-orders' && <AdminOrders />}
          </AdminLayout>
        );
      default:
        return (
          <Shop
            products={products}
            loading={loading}
            error={resolvedError}
            onViewProduct={handleViewProduct}
          />
        );
    }
  };

  const isAdminPage = activePage.startsWith('admin-');

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      {!isAdminPage && (
        <AppHeader
          activePage={activePage === 'product' ? 'shop' : activePage}
          onNavigate={handleNavigate}
        />
      )}
      <main
        className={`flex-1 ${
          isAdminPage
            ? ''
            : ['home', 'about', 'blog', 'contact', 'product'].includes(activePage)
            ? ''
            : 'px-4 py-10 md:px-12 lg:px-16'
        }`}
      >
        {renderContent()}
      </main>
      {!isAdminPage && <AppFooter onNavigate={handleNavigate} />}
      {!isAdminPage && <FloatingFacebookButton />}
    </div>
  );
}

function App() {
  return (
    <LocaleProvider>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <AppInner />
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </LocaleProvider>
  );
}

export default App;

function parsePath(path) {
  const clean = path.replace(/^\//, '');
  if (!clean || clean === 'home') {
    return { page: 'home' };
  }
  if (clean.startsWith('product/')) {
    const [, productId] = clean.split('/');
    return { page: 'product', productId };
  }
  const allowed = new Set(['shop', 'about', 'blog', 'contact', 'mealPlanner', 'bmi', 'eatClean', 'cart', 'checkout', 'track', 'login', 'register', 'my-orders', 'admin-dashboard', 'admin-users', 'admin-products', 'admin-categories', 'admin-orders']);
  if (allowed.has(clean)) {
    return { page: clean };
  }
  return { page: 'home' };
}
