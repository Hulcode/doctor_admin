import { formatDate } from "@/lib/helper";
import React from "react";
import {
  CalendarDays,
  X,
  Ban,
  Clock,
  LucideIcon,
  CheckCircle2,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type AppointmentStatus = "pending" | "completed" | "cancelled";

interface Appointment {
  id: string;
  patient: { name: string; phone: string; id: string; isBlocked: boolean };

  date: string;
  time: string;
  status: AppointmentStatus;
}

const MobileApointmentCards = ({
  statusStyle,
  appointment,
  onCancel,
  onBlock,
  onUnblock,
}: {
  statusStyle: { bg: string; text: string; icon: LucideIcon; label: string };
  appointment: Appointment;
  onCancel: (id: string) => void;
  onBlock: (patientId: string) => void;
  onUnblock: (patientId: string) => void;
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Patient Info */}
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border-2 border-[#cda558]/30">
          <AvatarFallback className="bg-gradient-to-br from-[#062657] to-[#075b9f] text-white text-sm font-bold">
            {appointment.patient.name[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="text-sm font-bold text-[#062657]">
            {appointment.patient.name}
          </p>
          <p className="text-xs text-slate-400" dir="ltr">
            {appointment.patient.phone}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyle.bg} ${statusStyle.text}`}
        >
          <statusStyle.icon className="h-3 w-3" />
          {statusStyle.label}
        </span>
      </div>

      {/* Date & Time */}
      <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-3.5 w-3.5 text-[#075b9f]" />
          {formatDate(appointment.date)}
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-[#075b9f]" />
          {appointment.time}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
        {appointment.status !== "cancelled" && (
          <button
            onClick={() => onCancel(appointment.id)}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-amber-50 py-2 text-xs font-bold text-amber-600 transition-colors hover:bg-amber-100"
          >
            <X className="h-3.5 w-3.5" />
            إلغاء
          </button>
        )}
        {appointment.patient.isBlocked === true ? (
          <button
            onClick={() => onUnblock(appointment.patient.id)}
            className="rounded-lg bg-emerald-50 p-2 text-emerald-600 transition-colors hover:bg-emerald-100"
            title="إلغاء حظر المريض"
          >
            <CheckCircle2 className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={() => onBlock(appointment.patient.id)}
            className="rounded-lg bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100"
            title="حظر المريض"
          >
            <Ban className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default MobileApointmentCards;
