"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, FileText, Upload, Send, HelpCircle, Loader2, Info } from "lucide-react";
import imageCompression from "browser-image-compression";

export default function LeaveRequestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [quotas, setQuotas] = useState<any>(null);
  const [quotaLoading, setQuotaLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    leaveType: "sick",
    startDate: "",
    endDate: "",
    reason: "",
  });
  
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/attendance/leave/quota")
      .then(res => res.json())
      .then(data => {
         if(data.success) {
           setQuotas(data.quotas);
         }
      })
      .finally(() => setQuotaLoading(false));
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const uploadToCloudinary = async (file: File) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) throw new Error("Cloudinary config missing");

    const options = { maxSizeMB: 0.5, maxWidthOrHeight: 1024, useWebWorker: true };
    const compressedFile = await imageCompression(file, options);

    const formData = new FormData();
    formData.append("file", compressedFile);
    formData.append("upload_preset", uploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });
    
    if (!res.ok) throw new Error("อัปโหลดไฟล์ไม่สำเร็จ");
    const data = await res.json();
    return data.secure_url;
  };

  const getRequestedDays = () => {
    if(!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if(end < start) return 0;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate || !formData.reason) return;
    
    const requestedDays = getRequestedDays();
    if (requestedDays <= 0) return alert("❌ วันที่สิ้นสุดต้องมากกว่าหรือเท่ากับวันที่เริ่มต้น");

    // Quota validation
    if (quotas && formData.leaveType !== "other") {
      const remaining = quotas[formData.leaveType]?.remaining || 0;
      if (requestedDays > remaining) {
        return alert(`❌ ไม่สามารถลางานได้ เนื่องจากสิทธิ์ลา${
          formData.leaveType === "sick" ? "ป่วย" : 
          formData.leaveType === "personal" ? "กิจ" : 
          formData.leaveType === "vacation" ? "พักร้อน" : "คลอด"
        } คงเหลือเพียง ${remaining} วัน (คุณร้องขอ ${requestedDays} วัน)`);
      }
    }
    
    setLoading(true);
    try {
      let attachmentUrl = null;
      if (file) {
        attachmentUrl = await uploadToCloudinary(file);
      }

      const res = await fetch("/api/attendance/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, attachmentUrl }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "บันทึกข้อมูลล้มเหลว");
      }

      setSuccess(true);
      setTimeout(() => router.push("/wfh"), 3000);
    } catch (err: any) {
      alert("❌ " + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col items-center justify-center py-12 px-4 selection:bg-blue-500/30 font-sans">
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

      {success ? (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-500/30 p-10 rounded-[2.5rem] text-center shadow-2xl relative z-10">
          <div className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-3">ส่งคำขอลาสำเร็จ!</h2>
          <p className="text-slate-500 dark:text-zinc-400 font-medium mb-8 text-lg">HR ได้รับเรื่องของท่านแล้ว ระบบกำลังพากลับผู้ใช้งานเดิม...</p>
          <div className="w-full bg-emerald-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 3 }} className="h-full bg-emerald-500 rounded-full" />
          </div>
        </motion.div>
      ) : (
        <div className="w-full max-w-2xl relative z-10 space-y-4">
          
          {/* Quota Panel */}
          {!quotaLoading && quotas && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex overflow-x-auto pb-2 gap-3 snap-x hide-scrollbar">
              {[
                { key: "sick", label: "ลาป่วย", color: "bg-rose-50 text-rose-600 border-rose-200" },
                { key: "personal", label: "ลากิจ", color: "bg-blue-50 text-blue-600 border-blue-200" },
                { key: "vacation", label: "ลาพักร้อน", color: "bg-emerald-50 text-emerald-600 border-emerald-200" }
              ].map(q => (
                <div key={q.key} className={`flex-none snap-start min-w-[140px] px-4 py-3 rounded-2xl border ${q.color} bg-white/60 dark:bg-zinc-900 backdrop-blur-sm shadow-sm`}>
                   <div className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">{q.label}</div>
                   <div className="flex items-baseline gap-1">
                     <span className="text-2xl font-black">{quotas[q.key].remaining}</span>
                     <span className="text-xs font-bold opacity-70">/ {quotas[q.key].total} วัน</span>
                   </div>
                </div>
              ))}
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-4xl shadow-2xl overflow-hidden">
            <div className="bg-slate-900 dark:bg-zinc-950 p-6 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-4">
                <Link href="/wfh" className="text-white/60 hover:text-white bg-white/10 p-3 rounded-full transition-colors">
                  <ArrowLeft size={20} />
                </Link>
                <div>
                  <h1 className="text-xl font-black text-white uppercase tracking-wider">Leave Request</h1>
                  <p className="text-slate-400 text-xs font-medium mt-0.5">แบบฟอร์มแจ้งบันทึกการลางาน</p>
                </div>
              </div>
              <HelpCircle className="text-white/20" size={24} />
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="flex items-center justify-between text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest pl-1">
                    ประเภทการลา (Leave Type)
                    {formData.leaveType !== "other" && quotas && (
                      <span className="text-indigo-500 flex items-center gap-1"><Info size={12}/> โควตาคงเหลือ: {quotas[formData.leaveType]?.remaining} วัน</span>
                    )}
                  </label>
                  <select
                    value={formData.leaveType}
                    onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                    className="w-full p-4 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-800 dark:text-white font-medium"
                  >
                    <option value="sick">ลาป่วย (Sick Leave)</option>
                    <option value="personal">ลากิจ (Personal Leave)</option>
                    <option value="vacation">ลาพักร้อน (Vacation Leave)</option>
                    <option value="maternity">ลาคลอด (Maternity Leave)</option>
                    <option value="other">อื่นๆ (Other)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest pl-1">จากวันที่ (Start Date)</label>
                    <div className="relative group">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-800 dark:text-white font-medium shadow-sm hover:shadow-md transition-all appearance-none"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest pl-1">ถึงวันที่ (End Date)</label>
                    <div className="relative group">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                      <input
                        type="date"
                        value={formData.endDate}
                        min={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-800 dark:text-white font-medium shadow-sm hover:shadow-md transition-all appearance-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest pl-1">เหตุผลการลา (Reason)</label>
                  <div className="relative group">
                    <FileText className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <textarea
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      rows={3}
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-800 dark:text-white font-medium resize-none shadow-sm hover:shadow-md transition-all"
                      placeholder="ระบุเหตุผลในการลางานที่ชัดเจน..."
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest pl-1">แนบไฟล์เอกสาร / ใบรับรองแพทย์ (ถ้ามี)</label>
                  <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-300 dark:border-zinc-700 rounded-2xl cursor-pointer bg-slate-50/50 hover:bg-slate-100 dark:bg-zinc-900/50 dark:hover:bg-zinc-800/80 transition-colors group">
                    {previewUrl ? (
                      <div className="w-full h-full p-2">
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-contain rounded-xl shadow-sm" />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <div className="bg-white dark:bg-zinc-800 p-3 rounded-full shadow-sm mb-3">
                          <Upload className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
                        </div>
                        <p className="text-sm font-medium text-slate-600 dark:text-zinc-300">ลาก&วางไฟล์ หรือ <span className="text-blue-500 font-bold">คลิกค้นหา</span></p>
                        <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest max-w-[200px] text-center">PNG, JPG เฉพาะภาพนิ่ง ไฟล์ขนาดไม่เกิน 5MB</p>
                      </div>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-zinc-800 mt-4">
                <button
                  type="submit"
                  disabled={loading || quotaLoading}
                  className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-slate-900/10 disabled:opacity-70 disabled:cursor-not-allowed group overflow-hidden relative"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin relative z-10" size={20} />
                      <span className="relative z-10">กำลังตรวจสอบข้อมูล...</span>
                    </>
                  ) : (
                    <>
                      <span className="relative z-10">ส่งคำขอลางาน</span>
                      <Send size={18} className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
