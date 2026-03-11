"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import Image from "next/image";
import {
  FiArrowLeft,
  FiUploadCloud,
  FiSave,
  FiCheckCircle,
  FiLink,
  FiHash,
  FiImage,
  FiLoader,
  FiX,
} from "react-icons/fi";

export default function AddBannerPage() {
  const router = useRouter();

  // State สำหรับข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    title: "",
    linkUrl: "",
    order: 0,
    isActive: true,
  });

  // State สำหรับจัดการไฟล์ภาพ
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // ฟังก์ชันเลือกรูปภาพและทำ Preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // จำกัด 5MB
        return toast.error("ขนาดไฟล์ต้องไม่เกิน 5MB");
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // สร้าง URL จำลองเพื่อดูรูป
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return toast.error("กรุณาเลือกรูปภาพแบนเนอร์");

    setUploading(true);
    try {
      // 1. อัปโหลดรูปภาพก่อน
      const uploadFormData = new FormData();
      uploadFormData.append("file", selectedFile);

      const uploadRes = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");
      const { imageUrl } = await uploadRes.json();

      // 2. บันทึกข้อมูลแบนเนอร์ลง Database
      const res = await fetch("/api/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          imageUrl: imageUrl, // ใช้ URL ที่ได้จาก API Upload
        }),
      });

      if (res.ok) {
        toast.success("เพิ่มแบนเนอร์เรียบร้อยแล้ว");
        setTimeout(() => router.push("/dashboard/banners"), 1500);
      } else {
        toast.error("บันทึกข้อมูลล้มเหลว");
      }
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <Toaster position="top-center" />

      {/* Top Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <FiArrowLeft className="text-slate-600" />
            </button>
            <h2 className="font-bold text-slate-800 italic uppercase">
              
            </h2>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 mt-10">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* ส่วนซ้าย: อัปโหลดรูปภาพ */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-8">
              <div className="flex items-center gap-2 mb-6 text-blue-600">
                <FiImage className="w-5 h-5" />
                <h3 className="font-black uppercase tracking-wider text-sm italic">
                  Banner Image
                </h3>
              </div>

              <div className="relative">
                {!previewUrl ? (
                  <label className="flex flex-col items-center justify-center w-full aspect-[21/9] border-4 border-dashed border-slate-200 rounded-[2rem] cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition-all group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FiUploadCloud className="w-12 h-12 text-slate-300 group-hover:text-blue-500 mb-4 transition-colors" />
                      <p className="text-sm text-slate-500 font-bold uppercase tracking-tighter">
                        คลิกเพื่ออัปโหลดรูปภาพ
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase italic tracking-widest">
                        แนะนำขนาด 1920 x 820 px (ไฟล์ไม่เกิน 5MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                ) : (
                  <div className="relative aspect-[21/9] rounded-[2rem] overflow-hidden border-4 border-white shadow-xl group">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl(null);
                        setSelectedFile(null);
                      }}
                      className="absolute top-4 right-4 bg-rose-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX />
                    </button>
                  </div>
                )}
              </div>
              <p className="mt-4 text-[10px] text-slate-400 italic">
                ** รูปภาพที่อัปโหลดจะถูกปรับขนาดให้แสดงผลเป็นสัดส่วน Wide-screen
                อัตโนมัติ
              </p>
            </div>
          </div>

          {/* ส่วนขวา: ข้อมูลแบนเนอร์ */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200">
              <div className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    หัวข้อแบนเนอร์
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-bold"
                      placeholder="เช่น ประกาศรับสมัครนักศึกษา..."
                    />
                  </div>
                </div>

                {/* Link URL */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    ลิงก์ปลายทาง (ถ้ามี)
                  </label>
                  <div className="relative">
                    <FiLink className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="url"
                      value={formData.linkUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, linkUrl: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 pl-12 text-slate-800 outline-none focus:border-blue-500 transition-all text-sm"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                {/* Order & Status */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      ลำดับสไลด์
                    </label>
                    <div className="relative">
                      <FiHash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            order: parseInt(e.target.value),
                          })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 pl-12 font-bold outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      สถานะ
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          isActive: !formData.isActive,
                        })
                      }
                      className={`w-full p-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${formData.isActive ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-100 text-slate-400"}`}
                    >
                      <FiCheckCircle />{" "}
                      {formData.isActive ? "แสดงผล" : "ปิดไว้"}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-slate-900 text-white font-black py-5 rounded-[1.5rem] hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 uppercase tracking-tighter disabled:bg-slate-300"
                >
                  {uploading ? (
                    <FiLoader className="animate-spin text-xl" />
                  ) : (
                    <>
                      <FiSave className="text-xl" />
                      สร้างแบนเนอร์เลย
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
