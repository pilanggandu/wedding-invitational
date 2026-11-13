"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { AdminAuthView } from "../components/AdminAuthView";

function AdminLoginPageContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/admin");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#1C2434] border-t-transparent animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Memeriksa sesi pengelola...</p>
        </div>
      </div>
    );
  }

  return <AdminAuthView />;
}

export default function AdminLoginPage() {
  return (
    <AuthProvider>
      <React.Suspense
        fallback={
          <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center font-sans">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-[#1C2434] border-t-transparent animate-spin" />
              <p className="text-xs text-slate-500 font-medium">Memuat gerbang masuk...</p>
            </div>
          </div>
        }
      >
        <AdminLoginPageContent />
      </React.Suspense>
    </AuthProvider>
  );
}
