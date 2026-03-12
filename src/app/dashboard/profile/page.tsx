"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    lineId: "",
    role: "",
    image: "", // ✅ เพิ่มฟิลด์รูปภาพ
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setFormData({
            name: data.name || "",
            username: data.username || "",
            email: data.email || "",
            phone: data.phone || "",
            lineId: data.lineId || "",
            role: data.role || "",
            image: data.image || "",
            password: "",
            confirmPassword: "",
          });
          if (data.image) setPreviewImage(data.image);
        }
      } catch (error) {
        console.error("Load profile error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // ฟังก์ชันจัดการการเลือกรูปภาพ
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        // ในที่นี้แนะนำให้ส่ง File ไปที่ Upload API แล้วเก็บ URL กลับมา
        // หรือถ้าจะส่ง Base64 (ไม่แนะนำถ้าไฟล์ใหญ่) ให้เซ็ตลง formData ตรงๆ
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("❌ รหัสผ่านใหม่ไม่ตรงกัน");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          image: previewImage, // ส่ง URL รูปภาพใหม่ไป (ถ้าคุณจัดการ upload แล้ว)
        }),
      });

      if (res.ok) {
        alert("✅ บันทึกข้อมูลเรียบร้อยแล้ว!");
        setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
        router.refresh();
      } else {
        alert("❌ เกิดข้อผิดพลาด");
      }
    } catch (error) {
      alert("❌ เชื่อมต่อ Server ไม่ได้");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="p-20 text-center font-bold text-zinc-400 animate-pulse">
        กำลังโหลดข้อมูล...
      </div>
    );

  return (
    <div className="max-w-[1600px] mx-auto px-2 py-12">
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-zinc-200 dark:border-zinc-800 pb-10">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase">
            My <span className="text-blue-600">Profile</span>
          </h1>
          <p className="text-zinc-500 font-medium italic">
            จัดการข้อมูลส่วนตัวและรูปโปรไฟล์ของคุณ
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* --- Left Column: Avatar Upload (Bento Style) --- */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-[2.5rem] shadow-sm flex flex-col items-center text-center">
            <div
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white dark:border-zinc-800 shadow-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-5xl">👤</span>
                )}
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-bold uppercase tracking-widest">
                  Change Photo
                </span>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-black text-zinc-900 dark:text-white leading-none">
                {formData.username}
              </h2>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mt-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-1 rounded-full">
                {formData.role || "Member"}
              </p>
            </div>

            <p className="text-xs text-zinc-400 mt-6 font-medium italic">
              แนะนำรูปทรงจัตุรัส <br /> ขนาดไม่เกิน 2MB
            </p>
          </div>
        </div>

        {/* --- Right Column: Forms (Bento Style) --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 rounded-[2rem] shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-blue-600 rounded-full" /> Personal
              Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2 mb-2 block">
                  ชื่อ-นามสกุล
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-3.5 font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2 mb-2 block">
                  เบอร์โทรศัพท์
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-3.5 font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2 mb-2 block">
                  Line ID
                </label>
                <input
                  type="text"
                  value={formData.lineId}
                  onChange={(e) =>
                    setFormData({ ...formData, lineId: e.target.value })
                  }
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-3.5 font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2 mb-2 block">
                  อีเมล
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-3.5 font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Security Bento */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 rounded-[2rem] shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-red-500 rounded-full" /> Security
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2 mb-2 block">
                  รหัสผ่านใหม่
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Leave blank to keep same"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-3.5 font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2 mb-2 block">
                  ยืนยันรหัสผ่าน
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className={`w-full bg-zinc-50 dark:bg-zinc-950 border rounded-2xl px-5 py-3.5 font-bold focus:ring-2 outline-none transition-all ${
                    formData.password &&
                    formData.password !== formData.confirmPassword
                      ? "border-red-500 focus:ring-red-500"
                      : "border-zinc-200 dark:border-zinc-800 focus:ring-blue-500"
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className={`group flex items-center gap-3 px-10 py-4 rounded-[2rem] font-black text-white transition-all shadow-xl ${
                saving
                  ? "bg-zinc-400 cursor-wait"
                  : "bg-blue-600 hover:bg-blue-500 hover:shadow-blue-500/30 active:scale-95"
              }`}
            >
              {saving ? (
                "SAVING..."
              ) : (
                <>
                  <span>SAVE CHANGES</span>
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
