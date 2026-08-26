import { prisma } from "@/lib/prisma";
import AcceptReviews from "../(componants)/AcceptReviews";

const AdminReviewsPage = async () => {
  // Fetch doctor
  const doctor = await prisma.doctor.findFirst();

  if (!doctor) {
    return (
      <div className="min-h-screen bg-slate-50 p-10 text-center">
        <p className="text-red-500">⚠️ لم يتم العثور على طبيب.</p>
      </div>
    );
  }

  // Fetch all reviews
  const reviewsData = await prisma.review.findMany({
    where: {
      doctorId: doctor.id,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  // Format reviews to match the expected type
  const formattedReviews = reviewsData.map((review) => ({
    id: review.id,
    name: review.name,
    email: "", // Not stored in DB, can be added later
    rating: review.stars,
    comment: review.content,
    date: review.createdAt.toISOString().split("T")[0],
    status: review.status.toLowerCase() as "pending" | "approved" | "rejected",
  }));

  return <AcceptReviews initialReviews={formattedReviews} />;
};

export default AdminReviewsPage;
