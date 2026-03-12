"use client";

import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";

interface Question {
  _id: string;
  guestName: string;
  subject: string;
  content: string;
  answer: string | null;
  status: "pending" | "answered";
  createdAt: string;
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null,
  );
  const [answerText, setAnswerText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 1. ดึงข้อมูล
  const fetchQuestions = async () => {
    try {
      const res = await fetch("/api/questions/public");
      if (res.ok) {
        const data = await res.json();
        setQuestions(data);
      }
    } catch (error) {
      toast.error("LOAD_FAILED: ติดต่อ Server ไม่ได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // 2. ระบบวาร์ป (Auto-Scroll)
  useEffect(() => {
    if (!loading && window.location.hash) {
      const id = window.location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.classList.add(
            "ring-4",
            "ring-cyan-500",
            "scale-[1.01]",
            "z-10",
          );
          setTimeout(
            () =>
              element.classList.remove(
                "ring-4",
                "ring-cyan-500",
                "scale-[1.01]",
              ),
            3000,
          );
        }, 500);
      }
    }
  }, [loading, questions]);

  // 3. ฟังก์ชันลบ (Delete)
  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "⚠️ ยืนยันการลบข้อมูล: คำเตือน! ข้อมูลที่ถูกลบจะไม่สามารถกู้คืนได้ โปรดตรวจสอบให้แน่ใจก่อนดำเนินการ",
      )
    )
      return;
    try {
      // แก้จาก /public เป็น /reply
      const res = await fetch(`/api/questions/reply?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("DELETED: ลบเรียบร้อย!");
        fetchQuestions();
      } else {
        const errorData = await res.json();
        toast.error(`ERROR: ${errorData.error}`);
      }
    } catch (error) {
      toast.error("DELETE_FAILED");
    }
  };
  // 4. ฟังก์ชันส่งคำตอบ (รองรับ Edit)
  const handleReply = async () => {
    if (!answerText.trim()) return toast.error("ใส่คำตอบด้วยสัส!");
    setSubmitting(true);
    try {
      const res = await fetch("/api/questions/reply", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: selectedQuestion?._id,
          answerText,
          // 🟢 เช็คตรงนี้: ถ้า selectedQuestion มีคำตอบเดิมอยู่แล้ว ให้ถือว่าเป็นลูกแก้ว Edit
          isEditing:
            selectedQuestion?.status === "answered" ||
            !!selectedQuestion?.answer,
        }),
      });

      if (res.ok) {
        toast.success(
          selectedQuestion?.answer ? "EDITED: แก้ไขแล้ว!" : "SENT: ตอบแล้ว!",
        );
        setSelectedQuestion(null);
        setAnswerText("");
        fetchQuestions();
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen font-black italic text-slate-400 animate-pulse">
        BOOTING_SYSTEM...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-12 bg-white min-h-screen">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex justify-between items-end mb-12 border-b-4 border-slate-900 pb-6">
        <div>
          <h1 className="text-5xl font-black text-slate-900 italic uppercase tracking-tighter">
            Q&A_Vault
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">
            ศูนย์จัดการคำถามและแก้ไขคำตอบ
          </p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Database_Status
          </p>
          <p className="text-xl font-black text-emerald-500 italic">
            ONLINE_CONNECTED
          </p>
        </div>
      </div>

      <div className="grid gap-8">
        {questions.length === 0 ? (
          <div className="py-20 text-center border-4 border-dashed border-slate-100 rounded-[3rem]">
            <p className="text-slate-300 font-black italic uppercase tracking-widest text-2xl">
              No_Tickets_In_Vault
            </p>
          </div>
        ) : (
          questions.map((q) => (
            <div
              key={q._id}
              id={q._id}
              className={`group relative p-8 md:p-10 rounded-[3rem] border-2 transition-all duration-500 ${
                q.status === "answered"
                  ? "border-slate-100 bg-slate-50 opacity-90"
                  : "border-cyan-200 bg-white shadow-xl shadow-cyan-500/5"
              }`}
            >
              {/* 🗑️ ปุ่มลบ (โผล่ตอน Hover) */}
              <button
                onClick={() => handleDelete(q._id)}
                className="absolute top-8 right-8 h-10 w-10 flex items-center justify-center rounded-full bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-sm border border-rose-100 z-10"
                title="ลบคำถาม"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Status & Date */}
              <div className="flex justify-between items-start mb-6">
                <span
                  className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border-2 ${q.status === "answered" ? "bg-slate-200 text-slate-500 border-transparent" : "bg-cyan-500 text-white border-cyan-400"}`}
                >
                  {q.status}
                </span>
                <span className="text-[11px] font-bold text-slate-400 italic tabular-nums">
                  {new Date(q.createdAt).toLocaleString("th-TH")}
                </span>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-black text-slate-400 uppercase italic">
                  From: {q.guestName}
                </p>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none uppercase italic">
                  {q.subject}
                </h2>
                <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl font-medium leading-relaxed shadow-lg">
                  {q.content}
                </div>
              </div>

              {/* Reply Section */}
              <div className="mt-8">
                {q.answer ? (
                  <div className="bg-emerald-50 border-2 border-emerald-100 p-8 rounded-[2rem] relative group/reply transition-all">
                    <p className="text-[10px] font-black text-emerald-600 uppercase mb-2 tracking-widest">
                      Our_Response:
                    </p>
                    <p className="text-emerald-900 font-bold text-lg leading-relaxed">
                      {q.answer}
                    </p>

                    {/* ✏️ ปุ่มแก้ไข (โผล่ตอน Hover Reply) */}
                    <button
                      onClick={() => {
                        setSelectedQuestion(q);
                        setAnswerText(q.answer || "");
                      }}
                      className="absolute top-6 right-6 px-4 py-2 bg-emerald-600 text-white text-[10px] font-black rounded-full transition-all hover:bg-emerald-700 shadow-lg flex items-center gap-2"
                    >
                      EDIT_REPLY ✏️
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedQuestion(q);
                      setAnswerText("");
                    }}
                    className="w-full py-6 bg-slate-900 text-white rounded-[1.5rem] font-black italic uppercase text-lg tracking-widest hover:bg-cyan-500 hover:scale-[1.01] transition-all group-hover:bg-cyan-600 shadow-xl"
                  >
                    Answer_This_Question ↗
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 🔴 Edit/Reply Modal */}
      {selectedQuestion && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] p-8 md:p-12 shadow-2xl relative animate-in slide-in-from-bottom-5 border-4 border-slate-900">
            <button
              onClick={() => setSelectedQuestion(null)}
              className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 font-black"
            >
              CLOSE [X]
            </button>
            <p className="text-cyan-500 font-black text-[10px] uppercase tracking-[0.4em] mb-2 italic">
              {selectedQuestion.answer
                ? "Mode: Editing_Response"
                : "Mode: Replying_to_Guest"}
            </p>
            <h2 className="text-3xl font-black text-slate-900 uppercase mb-8 leading-none italic">
              คุณ {selectedQuestion.guestName}
            </h2>
            <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100 italic text-slate-500 max-h-32 overflow-y-auto">
              "{selectedQuestion.content}"
            </div>
            <textarea
              className="w-full h-52 p-8 bg-slate-50 border-4 border-slate-100 rounded-[2rem] focus:border-cyan-500 outline-none font-bold text-lg transition-all"
              placeholder="พิมพ์คำตอบ..."
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-6 mt-10">
              <button
                onClick={() => setSelectedQuestion(null)}
                className="py-5 bg-slate-100 text-slate-400 rounded-2xl font-black uppercase italic hover:bg-slate-200 transition-all"
              >
                Discard
              </button>
              <button
                onClick={handleReply}
                disabled={submitting}
                className={`py-5 text-white rounded-2xl font-black uppercase italic transition-all shadow-2xl ${submitting ? "bg-slate-400" : "bg-cyan-500 hover:bg-cyan-600 shadow-cyan-500/40"}`}
              >
                {submitting
                  ? "SENDING..."
                  : selectedQuestion.answer
                    ? "Update_Reply ✓"
                    : "Send_Response ✓"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
