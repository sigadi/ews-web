"use client";

import DashboardHomeUI from '@/components/admin/DashboardHome';
import { getDashboardData} from '@/features/dashboard/dashboard.service';
import { mapStats, mapRiskDistribution } from '@/features/dashboard/dashboard.mapper';



export default async function AdminPage() {

  // ⬇️ MOCK DATA (sementara, ganti Firestore nanti)
  const riskFromFirestore = [
    { level: 'Rendah', count: 780 },
    { level: 'Sedang', count: 431 },
    { level: 'Tinggi', count: 23 },
  ] as const;
   const riskChartData = mapRiskDistribution(riskFromFirestore);

  const rawData = await getDashboardData();
  const stats = mapStats(rawData);
 


  return (
    <DashboardHomeUI
      stats={stats}
      monthlyData={[]}
      riskDistribution={riskChartData}
      recentAppointments={[]}
      
    />
  );
}
