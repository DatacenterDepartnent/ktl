import mongoose from "mongoose";

const LogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // เชื่อมโยงกับ User Schema ที่เราสร้างไว้
      required: true,
    },
    userName: String, // เก็บชื่อไว้ด้วยเพื่อความรวดเร็วในการออกรายงาน
    action: {
      type: String,
      required: true,
      // ตัวอย่าง: "LOGIN", "CREATE_NEWS", "UPDATE_NEWS", "DELETE_NEWS", "CHANGE_ROLE"
    },
    details: {
      type: String, // รายละเอียดเพิ่มเติม เช่น "ลบข่าวประชาสัมพันธ์: กิจกรรมวันพ่อ"
    },
    ip: String, // เก็บ IP Address เพื่อความปลอดภัย
  },
  { timestamps: true }, // จะได้ field 'createdAt' มาใช้จัดกลุ่มรายเดือนอัตโนมัติ
);

export default mongoose.models.Log || mongoose.model("Log", LogSchema);
