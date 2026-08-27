import React from "react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { Settings, LogOut, ShieldCheck } from "lucide-react";
import { logout } from "@/app/actions/auth";
import router from "next/router";
import { Url } from "next/dist/shared/lib/router/router";
const ProfileOnOpen = ({ isProfileOpen }: { isProfileOpen: boolean }) => {
  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };
  return (
    <AnimatePresence>
      {isProfileOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="absolute left-0 top-14 w-56 rounded-2xl border border-red-900/30 bg-[#0a1a2e] p-2 shadow-2xl"
        >
          <div className="mb-2 rounded-xl bg-red-900/20 p-3">
            <p className="text-sm font-bold text-white">د. أحمد حسن سليمان</p>
            <p className="text-xs text-slate-400">admin@dr-ahmed.com</p>
          </div>
          <Link
            href="/settings"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-red-900/20 hover:text-white"
          >
            <Settings className="h-4 w-4 text-[#fbbf24]" />
            الإعدادات
          </Link>
          <Link
            href={
              process.env.NEXT_PUBLIC_MAIN_APP ??
              "https://drahmed-beta.vercel.app/"
            }
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-red-900/20 hover:text-white"
          >
            <ShieldCheck className="h-4 w-4 text-[#fbbf24]" />
            العودة للموقع
          </Link>
          <button
            onClick={handleLogout}
            type="button"
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-900/30 hover:text-red-300"
          >
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileOnOpen;
