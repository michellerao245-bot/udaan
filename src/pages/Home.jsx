import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/order.service';
import { retailerService } from '../services/retailer.service';

export default function Home({ onNavigate }) {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    todayOrders: 0,
    delivered: 0,
    pending: 0,
    revenue: 0,
    retailers: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [orderStats, retStats, orders] = await Promise.all([
        orderService.getStats(),
        retailerService.getStats(),
        orderService.getMyOrders({ limit: 5 }),
      ]);

      setStats({
        todayOrders: orderStats.data.data?.total || 0,
        delivered: orderStats.data.data?.delivered || 0,
        pending: orderStats.data.data?.pending || 0,
        revenue: orderStats.data.data?.totalRevenue || 0,
        retailers: retStats.data.data?.total || 0,
      });

      setRecentOrders(orders.data.data || []);
    } catch (err) {
      console.error('Home fetch error:', err);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // ==================== NAVIGATION HANDLER ====================
  const handleNavigation = (tab) => {
    if (onNavigate) {
      onNavigate(tab);
    } else {
      toast.success(`${tab} page`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* ===== HEADER ===== */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 text-white p-5 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl font-black">
            {currentUser?.name?.charAt(0)?.toUpperCase() || 'R'}
          </div>
          <div>
            <p className="text-sm opacity-90">Welcome back,</p>
            <h1 className="text-xl font-black tracking-wide">
              {currentUser?.name || 'Salesman'}
            </h1>
            <p className="text-xs opacity-80 mt-0.5">
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* ===== STATS ===== */}
      <div className="p-4">
        <h2 className="text-sm font-black text-gray-600 uppercase tracking-wider mb-3">
          📊 Today's Stats
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon="📋"
            label="Total Orders"
            value={stats.todayOrders}
            gradient="from-blue-500 to-indigo-600"
          />
          <StatCard
            icon="✅"
            label="Delivered"
            value={stats.delivered}
            gradient="from-green-500 to-emerald-600"
          />
          <StatCard
            icon="⏳"
            label="Pending"
            value={stats.pending}
            gradient="from-orange-500 to-red-600"
          />
          <StatCard
            icon="💰"
            label="Revenue"
            value={`₹${stats.revenue.toLocaleString('en-IN')}`}
            gradient="from-purple-500 to-pink-600"
          />
        </div>
      </div>

      {/* ===== QUICK ACTIONS ===== */}
      <div className="px-4">
        <h2 className="text-sm font-black text-gray-600 uppercase tracking-wider mb-3">
          ⚡ Quick Actions
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {/* NEW ORDER */}
          <button
            onClick={() => handleNavigation('outlets')}
            className="bg-white rounded-2xl p-5 shadow-md border-2 border-gray-100 hover:border-green-500 active:scale-95 transition-all text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-3 shadow-md">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <p className="text-sm font-black text-gray-800 uppercase">
              New Order
            </p>
            <p className="text-[10px] text-gray-500 mt-0.5">
              Take order from outlet
            </p>
          </button>

          {/* MY RETAILERS */}
          <button
            onClick={() => handleNavigation('outlets')}
            className="bg-white rounded-2xl p-5 shadow-md border-2 border-gray-100 hover:border-green-500 active:scale-95 transition-all text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-3 shadow-md">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <p className="text-sm font-black text-gray-800 uppercase">
              My Retailers
            </p>
            <p className="text-[10px] text-gray-500 mt-0.5">
              View all outlets
            </p>
          </button>
        </div>
      </div>

      {/* ===== RECENT ORDERS ===== */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-black text-gray-600 uppercase tracking-wider">
            🕐 Recent Orders
          </h2>
          <button
            onClick={() => handleNavigation('others')}
            className="text-xs font-bold text-green-600 hover:text-green-700"
          >
            View All →
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {recentOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-5xl mb-3">📋</p>
              <p className="text-sm font-medium">No orders yet</p>
              <p className="text-xs mt-1">Take your first order</p>
            </div>
          ) : (
            recentOrders.map((o) => (
              <div
                key={o.id}
                className="px-4 py-3 border-b border-gray-100 last:border-0 flex items-center justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      o.status === 'PENDING'
                        ? 'bg-yellow-100'
                        : o.status === 'CONFIRMED'
                        ? 'bg-blue-100'
                        : 'bg-green-100'
                    }`}
                  >
                    <span className="text-lg">📦</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">
                      {o.product_name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {o.retailer_name}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className="text-sm font-black text-green-700">
                    ₹{Number(o.amount).toFixed(0)}
                  </p>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      o.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-700'
                        : o.status === 'CONFIRMED'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {o.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ===== BOTTOM QUICK SUMMARY ===== */}
      <div className="p-4">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-5 text-white shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase opacity-90">
              My Outlets
            </p>
            <p className="text-3xl font-black mt-1">{stats.retailers}</p>
          </div>
          <button
            onClick={() => handleNavigation('outlets')}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl font-bold text-xs uppercase transition-colors"
          >
            View All →
          </button>
        </div>
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
      <p className="text-2xl font-black leading-tight">{value}</p>
      <p className="text-[10px] font-bold uppercase opacity-90 mt-1">
        {label}
      </p>
    </div>
  </div>
);