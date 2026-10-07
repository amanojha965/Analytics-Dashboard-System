import React from 'react';

export default function FilterBar({ filters, onFilterChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-800/50 backdrop-blur-md p-4 rounded-2xl border border-slate-700/50">
      <div className="space-y-1">
        <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Start Date</label>
        <input type="date" name="startDate" value={filters.startDate} onChange={onFilterChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">End Date</label>
        <input type="date" name="endDate" value={filters.endDate} onChange={onFilterChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Category</label>
        <select name="category" value={filters.category} onChange={onFilterChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
          <option value="All">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Furniture">Furniture</option>
        </select>
      </div>
      <div className="space-y-1">
        <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Status</label>
        <select name="deliveryStatus" value={filters.deliveryStatus} onChange={onFilterChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
          <option value="All">All Statuses</option>
          <option value="Delivered">Delivered</option>
          <option value="Delayed">Delayed</option>
        </select>
      </div>
    </div>
  );
}
