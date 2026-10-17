import React, { useRef, useEffect } from 'react';

const SearchBar = ({ value, onChange, onSubmit }) => {
  const inputRef = useRef(null);

  // Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="relative hidden lg:block">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && value.trim()) onSubmit(value);
        }}
        placeholder="Search... (Ctrl+K)"
        className="pl-10 pr-16 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1c4f9c] focus:border-transparent w-64 xl:w-72 bg-gray-50 focus:bg-white transition-all"
      />

      {/* Search icon */}
      <svg
        className="absolute left-3 top-2.5 text-gray-400"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>

      {/* Clear or Shortcut */}
      {value ? (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      ) : (
        <kbd className="absolute right-2 top-2 text-[10px] px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded border border-gray-300 font-mono">
          ⌘K
        </kbd>
      )}
    </div>
  );
};

export default SearchBar;