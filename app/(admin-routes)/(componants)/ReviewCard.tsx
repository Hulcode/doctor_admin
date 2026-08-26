import React from "react";
import { motion } from "motion/react";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import RenderStars from "../(componants)/StarsRender";
import { formatDate } from "@/lib/helper";
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
const ReviewCard = ({
  index,
  handleApprove,
  handleReject,
  handleDelete,
  review,
}: {
  index: number;
  handleApprove: (id: string) => void;
  handleReject: (id: string) => void;
  handleDelete: (id: string) => void;
  review: Review;
}) => {
  const getStatusStyles = (status: ReviewStatus) => {
    switch (status) {
      case "pending":
        return {
          bg: "bg-amber-100",
          text: "text-amber-700",
          label: "قيد المراجعة",
        };
      case "approved":
        return {
          bg: "bg-emerald-100",
          text: "text-emerald-700",
          label: "مقبول",
        };
      case "rejected":
        return { bg: "bg-red-100", text: "text-red-700", label: "مرفوض" };
    }
  };

  const getStatusIcon = (status: ReviewStatus) => {
    switch (status) {
      case "pending":
        return Clock;
      case "approved":
        return CheckCircle2;
      case "rejected":
        return XCircle;
    }
  };
  const statusStyle = getStatusStyles(review.status);
  const StatusIcon = getStatusIcon(review.status);
  return (
    <motion.div
      key={review.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-2xl border bg-white p-6 shadow-sm transition-all ${
        review.status === "pending"
          ? "border-amber-200"
          : review.status === "approved"
            ? "border-emerald-200"
            : "border-red-200"
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        {/* Review Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-[#cda558]/30">
              <AvatarFallback className="bg-gradient-to-br from-[#062657] to-[#075b9f] text-white text-sm font-bold">
                {review.name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-sm font-bold text-[#062657]">
                {review.name}
              </h4>
              <p className="text-xs text-slate-400" dir="ltr">
                {review.email}
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyle.bg} ${statusStyle.text}`}
            >
              {<StatusIcon className="h-3 w-3" />}
              {statusStyle.label}
            </span>
          </div>

          {/* Rating & Date */}
          <div className="mt-3 flex items-center gap-3">
            <RenderStars rating={review.rating} />
            <span className="text-xs text-slate-400">
              {formatDate(review.date)}
            </span>
          </div>

          {/* Comment */}
          <p className="mt-3 text-sm leading-7 text-slate-600">
            "{review.comment}"
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 lg:flex-col lg:items-end">
          {/* Pending Actions */}
          {review.status === "pending" ? (
            <>
              <button
                onClick={() => handleApprove(review.id)}
                className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-600 transition-colors hover:bg-emerald-100"
              >
                <CheckCircle2 className="h-4 w-4" />
                قبول
              </button>
              <button
                onClick={() => handleReject(review.id)}
                className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-100"
              >
                <XCircle className="h-4 w-4" />
                رفض
              </button>
            </>
          ) : review.status === "rejected" ? (
            <button
              onClick={() => handleApprove(review.id)}
              className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-600 transition-colors hover:bg-emerald-100"
            >
              <CheckCircle2 className="h-4 w-4" />
              قبول
            </button>
          ) : (
            <button
              onClick={() => handleDelete(review.id)}
              className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-100"
            >
              <XCircle className="h-4 w-4" />
              حذف
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ReviewCard;
