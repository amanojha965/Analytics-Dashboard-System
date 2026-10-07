import React from 'react';
import { RefreshCw, Menu, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ loading, onRefresh, onMenuToggle }) {
  const { logout } = useAuth();
  return (
    <nav className="sticky top-4 z-30 backdrop-blur-2xl bg-white/70 border border-white/80 shadow-[0_0_10px_rgba(0,0,0,0.02)] rounded-2xl px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all">
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="lg:hidden p-2 -ml-2 text-[#67748E] hover:bg-gray-100 rounded-lg transition-colors">
          <Menu size={20} />
        </button>
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
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4 text-sm font-medium">
        <button onClick={onRefresh} className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white hover:bg-gray-50 text-[#344767] transition-colors rounded-lg border border-gray-200 shadow-sm">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">Refresh Data</span>
        </button>
        <button 
          onClick={logout}
          className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-lg shadow-sm hover:shadow-md transition-all"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Log Out</span>
        </button>
      </div>
    </nav>
  );
}
