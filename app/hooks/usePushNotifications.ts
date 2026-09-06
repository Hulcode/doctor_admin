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
      console.log("1. Starting subscribe...");

      const registration = await navigator.serviceWorker.register("/sw.js");
      console.log("2. Service worker registered:", registration);

      const permission = await Notification.requestPermission();
      console.log("3. Permission result:", permission);

      if (permission !== "granted") {
        console.log("❌ STOPPED: permission not granted");
        setStatus("denied");
        return;
      }

      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      console.log("4. Public key:", publicKey);

      if (!publicKey) {
        console.log("❌ STOPPED: no public key");
        throw new Error("Missing NEXT_PUBLIC_VAPID_PUBLIC_KEY");
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });
      console.log("5. Subscription created:", subscription);

      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });
      console.log("6. Fetch response status:", res.status);
      const data = await res.json();
      console.log("7. Fetch response body:", data);

      setStatus("subscribed");
    } catch (err) {
      console.log("❌ CAUGHT ERROR:", err);
      setStatus("error");
    }
  }

  return { subscribe, status };
}
