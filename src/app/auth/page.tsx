"use client";

import AdminLogin from "@/components/admin/AdminLogin";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

export default function AuthPage() {
  const router = useRouter();
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/admin");
      }
    });

    return () => unsub();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl  overflow-hidden">
        {/* <StatusBar /> */}
        <AdminLogin onLogin={() => router.push("/admin")} />
      </div>
    </div>
  );
}
