import React from 'react';
import { cn } from '@/lib/utils';

interface FilterChipsProps {
  options: string[];
  selectedOption: string;
  onSelect: (option: string) => void;
  className?: string;
}

export function FilterChips({
  options,
  selectedOption,
  onSelect,
  className
}: FilterChipsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((option) => {
        const isSelected = selectedOption === option;
        return (
          <button
            key={option}
            onClick={() => onSelect(option)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
              isSelected 
                ? "bg-blue-50 text-blue-600 border border-blue-200 shadow-sm" 
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
