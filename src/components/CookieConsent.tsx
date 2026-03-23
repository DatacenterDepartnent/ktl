"use client";

import { useState, useEffect } from "react";

const COOKIE_KEY = "ktltc_cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(COOKIE_KEY);
    if (!accepted) {
      // หน่วงเล็กน้อยก่อนแสดง เพื่อไม่ให้กระตุกระหว่าง hydration
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="การยินยอมใช้คุกกี้"
      className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6 animate-in slide-in-from-bottom-4 duration-500"
    >
      <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/40 p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          {/* Icon + Text */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <span className="text-2xl shrink-0 mt-0.5">🍪</span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100 mb-1">
                เว็บไซต์นี้ใช้คุกกี้
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                เราใช้คุกกี้เพื่อพัฒนาประสบการณ์การใช้งาน วิเคราะห์การเข้าชม
                และให้บริการที่เหมาะสมกับคุณ{" "}
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  วิทยาลัยเทคนิคกันทรลักษ์ (KTLTC)
                </span>
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDecline}
              className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition-all active:scale-95"
            >
              ปฏิเสธ
            </button>
            <button
              onClick={handleAccept}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/20 transition-all active:scale-95"
            >
              ยอมรับทั้งหมด
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
