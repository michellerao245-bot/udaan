import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ userId: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.userId.trim()) {
      toast.error('User ID zaroori hai');
      return;
    }
    if (!form.password) {
      toast.error('Password zaroori hai');
      return;
    }

    setLoading(true);

    try {
      const result = await login(form.userId.trim(), form.password);
      if (result.success) {
        toast.success(`Welcome, ${result.user.name}!`);
      }
    } catch (err) {
      // Error handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSubmit(e);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* ===== Top White Section with UDAAN Brand ===== */}
      <div className="bg-white pt-10 pb-6 flex flex-col items-center relative z-10 w-full px-4">
        <h1 className="text-5xl font-bold text-green-600 tracking-wider">
          UDAAN
        </h1>
        <p className="text-2xl font-black text-green-600 tracking-[0.3em] -mt-1 w-full text-center">
          FAST TRACK
        </p>
        <p className="text-xs text-gray-500 mt-3 tracking-widest uppercase">
          Salesman App
        </p>
      </div>

      {/* ===== Green Curved Section ===== */}
      <div className="relative flex-1">
        <svg
          viewBox="0 0 1440 120"
          className="w-full h-16 -mb-1 block"
          preserveAspectRatio="none"
        >
          <path
            fill="#16a34a"
            d="M0,40 C300,120 600,0 900,60 C1100,100 1300,40 1440,60 L1440,120 L0,120 Z"
          />
        </svg>

        <div className="bg-green-600 px-6 pt-2 pb-8 flex-1 min-h-[calc(100vh-320px)] flex flex-col">
          {/* Welcome text */}
          <div className="text-center mt-2 mb-8">
            <h2 className="text-4xl font-bold text-white mb-2">Welcome</h2>
            <p className="text-white text-base">Sign in to take orders</p>
          </div>

          {/* User ID Input */}
          <div className="bg-white rounded-full px-5 py-4 mb-4 flex items-center gap-3 shadow-md">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#16a34a"
              strokeWidth="2"
              className="shrink-0"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <input
              type="text"
              value={form.userId}
              onChange={(e) =>
                setForm({ ...form, userId: e.target.value.toUpperCase() })
              }
              onKeyDown={handleKeyPress}
              placeholder="Enter User ID"
              className="flex-1 outline-none text-gray-700 placeholder-gray-400 bg-transparent text-sm min-w-0"
              autoFocus
              disabled={loading}
            />
          </div>

          {/* Password Input with Eye */}
          <div className="bg-white rounded-full px-5 py-4 mb-4 flex items-center gap-3 shadow-md">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#16a34a"
              strokeWidth="2"
              className="shrink-0"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              onKeyDown={handleKeyPress}
              placeholder="Enter Password"
              className="flex-1 outline-none text-gray-700 placeholder-gray-400 bg-transparent text-sm min-w-0"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 text-gray-400 hover:text-green-600 transition-colors shrink-0"
              tabIndex={-1}
            >
              {showPassword ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          {/* Login Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-white hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed text-green-600 text-lg font-bold py-4 rounded-full shadow-lg transition-all active:scale-95"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></span>
                Logging in...
              </span>
            ) : (
              '🔐 Login'
            )}
          </button>

          {/* Demo Credentials */}
          <div className="mt-6 bg-white/10 border border-white/20 rounded-lg p-3">
            <p className="text-[10px] text-white/70 text-center uppercase tracking-wider mb-1">
              Demo Credentials
            </p>
            <p className="text-xs text-white/90 text-center font-mono">
              User ID: <strong>RAHUL001</strong> / Password:{' '}
              <strong>rahul123</strong>
            </p>
          </div>
        </div>
      </div>

      {/* ===== Bottom Green Footer ===== */}
      <div className="bg-green-800 text-white px-4 py-3 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
          >
            <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
          </svg>
          <span>Help</span>
        </div>

        <span className="text-white/90 font-mono text-xs">v1.0.0</span>

        <div className="flex items-center gap-2">
          <div className="border border-white rounded p-0.5 w-5 h-5 flex items-center justify-center">
            <span className="text-xs font-bold">?</span>
          </div>
          <span>Support</span>
        </div>
      </div>
    </div>
  );
}