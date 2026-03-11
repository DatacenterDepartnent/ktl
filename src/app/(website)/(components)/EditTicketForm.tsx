"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const EditTicketForm = ({
  ticket,
  userRole = "editor",
}: {
  ticket: any;
  userRole?: string;
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adminReply, setAdminReply] = useState("");

  const isNew = !ticket._id || ticket._id === "new";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = isNew ? "/api/Tickets" : `/api/Tickets/${ticket._id}`;
      const method = isNew ? "POST" : "PUT";

      // เตรียมข้อมูลส่งไป API
      const payload = isNew
        ? {
            title: ticket.title,
            description: ticket.description,
            category: ticket.category,
            author: "Guest",
          }
        : {
            formData: {
              reply: adminReply,
              userRole: userRole,
              adminName: "Officer",
            },
          };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/ITA/08/qa");
        router.refresh();
      } else {
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center py-20 bg-slate-50 min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100"
      >
        <h2 className="text-3xl font-black italic uppercase mb-10 border-b pb-5">
          {isNew ? "Post_New" : "Management"}{" "}
          <span className="text-blue-600">Ticket</span>
        </h2>

        <div className="mb-8">
          <label className="text-[10px] font-black uppercase text-slate-400">
            Original_Question
          </label>
          <div className="p-4 bg-slate-50 rounded-2xl font-bold text-slate-700 mt-2">
            {ticket.title}
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl text-slate-600 mt-2 text-sm italic">
            {ticket.description}
          </div>
        </div>

        {!isNew && (
          <div className="mb-10">
            <label className="text-blue-600 font-black uppercase italic block mb-3">
              Admin_Response_Protocol
            </label>
            <textarea
              required
              rows={5}
              value={adminReply}
              onChange={(e) => setAdminReply(e.target.value)}
              className="w-full rounded-2xl border-2 border-blue-100 p-5 outline-none focus:border-blue-500 transition-all bg-blue-50/30"
              placeholder="พิมพ์คำตอบเพื่อปิด Protocol นี้..."
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase italic hover:bg-blue-600 transition-all"
        >
          {isSubmitting ? "Processing..." : "Confirm_Protocol"}
        </button>
      </form>
    </div>
  );
};

export default EditTicketForm;
