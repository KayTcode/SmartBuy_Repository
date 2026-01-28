import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../services/apiClient';
import { IconFolder } from '../../components/icons';

function Categories() {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiClient.get('/categories');
      // Handle different response structures
      const categoriesData = response.data?.data || response.data || [];
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.response?.data?.message || 'Không thể tải danh sách danh mục');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-16">Đang tải...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Quản lý danh mục</h1>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {categories.length === 0 && !loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-slate-600">Chưa có danh mục nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category._id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-4 mb-4">
                {category.icon ? (
                  <div className="text-4xl">{category.icon}</div>
                ) : (
                  <div className="text-primary">
                    <IconFolder className="h-10 w-10" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {category.name?.vi || category.name || 'Chưa có tên'}
                  </h3>
                  <p className="text-sm text-slate-500">{category.key || '-'}</p>
                </div>
              </div>
              <p className="text-sm text-slate-600">
                {category.description?.vi || category.description || 'Chưa có mô tả'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Categories;
