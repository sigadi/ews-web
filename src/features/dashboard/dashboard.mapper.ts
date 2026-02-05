import {
  Users,
  Calendar,
  AlertCircle,
  Activity,
} from 'lucide-react';
import { DashboardStat, ChartDataInput, Appointment, MonthlyData } from './dashboard.types';

const parseDate = (value: any): Date | null => {
  if (!value) return null;
  if (typeof value === 'number') return new Date(value);
  if (typeof value === 'object' && value.seconds) return new Date(value.seconds * 1000);
  if (typeof value === 'string') {
    const cleaned = value.replace(" at ", " ").replace(/ UTC\+\d+/, "");
    const d = new Date(cleaned);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
};

export function mapStats(data: any): DashboardStat[] {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
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
      value: data.users.filter((u: any) => u.riskLabel === 'HIGH_RISK').length.toString(),
      trend: 'down',
      icon: AlertCircle,
      color: 'bg-red-500',
    },
    {
      label: 'Pemeriksaan Bulan Ini',
      value: data.screenings.filter((s: any) => {
        const date = parseDate(s.finishedAt || s.createdAt || s.date);
        return date && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      }).length.toString(),
      trend: 'up',
      icon: Activity,
      color: 'bg-emerald-500',
    },
  ];
}

export function mapMonthlyData(screenings: any[], months: number = 12): MonthlyData[] {
  const now = new Date();
  const buckets: { [key: string]: { pemeriksaan: number; risikoTinggi: number } } = {};
  const labels: string[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label =
      d.toLocaleString("id-ID", { month: "short" }) + " " + d.getFullYear();
    labels.push(label);
    buckets[label] = { pemeriksaan: 0, risikoTinggi: 0 };
  }

  screenings.forEach((s: any) => {
    const date = parseDate(s.finishedAt || s.createdAt || s.date);
    if (!date) return;
    const label =
      date.toLocaleString("id-ID", { month: "short" }) +
      " " +
      date.getFullYear();
    if (buckets[label]) {
      buckets[label].pemeriksaan += 1;
      if (s.result === "HIGH_RISK") {
        buckets[label].risikoTinggi += 1;
      }
    }
  });

  return labels.map((label) => ({
    month: label,
    pemeriksaan: buckets[label].pemeriksaan,
    risikoTinggi: buckets[label].risikoTinggi,
  }));
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

export function mapRiskDistribution(
  users: any[]
): ChartDataInput[] {
  const highRisk = users.filter((u) => u.riskLabel === 'HIGH_RISK').length;
  const mediumRisk = users.filter((u) => u.riskLabel === 'MEDIUM_RISK').length;
  const lowRisk = users.filter((u) => u.riskLabel === 'LOW_RISK').length;

  return [
    { name: 'Risiko Rendah', value: lowRisk, color: '#10b981' },
    { name: 'Risiko Sedang', value: mediumRisk, color: '#f59e0b' },
    { name: 'Risiko Tinggi', value: highRisk, color: '#ef4444' },
  ];
}
