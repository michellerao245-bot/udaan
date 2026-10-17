import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // LocalStorage se initial data load karo
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('udaan_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // Jab bhi orders change ho, localStorage me save karo
  useEffect(() => {
    localStorage.setItem('udaan_orders', JSON.stringify(orders));
  }, [orders]);

  // Naya order add karo (salesman entry se)
  const addOrder = (order) => {
    const newOrder = {
      id: `UDN-${Date.now().toString().slice(-6)}`,
      ...order,
      date: new Date().toISOString().split('T')[0],
      status: order.status || 'Pending',
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  // Order delete
  const deleteOrder = (id) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  // Order status update
  const updateStatus = (id, status) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
  };

  // Dashboard ke liye calculated stats
  const stats = {
    totalSales: orders.reduce((sum, o) => sum + Number(o.amount || 0), 0),
    totalOrders: orders.length,
    totalRetailers: new Set(orders.map((o) => o.retailer)).size,
    pendingDeliveries: orders.filter((o) => o.status === 'Pending').length,
  };

  return (
    <DataContext.Provider
      value={{ orders, addOrder, deleteOrder, updateStatus, stats }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);