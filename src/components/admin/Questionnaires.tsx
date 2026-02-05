"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Eye, Loader2 } from "lucide-react";
import { collection, getDocs, addDoc, updateDoc, doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

interface Question {
  id: string;
  title: string;
  description: string;
  duration: string;
  isActive: boolean;
}

export default function Questionnaires() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    durationSeconds: 0,
    isActive: true,
    type: "resiko",
    videoUrl: ""
  });
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingLoading, setEditingLoading] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchQuests = async () => {
      try {
        const snap = await getDocs(collection(db, "questionnaires"));

        const data: Question[] = snap.docs.map((doc) => {
          const d = doc.data() as any;

          return {
            id: doc.id,
            title: d.title || "-",
            description: d.description || "-",
            duration: d.durationSeconds || "-",
            isActive: !!d.isActive,
          };
        });

        setQuestions(data);
      } catch (err) {
        console.error("Gagal ambil questionnaires dari Firestore", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuests();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedFilter]);

  if (loading) {
    return <div className="p-8">Loading questionnaires...</div>;
  }

  const getStatusStyle = (status: boolean) => {
    return status ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700";
  };

  const getStatusLabel = (status: boolean) => {
    return status ? "Aktif" : "Tidak Aktif";
  };

  const filteredQuestions = questions.filter((qst) => {
    const q = searchQuery.toLowerCase();

    const matchSearch =
      qst.title.toLowerCase().includes(q) ||
      qst.description.toLowerCase().includes(q);

    let matchFilter = true;

    if (selectedFilter === "active") {
      matchFilter = qst.isActive === true;
    }

    if (selectedFilter === "inactive") {
      matchFilter = qst.isActive === false;
    }

    return matchSearch && matchFilter;
  });

  const totalPages = Math.ceil(filteredQuestions.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedQuestions = filteredQuestions.slice(startIndex, endIndex);

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Manajemen Kuesioner</h1>
        <p className="text-gray-600">
          Kelola data kuesioner aplikasi EWS CaServ
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
                placeholder="Cari nama..."
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
              <option value="all">Semua Kuesioner</option>
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
            </select>

            <button
              onClick={() => setIsAddOpen(true)}
              className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Tambah Kuesioner</span>
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
                <th className="px-6 py-4 text-left text-gray-700">Durasi</th>
                <th className="px-6 py-4 text-left text-gray-700">Deskripsi</th>
                <th className="px-6 py-4 text-left text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedQuestions.map((qst) => (
                <tr key={qst.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-gray-900">{qst.title}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{qst.duration}</td>
                  <td className="px-6 py-4 text-gray-600">{qst.description}</td>
                  <td className="px-6 py-4 w-40">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(qst.isActive)}`}
                    >
                      {getStatusLabel(qst.isActive)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/questionnaires/${qst.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={async () => {
                          setEditingId(qst.id);
                          setIsEditOpen(true);
                          setEditingLoading(true);
                          try {
                            const snap = await getDoc(doc(db, "questionnaires", qst.id));
                            const d = snap.data() as any;
                            setFormData({
                              title: d?.title || "",
                              description: d?.description || "",
                              durationSeconds: Number(d?.durationSeconds ?? 0),
                              isActive: !!d?.isActive,
                              type: d?.type || "resiko",
                              videoUrl: d?.videoUrl || ""
                            });
                          } finally {
                            setEditingLoading(false);
                          }
                        }}
                        className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteTarget({ id: qst.id, title: qst.title });
                          setIsDeleteOpen(true);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {paginatedQuestions.length === 0 && (
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
            {Math.min(endIndex, filteredQuestions.length)} dari{" "}
            {filteredQuestions.length} Questionnaire
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
      
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-150 bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Kuesioner</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setAdding(true);
              try {
                const ref = await addDoc(collection(db, "questionnaires"), {
                  title: formData.title,
                  description: formData.description,
                  durationSeconds: formData.durationSeconds,
                  isActive: formData.isActive,
                  type: formData.type,
                  videoUrl: formData.videoUrl || "",
                  createdAt: new Date().toISOString()
                });
                setQuestions(prev => [
                  {
                    id: ref.id,
                    title: formData.title,
                    description: formData.description,
                    duration: String(formData.durationSeconds),
                    isActive: formData.isActive
                  },
                  ...prev
                ]);
                setIsAddOpen(false);
                setFormData({
                  title: "",
                  description: "",
                  durationSeconds: 0,
                  isActive: true,
                  type: "resiko",
                  videoUrl: ""
                });
                alert("Kuesioner berhasil ditambahkan");
              } catch (err: any) {
                console.error("Gagal menambah kuesioner", err);
                alert(`Gagal menambah kuesioner: ${err?.message || "Unknown error"}`);
              } finally {
                setAdding(false);
              }
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Judul</label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Masukkan judul kuesioner"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Deskripsi</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                rows={4}
                placeholder="Masukkan deskripsi kuesioner"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Durasi (detik)</label>
                <input
                  required
                  type="number"
                  min={0}
                  value={formData.durationSeconds}
                  onChange={(e) => setFormData({ ...formData, durationSeconds: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="15"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select
                  value={formData.isActive ? "active" : "inactive"}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "active" })}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Tidak Aktif</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipe</label>
                <input
                  required
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="resiko"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Video URL</label>
              <input
                type="url"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="https://..."
              />
            </div>
            <DialogFooter>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={adding}
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={adding}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 disabled:opacity-50"
              >
                {adding && <Loader2 className="w-4 h-4 animate-spin" />}
                Tambah Kuesioner
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditOpen} onOpenChange={(open) => { setIsEditOpen(open); if (!open) setEditingId(null); }}>
        <DialogContent className="sm:max-w-150 bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Kuesioner</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!editingId) return;
              setAdding(true);
              try {
                await updateDoc(doc(db, "questionnaires", editingId), {
                  title: formData.title,
                  description: formData.description,
                  durationSeconds: formData.durationSeconds,
                  isActive: formData.isActive,
                  type: formData.type,
                  videoUrl: formData.videoUrl || "",
                  updatedAt: new Date().toISOString()
                });
                setQuestions(prev =>
                  prev.map(q =>
                    q.id === editingId
                      ? {
                          id: editingId,
                          title: formData.title,
                          description: formData.description,
                          duration: String(formData.durationSeconds),
                          isActive: formData.isActive
                        }
                      : q
                  )
                );
                setIsEditOpen(false);
                setEditingId(null);
                alert("Kuesioner berhasil diperbarui");
              } catch (err: any) {
                console.error("Gagal mengubah kuesioner", err);
                alert(`Gagal mengubah kuesioner: ${err?.message || "Unknown error"}`);
              } finally {
                setAdding(false);
              }
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Judul</label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Masukkan judul kuesioner"
                disabled={editingLoading}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Deskripsi</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                rows={4}
                placeholder="Masukkan deskripsi kuesioner"
                disabled={editingLoading}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Durasi (detik)</label>
                <input
                  required
                  type="number"
                  min={0}
                  value={formData.durationSeconds}
                  onChange={(e) => setFormData({ ...formData, durationSeconds: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="15"
                  disabled={editingLoading}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select
                  value={formData.isActive ? "active" : "inactive"}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "active" })}
                  className="w-full px-3 py-2 border rounded-md"
                  disabled={editingLoading}
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Tidak Aktif</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipe</label>
                <input
                  required
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="resiko"
                  disabled={editingLoading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Video URL</label>
              <input
                type="url"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="https://..."
                disabled={editingLoading}
              />
            </div>
            <DialogFooter>
              <button
                type="button"
                onClick={() => { setIsEditOpen(false); setEditingId(null); }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={adding}
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={adding || editingLoading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 disabled:opacity-50"
              >
                {adding && <Loader2 className="w-4 h-4 animate-spin" />}
                Simpan Perubahan
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus kuesioner?</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="text-sm text-gray-700">
            {deleteTarget ? `Anda akan menghapus "${deleteTarget.title}"` : ""}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteOpen(false)}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!deleteTarget) return;
                try {
                  await deleteDoc(doc(db, "questionnaires", deleteTarget.id));
                  setQuestions(prev => prev.filter(q => q.id !== deleteTarget.id));
                } catch (err: any) {
                  alert(`Gagal menghapus: ${err?.message || "Unknown error"}`);
                } finally {
                  setIsDeleteOpen(false);
                  setDeleteTarget(null);
                }
              }}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
