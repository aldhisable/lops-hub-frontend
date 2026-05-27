"use client";

import React from 'react';
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { GlassCard } from './glass-card';
import { cn } from '@/lib/utils';

interface RadarChartProps {
  title: string;
  data: any[];
  dataKey: string;
  angleKey: string;
  className?: string;
  color?: string;
  height?: number;
}

export function RadarChart({
  title,
  data,
  dataKey,
  angleKey,
  className,
  color = "#8b5cf6", // Default purple-500
  height = 300
}: RadarChartProps) {
  return (
    <GlassCard className={cn("p-6 flex flex-col items-center justify-center", className)}>
      <h3 className="font-semibold text-lg text-slate-900 mb-4 w-full text-left">{title}</h3>
      <div style={{ height, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey={angleKey} tick={{ fill: '#64748b', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name={title}
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              fill={color}
              fillOpacity={0.4}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                borderRadius: '12px',
                border: '1px solid #f1f5f9',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
            />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
