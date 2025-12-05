import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { SummaryStats } from '../types';

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
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
          <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total ASINs</span>
          <div className="mt-2 text-3xl font-bold text-slate-900">{stats.total}</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
          <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Win Rate</span>
          <div className="mt-2 text-3xl font-bold text-slate-900">
            {stats.winRate.toFixed(1)}%
          </div>
           <div className="text-xs mt-2 text-slate-400">
            Target: &gt;85%
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
          <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Action Required</span>
          <div className={`mt-2 text-xl font-bold ${stats.lost > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {stats.lost > 0 ? `${stats.lost} Price Adjustments` : 'All Systems Go'}
          </div>
          <div className="text-xs mt-2 text-slate-400">
            {stats.suppressed > 0 ? `+ ${stats.suppressed} Suppressed` : 'No suppressed listings'}
          </div>
        </div>
      </div>

      {/* Mini Chart */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex items-center justify-center md:col-span-1 min-h-[160px]">
        <ResponsiveContainer width="100%" height={140}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={35}
              outerRadius={55}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={20} iconSize={8} wrapperStyle={{ fontSize: '10px' }}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Summary;