"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Calendar, TrendingUp, Users, FileText } from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Reports() {
  const [usersRaw, setUsersRaw] = useState<any[]>([]);
  const [screeningsRaw, setScreeningsRaw] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<string>(
    new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 10)
  );
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().slice(0, 10));

  const parseDate = (value: any): Date | null => {
    if (!value) return null;
    if (typeof value === "number") return new Date(value);
    if (typeof value === "object" && value.seconds) return new Date(value.seconds * 1000);
    if (typeof value === "string") {
      const cleaned = value.replace(" at ", " ").replace(/ UTC\+\d+/, "");
      const d = new Date(cleaned);
      return isNaN(d.getTime()) ? null : d;
    }
    return null;
  };

  const getAge = (birthDateStr?: string, explicitAge?: number): number => {
    if (explicitAge && explicitAge > 0) return explicitAge;
    if (!birthDateStr) return 0;
    const parts = birthDateStr.split("/");
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
      if (!isNaN(d.getTime())) {
        const today = new Date();
        let age = today.getFullYear() - d.getFullYear();
        const m = today.getMonth() - d.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
        return age;
      }
    }
    const d = new Date(birthDateStr);
    if (!isNaN(d.getTime())) {
      const today = new Date();
      let age = today.getFullYear() - d.getFullYear();
      const m = today.getMonth() - d.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
      return age;
    }
    return 0;
  };

  useEffect(() => {
    (async () => {
      const usersSnap = await getDocs(collection(db, "users"));
      const screeningsSnap = await getDocs(collection(db, "screenings"));

      const users = usersSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
      const screenings = screeningsSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
      setUsersRaw(users);
      setScreeningsRaw(screenings);
    })();
  }, []);

  const usersFiltered = useMemo(() => {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    return usersRaw.filter((u) => {
      const d = parseDate(u.createdAt);
      return d && d >= start && d <= end;
    });
  }, [usersRaw, startDate, endDate]);

  const screeningsFiltered = useMemo(() => {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    return screeningsRaw.filter((s) => {
      const d = parseDate(s.finishedAt);
      return d && d >= start && d <= end;
    });
  }, [screeningsRaw, startDate, endDate]);

  const summary = useMemo(() => {
    const totalUsers = usersFiltered.length;
    const totalScreenings = screeningsFiltered.length;
    const highRiskCases = screeningsFiltered.filter((s) => s.result === "HIGH_RISK").length;
    const detectionRate = totalScreenings > 0 ? (highRiskCases / totalScreenings) * 100 : 0;
    return { totalUsers, totalScreenings, highRiskCases, detectionRate };
  }, [usersFiltered, screeningsFiltered]);

  const riskLevels = useMemo(() => {
    const LOW_RISK = usersFiltered.filter((u) => u.riskLabel === "LOW_RISK").length;
    const MEDIUM_RISK = usersFiltered.filter((u) => u.riskLabel === "MEDIUM_RISK").length;
    const HIGH_RISK = usersFiltered.filter((u) => u.riskLabel === "HIGH_RISK").length;
    return [
      { name: "Rendah", value: LOW_RISK, color: "#10b981" },
      { name: "Sedang", value: MEDIUM_RISK, color: "#f59e0b" },
      { name: "Tinggi", value: HIGH_RISK, color: "#ef4444" },
    ];
  }, [usersFiltered]);

  const monthlyScreenings = useMemo(() => {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    const labels: string[] = [];
    const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
    const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);
    while (cursor <= endMonth) {
      labels.push(cursor.toLocaleString("id-ID", { month: "short" }) + " " + cursor.getFullYear());
      cursor.setMonth(cursor.getMonth() + 1);
    }
    const buckets: Record<string, { total: number; lowRisk: number; mediumRisk: number; highRisk: number }> = {};
    labels.forEach((l) => {
      buckets[l] = { total: 0, lowRisk: 0, mediumRisk: 0, highRisk: 0 };
    });
    screeningsFiltered.forEach((s) => {
      const date = parseDate(s.finishedAt);
      if (!date) return;
      const label = date.toLocaleString("id-ID", { month: "short" }) + " " + date.getFullYear();
      if (!buckets[label]) return;
      buckets[label].total += 1;
      if (s.result === "LOW_RISK") buckets[label].lowRisk += 1;
      else if (s.result === "MEDIUM_RISK") buckets[label].mediumRisk += 1;
      else if (s.result === "HIGH_RISK") buckets[label].highRisk += 1;
    });
    return labels.map((l) => ({ month: l, ...buckets[l] }));
  }, [screeningsFiltered, startDate, endDate]);

  const ageDistribution = useMemo(() => {
    const ranges = [
      { label: "20-25", min: 20, max: 25 },
      { label: "26-30", min: 26, max: 30 },
      { label: "31-35", min: 31, max: 35 },
      { label: "36-40", min: 36, max: 40 },
      { label: "41-45", min: 41, max: 45 },
      { label: "46-50", min: 46, max: 50 },
    ];
    const ageBuckets: Record<string, number> = {};
    ranges.forEach((r) => (ageBuckets[r.label] = 0));
    usersFiltered.forEach((u) => {
      const age = getAge(u.profile?.birthDate, u.profile?.age);
      ranges.forEach((r) => {
        if (age >= r.min && age <= r.max) ageBuckets[r.label] += 1;
      });
    });
    return ranges.map((r) => ({ range: r.label, count: ageBuckets[r.label] }));
  }, [usersFiltered]);

  const exportReport = () => {
    const esc = (v: any) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const lines: string[] = [];
    lines.push(`Periode,${esc(startDate)} s/d ${esc(endDate)}`);
    lines.push("");
    lines.push(["Ringkasan", "Total Pengguna", "Total Skrining", "Kasus Risiko Tinggi"].map(esc).join(","));
    lines.push(["", summary.totalUsers, summary.totalScreenings, summary.highRiskCases].map(esc).join(","));
    lines.push("");
    lines.push(["Distribusi Risiko", "Nama", "Jumlah"].map(esc).join(","));
    riskLevels.forEach((r) => {
      lines.push(["", r.name, r.value].map(esc).join(","));
    });
    lines.push("");
    lines.push(["Distribusi Usia", "Rentang", "Jumlah"].map(esc).join(","));
    ageDistribution.forEach((a) => {
      lines.push(["", a.range, a.count].map(esc).join(","));
    });
    lines.push("");
    lines.push(["Statistik Bulanan", "Bulan", "Total", "Low_Risk", "Medium_Risk", "High_Risk"].map(esc).join(","));
    monthlyScreenings.forEach((m) => {
      lines.push(["", m.month, m.total, m.lowRisk, m.mediumRisk, m.highRisk].map(esc).join(","));
    });
    const content = lines.join("\n");
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `laporan_${startDate}_sd_${endDate}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Laporan & Analitik</h1>
        <p className="text-gray-600">
          Analisis data dan statistik sistem EWS CaServ
        </p>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Calendar className="w-5 h-5 text-gray-600" />
            <div className="flex gap-3">
              <div>
                <label className="block text-gray-600 mb-1">Dari Tanggal</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">
                  Sampai Tanggal
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>
          <button onClick={exportReport} className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Laporan
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-gray-600 mb-1">Total Pengguna</p>
          <p className="text-gray-900 mb-1">{summary.totalUsers}</p>
          <p className="text-green-600">+12% dari bulan lalu</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-teal-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-gray-600 mb-1">Total Skrining</p>
          <p className="text-gray-900 mb-1">{summary.totalScreenings}</p>
          <p className="text-green-600">+8% dari bulan lalu</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-yellow-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-gray-600 mb-1">Kasus Risiko Tinggi</p>
          <p className="text-gray-900 mb-1">{summary.highRiskCases}</p>
          <p className="text-red-600">+3 dari bulan lalu</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        {/* Risk Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-gray-900 mb-6">Distribusi Tingkat Risiko</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskLevels}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {riskLevels.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Age Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-gray-900 mb-6">Distribusi Usia Pengguna</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ageDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#14b8a6" name="Jumlah Pengguna" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Statistics Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-gray-900">Statistik Detail per Bulan</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">Bulan</th>
                <th className="px-6 py-3 text-left text-gray-700">
                  Total Skrining
                </th>
                <th className="px-6 py-3 text-left text-gray-700">
                  Low Risk
                </th>
                <th className="px-6 py-3 text-left text-gray-700">
                  Medium Risk
                </th>
                <th className="px-6 py-3 text-left text-gray-700">
                  High Risk
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {monthlyScreenings.map((data) => {
                return (
                  <tr key={data.month} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900">{data.month}</td>
                    <td className="px-6 py-4 text-gray-600">{data.total}</td>
                    <td className="px-6 py-4 text-green-600">{data.lowRisk}</td>
                    <td className="px-6 py-4 text-yellow-600">
                      {data.mediumRisk}
                    </td>
                    <td className="px-6 py-4 text-red-600">
                      {data.highRisk}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
