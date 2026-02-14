"use client";

import { useEffect, useState } from "react";
import DashboardHomeUI from "@/components/admin/DashboardHome";
import { getDashboardData } from "@/features/dashboard/dashboard.service";
import { mapStats, mapRiskDistribution, mapRecentAppointments, mapMonthlyData } from "@/features/dashboard/dashboard.mapper";
import { Appointment, MonthlyData } from "@/features/dashboard/dashboard.types";

export default function AdminPage() {
  const [stats, setStats] = useState<any[]>([]);
  const [riskDistribution, setRiskDistribution] = useState<any[]>([]);
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setError(null);
        const rawData = await getDashboardData();
        setStats(mapStats(rawData));
        setRecentAppointments(mapRecentAppointments(rawData.appointments, rawData.users, rawData.facilities));
        setMonthlyData(mapMonthlyData(rawData.screenings));
        setRiskDistribution(mapRiskDistribution(rawData.users));
      } catch (err: any) {
        console.error("Dashboard error:", err);
        setError(err.message || "Gagal memuat data dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl inline-block">
          <p className="font-semibold">Terjadi kesalahan</p>
          <p className="text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <DashboardHomeUI
      stats={stats}
      monthlyData={monthlyData}
      riskDistribution={riskDistribution}
      recentAppointments={recentAppointments}
    />
  );
}
