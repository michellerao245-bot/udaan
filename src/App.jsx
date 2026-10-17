import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import OrderEntry from './pages/OrderEntry';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import './App.css';

// ==================== NAV ITEMS ====================
const salesmanNavItems = [
  { id: 'entry', label: 'New Order', icon: '➕' },
  { id: 'dashboard', label: 'My Dashboard', icon: '📊' },
  { id: 'orders', label: 'My Orders', icon: '📋' },
  { id: 'retailers', label: 'My Retailers', icon: '🏪' },
  { id: 'profile', label: 'Profile', icon: '👤' },
];

// ==================== APP SHELL ====================
function AppShell() {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('entry');
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);

  const activeItem = salesmanNavItems.find((n) => n.id === activeTab);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        user={currentUser}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLogout={logout}
        navItems={salesmanNavItems}
      />

      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header
          user={currentUser}
          title={activeItem?.label || 'Dashboard'}
          subtitle={`Salesman • ${currentUser?.name || currentUser?.userId}`}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          onLogout={logout}
          onNavigate={handleTabChange}
        />

        <div className="flex-1 overflow-y-auto">
          {activeTab === 'entry' && <OrderEntry />}
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'orders' && <Dashboard />}
          {activeTab === 'retailers' && (
            <div className="p-6 text-gray-500 text-center py-20">
              🏪 My Retailers page coming soon...
            </div>
          )}
          {activeTab === 'profile' && (
            <div className="p-6 text-gray-500 text-center py-20">
              👤 Profile page coming soon...
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ==================== APP CONTENT ====================
function AppContent() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mb-4"></div>
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) return <Login />;
  return <AppShell />;
}

// ==================== ROOT APP ====================
export default function App() {
  return (
    <AuthProvider>
      <AppContent />

      {/* ⭐ TOASTER — Toast messages dikhane ke liye */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '14px',
            padding: '12px 16px',
            borderRadius: '12px',
          },
          success: {
            style: {
              background: '#16a34a',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#16a34a',
            },
          },
          error: {
            style: {
              background: '#dc2626',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#dc2626',
            },
          },
        }}
      />
    </AuthProvider>
  );
}