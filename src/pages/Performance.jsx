import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { orderService } from '../services/order.service';

export default function Performance({ onBack }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Target (demo)
  const TARGET_ORDERS = 10;
  const TARGET_REVENUE = 10000;

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await orderService.getStats();
      if (res.data.success) setStats(res.data.data);
    } catch (err) {
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const ordersPercent = stats
    ? Math.min(100, Math.round((stats.total / TARGET_ORDERS) * 100))
    : 0;
  const revenuePercent = stats
    ? Math.min(100, Math.round((stats.totalRevenue / TARGET_REVENUE) * 100))
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-gradient-to-r from-green-700 to-emerald-600 text-white p-5 shadow-lg">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-2xl font-bold">←</button>
          <div>
            <h1 className="text-xl font-black tracking-wide">🎯 My Performance</h1>
            <p className="text-xs opacity-90 mt-0.5">Target vs Achievement</p>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-center py-20 text-gray-400">Loading...</p>
      ) : (
        <div className="p-4 space-y-4">
          {/* Orders Progress */}
          <div className="bg-white rounded-2xl shadow-md p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-black text-gray-700 uppercase">📋 Orders Target</h3>
              <span className="text-xs font-black text-green-600">{ordersPercent}%</span>
            </div>
            <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all"
                style={{ width: `${ordersPercent}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-xs">
              <span className="font-bold text-gray-800">
                {stats?.total || 0} / {TARGET_ORDERS} orders
              </span>
              <span className="text-gray-500">
                {TARGET_ORDERS - (stats?.total || 0)} more to go
              </span>
            </div>
          </div>

          {/* Revenue Progress */}
          <div className="bg-white rounded-2xl shadow-md p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-black text-gray-700 uppercase">💰 Revenue Target</h3>
              <span className="text-xs font-black text-green-600">{revenuePercent}%</span>
            </div>
            <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full transition-all"
                style={{ width: `${revenuePercent}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-xs">
              <span className="font-bold text-gray-800">
                ₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')} / ₹{TARGET_REVENUE.toLocaleString('en-IN')}
              </span>
              <span className="text-gray-500">
                {revenuePercent >= 100 ? '✅ Achieved!' : 'In progress'}
              </span>
            </div>
          </div>

          {/* Badges */}
          <div className="bg-white rounded-2xl shadow-md p-5">
            <h3 className="text-sm font-black text-gray-700 uppercase mb-4">🏆 My Achievements</h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <Badge icon="🌟" label="Rising Star" earned={ordersPercent >= 30} />
              <Badge icon="🔥" label="On Fire" earned={ordersPercent >= 60} />
              <Badge icon="👑" label="Champion" earned={ordersPercent >= 100} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const Badge = ({ icon, label, earned }) => (
  <div className={`p-3 rounded-2xl ${earned ? 'bg-yellow-100' : 'bg-gray-100 opacity-50'}`}>
    <p className="text-3xl">{icon}</p>
    <p className="text-[10px] font-black uppercase mt-1 text-gray-700">{label}</p>
  </div>
);