"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
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
  doc,
  updateDoc,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // State for Add Appointment
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [facilities, setFacilities] = useState<{ id: string; name: string }[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    patientId: "",
    facilityId: "",
    date: "",
    time: "",
    notes: "",
  });

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

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [scheduleSnap, userSnap, facilitySnap] = await Promise.all([
        getDocs(query(collection(db, "schedules"), orderBy("createdAt", "desc"))),
        getDocs(collection(db, "users")),
        getDocs(collection(db, "facilities")),
      ]);

      const usersMap = new Map<string, any>();
      const usersList: { id: string; name: string }[] = [];
      userSnap.docs.forEach((d) => {
        const data = d.data();
        usersMap.set(d.id, data);
        usersList.push({ id: d.id, name: data.name || "Unnamed User" });
      });
      setUsers(usersList);

      const facilitiesMap = new Map<string, any>();
      const facilitiesList: { id: string; name: string }[] = [];
      facilitySnap.docs.forEach((d) => {
        const data = d.data();
        facilitiesMap.set(d.id, data);
        facilitiesList.push({ id: d.id, name: data.name || "Unnamed Facility" });
      });
      setFacilities(facilitiesList);

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
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateAppointment = async () => {
    if (
      !newAppointment.patientId ||
      !newAppointment.facilityId ||
      !newAppointment.date ||
      !newAppointment.time
    ) {
      alert("Mohon lengkapi semua field wajib");
      return;
    }

    try {
      setLoading(true);
      const dateObj = new Date(newAppointment.date);
      
      const docData = {
        userId: newAppointment.patientId,
        facilityId: newAppointment.facilityId,
        date: Timestamp.fromDate(dateObj),
        time: newAppointment.time,
        notes: newAppointment.notes,
        status: "PENDING",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await addDoc(collection(db, "schedules"), docData);
      
      await fetchData(); // Reload data to show the new appointment
      setIsAddOpen(false);
      setNewAppointment({
        patientId: "",
        facilityId: "",
        date: "",
        time: "",
        notes: "",
      });
    } catch (error) {
      console.error("Error creating appointment:", error);
      alert("Gagal membuat jadwal");
    } finally {
      setLoading(false);
    }
  };

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

  const handleUpdateStatus = async (
    id: string,
    newStatus: "CONFIRMED" | "CANCELLED" | "COMPLETED"
  ) => {
    try {
      const docRef = doc(db, "schedules", id);
      await updateDoc(docRef, { status: newStatus });

      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
      
      // Update selected appointment if open in detail
      if (selectedAppointment && selectedAppointment.id === id) {
        setSelectedAppointment(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error) {
      console.error("Gagal update status:", error);
      alert("Gagal mengupdate status. Silakan coba lagi.");
    }
  };

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

  const getPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5; // Total max visible buttons (including first, last, current, ellipses)

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      // Always show first page
      items.push(1);

      // Determine start and end of the middle block
      let startPage = Math.max(2, page - 1);
      let endPage = Math.min(totalPages - 1, page + 1);

      // Adjust if we are near the beginning
      if (page <= 3) {
        endPage = 4;
      }

      // Adjust if we are near the end
      if (page >= totalPages - 2) {
        startPage = totalPages - 3;
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        items.push("...");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        items.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        items.push("...");
      }

      // Always show last page
      items.push(totalPages);
    }
    return items;
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

            <button
              onClick={() => setIsAddOpen(true)}
              className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors flex items-center gap-2"
            >
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
                      <button
                        onClick={() => handleUpdateStatus(a.id, "CONFIRMED")}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Konfirmasi
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(a.id, "CANCELLED")}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Tolak
                      </button>
                    </>
                  )}
                  {a.status === "CONFIRMED" && (
                    <button
                      onClick={() => handleUpdateStatus(a.id, "COMPLETED")}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Selesai
                    </button>
                  )}
                  {/* {a.status !== "CANCELLED" && (
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      Edit
                    </button>
                  )} */}
                  <button
                    onClick={() => {
                      setSelectedAppointment(a);
                      setIsDetailOpen(true);
                    }}
                    className="px-4 py-2 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition-colors"
                  >
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
      {filtered.length > 0 && (
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

            <div className="flex items-center gap-1">
              {getPaginationItems().map((p, i) =>
                typeof p === "number" ? (
                  <button
                    key={i}
                    onClick={() => setPage(p)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      page === p
                        ? "bg-teal-600 text-white"
                        : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    {p}
                  </button>
                ) : (
                  <span key={i} className="px-2 text-gray-400">
                    ...
                  </span>
                )
              )}
            </div>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="bg-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Buat Jadwal Baru</DialogTitle>
            <DialogDescription>
              Isi formulir untuk membuat jadwal skrining baru.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Pasien</Label>
              <Select
                value={newAppointment.patientId}
                onValueChange={(val: any) =>
                  setNewAppointment({ ...newAppointment, patientId: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Pasien" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Lokasi / Fasilitas</Label>
              <Select
                value={newAppointment.facilityId}
                onValueChange={(val: any) =>
                  setNewAppointment({ ...newAppointment, facilityId: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Fasilitas Kesehatan" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {facilities.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tanggal</Label>
                <Input
                  type="date"
                  value={newAppointment.date}
                  onChange={(e) =>
                    setNewAppointment({ ...newAppointment, date: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Waktu</Label>
                <Input
                  type="time"
                  value={newAppointment.time}
                  onChange={(e) =>
                    setNewAppointment({ ...newAppointment, time: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Catatan (Opsional)</Label>
              <Textarea
                placeholder="Tambahkan catatan jika perlu..."
                value={newAppointment.notes}
                onChange={(e) =>
                  setNewAppointment({ ...newAppointment, notes: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Batal
            </Button>
            <Button
              className="bg-teal-600 hover:bg-teal-700 text-white"
              onClick={handleCreateAppointment}
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan Jadwal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                    {selectedAppointment.patientName}
                  </p>
                  <p className="text-gray-600">{selectedAppointment.patientPhone}</p>
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
                    {selectedAppointment.dateLabel}
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

              {(selectedAppointment.status === "PENDING" ||
                selectedAppointment.status === "CONFIRMED") && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => {
                      handleUpdateStatus(selectedAppointment.id, "CANCELLED");
                      setIsDetailOpen(false);
                    }}
                  >
                    {selectedAppointment.status === "PENDING"
                      ? "Tolak"
                      : "Batalkan"}
                  </Button>

                  {selectedAppointment.status === "PENDING" && (
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => {
                        handleUpdateStatus(selectedAppointment.id, "CONFIRMED");
                        setIsDetailOpen(false);
                      }}
                    >
                      Konfirmasi
                    </Button>
                  )}

                  {selectedAppointment.status === "CONFIRMED" && (
                    <Button
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => {
                        handleUpdateStatus(selectedAppointment.id, "COMPLETED");
                        setIsDetailOpen(false);
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
