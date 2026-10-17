import React from 'react';

const NotificationsDropdown = ({
  notifications,
  unreadCount,
  onMarkAllRead,
  onClearAll,
  onMarkOneRead,
  onRemove,
  onViewAll,
}) => {
  const getIcon = (type) => {
    switch (type) {
      case 'order': return '📦';
      case 'delivery': return '🚚';
      case 'alert': return '⚠️';
      case 'payment': return '💰';
      default: return '🔔';
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'order': return 'bg-blue-100 text-blue-600';
      case 'delivery': return 'bg-green-100 text-green-600';
      case 'alert': return 'bg-yellow-100 text-yellow-600';
      case 'payment': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 max-w-md bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-fade-in">

      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-800 text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="text-xs text-[#1c4f9c] font-medium hover:underline"
            >
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs text-red-500 font-medium hover:underline"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <div className="text-5xl mb-3">🔔</div>
            <p className="text-sm text-gray-500 font-medium">No notifications</p>
            <p className="text-xs text-gray-400 mt-1">You're all caught up!</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => onMarkOneRead(notif.id)}
              className={`group px-4 py-3 flex gap-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors ${
                notif.unread ? 'bg-blue-50/30' : ''
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-base ${getColor(
                  notif.type
                )}`}
              >
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-gray-800">
                    {notif.title}
                  </p>
                  <div className="flex items-center gap-1 shrink-0">
                    {notif.unread && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></span>
                    )}
                    <button
                      onClick={(e) => onRemove(e, notif.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 text-xs transition-opacity"
                      aria-label="Remove"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-600 truncate">{notif.message}</p>
                <p className="text-[10px] text-gray-400 mt-1">{notif.time}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50 text-center">
          <button
            onClick={onViewAll}
            className="text-xs font-medium text-[#1c4f9c] hover:underline"
          >
            View all notifications →
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;