import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';

const AddProduct = ({ onSuccess }) => {
  const { addProduct, products, getStats } = useProducts();
  const { currentUser } = useAuth();

  const [form, setForm] = useState({
    name: '',
    category: '',
    mrp: '',
    rate: '',
    unit: 'PCH',
    stock: '',
    scheme: '',
    barcode: '',
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [showCategoryInput, setShowCategoryInput] = useState(false);

  // Existing categories
  const existingCategories = [
    ...new Set(products.map((p) => p.category)),
  ].sort();

  const stats = getStats();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.category.trim() || !form.mrp || !form.rate) {
      setMessage({
        type: 'error',
        text: '❌ Name, Category, MRP, Rate zaroori hain!',
      });
      return;
    }

    if (Number(form.rate) > Number(form.mrp)) {
      setMessage({
        type: 'error',
        text: '❌ Rate MRP se zyada nahi ho sakta!',
      });
      return;
    }

    const result = addProduct(form, currentUser?.userId || 'UNKNOWN');

    if (result.success) {
      setMessage({
        type: 'success',
        text: `✅ "${form.name}" successfully add ho gaya! Order Entry me turant dikhega.`,
      });

      // Form reset
      setForm({
        name: '',
        category: '',
        mrp: '',
        rate: '',
        unit: 'PCH',
        stock: '',
        scheme: '',
        barcode: '',
      });

      // Auto hide after 4s
      setTimeout(() => setMessage({ type: '', text: '' }), 4000);

      // Optional: callback
      onSuccess?.(result.product);
    } else {
      setMessage({ type: 'error', text: `❌ ${result.error}` });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ===== HEADER ===== */}
      <div className="bg-[#1c4f9c] text-white px-4 py-4 sticky top-0 z-20 shadow-lg">
        <h1 className="text-lg font-bold text-center">➕ Add New Product</h1>
        <p className="text-xs text-blue-200 text-center mt-1">
          Naya product add karo — Order Entry me turant aa jayega
        </p>
      </div>

      {/* ===== STATS BAR ===== */}
      <div className="px-4 pt-4 grid grid-cols-3 gap-2">
        <div className="bg-white rounded-xl p-3 shadow-sm text-center">
          <p className="text-xl font-bold text-[#1c4f9c]">{stats.total}</p>
          <p className="text-[10px] text-gray-500 uppercase">Total Products</p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm text-center">
          <p className="text-xl font-bold text-purple-600">{stats.userAdded}</p>
          <p className="text-[10px] text-gray-500 uppercase">User Added</p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm text-center">
          <p className="text-xl font-bold text-green-600">{stats.categories}</p>
          <p className="text-[10px] text-gray-500 uppercase">Categories</p>
        </div>
      </div>

      {/* ===== MESSAGE ===== */}
      {message.text && (
        <div className="px-4 pt-4">
          <div
            className={`px-4 py-3 rounded-lg border text-sm font-medium ${
              message.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            {message.text}
          </div>
        </div>
      )}

      {/* ===== FORM ===== */}
      <form onSubmit={handleSubmit} className="p-4 space-y-4">

        <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">

          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Saffola Gold 1L"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c4f9c] focus:outline-none text-sm uppercase"
              autoFocus
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Category <span className="text-red-500">*</span>
            </label>

            {!showCategoryInput ? (
              <div className="flex gap-2">
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c4f9c] focus:outline-none text-sm"
                >
                  <option value="">-- Select Category --</option>
                  {existingCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowCategoryInput(true)}
                  className="px-4 bg-[#1c4f9c] text-white rounded-lg text-sm font-medium hover:bg-[#0e3d7a]"
                  title="Add new category"
                >
                  ➕
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="New category name"
                  className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c4f9c] focus:outline-none text-sm uppercase"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowCategoryInput(false);
                    setForm({ ...form, category: '' });
                  }}
                  className="px-4 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* MRP + Rate */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                MRP (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="mrp"
                value={form.mrp}
                onChange={handleChange}
                placeholder="e.g. 180"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c4f9c] focus:outline-none text-sm"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Rate (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="rate"
                value={form.rate}
                onChange={handleChange}
                placeholder="e.g. 165"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c4f9c] focus:outline-none text-sm"
                step="0.01"
              />
            </div>
          </div>

          {/* Unit + Stock */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Unit
              </label>
              <select
                name="unit"
                value={form.unit}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c4f9c] focus:outline-none text-sm"
              >
                <option value="PCH">PCH (Pouch)</option>
                <option value="BT">BT (Bottle)</option>
                <option value="JAR">JAR</option>
                <option value="BOX">BOX</option>
                <option value="KG">KG</option>
                <option value="GM">GM (Gram)</option>
                <option value="LTR">LTR (Litre)</option>
                <option value="ML">ML</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="e.g. 500"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c4f9c] focus:outline-none text-sm"
              />
            </div>
          </div>

          {/* Scheme */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Scheme / Offer (Optional)
            </label>
            <input
              type="text"
              name="scheme"
              value={form.scheme}
              onChange={handleChange}
              placeholder="e.g. Buy 5 Get 1 Free"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c4f9c] focus:outline-none text-sm"
            />
          </div>

          {/* Barcode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Barcode (Optional)
            </label>
            <input
              type="text"
              name="barcode"
              value={form.barcode}
              onChange={handleChange}
              placeholder="e.g. 8901030801234"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c4f9c] focus:outline-none text-sm"
            />
          </div>
        </div>

        {/* Preview */}
        {form.name && form.mrp && form.rate && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-[10px] text-blue-600 uppercase font-bold mb-2">
              👁️ Preview (aisa dikhega Order Entry me)
            </p>
            <div className="bg-white rounded-lg p-3 border border-blue-100">
              <p className="text-sm font-bold text-gray-800 uppercase">
                {form.name}
              </p>
              <p className="text-[10px] text-gray-500 uppercase mt-0.5">
                {form.category || 'CATEGORY'} · {form.unit}
              </p>
              <div className="flex justify-between mt-2 text-xs">
                <span className="text-gray-500">
                  MRP: <span className="font-medium text-gray-800">₹{form.mrp}</span>
                </span>
                <span className="text-[#1c4f9c] font-bold">₹{form.rate}</span>
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-[#6cbd45] hover:bg-[#5ba83a] text-white font-bold py-3.5 rounded-full shadow-lg transition-colors text-base"
        >
          ✅ Save Product
        </button>

        <p className="text-center text-xs text-gray-500 pt-2">
          💡 Save karte hi Order Entry me turant dikhega
        </p>
      </form>
    </div>
  );
};

export default AddProduct;