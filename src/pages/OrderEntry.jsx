import React, { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { productService } from '../services/product.service';
import { orderService } from '../services/order.service';
import { retailerService } from '../services/retailer.service';

// ==================== PAGES ====================
import Home from './Home';
import Others from './Others';
import Settings from './Settings';

export default function OrderEntry() {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [retailers, setRetailers] = useState([]);
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [location, setLocation] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [filter, setFilter] = useState('ALL');

  // ⭐ Bottom Nav State
  const [activeNav, setActiveNav] = useState('home');
  // 'home' | 'outlets' | 'others' | 'settings'

  // For outlets → order flow
  const [showRetailerList, setShowRetailerList] = useState(true);

  // ==================== FETCH ====================
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [prodRes, retRes] = await Promise.all([
        productService.getAll(),
        retailerService.getAll(),
      ]);
      if (prodRes.data.success) setProducts(prodRes.data.data || []);
      if (retRes.data.success) setRetailers(retRes.data.data || []);
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // ==================== LOCATION ====================
  const getLocation = () => {
    if (!navigator.geolocation) {
      toast.error('GPS supported nahi hai');
      return;
    }
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        toast.success('Location captured! ✅');
        setGettingLocation(false);
      },
      () => {
        toast.error('Location nahi mili');
        setGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // ==================== QTY ====================
  const incrementQty = (id) => {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };
  const decrementQty = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) - 1),
    }));
  };
  const updateQty = (id, val) => {
    const num = Math.max(0, Number(val) || 0);
    setQuantities((prev) => ({ ...prev, [id]: num }));
  };

  // ==================== CALCULATIONS ====================
  const activeItems = useMemo(() => {
    return products
      .filter((p) => (quantities[p.id] || 0) > 0)
      .map((p) => ({
        productId: p.id,
        productName: p.name,
        quantity: quantities[p.id],
        rate: Number(p.rate),
        mrp: Number(p.mrp),
        amount: Number(p.rate) * quantities[p.id],
      }));
  }, [products, quantities]);

  const netValue = activeItems.reduce((s, i) => s + i.amount, 0);
  const totalQty = activeItems.reduce((s, i) => s + i.quantity, 0);
  const totalLines = activeItems.length;

  // ==================== SUBMIT ====================
  const handleSubmit = async () => {
    if (!selectedRetailer) return toast.error('Retailer select karo');
    if (activeItems.length === 0) return toast.error('Products add karo');
    if (!location) return toast.error('Location capture karo');

    setSubmitting(true);
    try {
      const res = await orderService.create({
        retailerId: selectedRetailer.id,
        retailerName: selectedRetailer.name,
        items: activeItems,
        locationLat: location.lat,
        locationLng: location.lng,
        locationDistance: 0,
      });
      if (res.data.success) {
        toast.success(`Order ${res.data.data.orderNumber} placed! ✅`);
        setQuantities({});
        setSelectedRetailer(null);
        setLocation(null);
        setShowRetailerList(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    } finally {
      setSubmitting(false);
    }
  };

  // ==================== NAV HANDLER ====================
  const handleNavChange = (tab) => {
    setActiveNav(tab);
    if (tab === 'outlets') {
      setShowRetailerList(true);
      setSelectedRetailer(null);
    }
  };

  // ==================== FILTERS ====================
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );
  const filteredRetailers = retailers.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.retailer_code?.toLowerCase().includes(search.toLowerCase())
  );

  // ==================== LOADING ====================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent mb-3"></div>
          <p className="text-gray-500 text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // ==================== HOME PAGE ====================
  if (activeNav === 'home') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 overflow-y-auto pb-24">
          <Home onNavigate={handleNavChange} />
        </div>
        <BottomNav active={activeNav} onNavigate={handleNavChange} />
      </div>
    );
  }

  // ==================== OTHERS PAGE ====================
  if (activeNav === 'others') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 overflow-y-auto pb-24">
          <Others />
        </div>
        <BottomNav active={activeNav} onNavigate={handleNavChange} />
      </div>
    );
  }

  // ==================== SETTINGS PAGE ====================
  if (activeNav === 'settings') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 overflow-y-auto pb-24">
          <Settings />
        </div>
        <BottomNav active={activeNav} onNavigate={handleNavChange} />
      </div>
    );
  }

  // ==================== OUTLETS PAGE ====================
  if (activeNav === 'outlets') {

    // ===== Order Entry Screen (retailer selected) =====
    if (!showRetailerList && selectedRetailer) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <div className="flex-1 overflow-y-auto pb-40">

            {/* Header */}
            <div className="bg-gradient-to-r from-green-700 to-green-600 text-white sticky top-0 z-20 shadow-lg">
              <div className="px-4 py-3 flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowRetailerList(true);
                    setSelectedRetailer(null);
                  }}
                  className="text-2xl font-bold"
                >
                  ←
                </button>
                <h1 className="text-base font-black uppercase truncate flex-1 tracking-wide">
                  {selectedRetailer?.name}
                </h1>
              </div>

              <div className="px-4 pb-3 flex items-center gap-2">
                <StepCircle done label="1" />
                <StepCircle done label="2" />
                <StepCircle active label="3" />
                <StepCircle label="4" />
              </div>

              <div className="h-1 bg-black/20">
                <div className="h-full bg-yellow-400" style={{ width: '60%' }}></div>
              </div>
            </div>

            {/* Location */}
            <div className={`border-b-2 px-4 py-3 flex items-center justify-between ${
              location ? 'bg-green-50 border-green-300' : 'bg-purple-50 border-purple-300'
            }`}>
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xl">{location ? '✅' : '📍'}</span>
                <span className={`text-xs font-bold truncate ${location ? 'text-green-700' : 'text-purple-700'}`}>
                  {location
                    ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
                    : 'Location not captured'}
                </span>
              </div>
              <button
                onClick={getLocation}
                disabled={gettingLocation}
                className={`text-xs font-black uppercase px-3 py-1.5 rounded-lg shadow-md ${
                  location ? 'bg-green-600 text-white' : 'bg-purple-600 text-white'
                }`}
              >
                {gettingLocation ? 'Getting...' : location ? 'Update' : 'Capture'}
              </button>
            </div>

            {/* Search */}
            <div className="bg-white border-b border-gray-100 px-4 py-2">
              <div className="relative">
                <svg
                  className="absolute left-3 top-3 text-gray-400"
                  width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-green-600 focus:outline-none font-medium"
                />
              </div>
            </div>

            {/* Products */}
            <div className="divide-y divide-gray-100">
              {filteredProducts.map((p) => {
                const qty = quantities[p.id] || 0;
                const isActive = qty > 0;
                const discount = Math.round(
                  ((Number(p.mrp) - Number(p.rate)) / Number(p.mrp)) * 100
                );

                return (
                  <div
                    key={p.id}
                    className={`bg-white p-4 transition-colors ${isActive ? 'bg-green-50' : ''}`}
                  >
                    <div className="flex gap-3">
                      <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden border-2 border-gray-200">
                        {p.image_url ? (
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = '<span style="font-size:2rem">📦</span>';
                            }}
                          />
                        ) : (
                          <span className="text-3xl">📦</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-black text-gray-800 leading-tight uppercase">
                          {p.name}
                        </h3>
                        <p className="text-[11px] text-green-700 font-bold mt-0.5">
                          Stock: {p.stock}
                        </p>

                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="text-[11px] text-gray-600 font-medium">
                            MRP: ₹{Number(p.mrp).toFixed(2)}
                          </span>
                          {discount > 0 && (
                            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-black">
                              {discount}% OFF
                            </span>
                          )}
                        </div>

                        <p className="text-base font-black text-green-700 mt-1">
                          ₹{Number(p.rate).toFixed(2)}
                        </p>

                        <div className="flex items-center gap-2 mt-2.5">
                          <select className="text-[11px] font-bold border-2 border-gray-300 rounded-lg px-2 py-1.5 bg-white focus:border-green-600 focus:outline-none">
                            <option>{p.unit || 'PAK'}</option>
                          </select>

                          <div className="flex items-center border-2 border-green-600 rounded-lg overflow-hidden bg-white">
                            <button
                              onClick={() => decrementQty(p.id)}
                              disabled={qty === 0}
                              className="w-9 h-9 bg-red-50 text-red-600 disabled:opacity-30 font-black text-xl flex items-center justify-center"
                            >
                              −
                            </button>
                            <input
                              type="number"
                              value={qty}
                              onChange={(e) => updateQty(p.id, e.target.value)}
                              className="w-14 h-9 text-center text-sm font-black border-x-2 border-green-600 focus:outline-none"
                            />
                            <button
                              onClick={() => incrementQty(p.id)}
                              className="w-9 h-9 bg-green-600 text-white font-black text-xl flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Summary */}
          <div className="fixed bottom-16 left-0 right-0 bg-gray-900 text-white px-4 py-2.5 flex items-center justify-between text-sm font-black z-40">
            <span>📋 Lines: {totalLines}</span>
            <span>💰 Value: ₹{netValue.toFixed(2)}</span>
          </div>

          {/* Bottom Action */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 px-4 py-3 flex gap-2 z-[9999]">
            <button
              onClick={() => {
                setShowRetailerList(true);
                setSelectedRetailer(null);
              }}
              className="w-14 py-3 bg-gray-200 text-gray-700 rounded-xl font-black text-xl"
            >
              ←
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || totalLines === 0 || !location}
              className={`flex-1 py-3 rounded-xl font-black text-sm uppercase tracking-wide transition-all shadow-lg ${
                totalLines === 0 || !location
                  ? 'bg-gray-400 text-gray-200'
                  : 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:shadow-xl active:scale-95'
              }`}
            >
              {submitting
                ? '⏳ Submitting...'
                : totalLines === 0
                ? 'Not Ordered'
                : `✅ Submit Order (${totalLines})`}
            </button>
          </div>
        </div>
      );
    }

    // ===== Outlet List Screen =====
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 overflow-y-auto pb-32">

          {/* Header */}
          <div className="bg-gradient-to-r from-green-700 to-green-600 shadow-lg sticky top-0 z-20">
            <div className="px-4 py-4 flex items-center gap-3">
              <button className="text-white text-2xl font-bold">←</button>
              <h1 className="text-white text-lg font-black tracking-wider uppercase flex-1">
                Outlet List
              </h1>
            </div>
          </div>

          {/* Shop Info */}
          <div className="bg-white px-4 py-5 border-b-2 border-gray-100">
            <h2 className="text-center font-black text-gray-800 text-lg mb-4">
              {currentUser?.name} ({currentUser?.userId})
            </h2>

            <div className="border-2 border-gray-300 rounded-xl px-4 py-3 flex items-center justify-between mb-4 bg-gray-50">
              <span className="text-sm font-bold text-gray-700 truncate">
                RTM - Main Market - Monday
              </span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>

            <div className="flex gap-2 mb-4 flex-wrap">
              <button
                onClick={() => setFilter('BILLED')}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wide transition-all ${
                  filter === 'BILLED'
                    ? 'bg-green-600 text-white shadow-lg scale-105'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                Billed - MTD
              </button>
              <button
                onClick={() => setFilter('UNBILLED')}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wide transition-all ${
                  filter === 'UNBILLED'
                    ? 'bg-red-600 text-white shadow-lg scale-105'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                Unbilled - MTD
              </button>
              <button
                onClick={() => setFilter('ALL')}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wide transition-all ${
                  filter === 'ALL'
                    ? 'bg-gray-700 text-white shadow-lg scale-105'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                KATS
              </button>
            </div>

            <div className="relative">
              <svg
                className="absolute left-4 top-3.5 text-gray-400"
                width="18" height="18" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Outlet"
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl text-sm focus:border-green-600 focus:outline-none font-medium"
              />
            </div>
          </div>

          {/* Retailers */}
          <div className="px-4 py-4 space-y-3">
            {filteredRetailers.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p className="text-6xl mb-4">🏪</p>
                <p className="text-base font-bold">No retailers found</p>
              </div>
            ) : (
              filteredRetailers.map((r, idx) => (
                <div
                  key={r.id}
                  onClick={() => {
                    setSelectedRetailer(r);
                    setShowRetailerList(false);
                    toast.success(`${r.name} selected`);
                  }}
                  className="bg-white rounded-2xl p-4 border-2 border-gray-100 shadow-sm hover:shadow-xl hover:border-green-300 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shrink-0 shadow-md">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-black text-gray-800 uppercase leading-tight">
                        {r.name}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">
                        {r.category || 'Small Kirana'}
                      </p>
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md ${
                          idx % 2 === 0
                            ? 'bg-orange-400 text-white'
                            : 'bg-yellow-400 text-yellow-900'
                        }`}>
                          {idx % 2 === 0 ? 'Skipped' : 'Order Placed'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shadow-md">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bottom Nav */}
        <BottomNav active={activeNav} onNavigate={handleNavChange} />

        {/* Floating + */}
        <button
          onClick={() => toast.success('Add new retailer')}
          className="fixed bottom-24 right-5 w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white shadow-2xl flex items-center justify-center z-30 hover:scale-110 active:scale-95 transition-all"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
    );
  }

  // Fallback
  return null;
}

// ==================== BOTTOM NAV ====================
const BottomNav = ({ active, onNavigate }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 z-[9999] shadow-2xl">
    <div className="flex justify-around items-center py-3 max-w-screen-xl mx-auto">
      <NavItem
        active={active === 'home'}
        onClick={() => onNavigate('home')}
        label="Home"
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        }
      />
      <NavItem
        active={active === 'outlets'}
        onClick={() => onNavigate('outlets')}
        label="Outlets"
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        }
      />
      <NavItem
        active={active === 'others'}
        onClick={() => onNavigate('others')}
        label="Others"
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        }
      />
      <NavItem
        active={active === 'settings'}
        onClick={() => onNavigate('settings')}
        label="Settings"
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        }
      />
    </div>
  </div>
);

// ==================== STEP CIRCLE ====================
const StepCircle = ({ done, active, label }) => (
  <div
    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black transition-all ${
      done
        ? 'bg-white text-green-700'
        : active
        ? 'bg-yellow-400 text-green-900 ring-4 ring-yellow-200 scale-110'
        : 'bg-white/30 text-white'
    }`}
  >
    {done ? (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ) : (
      label
    )}
  </div>
);

// ==================== NAV ITEM ====================
const NavItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-1 px-4 py-1 min-w-[60px] hover:bg-gray-50 rounded-lg transition-colors"
  >
    <div className={active ? 'text-green-600' : 'text-gray-400'}>{icon}</div>
    <span
      className={`text-[10px] font-black uppercase tracking-wide ${
        active ? 'text-green-600' : 'text-gray-500'
      }`}
    >
      {label}
    </span>
    {active && <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-0.5"></div>}
  </button>
);