import React from 'react';

export default function FilterBar({ filters, onFilterChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-2xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] border-0">
      <div className="space-y-1">
        <label className="text-xs text-[#67748E] font-bold uppercase tracking-wider">Start Date</label>
        <input 
          type="date" 
          name="startDate" 
          value={filters.startDate} 
          onChange={onFilterChange} 
          onClick={(e) => { if (e.target.showPicker) e.target.showPicker(); }} 
          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#344767] focus:ring-2 focus:ring-[#cb0c9f] focus:border-transparent outline-none cursor-pointer transition-all" 
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-[#67748E] font-bold uppercase tracking-wider">End Date</label>
        <input 
          type="date" 
          name="endDate" 
          value={filters.endDate} 
          onChange={onFilterChange} 
          onClick={(e) => { if (e.target.showPicker) e.target.showPicker(); }} 
          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#344767] focus:ring-2 focus:ring-[#cb0c9f] focus:border-transparent outline-none cursor-pointer transition-all" 
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-[#67748E] font-bold uppercase tracking-wider">Category</label>
        <select 
          name="category" 
          value={filters.category} 
          onChange={onFilterChange} 
          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#344767] focus:ring-2 focus:ring-[#cb0c9f] focus:border-transparent outline-none transition-all"
        >
          <option value="All">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Furniture">Furniture</option>
          <option value="Apparel">Apparel</option>
          <option value="Home">Home</option>
          <option value="Toys">Toys</option>
        </select>
      </div>
      <div className="space-y-1">
        <label className="text-xs text-[#67748E] font-bold uppercase tracking-wider">Status</label>
        <select 
          name="deliveryStatus" 
          value={filters.deliveryStatus} 
          onChange={onFilterChange} 
          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#344767] focus:ring-2 focus:ring-[#cb0c9f] focus:border-transparent outline-none transition-all"
        >
          <option value="All">All Statuses</option>
          <option value="Delivered">Delivered</option>
          <option value="Delayed">Delayed</option>
          <option value="In Transit">In Transit</option>
        </select>
      </div>
    </div>
  );
}
