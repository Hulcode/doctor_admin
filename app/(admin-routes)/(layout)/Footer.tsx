"use client";

import { ShieldCheck, Activity, Database, Server, Lock } from "lucide-react";

const AdminFooter = () => {
  return (
    <footer
      dir="rtl"
      className="relative border-t border-slate-800 bg-[#0a1a2e] text-white"
    >
      {/* Top Gold Border */}
      <div className="h-0.5 bg-gradient-to-l from-[#cda558] via-[#e8c97e] to-[#cda558]" />

      <div className="relative mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
        {/* ============================================
            Main Footer Content
        ============================================ */}
        <div className="  ">
          {/* Left Side: System Info */}
          <div className="flex-row flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0b3d7a] to-[#075b9f] shadow-lg shadow-[#075b9f]/20">
                <ShieldCheck className="h-5 w-5 text-[#cda558]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  لوحة تحكم د. أحمد
                </h3>
                <p className="text-xs text-slate-400">نظام إدارة العيادة</p>
              </div>
            </div>

            <p className="text-xs leading-6 text-slate-500">
              نظام متكامل لإدارة المواعيد والمرضى والعمليات القلبية. تم تطويره
              بأحدث التقنيات لضمان أفضل تجربة للمرضى والطاقم الطبي.
            </p>

            {/* System Status */}
            <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/50 p-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
                <span className="text-xs font-semibold text-emerald-400">
                  النظام يعمل
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-xs text-slate-400">
                  قاعدة البيانات متصلة
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Server className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-xs text-slate-400">الخادم: v2.4.1</span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================
            Bottom Copyright Bar
        ============================================ */}
        <div className="mt-8 flex  items-center justify-between gap-4 border-t border-slate-800 pt-6 ">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} لوحة تحكم د. أحمد حسن سليمان - جميع
            الحقوق محفوظة
          </p>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <Lock className="h-3 w-3" />
              اتصال آمن SSL
            </span>
            <span className="text-slate-700">•</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <Activity className="h-3 w-3" />
              الإصدار 2.4.1
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
