import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/order.service';
import { retailerService } from '../services/retailer.service';
import { productService } from '../services/product.service';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [orderStats, orders, retStats, products] = await Promise.all([
        orderService.getStats(),
        orderService.getMyOrders({ limit: 5 }),
        retailerService.getStats(),
        productService.getAll(),
      ]);

      setStats({
        orders: orderStats.data.data?.total || 0,
        pending: orderStats.data.data?.pending || 0,
        delivered: orderStats.data.data?.delivered || 0,
        revenue: orderStats.data.data?.totalRevenue || 0,
        retailers: retStats.data.data?.total || 0,
        products: products.data.data?.length || 0,
      });

      setRecentOrders(orders.data.data || []);
    } catch (err) {
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">

      {/* ==================== WELCOME BANNER ==================== */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-5 text-white shadow-lg">
        <h2 className="text-xl font-bold">👋 Welcome Back!</h2>
        <p className="text-sm opacity-90 mt-1">
          {currentUser?.name} • {new Date().toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'short',
          })}
        </p>
      </div>

      {/* ==================== STATS ==================== */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon="📋"
          label="Total Orders"
          value={stats?.orders || 0}
          gradient="from-blue-500 to-indigo-600"
        />
        <StatCard
          icon="⏳"
          label="Pending"
          value={stats?.pending || 0}
          gradient="from-orange-500 to-red-600"
        />
        <StatCard
          icon="🏪"
          label="My Retailers"
          value={stats?.retailers || 0}
          gradient="from-purple-500 to-pink-600"
        />
        <StatCard
          icon="💰"
          label="Revenue"
          value={`₹${(stats?.revenue || 0).toLocaleString('en-IN')}`}
          gradient="from-green-500 to-emerald-600"
        />
      </div>

      {/* ==================== RECENT ORDERS ==================== */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h3 className="font-bold text-gray-800 mb-4">📋 Recent Orders</h3>

        {recentOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-4xl mb-2">📋</p>
            <p className="text-sm">No orders yet</p>
            <p className="text-xs mt-1">Place your first order!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentOrders.map((o) => (
              <div
                key={o.id}
                className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {o.product_name}
                  </p>
                  <p className="text-xs text-gray-500">{o.retailer_name}</p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className="text-sm font-bold text-green-600">
                    ₹{Number(o.amount).toFixed(0)}
                  </p>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      o.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-700'
                        : o.status === 'CONFIRMED'
                        ? 'bg-blue-100 text-blue-700'
                        : o.status === 'DELIVERED'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {o.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

// ==================== STAT CARD ====================
const StatCard = ({ icon, label, value, gradient }) => (
  <div
    className={`bg-gradient-to-br ${gradient} rounded-2xl p-4 text-white shadow-lg relative overflow-hidden`}
  >
    <div className="absolute top-0 right-0 text-5xl opacity-20 -mr-2 -mt-2">
      {icon}
    </div>
    <div className="relative">
      <p className="text-2xl font-black">{value}</p>
      <p className="text-[10px] font-bold uppercase opacity-90 mt-1">
        {label}
      </p>
    </div>
  </div>
);