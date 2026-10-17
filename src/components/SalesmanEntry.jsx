import React, { useState } from 'react';
import { useData } from '../context/DataContext';

const SalesmanEntry = () => {
  const { addOrder } = useData();
  const [form, setForm] = useState({
    retailer: '',
    product: '',
    quantity: '',
    amount: '',
    status: 'Pending',
  });
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.retailer || !form.product || !form.amount) {
      alert('Retailer, Product aur Amount zaroori hai!');
      return;
    }
    addOrder(form);
    setSuccess(`✅ Order added for ${form.retailer}!`);
    setForm({ retailer: '', product: '', quantity: '', amount: '', status: 'Pending' });
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        🧑‍💼 Salesman Entry — Naya Order
      </h3>

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Retailer Name *
            </label>
            <input
              type="text"
              name="retailer"
              value={form.retailer}
              onChange={handleChange}
              placeholder="e.g. Sharma Kirana Store"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              name="product"
              value={form.product}
              onChange={handleChange}
              placeholder="e.g. Tata Salt 1kg"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              placeholder="e.g. 10"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (₹) *
            </label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="e.g. 4500"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
            >
              <option>Pending</option>
              <option>In Transit</option>
              <option>Delivered</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors"
        >
          ➕ Add Order
        </button>
      </form>
    </div>
  );
};

export default SalesmanEntry;