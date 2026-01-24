import { useState } from "react";
import { Shield, Mail, Lock, User, Phone, Calendar } from "lucide-react";
import { ImageWithFallback } from "./ui/ImageWithFallback";

interface AuthScreenProps {
  onLogin: () => void;
}

export function AuthScreen({ onLogin }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    birthDate: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-primary-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 px-6 pt-12 pb-16 text-center rounded-b-[3rem]">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Shield className="w-10 h-10 text-primary-600" />
        </div>
        <h1 className="text-white mb-2">EWS CaServ</h1>
        <p className="text-primary-100 text-sm">
          Early Warning System Cervical Cancer
        </p>
      </div>

      <div className="px-6 -mt-8">
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
          {/* Toggle Tabs */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-xl transition-all ${
                isLogin
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-gray-500"
              }`}
            >
              Masuk
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-xl transition-all ${
                !isLogin
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-gray-500"
              }`}
            >
              Daftar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-600"
                      required={!isLogin}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-700 mb-2 block">
                    Nomor Telepon
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="08xxxxxxxxxx"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-600"
                      required={!isLogin}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-700 mb-2 block">
                    Tanggal Lahir
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) =>
                        setFormData({ ...formData, birthDate: e.target.value })
                      }
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-600"
                      required={!isLogin}
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-sm text-gray-700 mb-2 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-700 mb-2 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-600"
                  required
                />
              </div>
            </div>

            {isLogin && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-primary-600 hover:underline"
                >
                  Lupa Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-4 rounded-xl hover:bg-primary-700 transition-colors mt-6"
            >
              {isLogin ? "Masuk" : "Daftar Sekarang"}
            </button>
          </form>

          {!isLogin && (
            <p className="text-xs text-gray-500 text-center mt-4">
              Dengan mendaftar, Anda menyetujui{" "}
              <button className="text-primary-600 underline">
                Syarat & Ketentuan
              </button>{" "}
              dan{" "}
              <button className="text-primary-600 underline">
                Kebijakan Privasi
              </button>
            </p>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-primary-50 rounded-2xl p-4 mt-6 mb-6 border border-primary-100">
          <h4 className="text-primary-900 mb-2 text-sm">
            Kenapa Menggunakan EWS CaServ?
          </h4>
          <ul className="space-y-2 text-xs text-primary-800">
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-0.5">✓</span>
              <span>Deteksi dini risiko kanker serviks</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-0.5">✓</span>
              <span>Jadwalkan skrining IVA dengan mudah</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-0.5">✓</span>
              <span>Edukasi kesehatan terpercaya</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-0.5">✓</span>
              <span>Pengingat pemeriksaan rutin</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
