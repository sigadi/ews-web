"use client";

import { useState, useEffect } from "react";
import { Search, UserPlus, Edit, Trash2, Eye } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  registeredDate: string;
  riskLevel: "HIGH_RISK" | "MEDIUM_RISK" | "LOW_RISK";
  lastCheckup: string;
  status: "active" | "inactive";
}

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const formatFirestoreDate = (value: any) => {
    if (!value) return "-";

    // number epoch ms
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

    // Firestore Timestamp
    if (typeof value === "object" && value.seconds) {
      return new Date(value.seconds * 1000).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }

    // ISO string
    if (typeof value === "string" && !value.includes(" at ")) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }
    }

    // "January 24, 2026 at 1:25:26 PM UTC+7"
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snap = await getDocs(collection(db, "users"));

        const data: User[] = snap.docs.map((doc) => {
          const d = doc.data() as any;

          const rawRisk = d.riskLabel;

          const riskLevel: User["riskLevel"] =
            rawRisk === "HIGH_RISK" ||
            rawRisk === "MEDIUM_RISK" ||
            rawRisk === "LOW_RISK"
              ? rawRisk
              : "MEDIUM_RISK";

          return {
            id: doc.id,
            name: d.name || "-",
            email: d.email || "-",
            phone: d.profile?.phone || "-",
            registeredDate: formatFirestoreDate(d.createdAt),
            lastCheckup: formatFirestoreDate(d.lastScreeningAt),
            riskLevel,
            status: d.onboardingCompleted ? "active" : "inactive",
          };
        });

        setUsers(data);
      } catch (err) {
        console.error("Gagal ambil user dari Firestore", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedFilter]);

  if (loading) {
    return <div className="p-8">Loading users...</div>;
  }

  const getRiskLevelStyle = (level: User["riskLevel"]) => {
    switch (level) {
      case "HIGH_RISK":
        return "bg-red-100 text-red-700";
      case "MEDIUM_RISK":
        return "bg-yellow-100 text-yellow-700";
      case "LOW_RISK":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getRiskLevelLabel = (level: User["riskLevel"]) => {
    switch (level) {
      case "HIGH_RISK":
        return "Tinggi";
      case "MEDIUM_RISK":
        return "Sedang";
      case "LOW_RISK":
        return "Rendah";
      default:
        return level;
    }
  };

  const getStatusStyle = (status: User["status"]) => {
    return status === "active"
      ? "bg-green-100 text-green-700"
      : "bg-gray-100 text-gray-700";
  };

  const getStatusLabel = (status: User["status"]) => {
    return status === "active" ? "Aktif" : "Tidak Aktif";
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();

    const matchSearch =
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.toLowerCase().includes(q);

    let matchFilter = true;

    if (selectedFilter === "active") {
      matchFilter = u.status === "active";
    }

    if (selectedFilter === "inactive") {
      matchFilter = u.status === "inactive";
    }

    if (selectedFilter === "high-risk") {
      matchFilter = u.riskLevel === "HIGH_RISK";
    }

    return matchSearch && matchFilter;
  });

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Manajemen User</h1>
        <p className="text-gray-600">
          Kelola data pengguna aplikasi EWS CaServ
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, email, atau nomor telepon..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter */}
          <div className="flex gap-3">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">Semua User</option>
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
              <option value="high-risk">Risiko Tinggi</option>
            </select>

            <button className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              <span className="hidden sm:inline">Tambah User</span>
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-gray-700">Nama</th>
                <th className="px-6 py-4 text-left text-gray-700">Kontak</th>
                <th className="px-6 py-4 text-left text-gray-700">
                  Tgl. Registrasi
                </th>
                <th className="px-6 py-4 text-left text-gray-700">
                  Tingkat Risiko
                </th>
                <th className="px-6 py-4 text-left text-gray-700">
                  Pemeriksaan Terakhir
                </th>
                <th className="px-6 py-4 text-left text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-gray-900">{user.name}</p>
                      <p className="text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.phone}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {user.registeredDate}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getRiskLevelStyle(
                        user.riskLevel
                      )}`}
                    >
                      {getRiskLevelLabel(user.riskLevel)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {user.lastCheckup}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(
                        user.status
                      )}`}
                    >
                      {getStatusLabel(user.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {paginatedUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Data tidak ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-gray-600">
            Menampilkan {startIndex + 1}-
            {Math.min(endIndex, filteredUsers.length)} dari{" "}
            {filteredUsers.length} pengguna
          </p>

          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Sebelumnya
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === page
                      ? "bg-teal-600 text-white"
                      : "border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
