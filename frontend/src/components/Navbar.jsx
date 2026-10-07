import React from 'react';
import { LayoutDashboard, RefreshCw } from 'lucide-react';

export default function Navbar({ loading, onRefresh }) {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/70 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-500 p-2 rounded-xl bg-opacity-20 text-indigo-400">
          <LayoutDashboard size={24} />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          Unified Analytics
        </h1>
      </div>
      <div className="flex items-center gap-4 text-sm font-medium">
        <button onClick={onRefresh} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 transition-colors rounded-lg border border-slate-700">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>
    </nav>
  );
}
