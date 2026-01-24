"use client";


import { Users, Calendar, AlertCircle, TrendingUp, Activity, Clock } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import {
  DashboardStat,
  MonthlyData,
  RiskDistribution,
  ChartDataInput,
  Appointment,
} from '@/features/dashboard/dashboard.types';

const ICON_MAP = {
  users: Users,
  calendar: Calendar,
  alert: AlertCircle,
  activity: Activity,
} as const;

interface Props {
  stats: DashboardStat[];
  monthlyData: MonthlyData[];
  riskDistribution: ChartDataInput[];
  recentAppointments: Appointment[];
}

export default function DashboardHome({
  stats,
  monthlyData,
  riskDistribution,
  recentAppointments,
}: Props) {


  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Dikonfirmasi';
      case 'scheduled':
        return 'Terjadwal';
      case 'pending':
        return 'Menunggu';
      default:
        return status;
    }
  };

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Selamat datang di Admin Panel EWS CaServ</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={`px-2 py-1 rounded-lg text-sm ${
                  stat.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-gray-600 mb-1">{stat.label}</p>
              <p className="text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-gray-900 mb-6">Tren Pemeriksaan Bulanan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="pemeriksaan" stroke="#14b8a6" strokeWidth={2} name="Pemeriksaan" />
              <Line type="monotone" dataKey="risikoTinggi" stroke="#ef4444" strokeWidth={2} name="Risiko Tinggi" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Distribution Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-gray-900 mb-6">Distribusi Tingkat Risiko</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={riskDistribution} dataKey="value" nameKey="name">

              {/* <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              > */}
                {riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Appointments Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-gray-900">Jadwal Skrining Terbaru</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">Nama Pasien</th>
                <th className="px-6 py-3 text-left text-gray-700">Tanggal</th>
                <th className="px-6 py-3 text-left text-gray-700">Waktu</th>
                <th className="px-6 py-3 text-left text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentAppointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900">{appointment.name}</td>
                  <td className="px-6 py-4 text-gray-600">{appointment.date}</td>
                  <td className="px-6 py-4 text-gray-600">{appointment.time}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(appointment.status)}`}>
                      {getStatusLabel(appointment.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-teal-600 hover:text-teal-700">
                      Lihat Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
