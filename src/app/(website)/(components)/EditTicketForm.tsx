"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, Save, Loader2 } from "lucide-react";

const EditTicketForm = ({ ticket }: { ticket?: any }) => {
  const EDITMODE = ticket?._id && ticket._id !== "new";
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: ticket?.title || "",
    description: ticket?.description || "",
    category: ticket?.category || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ฟังก์ชันบันทึก Log กิจกรรม
  const saveActivityLog = async (action: string, details: string) => {
    try {
      await fetch("/api/admin/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          details,
          userName: formData.category || "Anonymous",
          link: "/ITA/08/qa",
        }),
      });
    } catch (err) {
      console.error("Failed to save activity log:", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = EDITMODE ? `/api/Tickets/${ticket._id}` : "/api/Tickets";
      const method = EDITMODE ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      // ✅ บันทึก Log เมื่อส่งข้อมูลสำเร็จ
      const logAction = EDITMODE ? "TICKET_UPDATED" : "TICKET_CREATED";
      const logDetails = `${EDITMODE ? "แก้ไข" : "สร้าง"}กระทู้: ${formData.title}`;
      await saveActivityLog(logAction, logDetails);

      router.refresh();
      router.push("/ITA/08/qa");
    } catch (error: any) {
      console.error("Submit Error:", error);
      alert(`เกิดข้อผิดพลาด: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-12 font-sans">
      <div className="w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-white bg-white/80 p-1 shadow-2xl backdrop-blur-xl">
        <div className="rounded-[2.3rem] bg-white p-8 md:p-10">
          {/* Header */}
          <div className="mb-10 text-center">
            <div
              className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl mb-4 shadow-inner ${EDITMODE ? "bg-amber-50 text-amber-500" : "bg-blue-50 text-blue-500"}`}
            >
              {EDITMODE ? <Save size={32} /> : <Send size={32} />}
            </div>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">
              {EDITMODE ? "Edit_Ticket" : "New_Ticket"}
            </h2>
            <p className="mt-2 text-sm font-bold text-slate-400 uppercase tracking-widest opacity-70">
              {EDITMODE
                ? "ปรับปรุงข้อมูลความคิดเห็น"
                : "แชร์ความคิดเห็นของคุณสู่ระบบ"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic"
              >
                Subject_หัวเรื่อง
              </label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="ระบุหัวข้อที่ต้องการ..."
                onChange={handleChange}
                value={formData.title}
                required
                className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-5 py-4 text-sm font-bold outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic"
              >
                Content_เนื้อหา
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="พิมพ์รายละเอียดที่นี่..."
                onChange={handleChange}
                value={formData.description}
                required
                rows={5}
                className="w-full resize-none rounded-3xl border border-slate-100 bg-slate-50/50 px-5 py-4 text-sm font-bold outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>

            {/* Category / Name */}
            <div className="space-y-2">
              <label
                htmlFor="category"
                className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic"
              >
                Author_ผู้โพสต์
              </label>
              <input
                id="category"
                name="category"
                type="text"
                placeholder="ชื่อ-นามสกุล หรือ นามแฝง..."
                onChange={handleChange}
                value={formData.category}
                required
                className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-5 py-4 text-sm font-bold outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 pt-6 md:flex-row md:items-center">
              <Link
                href="/ITA/08/qa"
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 transition-all hover:bg-slate-50 hover:text-slate-600 italic"
              >
                <ArrowLeft size={16} /> Cancel_Back
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-[1.5] flex items-center justify-center gap-3 rounded-2xl py-4 text-[11px] font-black uppercase tracking-widest text-white shadow-xl transition-all active:scale-95 italic
                  ${
                    isSubmitting
                      ? "cursor-not-allowed bg-slate-300"
                      : "bg-slate-900 shadow-slate-900/20 hover:bg-blue-600 hover:shadow-blue-600/30"
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />{" "}
                    Process_Sending...
                  </>
                ) : (
                  <>{EDITMODE ? "Save_Changes" : "Post_Now"}</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTicketForm;
