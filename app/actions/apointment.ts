"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";

export async function rejectAppointment(appointmentId: string) {
  try {
    // 2. Validate input
    if (!appointmentId) {
      return { error: "معرف الموعد مطلوب" };
    }

    // 3. Find appointment
    const existingAppointment = await prisma.appointment.findUnique({
      where: {
        id: appointmentId,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!existingAppointment) {
      return { error: "الموعد غير موجود" };
    }

    // 4. Don't cancel an appointment that's already completed
    if (existingAppointment.status === "COMPLETED") {
      return { error: "لا يمكن إلغاء موعد مكتمل" };
    }

    // 5. Cancel appointment
    await prisma.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        status: "CANCELLED",
      },
    });

    // 6. Refresh admin page
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error rejecting appointment:", error);

    return {
      error: "حدث خطأ أثناء إلغاء الموعد",
    };
  }
}

export async function autoCompletePastAppointments() {
  try {
    const now = new Date();

    // Find appointments where the date/time is in the past AND not already completed/cancelled
    const pastAppointments = await prisma.appointment.findMany({
      where: {
        status: {
          in: ["PENDING"], // Only update active ones
        },
        OR: [
          { date: { lt: now } }, // Date is before today
          {
            date: now, // Today, but time has passed
            time: {
              lt: `${now.getHours().toString().padStart(2, "0")}:${now
                .getMinutes()
                .toString()
                .padStart(2, "0")}`,
            },
          },
        ],
      },
      select: { id: true },
    });

    if (pastAppointments.length > 0) {
      // Update all past appointments to COMPLETED
      await prisma.appointment.updateMany({
        where: {
          id: { in: pastAppointments.map((app) => app.id) },
        },
        data: {
          status: "COMPLETED",
        },
      });
    }

    return { success: true, updated: pastAppointments.length };
  } catch (error) {
    console.error("Error auto-completing appointments:", error);
    return { error: "حدث خطأ أثناء تحديث المواعيد" };
  }
}
