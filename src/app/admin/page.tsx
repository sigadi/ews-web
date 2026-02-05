"use client";

import { useEffect, useState } from "react";
import DashboardHomeUI from "@/components/admin/DashboardHome";
import { getDashboardData } from "@/features/dashboard/dashboard.service";
import { mapStats, mapRiskDistribution, mapRecentAppointments } from "@/features/dashboard/dashboard.mapper";
import { Appointment } from "@/features/dashboard/dashboard.types";

export default function AdminPage() {
  const [stats, setStats] = useState<any[]>([]);
  const [riskDistribution, setRiskDistribution] = useState<any[]>([]);
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const riskFromFirestore = [
      { level: "Rendah", count: 780 },
      { level: "Sedang", count: 431 },
      { level: "Tinggi", count: 23 },
    ] as const;

    setRiskDistribution(mapRiskDistribution(riskFromFirestore));

    (async () => {
      try {
        const rawData = await getDashboardData();
        setStats(mapStats(rawData));
        setRecentAppointments(mapRecentAppointments(rawData.appointments, rawData.users, rawData.facilities));
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
      monthlyData={[]}
      riskDistribution={riskDistribution}
      recentAppointments={recentAppointments}
    />
  );
}
