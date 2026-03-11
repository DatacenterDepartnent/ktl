import mongoose, { Schema, model, models } from "mongoose";

const BannerSchema = new Schema(
  {
    title: { type: String, required: true }, // ชื่อเรียกแบนเนอร์ (สำหรับ Admin ดู)
    imageUrl: { type: String, required: true }, // URL ของรูปภาพ
    linkUrl: { type: String, default: "" }, // ลิงก์เมื่อคลิก (ถ้ามี)
    order: { type: Number, default: 0 }, // ลับดับการแสดงผล (0 ขึ้นก่อน)
    isActive: { type: Boolean, default: true }, // สถานะ เปิด/ปิด การแสดงผล
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }, // Admin คนที่สร้าง
  },
  { timestamps: true }, // เก็บ createdAt, updatedAt อัตโนมัติ
);

const Banner = models.Banner || model("Banner", BannerSchema);

export default Banner;
