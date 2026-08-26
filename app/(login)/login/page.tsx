"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { User, Lock, LogIn, HeartPulse } from "lucide-react";
import { login } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      toast.error(result.error);
      setIsLoading(false);
      return;
    }

    // Success - redirect happens in server action
    setIsLoading(false);
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a1a2e] via-[#062657] to-[#0b3d7a] p-6">
      {/* Background decoration */}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#b91c1c] to-[#991b1b] shadow-lg shadow-red-500/20 mb-4">
              <HeartPulse className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white">لوحة التحكم</h1>
            <p className="text-sm text-white/60 mt-2">
              تسجيل الدخول للوصول إلى لوحة التحكم
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Doctor Name */}
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-2">
                اسم الطبيب
              </label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="أدخل اسم الطبيب"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-4 pr-10 text-white placeholder:text-white/30 outline-none transition-all focus:border-[#cda558] focus:bg-white/10"
                />
              </div>
            </div>

            {/* Password (Doctor ID) */}
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-2">
                كلمة المرور (معرف الطبيب)
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="أدخل معرف الطبيب"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-4 pr-10 text-white placeholder:text-white/30 outline-none transition-all focus:border-[#cda558] focus:bg-white/10"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#b91c1c] to-[#991b1b] py-4 font-bold text-white shadow-lg shadow-red-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  جاري الدخول...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  تسجيل الدخول
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
