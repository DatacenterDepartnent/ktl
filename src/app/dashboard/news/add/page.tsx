"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// กำหนดรายการหมวดหมู่
const CATEGORIES = [
  { value: "PR", label: "ข่าวประชาสัมพันธ์" },
  { value: "Newsletter", label: "จดหมายข่าวประชาสัมพันธ์" },
  { value: "Internship", label: "นักศึกษาออกฝึกประสบการณ์" },
  { value: "Announcement", label: "ข่าวประกาศ" },
  { value: "Bidding", label: "ข่าวประกวดราคา" },
  { value: "Order", label: "คำสั่งวิทยาลัยเทคนิค" },
];

export default function AddNewsPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [categories, setCategories] = useState<string[]>(["PR"]);
  const [content, setContent] = useState("");

  // 1. รูปภาพประกอบทั่วไป (General Images)
  const [images, setImages] = useState<string[]>([]);

  // ✅ 2. รูปภาพข่าวประกาศ (Announcement Images) - แยกออกมาใหม่
  const [announcementImages, setAnnouncementImages] = useState<string[]>([]);

  const [links, setLinks] = useState<{ label: string; url: string }[]>([]);
  const [currentLink, setCurrentLink] = useState({ label: "", url: "" });
  const [isLoading, setIsLoading] = useState(false);

  // --- Helper: จัดการหมวดหมู่ ---
  const toggleCategory = (value: string) => {
    setCategories((prev) => {
      if (prev.includes(value)) {
        if (prev.length === 1) return prev;
        return prev.filter((c) => c !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  // --- Helper: ฟังก์ชันแปลงไฟล์เป็น Base64 (ใช้ร่วมกันได้) ---
  const convertFilesToBase64 = async (files: FileList): Promise<string[]> => {
    const newImages: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) continue; // เพิ่ม Limit เป็น 5MB
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      newImages.push(base64);
    }
    return newImages;
  };

  // --- Handlers: จัดการรูปภาพทั่วไป ---
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImgs = await convertFilesToBase64(e.target.files);
      setImages((prev) => [...prev, ...newImgs]);
    }
  };
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // ✅ Handlers: จัดการรูปภาพข่าวประกาศ (แยกออกมา)
  const handleAnnouncementImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImgs = await convertFilesToBase64(e.target.files);
      setAnnouncementImages((prev) => [...prev, ...newImgs]);
    }
  };
  const removeAnnouncementImage = (index: number) => {
    setAnnouncementImages(announcementImages.filter((_, i) => i !== index));
  };

  // --- Handlers: จัดการเนื้อหา (Tab Indent) ---
  const insertIndent = () => {
    const textarea = document.getElementById(
      "news-content",
    ) as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const indent = "      ";
    const newContent =
      content.substring(0, start) + indent + content.substring(end);
    setContent(newContent);
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + indent.length;
      textarea.focus();
    }, 0);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      insertIndent();
    }
  };

  // --- Handlers: จัดการลิงก์ ---
  const addLink = () => {
    if (currentLink.label.trim() === "" || currentLink.url.trim() === "") {
      alert("กรุณากรอกชื่อปุ่มและลิงก์ให้ครบถ้วน");
      return;
    }
    setLinks([...links, currentLink]);
    setCurrentLink({ label: "", url: "" });
  };
  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  // --- Submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          categories,
          content,
          images,
          announcementImages, // ✅ ส่งฟิลด์ใหม่ไปด้วย
          links,
        }),
      });

      if (res.ok) {
        alert("บันทึกข่าวเรียบร้อยแล้ว!");
        router.refresh();
        router.push("/dashboard/news");
      } else {
        const errorData = await res.json();
        alert(errorData.error || "เกิดข้อผิดพลาด");
      }
    } catch {
      alert("เชื่อมต่อ Server ไม่ได้");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full p-6 md:p-10 font-sans text-zinc-800">
      <div className="">
        <div className="flex items-center gap-4 mb-8 border-b border-zinc-200 pb-6">
          <Link
            href="/dashboard/news"
            className="text-zinc-500 hover:text-blue-600 font-bold transition-colors"
          >
            ← กลับ
          </Link>
          <h1 className="text-3xl font-black text-zinc-900">สร้างข่าวใหม่</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100 space-y-10"
        >
          {/* --- Section 1: ข้อมูลหลัก --- */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-zinc-800 border-l-4 border-blue-500 pl-3">
              ข้อมูลข่าวสารทั่วไป
            </h2>

            {/* หัวข้อข่าว */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider">
                หัวข้อข่าว
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white border-2 border-zinc-100 focus:border-blue-500 rounded-xl p-4 text-zinc-900 font-medium outline-none transition-all"
                placeholder="พิมพ์หัวข้อข่าวที่นี่..."
                required
              />
            </div>

            {/* หมวดหมู่ */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider">
                เลือกหมวดหมู่
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {CATEGORIES.map((cat) => {
                  const isSelected = categories.includes(cat.value);
                  return (
                    <div
                      key={cat.value}
                      onClick={() => toggleCategory(cat.value)}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-zinc-100 bg-white text-zinc-600 hover:border-zinc-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${isSelected ? "bg-blue-600 border-blue-600" : "bg-white border-zinc-300"}`}
                      >
                        {isSelected && (
                          <svg
                            className="w-3.5 h-3.5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="font-bold text-sm">{cat.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <hr className="border-zinc-100" />

          {/* --- Section 2: เนื้อหาข่าว --- */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-zinc-800 border-l-4 border-blue-500 pl-3 mb-4">
              เนื้อหาข่าว
            </h2>
            <div className="flex justify-between items-end">
              <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider">
                รายละเอียด
              </label>
              <button
                type="button"
                onClick={insertIndent}
                className="text-xs bg-zinc-100 hover:bg-zinc-200 text-zinc-600 px-3 py-1 rounded-lg transition-colors font-bold"
              >
                ⇥ เพิ่มย่อหน้า (Tab)
              </button>
            </div>
            <textarea
              id="news-content"
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-white border-2 border-zinc-100 focus:border-blue-500 rounded-xl p-4 text-zinc-900 outline-none transition-all leading-relaxed whitespace-pre-wrap"
              placeholder="พิมพ์เนื้อหาข่าว... (กด Tab เพื่อย่อหน้า)"
            />
          </div>

          {/* --- Section 3: ลิงก์ --- */}
          <div className="space-y-4 pt-4 border-t border-dashed border-zinc-200">
            <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              ลิงก์ภายนอก / ดาวน์โหลดเอกสาร (Optional)
            </label>
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="ชื่อปุ่ม (เช่น ดาวน์โหลด PDF)"
                value={currentLink.label}
                onChange={(e) =>
                  setCurrentLink({ ...currentLink, label: e.target.value })
                }
                className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
              />
              <input
                type="url"
                placeholder="URL"
                value={currentLink.url}
                onChange={(e) =>
                  setCurrentLink({ ...currentLink, url: e.target.value })
                }
                className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={addLink}
                className="bg-zinc-800 hover:bg-black text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors whitespace-nowrap"
              >
                + เพิ่มลิงก์
              </button>
            </div>
            {links.length > 0 && (
              <div className="space-y-2">
                {links.map((link, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-blue-50 border border-blue-100 p-3 rounded-xl"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className="bg-blue-200 text-blue-700 p-2 rounded-lg">
                        🔗
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-sm text-zinc-700 truncate">
                          {link.label}
                        </span>
                        <span className="text-xs text-zinc-400 truncate">
                          {link.url}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLink(index)}
                      className="text-red-500 hover:bg-red-100 p-2 rounded-lg transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <hr className="border-zinc-100" />

          {/* --- Section 4: รูปภาพทั่วไป --- */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-800 border-l-4 border-blue-500 pl-3">
              รูปภาพประกอบ (ทั่วไป)
            </h2>
            <div className="relative w-full h-32 border-2 border-dashed border-zinc-300 bg-zinc-50 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center justify-center h-full text-zinc-400 group-hover:text-blue-500">
                <span className="font-bold text-sm">
                  + คลิกเพื่อเพิ่มรูปภาพทั่วไป
                </span>
                <span className="text-xs mt-1">
                  รองรับไฟล์ .jpg, .png (เลือกได้หลายรูป)
                </span>
              </div>
            </div>
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="relative aspect-video rounded-xl overflow-hidden border border-zinc-200 shadow-sm group"
                  >
                    <Image
                      src={img}
                      alt="preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shadow-md opacity-0 group-hover:opacity-100 transition-all"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <hr className="border-zinc-100" />

          {/* --- ✅ Section 5: รูปภาพข่าวประกาศ (แยกส่วน) --- */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-zinc-800 border-l-4 border-orange-500 pl-3">
                รูปภาพสำหรับข่าวประกาศ
              </h2>
              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-md font-bold">
                เฉพาะประกาศ/คำสั่ง
              </span>
            </div>

            <div className="relative w-full h-32 border-2 border-dashed border-orange-200 bg-orange-50/50 rounded-2xl hover:border-orange-500 hover:bg-orange-50 transition-all cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleAnnouncementImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center justify-center h-full text-orange-400 group-hover:text-orange-600">
                <span className="font-bold text-sm">
                  + คลิกเพื่อเพิ่มรูปประกาศ
                </span>
                <span className="text-xs mt-1">
                  เช่น รูปคำสั่ง, รูปเอกสารประกาศ, ระเบียบการ
                </span>
              </div>
            </div>
            {announcementImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {announcementImages.map((img, index) => (
                  <div
                    key={index}
                    className="relative aspect-3/4 rounded-xl overflow-hidden border border-orange-200 shadow-sm group bg-white"
                  >
                    <Image
                      src={img}
                      alt="announcement preview"
                      fill
                      className="object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => removeAnnouncementImage(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shadow-md opacity-0 group-hover:opacity-100 transition-all"
                    >
                      ×
                    </button>
                    <div className="absolute bottom-0 w-full bg-orange-500/80 text-white text-[10px] text-center py-1">
                      รูปประกาศ
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* --- Buttons --- */}
          <div className="flex items-center gap-4 pt-6 border-t border-zinc-100">
            <Link
              href="/dashboard/news"
              className="px-6 py-3 rounded-xl border-2 border-zinc-200 text-zinc-500 font-bold hover:bg-zinc-50 transition-colors"
            >
              ยกเลิก
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "กำลังบันทึก..." : "บันทึกข่าวสาร"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
