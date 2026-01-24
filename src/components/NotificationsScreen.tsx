// import { Bell, Calendar, FileText, AlertCircle, CheckCircle, X } from "lucide-react";

// export function NotificationsScreen() {
//   const notifications = [
//     {
//       id: "1",
//       type: "reminder",
//       title: "Pengingat Jadwal Skrining",
//       message: "Jadwal skrining IVA Anda 2 hari lagi (15 Des 2024, 09:00)",
//       time: "2 jam yang lalu",
//       read: false,
//       icon: Calendar,
//       color: "bg-accent-100 text-accent-600",
//     },
//     {
//       id: "2",
//       type: "result",
//       title: "Hasil Pemeriksaan Tersedia",
//       message: "Hasil skrining IVA Anda sudah dapat dilihat",
//       time: "1 hari yang lalu",
//       read: false,
//       icon: FileText,
//       color: "bg-primary-100 text-primary-600",
//     },
//     {
//       id: "3",
//       type: "education",
//       title: "Artikel Baru: Tips Pencegahan",
//       message: "Baca artikel terbaru tentang pencegahan kanker serviks",
//       time: "2 hari yang lalu",
//       read: true,
//       icon: Bell,
//       color: "bg-warning-100 text-warning-600",
//     },
//     {
//       id: "4",
//       type: "success",
//       title: "Jadwal Berhasil Dibuat",
//       message: "Jadwal skrining IVA Anda telah dikonfirmasi",
//       time: "3 hari yang lalu",
//       read: true,
//       icon: CheckCircle,
//       color: "bg-success-100 text-success-600",
//     },
//     {
//       id: "5",
//       type: "alert",
//       title: "Update Vaksin HPV",
//       message: "Saatnya untuk dosis vaksin HPV lanjutan Anda",
//       time: "5 hari yang lalu",
//       read: true,
//       icon: AlertCircle,
//       color: "bg-red-100 text-red-600",
//     },
//   ];

//   return (
//     <div className="flex-1 flex flex-col bg-gray-50">
//       {/* Header */}
//       <div className="bg-white px-6 pt-6 pb-4 border-b border-gray-200">
//         <div className="flex items-center justify-between">
//           <h2 className="text-gray-900">Notifikasi</h2>
//           <button className="text-primary-600 text-sm hover:underline">
//             Tandai Semua Dibaca
//           </button>
//         </div>
//       </div>

//       {/* Notifications List */}
//       <div className="flex-1 overflow-y-auto">
//         {/* Unread Notifications */}
//         <div className="px-6 py-4">
//           <h3 className="text-gray-700 text-sm mb-3">Baru</h3>
//           {notifications
//             .filter((n) => !n.read)
//             .map((notification) => {
//               const Icon = notification.icon;
//               return (
//                 <div
//                   key={notification.id}
//                   className="bg-white rounded-2xl p-4 mb-3 border-l-4 border-primary-600 shadow-sm"
//                 >
//                   <div className="flex items-start gap-3">
//                     <div
//                       className={`w-10 h-10 ${notification.color} rounded-full flex items-center justify-center flex-shrink-0`}
//                     >
//                       <Icon className="w-5 h-5" />
//                     </div>
//                     <div className="flex-1">
//                       <div className="flex items-start justify-between mb-1">
//                         <h4 className="text-gray-900 text-sm pr-2">
//                           {notification.title}
//                         </h4>
//                         <button className="text-gray-400 hover:text-gray-600">
//                           <X className="w-4 h-4" />
//                         </button>
//                       </div>
//                       <p className="text-gray-600 text-xs mb-2">
//                         {notification.message}
//                       </p>
//                       <span className="text-xs text-gray-500">
//                         {notification.time}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//         </div>

//         {/* Read Notifications */}
//         <div className="px-6 py-4 bg-gray-50">
//           <h3 className="text-gray-700 text-sm mb-3">Sebelumnya</h3>
//           {notifications
//             .filter((n) => n.read)
//             .map((notification) => {
//               const Icon = notification.icon;
//               return (
//                 <div
//                   key={notification.id}
//                   className="bg-white rounded-2xl p-4 mb-3 border border-gray-100"
//                 >
//                   <div className="flex items-start gap-3">
//                     <div
//                       className={`w-10 h-10 ${notification.color} rounded-full flex items-center justify-center flex-shrink-0 opacity-60`}
//                     >
//                       <Icon className="w-5 h-5" />
//                     </div>
//                     <div className="flex-1 opacity-75">
//                       <div className="flex items-start justify-between mb-1">
//                         <h4 className="text-gray-900 text-sm pr-2">
//                           {notification.title}
//                         </h4>
//                         <button className="text-gray-400 hover:text-gray-600">
//                           <X className="w-4 h-4" />
//                         </button>
//                       </div>
//                       <p className="text-gray-600 text-xs mb-2">
//                         {notification.message}
//                       </p>
//                       <span className="text-xs text-gray-500">
//                         {notification.time}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//         </div>

//         {/* Empty State */}
//         {notifications.length === 0 && (
//           <div className="flex flex-col items-center justify-center py-16 px-6">
//             <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
//               <Bell className="w-12 h-12 text-gray-400" />
//             </div>
//             <h3 className="text-gray-900 mb-2">Tidak Ada Notifikasi</h3>
//             <p className="text-gray-500 text-sm text-center">
//               Anda akan menerima notifikasi tentang jadwal, hasil, dan
//               pengingat di sini
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import {
  Bell,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
  X,
  ArrowLeft,
} from "lucide-react";

export function NotificationsScreen({ onBack }: { onBack?: () => void }) {
  const notifications = [
    {
      id: "1",
      type: "reminder",
      title: "Pengingat Jadwal Skrining",
      message: "Jadwal skrining IVA Anda 2 hari lagi (15 Des 2024, 09:00)",
      time: "2 jam yang lalu",
      read: false,
      icon: Calendar,
      color: "bg-accent-100 text-accent-600",
    },
    {
      id: "2",
      type: "result",
      title: "Hasil Pemeriksaan Tersedia",
      message: "Hasil skrining IVA Anda sudah dapat dilihat",
      time: "1 hari yang lalu",
      read: false,
      icon: FileText,
      color: "bg-primary-100 text-primary-600",
    },
    {
      id: "3",
      type: "education",
      title: "Artikel Baru: Tips Pencegahan",
      message: "Baca artikel terbaru tentang pencegahan kanker serviks",
      time: "2 hari yang lalu",
      read: true,
      icon: Bell,
      color: "bg-warning-100 text-warning-600",
    },
    {
      id: "4",
      type: "success",
      title: "Jadwal Berhasil Dibuat",
      message: "Jadwal skrining IVA Anda telah dikonfirmasi",
      time: "3 hari yang lalu",
      read: true,
      icon: CheckCircle,
      color: "bg-success-100 text-success-600",
    },
    {
      id: "5",
      type: "alert",
      title: "Update Vaksin HPV",
      message: "Saatnya untuk dosis vaksin HPV lanjutan Anda",
      time: "5 hari yang lalu",
      read: true,
      icon: AlertCircle,
      color: "bg-red-100 text-red-600",
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 pt-6 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            {/* <span className="text-sm">Kembali</span> */}
          </button>

          <h2 className="text-gray-900 font-semibold">Notifikasi</h2>

          <button className="text-primary-600 text-sm hover:underline">
            Tandai Semua Dibaca
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {/* Unread Notifications */}
        <div className="px-6 py-4">
          <h3 className="text-gray-700 text-sm mb-3">Baru</h3>
          {notifications
            .filter((n) => !n.read)
            .map((notification) => {
              const Icon = notification.icon;
              return (
                <div
                  key={notification.id}
                  className="bg-white rounded-2xl p-4 mb-3 border-l-4 border-primary-600 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 ${notification.color} rounded-full flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="text-gray-900 text-sm pr-2">
                          {notification.title}
                        </h4>
                        <button className="text-gray-400 hover:text-gray-600">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-gray-600 text-xs mb-2">
                        {notification.message}
                      </p>

                      <span className="text-xs text-gray-500">
                        {notification.time}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Read Notifications */}
        <div className="px-6 py-4 bg-gray-50">
          <h3 className="text-gray-700 text-sm mb-3">Sebelumnya</h3>
          {notifications
            .filter((n) => n.read)
            .map((notification) => {
              const Icon = notification.icon;
              return (
                <div
                  key={notification.id}
                  className="bg-white rounded-2xl p-4 mb-3 border border-gray-100"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 ${notification.color} rounded-full flex items-center justify-center flex-shrink-0 opacity-60`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 opacity-75">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="text-gray-900 text-sm pr-2">
                          {notification.title}
                        </h4>
                        <button className="text-gray-400 hover:text-gray-600">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-gray-600 text-xs mb-2">
                        {notification.message}
                      </p>

                      <span className="text-xs text-gray-500">
                        {notification.time}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Empty State */}
        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-gray-900 mb-2">Tidak Ada Notifikasi</h3>
            <p className="text-gray-500 text-sm text-center">
              Anda akan menerima notifikasi tentang jadwal, hasil, dan
              pengingat di sini
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
