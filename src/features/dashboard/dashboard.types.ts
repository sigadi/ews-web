import { LucideIcon } from 'lucide-react';

export interface DashboardStat {
  label: string;
  value: string;
  change?: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
  color: string;
}

export interface MonthlyData {
  month: string;
  pemeriksaan: number;
  risikoTinggi: number;
}

export interface RiskDistribution {
  name: string;
  value: number;
  color: string;
}

export interface Appointment {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  location: string;
  type: string;
  notes: string;
  status: 'scheduled' | 'confirmed' | 'pending' | 'completed' | 'cancelled';
}


export type ChartDataInput = {
  name: string;
  value: number;
  color?: string;
};
