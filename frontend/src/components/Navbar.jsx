import React from 'react';
import { RefreshCw } from 'lucide-react';

export default function Navbar({ loading, onRefresh }) {
  return (
    <nav className="sticky top-4 z-50 backdrop-blur-2xl bg-white/70 border border-white/80 shadow-[0_0_10px_rgba(0,0,0,0.02)] rounded-2xl px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4 transition-all">
      <div className="flex flex-col">
        <div className="flex items-center gap-1 text-xs text-[#67748E] mb-1">
          <span>Pages</span>
          <span>/</span>
          <span className="text-[#344767] font-semibold">Dashboard</span>
        </div>
        <h1 className="text-base font-bold text-[#344767] tracking-tight">
          Dashboard
        </h1>
      </div>
      
      <div className="flex items-center gap-4 text-sm font-medium">
        <button onClick={onRefresh} className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-[#344767] transition-colors rounded-lg border border-gray-200 shadow-sm">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh Data
        </button>
      </div>
    </nav>
  );
}
