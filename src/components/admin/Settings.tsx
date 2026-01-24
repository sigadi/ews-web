import { Bell, Lock, User, Globe, Mail, Shield, Database, Download } from 'lucide-react';

export default function Settings() {
  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Pengaturan</h1>
        <p className="text-gray-600">Kelola pengaturan sistem dan preferensi admin</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar Menu */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-4 space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-teal-50 text-teal-700 rounded-lg">
              <User className="w-5 h-5" />
              <span>Profil Admin</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <Bell className="w-5 h-5" />
              <span>Notifikasi</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <Lock className="w-5 h-5" />
              <span>Keamanan</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5" />
              <span>Email</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <Database className="w-5 h-5" />
              <span>Backup Data</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-gray-900 mb-6">Profil Admin</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-teal-700" />
                </div>
                <div>
                  <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                    Ganti Foto
                  </button>
                  <p className="text-gray-500 mt-2">JPG, PNG. Max 2MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Nama Lengkap</label>
                  <input
                    type="text"
                    defaultValue="Dr. Sarah Johnson"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue="admin@ewscaserv.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Nomor Telepon</label>
                  <input
                    type="tel"
                    defaultValue="+62 812-3456-7890"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Role</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                    <option>Super Admin</option>
                    <option>Admin</option>
                    <option>Moderator</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
                  Batal
                </button>
                <button className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors">
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-gray-900 mb-6">Pengaturan Notifikasi</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div>
                  <p className="text-gray-900 mb-1">Jadwal Skrining Baru</p>
                  <p className="text-gray-600">Notifikasi saat ada jadwal skrining baru</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div>
                  <p className="text-gray-900 mb-1">User Baru</p>
                  <p className="text-gray-600">Notifikasi saat ada pendaftaran user baru</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div>
                  <p className="text-gray-900 mb-1">Kasus Risiko Tinggi</p>
                  <p className="text-gray-600">Notifikasi prioritas untuk kasus risiko tinggi</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div>
                  <p className="text-gray-900 mb-1">Laporan Mingguan</p>
                  <p className="text-gray-600">Ringkasan laporan mingguan via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-gray-900 mb-6">Keamanan</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Password Lama</label>
                <input
                  type="password"
                  placeholder="Masukkan password lama"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Password Baru</label>
                <input
                  type="password"
                  placeholder="Masukkan password baru"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Konfirmasi Password Baru</label>
                <input
                  type="password"
                  placeholder="Konfirmasi password baru"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <button className="w-full px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors">
                Ubah Password
              </button>
            </div>
          </div>

          {/* Backup Settings */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-gray-900 mb-6">Backup Data</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <Database className="w-5 h-5 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <p className="text-blue-900 mb-1">Backup Terakhir</p>
                    <p className="text-blue-700">27 November 2024, 02:00 WIB</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 px-6 py-3 border border-teal-600 text-teal-600 rounded-xl hover:bg-teal-50 transition-colors flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  Download Backup
                </button>
                <button className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors">
                  Buat Backup Baru
                </button>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div>
                  <p className="text-gray-900 mb-1">Backup Otomatis</p>
                  <p className="text-gray-600">Backup otomatis setiap hari pukul 02:00 WIB</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
