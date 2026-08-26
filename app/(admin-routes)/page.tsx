import { prisma } from "@/lib/prisma";
import AppointmentsList from "./(componants)/AppointmentsList";
import { autoCompletePastAppointments } from "@/app/actions/apointment";
type AppointmentStatus = "pending" | "completed" | "cancelled";

const AdminPage = async () => {
  const doctor = await prisma.doctor.findFirst();
  await autoCompletePastAppointments();
  if (!doctor) {
    return (
      <div className="min-h-screen bg-slate-50 p-10 text-center">
        <p className="text-red-500">⚠️ لم يتم العثور على طبيب.</p>
      </div>
    );
  }

  // Fetch appointments
  const appointments = await prisma.appointment.findMany({
    where: {
      doctorId: doctor.id,
    },
    include: {
      patient: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  // Format appointments
  const formattedAppointments = appointments.map((appointment) => ({
    id: appointment.id,
    patient: appointment.patient,
    phone: appointment.patient.phone,
    date: appointment.date.toISOString().split("T")[0],
    time: appointment.time,

    status: appointment.status.toLowerCase() as AppointmentStatus,
  }));

  return <AppointmentsList initialAppointments={formattedAppointments} />;
};

export default AdminPage;
