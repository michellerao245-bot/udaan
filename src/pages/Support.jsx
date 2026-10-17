import React from 'react';
import toast from 'react-hot-toast';

export default function Support({ onBack }) {
  const handleCall = (number) => {
    toast.success(`📞 Calling ${number}...`);
    window.location.href = `tel:${number}`;
  };

  const handleEmail = (email) => {
    toast.success(`📧 Opening email...`);
    window.location.href = `mailto:${email}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-gradient-to-r from-yellow-600 to-amber-600 text-white p-5 shadow-lg">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-2xl font-bold">←</button>
          <div>
            <h1 className="text-xl font-black tracking-wide">📞 Contact Support</h1>
            <p className="text-xs opacity-90 mt-0.5">We're here to help</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Call */}
        <button
          onClick={() => handleCall('18001234567')}
          className="w-full bg-white rounded-2xl p-5 shadow-md flex items-center gap-4 hover:shadow-lg active:scale-95 transition-all"
        >
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-2xl">
            📞
          </div>
          <div className="text-left flex-1">
            <p className="font-black text-gray-800">Call Support</p>
            <p className="text-xs text-gray-500">1800-123-4567 (Toll Free)</p>
          </div>
          <span className="text-gray-400">→</span>
        </button>

        {/* Email */}
        <button
          onClick={() => handleEmail('support@udaan.com')}
          className="w-full bg-white rounded-2xl p-5 shadow-md flex items-center gap-4 hover:shadow-lg active:scale-95 transition-all"
        >
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
            📧
          </div>
          <div className="text-left flex-1">
            <p className="font-black text-gray-800">Email Us</p>
            <p className="text-xs text-gray-500">support@udaan.com</p>
          </div>
          <span className="text-gray-400">→</span>
        </button>

        {/* WhatsApp */}
        <button
          onClick={() => {
            toast.success('Opening WhatsApp...');
            window.open('https://wa.me/919999999999', '_blank');
          }}
          className="w-full bg-white rounded-2xl p-5 shadow-md flex items-center gap-4 hover:shadow-lg active:scale-95 transition-all"
        >
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-2xl">
            💬
          </div>
          <div className="text-left flex-1">
            <p className="font-black text-gray-800">WhatsApp</p>
            <p className="text-xs text-gray-500">Chat with us</p>
          </div>
          <span className="text-gray-400">→</span>
        </button>

        {/* FAQ */}
        <button
          onClick={() => toast.success('FAQ page')}
          className="w-full bg-white rounded-2xl p-5 shadow-md flex items-center gap-4 hover:shadow-lg active:scale-95 transition-all"
        >
          <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-2xl">
            ❓
          </div>
          <div className="text-left flex-1">
            <p className="font-black text-gray-800">FAQ</p>
            <p className="text-xs text-gray-500">Frequently asked questions</p>
          </div>
          <span className="text-gray-400">→</span>
        </button>
      </div>
    </div>
  );
}