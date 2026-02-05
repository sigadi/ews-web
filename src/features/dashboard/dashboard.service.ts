// import { collection, getDocs, query, where } from "firebase/firestore";
// import { db } from "@/lib/firebase";
// import {
//   DashboardStat,
//   RecentSchedule,
//   RiskDistribution,
// } from "@/components/AdminDashboardUI";

// export async function getDashboardData(): Promise<{
//   stats: DashboardStat[];
//   recentSchedules: RecentSchedule[];
//   riskDistribution: RiskDistribution[];
// }> {
//   // ===== USERS =====
//   const usersSnap = await getDocs(collection(db, "users"));
//   const totalUsers = usersSnap.size;

//   // ===== SCHEDULES =====
//   const schedulesSnap = await getDocs(collection(db, "schedules"));

//   const recentSchedules: RecentSchedule[] = schedulesSnap.docs
//     .slice(0, 5)
//     .map((doc) => {
//       const d = doc.data();
//       return {
//         id: doc.id,
//         name: d.name,
//         facility: d.facility,
//         time: d.time,
//         status: d.status ?? "pending",
//       };
//     });

//   // ===== STATS (SIAP KE UI) =====
//   const stats: DashboardStat[] = [
//     {
//       label: "Total Pengguna",
//       value: totalUsers,
//       change: "+0%",
//       changeType: "positive",
//       icon: require("lucide-react").Users,
//       color: "bg-primary-100 text-primary-600",
//     },
//     {
//       label: "Jadwal Hari Ini",
//       value: schedulesSnap.size,
//       change: "+0",
//       changeType: "positive",
//       icon: require("lucide-react").Calendar,
//       color: "bg-accent-100 text-accent-600",
//     },
//   ];

//   // ===== RISK (DUMMY LOGIC, NANTI BISA REAL) =====
//   const riskDistribution: RiskDistribution[] = [
//     { level: "Rendah", count: 0, percentage: 0, color: "bg-success-500" },
//     { level: "Sedang", count: 0, percentage: 0, color: "bg-warning-500" },
//     { level: "Tinggi", count: 0, percentage: 0, color: "bg-red-500" },
//   ];

//   return {
//     stats,
//     recentSchedules,
//     riskDistribution,
//   };
// }

import { getDocs, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function getDashboardData() {
  const usersSnap = await getDocs(collection(db, 'users'));
  const appointmentsSnap = await getDocs(collection(db, 'schedules'));
  const screeningsSnap = await getDocs(collection(db, 'screenings'));
  const facilitiesSnap = await getDocs(collection(db, 'facilities'));

  return {
    users: usersSnap.docs.map(d => ({ id: d.id, ...d.data() })),
    totalUsers: usersSnap.size,
    appointments: appointmentsSnap.docs.map(d => ({ id: d.id, ...d.data() })),
    screenings: screeningsSnap.docs.map(d => d.data()),
    facilities: facilitiesSnap.docs.map(d => ({ id: d.id, ...d.data() })),
  };
}
