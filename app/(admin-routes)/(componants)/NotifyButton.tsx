"use client";
import { Bell, BellRing } from "lucide-react";
import { usePushNotifications } from "../../hooks/usePushNotifications";

export default function NotifyButton() {
  const { subscribe, status } = usePushNotifications();

  return (
    <button
      type="button"
      onClick={subscribe}
      disabled={status === "subscribed"}
      aria-label={
        status === "subscribed" ? "الإشعارات مفعّلة" : "تفعيل الإشعارات"
      }
      className="flex h-10 w-10 items-center justify-center rounded-full border border-red-700/50 bg-red-800/30 text-red-50 transition-colors hover:bg-red-800/60 hover:text-white disabled:cursor-default disabled:opacity-70"
    >
      {status === "subscribed" ? (
        <BellRing className="h-5 w-5 text-[#fbbf24]" />
      ) : (
        <Bell className="h-5 w-5" />
      )}
    </button>
  );
}
