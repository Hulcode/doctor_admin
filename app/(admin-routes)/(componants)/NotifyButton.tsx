"use client";
import { Bell, BellRing } from "lucide-react";
import { usePushNotifications } from "../../hooks/usePushNotifications";

export default function NotifyButton({ show }: { show?: boolean }) {
  const { subscribe, status } = usePushNotifications();

  return (
    <button
      type="button"
      onClick={subscribe}
      disabled={status === "subscribed"}
      aria-label={
        status === "subscribed" ? "الإشعارات مفعّلة" : "تفعيل الإشعارات"
      }
      className={`${show ? "flex" : "lg:flex hidden"}
        h-11 w-11 items-center justify-center rounded-full
        border border-red-700/50 bg-red-800/30 text-red-50
        transition-colors duration-150
        hover:bg-red-800/60 hover:text-white
        active:bg-red-800/70 active:scale-95
        disabled:cursor-default disabled:opacity-70 disabled:active:scale-100
        touch-manipulation select-none
        [-webkit-tap-highlight-color:transparent]`}
    >
      {status === "subscribed" ? (
        <BellRing className="h-5 w-5 text-[#fbbf24]" />
      ) : (
        <Bell className="h-5 w-5" />
      )}
    </button>
  );
}
