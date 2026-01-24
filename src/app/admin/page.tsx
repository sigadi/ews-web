"use client";

import { useEffect, useState } from "react";
import DashboardHomeUI from "@/components/admin/DashboardHome";
import { getDashboardData } from "@/features/dashboard/dashboard.service";
import { mapStats, mapRiskDistribution } from "@/features/dashboard/dashboard.mapper";

export default function AdminPage() {
  const [stats, setStats] = useState<any[]>([]);
  const [riskDistribution, setRiskDistribution] = useState<any[]>([]);
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
      recentAppointments={[]}
    />
  );
}
