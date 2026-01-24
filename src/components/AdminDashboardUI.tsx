// import {
//   Users,
//   Calendar,
//   FileText,
//   TrendingUp,
//   Download,
//   AlertCircle,
//   CheckCircle,
//   Clock,
//   BarChart3,
// } from "lucide-react";

// export function AdminDashboard() {
//   const stats = [
//     {
//       label: "Total Pengguna",
//       value: "1,234",
//       change: "+12%",
//       changeType: "positive",
//       icon: Users,
//       color: "bg-primary-100 text-primary-600",
//     },
//     {
//       label: "Jadwal Hari Ini",
//       value: "45",
//       change: "+5",
//       changeType: "positive",
//       icon: Calendar,
//       color: "bg-accent-100 text-accent-600",
//     },
//     {
//       label: "Skrining Bulan Ini",
//       value: "287",
//       change: "+18%",
//       changeType: "positive",
//       icon: FileText,
//       color: "bg-success-100 text-success-600",
//     },
//     {
//       label: "Tingkat Deteksi Dini",
//       value: "94%",
//       change: "+2%",
//       changeType: "positive",
//       icon: TrendingUp,
//       color: "bg-warning-100 text-warning-600",
//     },
//   ];

//   const recentSchedules = [
//     {
//       id: "1",
//       name: "Siti Rahayu",
//       facility: "RS Umum Daerah Kota",
//       date: "15 Des 2024",
//       time: "09:00",
//       status: "confirmed",
//     },
//     {
//       id: "2",
//       name: "Dewi Lestari",
//       facility: "Puskesmas Menteng",
//       date: "15 Des 2024",
//       time: "10:00",
//       status: "confirmed",
//     },
//     {
//       id: "3",
//       name: "Ani Wijaya",
//       facility: "Klinik Pratama Sehat",
//       date: "15 Des 2024",
//       time: "11:00",
//       status: "pending",
//     },
//   ];

//   const riskDistribution = [
//     { level: "Rendah", count: 892, percentage: 72, color: "bg-success-500" },
//     { level: "Sedang", count: 287, percentage: 23, color: "bg-warning-500" },
//     { level: "Tinggi", count: 55, percentage: 5, color: "bg-red-500" },
//   ];

//   return (
//     <div className="flex-1 flex flex-col bg-gray-50 overflow-y-auto">
//       {/* Header */}
//       <div className="bg-gradient-to-br from-primary-600 to-primary-700 px-6 pt-8 pb-12 rounded-b-3xl">
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h2 className="text-white mb-1">Dashboard Admin</h2>
//             <p className="text-primary-100 text-sm">
//               Monitoring & Statistik
//             </p>
//           </div>
//           <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-white/30 transition-colors">
//             <Download className="w-4 h-4" />
//             Ekspor
//           </button>
//         </div>
//       </div>

//       <div className="px-6 -mt-8 pb-6">
//         {/* Stats Grid */}
//         <div className="grid grid-cols-2 gap-3 mb-6">
//           {stats.map((stat, index) => {
//             const Icon = stat.icon;
//             return (
//               <div
//                 key={index}
//                 className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
//               >
//                 <div className="flex items-center justify-between mb-3">
//                   <div
//                     className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}
//                   >
//                     <Icon className="w-5 h-5" />
//                   </div>
//                   <span
//                     className={`text-xs px-2 py-1 rounded ${
//                       stat.changeType === "positive"
//                         ? "bg-success-50 text-success-600"
//                         : "bg-red-50 text-red-600"
//                     }`}
//                   >
//                     {stat.change}
//                   </span>
//                 </div>
//                 <p className="text-2xl text-gray-900 mb-1">{stat.value}</p>
//                 <p className="text-xs text-gray-600">{stat.label}</p>
//               </div>
//             );
//           })}
//         </div>

//         {/* Risk Distribution */}
//         <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-gray-100">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-gray-900">Distribusi Risiko</h3>
//             <BarChart3 className="w-5 h-5 text-gray-400" />
//           </div>
//           <div className="space-y-3">
//             {riskDistribution.map((risk, index) => (
//               <div key={index}>
//                 <div className="flex items-center justify-between mb-1">
//                   <span className="text-sm text-gray-700">{risk.level}</span>
//                   <span className="text-sm text-gray-900">
//                     {risk.count} ({risk.percentage}%)
//                   </span>
//                 </div>
//                 <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
//                   <div
//                     className={`h-full ${risk.color} rounded-full transition-all`}
//                     style={{ width: `${risk.percentage}%` }}
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Recent Schedules */}
//         <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-gray-100">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-gray-900">Jadwal Hari Ini</h3>
//             <button className="text-primary-600 text-sm">Lihat Semua</button>
//           </div>
//           <div className="space-y-3">
//             {recentSchedules.map((schedule) => (
//               <div
//                 key={schedule.id}
//                 className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
//               >
//                 <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
//                   <span className="text-sm text-primary-600">
//                     {schedule.name.charAt(0)}
//                   </span>
//                 </div>
//                 <div className="flex-1">
//                   <h4 className="text-sm text-gray-900 mb-0.5">
//                     {schedule.name}
//                   </h4>
//                   <p className="text-xs text-gray-600">
//                     {schedule.facility}
//                   </p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-xs text-gray-900">{schedule.time}</p>
//                   <span
//                     className={`text-xs px-2 py-0.5 rounded ${
//                       schedule.status === "confirmed"
//                         ? "bg-success-50 text-success-600"
//                         : "bg-warning-50 text-warning-600"
//                     }`}
//                   >
//                     {schedule.status === "confirmed" ? "Konfirmasi" : "Pending"}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="grid grid-cols-2 gap-3">
//           <button className="bg-primary-600 text-white p-4 rounded-2xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
//             <Users className="w-5 h-5" />
//             <span className="text-sm">Kelola Pengguna</span>
//           </button>
//           <button className="bg-white border-2 border-primary-600 text-primary-600 p-4 rounded-2xl hover:bg-primary-50 transition-colors flex items-center justify-center gap-2">
//             <FileText className="w-5 h-5" />
//             <span className="text-sm">Kelola Konten</span>
//           </button>
//           <button className="bg-white border-2 border-gray-300 text-gray-700 p-4 rounded-2xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
//             <Calendar className="w-5 h-5" />
//             <span className="text-sm">Kelola Jadwal</span>
//           </button>
//           <button className="bg-white border-2 border-gray-300 text-gray-700 p-4 rounded-2xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
//             <Download className="w-5 h-5" />
//             <span className="text-sm">Laporan</span>
//           </button>
//         </div>

//         {/* System Alerts */}
//         <div className="mt-6 space-y-3">
//           <div className="bg-warning-50 rounded-2xl p-4 border border-warning-100">
//             <div className="flex items-start gap-3">
//               <AlertCircle className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" />
//               <div>
//                 <h4 className="text-warning-900 text-sm mb-1">
//                   Reminder Belum Terkirim
//                 </h4>
//                 <p className="text-warning-800 text-xs">
//                   15 reminder untuk jadwal besok perlu dikirim
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import {
  Users,
  Calendar,
  FileText,
  TrendingUp,
  Download,
  AlertCircle,
  BarChart3,
} from "lucide-react";

export interface DashboardStat {
  label: string;
  value: number | string;
  change?: string;
  changeType?: "positive" | "negative";
  icon: any;
  color: string;
}

export interface RecentSchedule {
  id: string;
  name: string;
  facility: string;
  time: string;
  status: "confirmed" | "pending";
}

export interface RiskDistribution {
  level: string;
  count: number;
  percentage: number;
  color: string;
}

interface AdminDashboardUIProps {
  stats: DashboardStat[];
  recentSchedules: RecentSchedule[];
  riskDistribution: RiskDistribution[];
}

export function AdminDashboardUI({
  stats,
  recentSchedules,
  riskDistribution,
}: AdminDashboardUIProps) {
  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 px-6 pt-8 pb-12 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white mb-1">Dashboard Admin</h2>
            <p className="text-primary-100 text-sm">
              Monitoring & Statistik
            </p>
          </div>
          <button className="bg-white/20 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-white/30">
            <Download className="w-4 h-4" />
            Ekspor
          </button>
        </div>
      </div>

      <div className="px-6 -mt-8 pb-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-4 shadow-sm border"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {stat.change && (
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        stat.changeType === "positive"
                          ? "bg-success-50 text-success-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                  )}
                </div>

                <p className="text-2xl text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Risk Distribution */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3>Distribusi Risiko</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>

          {riskDistribution.map((risk, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>{risk.level}</span>
                <span>
                  {risk.count} ({risk.percentage}%)
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div
                  className={`h-full ${risk.color} rounded-full`}
                  style={{ width: `${risk.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Recent Schedules */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border">
          <h3 className="mb-4">Jadwal Hari Ini</h3>

          {recentSchedules.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-2"
            >
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-sm text-primary-600">
                  {(s.name?.charAt(0) ?? "?")}
                </span>
              </div>

              <div className="flex-1">
                <p className="text-sm">{s.name}</p>
                <p className="text-xs text-gray-500">{s.facility}</p>
              </div>

              <div className="text-right">
                <p className="text-xs">{s.time}</p>
                <span
                  className={`text-xs px-2 rounded ${
                    s.status === "confirmed"
                      ? "bg-success-50 text-success-600"
                      : "bg-warning-50 text-warning-600"
                  }`}
                >
                  {s.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Alert */}
        <div className="mt-6 bg-warning-50 border rounded-2xl p-4 flex gap-3">
          <AlertCircle className="text-warning-600" />
          <div>
            <p className="text-sm font-medium">
              Reminder Belum Terkirim
            </p>
            <p className="text-xs">
              Beberapa jadwal besok belum mendapat notifikasi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
