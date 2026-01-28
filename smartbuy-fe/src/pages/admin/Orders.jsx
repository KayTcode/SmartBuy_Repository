import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ordersAPI } from '../../services/api';
import { formatVND } from '../../utils/currency';
import { getStatusColor, getStatusText, statusOptions } from '../../utils/orderStatus';

function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getAll({}, token);
      setOrders(response.data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };


  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const note = `Trạng thái đã được cập nhật thành: ${getStatusText(newStatus)}`;
      await ordersAPI.updateStatus(orderId, newStatus, note, token);
      // Refresh orders list to get updated data
      await fetchOrders();
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Không thể cập nhật trạng thái đơn hàng: ' + (err.message || 'Lỗi không xác định'));
    }
  };

  if (loading) {
    return <div className="text-center py-16">Đang tải...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Quản lý đơn hàng</h1>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Mã đơn</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Khách hàng</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Tổng tiền</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Trạng thái</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Ngày đặt</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm font-medium text-slate-900">
                  {order.orderNumber}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-900">{order.customerInfo.name}</div>
                  <div className="text-xs text-slate-500">{order.customerInfo.email}</div>
                  {order.user && (
                    <div className="text-xs text-blue-600 mt-1">
                      👤 Tài khoản: {order.user.name || order.user.email}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                  {formatVND(order.total)}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                    className="text-sm border border-slate-300 rounded-lg px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;
