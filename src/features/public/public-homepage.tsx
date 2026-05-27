"use client";

import React from 'react';
import { PublicLayout } from '@/components/layout/public-layout';
import { KPICard } from '@/components/ui/kpi-card';
import { AnalyticsChart } from '@/components/ui/analytics-chart';
import { GlassCard } from '@/components/ui/glass-card';
import { Users, TrendingUp, Award, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

// Dummy data as requested
const dummyRevenueData = [
  { month: 'Jan 2025', revenue: 1.2 },
  { month: 'Feb 2025', revenue: 1.5 },
  { month: 'Mar 2025', revenue: 1.8 },
  { month: 'Apr 2025', revenue: 2.1 },
  { month: 'Mei 2025', revenue: 2.45 },
];

export function PublicHomepage() {
  return (
    <PublicLayout>
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-purple-400/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-cyan-400/20 blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 flex flex-col gap-16">
        
        {/* HERO SECTION */}
        <section className="flex flex-col items-center text-center mt-10 md:mt-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-medium text-sm mb-6 border border-blue-100"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            Monitoring Ekosistem UMKM Nasional
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight max-w-4xl leading-tight"
          >
            Mendorong Pertumbuhan <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">UMKM Nusantara</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-xl text-slate-500 max-w-2xl"
          >
            Platform intelijen terpadu untuk monitoring, evaluasi, dan akselerasi UMKM binaan Pelindo di seluruh Indonesia.
          </motion.p>
        </section>

        {/* KPI COUNTERS */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
          <KPICard 
            title="Total UMKM Binaan" 
            value="1.284" 
            icon={Users}
            iconBgClass="bg-blue-100"
            iconColorClass="text-blue-600"
            trend={{ value: 18.2, isPositive: true, label: "vs Apr 2025" }}
            sparklineData={[10, 15, 12, 18, 25, 30, 35]}
          />
          <KPICard 
            title="Total Omzet (Penjualan)" 
            value="Rp 2,45 T" 
            icon={TrendingUp}
            iconBgClass="bg-purple-100"
            iconColorClass="text-purple-600"
            trend={{ value: 24.6, isPositive: true, label: "vs Apr 2025" }}
            sparklineData={[20, 22, 28, 35, 42, 50, 60]}
          />
          <KPICard 
            title="Rata-rata Growth" 
            value="23,8%" 
            icon={TrendingUp}
            iconBgClass="bg-emerald-100"
            iconColorClass="text-emerald-600"
            trend={{ value: 6.1, isPositive: true, label: "vs Apr 2025" }}
            sparklineData={[10, 12, 15, 16, 18, 20, 24]}
          />
          <KPICard 
            title="UMKM Naik Kelas" 
            value="186" 
            icon={Award}
            iconBgClass="bg-amber-100"
            iconColorClass="text-amber-600"
            trend={{ value: 15.3, isPositive: true, label: "vs Apr 2025" }}
            sparklineData={[5, 8, 12, 15, 18, 25, 30]}
          />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* MAP PLACEHOLDER SECTION (2/3 width) */}
          <section className="lg:col-span-2 flex flex-col" id="statistik">
            <GlassCard className="p-6 flex-1 flex flex-col min-h-[500px] relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Peta Sebaran UMKM</h3>
                  <p className="text-sm text-slate-500">Visualisasi sebaran UMKM binaan di seluruh Indonesia</p>
                </div>
              </div>
              
              {/* Dummy Map Illustration */}
              <div className="flex-1 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 opacity-20" style={{
                   backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                 }}></div>
                 <div className="text-center relative z-10">
                    <MapPin className="w-12 h-12 text-blue-500 mx-auto mb-3 opacity-50" />
                    <p className="text-slate-500 font-medium">Google Maps Integration<br/>(Akan diimplementasi di Dashboard)</p>
                 </div>
              </div>
            </GlassCard>
          </section>

          {/* PIPELINE & ANALYTICS (1/3 width) */}
          <section className="flex flex-col gap-6">
            {/* Pipeline Dummy */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Pipeline Program</h3>
              <div className="flex flex-col gap-2">
                <div className="w-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white text-center relative shadow-lg shadow-blue-500/20">
                   <div className="text-sm font-medium opacity-80">Maritimepreneur</div>
                   <div className="text-3xl font-bold mt-1">642</div>
                </div>
                <div className="w-[80%] mx-auto bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white text-center relative shadow-lg shadow-purple-500/20">
                   <div className="text-sm font-medium opacity-80">UMK Akselerator</div>
                   <div className="text-2xl font-bold mt-1">214</div>
                </div>
                <div className="w-[60%] mx-auto bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg p-4 text-white text-center relative shadow-lg shadow-amber-500/20">
                   <div className="text-sm font-medium opacity-80">Gedor Ekspor</div>
                   <div className="text-xl font-bold mt-1">57</div>
                </div>
              </div>
            </GlassCard>

            {/* Revenue Dummy Chart */}
            <AnalyticsChart 
              title="Tren Omzet (Penjualan)" 
              subtitle="Total omzet UMKM (dalam Triliun Rupiah)"
              data={dummyRevenueData}
              dataKey="revenue"
              xAxisKey="month"
              height={220}
              color="#3b82f6"
              valueFormatter={(val) => `Rp ${val} T`}
              className="flex-1"
            />
          </section>
        </div>
      </div>
    </PublicLayout>
  );
}
