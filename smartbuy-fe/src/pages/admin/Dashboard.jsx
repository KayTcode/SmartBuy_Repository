import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ordersAPI, productsAPI } from '../../services/api';
import apiClient from '../../services/apiClient';
import { formatVND } from '../../utils/currency';
import { IconCart, IconDollar, IconPackage, IconUsers, IconFolder, IconClock } from '../../components/icons';

function Dashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalCategories: 0,
    pendingOrders: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [orderStats, products, usersRes, categoriesRes] = await Promise.all([
        ordersAPI.getStats(token),
        productsAPI.getAll(),
        apiClient.get('/users', { headers: { Authorization: `Bearer ${token}` } }),
        apiClient.get('/categories')
      ]);

      const users = usersRes.data?.data || [];
      const categories = categoriesRes.data?.data || [];

      // Calculate pending orders from byStatus array
      const pendingStatus = orderStats.data?.byStatus?.find(s => s._id === 'pending');
      
      setStats({
        totalOrders: orderStats.data?.total || 0,
        totalRevenue: orderStats.data?.totalRevenue || 0,
        totalProducts: products.length || 0,
        totalUsers: users.length || 0,
        totalCategories: categories.length || 0,
        pendingOrders: pendingStatus?.count || 0
      });

      // Get recent users (last 5)
      setRecentUsers(users.slice(0, 5));
      
      // Get recent products (last 5)
      setRecentProducts(products.slice(0, 5));
      
      // Set categories
      setCategories(categories);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Tổng đơn hàng', value: stats.totalOrders, icon: IconCart, color: 'bg-blue-500' },
    { label: 'Doanh thu', value: formatVND(stats.totalRevenue), icon: IconDollar, color: 'bg-green-500' },
    { label: 'Sản phẩm', value: stats.totalProducts, icon: IconPackage, color: 'bg-purple-500' },
    { label: 'Người dùng', value: stats.totalUsers, icon: IconUsers, color: 'bg-indigo-500' },
    { label: 'Danh mục', value: stats.totalCategories, icon: IconFolder, color: 'bg-pink-500' },
    { label: 'Chờ xử lý', value: stats.pendingOrders, icon: IconClock, color: 'bg-orange-500' }
  ];

  if (loading) {
    return <div className="text-center py-16">Đang tải...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Tổng quan</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div key={index} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.color} text-white p-3 rounded-xl`}>
                  <IconComponent className="h-6 w-6" />
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-1">{card.label}</p>
              <p className="text-2xl font-bold text-slate-900">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Users */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Người dùng gần đây</h2>
          {recentUsers.length === 0 ? (
            <p className="text-slate-500 text-sm">Chưa có người dùng</p>
          ) : (
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div key={user._id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                  <div>
                    <p className="font-medium text-slate-900">{user.name}</p>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role === 'admin' ? 'Admin' : 'User'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Products */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Sản phẩm gần đây</h2>
          {recentProducts.length === 0 ? (
            <p className="text-slate-500 text-sm">Chưa có sản phẩm</p>
          ) : (
            <div className="space-y-3">
              {recentProducts.map((product) => (
                <div key={product.id || product._id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{product.name}</p>
                    <p className="text-sm text-slate-500">{formatVND(product.price)}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    product.status === 'out-of-stock' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {product.status === 'out-of-stock' ? 'Hết hàng' : 'Còn hàng'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Danh mục sản phẩm</h2>
        {categories.length === 0 ? (
          <p className="text-slate-500 text-sm">Chưa có danh mục</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <div key={category._id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                <div className="text-2xl">{category.icon}</div>
                <div>
                  <p className="font-medium text-slate-900 text-sm">{category.name?.vi || category.name}</p>
                  <p className="text-xs text-slate-500">{category.key}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
