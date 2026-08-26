"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Type for schedule days
interface DayInput {
  day: string;
  isEnabled: boolean;
  startTime: number;
  endTime: number;
  slotDuration: number;
}

export async function setSchedule(days: DayInput[], doctorId: string) {
  try {
    // ============================================
    // 1. VALIDATE INPUT
    // ============================================
    if (!days || days.length !== 7) {
      return { error: "يجب أن يحتوي الجدول على 7 أيام" };
    }

    if (!doctorId) {
      return { error: "معرف الطبيب مطلوب" };
    }

    // Check if doctor exists
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
    });

    if (!doctor) {
      return { error: "الطبيب غير موجود" };
    }

    // ============================================
    // 2. CONVERT TO JSON FORMAT
    // ============================================
    const formattedDays = days.map((day) => ({
      from: day.isEnabled
        ? `${String(Math.floor(day.startTime / 60)).padStart(2, "0")}:${String(day.startTime % 60).padStart(2, "0")}`
        : "",
      to: day.isEnabled
        ? `${String(Math.floor(day.endTime / 60)).padStart(2, "0")}:${String(day.endTime % 60).padStart(2, "0")}`
        : "",
      appointmentDuration: day.slotDuration,
      isDayOff: !day.isEnabled,
    }));

    // ============================================
    // 3. UPDATE OR CREATE SCHEDULE
    // ============================================
    const existingSchedule = await prisma.schedule.findUnique({
      where: { doctorId },
    });

    if (existingSchedule) {
      // Update existing schedule
      await prisma.schedule.update({
        where: { doctorId },
        data: {
          days: formattedDays,
        },
      });
    } else {
      // Create new schedule
      await prisma.schedule.create({
        data: {
          doctorId,
          days: formattedDays,
        },
      });
    }

    // ============================================
    // 4. REVALIDATE PATHS
    // ============================================
    revalidatePath("/appointments");

    return { success: true };
  } catch (error) {
    console.error("Error saving schedule:", error);
    return { error: "حدث خطأ أثناء حفظ الجدول. حاول مرة أخرى." };
  }
}
