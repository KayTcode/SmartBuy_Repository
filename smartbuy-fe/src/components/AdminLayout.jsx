import { useAuth } from '../contexts/AuthContext';
import { 
  IconDashboard,
  IconUsers,
  IconPackage,
  IconFolder,
  IconCart,
  IconLogout 
} from './icons';

function AdminLayout({ children, activePage, onNavigate }) {
  const { user, logout } = useAuth();

  const menuItems = [
    { key: 'admin-dashboard', label: 'Tổng quan', icon: IconDashboard },
    { key: 'admin-users', label: 'Quản lý người dùng', icon: IconUsers },
    { key: 'admin-products', label: 'Quản lý sản phẩm', icon: IconPackage },
    { key: 'admin-categories', label: 'Quản lý danh mục', icon: IconFolder },
    { key: 'admin-orders', label: 'Quản lý đơn hàng', icon: IconCart },
  ];

  const handleLogout = () => {
    logout();
    onNavigate('home');
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar - Fixed */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 shadow-sm flex flex-col z-10">
        <div className="p-6 border-b border-slate-200 flex-shrink-0">
          <h2 className="text-xl font-bold text-slate-900">Admin Panel</h2>
          <p className="text-sm text-slate-500 mt-1">{user?.name}</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.key}>
                  <button
                    onClick={() => onNavigate(item.key)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                      activePage === item.key
                        ? 'bg-primary text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-200 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition"
          >
            <IconLogout className="h-5 w-5" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content - With left margin for fixed sidebar */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;
