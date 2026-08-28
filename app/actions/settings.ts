"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import cloudinary from "@/lib/cloudinary";

export async function setSettings(formData: FormData, doctorId: string) {
  try {
    // ============================================
    // 1. EXTRACT DATA FROM FORM
    // ============================================
    const name = formData.get("doctorName") as string;
    const title = formData.get("title") as string;
    const yearsExperience =
      parseInt(formData.get("yearsExperience") as string) || 0;
    const email = formData.get("email") as string;
    const aboutDoctor = formData.get("aboutDoctor") as string;
    const address = formData.get("address") as string;
    const phone = formData.get("phone") as string;
    const facebook = formData.get("facebook") as string;
    const instagram = formData.get("instagram") as string;
    const imageFile = formData.get("image") as File; // Changed from imageUrl to image

    // ============================================
    // 2. VALIDATE INPUT
    // ============================================
    if (!name || !phone) {
      return { error: "اسم الطبيب ورقم الهاتف مطلوبان" };
    }

    // Validate phone (Egyptian format - starts with 01, 11 digits)
    if (!/^01[0-9]{9}$/.test(phone)) {
      return {
        error: "رقم الهاتف غير صحيح (يجب أن يبدأ بـ 01 ويتكون من 11 رقمًا)",
      };
    }

    // ============================================
    // 3. HANDLE IMAGE UPLOAD (If a new image is provided)
    // ============================================
    let imageUrl = null;

    if (imageFile && imageFile.size > 0) {
      // Convert File to Buffer
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "doctor_images",
            resource_type: "image",
            transformation: [{ width: 800, height: 1000, crop: "fill" }],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        uploadStream.end(buffer);
      });

      imageUrl = (result as any).secure_url;
    }

    // ============================================
    // 4. UPDATE DOCTOR
    // ============================================
    const doctor = await prisma.doctor.update({
      where: { id: doctorId },
      data: {
        name,
        title,
        yearsExperience,
        email: email || null,
        description: aboutDoctor,
        address: address || null,
        phone,
        facebookLink: facebook || null,
        instagramLink: instagram || null,
        ...(imageUrl ? { imageUrl } : {}), // Only update if new image uploaded
      },
    });

    // ============================================
    // 5. REVALIDATE PATHS
    // ============================================

    revalidatePath("/settings");

    return { success: true, doctorId: doctor.id };
  } catch (error) {
    console.error("Error updating settings:", error);
    return { error: "حدث خطأ أثناء حفظ الإعدادات. حاول مرة أخرى." };
  }
}
