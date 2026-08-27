"use client";

import { X, Ban, CheckCircle2, Clock } from "lucide-react";
import { useState, useMemo } from "react";
import MobileApointmentCards from "../(componants)/MobileApointmentCards";
import ApointmentCard from "../(componants)/ApointmentCard";
import FilterReviewsAppointment from "../(componants)/FilterReviewsApiontment";
import { rejectAppointment } from "../../actions/apointment";
import { blockUser, unblockUser } from "@/app/actions/patient";
import toast from "react-hot-toast";

// ============================================
// KEEP YOUR EXACT TYPE
// ============================================
type AppointmentStatus = "pending" | "completed" | "cancelled";

interface Appointment {
  id: string;
  patient: { name: string; phone: string; id: string; isBlocked: boolean };

  date: string;
  time: string;
  status: AppointmentStatus;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

const getDateRange = (filter: "day" | "week" | "month") => {
  const today = new Date();
  let start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  let end = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  if (filter === "week") {
    const dayOfWeek = start.getDay();
    start.setDate(start.getDate() - dayOfWeek);
    end = new Date(start);
    end.setDate(start.getDate() + 6);
  } else if (filter === "month") {
    start = new Date(today.getFullYear(), today.getMonth(), 1);
    end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  }

  return { start, end };
};
const getStatusStyles = (status: AppointmentStatus) => {
  switch (status) {
    case "pending":
      return {
        bg: "bg-amber-100",
        text: "text-amber-700",
        icon: Clock,
        label: "قيد الانتظار",
      };
    case "completed":
      return {
        bg: "bg-emerald-100",
        text: "text-emerald-700",
        icon: CheckCircle2,
        label: "مكتمل",
      };
    case "cancelled":
      return { bg: "bg-red-100", text: "text-red-700", icon: X, label: "ملغي" };
    default:
      return {
        bg: "bg-slate-100",
        text: "text-slate-600",
        icon: Clock,
        label: "غير معروف",
      };
  }
};

// ============================================
// MAIN COMPONENT
// ============================================

const AppointmentsList = ({
  initialAppointments,
}: {
  initialAppointments: Appointment[];
}) => {
  const [appointments, setAppointments] =
    useState<Appointment[]>(initialAppointments);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState<"day" | "week" | "month">(
    "week",
  );
  const [statusFilter, setStatusFilter] = useState<"all" | AppointmentStatus>(
    "all",
  );

  // Filter appointments based on search, time, and status
  const filteredAppointments = useMemo(() => {
    const { start, end } = getDateRange(timeFilter);
    end.setHours(23, 59, 59, 999); // include the entire end day

    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date);

      if (appointmentDate < start || appointmentDate > end) return false;

      if (
        searchQuery &&
        !appointment.patient.name.includes(searchQuery) &&
        !appointment.patient.phone.includes(searchQuery)
      )
        return false;

      if (statusFilter !== "all" && appointment.status !== statusFilter)
        return false;

      return true;
    });
  }, [appointments, searchQuery, timeFilter, statusFilter]);

  const totalAppointments = filteredAppointments.length;
  const pendingCount = filteredAppointments.filter(
    (a) => a.status === "pending",
  ).length;
  const completedCount = filteredAppointments.filter(
    (a) => a.status === "completed",
  ).length;
  const cancelledCount = filteredAppointments.filter(
    (a) => a.status === "cancelled",
  ).length;

  // Handler to reject/cancel an appointment
  const handleRejectAppointment = async (appointmentId: string) => {
    const result = await rejectAppointment(appointmentId);
    if (result?.success) {
      // Update local state
      setAppointments((prev) =>
        prev.map((app) =>
          app.id === appointmentId ? { ...app, status: "cancelled" } : app,
        ),
      );
    } else {
      toast.error(result?.error ?? "Failed to cancel appointment");
    }
  };

  const handleBlockUser = async (patientId: string) => {
    const result = await blockUser(patientId);
    if (result?.success) {
      setAppointments((prev) =>
        prev.filter((app) => app.patient.id !== patientId),
      );
    }
  };
  const handleUnblockUser = async (patientId: string) => {
    const result = await unblockUser(patientId);
    if (result?.success) {
      setAppointments((prev) =>
        prev.map((app) =>
          app.patient.id === patientId ? { ...app, status: "pending" } : app,
        ),
      );
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* Page Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-black text-[#062657] lg:text-3xl">
              إدارة المواعيد والمرضى
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              عرض وإدارة جميع مواعيد ومرضى العيادة.
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
            <p className="text-3xl font-black text-[#062657]">
              {totalAppointments}
            </p>
            <p className="text-xs text-slate-500 mt-1">إجمالي المواعيد</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
            <p className="text-3xl font-black text-amber-600">{pendingCount}</p>
            <p className="text-xs text-slate-500 mt-1">قيد الانتظار</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
            <p className="text-3xl font-black text-emerald-600">
              {completedCount}
            </p>
            <p className="text-xs text-slate-500 mt-1">مكتملة</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
            <p className="text-3xl font-black text-red-600">{cancelledCount}</p>
            <p className="text-xs text-slate-500 mt-1">ملغية</p>
          </div>
        </div>

        {/* Filters */}
        <FilterReviewsAppointment
          mode="appointments"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          timeFilter={timeFilter}
          setTimeFilter={setTimeFilter}
        />

        {/* Appointments List */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <h2 className="text-lg font-bold text-[#062657]">
              قائمة المواعيد
              <span className="mr-2 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                {filteredAppointments.length}
              </span>
            </h2>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-6 py-3 text-xs font-bold text-slate-500">
                    المريض
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500">
                    الهاتف
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500">
                    التاريخ
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500">
                    الوقت
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appointment) => {
                    const statusStyle = getStatusStyles(appointment.status);
                    return (
                      <ApointmentCard
                        onCancel={handleRejectAppointment}
                        onBlock={handleBlockUser}
                        onUnblock={handleUnblockUser}
                        key={appointment.id}
                        statusStyle={statusStyle}
                        appointment={appointment}
                      />
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-slate-400"
                    >
                      لا توجد نتائج مطابقة للبحث
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-3 p-4 lg:hidden">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => {
                const statusStyle = getStatusStyles(appointment.status);
                return (
                  <MobileApointmentCards
                    onCancel={handleRejectAppointment}
                    onBlock={handleBlockUser}
                    onUnblock={handleUnblockUser}
                    key={appointment.id}
                    statusStyle={statusStyle}
                    appointment={appointment}
                  />
                );
              })
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-slate-400">
                لا توجد نتائج مطابقة للبحث
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsList;
