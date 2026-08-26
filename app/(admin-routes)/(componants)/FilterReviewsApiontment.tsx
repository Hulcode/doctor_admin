"use client";

import React from "react";
import { Search, Filter } from "lucide-react";

// ============================================
// TYPES
// ============================================

type Mode = "reviews" | "appointments";

type TimeFilter = "day" | "week" | "month";

interface FilterReviewsAppointmentProps {
  mode: Mode;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: any) => void;
  timeFilter?: TimeFilter;
  setTimeFilter?: (value: TimeFilter) => void;
}

// ============================================
// MAIN COMPONENT
// ============================================

const FilterReviewsAppointment = ({
  mode,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  timeFilter,
  setTimeFilter,
}: FilterReviewsAppointmentProps) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* ============================================
            SEARCH BAR (Works for both modes)
        ============================================ */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              mode === "reviews"
                ? "ابحث بالاسم أو البريد أو التعليق..."
                : "ابحث بالاسم أو رقم الهاتف..."
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-4 pr-10 text-sm outline-none transition-all focus:border-[#075b9f] focus:bg-white focus:ring-4 focus:ring-[#075b9f]/10"
          />
        </div>

        {/* ============================================
            TIME FILTER (Only for Appointments)
        ============================================ */}
        {mode === "appointments" && setTimeFilter && (
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
              {(["day", "week", "month"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                    timeFilter === filter
                      ? "bg-[#062657] text-white shadow-md"
                      : "text-slate-600 hover:bg-white"
                  }`}
                >
                  {filter === "day"
                    ? "اليوم"
                    : filter === "week"
                      ? "الأسبوع"
                      : "الشهر"}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ============================================
            STATUS FILTER (Works for both modes)
        ============================================ */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-[#062657] outline-none transition-all focus:border-[#075b9f] cursor-pointer"
          >
            {mode === "reviews" ? (
              <>
                <option value="all">جميع التقييمات</option>
                <option value="pending">قيد المراجعة</option>
                <option value="approved">مقبولة</option>
                <option value="rejected">مرفوضة</option>
              </>
            ) : (
              <>
                <option value="all">جميع الحالات</option>
                <option value="pending">قيد الانتظار</option>

                <option value="completed">مكتملة</option>
                <option value="cancelled">ملغية</option>
                <option value="blocked">محظورة</option>
              </>
            )}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterReviewsAppointment;
