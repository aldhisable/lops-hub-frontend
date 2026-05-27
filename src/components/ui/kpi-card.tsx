import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlassCard } from './glass-card';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
  className?: string;
  sparklineData?: number[]; // Simple array of numbers for a small sparkline chart
  iconColorClass?: string;
  iconBgClass?: string;
}

export function KPICard({
  title,
  value,
  icon: Icon,
  trend,
  className,
  sparklineData,
  iconColorClass = 'text-blue-500',
  iconBgClass = 'bg-blue-50',
}: KPICardProps) {
  // A very simple SVG sparkline implementation if data is provided
  const renderSparkline = () => {
    if (!sparklineData || sparklineData.length === 0) return null;
    
    const min = Math.min(...sparklineData);
    const max = Math.max(...sparklineData);
    const range = max - min || 1;
    
    const width = 100;
    const height = 30;
    
    // Normalize data to fit in SVG
    const points = sparklineData.map((val, i) => {
      const x = (i / (sparklineData.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    const isPositiveTrend = trend?.isPositive !== false;
    const strokeColor = isPositiveTrend ? '#10B981' : '#EF4444'; // Emerald or Red

    return (
      <div className="mt-4 w-full h-[30px]">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible preserve-3d">
          <polyline
            fill="none"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
        </svg>
      </div>
    );
  };

  return (
    <GlassCard className={cn('p-5 flex flex-col justify-between hover:shadow-[0_12px_40px_-10px_rgba(0,0,0,0.08)] transition-all duration-300', className)}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className={cn("p-2 rounded-full", iconBgClass)}>
              <Icon className={cn("w-5 h-5", iconColorClass)} />
            </div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
          </div>
          <h3 className="text-4xl font-black text-slate-900 mt-2 tracking-tight">{value}</h3>
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center mt-2 text-xs">
          <span
            className={cn(
              "font-semibold flex items-center",
              trend.isPositive ? "text-emerald-500" : "text-red-500"
            )}
          >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-slate-400 ml-2">{trend.label}</span>
        </div>
      )}

      {renderSparkline()}
    </GlassCard>
  );
}
