"use client";
import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  FiSend,
  FiMessageSquare,
  FiUser,
  FiEdit3,
  FiClock,
  FiCheckCircle,
  FiZap,
  FiHelpCircle,
} from "react-icons/fi";

export default function QAPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ guestName: "", subject: "", content: "" });

  const fetchQuestions = async () => {
    try {
      const res = await fetch("/api/questions/public");
      const data = await res.json();
      setQuestions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.content.trim())
      return toast.error("กรุณากรอกข้อมูลในช่องที่จำเป็นให้ครบถ้วนนะครับ");

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/questions/public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success("ส่งคำถามเข้าสู่ระบบเรียบร้อยแล้ว!", {
          style: {
            borderRadius: "16px",
            background: "#1e293b",
            color: "#fff",
            fontFamily: "inherit",
          },
        });
        setForm({ guestName: "", subject: "", content: "" });
        fetchQuestions();
      } else {
        toast.error("เกิดข้อผิดพลาดในการส่งข้อมูล");
      }
    } catch (error) {
      toast.error("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ในขณะนี้");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 font-sans">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-bold tracking-[0.2em] animate-pulse">
          กำลังโหลดฐานข้อมูล...
        </p>
      </div>
    );

  return (
    <div className=" bg-[#fcfcfd] text-slate-900 font-sans selection:bg-cyan-100 px-2">
      <Toaster position="top-right" />

      {/* พื้นหลังตกแต่ง (Background Decor) */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] rounded-full bg-cyan-100/40 blur-[100px]"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] rounded-full bg-indigo-100/40 blur-[100px]"></div>
      </div>

      <div className="relative z-10   mx-auto max-w-[1600px] py-10 md:py-16">
        {/* ส่วนหัว (Header) */}
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
            <div className="flex items-center gap-5">
              <div className="bg-slate-900 p-4 rounded-2xl shadow-lg shadow-slate-200">
                <FiMessageSquare className="text-white text-3xl" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 uppercase">
                  ระบบ<span className="text-cyan-500"> Q&A</span>
                </h1>
                <p className="text-slate-500 font-bold text-xs mt-1 flex items-center gap-2 tracking-wide uppercase">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                  ระบบรับฝากคำถามออนไลน์ - วท.กันทรลักษ์
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  สถานะเซิร์ฟเวอร์
                </p>
                <p className="text-xs font-black text-slate-700">
                  เชื่อมต่อเสถียร
                </p>
              </div>
              <FiZap className="text-yellow-400 text-xl" />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* ส่วนแบบฟอร์ม (Form Side) */}
          <aside className="lg:col-span-5">
            <div className="sticky top-10">
              <div className="">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center text-white">
                    <FiEdit3 size={18} />
                  </div>
                  <h2 className="text-xl font-black text-slate-800 dark:text-white italic uppercase">
                    สร้างคำร้องใหม่
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase ml-1">
                      <FiUser size={14} className="text-cyan-500" /> ชื่อผู้ส่ง
                      <span className="text-cyan-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น ศิษย์เก่า KTLTC / ผู้ปกครอง"
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl p-4 font-bold outline-none focus:ring-4 focus:ring-cyan-500/5 focus:border-cyan-500 transition-all placeholder:text-slate-300"
                      required
                      value={form.guestName}
                      onChange={(e) =>
                        setForm({ ...form, guestName: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                      หัวข้อคำถาม <span className="text-cyan-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="ระบุเรื่องที่ต้องการสอบถาม..."
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 md:p-5 font-bold outline-none focus:ring-4 focus:ring-cyan-500/5 focus:border-cyan-500 focus:bg-white transition-all"
                      required
                      value={form.subject}
                      onChange={(e) =>
                        setForm({ ...form, subject: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                      รายละเอียด<span className="text-cyan-500">*</span>
                    </label>
                    <textarea
                      placeholder="Type details here..."
                      className="h-44 w-full bg-slate-900 text-white rounded-3xl p-5 md:p-6 font-medium outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 transition-all resize-none shadow-inner leading-relaxed"
                      required
                      value={form.content}
                      onChange={(e) =>
                        setForm({ ...form, content: e.target.value })
                      }
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group w-full bg-slate-950 text-white h-16 rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-300 dark:shadow-none hover:bg-cyan-600 transition-all disabled:bg-slate-200 disabled:text-slate-400 flex items-center justify-center gap-4 active:scale-[0.98] relative overflow-hidden"
                  >
                    <div className="relative z-10 flex items-center gap-3">
                      {isSubmitting ? (
                        "PROCESSING..."
                      ) : (
                        <>
                          SUBMIT ↗
                          <FiSend className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </div>
                  </button>
                </form>

                <div className="mt-10 p-6 bg-slate-50/50 rounded-2xl border border-slate-100/50 italic">
                  <div className="flex gap-3 items-start">
                    <FiHelpCircle
                      className="text-cyan-500 mt-1 shrink-0"
                      size={18}
                    />
                    <p className="text-[10px] text-slate-500 leading-relaxed font-bold">
                      คำถามของคุณจะถูกส่งไปยังเจ้าหน้าที่ที่เกี่ยวข้องโดยตรง
                      เราจะพยายามตอบภายใน 24-48 ชั่วโมง
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* ส่วนรายการ (List Side) */}
          <main className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-4 mb-2 px-2">
              <FiClock className="text-cyan-500 text-xl" />
              <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase italic">
                รายการล่าสุด
              </h2>
            </div>

            {questions.length === 0 ? (
              <div className="py-24 text-center bg-white border-2 border-dashed border-slate-100 rounded-[3rem]">
                <p className="text-slate-300 font-bold uppercase tracking-widest text-sm">
                  ยังไม่มีข้อมูลในระบบ
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {questions.map((q) => (
                  <div
                    key={q._id}
                    className="group bg-white rounded-4xl p-4 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/30 transition-all duration-300"
                  >
                    <div className="flex flex-wrap justify-between items-center gap-4 mb-6 border-b border-slate-50 pb-6">
                      <span
                        className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest 
                        ${q.answer ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}
                      >
                        {q.answer ? "ดำเนินการแล้ว" : "กำลังรอตรวจสอบ"}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-lg">
                        📅{" "}
                        {new Date(q.createdAt).toLocaleDateString("th-TH", {
                          day: "numeric",
                          month: "short",
                          year: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-2xl font-black text-slate-900 italic tracking-tight uppercase group-hover:text-cyan-600 transition-colors">
                        {q.subject}
                      </h3>
                      <p className="text-xs font-bold text-slate-400 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                        ผู้ส่ง: {q.guestName || "ผู้ใช้งานทั่วไป"}
                      </p>
                      <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl font-medium leading-relaxed shadow-inner shadow-black/10">
                        {q.content}
                      </div>
                    </div>

                    {q.answer && (
                      <div className="mt-8 pt-8 border-t-2 border-slate-50">
                        <div className="flex items-center gap-2 mb-4">
                          <FiCheckCircle className="text-cyan-500" />
                          <span className="text-[10px] font-black text-cyan-600 uppercase tracking-widest">
                            คำตอบจากเจ้าหน้าที่ ({q.repliedBy})
                          </span>
                        </div>
                        <p className="text-slate-700 font-bold bg-cyan-50/50 p-6 rounded-2xl border-l-4 border-cyan-400 whitespace-pre-wrap">
                          {q.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
