import React, { useState } from 'react';

const Sidebar = ({
  user,
  isOpen,
  onToggle,
  activeTab,
  onTabChange,
  onLogout,
  navItems = [],
}) => {
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleSubmenu = (id) => {
    setExpandedMenus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const userInitials = user?.userId?.slice(0, 2).toUpperCase() || 'U';

  return (
    <>
      {/* ============ MOBILE OVERLAY ============ */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in"
        />
      )}

      {/* ============ SIDEBAR ============ */}
      <aside
        className={`
          fixed md:relative top-0 left-0 h-screen z-50
          ${isOpen ? 'w-64' : 'w-0 md:w-20'}
          bg-gradient-to-b from-[#1c4f9c] to-[#0e3d7a] text-white
          transition-all duration-300 ease-in-out
          flex flex-col shadow-2xl md:shadow-none
          overflow-hidden shrink-0
        `}
      >
        {/* ============ LOGO / BRAND ============ */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 min-h-[110px] shrink-0">
          {isOpen ? (
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {/* U Logo */}
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                <span className="text-xl font-bold text-white">U</span>
              </div>

              {/* Brand Text */}
              <div className="min-w-0 flex-1">
                <h1 className="text-lg font-black tracking-wider text-white leading-none">
                  UDAAN
                </h1>
                <p className="text-[10px] font-bold tracking-[0.25em] text-green-300 leading-none mt-0.5">
                  FAST TRACK
                </p>
                <p className="text-[9px] text-blue-200 tracking-widest uppercase leading-none mt-3">
                  SALESMAN
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                <span className="text-base font-bold text-white">U</span>
              </div>
            </div>
          )}

          {/* Toggle button (Desktop only) */}
          {isOpen && (
            <button
              onClick={onToggle}
              className="hidden md:flex items-center justify-center w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 transition-colors shrink-0"
              aria-label="Collapse sidebar"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}

          {/* Close button (Mobile only) */}
          {isOpen && (
            <button
              onClick={onToggle}
              className="md:hidden flex items-center justify-center w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 transition-colors shrink-0"
              aria-label="Close sidebar"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* ============ USER CARD ============ */}
        {isOpen && (
          <div className="px-4 py-3 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
              <div className="w-10 h-10 rounded-full bg-[#6cbd45] flex items-center justify-center text-white font-bold text-sm shrink-0 ring-2 ring-white/20">
                {userInitials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {user?.name || user?.userId || 'User'}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  <p className="text-[10px] text-blue-200 truncate">
                    {user?.role || 'SALESMAN'} • Online
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============ NAVIGATION ============ */}
        <nav className="flex-1 py-3 overflow-y-auto sidebar-scroll">
          {isOpen && (
            <p className="px-5 py-2 text-[10px] font-bold text-blue-300 uppercase tracking-wider">
              Main Menu
            </p>
          )}

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isExpanded = expandedMenus[item.id];

            return (
              <div key={item.id}>
                {/* Main item */}
                <button
                  onClick={() => {
                    if (hasSubmenu && isOpen) {
                      toggleSubmenu(item.id);
                    } else {
                      onTabChange(item.id);
                    }
                  }}
                  className={`
                    w-full flex items-center gap-3 px-5 py-3 text-sm
                    transition-all duration-200 relative group
                    ${
                      isActive && !hasSubmenu
                        ? 'bg-white/10 border-l-4 border-[#6cbd45] text-white'
                        : 'hover:bg-white/5 border-l-4 border-transparent text-blue-100'
                    }
                  `}
                  title={!isOpen ? item.label : ''}
                >
                  <span className="text-lg shrink-0">{item.icon}</span>

                  {isOpen && (
                    <>
                      <span className="flex-1 text-left truncate">
                        {item.label}
                      </span>

                      {item.badge && (
                        <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                          {item.badge}
                        </span>
                      )}

                      {hasSubmenu && (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className={`transition-transform shrink-0 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      )}
                    </>
                  )}

                  {!isOpen && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
                      {item.label}
                    </div>
                  )}
                </button>

                {/* Submenu */}
                {hasSubmenu && isOpen && isExpanded && (
                  <div className="bg-black/20 border-l-4 border-transparent">
                    {item.submenu.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => onTabChange(sub.id)}
                        className={`
                          w-full flex items-center gap-3 pl-12 pr-5 py-2.5 text-xs
                          transition-colors
                          ${
                            activeTab === sub.id
                              ? 'text-[#8dc63f] font-semibold bg-white/5'
                              : 'text-blue-200 hover:text-white hover:bg-white/5'
                          }
                        `}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0"></span>
                        <span className="truncate">{sub.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* ============ FOOTER: Logout + Version ============ */}
        <div className="border-t border-white/10 p-3 shrink-0">
          {/* Logout Button */}
          <button
            onClick={onLogout}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
              text-sm font-black uppercase tracking-wide transition-all
              bg-red-500/20 hover:bg-red-500/30 text-red-100 hover:text-white
              ${!isOpen ? 'justify-center' : ''}
            `}
            title={!isOpen ? 'Logout' : ''}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            {isOpen && <span>Logout</span>}
          </button>

          {/* Version */}
          {isOpen && (
            <p className="text-center text-[10px] text-blue-300 mt-3 font-mono">
              v1.0.0
            </p>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;