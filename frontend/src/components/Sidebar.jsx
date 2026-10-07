import React from 'react';
import { Home, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { logout } = useAuth();
  
  const menuItems = [
    { icon: <Home size={18} />, label: 'Dashboard', active: true },
  ];

  return (
    <aside className="w-64 bg-transparent h-screen sticky top-0 hidden lg:flex flex-col p-4 border-none">
      <div className="flex items-center gap-3 px-6 py-6 mb-2 border-b border-gray-200/50">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#344767"/>
            <path d="M2 17L12 22L22 17" stroke="#344767" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="#344767" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="text-[#344767] font-semibold text-sm tracking-wide">Analytics Dashboard</span>
      </div>

      <div className="flex-1 overflow-y-auto mt-2">
        <ul className="space-y-1.5">
          {menuItems.map((item, index) => (
            <li key={index}>
              <a 
                href="#" 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  item.active 
                    ? 'bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] text-[#344767] font-semibold' 
                    : 'text-[#67748E] hover:bg-white/50'
                }`}
              >
                <div className={`p-2 rounded-lg flex items-center justify-center ${
                  item.active ? 'bg-gradient-to-br from-[#cb0c9f] to-[#cb0c9f] text-white shadow-md' : 'bg-white text-[#344767] shadow-sm'
                }`}>
                  {item.icon}
                </div>
                <span className="text-sm">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-auto px-4 pb-4">
        <button 
          onClick={logout}
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
        >
          <LogOut size={16} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
