import React from 'react';
import { cn } from '@/lib/utils';

export interface TimelineItem {
  year: string;
  title: string;
  description?: string;
  isActive?: boolean;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn("relative border-l-2 border-slate-100 ml-4", className)}>
      {items.map((item, index) => (
        <div key={index} className="mb-8 ml-6 relative">
          <div 
            className={cn(
              "absolute -left-[31px] w-4 h-4 rounded-full border-2 bg-white",
              item.isActive 
                ? "border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                : "border-slate-300"
            )}
          />
          <div className="flex flex-col">
            <span className={cn(
              "text-sm font-semibold mb-1",
              item.isActive ? "text-blue-600" : "text-slate-400"
            )}>
              {item.year}
            </span>
            <h4 className="text-base font-medium text-slate-800">{item.title}</h4>
            {item.description && (
              <p className="text-sm text-slate-500 mt-1">{item.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
