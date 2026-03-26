import imageCompression from "browser-image-compression";

export const uploadToCloudinary = async (
  file: File,
  folder: string = "ktltc_uploads", // ค่า Default ถ้าไม่ระบุโฟลเดอร์
): Promise<string | null> => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  // ตรวจสอบว่ามีการตั้งค่า env หรือไม่
  if (!cloudName || !uploadPreset) {
    console.error("❌ Cloudinary config missing: Please check .env file");
    return null;
  }

  // ✅ บีบอัดรูปภาพก่อนอัปโหลด (ยกเว้น GIF)
  let fileToUpload = file;
  const isGif = file.type === "image/gif" || file.name.toLowerCase().endsWith(".gif");

  if (!isGif) {
    try {
      const options = {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      fileToUpload = await imageCompression(file, options);
    } catch (compressionError) {
      console.error("❌ Image compression error:", compressionError);
      // ถ้าบีบอัดพลาด ให้ใช้ไฟล์เดิมอัปโหลดต่อไป
    }
  }

  // เตรียมข้อมูลสำหรับส่งไป Cloudinary
  const formData = new FormData();
  formData.append("file", fileToUpload);
  formData.append("upload_preset", uploadPreset);

  // ✅ เพิ่ม Folder เพื่อจัดระเบียบรูปภาพ
  if (folder) {
    formData.append("folder", folder);
  }

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await response.json();

    // เช็ค Error จากฝั่ง Cloudinary (เช่น ไฟล์ใหญ่เกิน, นามสกุลผิด)
    if (data.error) {
      console.error("❌ Cloudinary API Error:", data.error.message);
      return null;
    }

    // ส่งคืน URL ของรูปภาพ
    return data.secure_url;
  } catch (error) {
    console.error("❌ Network/Upload error:", error);
    return null;
  }
};
