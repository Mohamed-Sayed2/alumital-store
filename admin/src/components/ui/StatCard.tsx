import React from 'react';
import { Mail, Folder, Layers, Box, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { StatMetric } from '../../types';

interface StatCardProps {
  metric: StatMetric;
}

export const StatCard: React.FC<StatCardProps> = ({ metric }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Mail':
        return <Mail className="w-5 h-5 text-sky-600" />;
      case 'Folder':
        return <Folder className="w-5 h-5 text-sky-600" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-sky-600" />;
      case 'Box':
      default:
        return <Box className="w-5 h-5 text-sky-600" />;
    }
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center border border-sky-100">
          {getIcon(metric.icon)}
        </div>
        <span className="text-xs font-semibold text-slate-500">{metric.title}</span>
      </div>

      <div className="flex items-baseline justify-between">
        <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {metric.value}
        </span>
        <div
          className={`inline-flex items-center gap-0.5 text-xs font-bold ${
            metric.isPositive ? 'text-emerald-600' : 'text-rose-600'
          }`}
        >
          <span>{metric.change}</span>
          {metric.isPositive ? (
            <ArrowUpRight className="w-3.5 h-3.5" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5" />
          )}
        </div>
      </div>
    </div>
  );
};
