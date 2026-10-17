import React from 'react';

const QuickActionsDropdown = ({ onAction }) => {
  const actions = [
    { icon: '➕', label: 'New Order', color: 'text-blue-600', action: 'new-order' },
    { icon: '🏪', label: 'Add Retailer', color: 'text-green-600', action: 'add-retailer' },
    { icon: '📦', label: 'Add Product', color: 'text-purple-600', action: 'add-product' },
    { icon: '📊', label: 'Day Report', color: 'text-orange-600', action: 'day-report' },
    { icon: '💳', label: 'Payment Entry', color: 'text-pink-600', action: 'payment' },
  ];

  return (
    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-fade-in">

      {/* Header */}
      <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50">
        <h3 className="font-semibold text-gray-800 text-xs uppercase tracking-wider">
          ⚡ Quick Actions
        </h3>
      </div>

      {/* Actions */}
      <div className="py-1">
        {actions.map((action) => (
          <button
            key={action.action}
            onClick={() => onAction(action.action)}
            className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
          >
            <span className={`text-base ${action.color}`}>{action.icon}</span>
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsDropdown;