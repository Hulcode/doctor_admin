"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function approveReview(reviewId: string) {
  try {
    await prisma.review.update({
      where: { id: reviewId },
      data: { status: "APPROVED" },
    });

    revalidatePath("/AcceptReviews");

    return { success: true };
  } catch (error) {
    return { error: "حدث خطأ" };
  }
}

export async function rejectReview(reviewId: string) {
  try {
    await prisma.review.update({
      where: { id: reviewId },
      data: { status: "REJECTED" },
    });

    revalidatePath("/AcceptReviews");

    return { success: true };
  } catch (error) {
    return { error: "حدث خطأ" };
  }
}

export async function deleteReview(reviewId: string) {
  try {
    await prisma.review.delete({
      where: { id: reviewId },
    });

    revalidatePath("/AcceptReviews");

    return { success: true };
  } catch (error) {
    return { error: "حدث خطأ" };
  }
}
