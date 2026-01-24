"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Search,
  Plus,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  dateISO: string; // buat filter
  dateLabel: string; // buat display
  time: string;
  location: string;
  type: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  notes?: string;
}

const PAGE_SIZE = 5;

export default function AppointmentManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);

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

  const toISODate = (value: any) => {
    if (!value) return "";

    if (typeof value === "number") {
      const d = new Date(value);
      return !isNaN(d.getTime()) ? d.toISOString().slice(0, 10) : "";
    }

    if (typeof value === "object" && value.seconds) {
      return new Date(value.seconds * 1000).toISOString().slice(0, 10);
    }

    if (typeof value === "string") {
      const cleaned = value.replace(" at ", " ").replace(/ UTC\+\d+/, "");
      const d = new Date(cleaned);
      return !isNaN(d.getTime()) ? d.toISOString().slice(0, 10) : "";
    }

    return "";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [scheduleSnap, userSnap, facilitySnap] = await Promise.all([
          getDocs(query(collection(db, "schedules"), orderBy("createdAt", "desc"))),
          getDocs(collection(db, "users")),
          getDocs(collection(db, "facilities")),
        ]);

        const usersMap = new Map<string, any>();
        userSnap.docs.forEach((d) => usersMap.set(d.id, d.data()));

        const facilitiesMap = new Map<string, any>();
        facilitySnap.docs.forEach((d) => facilitiesMap.set(d.id, d.data()));

        const rows: Appointment[] = scheduleSnap.docs.map((doc) => {
          const s = doc.data() as any;
          const user = usersMap.get(s.userId) || {};
          const facility = facilitiesMap.get(s.facilityId) || {};

          return {
            id: doc.id,
            patientName: user.name || "-",
            patientPhone: user.profile?.phone || "-",
            dateISO: toISODate(s.date || s.createdAt),
            dateLabel: formatFirestoreDate(s.date || s.createdAt),
            time: s.time || "-",
            location: s.facilityName || facility.name || "-",
            type: "IVA Test",
            status: (s.status || "PENDING").toUpperCase(),
            notes: s.notes || "",
          };
        });

        setAppointments(rows);
      } catch (err) {
        console.error("Gagal load schedules", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filtered = useMemo(() => {
    return appointments.filter((a) => {
      const q = searchQuery.toLowerCase();

      const matchSearch =
        a.patientName.toLowerCase().includes(q) ||
        a.patientPhone.toLowerCase().includes(q);

      const matchDate = selectedDate
        ? a.dateISO === selectedDate
        : true;

      const matchStatus =
        selectedStatus === "all"
          ? true
          : a.status.toLowerCase() === selectedStatus;

      return matchSearch && matchDate && matchStatus;
    });
  }, [appointments, searchQuery, selectedDate, selectedStatus]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedDate, selectedStatus]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-700";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      case "COMPLETED":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "Dikonfirmasi";
      case "PENDING":
        return "Menunggu";
      case "CANCELLED":
        return "Dibatalkan";
      case "COMPLETED":
        return "Selesai";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <CheckCircle className="w-4 h-4" />;
      case "PENDING":
        return <AlertCircle className="w-4 h-4" />;
      case "CANCELLED":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return <div className="p-8">Loading jadwal...</div>;
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Manajemen Jadwal Skrining</h1>
        <p className="text-gray-600">
          Kelola jadwal pemeriksaan dan appointment pasien
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama pasien atau nomor telepon..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">Semua Status</option>
              <option value="confirmed">Dikonfirmasi</option>
              <option value="pending">Menunggu</option>
              <option value="cancelled">Dibatalkan</option>
              <option value="completed">Selesai</option>
            </select>

            <button className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors flex items-center gap-2">
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Tambah Jadwal</span>
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="grid gap-4">
        {paged.map((a) => (
          <div
            key={a.id}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-teal-700">
                      {a.patientName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-1">
                      {a.patientName}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      {a.patientPhone}
                    </p>
                    <div className="flex flex-wrap gap-3 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{a.dateLabel}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{a.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{a.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:items-end gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {a.type}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${getStatusStyle(
                      a.status
                    )}`}
                  >
                    {getStatusIcon(a.status)}
                    {getStatusLabel(a.status)}
                  </span>
                </div>

                <div className="flex gap-2">
                  {a.status === "PENDING" && (
                    <>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Konfirmasi
                      </button>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Tolak
                      </button>
                    </>
                  )}
                  {a.status !== "CANCELLED" && (
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      Edit
                    </button>
                  )}
                  <button className="px-4 py-2 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition-colors">
                    Detail
                  </button>
                </div>
              </div>
            </div>

            {a.notes && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-gray-600">
                  <span className="font-medium">Catatan:</span>{" "}
                  {a.notes}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-gray-600">
          Menampilkan {(page - 1) * PAGE_SIZE + 1}-
          {Math.min(page * PAGE_SIZE, filtered.length)} dari{" "}
          {filtered.length} jadwal
        </p>
        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Sebelumnya
          </button>

          <button className="px-4 py-2 bg-teal-600 text-white rounded-lg">
            {page}
          </button>

          <button
            disabled={page === totalPages}
            onClick={() =>
              setPage((p) => Math.min(totalPages, p + 1))
            }
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </div>
  );
}
