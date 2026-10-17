import React, { createContext, useContext, useState, useEffect } from 'react';
import { SEED_PRODUCTS } from '../data/seedProducts';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  // localStorage se load karo, ya seed products use karo
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('udaan_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return SEED_PRODUCTS;
      }
    }
    return SEED_PRODUCTS;
  });

  // Jab bhi products change ho, localStorage me save karo
  useEffect(() => {
    localStorage.setItem('udaan_products', JSON.stringify(products));
  }, [products]);

  // ==================== ADD PRODUCT ====================
  const addProduct = (productData, addedBy = 'UNKNOWN') => {
    // Validation
    if (!productData.name || !productData.category || !productData.mrp || !productData.rate) {
      return { success: false, error: 'Name, Category, MRP, Rate zaroori hain!' };
    }

    // Duplicate check (same name)
    const exists = products.find(
      (p) => p.name.toLowerCase().trim() === productData.name.toLowerCase().trim()
    );
    if (exists) {
      return { success: false, error: 'Is naam ka product already exist karta hai!' };
    }

    const newProduct = {
      id: `user-${Date.now()}`,          // Unique ID
      name: productData.name.trim(),
      category: productData.category.trim().toUpperCase(),
      mrp: Number(productData.mrp),
      rate: Number(productData.rate),
      unit: productData.unit || 'PCH',
      stock: Number(productData.stock) || 0,
      scheme: productData.scheme || null,
      barcode: productData.barcode || null,
      createdBy: addedBy,                // Kis salesman ne add kiya
      createdAt: new Date().toISOString(),
    };

    // Naya product sabse upar add karo (salesman ko turant dikhe)
    setProducts((prev) => [newProduct, ...prev]);

    return { success: true, product: newProduct };
  };

  // ==================== UPDATE PRODUCT ====================
  const updateProduct = (id, updates) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  // ==================== DELETE PRODUCT ====================
  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // ==================== BULK ADD (Import) ====================
  const bulkAddProducts = (productsArray, addedBy = 'ADMIN') => {
    const newProducts = productsArray.map((p, idx) => ({
      id: `bulk-${Date.now()}-${idx}`,
      name: p.name.trim(),
      category: (p.category || 'GENERAL').toUpperCase(),
      mrp: Number(p.mrp) || 0,
      rate: Number(p.rate) || 0,
      unit: p.unit || 'PCH',
      stock: Number(p.stock) || 0,
      scheme: p.scheme || null,
      barcode: p.barcode || null,
      createdBy: addedBy,
      createdAt: new Date().toISOString(),
    }));

    setProducts((prev) => [...newProducts, ...prev]);
    return newProducts.length;
  };

  // ==================== RESET TO SEED ====================
  const resetToSeed = () => {
    if (window.confirm('⚠️ Saare user products delete ho jayenge. Continue?')) {
      setProducts(SEED_PRODUCTS);
      localStorage.setItem('udaan_products', JSON.stringify(SEED_PRODUCTS));
    }
  };

  // ==================== HELPERS ====================
  const getCategories = () => {
    return ['ALL', ...new Set(products.map((p) => p.category))].sort();
  };

  const getProductById = (id) => products.find((p) => p.id === id);

  const searchProducts = (query) => {
    if (!query) return products;
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  };

  const getStats = () => ({
    total: products.length,
    userAdded: products.filter((p) => p.createdBy !== 'SYSTEM').length,
    categories: getCategories().length - 1,
  });

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        bulkAddProducts,
        resetToSeed,
        getCategories,
        getProductById,
        searchProducts,
        getStats,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);