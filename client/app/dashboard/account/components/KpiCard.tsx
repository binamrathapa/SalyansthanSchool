"use client";
import { KpiCardProps } from '@/app/dashboard/types/finance.types';

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon, gradient, sub }) => (
  <div 
    className="rounded-[20px] p-5 text-white shadow-lg transition-all duration-150 hover:-translate-y-0.5 hover:shadow-xl cursor-default"
    style={{ background: gradient }}
  >
    <div className="flex justify-between items-start mb-3">
      <span className="text-xs font-medium opacity-90">{title}</span>
      <div className="bg-white/20 p-2 rounded-xl">
        {icon}
      </div>
    </div>
    <div className="text-2xl font-extrabold tracking-tight mb-1">{value}</div>
    {sub && <div className="text-xs opacity-80 flex items-center gap-1">{sub}</div>}
  </div>
);

export default KpiCard; 