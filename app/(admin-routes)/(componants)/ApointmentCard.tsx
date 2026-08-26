import React from "react";
import { formatDate } from "@/lib/helper";
import { X, Ban, LucideIcon, CheckCircle2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type AppointmentStatus = "pending" | "completed" | "cancelled";

interface Appointment {
  id: string;
  patient: { name: string; phone: string; id: string; isBlocked: boolean };

  date: string;
  time: string;
  status: AppointmentStatus;
}

const ApointmentCard = ({
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
    <tr className="border-b border-slate-50 transition-colors hover:bg-slate-50">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border-2 border-[#cda558]/30">
            <AvatarFallback className="bg-gradient-to-br from-[#062657] to-[#075b9f] text-white text-xs font-bold">
              {appointment.patient.name[0]}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-bold text-[#062657]">
            {appointment.patient.name}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-slate-500" dir="ltr">
        {appointment.patient.phone}
      </td>
      <td className="px-6 py-4 text-sm text-slate-500">
        {formatDate(appointment.date)}
      </td>
      <td className="px-6 py-4 text-sm text-slate-500">{appointment.time}</td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyle.bg} ${statusStyle.text}`}
        >
          <statusStyle.icon className="h-3 w-3" />
          {statusStyle.label}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
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
      </td>
    </tr>
  );
};

export default ApointmentCard;
