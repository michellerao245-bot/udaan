import React, { useState } from 'react';

// ==================== SUB PAGES ====================
import SalesReports from './SalesReports';
import Performance from './Performance';
import MyLocation from './MyLocation';
import Schemes from './Schemes';
import Documents from './Documents';
import Support from './Support';

export default function Others() {
  const [activePage, setActivePage] = useState(null);

  // ==================== SUB PAGE ROUTING ====================
  if (activePage === 'reports') {
    return <SalesReports onBack={() => setActivePage(null)} />;
  }
  if (activePage === 'performance') {
    return <Performance onBack={() => setActivePage(null)} />;
  }
  if (activePage === 'location') {
    return <MyLocation onBack={() => setActivePage(null)} />;
  }
  if (activePage === 'schemes') {
    return <Schemes onBack={() => setActivePage(null)} />;
  }
  if (activePage === 'documents') {
    return <Documents onBack={() => setActivePage(null)} />;
  }
  if (activePage === 'support') {
    return <Support onBack={() => setActivePage(null)} />;
  }

  // ==================== MENU ====================
  const tools = [
    {
      id: 'reports',
      icon: '📊',
      label: 'My Sales Reports',
      sub: 'Daily, Weekly, Monthly',
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      id: 'performance',
      icon: '🎯',
      label: 'My Performance',
      sub: 'Target vs Achievement',
      gradient: 'from-green-500 to-emerald-600',
    },
    {
      id: 'location',
      icon: '📍',
      label: 'My Location',
      sub: 'GPS tracking & history',
      gradient: 'from-purple-500 to-pink-600',
    },
    {
      id: 'schemes',
      icon: '🎁',
      label: 'Schemes & Rewards',
      sub: 'Active offers & points',
      gradient: 'from-orange-500 to-red-600',
    },
    {
      id: 'documents',
      icon: '📄',
      label: 'My Documents',
      sub: 'ID, agreements',
      gradient: 'from-cyan-500 to-teal-600',
    },
    {
      id: 'support',
      icon: '📞',
      label: 'Contact Support',
      sub: 'Call or Email us',
      gradient: 'from-yellow-500 to-amber-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 text-white p-5 shadow-lg">
        <h1 className="text-2xl font-black tracking-wide">📦 Others</h1>
        <p className="text-sm opacity-90 mt-1">Reports, tools and more</p>
      </div>

      {/* Tools Grid */}
      <div className="p-4 space-y-3">
        <h2 className="text-xs font-black text-gray-600 uppercase tracking-wider">
          🛠️ Tools & Reports
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActivePage(tool.id)}
              className="bg-white rounded-2xl p-4 shadow-md border-2 border-gray-100 hover:border-green-500 active:scale-95 transition-all text-left"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-3 shadow-md`}
              >
                <span className="text-2xl">{tool.icon}</span>
              </div>
              <p className="text-xs font-black text-gray-800 uppercase leading-tight">
                {tool.label}
              </p>
              <p className="text-[10px] text-gray-500 mt-1 leading-tight">
                {tool.sub}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* App Info */}
      <div className="p-4">
        <div className="bg-white rounded-2xl shadow-md p-5 text-center border-2 border-gray-100">
          <h1 className="text-2xl font-black text-green-600">UDAAN</h1>
          <p className="text-xs font-bold text-gray-500 tracking-widest mt-1">
            FAST TRACK
          </p>
          <p className="text-[10px] text-gray-400 mt-3">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}