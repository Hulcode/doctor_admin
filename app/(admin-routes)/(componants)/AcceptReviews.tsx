"use client";

import { useState, useMemo } from "react";
import { MessageSquare } from "lucide-react";
import ReviewCard from "./ReviewCard";
import FilterReviewsAppointment from "./FilterReviewsApiontment";
import {
  approveReview,
  rejectReview,
  deleteReview,
} from "@/app/actions/reviews";

type ReviewStatus = "pending" | "approved" | "rejected";

interface Review {
  id: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  date: string;
  status: ReviewStatus;
}

const AcceptReviews = ({ initialReviews }: { initialReviews: Review[] }) => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ReviewStatus>("all");

  // Filter reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      if (
        searchQuery &&
        !review.name.includes(searchQuery) &&
        !review.email.includes(searchQuery) &&
        !review.comment.includes(searchQuery)
      )
        return false;

      if (statusFilter !== "all" && review.status !== statusFilter)
        return false;

      return true;
    });
  }, [reviews, searchQuery, statusFilter]);

  // Stats
  const pendingCount = reviews.filter((r) => r.status === "pending").length;
  const approvedCount = reviews.filter((r) => r.status === "approved").length;
  const rejectedCount = reviews.filter((r) => r.status === "rejected").length;

  // Actions
  const handleApprove = async (id: string) => {
    const result = await approveReview(id);
    if (result?.success) {
      setReviews((prev) =>
        prev.map((review) =>
          review.id === id ? { ...review, status: "approved" } : review,
        ),
      );
    }
  };

  const handleReject = async (id: string) => {
    const result = await rejectReview(id);
    if (result?.success) {
      setReviews((prev) =>
        prev.map((review) =>
          review.id === id ? { ...review, status: "rejected" } : review,
        ),
      );
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteReview(id);
    if (result?.success) {
      setReviews((prev) => prev.filter((review) => review.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* Page Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-black text-[#062657] lg:text-3xl">
              إدارة آراء المرضى
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              مراجعة وقبول أو رفض آراء المرضى قبل نشرها على الموقع.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
            <p className="text-3xl font-black text-amber-600">{pendingCount}</p>
            <p className="text-xs text-slate-500 mt-1">قيد المراجعة</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
            <p className="text-3xl font-black text-emerald-600">
              {approvedCount}
            </p>
            <p className="text-xs text-slate-500 mt-1">مقبولة</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
            <p className="text-3xl font-black text-red-600">{rejectedCount}</p>
            <p className="text-xs text-slate-500 mt-1">مرفوضة</p>
          </div>
        </div>

        {/* Filters */}
        <FilterReviewsAppointment
          mode="reviews"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review, index) => (
              <ReviewCard
                key={review.id}
                index={index}
                handleApprove={handleApprove}
                handleReject={handleReject}
                handleDelete={handleDelete}
                review={review}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-4 text-lg font-bold text-slate-500">
                لا توجد آراء مطابقة
              </p>
              <p className="mt-1 text-sm text-slate-400">
                جرب تغيير البحث أو الفلتر
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcceptReviews;
