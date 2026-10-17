import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { orderService } from '../services/order.service';

export default function SalesReports({ onBack }) {
  const [period, setPeriod] = useState('today');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [period]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getMyOrders({ limit: 100 });
      if (res.data.success) setOrders(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  // Filter by period
  const filtered = orders.filter((o) => {
    const orderDate = new Date(o.created_at);
    const now = new Date();
    if (period === 'today') {
      return orderDate.toDateString() === now.toDateString();
    }
    if (period === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return orderDate >= weekAgo;
    }
    if (period === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return orderDate >= monthAgo;
    }
    return true;
  });

  const totalRevenue = filtered.reduce((s, o) => s + Number(o.amount || 0), 0);
  const totalOrders = filtered.length;
  const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white p-5 shadow-lg">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-2xl font-bold">←</button>
          <div>
            <h1 className="text-xl font-black tracking-wide">📊 Sales Reports</h1>
            <p className="text-xs opacity-90 mt-0.5">My sales summary</p>
          </div>
        </div>
      </div>

      {/* Period Filter */}
      <div className="p-4">
        <div className="bg-white rounded-2xl p-2 flex gap-1 shadow-md">
          {['today', 'week', 'month', 'all'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${
                period === p
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {p === 'today' ? 'Today' : p === 'week' ? 'Week' : p === 'month' ? 'Month' : 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-4 grid grid-cols-2 gap-3">
        <SummaryCard
          icon="💰"
          label="Total Revenue"
          value={`₹${totalRevenue.toLocaleString('en-IN')}`}
          gradient="from-green-500 to-emerald-600"
        />
        <SummaryCard
          icon="📋"
          label="Total Orders"
          value={totalOrders}
          gradient="from-blue-500 to-indigo-600"
        />
        <SummaryCard
          icon="📈"
          label="Avg Order Value"
          value={`₹${avgOrder.toFixed(0)}`}
          gradient="from-purple-500 to-pink-600"
        />
        <SummaryCard
          icon="✅"
          label="Delivered"
          value={filtered.filter((o) => o.status === 'DELIVERED').length}
          gradient="from-orange-500 to-red-600"
        />
      </div>

      {/* Orders List */}
      <div className="p-4">
        <h3 className="text-sm font-black text-gray-600 uppercase mb-3">
          📋 Order Details ({filtered.length})
        </h3>
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {loading ? (
            <p className="text-center py-8 text-gray-400">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center py-8 text-gray-400">No orders in this period</p>
          ) : (
            filtered.slice(0, 20).map((o) => (
              <div key={o.id} className="px-4 py-3 border-b border-gray-100 last:border-0 flex justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">{o.product_name}</p>
                  <p className="text-xs text-gray-500 truncate">{o.retailer_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-green-700">₹{Number(o.amount).toFixed(0)}</p>
                  <p className="text-[10px] text-gray-500">{o.status}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const SummaryCard = ({ icon, label, value, gradient }) => (
  <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-4 text-white shadow-lg`}>
    <span className="text-2xl">{icon}</span>
    <p className="text-xl font-black mt-2">{value}</p>
    <p className="text-[10px] font-bold uppercase opacity-90 mt-1">{label}</p>
  </div>
);