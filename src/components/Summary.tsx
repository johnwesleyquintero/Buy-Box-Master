import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { SummaryStats } from '../types';

interface SummaryProps {
  stats: SummaryStats;
}

// Optimization: Component defined outside to prevent re-creation on every render
const StatCard = ({ label, value, subtext, icon, colorClass, borderClass }: any) => (
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

const Summary: React.FC<SummaryProps> = ({ stats }) => {
  const data = [
    { name: 'Won', value: stats.won, color: '#22c55e' }, // Green-500
    { name: 'Lost', value: stats.lost, color: '#ef4444' }, // Red-500
    { name: 'Suppressed', value: stats.suppressed, color: '#f59e0b' }, // Amber-500
  ].filter(item => item.value > 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {/* Metrics Cards */}
      <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <StatCard 
          label="Total ASINs"
          value={stats.total}
          subtext="Products analyzed in this batch"
          borderClass="border-slate-200"
          colorClass="bg-slate-100 text-slate-600"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
          }
        />

        <StatCard 
          label="Win Rate"
          value={`${stats.winRate.toFixed(1)}%`}
          subtext={stats.winRate > 85 ? "Excellent performance 🚀" : "Optimization needed ⚠️"}
          borderClass={stats.winRate > 80 ? "border-green-200 shadow-green-100" : "border-slate-200"}
          colorClass={stats.winRate > 80 ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0V5.625a1.125 1.125 0 011.125-1.125h1.5c.621 0 1.125.504 1.125 1.125v3.08c0 .621.504 1.125 1.125 1.125h.375M9.497 8.625c0-.621.504-1.125 1.125-1.125h1.5c.621 0 1.125.504 1.125 1.125v5.25c0 .621-.504 1.125-1.125 1.125h-.375" />
            </svg>
          }
        />

        <StatCard 
          label="Action Required"
          value={stats.lost + stats.suppressed}
          subtext={`${stats.lost} Price fixes • ${stats.suppressed} Listing fixes`}
          borderClass={stats.lost > 0 ? "border-red-200 bg-red-50/50" : "border-green-200"}
          colorClass={stats.lost > 0 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}
          icon={
            stats.lost > 0 ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )
          }
        />
      </div>

      {/* Mini Chart */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-slate-200 flex items-center justify-center md:col-span-1 min-h-[160px]">
        <ResponsiveContainer width="100%" height={140}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}
            />
            <Legend verticalAlign="bottom" height={20} iconSize={8} wrapperStyle={{ fontSize: '11px', fontWeight: 500 }}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Summary;