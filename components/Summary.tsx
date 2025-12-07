import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { SummaryStats } from '../types';
import { StatCard } from './StatCard';
import { IconTotal, IconWinRate, IconAction, IconCheck } from './Icons';

interface SummaryProps {
  stats: SummaryStats;
}

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
          icon={<IconTotal className="w-5 h-5" />}
        />

        <StatCard 
          label="Win Rate"
          value={`${stats.winRate.toFixed(1)}%`}
          subtext={stats.winRate > 85 ? "Excellent performance 🚀" : "Optimization needed ⚠️"}
          borderClass={stats.winRate > 80 ? "border-green-200 shadow-green-100" : "border-slate-200"}
          colorClass={stats.winRate > 80 ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"}
          icon={<IconWinRate className="w-5 h-5" />}
        />

        <StatCard 
          label="Action Required"
          value={stats.lost + stats.suppressed}
          subtext={`${stats.lost} Price fixes • ${stats.suppressed} Listing fixes`}
          borderClass={stats.lost > 0 ? "border-red-200 bg-red-50/50" : "border-green-200"}
          colorClass={stats.lost > 0 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}
          icon={
            stats.lost > 0 ? (
              <IconAction className="w-5 h-5" />
            ) : (
              <IconCheck className="w-5 h-5" />
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