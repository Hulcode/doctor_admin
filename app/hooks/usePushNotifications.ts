"use client";
import { useState, useEffect } from "react";

type PushStatus = "idle" | "subscribed" | "denied" | "error";

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications() {
  const [status, setStatus] = useState<PushStatus>("idle");

  useEffect(() => {
    navigator.serviceWorker?.getRegistration().then(async (reg) => {
      const existing = await reg?.pushManager.getSubscription();
      if (existing) setStatus("subscribed");
    });
  }, []);

  async function subscribe(): Promise<void> {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");

      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        setStatus("denied");
        return;
      }

      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

      if (!publicKey) {
        throw new Error("Missing NEXT_PUBLIC_VAPID_PUBLIC_KEY");
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });

      const data = await res.json();

      setStatus("subscribed");
    } catch (err) {
      setStatus("error");
    }
  }

  return { subscribe, status };
}
