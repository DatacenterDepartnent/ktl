"use client";
import { useEffect } from "react";

export default function HeartbeatTracker({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // ส่งสัญญาณไปที่ Server ทุกๆ 2 นาที เพื่อบอกว่ายังออนไลน์อยู่
    const interval = setInterval(async () => {
      try {
        await fetch("/api/auth/heartbeat", { method: "POST" });
      } catch (err) {
        console.error("Heartbeat failed");
      }
    }, 1000 * 120); // 2 minutes

    return () => clearInterval(interval);
  }, []);

  return <>{children}</>;
}
