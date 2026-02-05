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

  useEffect(() => {
    (async () => {
      try {
        const rawData = await getDashboardData();
        setStats(mapStats(rawData));
        setRecentAppointments(mapRecentAppointments(rawData.appointments, rawData.users, rawData.facilities));
        setMonthlyData(mapMonthlyData(rawData.screenings));
        setRiskDistribution(mapRiskDistribution(rawData.users));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div className="p-8">Loading dashboard...</div>;
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
