"use client";

import { useEffect, useRef } from "react";
import { incrementVisitor } from "@/app/actions";

export default function VisitorTracker() {
  // ใช้ useRef ป้องกันการรันซ้ำซ้อนใน React Strict Mode
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      incrementVisitor(); // เรียก Server Action
      hasRun.current = true;
    }
  }, []);

  return null; // Component นี้ไม่มีหน้าตา แค่ทำงานเบื้องหลัง
}
