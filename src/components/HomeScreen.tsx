// // import { 
// //   AlertCircle, 
// //   Activity, 
// //   Calendar, 
// //   BookOpen,
// //   TrendingUp,
// //   Shield,
// //   ChevronRight,
// //   Heart,
// //   Bell
// // } from "lucide-react";
// // import { ImageWithFallback } from "./figma/ImageWithFallback";

// // import type { ScreenName } from "@/types/screen";

// // interface HomeScreenProps {
// //   onNavigate?: (screen: ScreenName) => void;
// // }



// // export function HomeScreen({ onNavigate }: HomeScreenProps) {
// //   return (
// //     <div className="flex-1 overflow-y-auto bg-gradient-to-b from-primary-50 to-white">
// //       {/* Header Section */}
// //       <div className="bg-primary-600 rounded-b-3xl px-6 pt-6 pb-8 text-white">
// //         <div className="flex items-center justify-between mb-6">
// //           <div>
// //             <p className="text-primary-100 text-sm">Selamat Datang</p>
// //             <h2 className="text-white mt-1">Siti Rahayu</h2>
// //           </div>
// //           <div className="flex items-center gap-3">
// //             <button 
// //               onClick={() => onNavigate?.('notifications')}
// //               className="relative w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center"
// //             >
// //               <Bell className="w-5 h-5 text-white" />
// //               <span className="absolute top-0 right-0 w-2 h-2 bg-accent-500 rounded-full"></span>
// //             </button>
// //             <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
// //               <span className="text-sm">SR</span>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Status Card */}
// //         <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
// //           <div className="flex items-center gap-3">
// //             <div className="w-12 h-12 bg-success-500 rounded-full flex items-center justify-center">
// //               <Shield className="w-6 h-6 text-white" />
// //             </div>
// //             <div className="flex-1">
// //               <p className="text-sm text-primary-100">Status Kesehatan</p>
// //               <p className="text-white mt-0.5">Risiko Rendah</p>
// //             </div>
// //             <TrendingUp className="w-5 h-5 text-success-400" />
// //           </div>
// //         </div>
// //       </div>

// //       {/* Quick Actions */}
// //       <div className="px-6 mt-6">
// //         <h3 className="text-gray-900 mb-4">Aksi Cepat</h3>
// //         <div className="grid grid-cols-2 gap-4">
// //           <button 
// //             onClick={() => onNavigate?.('checkup')}
// //             className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
// //             <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center mb-3">
// //               <Activity className="w-6 h-6 text-accent-600" />
// //             </div>
// //             <p className="text-gray-900">Cek Risiko</p>
// //             <p className="text-xs text-gray-500 mt-1">Penilaian kesehatan</p>
// //           </button>

// //           <button 
// //             onClick={() => onNavigate?.('scheduling')}
// //             className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
// //             <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-3">
// //               <Calendar className="w-6 h-6 text-primary-600" />
// //             </div>
// //             <p className="text-gray-900">Jadwal Cek</p>
// //             <p className="text-xs text-gray-500 mt-1">Buat janji temu</p>
// //           </button>

// //           <button 
// //             onClick={() => onNavigate?.('education')}
// //             className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
// //             <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center mb-3">
// //               <BookOpen className="w-6 h-6 text-warning-600" />
// //             </div>
// //             <p className="text-gray-900">Edukasi</p>
// //             <p className="text-xs text-gray-500 mt-1">Pelajari lebih lanjut</p>
// //           </button>

// //           <button 
// //             onClick={() => onNavigate?.('results')}
// //             className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
// //             <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-3">
// //               <Heart className="w-6 h-6 text-pink-600" />
// //             </div>
// //             <p className="text-gray-900">Riwayat</p>
// //             <p className="text-xs text-gray-500 mt-1">Lihat catatan</p>
// //           </button>
// //         </div>
// //       </div>

// //       {/* Health Tips */}
// //       <div className="px-6 mt-8">
// //         <div className="flex items-center justify-between mb-4">
// //           <h3 className="text-gray-900">Tips Kesehatan</h3>
// //           <button className="text-primary-600 text-sm flex items-center gap-1">
// //             Lihat Semua
// //             <ChevronRight className="w-4 h-4" />
// //           </button>
// //         </div>

// //         <div className="space-y-3">
// //           <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
// //             <div className="h-32 bg-gradient-to-br from-primary-400 to-primary-600 relative overflow-hidden">
// //               <ImageWithFallback 
// //                 src="https://images.unsplash.com/photo-1638202993928-7267aad84c31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwaGVhbHRoY2FyZSUyMHdvbWFufGVufDF8fHx8MTc2NDE0MTU2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
// //                 alt="Health tips"
// //                 className="w-full h-full object-cover opacity-80"
// //               />
// //             </div>
// //             <div className="p-4">
// //               <h4 className="text-gray-900 mb-2">Pentingnya Deteksi Dini</h4>
// //               <p className="text-gray-600 text-xs mb-3">
// //                 Deteksi dini kanker serviks dapat meningkatkan peluang kesembuhan hingga 90%
// //               </p>
// //               <div className="flex items-center justify-between">
// //                 <span className="text-xs text-gray-500">5 min baca</span>
// //                 <button className="text-primary-600 text-sm">Baca Selengkapnya</button>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="bg-gradient-to-r from-accent-50 to-warning-50 rounded-2xl p-4 border border-accent-100">
// //             <div className="flex items-start gap-3">
// //               <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
// //                 <AlertCircle className="w-5 h-5 text-accent-600" />
// //               </div>
// //               <div className="flex-1">
// //                 <h4 className="text-gray-900 mb-1">Pengingat Pemeriksaan</h4>
// //                 <p className="text-gray-600 text-xs">
// //                   Jadwal pemeriksaan rutin Anda dalam 2 minggu. Jangan lupa untuk datang tepat waktu.
// //                 </p>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       <div className="h-8"></div>
// //     </div>
// //   );
// // }


// import {
//   AlertCircle,
//   Activity,
//   Calendar,
//   BookOpen,
//   TrendingUp,
//   Shield,
//   ChevronRight,
//   Heart,
//   Bell
// } from "lucide-react";
// import { ImageWithFallback } from "./figma/ImageWithFallback";
// import type { ScreenName } from "@/types/screen";

// interface HomeScreenProps {
//   onNavigate?: (screen: ScreenName) => void;
// }

// export function HomeScreen({ onNavigate }: HomeScreenProps) {
//   return (
//     <div className="flex-1 overflow-y-auto bg-gray-50">

//       {/* HEADER */}
//       <div className="bg-primary-600 px-6 pt-8 pb-10 rounded-b-3xl text-white shadow-md">
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <p className="text-primary-100 text-sm">Selamat Datang</p>
//             <h2 className="text-lg font-semibold mt-1">Siti Rahayu</h2>
//           </div>

//           <div className="flex items-center gap-3">
//             {/* NOTIF BUTTON */}
//             <button
//               onClick={() => onNavigate?.("notifications")}
//               className="relative w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition"
//             >
//               <Bell className="w-5 h-5 text-white" />
//               <span className="absolute top-0 right-0 w-2 h-2 bg-accent-500 rounded-full"></span>
//             </button>

//             {/* PROFILE INITIAL */}
//             <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center font-medium">
//               SR
//             </div>
//           </div>
//         </div>

//         {/* STATUS CARD */}
//         <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-sm">
//           <div className="flex items-center gap-3">
//             <div className="w-12 h-12 bg-success-500 rounded-full flex items-center justify-center shadow-sm">
//               <Shield className="w-6 h-6 text-white" />
//             </div>

//             <div className="flex-1">
//               <p className="text-primary-100 text-xs">Status Kesehatan</p>
//               <p className="text-white mt-1 font-medium">Risiko Rendah</p>
//             </div>

//             <TrendingUp className="w-5 h-5 text-success-300" />
//           </div>
//         </div>
//       </div>

//       {/* QUICK ACTIONS */}
//       <div className="px-6 mt-8">
//         <h3 className="text-gray-900 font-semibold text-base mb-4">Aksi Cepat</h3>

//         <div className="grid grid-cols-2 gap-4">

//           {/* ITEM */}
//           <button
//             onClick={() => onNavigate?.("checkup")}
//             className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-100"
//           >
//             <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center mb-3">
//               <Activity className="w-6 h-6 text-accent-600" />
//             </div>
//             <p className="text-gray-900 font-medium">Cek Risiko</p>
//             <p className="text-xs text-gray-500 mt-1">Penilaian kesehatan</p>
//           </button>

//           <button
//             onClick={() => onNavigate?.("scheduling")}
//             className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-100"
//           >
//             <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-3">
//               <Calendar className="w-6 h-6 text-primary-600" />
//             </div>
//             <p className="text-gray-900 font-medium">Jadwal Cek</p>
//             <p className="text-xs text-gray-500 mt-1">Buat janji temu</p>
//           </button>

//           <button
//             onClick={() => onNavigate?.("education")}
//             className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-100"
//           >
//             <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center mb-3">
//               <BookOpen className="w-6 h-6 text-warning-600" />
//             </div>
//             <p className="text-gray-900 font-medium">Edukasi</p>
//             <p className="text-xs text-gray-500 mt-1">Pelajari lebih lanjut</p>
//           </button>

//           <button
//             onClick={() => onNavigate?.("results")}
//             className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-100"
//           >
//             <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-3">
//               <Heart className="w-6 h-6 text-pink-600" />
//             </div>
//             <p className="text-gray-900 font-medium">Riwayat</p>
//             <p className="text-xs text-gray-500 mt-1">Lihat catatan</p>
//           </button>
//         </div>
//       </div>

//       {/* HEALTH TIPS */}
//       <div className="px-6 mt-10">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-gray-900 font-semibold text-base">Tips Kesehatan</h3>
//           <button className="text-primary-600 text-sm flex items-center gap-1">
//             Lihat Semua
//             <ChevronRight className="w-4 h-4" />
//           </button>
//         </div>

//         <div className="space-y-4">

//           {/* ARTICLE CARD */}
//           <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
//             <div className="h-32 relative">
//               <ImageWithFallback
//                 src="https://images.unsplash.com/photo-1638202993928-7267aad84c31?auto=format&q=80"
//                 alt="Health Tips"
//                 className="w-full h-full object-cover"
//               />
//               <div className="absolute inset-0 bg-black/20"></div>
//             </div>

//             <div className="p-4">
//               <h4 className="text-gray-900 font-medium mb-1">Pentingnya Deteksi Dini</h4>
//               <p className="text-gray-600 text-xs mb-3">
//                 Deteksi dini kanker serviks dapat meningkatkan peluang kesembuhan hingga 90%
//               </p>
//               <div className="flex items-center justify-between">
//                 <span className="text-xs text-gray-500">5 min baca</span>
//                 <button className="text-primary-600 text-sm font-medium">
//                   Baca Selengkapnya
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* REMINDER CARD */}
//           <div className="bg-gradient-to-r from-accent-50 to-warning-50 rounded-2xl p-4 border border-accent-100">
//             <div className="flex items-start gap-3">
//               <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
//                 <AlertCircle className="w-5 h-5 text-accent-600" />
//               </div>

//               <div className="flex-1">
//                 <h4 className="text-gray-900 font-medium mb-1">Pengingat Pemeriksaan</h4>
//                 <p className="text-gray-600 text-xs leading-relaxed">
//                   Jadwal pemeriksaan rutin Anda dalam 2 minggu. Jangan lupa datang tepat waktu.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="h-10" />
//     </div>
//   );
// }


import {
  AlertCircle,
  Activity,
  Calendar,
  BookOpen,
  TrendingUp,
  Shield,
  ChevronRight,
  Heart,
  Bell
} from "lucide-react";
import { ImageWithFallback } from "./ui/ImageWithFallback";
import { useRef } from "react";
import type { ScreenName } from "@/types/screen";

interface HomeScreenProps {
  onNavigate?: (screen: ScreenName) => void;
  onAdminTrigger?: () => void;
}

export function HomeScreen({ onNavigate, onAdminTrigger }: HomeScreenProps) {
  const tapCountRef = useRef(0);
  const timeoutRef = useRef<any>(null);

  const handleSecretTap = () => {
    tapCountRef.current += 1;

    // Reset setelah 1 detik tidak mengetuk
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, 1000);

    // Jika tap mencapai 5x → masuk admin mode
    if (tapCountRef.current >= 5) {
      tapCountRef.current = 0;
      onAdminTrigger?.();
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">

      {/* HEADER */}
      <div className="bg-primary-600 px-6 pt-8 pb-10 rounded-b-3xl text-white shadow-md">

        <div className="flex items-center justify-between mb-6">

          {/* SECRET TAP AREA (Nama user) */}
          <div onClick={handleSecretTap} className="active:opacity-70 select-none cursor-pointer">
            <p className="text-primary-100 text-sm">Selamat Datang</p>
            <h2 className="text-lg font-semibold mt-1">Oktaliza</h2>
          </div>

          <div className="flex items-center gap-3">

            {/* NOTIF BUTTON */}
            <button
              onClick={() => onNavigate?.("notifications")}
              className="relative w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition"
            >
              <Bell className="w-5 h-5 text-white" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-accent-500 rounded-full"></span>
            </button>

            {/* PROFILE INITIAL */}
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center font-medium">
              O
            </div>
          </div>
        </div>

        {/* STATUS CARD */}
        <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-success-500 rounded-full flex items-center justify-center shadow-sm">
              <Shield className="w-6 h-6 text-white" />
            </div>

            <div className="flex-1">
              <p className="text-primary-100 text-xs">Status Kesehatan</p>
              <p className="text-white mt-1 font-medium">Risiko Rendah</p>
            </div>

            <TrendingUp className="w-5 h-5 text-success-300" />
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="px-6 mt-8">
        <h3 className="text-gray-900 font-semibold text-base mb-4">Aksi Cepat</h3>

        <div className="grid grid-cols-2 gap-4">
          {/* (4 tombol seperti sebelumnya — tanpa perubahan) */}

          <button
            onClick={() => onNavigate?.("checkup")}
            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-100"
          >
            <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center mb-3">
              <Activity className="w-6 h-6 text-accent-600" />
            </div>
            <p className="text-gray-900 font-medium">Cek Risiko</p>
            <p className="text-xs text-gray-500 mt-1">Penilaian kesehatan</p>
          </button>

          <button
            onClick={() => onNavigate?.("scheduling")}
            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-100"
          >
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-3">
              <Calendar className="w-6 h-6 text-primary-600" />
            </div>
            <p className="text-gray-900 font-medium">Jadwal Cek</p>
            <p className="text-xs text-gray-500 mt-1">Buat janji temu</p>
          </button>

          <button
            onClick={() => onNavigate?.("education")}
            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-100"
          >
            <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center mb-3">
              <BookOpen className="w-6 h-6 text-warning-600" />
            </div>
            <p className="text-gray-900 font-medium">Edukasi</p>
            <p className="text-xs text-gray-500 mt-1">Pelajari lebih lanjut</p>
          </button>

          <button
            onClick={() => onNavigate?.("results")}
            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-100"
          >
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-3">
              <Heart className="w-6 h-6 text-pink-600" />
            </div>
            <p className="text-gray-900 font-medium">Riwayat</p>
            <p className="text-xs text-gray-500 mt-1">Lihat catatan</p>
          </button>
        </div>
      </div>

      {/* HEALTH TIPS */}
      <div className="px-6 mt-10">
        {/* ... seperti sebelumnya ... */}
      </div>

      <div className="h-10" />
    </div>
  );
}
