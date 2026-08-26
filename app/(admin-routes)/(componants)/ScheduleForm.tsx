"use client";

import React, { useState } from "react";
import { Save, Clock, CalendarDays } from "lucide-react";
import { formatTime } from "@/lib/helper";
import TimeTableDayCard from "./TimeTableDayCard";
import { setSchedule as putSchedule } from "@/app/actions/schedule";
import toast from "react-hot-toast";

interface DaySchedule {
  day: string;
  isEnabled: boolean;
  startTime: number;
  endTime: number;
  slotDuration: number;
}

const generateTimeSlots = (
  startMinutes: number,
  endMinutes: number,
  duration: number,
) => {
  const slots: string[] = [];
  for (let i = startMinutes; i < endMinutes; i += duration) {
    slots.push(formatTime(i));
  }
  return slots;
};

const ScheduleForm = ({
  initialSchedule,
  doctorId,
}: {
  initialSchedule: DaySchedule[];
  doctorId: string;
}) => {
  const [schedule, setSchedule] = useState<DaySchedule[]>(initialSchedule);
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);

    const result = await putSchedule(schedule, doctorId);

    if (result?.error) {
      toast.error(result.error);
      setIsLoading(false);
      return;
    }

    if (result?.success) {
      toast.success("تم حفظ الجدول بنجاح! 🎉");
      setSaved(true);
      setIsLoading(false);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const enabledDays = schedule.filter((day) => day.isEnabled).length;

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* Page Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-black text-[#062657] lg:text-3xl">
              إعدادات مواعيد العمل
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              حدد أوقات العمل لكل يوم من أيام الأسبوع أو اجعل اليوم عطلة.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#b91c1c] to-[#991b1b] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isLoading
              ? "جاري الحفظ..."
              : saved
                ? "تم الحفظ!"
                : "حفظ الإعدادات"}
          </button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <CalendarDays className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">أيام العمل</p>
                <p className="text-2xl font-black text-[#062657]">
                  {enabledDays} / 7
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                <Clock className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">متوسط ساعات العمل</p>
                <p className="text-2xl font-black text-[#062657]">
                  {enabledDays > 0
                    ? Math.round(
                        schedule.reduce(
                          (acc, day) =>
                            acc +
                            (day.isEnabled
                              ? (day.endTime - day.startTime) / 60
                              : 0),
                          0,
                        ) / enabledDays,
                      )
                    : 0}{" "}
                  ساعات
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">مدة الموعد</p>
                <p className="text-2xl font-black text-[#062657]">
                  {schedule.find((d) => d.isEnabled)?.slotDuration || 30} دقيقة
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Schedule Grid */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-6">
            <h2 className="text-lg font-bold text-[#062657]">جدول الأسبوع</h2>
            <p className="mt-1 text-xs text-slate-400">
              فعّل اليوم لتحديد أوقات العمل، أو عطله ليكون "يومًا حرًا".
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {schedule.map((day, index) => {
              const slots = day.isEnabled
                ? generateTimeSlots(
                    day.startTime,
                    day.endTime,
                    day.slotDuration,
                  )
                : [];

              return (
                <TimeTableDayCard
                  key={index}
                  slots={slots}
                  day={day}
                  index={index}
                  setSchedule={setSchedule}
                  setSaved={setSaved}
                />
              );
            })}
          </div>
        </div>

        {/* Summary Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#062657] text-white">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#062657]">
                  ملخص الجدول
                </h3>
                <p className="text-xs text-slate-400">
                  سيتم إنشاء المواعيد تلقائيًا بناءً على هذا الجدول
                </p>
              </div>
            </div>
            <div className="flex gap-4 text-center">
              <div>
                <p className="text-xl font-black text-[#062657]">
                  {enabledDays}
                </p>
                <p className="text-xs text-slate-400">أيام مفتوحة</p>
              </div>
              <div className="border-r border-slate-200 pr-4">
                <p className="text-xl font-black text-[#062657]">
                  {7 - enabledDays}
                </p>
                <p className="text-xs text-slate-400">أيام عطلة</p>
              </div>
              <div className="border-r border-slate-200 pr-4">
                <p className="text-xl font-black text-emerald-600">
                  {schedule.reduce((total, day) => {
                    if (!day.isEnabled) return total;
                    return (
                      total +
                      generateTimeSlots(
                        day.startTime,
                        day.endTime,
                        day.slotDuration,
                      ).length
                    );
                  }, 0)}
                </p>
                <p className="text-xs text-slate-400">موعد أسبوعي</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleForm;
