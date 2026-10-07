import React from 'react';
import { Wallet, Globe, FileText, ShoppingCart } from 'lucide-react';

export default function MetricCard({ title, value, percentage, percentageColor = "text-[#82d616]", iconName }) {
  
  const renderIcon = () => {
    const iconClass = "text-white";
    switch(iconName) {
      case 'wallet': return <Wallet size={20} className={iconClass} />;
      case 'globe': return <Globe size={20} className={iconClass} />;
      case 'file': return <FileText size={20} className={iconClass} />;
      case 'cart': return <ShoppingCart size={20} className={iconClass} />;
      default: return <Wallet size={20} className={iconClass} />;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] border-0 h-full flex flex-row items-center justify-between">
      <div className="flex flex-col">
        <p className="text-[#67748E] text-sm font-semibold capitalize mb-1">{title}</p>
        <h5 className="text-xl font-bold tracking-tight text-[#344767]">
          {value}
          <span className={`text-sm font-bold ml-2 ${percentageColor}`}>{percentage}</span>
        </h5>
      </div>
      <div className="w-12 h-12 rounded-xl bg-gradient-to-tl from-[#141727] to-[#3A416F] flex items-center justify-center shadow-md">
        {renderIcon()}
      </div>
    </div>
  );
}
