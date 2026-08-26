import { prisma } from "@/lib/prisma";
import ScheduleForm from "../(componants)/ScheduleForm";

const AppointmentsPage = async () => {
  // Fetch doctor
  const doctor = await prisma.doctor.findFirst();

  if (!doctor) {
    return (
      <div className="min-h-screen bg-slate-50 p-10 text-center">
        <p className="text-red-500">
          ⚠️ لم يتم العثور على طبيب. يرجى إضافة طبيب في قاعدة البيانات.
        </p>
      </div>
    );
  }

  // Fetch schedule
  const schedule = await prisma.schedule.findUnique({
    where: { doctorId: doctor.id },
  });

  if (!schedule) {
    return (
      <div className="min-h-screen bg-slate-50 p-10 text-center">
        <p className="text-red-500">⚠️ لم يتم العثور على جدول عمل للطبيب.</p>
      </div>
    );
  }

  // Parse the schedule.days
  const daysData = schedule.days as any;

  // Day names in Arabic
  const dayNames = [
    "السبت",
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
  ];

  // Convert to the format expected by the form
  const formattedSchedule = dayNames.map((dayName, index) => {
    const dayData = daysData[index] || {
      from: "09:00",
      to: "20:00",
      appointmentDuration: 30,
      isDayOff: false,
    };

    // Convert "09:00" to minutes (540)
    const [startHour, startMinute] = (dayData.from || "09:00")
      .split(":")
      .map(Number);
    const [endHour, endMinute] = (dayData.to || "20:00").split(":").map(Number);

    return {
      day: dayName,
      isEnabled: !dayData.isDayOff,
      startTime: startHour * 60 + startMinute,
      endTime: endHour * 60 + endMinute,
      slotDuration: dayData.appointmentDuration || 30,
    };
  });

  return (
    <ScheduleForm initialSchedule={formattedSchedule} doctorId={doctor.id} />
  );
};

export default AppointmentsPage;
