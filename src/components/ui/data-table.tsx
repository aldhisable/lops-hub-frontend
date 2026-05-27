import React from 'react';
import { cn } from '@/lib/utils';
import { GlassCard } from './glass-card';

interface Column {
  header: string;
  accessor: string;
  render?: (val: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  className?: string;
}

export function DataTable({ columns, data, className }: DataTableProps) {
  return (
    <GlassCard className={cn("overflow-hidden flex flex-col", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              {columns.map((col, idx) => (
                <th key={idx} className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-slate-50/50 transition-colors">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="py-4 px-6 text-sm text-slate-700 whitespace-nowrap">
                    {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="py-8 text-center text-sm text-slate-500">
                  Tidak ada data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Simple Pagination Placeholder */}
      <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 bg-slate-50/30">
        <div>Menampilkan {data.length} data</div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 rounded-md border border-slate-200 hover:bg-slate-100 disabled:opacity-50">Prev</button>
          <button className="px-3 py-1 rounded-md border border-slate-200 hover:bg-slate-100 disabled:opacity-50">Next</button>
        </div>
      </div>
    </GlassCard>
  );
}
