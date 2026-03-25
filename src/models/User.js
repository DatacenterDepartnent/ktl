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
      // เพิ่ม role รองรับระบบงานใหม่ WFH ตามโจทย์
      enum: ["super_admin", "director", "deputy_director", "hr", "admin", "general", "editor", "user"],
      default: "user", // ค่าเริ่มต้นเมื่อสมัครสมาชิกใหม่
    },
    department: {
      type: String,
      default: "ไม่มีสังกัด",
    },
    image: {
      type: String,
      default: "/images/default-avatar.png",
    },
    deviceId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
