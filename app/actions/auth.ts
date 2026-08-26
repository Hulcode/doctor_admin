"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function login(formData: FormData) {
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;

  if (!name || !password) {
    return { error: "جميع الحقول مطلوبة" };
  }

  // Find doctor by name
  const doctor = await prisma.doctor.findFirst({
    where: {
      name: name.trim(),
    },
  });

  if (!doctor) {
    return { error: "اسم الطبيب غير صحيح" };
  }

  // Check password (should be the doctor's ID)
  if (doctor.id !== password) {
    return { error: "كلمة المرور غير صحيحة" };
  }

  // Set a cookie to authenticate the admin
  const cookieStore = await cookies();
  cookieStore.set("admin_authenticated", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 7 days
    path: "/",
  });

  // Also store doctor id
  cookieStore.set("doctor_id", doctor.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  redirect("/");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_authenticated");
  cookieStore.delete("doctor_id");

  revalidatePath("/");
  redirect("/login");
}
