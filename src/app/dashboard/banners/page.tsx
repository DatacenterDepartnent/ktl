"use client";

import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiLoader,
  FiImage,
} from "react-icons/fi";

export default function BannerManagementPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/banners");
      if (res.ok) {
        const data = await res.json();
        // เรียงลำดับตามตัวเลข order
        const sortedData = data.sort(
          (a: any, b: any) => (a.order || 0) - (b.order || 0),
        );
        setBanners(sortedData);
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

  const handleDelete = async (id: string, title: string) => {
    if (
      !window.confirm(
        `ยืนยันการลบแบนเนอร์: "${title}"?\nการกระทำนี้จะถูกบันทึกในระบบ Log`,
      )
    )
      return;

    setIsDeleting(id);
    try {
      const res = await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success(`ลบแบนเนอร์ "${title}" สำเร็จ`);
        setBanners(banners.filter((b: any) => b._id !== id));
      } else {
        const err = await res.json();
        toast.error(err.error || "ลบล้มเหลว");
      }
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดทางเทคนิค");
    } finally {
      setIsDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <FiLoader className="w-10 h-10 animate-spin text-blue-600" />
        <p className="font-black text-slate-400 uppercase tracking-widest animate-pulse">
          Fetching Banners...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-slate-50 min-h-screen animate-in fade-in duration-500">
      <Toaster position="bottom-right" />

      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 border-b pb-8 border-slate-200 gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 italic uppercase tracking-tighter flex items-center gap-3">
            <FiImage className="text-blue-600 not-italic" />
            Banner <span className="text-blue-600">Slides</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium italic">
            จัดการรูปภาพแบนเนอร์หลักและตรวจสอบความปลอดภัยผ่าน Audit Log
          </p>
        </div>
        <Link
          href="/dashboard/banners/add"
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 active:scale-95 text-xs uppercase tracking-widest"
        >
          <FiPlus strokeWidth={3} /> Add New Banner
        </Link>
      </div>

      {/* --- Banner Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {banners.map((banner: any) => (
          <div
            key={banner._id}
            className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden flex flex-col group hover:shadow-2xl hover:border-blue-200 transition-all duration-500"
          >
            {/* Image Section */}
            <div className="relative aspect-[16/9] w-full bg-slate-100 border-b border-slate-100 overflow-hidden">
              <Image
                src={banner.imageUrl}
                alt={banner.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                unoptimized
              />

              {/* Overlay Status Badge */}
              <div
                className={`absolute top-5 right-5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2 shadow-lg backdrop-blur-md border ${
                  banner.isActive
                    ? "bg-emerald-500/90 text-white border-emerald-400"
                    : "bg-rose-500/90 text-white border-rose-400"
                }`}
              >
                {banner.isActive ? <FiEye /> : <FiEyeOff />}
                {banner.isActive ? "Online" : "Offline"}
              </div>
            </div>

            {/* Content Section */}
            <div className="p-7 flex-grow flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-lg uppercase">
                    Order: {banner.order}
                  </span>
                </div>
                <h3 className="font-black text-slate-800 text-xl truncate group-hover:text-blue-600 transition-colors">
                  {banner.title}
                </h3>
                {banner.linkUrl && (
                  <p className="text-[11px] text-blue-500 bg-blue-50 px-3 py-1 rounded-full mt-3 truncate w-fit font-bold">
                    Link: {banner.linkUrl}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 mt-8 pt-5 border-t border-slate-50">
                <Link
                  href={`/dashboard/banners/edit/${banner._id}`}
                  className="flex-1 bg-slate-50 text-slate-600 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-50 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100"
                >
                  <FiEdit2 size={14} /> EDIT
                </Link>
                <button
                  onClick={() => handleDelete(banner._id, banner.title)}
                  disabled={isDeleting === banner._id}
                  className="p-3 text-rose-400 bg-rose-50 hover:bg-rose-500 hover:text-white rounded-xl transition-all disabled:opacity-50"
                >
                  {isDeleting === banner._id ? (
                    <FiLoader className="animate-spin" />
                  ) : (
                    <FiTrash2 size={18} />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- Empty State --- */}
      {banners.length === 0 && !loading && (
        <div className="text-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-slate-100">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiImage className="text-3xl text-slate-200" />
          </div>
          <p className="text-slate-400 font-black uppercase tracking-widest text-sm">
            No active banners found in system
          </p>
        </div>
      )}
    </div>
  );
}
