import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext: string;
  icon: React.ReactNode;
  colorClass: string;
  borderClass: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, subtext, icon, colorClass, borderClass }) => (
  <div className={`bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-sm border ${borderClass} flex flex-col justify-between transition-transform hover:-translate-y-1 duration-300`}>
    <div className="flex justify-between items-start">
      <div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
        <div className="mt-2 text-3xl font-bold text-slate-900">{value}</div>
      </div>
      <div className={`p-2 rounded-lg ${colorClass}`}>
        {icon}
      </div>
    </div>
    <div className="text-xs mt-3 text-slate-500 font-medium">
      {subtext}
    </div>
  </div>
);
