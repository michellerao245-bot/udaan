import React from 'react';

export default function Schemes({ onBack }) {
  const schemes = [
    {
      icon: '🎁',
      title: 'Buy 10 Get 1 Free',
      desc: 'On Saffola Gold 1L',
      color: 'from-orange-500 to-red-600',
      valid: 'Till 31 Oct',
    },
    {
      icon: '💰',
      title: 'Extra 5% Off',
      desc: 'On orders above ₹5000',
      color: 'from-green-500 to-emerald-600',
      valid: 'Till 25 Oct',
    },
    {
      icon: '⭐',
      title: 'Double Points',
      desc: 'On Parachute products',
      color: 'from-purple-500 to-pink-600',
      valid: 'Till 30 Oct',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-5 shadow-lg">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-2xl font-bold">←</button>
          <div>
            <h1 className="text-xl font-black tracking-wide">🎁 Schemes & Rewards</h1>
            <p className="text-xs opacity-90 mt-0.5">Active offers and points</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Points Card */}
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-5 shadow-lg text-white">
          <p className="text-xs font-bold uppercase opacity-90">My Reward Points</p>
          <p className="text-4xl font-black mt-2">1,250</p>
          <p className="text-xs opacity-90 mt-1">🎯 Redeem 1000 pts = ₹100</p>
        </div>

        {/* Active Schemes */}
        <div>
          <h3 className="text-sm font-black text-gray-600 uppercase mb-3">
            🔥 Active Schemes
          </h3>
          <div className="space-y-3">
            {schemes.map((s, i) => (
              <div
                key={i}
                className={`bg-gradient-to-r ${s.color} rounded-2xl p-4 text-white shadow-md`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl">
                    {s.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-black uppercase text-sm">{s.title}</p>
                    <p className="text-xs opacity-90">{s.desc}</p>
                    <p className="text-[10px] opacity-80 mt-1">📅 {s.valid}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}