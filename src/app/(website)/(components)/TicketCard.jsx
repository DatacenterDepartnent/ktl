// src\app\(website)\(components)\TicketCard.jsx
const TicketCard = ({ ticket }) => {
  return (
    <div className="flex flex-col">
      {/* --- ส่วนของคำถาม (Original Post) --- */}
      <div className="p-5 border-b border-slate-50">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest italic">
            Original_Post
          </span>
        </div>
        <h3 className="text-lg font-black text-slate-900 leading-tight mb-2 uppercase italic">
          {ticket.title}
        </h3>
        <p className="text-[14px] leading-relaxed text-slate-600 font-medium whitespace-pre-wrap">
          {ticket.description}
        </p>
      </div>

      {/* ✅ ส่วนที่หายไป: ต้องวนลูปโชว์คำตอบตรงนี้ครับพี่ ✅ */}
      {ticket.replies && ticket.replies.length > 0 && (
        <div className="bg-blue-50/30 p-5 space-y-4 border-t border-blue-100">
          {ticket.replies.map((reply, index) => (
            <div key={index} className="flex gap-3">
              <div className="h-full w-1 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black text-blue-700 uppercase italic">
                    {reply.author || "OFFICER_REPLY"}
                  </span>
                  <span className="text-[8px] font-bold text-slate-400">
                    {new Date(reply.createdAt).toLocaleString("th-TH")}
                  </span>
                </div>
                <div className="text-[13px] text-slate-700 font-semibold bg-white p-3 rounded-xl shadow-sm border border-blue-100">
                  {reply.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketCard;
