"use client";

import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff } from "react-icons/fi";

export default function BannerManagementPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/banners");
      if (res.ok) {
        const data = await res.json();
        setBanners(data);
      } else {
        toast.error("ไม่สามารถโหลดข้อมูลแบนเนอร์ได้");
      }
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // ฟังก์ชันสำหรับลบแบนเนอร์ (ต้องสร้าง API DELETE เพิ่มเติม)
  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`คุณต้องการลบแบนเนอร์ "${title}" ใช่หรือไม่?`)) return;
    try {
      const res = await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("ลบแบนเนอร์สำเร็จ");
        fetchBanners(); // โหลดข้อมูลใหม่
      } else {
        toast.error("ลบล้มเหลว");
      }
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  if (loading) return <div className="p-10 text-center">กำลังโหลด...</div>;

  return (
    <div className="p-6 md:p-10 bg-slate-50 min-h-screen">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex items-center justify-between mb-10 border-b pb-6 border-slate-200">
        <div>
          <h1 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">
            จัดการแบนเนอร์สไลด์
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            เพิ่ม แก้ไข หรือลบรูปภาพแบนเนอร์ที่จะแสดงบนหน้าแรกของเว็บไซต์ KTLTC
          </p>
        </div>
        <Link
          href="/dashboard/banners/add"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
        >
          <FiPlus /> เพิ่มแบนเนอร์ใหม่
        </Link>
      </div>

      {/* บอร์ดรายการ Banner (UI แบบ Card เพื่อให้เห็นรูปชัดเจน) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {banners.map((banner: any) => (
          <div
            key={banner._id}
            className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col group hover:shadow-xl hover:border-blue-100 transition-all duration-300"
          >
            {/* รูปภาพแบนเนอร์ */}
            <div className="relative aspect-[16/9] w-full bg-slate-100 border-b border-slate-100">
              <Image
                src={banner.imageUrl}
                alt={banner.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Badge สถานะ */}
              <div
                className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 shadow-md ${banner.isActive ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-500 border border-rose-100"}`}
              >
                {banner.isActive ? <FiEye /> : <FiEyeOff />}
                {banner.isActive ? "แสดงผลอยู่" : "ปิดการแสดงผล"}
              </div>
            </div>

            {/* ข้อมูลแบนเนอร์ */}
            <div className="p-6 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-lg truncate group-hover:text-blue-600 transition-colors">
                  {banner.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  ลำดับการแสดงผล:{" "}
                  <span className="font-bold text-slate-600">
                    {banner.order}
                  </span>
                </p>
                {banner.linkUrl && (
                  <p className="text-[10px] text-blue-500 bg-blue-50 px-2 py-0.5 rounded mt-2 truncate w-fit font-medium">
                    Link: {banner.linkUrl}
                  </p>
                )}
              </div>

              {/* ปุ่มจัดการ */}
              <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-slate-100">
                <Link
                  href={`/dashboard/banners/edit/${banner._id}`}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <FiEdit2 size={16} />
                </Link>
                <button
                  onClick={() => handleDelete(banner._id, banner.title)}
                  className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {banners.length === 0 && !loading && (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-medium">
            ยังไม่มีข้อมูลแบนเนอร์ในระบบ
          </p>
          <p className="text-xs text-slate-400 mt-1">
            กดปุ่ม "เพิ่มแบนเนอร์ใหม่" ด้านบนเพื่อเริ่มสร้าง
          </p>
        </div>
      )}
    </div>
  );
}
