"use client";

import { useState } from "react";
import { Users, Calendar, AlertCircle, TrendingUp, Activity, Clock, CheckCircle, XCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import {
  DashboardStat,
  MonthlyData,
  RiskDistribution,
  ChartDataInput,
  Appointment,
} from '@/features/dashboard/dashboard.types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
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
      case 'completed':
        return 'Selesai';
      case 'cancelled':
        return 'Dibatalkan';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-3 h-3" />;
      case "cancelled":
        return <XCircle className="w-3 h-3" />;
      case "completed":
        return <CheckCircle className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const docRef = doc(db, "schedules", id);
      await updateDoc(docRef, {
        status: newStatus,
      });
      // Optionally update local state or trigger a refresh
      // For now, we rely on page refresh or next fetch, but we can close the dialog
      setIsDetailOpen(false);
      // Force reload to see changes
      window.location.reload();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Gagal mengupdate status");
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
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend />
              <Line type="monotone" dataKey="pemeriksaan" stroke="#0D9488" strokeWidth={2} dot={{ fill: '#0D9488' }} name="Pemeriksaan" />
              <Line type="monotone" dataKey="risikoTinggi" stroke="#EF4444" strokeWidth={2} dot={{ fill: '#EF4444' }} name="Risiko Tinggi" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Distribution Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-gray-900 mb-6">Distribusi Risiko</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || ['#10b981', '#f59e0b', '#ef4444'][index % 3]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
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
                    <button 
                      className="text-teal-600 hover:text-teal-700"
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setIsDetailOpen(true);
                      }}
                    >
                      Lihat Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="bg-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detail Jadwal</DialogTitle>
            <DialogDescription>
              Informasi lengkap mengenai jadwal skrining.
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Pasien</p>
                  <p className="font-medium text-gray-900">
                    {selectedAppointment.name}
                  </p>
                  <p className="text-gray-600">{selectedAppointment.phone}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Status</p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs inline-flex items-center gap-1 ${getStatusStyle(
                      selectedAppointment.status
                    )}`}
                  >
                    {getStatusIcon(selectedAppointment.status)}
                    {getStatusLabel(selectedAppointment.status)}
                  </span>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Tanggal & Waktu</p>
                  <p className="font-medium text-gray-900">
                    {selectedAppointment.date}
                  </p>
                  <p className="text-gray-600">{selectedAppointment.time}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Lokasi</p>
                  <p className="font-medium text-gray-900">
                    {selectedAppointment.location}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500 mb-1">Jenis Pemeriksaan</p>
                  <p className="font-medium text-gray-900">
                    {selectedAppointment.type}
                  </p>
                </div>
                {selectedAppointment.notes && (
                  <div className="col-span-2">
                    <p className="text-gray-500 mb-1">Catatan</p>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      {selectedAppointment.notes}
                    </p>
                  </div>
                )}
              </div>

              {(selectedAppointment.status === "pending" ||
                selectedAppointment.status === "confirmed") && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => {
                      handleUpdateStatus(selectedAppointment.id, "CANCELLED");
                    }}
                  >
                    {selectedAppointment.status === "pending"
                      ? "Tolak"
                      : "Batalkan"}
                  </Button>

                  {selectedAppointment.status === "pending" && (
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => {
                        handleUpdateStatus(selectedAppointment.id, "CONFIRMED");
                      }}
                    >
                      Konfirmasi
                    </Button>
                  )}

                  {selectedAppointment.status === "confirmed" && (
                    <Button
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => {
                        handleUpdateStatus(selectedAppointment.id, "COMPLETED");
                      }}
                    >
                      Selesai
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
