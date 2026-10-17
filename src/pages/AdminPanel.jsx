import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
  const { users, addUser, toggleBlockUser, deleteUser, resetPassword } = useAuth();

  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({
    userId: '',
    password: '',
    name: '',
    role: 'DSR',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [resetFor, setResetFor] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  const handleAddUser = (e) => {
    e.preventDefault();

    if (!form.userId.trim() || !form.password.trim()) {
      setMessage({ type: 'error', text: 'User ID aur Password zaroori hain!' });
      return;
    }

    if (form.password.length < 4) {
      setMessage({ type: 'error', text: 'Password minimum 4 characters ka hona chahiye!' });
      return;
    }

    const result = addUser(form);

    if (result.success) {
      setMessage({
        type: 'success',
        text: `✅ User "${form.userId}" successfully banaya gaya!`,
      });
      setForm({ userId: '', password: '', name: '', role: 'DSR' });
      setShowAddForm(false);
    } else {
      setMessage({ type: 'error', text: `❌ ${result.error}` });
    }

    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const handleBlockToggle = (userId, currentStatus) => {
    const action = currentStatus === 'ACTIVE' ? 'block' : 'unblock';
    if (window.confirm(`Kya aap "${userId}" ko ${action} karna chahte hain?`)) {
      toggleBlockUser(userId);
      setMessage({
        type: 'success',
        text: `✅ User "${userId}" ${action}ed!`,
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleDelete = (userId) => {
    if (window.confirm(`⚠️ Kya aap "${userId}" ko PERMANENTLY delete karna chahte hain? Ye undo nahi hoga!`)) {
      deleteUser(userId);
      setMessage({ type: 'success', text: `🗑️ User "${userId}" delete ho gaya!` });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleResetPassword = () => {
    if (newPassword.length < 4) {
      setMessage({ type: 'error', text: 'Password minimum 4 characters!' });
      return;
    }
    resetPassword(resetFor, newPassword);
    setMessage({ type: 'success', text: `🔑 Password reset for "${resetFor}"` });
    setResetFor(null);
    setNewPassword('');
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // Filter users by search
  const filteredUsers = users.filter(
    (u) =>
      u.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === 'ACTIVE').length,
    blocked: users.filter((u) => u.status === 'BLOCKED').length,
    admins: users.filter((u) => u.role === 'Admin').length,
  };

  return (
    <div className="p-6 space-y-6">

      {/* ============ Header ============ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">👥 User Management</h2>
          <p className="text-sm text-gray-500">
            Salesman IDs banao, block karo, ya delete karo
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#1c4f9c] hover:bg-[#0e3d7a] text-white px-5 py-2.5 rounded-lg font-medium shadow-md transition-colors flex items-center gap-2 justify-center"
        >
          <span className="text-lg">➕</span>
          {showAddForm ? 'Cancel' : 'Add New User'}
        </button>
      </div>

      {/* ============ Message ============ */}
      {message.text && (
        <div
          className={`px-4 py-3 rounded-lg border text-sm font-medium ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* ============ Stats Cards ============ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: stats.total, icon: '👥', color: 'text-blue-600' },
          { label: 'Active', value: stats.active, icon: '✅', color: 'text-green-600' },
          { label: 'Blocked', value: stats.blocked, icon: '🚫', color: 'text-red-600' },
          { label: 'Admins', value: stats.admins, icon: '👑', color: 'text-purple-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ============ Add User Form ============ */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            ➕ New User Banao
          </h3>

          <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User ID *
              </label>
              <input
                type="text"
                value={form.userId}
                onChange={(e) => setForm({ ...form, userId: e.target.value })}
                placeholder="e.g. RAHUL001"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c4f9c] focus:outline-none text-sm uppercase"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password * (min 4 chars)
              </label>
              <input
                type="text"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="e.g. rahul@123"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c4f9c] focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c4f9c] focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c4f9c] focus:outline-none text-sm"
              >
                <option value="DSR">DSR</option>
                <option value="Salesman">Salesman</option>
                <option value="Distributor">Distributor</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-[#6cbd45] hover:bg-[#5ba83a] text-white py-2.5 rounded-lg font-medium transition-colors"
              >
                ✅ Create User
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============ Users List ============ */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-gray-800">
            📋 All Users ({filteredUsers.length})
          </h3>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID or name..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1c4f9c] w-full md:w-64"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">User ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Password</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400 text-sm">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.userId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-bold text-[#1c4f9c]">
                      {u.userId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {u.name || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                      {u.password}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          u.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {u.status === 'ACTIVE' ? '✅ Active' : '🚫 Blocked'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Block/Unblock */}
                        {u.userId !== 'ADMIN001' && (
                          <>
                            <button
                              onClick={() => handleBlockToggle(u.userId, u.status)}
                              className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                                u.status === 'ACTIVE'
                                  ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
                                  : 'bg-green-100 hover:bg-green-200 text-green-700'
                              }`}
                              title={u.status === 'ACTIVE' ? 'Block user' : 'Unblock user'}
                            >
                              {u.status === 'ACTIVE' ? '🚫 Block' : '✅ Unblock'}
                            </button>

                            <button
                              onClick={() => setResetFor(u.userId)}
                              className="text-xs px-2.5 py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium transition-colors"
                              title="Reset password"
                            >
                              🔑 Reset
                            </button>

                            <button
                              onClick={() => handleDelete(u.userId)}
                              className="text-xs px-2.5 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 font-medium transition-colors"
                              title="Delete user"
                            >
                              🗑️
                            </button>
                          </>
                        )}
                        {u.userId === 'ADMIN001' && (
                          <span className="text-xs text-gray-400 italic">Protected</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============ Reset Password Modal ============ */}
      {resetFor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              🔑 Reset Password
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              User: <strong className="text-[#1c4f9c]">{resetFor}</strong>
            </p>

            <input
              type="text"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password (min 4 chars)"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c4f9c] focus:outline-none text-sm mb-4"
              autoFocus
            />

            <div className="flex gap-3">
              <button
                onClick={handleResetPassword}
                className="flex-1 bg-[#1c4f9c] hover:bg-[#0e3d7a] text-white py-2.5 rounded-lg font-medium"
              >
                Reset
              </button>
              <button
                onClick={() => {
                  setResetFor(null);
                  setNewPassword('');
                }}
                className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;