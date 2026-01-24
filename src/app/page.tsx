// // // "use client";

// // // import { useState } from "react";
// // // import { StatusBar } from "@/components/StatusBar";
// // // import { BottomNav } from "@/components/BottomNav";
// // // import { HomeScreen } from "@/components/HomeScreen";
// // // import { RiskAssessmentScreen } from "@/components/RiskAssessmentScreen";
// // // import { EducationScreen } from "@/components/EducationScreen";
// // // import { ProfileScreen } from "@/components/ProfileScreen";
// // // import { AuthScreen } from "@/components/AuthScreen";
// // // import { SchedulingScreen } from "@/components/SchedulingScreen";
// // // import { ResultsScreen } from "@/components/ResultsScreen";
// // // import { NotificationsScreen } from "@/components/NotificationsScreen";
// // // import { AdminDashboard } from "@/components/AdminDashboard";
// // // import type { ScreenName } from "@/types/screen";

// // // export default function Page() {
// // //   const [isAuthenticated, setIsAuthenticated] = useState(false);
// // //   const [isAdmin, setIsAdmin] = useState(false);
// // //   const [activeTab, setActiveTab] = useState<ScreenName>("home");
// // //   const [currentScreen, setCurrentScreen] = useState<ScreenName>("home");

// // //   const handleLogin = () => {
// // //     setIsAuthenticated(true);
// // //   };

// // //   const handleNavigate = (screen: ScreenName) => {
// // //     setCurrentScreen(screen);

// // //     if (["home", "scheduling", "education", "profile"].includes(screen)) {
// // //       setActiveTab(screen);
// // //     }
// // //   };

// // //   const handleTabChange = (tab: ScreenName) => {
// // //     setActiveTab(tab);
// // //     setCurrentScreen(tab);
// // //   };

// // //   const renderScreen = () => {
// // //     if (isAdmin) return <AdminDashboard />;

// // //     switch (currentScreen) {
// // //       case "home":
// // //         return <HomeScreen onNavigate={handleNavigate} />;

// // //       case "checkup":
// // //         return <RiskAssessmentScreen />;

// // //       case "scheduling":
// // //         return (
// // //           <SchedulingScreen
// // //             onScheduleComplete={() => handleNavigate("home")}
// // //           />
// // //         );

// // //       case "education":
// // //         return <EducationScreen />;

// // //       case "results":
// // //         return (<ResultsScreen onBack={() => handleNavigate("home")}
// // //             />);

// // //       case "notifications":
// // //         return (
// // //             <NotificationsScreen
// // //             onBack={() => handleNavigate("home")}
// // //             />
// // //         );


// // //       case "profile":
// // //         return <ProfileScreen />;

// // //       default:
// // //         return <HomeScreen onNavigate={handleNavigate} />;
// // //     }
// // //   };

// // //   // Jika belum login: tampilkan halaman Auth
// // //   if (!isAuthenticated) {
// // //     return (
// // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // //         <div className="w-full max-w-md h-[812px] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border-8 border-gray-800">
// // //           <StatusBar />
// // //           <AuthScreen onLogin={handleLogin} />
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   // Halaman utama setelah login
// // //   return (
// // //     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // //       <div className="w-full max-w-md h-[812px] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border-8 border-gray-800 relative">
// // //         <StatusBar />

// // //         {renderScreen()}

// // //         {!isAdmin && (
// // //           <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
// // //         )}

// // //         {/* Tombol Admin Demo */}
// // //         <button
// // //           onClick={() => setIsAdmin(!isAdmin)}
// // //           className="absolute bottom-24 right-8 bg-purple-600 text-white p-3 rounded-full shadow-lg text-xs z-50"
// // //         >
// // //           {isAdmin ? "User" : "Admin"}
// // //         </button>
// // //       </div>
// // //     </div>
// // //   );
// // // }


// // "use client";

// // import { useState } from "react";
// // import { StatusBar } from "@/components/StatusBar";
// // import { BottomNav } from "@/components/BottomNav";

// // import { HomeScreen } from "@/components/HomeScreen";
// // import { RiskAssessmentScreen } from "@/components/RiskAssessmentScreen";
// // import { EducationScreen } from "@/components/EducationScreen";
// // import { ProfileScreen } from "@/components/ProfileScreen";
// // import { AuthScreen } from "@/components/AuthScreen";
// // import { SchedulingScreen } from "@/components/SchedulingScreen";
// // import { ResultsScreen } from "@/components/ResultsScreen";
// // import { NotificationsScreen } from "@/components/NotificationsScreen";
// // import { AdminDashboard } from "@/components/AdminDashboard";

// // import type { ScreenName } from "@/types/screen";

// // export default function Page() {
// //   const [isAuthenticated, setIsAuthenticated] = useState(false);
// //   const [isAdmin, setIsAdmin] = useState(false);
// //   const [activeTab, setActiveTab] = useState<ScreenName>("home");
// //   const [currentScreen, setCurrentScreen] = useState<ScreenName>("home");

// //   const handleLogin = () => setIsAuthenticated(true);

// //   const handleNavigate = (screen: ScreenName) => {
// //     setCurrentScreen(screen);
// //     if (["home", "scheduling", "education", "profile"].includes(screen)) {
// //       setActiveTab(screen);
// //     }
// //   };

// //   const handleTabChange = (tab: ScreenName) => {
// //     setActiveTab(tab);
// //     setCurrentScreen(tab);
// //   };

// //   const renderMobileScreen = () => {
// //     switch (currentScreen) {
// //       case "home": return <HomeScreen onNavigate={handleNavigate} />;
// //       case "checkup": return <RiskAssessmentScreen />;
// //       case "scheduling": 
// //         return (
// //           <SchedulingScreen onScheduleComplete={() => handleNavigate("home")} />
// //         );
// //       case "education": return <EducationScreen />;
// //       case "results": 
// //         return <ResultsScreen onBack={() => handleNavigate("home")} />;
// //       case "notifications":
// //         return <NotificationsScreen onBack={() => handleNavigate("home")} />;
// //       case "profile": return <ProfileScreen />;

// //       default: return <HomeScreen onNavigate={handleNavigate} />;
// //     }
// //   };

// //   /**
// //    * --------------------------
// //    *  ADMIN FULL PAGE LAYOUT
// //    * --------------------------
// //    */
// //   if (isAuthenticated && isAdmin) {
// //     return (
// //       <div className="min-h-screen bg-gray-50">
// //         {/* Switch Mode Bar */}
// //         <div className="w-full bg-white border-b p-4 flex justify-end">
// //           <button
// //             onClick={() => setIsAdmin(false)}
// //             className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm shadow"
// //           >
// //             Kembali ke User
// //           </button>
// //         </div>

// //         {/* Admin Content */}
// //         <AdminDashboard />
// //       </div>
// //     );
// //   }

// //   /**
// //    * --------------------------
// //    *  AUTH SCREEN
// //    * --------------------------
// //    */
// //   if (!isAuthenticated) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// //         <div className="w-full max-w-md h-[812px] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border-8 border-gray-800">
// //           <StatusBar />
// //           <AuthScreen onLogin={handleLogin} />
// //         </div>
// //       </div>
// //     );
// //   }

// //   /**
// //    * --------------------------
// //    *  MOBILE APP LAYOUT
// //    * --------------------------
// //    */
// //   return (
// //     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">

// //       {/* MOBILE FRAME */}
// //       <div className="relative w-full max-w-md h-[812px] bg-white rounded-[3rem] shadow-2xl overflow-hidden border-8 border-gray-800 flex flex-col">

// //         {/* SWITCH ADMIN/USER – DIPINDAHKAN KE ATAS */}
// //         <div className="absolute top-4 right-4 z-50">
// //           <button
// //             onClick={() => setIsAdmin(true)}
// //             className="px-3 py-1.5 bg-purple-600 text-white rounded-full shadow text-xs"
// //           >
// //             Admin Mode
// //           </button>
// //         </div>

// //         <StatusBar />

// //         {renderMobileScreen()}

// //         <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
// //       </div>
// //     </div>
// //   );
// // }


// "use client";

// import { useState } from "react";
// import { StatusBar } from "@/components/StatusBar";
// import { BottomNav } from "@/components/BottomNav";

// import { HomeScreen } from "@/components/HomeScreen";
// import { RiskAssessmentScreen } from "@/components/RiskAssessmentScreen";
// import { EducationScreen } from "@/components/EducationScreen";
// import { ProfileScreen } from "@/components/ProfileScreen";
// import { AuthScreen } from "@/components/AuthScreen";
// import { SchedulingScreen } from "@/components/SchedulingScreen";
// import { ResultsScreen } from "@/components/ResultsScreen";
// import { NotificationsScreen } from "@/components/NotificationsScreen";
// import AdminDashboard from "@/components/admin/AdminDashboard";


// import type { ScreenName } from "@/types/screen";

// export default function Page() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [activeTab, setActiveTab] = useState<ScreenName>("home");
//   const [currentScreen, setCurrentScreen] = useState<ScreenName>("home");

//   /* Navigation logic */
//   const handleNavigate = (screen: ScreenName) => {
//     setCurrentScreen(screen);
//     if (["home", "scheduling", "education", "profile"].includes(screen)) {
//       setActiveTab(screen);
//     }
//   };

//   const renderMobileScreen = () => {
//     switch (currentScreen) {
//       case "home":
//         return (
//           <HomeScreen
//             onNavigate={handleNavigate}
//             onAdminTrigger={() => setIsAdmin(true)}
//           />
//         );

//       case "checkup": return <RiskAssessmentScreen />;
//       case "scheduling": 
//         return <SchedulingScreen onScheduleComplete={() => handleNavigate("home")} />;
//       case "education": return <EducationScreen />;
//       case "results": return <ResultsScreen onBack={() => handleNavigate("home")} />;
//       case "notifications": return <NotificationsScreen onBack={() => handleNavigate("home")} />;
//       case "profile": return <ProfileScreen />;
//       default: return <HomeScreen onNavigate={handleNavigate} />;
//     }
//   };

//   /* AUTH SCREEN */
//   if (!isAuthenticated) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-6 p-4">
        
//         {/* Tombol demo di luar frame */}
//         <button
//           onClick={() => setIsAuthenticated(true)}
//           className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm shadow"
//         >
//           Login Demo
//         </button>

//         {/* Frame mobile */}
//         <div className="w-full max-w-md h-[812px] bg-white rounded-[3rem] border-8 border-gray-800 shadow-xl overflow-hidden flex flex-col">
//           <StatusBar />
//           <div className="flex-1 overflow-y-auto">
//             <AuthScreen onLogin={() => setIsAuthenticated(true)} />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   /* ADMIN FULLSCREEN */
//   if (isAdmin) {
//     return (
//       <div className="min-h-screen bg-gray-100">

//         {/* Tombol kembali di luar frame */}
//         <div className="w-full p-4 bg-white border-b flex justify-end">
//           <button
//             onClick={() => setIsAdmin(false)}
//             className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm shadow"
//           >
//             Kembali ke User
//           </button>
//         </div>

//         <AdminDashboard onLogout={function (): void {
//           throw new Error("Function not implemented.");
//         } } />
//       </div>
//     );
//   }

//   /* MOBILE UI */
//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col items-center gap-6 p-6">

//       {/* TOMBOL DI LUAR FRAME — bebas, tidak mengganggu UI */}
//       <div className="flex gap-3">
//         <button
//           onClick={() => setIsAdmin(true)}
//           className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm shadow"
//         >
//           Admin Mode
//         </button>

//         <button
//           onClick={() => setIsAuthenticated(false)}
//           className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg text-sm shadow"
//         >
//           Logout
//         </button>
//       </div>

//       {/* FRAME DEVICE */}
//       <div className="w-full max-w-md h-[812px] bg-white rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden flex flex-col">
//         <StatusBar />
//         <div className="flex-1 overflow-y-auto">
//           {renderMobileScreen()}
//         </div>

//         <BottomNav activeTab={activeTab} onTabChange={handleNavigate} />
//       </div>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { StatusBar } from "@/components/StatusBar";
import { BottomNav } from "@/components/BottomNav";

import { HomeScreen } from "@/components/HomeScreen";
import { RiskAssessmentScreen } from "@/components/RiskAssessmentScreen";
import { EducationScreen } from "@/components/EducationScreen";
import { ProfileScreen } from "@/components/ProfileScreen";
import { AuthScreen } from "@/components/AuthScreen";
import { SchedulingScreen } from "@/components/SchedulingScreen";
import { ResultsScreen } from "@/components/ResultsScreen";
import { NotificationsScreen } from "@/components/NotificationsScreen";
import AdminDashboard from "@/components/admin/AdminDashboard";

import type { ScreenName } from "@/types/screen";

export default function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<ScreenName>("home");
  const [currentScreen, setCurrentScreen] = useState<ScreenName>("home");

  /* Navigation logic */
  const handleNavigate = (screen: ScreenName) => {
    setCurrentScreen(screen);
    if (["home", "scheduling", "education", "profile"].includes(screen)) {
      setActiveTab(screen);
    }
  };

  const renderMobileScreen = () => {
    switch (currentScreen) {
      case "home":
        return (
          <HomeScreen
            onNavigate={handleNavigate}
            onAdminTrigger={() => setIsAdmin(true)}
          />
        );

      case "checkup":
        return <RiskAssessmentScreen />;

      case "scheduling":
        return (
          <SchedulingScreen onScheduleComplete={() => handleNavigate("home")} />
        );

      case "education":
        return <EducationScreen />;

      case "results":
        return <ResultsScreen onBack={() => handleNavigate("home")} />;

      case "notifications":
        return <NotificationsScreen onBack={() => handleNavigate("home")} />;

      case "profile":
        return <ProfileScreen />;

      default:
        return <HomeScreen onNavigate={handleNavigate} />;
    }
  };

  /* AUTH SCREEN */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-6 p-4">

        {/* Tombol demo di luar frame */}
        <button
          onClick={() => setIsAuthenticated(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm shadow"
        >
          Login Demo
        </button>

        {/* Frame mobile */}
        <div className="w-full max-w-md h-250 bg-white rounded-[3rem] border-8 border-gray-800 shadow-xl overflow-hidden flex flex-col">
          <StatusBar />

          {/* --- Tambahan wrapper scroll agar tampilan login bisa scroll --- */}
          <div className="flex-1">
            <AuthScreen onLogin={() => setIsAuthenticated(true)} />
          </div>

        </div>
      </div>
    );
  }

  /* ADMIN FULLSCREEN */
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100">

        {/* Tombol kembali di luar frame */}
        <div className="w-full p-4 bg-white border-b flex justify-end">
          <button
            onClick={() => setIsAdmin(false)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm shadow"
          >
            Kembali ke User
          </button>
        </div>

        <AdminDashboard
          onLogout={() => {
            setIsAuthenticated(false);
            setIsAdmin(false);
          }}
        />
      </div>
    );
  }

  /* MOBILE UI */
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center gap-6 p-6">

      {/* TOMBOL DI LUAR FRAME */}
      <div className="flex gap-3">
        <button
          onClick={() => setIsAdmin(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm shadow"
        >
          Admin Mode
        </button>

        <button
          onClick={() => setIsAuthenticated(false)}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg text-sm shadow"
        >
          Logout
        </button>
      </div>

      {/* FRAME DEVICE */}
      <div className="w-full max-w-md h-250 bg-white rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden flex flex-col">
        <StatusBar />

        {/* Semua screen user scroll di sini */}
        <div className="flex-1 overflow-y-auto">
          {renderMobileScreen()}
        </div>

        <BottomNav activeTab={activeTab} onTabChange={handleNavigate} />
      </div>
    </div>
  );
}
