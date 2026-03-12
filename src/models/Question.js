// models/Question.js
import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema(
  {
    // ส่วนของบุคคลทั่วไป (Guest)
    guestName: { type: String, default: "บุคคลทั่วไป" },
    subject: { type: String, required: true },
    content: { type: String, required: true },

    // ส่วนของเจ้าหน้าที่ (Admin/Editor)
    answer: {
      text: { type: String, default: "" },
      repliedBy: { type: String }, // ชื่อหรือ Role ของผู้ตอบ
      repliedAt: { type: Date },
    },

    status: {
      type: String,
      enum: ["pending", "answered", "hidden"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export default mongoose.models.Question ||
  mongoose.model("Question", QuestionSchema);
