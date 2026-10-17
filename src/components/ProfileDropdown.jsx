import React from 'react';

const ProfileDropdown = ({ user, userInitials, onNavigate, onLogout }) => {
  const menuItems = [
    { icon: '👤', label: 'My Profile', tab: 'profile' },
    { icon: '⚙️', label: 'Settings', tab: 'settings' },
    { icon: '📊', label: 'My Performance', tab: 'performance' },
    { icon: '🏆', label: 'Achievements', tab: 'achievements' },
    { icon: '📄', label: 'My Reports', tab: 'reports' },
    { icon: '❓', label: 'Help & Support', tab: 'help' },
  ];

  return (
    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-fade-in">

      {/* User Info Header */}
      <div className="px-4 py-4 border-b border-gray-100 bg-gradient-to-br from-[#1c4f9c] to-[#0e3d7a] text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center font-bold text-lg ring-2 ring-white/30">
            {userInitials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">
              {user?.userId || 'User'}
            </p>
            <p className="text-xs text-white/80 truncate">
              {user?.role || 'DSR'} Account
            </p>
            <div className="flex items-center gap-1 mt-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
              <span className="text-[10px] text-white/70">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-1">
        {menuItems.map((item) => (
          <button
            key={item.tab}
            onClick={() => onNavigate(item.tab)}
            className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Logout */}
      <div className="border-t border-gray-100 py-1">
        <button
          onClick={onLogout}
          className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-red-600 hover:bg-red-50 transition-colors text-left font-medium"
        >
          <span className="text-base">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;