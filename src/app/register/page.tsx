"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("สร้างบัญชีผู้ใช้สำเร็จ!");
      router.push("/login"); // ไปที่หน้า Login หลังสมัครเสร็จ
    } else {
      const data = await res.json();
      alert(data.error || "เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="flex max-w-7xl mx-auto items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md  p-8 rounded-2xl shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">
          สร้างบัญชี Admin - KTLTC
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="ชื่อ-นามสกุล"
            className="w-full p-3 border rounded-lg text-black"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 border rounded-lg text-black"
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg text-black"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
          <button className="w-full bg-green-600 text-white p-3 rounded-lg font-bold hover:bg-green-700 transition-all">
            ยืนยันการสมัคร
          </button>
        </div>
      </form>
    </div>
  );
}
