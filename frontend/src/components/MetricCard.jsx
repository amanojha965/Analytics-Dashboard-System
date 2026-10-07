import React from 'react';

export default function MetricCard({ title, value, icon, color, textColor }) {
  return (
    <div className={`bg-gradient-to-br ${color} p-[1px] rounded-2xl`}>
      <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 h-full flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold tracking-tight text-white">{value}</p>
        </div>
        <div className={`p-4 rounded-xl bg-slate-900/50 ${textColor} shadow-inner`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
