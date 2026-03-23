"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import Link from "next/link";
import {
  FiArrowLeft,
  FiSave,
  FiUser,
  FiMail,
  FiPhone,
  FiMessageCircle,
  FiShield,
  FiActivity,
  FiLoader,
  FiLock, // เพิ่มไอคอนกุญแจ
  FiEye, // เพิ่มไอคอนตา
  FiEyeOff, // เพิ่มไอคอนปิดตา
} from "react-icons/fi";

interface UserFormData {
  name: string;
  email: string;
  role: "super_admin" | "admin" | "editor";
  phone: string;
  lineId: string;
  isActive: boolean;
}

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id;

  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    role: "editor",
    phone: "",
    lineId: "",
    isActive: true,
  });

  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState(""); // เพิ่ม State สำหรับรหัสผ่านใหม่
  const [showPassword, setShowPassword] = useState(false); // เพิ่ม State สำหรับเปิด/ปิดการมองเห็นรหัสผ่าน
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [adminProfile, setAdminProfile] = useState<{
    _id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [adminRes, userRes] = await Promise.all([
          fetch("/api/profile"),
          fetch(`/api/admin/users/${userId}`),
        ]);

        if (adminRes.ok) {
          const adminData = await adminRes.json();
          setAdminProfile(adminData);
        }

        if (userRes.ok) {
          const data = await userRes.json();
          setFormData({
            name: data.name || "",
            email: data.email || "",
            role: data.role || "editor",
            phone: data.phone || "",
            lineId: data.lineId || "",
            isActive: data.isActive ?? true,
          });
          setUsername(data.username || "ไม่ระบุ");
        } else {
          toast.error("ไม่พบข้อมูลผู้ใช้ในระบบ");
          router.push("/dashboard/super-admin");
        }
      } catch (error) {
        toast.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchInitialData();
  }, [userId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminProfile) return toast.error("กรุณารอข้อมูลระบบสักครู่");

    // ตรวจสอบความยาวรหัสผ่านถ้ามีการกรอก
    if (newPassword && newPassword.length < 6) {
      return toast.error("รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          password: newPassword || undefined, // ส่งรหัสผ่านใหม่ไปถ้ามีการกรอก
          logAction: "แก้ไขข้อมูลผู้ใช้",
          logDetails: `แก้ไขข้อมูลผู้ใช้: ${formData.name} (@${username})${newPassword ? " (มีการเปลี่ยนรหัสผ่าน)" : ""}`,
          adminId: adminProfile._id,
          adminName: adminProfile.name,
        }),
      });

      if (res.ok) {
        toast.success("บันทึกข้อมูลสำเร็จ");
        setTimeout(() => router.push("/dashboard/super-admin"), 1000);
      } else {
        const err = await res.json();
        toast.error(err.error || "บันทึกล้มเหลว");
      }
    } catch (error) {
      toast.error("ไม่สามารถเชื่อมต่อฐานข้อมูลได้");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center max-w-[1600px] mx-auto bg-white">
        <FiLoader className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">
          กำลังตรวจสอบข้อมูลอัตลักษณ์...
        </p>
      </div>
    );

  return (
    <div className="max-w-[1600px] mx-auto bg-[#f8fafc] pb-20">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <FiArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <h2 className="font-bold text-slate-800 text-lg">
              แก้ไขข้อมูลผู้ใช้งาน
            </h2>
          </div>
          <Link
            href="/dashboard/super-admin"
            className="text-sm font-semibold text-slate-500 hover:text-rose-500 transition-colors"
          >
            ยกเลิกการแก้ไข
          </Link>
        </div>
      </nav>

      <div className="max-w-[1600px] mx-auto px-6 mt-10">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center gap-2 mb-8 text-blue-600">
                <FiUser className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-wider text-sm">
                  ข้อมูลส่วนบุคคล
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1">
                    ชื่อ-นามสกุล
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    placeholder="กรุณากรอกชื่อ-นามสกุล"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1">
                    ชื่อผู้ใช้งาน (ระบบ)
                  </label>
                  <div className="w-full bg-slate-100 border border-slate-200 rounded-xl p-4 text-slate-400 font-medium flex items-center gap-2 cursor-not-allowed">
                    <span className="text-slate-400">@</span>
                    {username}
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1">
                    อีเมลติดต่อ
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 pl-12 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      placeholder="example@domain.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1">
                    เบอร์โทรศัพท์
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 pl-12 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      placeholder="0xx-xxx-xxxx"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1">
                    LINE ID
                  </label>
                  <div className="relative">
                    <FiMessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={formData.lineId}
                      onChange={(e) =>
                        setFormData({ ...formData, lineId: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 pl-12 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      placeholder="ไอดีไลน์"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ส่วนเปลี่ยนรหัสผ่าน (เพิ่มใหม่) */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center gap-2 mb-8 text-amber-500">
                <FiLock className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-wider text-sm">
                  ความปลอดภัย (เปลี่ยนรหัสผ่าน)
                </h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1">
                    รหัสผ่านใหม่{" "}
                    <span className="text-slate-400 font-normal ml-1">
                      (เว้นว่างไว้หากไม่ต้องการเปลี่ยน)
                    </span>
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 pl-12 pr-12 text-slate-800 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                      placeholder="กรอกรหัสผ่านใหม่อย่างน้อย 6 ตัวอักษร"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? (
                        <FiEyeOff className="w-5 h-5" />
                      ) : (
                        <FiEye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 italic ml-1">
                  * หากมีการเปลี่ยนรหัสผ่าน
                  ระบบจะทำการเข้ารหัสข้อมูลใหม่เพื่อความปลอดภัยสูงสุด
                </p>
              </div>
            </div>
          </div>

          {/* Settings Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-6 text-slate-800">
                <FiShield className="w-5 h-5" />
                <h3 className="font-bold text-sm uppercase tracking-wider">
                  ระดับสิทธิ์และการเข้าถึง
                </h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                    ระดับผู้ใช้งาน
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value as any })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-bold text-slate-700 outline-none focus:border-blue-500 transition-all cursor-pointer appearance-none"
                  >
                    <option value="editor">บรรณาธิการ (Editor)</option>
                    <option value="admin">ผู้ดูแลระบบ (Admin)</option>
                    <option value="super_admin">
                      ผู้ดูแลระบบสูงสุด (Super Admin)
                    </option>
                  </select>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiActivity
                      className={
                        formData.isActive ? "text-emerald-500" : "text-rose-500"
                      }
                    />
                    <span className="text-sm font-bold text-slate-600">
                      สถานะบัญชี
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, isActive: !formData.isActive })
                    }
                    className={`h-7 w-12 rounded-full transition-all duration-300 relative p-1 ${
                      formData.isActive ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                  >
                    <div
                      className={`h-5 w-5 bg-white rounded-full shadow-sm transition-transform duration-300 transform ${formData.isActive ? "translate-x-5" : "translate-x-0"}`}
                    />
                  </button>
                </div>

                <p className="text-[10px] text-slate-400 text-center italic">
                  ID: {userId}
                </p>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:shadow-none"
                >
                  {saving ? <FiLoader className="animate-spin" /> : <FiSave />}
                  {saving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
