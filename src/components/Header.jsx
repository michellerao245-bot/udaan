import React, { useState, useRef, useEffect } from 'react';
import NotificationsDropdown from './NotificationsDropdown';
import ProfileDropdown from './ProfileDropdown';
import QuickActionsDropdown from './QuickActionsDropdown';
import SearchBar from './SearchBar';

const Header = ({
  user,
  title,
  subtitle,
  onMenuToggle,
  onLogout,
  onSearch,
  onNavigate,
  onQuickAction,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Notification data (Part 2 me detailed aayega)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'order',
      title: 'New order received',
      message: 'Sharma Kirana Store - ₹45,200',
      time: '2 min ago',
      unread: true,
    },
    {
      id: 2,
      type: 'delivery',
      title: 'Order delivered',
      message: 'UDN-2024-001 delivered successfully',
      time: '15 min ago',
      unread: true,
    },
    {
      id: 3,
      type: 'alert',
      title: 'Low stock alert',
      message: 'Tata Salt 1kg - only 12 units left',
      time: '1 hour ago',
      unread: true,
    },
    {
      id: 4,
      type: 'payment',
      title: 'Payment received',
      message: '₹32,850 from Patel General Store',
      time: '3 hours ago',
      unread: false,
    },
  ]);

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const quickRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
      if (quickRef.current && !quickRef.current.contains(e.target)) {
        setShowQuickActions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setShowNotifications(false);
        setShowProfile(false);
        setShowQuickActions(false);
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  // Toggle helpers
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowProfile(false);
    setShowQuickActions(false);
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
    setShowNotifications(false);
    setShowQuickActions(false);
  };

  const toggleQuickActions = () => {
    setShowQuickActions(!showQuickActions);
    setShowNotifications(false);
    setShowProfile(false);
  };

  // Notification actions (Part 2 me full functionality)
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const markOneAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const removeNotification = (e, id) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Date / Time
  const today = currentTime.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const timeString = currentTime.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const userInitials = user?.userId?.slice(0, 2).toUpperCase() || 'U';

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">

      {/* ==================== TOP ROW ==================== */}
      <div className="px-4 md:px-6 py-3 flex items-center justify-between gap-3">

        {/* ---------- LEFT: Hamburger + Title ---------- */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
            aria-label="Toggle menu"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1c4f9c"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div className="min-w-0">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 truncate capitalize">
              {title}
            </h2>
            <p className="text-xs text-gray-500 truncate hidden sm:block">
              {subtitle || `Welcome back, ${user?.userId || 'User'}! 👋`}
            </p>
          </div>
        </div>

        {/* ---------- RIGHT: Search + Date + Quick + Bell + Profile ---------- */}
        <div className="flex items-center gap-2 md:gap-3">

          {/* Search Bar (Desktop) */}
          <SearchBar
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
              onSearch?.(val);
            }}
            onSubmit={(val) => onSearch?.(val)}
          />

          {/* Date + Time Badge (Desktop) */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-xs text-gray-600 border border-gray-200">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className="font-medium whitespace-nowrap">
              {today} · {timeString}
            </span>
          </div>

          {/* Online Status (Desktop) */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 bg-green-50 rounded-full border border-green-200">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs text-green-700 font-medium">Online</span>
          </div>

          {/* Quick Actions (Desktop) */}
          <div className="relative hidden md:block" ref={quickRef}>
            <button
              onClick={toggleQuickActions}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Quick actions"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1c4f9c"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>

            {showQuickActions && (
              <QuickActionsDropdown
                onAction={(action) => {
                  onQuickAction?.(action);
                  setShowQuickActions(false);
                }}
              />
            )}
          </div>

          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={toggleNotifications}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Notifications"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1c4f9c"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <NotificationsDropdown
                notifications={notifications}
                unreadCount={unreadCount}
                onMarkAllRead={markAllAsRead}
                onClearAll={clearAllNotifications}
                onMarkOneRead={markOneAsRead}
                onRemove={removeNotification}
                onViewAll={() => {
                  onNavigate?.('notifications');
                  setShowNotifications(false);
                }}
              />
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={toggleProfile}
              className="flex items-center gap-2 p-1 pr-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1c4f9c] to-[#0e3d7a] flex items-center justify-center text-white font-bold text-sm shrink-0 ring-2 ring-white shadow">
                {userInitials}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-gray-800 leading-tight">
                  {user?.userId || 'User'}
                </p>
                <p className="text-[10px] text-gray-500 leading-tight">
                  {user?.role || 'DSR'}
                </p>
              </div>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6b6375"
                strokeWidth="2"
                className={`hidden md:block transition-transform ${
                  showProfile ? 'rotate-180' : ''
                }`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {showProfile && (
              <ProfileDropdown
                user={user}
                userInitials={userInitials}
                onNavigate={(tab) => {
                  onNavigate?.(tab);
                  setShowProfile(false);
                }}
                onLogout={onLogout}
              />
            )}
          </div>
        </div>
      </div>

      {/* ==================== MOBILE SEARCH ==================== */}
      <div className="lg:hidden px-4 pb-3">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              onSearch?.(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                onSearch?.(searchQuery);
              }
            }}
            placeholder="Search orders, retailers..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1c4f9c] focus:border-transparent bg-gray-50"
          />
          <svg
            className="absolute left-3 top-2.5 text-gray-400"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>
      </div>
    </header>
  );
};

export default Header;