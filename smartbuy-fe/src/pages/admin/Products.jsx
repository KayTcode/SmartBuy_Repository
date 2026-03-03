import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { productsAPI } from '../../services/api';
import { formatVND } from '../../utils/currency';
import Pagination from '../../components/Pagination';

function Products() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await productsAPI.getAll({ page: currentPage, limit: itemsPerPage });
      console.log('Products response:', response); // Debug
      // Handle different response structures
      const productsData = response.data || response || [];
      setProducts(Array.isArray(productsData) ? productsData : []);
      
      // Calculate total pages if pagination info is available
      if (response.pagination) {
        setTotalPages(response.pagination.pages || 1);
      } else {
        // If no pagination, calculate based on total items
        const total = response.total || productsData.length;
        setTotalPages(Math.ceil(total / itemsPerPage));
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.response?.data?.message || 'Không thể tải danh sách sản phẩm');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;

    try {
      await productsAPI.delete(id, token);
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Không thể xóa sản phẩm');
    }
  };

  if (loading) {
    return <div className="text-center py-16">Đang tải...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Quản lý sản phẩm</h1>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {products.length === 0 && !loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-slate-600">Chưa có sản phẩm nào</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Hình ảnh</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Tên</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Danh mục</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Giá</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Tồn kho</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {products.map((product) => (
                <tr key={product._id || product.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="h-12 w-12 rounded-lg object-cover"
                      onError={(e) => { e.target.src = '/assets/logo.png'; }}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{product.category || '-'}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                    {product.price ? formatVND(product.price) : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{product.stock ?? '-'}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(product._id || product.id)}
                      className="text-sm text-red-600 hover:text-red-800 font-medium"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}

export default Products;
