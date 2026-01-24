import { useState } from "react";
import {
  FileText,
  Calendar,
  AlertCircle,
  CheckCircle,
  Download,
  Share2,
  Clock,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

export function ResultsScreen({ onBack }: { onBack?: () => void }) {
  const [selectedResult, setSelectedResult] = useState<string | null>(null);

  const results = [
    {
      id: "1",
      date: "15 Nov 2024",
      type: "Skrining IVA",
      facility: "RS Umum Daerah Kota",
      status: "Negatif",
      statusType: "success",
      recommendation: "Pemeriksaan rutin 1 tahun lagi",
    },
    {
      id: "2",
      date: "20 Agt 2024",
      type: "Pap Smear",
      facility: "Klinik Pratama Sehat",
      status: "Normal",
      statusType: "success",
      recommendation: "Pemeriksaan rutin 3 tahun lagi",
    },
    {
      id: "3",
      date: "10 Mei 2024",
      type: "Kuesioner Risiko",
      facility: "Self Assessment",
      status: "Risiko Rendah",
      statusType: "success",
      recommendation: "Tetap jaga pola hidup sehat",
    },
  ];

  return (
    
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">

  <div className="bg-gradient-to-br from-primary-600 to-primary-700 px-6 pt-6 pb-8 rounded-b-3xl">

    <button
      onClick={onBack}
      className="flex items-center gap-2 text-white mb-4"
    >
      <ArrowLeft className="w-5 h-5" />
    </button>

    <h2 className="text-white mb-2">Hasil & Tindak Lanjut</h2>
    <p className="text-primary-100 text-sm">
      Riwayat pemeriksaan dan rekomendasi
    </p>
  </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Next Action Card */}
        <div className="bg-gradient-to-r from-accent-500 to-accent-600 rounded-2xl p-4 mb-6 text-white">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="mb-1">Jadwal Pemeriksaan Berikutnya</h4>
              <p className="text-white/90 text-sm mb-3">
                15 November 2025 - Skrining IVA Rutin
              </p>
              <button className="bg-white text-accent-600 px-4 py-2 rounded-lg text-sm hover:bg-accent-50 transition-colors">
                Atur Pengingat
              </button>
            </div>
          </div>
        </div>

        {/* Results List */}
        <h3 className="text-gray-900 mb-4">Riwayat Pemeriksaan</h3>
        <div className="space-y-3">
          {results.map((result) => (
            <button
              key={result.id}
              onClick={() => setSelectedResult(result.id)}
              className="w-full bg-white rounded-2xl p-4 border border-gray-200 hover:shadow-md transition-all text-left"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-gray-900 mb-1">{result.type}</h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {result.date}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        result.statusType === "success"
                          ? "bg-success-50 text-success-600"
                          : "bg-warning-50 text-warning-600"
                      }`}
                    >
                      {result.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    {result.facility}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary-600 text-sm">
                      Lihat Detail
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Recommendations */}
        <div className="mt-8">
          <h3 className="text-gray-900 mb-4">Rekomendasi Tindak Lanjut</h3>
          <div className="space-y-3">
            <div className="bg-success-50 rounded-2xl p-4 border border-success-100">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-success-900 text-sm mb-1">
                    Status Kesehatan Baik
                  </h4>
                  <p className="text-success-800 text-xs">
                    Hasil pemeriksaan terakhir menunjukkan kondisi normal.
                    Lanjutkan pola hidup sehat dan jadwalkan pemeriksaan rutin.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary-50 rounded-2xl p-4 border border-primary-100">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-primary-900 text-sm mb-1">
                    Pentingnya Pemeriksaan Rutin
                  </h4>
                  <p className="text-primary-800 text-xs mb-2">
                    Deteksi dini sangat penting. Pastikan Anda melakukan
                    pemeriksaan sesuai jadwal yang direkomendasikan.
                  </p>
                  <button className="text-primary-600 text-xs hover:underline">
                    Baca Panduan Lengkap →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-3 mb-6">
          <button className="bg-white border-2 border-primary-600 text-primary-600 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-primary-50 transition-colors">
            <Download className="w-5 h-5" />
            <span className="text-sm">Unduh Hasil</span>
          </button>
          <button className="bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
            <Share2 className="w-5 h-5" />
            <span className="text-sm">Bagikan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
