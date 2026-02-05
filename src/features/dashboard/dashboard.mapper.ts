import {
  Users,
  Calendar,
  AlertCircle,
  Activity,
} from 'lucide-react';
import { DashboardStat, ChartDataInput, Appointment } from './dashboard.types';

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

const formatFirestoreDate = (value: any) => {
  if (!value) return "-";

  if (typeof value === "number") {
    const d = new Date(value);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
  }

  if (typeof value === "object" && value.seconds) {
    return new Date(value.seconds * 1000).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  if (typeof value === "string") {
    const cleaned = value.replace(" at ", " ").replace(/ UTC\+\d+/, "");
    const d = new Date(cleaned);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
  }

  return "-";
};

export function mapRecentAppointments(appointments: any[], users: any[], facilities: any[] = []): Appointment[] {
  const userMap = new Map(users.map((u: any) => [u.id, u]));
  const facilityMap = new Map(facilities.map((f: any) => [f.id, f]));

  return appointments
    .sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
    })
    .slice(0, 5)
    .map((appt) => {
      const user = userMap.get(appt.userId) || {};
      const facility = facilityMap.get(appt.facilityId) || {};
      
      return {
        id: appt.id,
        name: user.name || 'Unknown Patient',
        phone: user.profile?.phone || '-',
        date: formatFirestoreDate(appt.date || appt.createdAt),
        time: appt.time || '-',
        location: appt.facilityName || facility.name || '-',
        type: 'IVA Test', // Hardcoded as per AppointmentManagement logic for now, or fetch if available
        notes: appt.notes || '',
        status: (appt.status || 'pending').toLowerCase() as any,
      };
    });
}

type RiskDistribution = {
  level: 'Rendah' | 'Sedang' | 'Tinggi';
  count: number;
};

export function mapRiskDistribution(
  input: readonly RiskDistribution[]
): ChartDataInput[] {
  return input.map(item => ({
    name: `Risiko ${item.level}`,
    value: item.count,
  }));
}
