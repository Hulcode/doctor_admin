"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function blockUser(patientId: string) {
  try {
    if (!patientId) {
      return { error: "معرف المريض مطلوب" };
    }

    // Block the patient
    await prisma.patient.update({
      where: { id: patientId },
      data: { isBlocked: true },
    });

    // Also cancel all pending/confirmed appointments for this patient
    await prisma.appointment.deleteMany({
      where: {
        patientId,
        status: { in: ["PENDING"] },
      },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error blocking user:", error);
    return { error: "حدث خطأ أثناء حظر المريض" };
  }
}

export async function unblockUser(patientId: string) {
  try {
    if (!patientId) {
      return { error: "معرف المريض مطلوب" };
    }

    await prisma.patient.update({
      where: { id: patientId },
      data: { isBlocked: false },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error unblocking user:", error);
    return { error: "حدث خطأ أثناء إلغاء حظر المريض" };
  }
}
