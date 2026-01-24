"use client";

import { StatusBar } from "@/components/StatusBar";
import { AuthScreen } from "@/components/AuthScreen";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md h-[812px] bg-white rounded-[3rem] shadow-2xl overflow-hidden border-8 border-gray-800">
        <StatusBar />
        <AuthScreen onLogin={() => router.push("/")} />
      </div>
    </div>
  );
}
