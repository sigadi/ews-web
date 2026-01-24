import { 
  User, 
  Calendar, 
  Bell, 
  Shield, 
  HelpCircle, 
  Settings,
  ChevronRight,
  LogOut,
  FileText,
  Heart
} from "lucide-react";

export function ProfileScreen() {
  const menuItems = [
    {
      icon: User,
      label: "Informasi Pribadi",
      description: "Kelola data pribadi Anda",
      color: "bg-primary-100 text-primary-600"
    },
    {
      icon: Calendar,
      label: "Riwayat Pemeriksaan",
      description: "Lihat riwayat pemeriksaan",
      color: "bg-accent-100 text-accent-600"
    },
    {
      icon: Bell,
      label: "Pengingat & Notifikasi",
      description: "Atur pengingat pemeriksaan",
      color: "bg-warning-100 text-warning-600"
    },
    {
      icon: FileText,
      label: "Dokumen Medis",
      description: "Akses dokumen & hasil tes",
      color: "bg-success-100 text-success-600"
    },
  ];

  const settingsItems = [
    {
      icon: Shield,
      label: "Privasi & Keamanan",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: Settings,
      label: "Pengaturan",
      color: "bg-gray-100 text-gray-600"
    },
    {
      icon: HelpCircle,
      label: "Bantuan & Dukungan",
      color: "bg-blue-100 text-blue-600"
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 px-6 pt-8 pb-12 rounded-b-3xl">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
            <span className="text-3xl text-primary-600">SR</span>
          </div>
          <h2 className="text-white mb-1">Oktaliza</h2>
          <p className="text-primary-100 text-sm">Oktaliza@email.com</p>
          <p className="text-primary-200 text-xs mt-1">ID: 123456789</p>
        </div>
      </div>

      {/* Health Status Card */}
      <div className="px-6 -mt-6 mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-gray-900">Status Kesehatan</h4>
            <span className="text-xs text-success-600 bg-success-50 px-3 py-1 rounded-full">
              Risiko Rendah
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Calendar className="w-6 h-6 text-primary-600" />
              </div>
              <p className="text-xs text-gray-600">Terakhir Cek</p>
              <p className="text-sm text-gray-900 mt-1">3 bulan lalu</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Heart className="w-6 h-6 text-accent-600" />
              </div>
              <p className="text-xs text-gray-600">Pemeriksaan</p>
              <p className="text-sm text-gray-900 mt-1">5 kali</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="w-6 h-6 text-success-600" />
              </div>
              <p className="text-xs text-gray-600">Vaksin HPV</p>
              <p className="text-sm text-gray-900 mt-1">Lengkap</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-6">
        <h3 className="text-gray-900 mb-4">Akun</h3>
        <div className="space-y-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="text-gray-900 text-sm">{item.label}</h4>
                  <p className="text-gray-500 text-xs mt-0.5">{item.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Settings */}
      <div className="px-6 mt-8">
        <h3 className="text-gray-900 mb-4">Pengaturan</h3>
        <div className="space-y-3">
          {settingsItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-gray-900 text-sm">{item.label}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-6 mt-6 mb-8">
        <button className="w-full bg-red-50 text-red-600 py-4 rounded-2xl flex items-center justify-center gap-2 border border-red-200 hover:bg-red-100 transition-colors">
          <LogOut className="w-5 h-5" />
          <span>Keluar dari Akun</span>
        </button>
      </div>

      {/* App Info */}
      <div className="px-6 pb-6 text-center">
        <p className="text-xs text-gray-400">Versi 1.0.0</p>
        <p className="text-xs text-gray-400 mt-1">© 2024 CerviCare App</p>
      </div>
    </div>
  );
}
