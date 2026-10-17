import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { currentUser, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [locationTracking, setLocationTracking] = useState(true);

  const handleLogout = () => {
    if (window.confirm('Logout karna chahte ho?')) {
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* ===== HEADER ===== */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 text-white p-5 shadow-lg">
        <h1 className="text-2xl font-black tracking-wide">⚙️ Settings</h1>
        <p className="text-sm opacity-90 mt-1">
          Profile, preferences and more
        </p>
      </div>

      {/* ===== PROFILE ===== */}
      <div className="p-4">
        <h2 className="text-xs font-black text-gray-600 uppercase tracking-wider mb-3">
          👤 My Profile
        </h2>

        <div className="bg-white rounded-2xl shadow-md p-5 border-2 border-gray-100">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-black shadow-lg">
              {currentUser?.name?.charAt(0)?.toUpperCase() || 'R'}
            </div>
            <div className="min-w-0">
              <p className="text-lg font-black text-gray-800 truncate">
                {currentUser?.name || 'Salesman'}
              </p>
              <p className="text-xs text-gray-500 font-medium">
                ID: {currentUser?.userId}
              </p>
              <span className="inline-block mt-1 text-[10px] font-black uppercase bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                {currentUser?.role || 'SALESMAN'}
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t-2 border-gray-100">
            <ProfileRow label="User ID" value={currentUser?.userId} />
            <ProfileRow label="Phone" value={currentUser?.phone ? `+91 ${currentUser.phone}` : '—'} />
            <ProfileRow label="Company" value={currentUser?.companyName || 'Marico Test Co'} />
          </div>
        </div>
      </div>

      {/* ===== PREFERENCES ===== */}
      <div className="px-4">
        <h2 className="text-xs font-black text-gray-600 uppercase tracking-wider mb-3">
          ⚙️ Preferences
        </h2>

        <div className="bg-white rounded-2xl shadow-md border-2 border-gray-100 overflow-hidden">
          <ToggleRow
            icon="🔔"
            label="Notifications"
            sub="Order updates, alerts"
            value={notifications}
            onChange={() => {
              setNotifications(!notifications);
              toast.success(
                !notifications ? 'Notifications ON' : 'Notifications OFF'
              );
            }}
          />
          <ToggleRow
            icon="🌙"
            label="Dark Mode"
            sub="Coming soon"
            value={darkMode}
            onChange={() => toast.success('Dark mode coming soon')}
          />
          <ToggleRow
            icon="📍"
            label="Location Tracking"
            sub="Auto capture while working"
            value={locationTracking}
            onChange={() => {
              setLocationTracking(!locationTracking);
              toast.success(
                !locationTracking ? 'Tracking ON' : 'Tracking OFF'
              );
            }}
          />
        </div>
      </div>

      {/* ===== APP INFO ===== */}
      <div className="p-4">
        <h2 className="text-xs font-black text-gray-600 uppercase tracking-wider mb-3">
          📱 App Info
        </h2>

        <div className="bg-white rounded-2xl shadow-md border-2 border-gray-100 overflow-hidden">
          <InfoRow icon="🌐" label="Language" value="English" />
          <InfoRow icon="📦" label="Version" value="1.0.0" />
          <InfoRow
            icon="ℹ️"
            label="About Us"
            value="→"
            onClick={() => toast.success('Udaan Fast Track v1.0.0')}
          />
        </div>
      </div>

      {/* ===== LOGOUT ===== */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-black uppercase tracking-wider py-4 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </div>

      {/* Footer */}
      <p className="text-center text-[10px] text-gray-400 pb-4">
        Udaan Fast Track © 2026
      </p>

    </div>
  );
}

// ==================== PROFILE ROW ====================
const ProfileRow = ({ label, value }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-gray-500 font-medium">{label}</span>
    <span className="text-gray-800 font-bold">{value}</span>
  </div>
);

// ==================== TOGGLE ROW ====================
const ToggleRow = ({ icon, label, sub, value, onChange }) => (
  <div className="flex items-center justify-between px-5 py-4 border-b-2 border-gray-100 last:border-0">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl">
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-gray-800">{label}</p>
        <p className="text-[10px] text-gray-500">{sub}</p>
      </div>
    </div>
    <button
      onClick={onChange}
      className={`relative w-12 h-7 rounded-full transition-colors ${
        value ? 'bg-green-600' : 'bg-gray-300'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
          value ? 'translate-x-5' : ''
        }`}
      ></span>
    </button>
  </div>
);

// ==================== INFO ROW ====================
const InfoRow = ({ icon, label, value, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between px-5 py-4 border-b-2 border-gray-100 last:border-0 hover:bg-gray-50 transition-colors text-left"
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl">
        {icon}
      </div>
      <p className="text-sm font-bold text-gray-800">{label}</p>
    </div>
    <span className="text-xs font-bold text-gray-500">{value}</span>
  </button>
);