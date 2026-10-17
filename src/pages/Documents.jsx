import React from 'react';
import toast from 'react-hot-toast';

export default function Documents({ onBack }) {
  const docs = [
    { icon: '📄', label: 'Aadhaar Card', status: 'Verified', verified: true },
    { icon: '🆔', label: 'PAN Card', status: 'Verified', verified: true },
    { icon: '📜', label: 'Joining Letter', status: 'Verified', verified: true },
    { icon: '📋', label: 'ID Card', status: 'Pending', verified: false },
    { icon: '🏦', label: 'Bank Details', status: 'Verified', verified: true },
    { icon: '📸', label: 'Photo', status: 'Verified', verified: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white p-5 shadow-lg">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-2xl font-bold">←</button>
          <div>
            <h1 className="text-xl font-black tracking-wide">📄 My Documents</h1>
            <p className="text-xs opacity-90 mt-0.5">ID & agreements</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {docs.map((doc, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-4 shadow-md flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center text-2xl">
              {doc.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm font-black text-gray-800">{doc.label}</p>
              <p className={`text-xs font-bold ${doc.verified ? 'text-green-600' : 'text-orange-500'}`}>
                {doc.verified ? '✓ ' : '⏳ '}
                {doc.status}
              </p>
            </div>
            <button
              onClick={() => toast.success(`${doc.label} — View`)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}