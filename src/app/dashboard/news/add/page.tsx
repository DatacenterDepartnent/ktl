"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// ✅ 1. Import SunEditor และ CSS
import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false, // ปิด Server-Side Rendering เพราะ Editor ใช้ `window`
});

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

  // ✅ เปลี่ยน State content ให้รองรับ HTML String จาก Editor
  const [content, setContent] = useState("");

  const [images, setImages] = useState<string[]>([]);
  const [newsletterImages, setnewsletterImages] = useState<string[]>([]);
  const [links, setLinks] = useState<{ label: string; url: string }[]>([]);
  const [currentLink, setCurrentLink] = useState({ label: "", url: "" });
  const [isLoading, setIsLoading] = useState(false);

  // ... (ฟังก์ชัน helper อื่นๆ เหมือนเดิม: toggleCategory, convertFilesToBase64, handleImageChange, etc.) ...
  // ขออนุญาตละไว้เพื่อความกระชับ (ใช้โค้ดเดิมของคุณได้เลย)

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

  const convertFilesToBase64 = async (files: FileList): Promise<string[]> => {
    const newImages: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) continue;
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      newImages.push(base64);
    }
    return newImages;
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImgs = await convertFilesToBase64(e.target.files);
      setImages((prev) => [...prev, ...newImgs]);
    }
  };
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handlenewsletterImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImgs = await convertFilesToBase64(e.target.files);
      setnewsletterImages((prev) => [...prev, ...newImgs]);
    }
  };
  const removenewsletterImage = (index: number) => {
    setnewsletterImages(newsletterImages.filter((_, i) => i !== index));
  };

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
          content, // ส่ง HTML string ไปบันทึกได้เลย
          images,
          newsletterImages,
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
    <div className="max-w-7xl mx-auto w-full p-6 md:p-10 text-zinc-800">
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
          {/* Section 1: ข้อมูลหลัก */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-zinc-800 border-l-4 border-blue-500 pl-3">
              ข้อมูลข่าวสารทั่วไป
            </h2>
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

          {/* --- ✅ Section 2: เนื้อหาข่าว (Rich Text Editor) --- */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-zinc-800 border-l-4 border-blue-500 pl-3 mb-4">
              เนื้อหาข่าว
            </h2>
            <div className="rounded-xl overflow-hidden border-2 border-zinc-100">
              <SunEditor
                setContents={content}
                onChange={setContent}
                placeholder="พิมพ์เนื้อหาข่าว หรือวางข้อความที่นี่..."
                height="400px" // กำหนดความสูง
                setOptions={{
                  buttonList: [
                    ["undo", "redo"],
                    ["font", "fontSize", "formatBlock"],
                    [
                      "bold",
                      "underline",
                      "italic",
                      "strike",
                      "subscript",
                      "superscript",
                    ],
                    ["fontColor", "hiliteColor", "textStyle"],
                    ["removeFormat"],
                    ["outdent", "indent"],
                    ["align", "horizontalRule", "list", "lineHeight"],
                    ["table", "link", "image", "video"], // ใส่รูป/วิดีโอในเนื้อหาได้เลย
                    ["fullScreen", "showBlocks", "codeView"],
                    ["preview", "print"],
                  ],
                  defaultTag: "div",
                  minHeight: "400px",
                  showPathLabel: false,
                }}
              />
            </div>
          </div>

          {/* ... (Section 3 ลิงก์, Section 4 รูปทั่วไป, Section 5 รูปจดหมายข่าว เหมือนเดิม) ... */}
          {/* เพื่อความกระชับ ผมคงส่วนที่เหลือไว้เหมือนเดิมนะครับ ก๊อปปี้ส่วนด้านล่างมาแปะต่อได้เลย */}

          <div className="space-y-4 pt-4 border-t border-dashed border-zinc-200">
            {/* ... ส่วนเพิ่มลิงก์ ... */}
            <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
              ลิงก์ภายนอก / ดาวน์โหลดเอกสาร (Optional)
            </label>
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="ชื่อปุ่ม"
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
                    <span className="text-sm font-bold">
                      {link.label}{" "}
                      <span className="text-xs text-zinc-400 font-normal">
                        ({link.url})
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => removeLink(index)}
                      className="text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <hr className="border-zinc-100" />

          {/* Section 4: รูปทั่วไป */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-800 border-l-4 border-blue-500 pl-3">
              รูปภาพประกอบ (ทั่วไป)
            </h2>
            {/* ... Input File เดิม ... */}
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
              </div>
            </div>
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-video rounded-xl overflow-hidden border"
                  >
                    <Image src={img} fill alt="" className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <hr className="border-zinc-100" />

          {/* Section 5: รูปจดหมายข่าว */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-800 border-l-4 border-orange-500 pl-3">
              รูปภาพสำหรับจดหมายข่าว
            </h2>
            {/* ... Input File เดิม ... */}
            <div className="relative w-full h-32 border-2 border-dashed border-orange-200 bg-orange-50/50 rounded-2xl hover:border-orange-500 hover:bg-orange-50 transition-all cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlenewsletterImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center justify-center h-full text-orange-400 group-hover:text-orange-600">
                <span className="font-bold text-sm">
                  + คลิกเพื่อเพิ่มรูปจดหมายข่าว
                </span>
              </div>
            </div>
            {newsletterImages.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {newsletterImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-3/4 rounded-xl overflow-hidden border"
                  >
                    <Image
                      src={img}
                      fill
                      alt=""
                      className="object-contain bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => removenewsletterImage(idx)}
                      className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 pt-6 border-t border-zinc-100">
            <Link
              href="/dashboard/news"
              className="px-6 py-3 rounded-xl border-2 border-zinc-200 text-zinc-500 font-bold hover:bg-zinc-50"
            >
              ยกเลิก
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg"
            >
              {isLoading ? "กำลังบันทึก..." : "บันทึกข่าวสาร"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
