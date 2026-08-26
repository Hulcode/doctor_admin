"use client";

import { formatTime } from "@/lib/helper";
import React from "react";
import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface DaySchedule {
  day: string;
  isEnabled: boolean;
  startTime: number;
  endTime: number;
  slotDuration: number;
}

const TimeTableDayCard = ({
  slots,
  day,
  index,
  setSchedule,
  setSaved,
}: {
  slots: string[];
  day: DaySchedule;
  index: number;
  setSchedule: React.Dispatch<React.SetStateAction<DaySchedule[]>>;
  setSaved: (arg1: boolean) => void;
}) => {
  const handleToggleDay = (index: number) => {
    setSchedule((prev) =>
      prev.map((day, i) =>
        i === index ? { ...day, isEnabled: !day.isEnabled } : day,
      ),
    );
    setSaved(false);
  };

  const handleSlotDurationChange = (index: number, value: number) => {
    setSchedule((prev) =>
      prev.map((day, i) =>
        i === index ? { ...day, slotDuration: value } : day,
      ),
    );
    setSaved(false);
  };

  const handleRangeChange = (index: number, value: number[]) => {
    setSchedule((prev) =>
      prev.map((day, i) => {
        if (i !== index) return day;
        let newStart = value[0];
        let newEnd = value[1];

        if (newEnd - newStart < 60) {
          if (newStart === day.startTime) {
            newEnd = newStart + 60;
          } else {
            newStart = newEnd - 60;
          }
        }

        return { ...day, startTime: newStart, endTime: newEnd };
      }),
    );
    setSaved(false);
  };

  return (
    <motion.div
      key={day.day}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`p-6 transition-all ${
        day.isEnabled ? "bg-white" : "bg-slate-50/50"
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Day Name + Toggle */}
        <div className="flex items-center gap-4 lg:w-40">
          <button
            onClick={() => handleToggleDay(index)}
            className={`relative flex h-7 w-14 items-center rounded-full transition-colors ${
              day.isEnabled ? "bg-emerald-500" : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute h-5 w-5 rounded-full bg-white shadow-md transition-all ${
                day.isEnabled ? "right-1" : "right-8"
              }`}
            />
          </button>
          <span
            className={`text-sm font-bold ${day.isEnabled ? "text-[#062657]" : "text-slate-400"}`}
          >
            {day.day}
          </span>
          {!day.isEnabled && (
            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-500">
              عطلة
            </span>
          )}
        </div>

        {/* Time Settings with Range Slider */}
        {day.isEnabled ? (
          <div className="flex flex-col gap-4 lg:flex-1 lg:flex-row lg:items-center lg:gap-6">
            {/* Time Range Slider */}
            <div className="flex flex-col gap-2 flex-1 min-w-[250px]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <span className="rounded-md bg-blue-50 px-2 py-1 text-blue-600">
                    من {formatTime(day.startTime)}
                  </span>
                </span>
                <span className="text-slate-300">—</span>
                <span className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <span className="rounded-md bg-red-50 px-2 py-1 text-red-600">
                    إلى {formatTime(day.endTime)}
                  </span>
                </span>
              </div>

              <Slider
                defaultValue={[day.startTime, day.endTime]}
                value={[day.startTime, day.endTime]}
                min={0}
                max={1440}
                step={day.slotDuration}
                onValueChange={(value) => handleRangeChange(index, value)}
                className="w-full"
              />

              <div className="flex justify-between text-[9px] text-slate-400 mt-1">
                <span>12:00 ص</span>
                <span>6:00 ص</span>
                <span>12:00 م</span>
                <span>6:00 م</span>
                <span>12:00 ص</span>
              </div>
            </div>

            {/* Slot Duration Dropdown */}
            <div className="flex items-center gap-2 lg:w-48">
              <span className="text-xs text-slate-400 whitespace-nowrap">
                مدة الموعد
              </span>
              <div className="relative flex-1">
                <select
                  value={day.slotDuration}
                  onChange={(e) =>
                    handleSlotDurationChange(index, Number(e.target.value))
                  }
                  className="appearance-none w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 pr-8 text-sm font-semibold text-[#062657] outline-none transition-all focus:border-[#075b9f] cursor-pointer"
                >
                  <option value={15}>15 دقيقة</option>
                  <option value={30}>30 دقيقة</option>
                  <option value={45}>45 دقيقة</option>
                  <option value={60}>60 دقيقة</option>
                </select>
                <ChevronDown className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center text-sm text-slate-400">
            اليوم عطلة - لا توجد مواعيد
          </div>
        )}

        {/* Slot Preview */}
        {day.isEnabled && (
          <div className="mt-3 lg:mt-0 lg:w-48">
            <div className="flex flex-wrap gap-1">
              {slots.slice(0, 5).map((slot, i) => (
                <span
                  key={i}
                  className="rounded-md bg-[#075b9f]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#075b9f]"
                >
                  {slot}
                </span>
              ))}
              {slots.length > 5 && (
                <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
                  +{slots.length - 5}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TimeTableDayCard;
