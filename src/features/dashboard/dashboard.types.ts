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
  id: number;
  name: string;
  date: string;
  time: string;
  status: 'scheduled' | 'confirmed' | 'pending';
}


export type ChartDataInput = {
  name: string;
  value: number;
  color?: string;
};
