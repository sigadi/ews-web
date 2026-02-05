"use client";

import { useState, useEffect } from "react";
import { Search, UserPlus, Edit, Trash2, Eye, Loader2 } from "lucide-react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Checkbox } from "@/components/ui/checkbox";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  registeredDate: string;
  riskLevel: "HIGH_RISK" | "MEDIUM_RISK" | "LOW_RISK";
  lastCheckup: string;
  status: "active" | "inactive";
  profile?: {
    gender: string;
    age: number;
    birthDate: string;
    maritalStatus: string;
    education: string;
    job: string;
    income: string;
    address: string;
    phone: string;
    consent: boolean;
  };
  bmi?: {
    weight: string;
    height: string;
    bmi: number;
    category: string;
  };
  riskFactors?: {
    familyHistory: boolean;
    hormonalContraception: boolean;
    parity: number;
    ageFirstMarriage: number;
    ims: string[];
    smokingHistory: boolean;
  };
}

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    riskLevel: "LOW_RISK",
    status: "active",
    weight: "",
    height: "",
    gender: "Perempuan",
    birthDate: "",
    maritalStatus: "Menikah",
    education: "Sarjana",
    job: "",
    income: "1–3 juta",
    address: "",
    familyHistory: "false",
    hormonalContraception: "false",
    parity: "",
    ageFirstMarriage: "",
    ims: [] as string[],
    smokingHistory: "false",
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const calculateAge = (birthDateString: string) => {
    if (!birthDateString) return 0;
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const calculateBMI = (weight: number, height: number) => {
    const heightInMeters = height / 100;
    const bmiValue = weight / (heightInMeters * heightInMeters);
    const roundedBmi = parseFloat(bmiValue.toFixed(1));

    let category = "Normal";
    if (roundedBmi < 18.5) category = "Kurus";
    else if (roundedBmi >= 18.5 && roundedBmi <= 24.9) category = "Normal";
    else if (roundedBmi >= 25 && roundedBmi <= 29.9) category = "Gemuk";
    else if (roundedBmi >= 30) category = "Obesitas";

    return { bmi: roundedBmi, category };
  };

  const handleViewDetail = (user: User) => {
    setSelectedUser(user);
    setIsDetailOpen(true);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 1. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // 2. Create Firestore Doc
      const weightNum = parseFloat(formData.weight) || 0;
      const heightNum = parseFloat(formData.height) || 0;
      const { bmi, category } = calculateBMI(weightNum, heightNum);
      const age = calculateAge(formData.birthDate);

      // Format birthDate to DD/MM/YYYY
      const dateObj = new Date(formData.birthDate);
      const formattedBirthDate = !isNaN(dateObj.getTime())
        ? dateObj.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        : "";

      const newUser = {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        role: "user",
        createdAt: Date.now(),
        profile: {
          name: formData.name,
          gender: formData.gender,
          age: age,
          birthDate: formattedBirthDate,
          maritalStatus: formData.maritalStatus,
          education: formData.education,
          job: formData.job,
          income: formData.income,
          address: formData.address,
          phone: formData.phone,
          consent: true,
        },
        riskFactors: {
          familyHistory: formData.familyHistory === "true",
          hormonalContraception: formData.hormonalContraception === "true",
          parity: parseInt(formData.parity) || 0,
          ageFirstMarriage: parseInt(formData.ageFirstMarriage) || 0,
          ims: formData.ims,
          smokingHistory: formData.smokingHistory === "true",
        },
        bmi: {
          weight: formData.weight,
          height: formData.height,
          bmi,
          category,
        },
        riskLabel: formData.riskLevel,
        onboardingCompleted: formData.status === "active",
        lastScreeningAt: null,
      };

      await addDoc(collection(db, "users"), newUser);

      // 3. Reset and Close
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        riskLevel: "LOW_RISK",
        status: "active",
        weight: "",
        height: "",
        gender: "Perempuan",
        birthDate: "",
        maritalStatus: "Menikah",
        education: "Sarjana",
        job: "",
        income: "1–3 juta",
        address: "",
        familyHistory: "false",
        hormonalContraception: "false",
        parity: "",
        ageFirstMarriage: "",
        ims: [],
        smokingHistory: "false",
      });
      setIsAddUserOpen(false);
      fetchUsers();
    } catch (error: any) {
      console.error("Error adding user:", error);
      alert("Gagal menambah user: " + (error.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const fetchUsers = async () => {
    setLoading(true);
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
          profile: d.profile,
          bmi: d.bmi,
          riskFactors: d.riskFactors,
        };
      });

      setUsers(data);
    } catch (err) {
      console.error("Gagal ambil user dari Firestore", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
              <DialogTrigger asChild>
                <button className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  <span className="hidden sm:inline">Tambah User</span>
                </button>
              </DialogTrigger>
              <DialogContent className="bg-white w-full sm:max-w-3xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle>Tambah User Baru</DialogTitle>
                  <DialogDescription>
                    Buat akun pengguna baru dan simpan ke database.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddUser} className="flex-1 overflow-y-auto px-4">
                  <div className="flex flex-col gap-4 py-4">
                    <div className="grid gap-4 grid-cols-3">
                      <div className="flex flex-col gap-3">
                        <Label htmlFor="name">
                          Nama
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="col-span-3"
                          required
                          placeholder="Nama Lengkap"
                        />
                      </div>
                      <div className="flex flex-col gap-3">
                        <Label htmlFor="email">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="col-span-3"
                          required
                          placeholder="email@contoh.com"
                        />
                      </div>
                      <div className="flex flex-col gap-3">
                        <Label htmlFor="password">
                          Password
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                          }
                          className="col-span-3"
                          required
                          minLength={6}
                          placeholder="Minimal 6 karakter"
                        />
                      </div>
                      <div className="flex flex-col gap-3">
                        <Label htmlFor="phone">
                          Telepon
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="col-span-3"
                          required
                          placeholder="0812..."
                        />
                      </div>
                      <div className="flex flex-col gap-3">
                        <Label htmlFor="weight">
                          Berat (kg)
                        </Label>
                        <Input
                          id="weight"
                          type="number"
                          value={formData.weight}
                          onChange={(e) =>
                            setFormData({ ...formData, weight: e.target.value })
                          }
                          className="col-span-3"
                          required
                          placeholder="Contoh: 70"
                        />
                      </div>
                      <div className="flex flex-col gap-3">
                        <Label htmlFor="height">
                          Tinggi (cm)
                        </Label>
                        <Input
                          id="height"
                          type="number"
                          value={formData.height}
                          onChange={(e) =>
                            setFormData({ ...formData, height: e.target.value })
                          }
                          className="col-span-3"
                          required
                          placeholder="Contoh: 165"
                        />
                      </div>
                      <div className="flex flex-col gap-3">
                        <Label htmlFor="gender">
                          Jenis Kelamin
                        </Label>
                        <div className="col-span-3">
                          <select
                            id="gender"
                            value={formData.gender}
                            onChange={(e) =>
                              setFormData({ ...formData, gender: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                          >
                            <option value="Laki-laki">Laki-laki</option>
                            <option value="Perempuan">Perempuan</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <Label htmlFor="birthDate">
                          Tgl Lahir
                        </Label>
                        <Input
                          id="birthDate"
                          type="date"
                          value={formData.birthDate}
                          onChange={(e) =>
                            setFormData({ ...formData, birthDate: e.target.value })
                          }
                          className="col-span-3"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-3">
                        <Label htmlFor="maritalStatus">
                          Status Pernikahan
                        </Label>
                        <div className="col-span-3">
                          <select
                            id="maritalStatus"
                            value={formData.maritalStatus}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                maritalStatus: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                          >
                            <option value="Belum Menikah">Belum Menikah</option>
                            <option value="Menikah">Menikah</option>
                            <option value="Cerai Hidup">Cerai Hidup</option>
                            <option value="Cerai Mati">Cerai Mati</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <Label htmlFor="education">
                          Pendidikan
                        </Label>
                        <div className="col-span-3">
                          <select
                            id="education"
                            value={formData.education}
                            onChange={(e) =>
                              setFormData({ ...formData, education: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                          >
                            <option value="SD">SD</option>
                            <option value="SMP">SMP</option>
                            <option value="SMA">SMA</option>
                            <option value="Diploma">Diploma</option>
                            <option value="Sarjana">Sarjana</option>
                            <option value="Magister">Magister</option>
                            <option value="Doktor">Doktor</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <Label htmlFor="job">
                          Pekerjaan
                        </Label>
                        <Input
                          id="job"
                          value={formData.job}
                          onChange={(e) =>
                            setFormData({ ...formData, job: e.target.value })
                          }
                          className="col-span-3"
                          placeholder="Contoh: Ibu Guru"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-3">
                        <Label htmlFor="income">
                          Penghasilan
                        </Label>
                        <div className="col-span-3">
                          <select
                            id="income"
                            value={formData.income}
                            onChange={(e) =>
                              setFormData({ ...formData, income: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                          >
                            <option value="< 1 juta">&lt; 1 juta</option>
                            <option value="1–3 juta">1–3 juta</option>
                            <option value="3–5 juta">3–5 juta</option>
                            <option value="> 5 juta">&gt; 5 juta</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <Label htmlFor="address">
                          Alamat
                        </Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) =>
                            setFormData({ ...formData, address: e.target.value })
                          }
                          className="col-span-3"
                          placeholder="Alamat Lengkap"
                          required
                        />
                      </div>
                    </div>

                    {/* Risk Factors Section */}
                    <div className="col-span-4 mt-4 mb-2 border-t pt-4">
                      <h3 className="font-semibold text-gray-900">Faktor Risiko</h3>
                    </div>

                    <div className="grid gap-4 grid-cols-3">
                      <div className="flex flex-col gap-3">
                        <Label htmlFor="familyHistory">
                          Riwayat Keluarga (Kanker)
                        </Label>
                        <div className="col-span-3">
                          <select
                            id="familyHistory"
                            value={formData.familyHistory}
                            onChange={(e) =>
                              setFormData({ ...formData, familyHistory: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                          >
                            <option value="false">Tidak Ada</option>
                            <option value="true">Ada</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <Label htmlFor="hormonalContraception">
                          Kontrasepsi Hormonal
                        </Label>
                        <div className="col-span-3">
                          <select
                            id="hormonalContraception"
                            value={formData.hormonalContraception}
                            onChange={(e) =>
                              setFormData({ ...formData, hormonalContraception: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                          >
                            <option value="false">Tidak Menggunakan</option>
                            <option value="true">Menggunakan</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <Label htmlFor="parity">
                          Jumlah Anak (Paritas)
                        </Label>
                        <Input
                          id="parity"
                          type="number"
                          min="0"
                          value={formData.parity}
                          onChange={(e) =>
                            setFormData({ ...formData, parity: e.target.value })
                          }
                          className="col-span-3"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-3">
                        <Label htmlFor="ageFirstMarriage">
                          Usia Pertama Menikah
                        </Label>
                        <Input
                          id="ageFirstMarriage"
                          type="number"
                          min="0"
                          value={formData.ageFirstMarriage}
                          onChange={(e) =>
                            setFormData({ ...formData, ageFirstMarriage: e.target.value })
                          }
                          className="col-span-3"
                        />
                      </div>

                      <div className="flex flex-col gap-3">
                        <Label htmlFor="riskLevel">
                          Risiko
                        </Label>
                        <div className="col-span-3">
                          <select
                            id="riskLevel"
                            value={formData.riskLevel}
                            onChange={(e) =>
                              setFormData({ ...formData, riskLevel: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                          >
                            <option value="LOW_RISK">Rendah</option>
                            <option value="MEDIUM_RISK">Sedang</option>
                            <option value="HIGH_RISK">Tinggi</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <Label htmlFor="smokingHistory">
                          Riwayat Merokok
                        </Label>
                        <div className="col-span-3">
                          <select
                            id="smokingHistory"
                            value={formData.smokingHistory}
                            onChange={(e) =>
                              setFormData({ ...formData, smokingHistory: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                          >
                            <option value="false">Tidak Merokok</option>
                            <option value="true">Merokok</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <Label className="text-right pt-2">
                          Riwayat IMS
                        </Label>
                        <div className="space-y-2">
                          {["Kencing Nanah", "Sifilis", "Herpes", "HIV", "Kutil Kelamin"].map((imsItem) => (
                            <div key={imsItem} className="flex items-center space-x-2">
                              <Checkbox
                                id={`ims-${imsItem}`}
                                checked={formData.ims.includes(imsItem)}
                                onCheckedChange={(checked: any) => {
                                  let newIms = [...formData.ims];
                                  if (checked) {
                                    newIms.push(imsItem);
                                  } else {
                                    newIms = newIms.filter(i => i !== imsItem);
                                  }
                                  setFormData({ ...formData, ims: newIms });
                                }}
                              />
                              <Label htmlFor={`ims-${imsItem}`} className="text-sm font-normal cursor-pointer">
                                {imsItem}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <Label htmlFor="status">
                          Status
                        </Label>
                        <div className="col-span-3">
                          <select
                            id="status"
                            value={formData.status}
                            onChange={(e) =>
                              setFormData({ ...formData, status: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                          >
                            <option value="active">Aktif</option>
                            <option value="inactive">Tidak Aktif</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button className="bg-primary-500 text-white cursor-pointer" type="submit" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Simpan User
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
              <DialogContent className="bg-white w-full sm:max-w-3xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle>Detail User</DialogTitle>
                  <DialogDescription>
                    Informasi lengkap pengguna
                  </DialogDescription>
                </DialogHeader>
                {selectedUser && (
                  <div className="flex-1 overflow-y-auto px-1 pr-2">
                    <div className="space-y-6 py-4">
                      {/* Section 1: Basic Info */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">Informasi Akun</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Nama Lengkap</p>
                            <p className="text-gray-900">{selectedUser.name}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Email</p>
                            <p className="text-gray-900">{selectedUser.email}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Telepon</p>
                            <p className="text-gray-900">{selectedUser.phone}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Tanggal Registrasi</p>
                            <p className="text-gray-900">{selectedUser.registeredDate}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Status Akun</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(selectedUser.status)}`}>
                              {getStatusLabel(selectedUser.status)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Tingkat Risiko</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelStyle(selectedUser.riskLevel)}`}>
                              {getRiskLevelLabel(selectedUser.riskLevel)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Personal Profile */}
                      {selectedUser.profile && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">Profil Pribadi</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-500">Jenis Kelamin</p>
                              <p className="text-gray-900">{selectedUser.profile.gender}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Usia</p>
                              <p className="text-gray-900">{selectedUser.profile.age} Tahun</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Tanggal Lahir</p>
                              <p className="text-gray-900">{selectedUser.profile.birthDate}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Status Pernikahan</p>
                              <p className="text-gray-900">{selectedUser.profile.maritalStatus}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Pendidikan Terakhir</p>
                              <p className="text-gray-900">{selectedUser.profile.education}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Pekerjaan</p>
                              <p className="text-gray-900">{selectedUser.profile.job}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Penghasilan</p>
                              <p className="text-gray-900">{selectedUser.profile.income}</p>
                            </div>
                            <div className="md:col-span-2">
                              <p className="text-sm font-medium text-gray-500">Alamat</p>
                              <p className="text-gray-900">{selectedUser.profile.address}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Section 3: Health & BMI */}
                      {selectedUser.bmi && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">Kesehatan & BMI</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-500">Berat Badan</p>
                              <p className="text-gray-900">{selectedUser.bmi.weight} kg</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Tinggi Badan</p>
                              <p className="text-gray-900">{selectedUser.bmi.height} cm</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">BMI Score</p>
                              <p className="text-gray-900">{selectedUser.bmi.bmi}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Kategori BMI</p>
                              <p className="text-gray-900">{selectedUser.bmi.category}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Section 4: Risk Factors */}
                      {selectedUser.riskFactors && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">Faktor Risiko</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-500">Riwayat Keluarga (Kanker)</p>
                              <p className="text-gray-900">{selectedUser.riskFactors.familyHistory ? "Ya" : "Tidak"}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Kontrasepsi Hormonal</p>
                              <p className="text-gray-900">{selectedUser.riskFactors.hormonalContraception ? "Ya" : "Tidak"}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Merokok</p>
                              <p className="text-gray-900">{selectedUser.riskFactors.smokingHistory ? "Ya" : "Tidak"}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Jumlah Anak (Paritas)</p>
                              <p className="text-gray-900">{selectedUser.riskFactors.parity}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Usia Pertama Menikah</p>
                              <p className="text-gray-900">{selectedUser.riskFactors.ageFirstMarriage} Tahun</p>
                            </div>
                            <div className="md:col-span-2">
                              <p className="text-sm font-medium text-gray-500">Riwayat IMS</p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {selectedUser.riskFactors.ims && selectedUser.riskFactors.ims.length > 0 ? (
                                  selectedUser.riskFactors.ims.map((ims, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700 border">
                                      {ims}
                                    </span>
                                  ))
                                ) : (
                                  <p className="text-gray-900">-</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <DialogFooter className="mt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsDetailOpen(false)}
                  >
                    Tutup
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
                <th className="px-6 py-4 text-left text-gray-700 w-64">Status</th>
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
                  <td className="px-2 py-4 w-64">
                    <span
                      className={`px-3 py-1 w-25 block text-center rounded-full text-sm ${getStatusStyle(
                        user.status
                      )}`}
                    >
                      {getStatusLabel(user.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetail(user)}
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
                  className={`px-4 py-2 rounded-lg ${currentPage === page
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
