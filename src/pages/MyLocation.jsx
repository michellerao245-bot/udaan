import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function MyLocation({ onBack }) {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const getLocation = () => {
    if (!navigator.geolocation) {
      return toast.error('GPS supported nahi hai');
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date(),
        };
        setLocation(loc);
        setHistory((prev) => [loc, ...prev].slice(0, 10));
        toast.success('Location captured! ✅');
        setLoading(false);
      },
      () => {
        toast.error('Location nahi mili');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-gradient-to-r from-purple-700 to-pink-600 text-white p-5 shadow-lg">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-2xl font-bold">←</button>
          <div>
            <h1 className="text-xl font-black tracking-wide">📍 My Location</h1>
            <p className="text-xs opacity-90 mt-0.5">GPS tracking & history</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Current Location */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h3 className="text-sm font-black text-gray-700 uppercase mb-3">Current Location</h3>
          {location ? (
            <div className="space-y-2">
              <InfoRow label="Latitude" value={location.lat.toFixed(6)} />
              <InfoRow label="Longitude" value={location.lng.toFixed(6)} />
              <InfoRow label="Accuracy" value={`±${Math.round(location.accuracy)}m`} />
              <InfoRow label="Time" value={location.timestamp.toLocaleTimeString('en-IN')} />
            </div>
          ) : (
            <p className="text-center py-6 text-gray-400 text-sm">
              Location not captured
            </p>
          )}

          <button
            onClick={getLocation}
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black uppercase py-3 rounded-xl shadow-md active:scale-95 transition-all"
          >
            {loading ? 'Getting...' : location ? '🔄 Update Location' : '📍 Capture Location'}
          </button>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-5">
            <h3 className="text-sm font-black text-gray-700 uppercase mb-3">
              📜 Recent Locations ({history.length})
            </h3>
            <div className="space-y-2">
              {history.map((h, i) => (
                <div key={i} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-xs font-mono text-gray-700">
                      {h.lat.toFixed(4)}, {h.lng.toFixed(4)}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {h.timestamp.toLocaleTimeString('en-IN')}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-green-600">✓</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="font-bold text-gray-800 font-mono">{value}</span>
  </div>
);