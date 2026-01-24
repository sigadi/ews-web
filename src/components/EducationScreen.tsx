import { Search, BookOpen, Video, FileText, ExternalLink } from "lucide-react";
import { ImageWithFallback } from "./ui/ImageWithFallback";
import { useState } from "react";

export function EducationScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  const articles = [
    {
      title: "Apa itu Kanker Serviks?",
      category: "Dasar",
      duration: "5 min baca",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBjb25zdWx0YXRpb258ZW58MXx8fHwxNzY0MTQxNTY0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      type: "article"
    },
    {
      title: "Gejala Awal yang Harus Diwaspadai",
      category: "Gejala",
      duration: "7 min baca",
      image: "https://images.unsplash.com/photo-1638202993928-7267aad84c31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwaGVhbHRoY2FyZSUyMHdvbWFufGVufDF8fHx8MTc2NDE0MTU2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      type: "article"
    },
    {
      title: "Cara Kerja Vaksin HPV",
      category: "Pencegahan",
      duration: "12 min",
      image: "https://images.unsplash.com/photo-1606206873764-fd15e242df52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjQxMDQwNDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      type: "video"
    },
    {
      title: "Prosedur Pap Smear & IVA Test",
      category: "Pemeriksaan",
      duration: "6 min baca",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBjb25zdWx0YXRpb258ZW58MXx8fHwxNzY0MTQxNTY0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      type: "article"
    }
  ];

  const categories = [
    { name: "Semua", icon: BookOpen, color: "bg-primary-100 text-primary-600" },
    { name: "Pencegahan", icon: FileText, color: "bg-success-100 text-success-600" },
    { name: "Gejala", icon: FileText, color: "bg-warning-100 text-warning-600" },
    { name: "Pengobatan", icon: FileText, color: "bg-accent-100 text-accent-600" },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header with Search */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 px-6 pt-6 pb-8 rounded-b-3xl">
        <h2 className="text-white mb-4">Pusat Edukasi</h2>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari artikel, video..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-6 mt-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <button
                key={index}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap ${category.color}`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Article */}
      <div className="px-6 mt-6">
        <h3 className="text-gray-900 mb-4">Artikel Unggulan</h3>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <div className="relative h-48">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1638202993928-7267aad84c31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwaGVhbHRoY2FyZSUyMHdvbWFufGVufDF8fHx8MTc2NDE0MTU2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Featured article"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs">
                Terbaru
              </span>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded">
                Pencegahan
              </span>
              <span className="text-xs text-gray-500">• 8 min baca</span>
            </div>
            <h4 className="text-gray-900 mb-2">
              10 Cara Mencegah Kanker Serviks Sejak Dini
            </h4>
            <p className="text-gray-600 text-xs mb-4">
              Pelajari langkah-langkah pencegahan yang dapat Anda lakukan untuk mengurangi risiko kanker serviks...
            </p>
            <button className="text-primary-600 text-sm flex items-center gap-1">
              Baca Selengkapnya
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="px-6 mt-6">
        <h3 className="text-gray-900 mb-4">Artikel Lainnya</h3>
        <div className="grid grid-cols-1 gap-4">
          {articles.map((article, index) => (
            <button
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex hover:shadow-md transition-shadow"
            >
              <div className="w-24 h-24 flex-shrink-0 bg-gray-200 relative">
                <ImageWithFallback
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
                {article.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 p-3 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-500">• {article.duration}</span>
                </div>
                <h4 className="text-gray-900 text-sm mb-1 line-clamp-2">
                  {article.title}
                </h4>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="px-6 mt-8 mb-6">
        <h3 className="text-gray-900 mb-4">Pertanyaan Umum</h3>
        <div className="space-y-3">
          <details className="bg-white rounded-2xl p-4 border border-gray-100">
            <summary className="cursor-pointer text-gray-900 text-sm list-none flex items-center justify-between">
              Seberapa sering harus melakukan Pap smear?
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </summary>
            <p className="text-gray-600 text-xs mt-3 pl-1">
              Wanita usia 21-65 tahun disarankan melakukan Pap smear setiap 3 tahun sekali, atau sesuai rekomendasi dokter.
            </p>
          </details>
          <details className="bg-white rounded-2xl p-4 border border-gray-100">
            <summary className="cursor-pointer text-gray-900 text-sm list-none flex items-center justify-between">
              Apakah vaksin HPV aman?
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </summary>
            <p className="text-gray-600 text-xs mt-3 pl-1">
              Ya, vaksin HPV telah melalui uji klinis ekstensif dan terbukti aman serta efektif dalam mencegah infeksi HPV.
            </p>
          </details>
          <details className="bg-white rounded-2xl p-4 border border-gray-100">
            <summary className="cursor-pointer text-gray-900 text-sm list-none flex items-center justify-between">
              Apa perbedaan Pap smear dan IVA test?
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </summary>
            <p className="text-gray-600 text-xs mt-3 pl-1">
              Pap smear memeriksa sel serviks di laboratorium, sedangkan IVA test adalah pemeriksaan visual langsung menggunakan asam asetat.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}
