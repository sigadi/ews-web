"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Facilities {
  id: string;
  name: string;
  address?: string;
  createdAt?: string;
}

export default function Facilities() {
  const [searchQuery, setSearchQuery] = useState("");
  const [facilities, setFacilities] = useState<Facilities[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isAdding, setIsAdding] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facilities | null>(
    null,
  );
  const [deletingFacilityId, setDeletingFacilityId] = useState<string | null>(
    null,
  );

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    address: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const snap = await getDocs(collection(db, "facilities"));

        const data: Facilities[] = snap.docs.map((doc) => {
          const d = doc.data() as any;

          return {
            id: doc.id,
            name: d.name || "-",
            address: d.address || "-",
            createdAt: d.createdAt,
          };
        });

        // Sort client-side to handle missing createdAt
        data.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          // If a has createdAt but b doesn't, a comes first
          if (a.createdAt) return -1;
          // If b has createdAt but a doesn't, b comes first
          if (b.createdAt) return 1;
          // If neither has createdAt, keep original order (or sort by name if preferred)
          return 0;
        });

        setFacilities(data);
      } catch (err) {
        console.error("Gagal ambil facilities dari Firestore", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleAddClick = () => {
    setFormData({ name: "", address: "" });
    setIsAdding(true);
  };

  const handleEditClick = (facility: Facilities) => {
    setFormData({ name: facility.name, address: facility.address || "" });
    setEditingFacility(facility);
  };

  const handleSave = async () => {
    try {
      if (editingFacility) {
        // Update existing
        const docRef = doc(db, "facilities", editingFacility.id);
        await updateDoc(docRef, { name: formData.name, address: formData.address });

        setFacilities((prev) =>
          prev.map((f) =>
            f.id === editingFacility.id ? { ...f, name: formData.name, address: formData.address } : f,
          ),
        );
      } else {
        // Add new
        const colRef = collection(db, "facilities");
        const docRef = await addDoc(colRef, {
          name: formData.name,
          address: formData.address,
          createdAt: new Date().toISOString(),
        });

        setFacilities((prev) => [
          { id: docRef.id, name: formData.name, address: formData.address },
          ...prev,
        ]);
      }
      setIsAdding(false);
      setEditingFacility(null);
    } catch (error) {
      console.error("Error saving facility:", error);
      alert("Gagal menyimpan fasilitas");
    }
  };

  const handleDelete = async () => {
    if (!deletingFacilityId) return;

    try {
      await deleteDoc(doc(db, "facilities", deletingFacilityId));
      setFacilities((prev) => prev.filter((f) => f.id !== deletingFacilityId));
      setDeletingFacilityId(null);
    } catch (error) {
      console.error("Error deleting facility:", error);
      alert("Gagal menghapus fasilitas");
    }
  };

  if (loading) {
    return <div className="p-8">Loading facilities...</div>;
  }

  const filteredFacilities = facilities.filter((fcs) => {
    const q = searchQuery.toLowerCase();
    return (
      fcs.name.toLowerCase().includes(q) ||
      (fcs.address && fcs.address.toLowerCase().includes(q))
    );
  });

  const totalPages = Math.ceil(filteredFacilities.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedFacilities = filteredFacilities.slice(startIndex, endIndex);

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Manajemen Fasilitas</h1>
        <p className="text-gray-600">
          Kelola data fasilitas aplikasi EWS CaServ
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

          {/* Action */}
          <div className="flex gap-3">
            <Button
              onClick={handleAddClick}
              className="text-white px-6 py-6 bg-teal-600 hover:bg-teal-700 rounded-xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Tambah Fasilitas</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Facilities Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-gray-700 w-1/3">
                  Nama Fasilitas
                </th>
                <th className="px-6 py-4 text-left text-gray-700 w-1/3">
                  Alamat
                </th>
                <th className="px-6 py-4 text-left text-gray-700 w-1/3">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedFacilities.map((fcs) => (
                <tr key={fcs.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-gray-900">{fcs.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-gray-900">{fcs.address || "-"}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                        title="Edit"
                        onClick={() => handleEditClick(fcs)}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus"
                        onClick={() => setDeletingFacilityId(fcs.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {paginatedFacilities.length === 0 && (
                <tr>
                  <td
                    colSpan={2}
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
            {Math.min(endIndex, filteredFacilities.length)} dari{" "}
            {filteredFacilities.length} Fasilitas
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

      {/* Add/Edit Dialog */}
      <Dialog
        open={isAdding || !!editingFacility}
        onOpenChange={(open) => {
          if (!open) {
            setIsAdding(false);
            setEditingFacility(null);
          }
        }}
      >
        <DialogContent className="bg-white sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>
              {isAdding ? "Tambah Fasilitas" : "Edit Fasilitas"}
            </DialogTitle>
            <DialogDescription>
              Isi nama fasilitas di bawah ini.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nama
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Alamat
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAdding(false);
                setEditingFacility(null);
              }}
            >
              Batal
            </Button>
            <Button onClick={handleSave} className="bg-teal-600 hover:bg-teal-700">
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      <AlertDialog
        open={!!deletingFacilityId}
        onOpenChange={(open) => !open && setDeletingFacilityId(null)}
      >
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data fasilitas ini akan dihapus
              permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="text-white bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
