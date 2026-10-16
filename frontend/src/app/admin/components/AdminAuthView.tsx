"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Lock,
  User,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  Mail,
  UserPlus,
  LogIn,
  HeartHandshake,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type AuthMode = "login" | "register";

export function AdminAuthView() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");

  // Form states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        const res = await login(username.trim(), password);
        if (!res.success) {
          setErrorMessage(res.error || "Username atau kata sandi tidak sesuai.");
        }
      } else {
        if (!fullName.trim()) {
          setErrorMessage("Nama lengkap wajib diisi.");
          setIsSubmitting(false);
          return;
        }

        const res = await register({
          username: username.trim(),
          password,
          fullName: fullName.trim(),
          email: email.trim() || undefined,
        });

        if (!res.success) {
          setErrorMessage(res.error || "Gagal mendaftarkan akun baru.");
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Terjadi kesalahan saat memproses permintaan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDefaultAdmin = () => {
    setUsername("admin");
    setPassword("admin123");
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 via-zinc-50 to-zinc-100 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md">
        {/* Top Header Card */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-zinc-900 text-white flex items-center justify-center font-bold text-base shadow-md mb-3">
            <HeartHandshake className="w-6 h-6 text-zinc-200" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            Dashboard Pengelola Undangan
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Sistem Manajemen &amp; Personalisasi Undangan Pernikahan
          </p>
        </div>

        {/* Auth Box */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-xl overflow-hidden">
          {/* Tab Selection */}
          <div className="grid grid-cols-2 border-b border-zinc-200 bg-zinc-50/70 p-1">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setErrorMessage(null);
              }}
              className={`py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                mode === "login"
                  ? "bg-white text-zinc-900 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setErrorMessage(null);
              }}
              className={`py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                mode === "register"
                  ? "bg-white text-zinc-900 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Daftar Akun</span>
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {/* Quick helper banner for default credentials */}
            {mode === "login" && (
              <div className="mb-5 p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-900 flex items-start justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <p className="font-semibold text-amber-950 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>Akun Administrator Bawaan:</span>
                  </p>
                  <p className="text-[11px] text-amber-800">
                    Username: <span className="font-mono font-bold">admin</span> • Sandi: <span className="font-mono font-bold">admin123</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fillDefaultAdmin}
                  className="px-2 py-1 rounded bg-amber-200/60 hover:bg-amber-200 text-amber-900 text-[10px] font-semibold transition-colors shrink-0 cursor-pointer"
                >
                  Gunakan
                </button>
              </div>
            )}

            {/* Error banner */}
            {errorMessage && (
              <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Extra field for registration */}
              {mode === "register" && (
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Contoh: Salsa Nanda"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition-colors"
                    />
                    <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
                  </div>
                </div>
              )}

              {/* Username field */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={mode === "login" ? "admin atau username Anda" : "Contoh: admin_pernikahan"}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition-colors"
                  />
                  <KeyRound className="w-4 h-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Email field for registration */}
              {mode === "register" && (
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Email <span className="text-zinc-400 font-normal">(Opsional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@wedding.local"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition-colors"
                    />
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
                  </div>
                </div>
              )}

              {/* Password field */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Kata Sandi
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === "login" ? "admin123" : "Minimal 6 karakter"}
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition-colors"
                  />
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 p-0.5 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
                    title={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer mt-2"
              >
                {isSubmitting ? (
                  <span>Memproses...</span>
                ) : mode === "login" ? (
                  <>
                    <span>Masuk ke Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    <span>Daftarkan Akun &amp; Masuk</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link
            href="/undangan"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Halaman Undangan Tamu</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
