"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Upload,
  Send,
  HelpCircle,
  Loader2,
  Info,
  Activity,
  User,
  Baby,
  Heart,
  Sun,
  Briefcase,
  MoreHorizontal,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import imageCompression from "browser-image-compression";

const LEAVE_TYPES = [
  { id: "sick", label: "ลาป่วย", sub: "Sick Leave", icon: Activity, color: "rose" },
  { id: "personal", label: "ลากิจ", sub: "Personal", icon: User, color: "amber" },
  { id: "paternity", label: "ลาช่วยภริยา", sub: "Paternity", icon: Baby, color: "indigo" },
  { id: "maternity", label: "ลาคลอด", sub: "Maternity", icon: Heart, color: "pink" },
  { id: "ordination", label: "ลาบวช", sub: "Ordination", icon: Sun, color: "orange" },
  { id: "official", label: "ราชการ", sub: "Official", icon: Briefcase, color: "slate" },
  { id: "other", label: "อื่นๆ", sub: "Other", icon: MoreHorizontal, color: "gray" },
];

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
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
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

  const requestedDays = useMemo(() => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (end < start) return 0;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }, [formData.startDate, formData.endDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate || !formData.reason) return;

    if (requestedDays <= 0) return alert("❌ วันที่สิ้นสุดต้องมากกว่าหรือเท่ากับวันที่เริ่มต้น");

    if (quotas && formData.leaveType !== "other") {
      const remaining = quotas[formData.leaveType]?.remaining || 0;
      if (requestedDays > remaining) {
        return alert(`❌ สิทธิ์คงเหลือไม่เพียงพอ (คงเหลือ ${remaining} วัน)`);
      }
    }

    setLoading(true);
    try {
      let attachmentUrl = null;
      if (file) attachmentUrl = await uploadToCloudinary(file);

      const res = await fetch("/api/attendance/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, attachmentUrl }),
      });

      if (!res.ok) throw new Error("บันทึกข้อมูลล้มเหลว");
      setSuccess(true);
      setTimeout(() => router.push("/wfh"), 4000);
    } catch (err: any) {
      alert("❌ " + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex items-center justify-center py-12 px-4 selection:bg-blue-500/30 font-sans relative overflow-hidden">
      {/* Background Depth */}
      <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-rose-500/5 blur-[120px] rounded-full pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="w-full max-w-4xl relative z-10">
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="w-full max-w-xl mx-auto bg-white/80 dark:bg-zinc-900/80 backdrop-blur-3xl border border-emerald-100 dark:border-emerald-500/20 p-12 rounded-4xl text-center shadow-3xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500" />
              <div className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/40 relative">
                 <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" />
                 <CheckCircle2 size={48} className="relative z-10" />
              </div>
              
              <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-4 tracking-tighter uppercase">
                Success <span className="text-emerald-500">Receipt</span>
              </h2>
              <div className="bg-slate-50 dark:bg-zinc-950/50 rounded-3xl p-6 mb-10 border border-slate-100 dark:border-zinc-800 space-y-4">
                 <div className="flex justify-between items-center text-xs">
                    <span className="font-black text-slate-400 uppercase tracking-widest">Type</span>
                    <span className="font-black text-slate-800 dark:text-white uppercase">{LEAVE_TYPES.find(t => t.id === formData.leaveType)?.label}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="font-black text-slate-400 uppercase tracking-widest">Requested Period</span>
                    <span className="font-black text-slate-800 dark:text-white uppercase">{requestedDays} Days</span>
                 </div>
                 <div className="pt-4 border-t border-dashed border-slate-200 dark:border-zinc-800 flex justify-between items-center text-xs">
                    <span className="font-black text-slate-400 uppercase tracking-widest">Status</span>
                    <span className="px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full font-black uppercase text-[10px]">Processing</span>
                 </div>
              </div>

              <p className="text-slate-400 dark:text-zinc-500 font-bold mb-8 text-sm uppercase tracking-widest">
                Returning you to WFH Hub in a few moments...
              </p>
              
              <div className="w-full bg-emerald-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 4, ease: "linear" }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Form Info & Quotas */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-4 space-y-6"
              >
                <div className="space-y-4">
                  <Link href="/wfh" className="group flex items-center gap-3 w-fit">
                    <div className="p-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl text-slate-400 group-hover:text-blue-500 group-hover:border-blue-200 shadow-sm transition-all group-hover:-translate-x-1">
                      <ArrowLeft size={18} />
                    </div>
                  </Link>
                  <div className="pl-1">
                    <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter uppercase leading-none mb-3">
                      Leave <span className="text-blue-600">Request</span>
                    </h1>
                    <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.3em] pl-1 flex items-center gap-2">
                       <span className="w-1.5 h-1.5 bg-blue-500 rounded-full inline-block" />
                       Attendance Management v2.0
                    </p>
                  </div>
                </div>

                {/* Quota Dashboard */}
                <div className="space-y-3">
                   <h3 className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest pl-2 mb-4">Availability Matrix</h3>
                   <div className="grid grid-cols-1 gap-3">
                     {!quotaLoading && quotas && LEAVE_TYPES.map(type => (
                       type.id !== "other" && quotas[type.id] && (
                         <motion.div 
                           key={type.id}
                           whileHover={{ scale: 1.02 }}
                           className={`p-5 rounded-3xl bg-white dark:bg-zinc-900 border transition-all flex items-center justify-between group shadow-sm ${formData.leaveType === type.id ? 'border-blue-500 dark:border-blue-500/50 shadow-xl shadow-blue-500/5' : 'border-slate-100 dark:border-zinc-800'}`}
                         >
                            <div className="flex items-center gap-4">
                               <div className={`p-3 rounded-2xl bg-${type.color}-500/10 text-${type.color}-600 group-hover:rotate-12 transition-transform`}>
                                  <type.icon size={20} />
                               </div>
                               <div>
                                  <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-600 uppercase tracking-widest mb-1">{type.label}</p>
                                  <h4 className="text-lg font-black text-slate-800 dark:text-white leading-none">{quotas[type.id].remaining} <span className="text-[10px] uppercase text-slate-400 font-bold ml-1">Days left</span></h4>
                               </div>
                            </div>
                            {formData.leaveType === type.id && (
                               <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-glow shadow-blue-500" />
                            )}
                         </motion.div>
                       )
                     ))}
                   </div>
                </div>
              </motion.div>

              {/* Right Column: Form */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-8 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-3xl border border-slate-100 dark:border-zinc-800 rounded-4xl shadow-3xl overflow-hidden"
              >
                <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
                  {/* Visual Dropdown Replacement */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest px-2">Select Purpose</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                       {LEAVE_TYPES.map(type => (
                         <button
                           key={type.id}
                           type="button"
                           onClick={() => setFormData({ ...formData, leaveType: type.id })}
                           className={`flex flex-col items-center justify-center p-5 rounded-3xl border-2 transition-all gap-2 group ${formData.leaveType === type.id ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/30 -translate-y-1' : 'bg-slate-50 dark:bg-zinc-950 border-transparent hover:border-slate-200 dark:hover:border-zinc-800 grayscale hover:grayscale-0 opacity-60 hover:opacity-100'}`}
                         >
                            <type.icon size={22} className={`group-hover:scale-110 transition-transform ${formData.leaveType === type.id ? 'text-white' : `text-${type.color}-500`}`} />
                            <span className="text-[9px] font-black uppercase tracking-widest">{type.label}</span>
                         </button>
                       ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest px-2">Duration Matrix</label>
                      <div className="space-y-3">
                         <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500">
                               <Calendar size={18} />
                            </div>
                            <input
                              type="date"
                              value={formData.startDate}
                              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                              className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800 rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 dark:text-white font-black text-sm transition-all appearance-none cursor-pointer"
                              required
                            />
                            <span className="absolute top-0 right-5 -translate-y-1/2 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 px-3 py-1 rounded-full text-[9px] font-black uppercase text-slate-400 tracking-widest shadow-sm">Start</span>
                         </div>
                         <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500">
                               <Calendar size={18} />
                            </div>
                            <input
                              type="date"
                              value={formData.endDate}
                              min={formData.startDate}
                              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                              className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800 rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 dark:text-white font-black text-sm transition-all appearance-none cursor-pointer"
                              required
                            />
                            <span className="absolute top-0 right-5 -translate-y-1/2 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 px-3 py-1 rounded-full text-[9px] font-black uppercase text-slate-400 tracking-widest shadow-sm">End</span>
                         </div>
                      </div>
                    </div>
                    
                    {/* Duration Badge */}
                    <div className="h-full flex flex-col justify-end">
                       <AnimatePresence>
                         {requestedDays > 0 && (
                            <motion.div 
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="bg-blue-600 rounded-3xl p-6 text-white shadow-2xl shadow-blue-500/20 text-center relative overflow-hidden group mb-1"
                            >
                               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
                                  <Clock size={60} />
                               </div>
                               <h4 className="text-4xl font-black leading-none">{requestedDays}</h4>
                               <p className="text-[10px] font-black uppercase opacity-60 tracking-[0.2em] mt-1">Total Days Requested</p>
                            </motion.div>
                         )}
                       </AnimatePresence>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest px-2">Detailed Justification</label>
                    <div className="relative group">
                      <div className="absolute left-5 top-6 text-slate-400 group-focus-within:text-blue-500">
                        <FileText size={18} />
                      </div>
                      <textarea
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        rows={4}
                        className="w-full pl-14 pr-8 py-6 bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800 rounded-4xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 dark:text-white font-bold text-sm tracking-tight resize-none transition-all placeholder:text-slate-300 dark:placeholder:text-zinc-800 shadow-inner"
                        placeholder="Please elaborate on your request objective..."
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest px-2">Documentary Proof (Optional)</label>
                    <label className="flex flex-col items-center justify-center w-full min-h-[160px] border-3 border-dashed border-slate-100 dark:border-zinc-800 rounded-4xl cursor-pointer bg-slate-50/50 dark:bg-zinc-950/20 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-all group overflow-hidden relative">
                      {previewUrl ? (
                        <div className="w-full h-full absolute inset-0 p-3">
                          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-3xl" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-black text-xs uppercase tracking-widest">Change Artifact</div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8">
                          <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-4 rounded-3xl shadow-xl group-hover:scale-110 transition-transform mb-4">
                            <Upload className="w-6 h-6 text-blue-500" />
                          </div>
                          <p className="text-xs font-black text-slate-700 dark:text-zinc-300 uppercase tracking-widest">Upload <span className="text-blue-500">Supporting Attachment</span></p>
                          <p className="text-[9px] text-slate-400 mt-2 font-bold uppercase tracking-[0.2em]">MAX 5MB • PNG / JPEG</p>
                        </div>
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                  </div>

                  <div className="pt-10 border-t border-slate-100 dark:border-zinc-800 flex flex-col md:flex-row gap-6 items-center">
                    <button
                      type="submit"
                      disabled={loading || quotaLoading}
                      className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-6 rounded-3xl font-black flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-slate-900/20 dark:shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" size={24} />
                      ) : (
                        <>
                          <span className="uppercase tracking-widest text-sm">Submit Request</span>
                          <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </button>
                    
                    <div className="flex items-center gap-4 px-6 py-4 bg-slate-50 dark:bg-zinc-950/50 rounded-2xl border border-slate-100 dark:border-zinc-800 opacity-60">
                       <Info size={16} className="text-blue-500" />
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-loose">
                          Requests are sent directly to DC Department <br/> for immediate verification.
                       </p>
                    </div>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          background: transparent;
          bottom: 0;
          color: transparent;
          cursor: pointer;
          height: auto;
          left: 0;
          position: absolute;
          right: 0;
          top: 0;
          width: auto;
        }
      `}</style>
    </div>
  );
}

const Clock = ({ className, size }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
