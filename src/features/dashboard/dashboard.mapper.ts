import {
  Users,
  Calendar,
  AlertCircle,
  Activity,
} from 'lucide-react';
import { DashboardStat, ChartDataInput } from './dashboard.types';

export function mapStats(data: any): DashboardStat[] {
  return [
    {
      label: 'Total Pengguna',
      value: data.totalUsers.toString(),
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      label: 'Jadwal Skrining',
      value: data.appointments.length.toString(),
      trend: 'up',
      icon: Calendar,
      color: 'bg-teal-500',
    },
    {
      label: 'Kasus Risiko Tinggi',
      value: data.screenings.filter((s: any) => s.risk === 'high').length.toString(),
      trend: 'down',
      icon: AlertCircle,
      color: 'bg-red-500',
    },
    {
      label: 'Pemeriksaan Bulan Ini',
      value: data.screenings.length.toString(),
      trend: 'up',
      icon: Activity,
      color: 'bg-emerald-500',
    },
  ];
}


type RiskDistribution = {
  level: 'Rendah' | 'Sedang' | 'Tinggi';
  count: number;
};

// export function mapRiskDistribution(
//   data: RiskDistribution[]
// ): ChartDataInput[] {
//   return data.map(item => ({
//     name: `Risiko ${item.level}`,
//     value: item.count,
//     color:
//       item.level === 'Rendah'
//         ? '#10b981'
//         : item.level === 'Sedang'
//         ? '#f59e0b'
//         : '#ef4444',
//   }));
// }

export function mapRiskDistribution(
  input: readonly RiskDistribution[]
): ChartDataInput[] {
  return input.map(item => ({
    name: `Risiko ${item.level}`,
    value: item.count,
  }));
}
