import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "กรุณากรอกชื่อ-นามสกุล"],
    },
    email: {
      type: String,
      required: [true, "กรุณากรอกอีเมล"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "กรุณากรอกรหัสผ่าน"],
      select: false,
    },
    role: {
      type: String,
      // เพิ่ม super_admin และเปลี่ยน staff เป็น user ตามโจทย์
      enum: ["super_admin", "admin", "user"],
      default: "user", // ค่าเริ่มต้นเมื่อสมัครสมาชิกใหม่
    },
    image: {
      type: String,
      default: "/images/default-avatar.png",
    },
  },
  { timestamps: true },
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
