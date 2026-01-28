/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { uploadToCloudinary } from "@/lib/upload";
import imageCompression from "browser-image-compression"; // ✅ พระเอกของเรา
import "suneditor/dist/css/suneditor.min.css";

// --- Config ---
const CATEGORIES = [
  {
    value: "PR",
    label: "ข่าวประชาสัมพันธ์",
    color:
      "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  },
  {
    value: "Newsletter",
    label: "จดหมายข่าว",
    color:
      "bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
  },
  {
    value: "Internship",
    label: "ฝึกงาน/ประสบการณ์",
    color:
      "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
  },
  {
    value: "Announcement",
    label: "ข่าวประกาศ",
    color:
      "bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
  },
  {
    value: "Bidding",
    label: "ประกวดราคา",
    color:
      "bg-pink-50 text-pink-600 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800",
  },
  {
    value: "Order",
    label: "คำสั่งวิทยาลัย",
    color:
      "bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800",
  },
];

const fontList = [
  "Sarabun",
  "Kanit",
  "Prompt",
  "Mitr",
  "Taviraj",
  "Chakra Petch",
  "Bai Jamjuree",
  "Mali",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Arial",
  "Courier New",
  "Georgia",
  "Tahoma",
  "Verdana",
];

export default function AddNewsPage() {
  const router = useRouter();

  // --- States ---
  const [title, setTitle] = useState("");
  const [categories, setCategories] = useState<string[]>(["PR"]);
  const [content, setContent] = useState("");

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [newsletterFiles, setNewsletterFiles] = useState<File[]>([]);
  const [newsletterPreviews, setNewsletterPreviews] = useState<string[]>([]);

  const [links, setLinks] = useState<{ label: string; url: string }[]>([]);
  const [currentLink, setCurrentLink] = useState({ label: "", url: "" });

  const [isLoading, setIsLoading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false); // ✅ สถานะกำลังบีบอัด

  // Editor Loader
  const [SunEditorComponent, setSunEditorComponent] =
    useState<React.ComponentType<any> | null>(null);
  useEffect(() => {
    import("suneditor-react").then((mod) =>
      setSunEditorComponent(() => mod.default),
    );
  }, []);

  // --- 🛠️ Helper: ฟังก์ชันบีบอัดรูป ---
  const compressImage = async (file: File) => {
    const options = {
      maxSizeMB: 0.8, // บีบให้ไม่เกิน 0.8 MB (800KB)
      maxWidthOrHeight: 1920, // ย่อขนาดภาพไม่เกิน Full HD
      useWebWorker: true, // ใช้ Web Worker เพื่อไม่ให้หน้าเว็บค้าง
    };
    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error("Compression Error:", error);
      return file; // ถ้าบีบไม่ได้ ให้ใช้ไฟล์เดิม
    }
  };

  // --- Handlers ---
  const toggleCategory = (value: string) => {
    setCategories((prev) =>
      prev.includes(value)
        ? prev.length === 1
          ? prev
          : prev.filter((c) => c !== value)
        : [...prev, value],
    );
  };

  // ✅ Handler: รูปทั่วไป (พร้อมบีบอัด)
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsCompressing(true);
      const originalFiles = Array.from(e.target.files);

      // บีบอัดทีละไฟล์
      const compressedFiles = await Promise.all(
        originalFiles.map((file) => compressImage(file)),
      );

      setImageFiles((prev) => [...prev, ...compressedFiles]);
      setImagePreviews((prev) => [
        ...prev,
        ...compressedFiles.map((f) => URL.createObjectURL(f)),
      ]);
      setIsCompressing(false);
    }
  };
  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Handler: จดหมายข่าว (พร้อมบีบอัด)
  const handleNewsletterChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsCompressing(true);
      const originalFiles = Array.from(e.target.files);

      const compressedFiles = await Promise.all(
        originalFiles.map((file) => compressImage(file)),
      );

      setNewsletterFiles((prev) => [...prev, ...compressedFiles]);
      setNewsletterPreviews((prev) => [
        ...prev,
        ...compressedFiles.map((f) => URL.createObjectURL(f)),
      ]);
      setIsCompressing(false);
    }
  };
  const removeNewsletter = (index: number) => {
    setNewsletterFiles((prev) => prev.filter((_, i) => i !== index));
    setNewsletterPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const addLink = () => {
    if (!currentLink.label || !currentLink.url)
      return alert("กรุณากรอกข้อมูลลิงก์ให้ครบ");
    setLinks([...links, currentLink]);
    setCurrentLink({ label: "", url: "" });
  };
  const removeLink = (index: number) =>
    setLinks(links.filter((_, i) => i !== index));

  // --- Submit Logic ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || isCompressing) return; // ห้ามกดถ้ากำลังบีบอัด
    setIsLoading(true);

    try {
      const generalUploads = await Promise.all(
        imageFiles.map((f) => uploadToCloudinary(f, "ktltc_news")),
      );
      const newsletterUploads = await Promise.all(
        newsletterFiles.map((f) => uploadToCloudinary(f, "ktltc_newsletters")),
      );

      const validImages = generalUploads.filter(
        (url) => url !== null,
      ) as string[];
      const validNewsletter = newsletterUploads.filter(
        (url) => url !== null,
      ) as string[];

      const payload = {
        title,
        categories,
        content,
        images: validImages,
        announcementImages: validNewsletter,
        links,
      };

      const sizeInKB = (
        new Blob([JSON.stringify(payload)]).size / 1024
      ).toFixed(2);
      console.log(`📊 Payload Size: ${sizeInKB} KB`);

      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(`บันทึกสำเร็จ! (ใช้พื้นที่เพียง ${sizeInKB} KB)`);
        router.push("/dashboard/news");
        router.refresh();
      } else {
        alert("เกิดข้อผิดพลาดในการบันทึก");
      }
    } catch (error) {
      console.error(error);
      alert("เชื่อมต่อ Server ไม่ได้");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-32 text-slate-800 relative dark:bg-black dark:text-slate-200">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap");
        body {
          font-family: "Sarabun", sans-serif;
        }
        .sun-editor-editable {
          font-family: "Sarabun", sans-serif !important;
        }
        .sun-editor {
          border-radius: 0.75rem;
          border: 1px solid #e2e8f0 !important;
          overflow: hidden;
        }
      `}</style>

      {/* --- Top Bar --- */}
      <div className="border-b border-slate-200 sticky top-0 z-20 shadow-sm backdrop-blur-md bg-white/80 dark:bg-black/80 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/news"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-all dark:bg-zinc-800 dark:text-slate-400 dark:hover:bg-zinc-700 dark:hover:text-slate-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                สร้างข่าวใหม่
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                กรอกข้อมูลเพื่อประชาสัมพันธ์
              </p>
            </div>
          </div>
          {/* สถานะบีบอัด */}
          {isCompressing && (
            <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-bold border border-blue-100 animate-pulse dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin dark:border-blue-400 dark:border-t-transparent"></div>
              กำลังบีบอัดรูป...
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* --- Card 1: ข้อมูลหลัก --- */}
        <section className="rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 dark:bg-zinc-900 dark:border-zinc-800 dark:shadow-none">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl dark:bg-blue-900/30 dark:text-blue-400">
              📝
            </div>
            <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">
              รายละเอียดข่าว
            </h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-500 ml-1 dark:text-slate-400">
                หัวข้อข่าว
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-lg font-semibold text-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:placeholder-zinc-500 dark:focus:border-blue-500/50"
                placeholder="เช่น ประกาศรับสมัครนักศึกษา..."
                required
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-500 ml-1 dark:text-slate-400">
                หมวดหมู่
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {CATEGORIES.map((cat) => {
                  const isSelected = categories.includes(cat.value);
                  return (
                    <div
                      key={cat.value}
                      onClick={() => toggleCategory(cat.value)}
                      className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 group overflow-hidden ${
                        isSelected
                          ? `${cat.color} ring-2 ring-offset-1 ring-blue-100 dark:ring-0`
                          : "border-slate-100 text-slate-500 hover:border-slate-300 dark:border-zinc-700 dark:text-slate-400 dark:hover:border-zinc-600"
                      }`}
                    >
                      <div className="flex items-center gap-3 relative z-10">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            isSelected
                              ? "border-current bg-current"
                              : "border-slate-300 dark:border-zinc-600"
                          }`}
                        >
                          {isSelected && (
                            <svg
                              className="w-3 h-3 text-white dark:text-black"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={4}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                        <span className="font-bold text-sm">{cat.label}</span>
                      </div>
                      {isSelected && (
                        <div className="absolute inset-0 bg-current opacity-[0.03]" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-500 ml-1 dark:text-slate-400">
                เนื้อหาข่าว (Rich Text)
              </label>
              <div className="rounded-2xl shadow-sm border border-slate-200 overflow-hidden dark:border-zinc-700">
                {SunEditorComponent ? (
                  <div className="sun-editor-dark-mode-override">
                    <SunEditorComponent
                      setContents={content}
                      onChange={setContent}
                      height="400px"
                      setOptions={{
                        font: fontList,
                        buttonList: [
                          ["undo", "redo"],
                          ["font", "fontSize", "formatBlock"],
                          [
                            "bold",
                            "underline",
                            "italic",
                            "strike",
                            "fontColor",
                            "hiliteColor",
                          ],
                          [
                            "removeFormat",
                            "outdent",
                            "indent",
                            "align",
                            "list",
                            "lineHeight",
                            "horizontalRule",
                          ],
                          [
                            "table",
                            "link",
                            "image",
                            "video",
                            "fullScreen",
                            "showBlocks",
                            "codeView",
                          ],
                        ],
                        defaultTag: "div",
                        minHeight: "400px",
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-[400px] flex flex-col gap-3 items-center justify-center bg-slate-50 text-slate-400 animate-pulse dark:bg-zinc-800 dark:text-slate-500">
                    <div className="w-8 h-8 border-4 border-slate-300 border-t-blue-500 rounded-full animate-spin dark:border-zinc-600 dark:border-t-blue-400"></div>
                    <span className="text-sm font-medium">
                      กำลังโหลดเครื่องมือเขียน...
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* --- Card 2: รูปภาพทั่วไป --- */}
        <section className="rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col dark:bg-zinc-900 dark:border-zinc-800 dark:shadow-none">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-700 flex items-center gap-2 dark:text-slate-200">
              <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-sm dark:bg-blue-900/30 dark:text-blue-400">
                🖼️
              </span>
              รูปภาพทั่วไป
            </h3>
            <span className="text-xs font-medium bg-slate-100 text-slate-500 px-2 py-1 rounded-md dark:bg-zinc-800 dark:text-slate-400">
              แนวนอน
            </span>
          </div>

          <div className="relative group cursor-pointer min-h-[160px] border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 hover:bg-blue-50 hover:border-blue-400 transition-all flex flex-col items-center justify-center mb-6 overflow-hidden dark:bg-zinc-800 dark:border-zinc-700 dark:hover:bg-blue-900/10 dark:hover:border-blue-500">
            <input
              type="file"
              multiple
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              onChange={handleImageChange}
            />
            <div className="w-12 h-12 rounded-full shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform dark:bg-zinc-700 dark:shadow-none">
              <svg
                className="w-6 h-6 text-blue-500 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="text-sm font-bold text-slate-600 group-hover:text-blue-600 dark:text-slate-300 dark:group-hover:text-blue-400">
              คลิกเพิ่มรูปภาพ
            </span>
            <span className="text-xs text-slate-400 mt-1 dark:text-slate-500">
              หรือลากไฟล์มาวางที่นี่
            </span>
          </div>

          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 animate-fade-in-up">
              {imagePreviews.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-video rounded-xl overflow-hidden shadow-sm group/img border border-slate-200 dark:border-zinc-700"
                >
                  <Image
                    src={src}
                    alt="preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center text-white transition-opacity"
                  >
                    <svg
                      className="w-6 h-6 drop-shadow-md"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* --- Card 3: จดหมายข่าว --- */}
        <section className="rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col dark:bg-zinc-900 dark:border-zinc-800 dark:shadow-none">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-700 flex items-center gap-2 dark:text-slate-200">
              <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center text-sm dark:bg-purple-900/30 dark:text-purple-400">
                📜
              </span>
              จดหมายข่าว
            </h3>
            <span className="text-xs font-medium bg-purple-50 text-purple-600 px-2 py-1 rounded-md dark:bg-zinc-800 dark:text-purple-300">
              แนวตั้ง
            </span>
          </div>

          <div className="relative group cursor-pointer min-h-[160px] border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 hover:bg-purple-50 hover:border-purple-400 transition-all flex flex-col items-center justify-center mb-6 overflow-hidden dark:bg-zinc-800 dark:border-zinc-700 dark:hover:bg-purple-900/10 dark:hover:border-purple-500">
            <input
              type="file"
              multiple
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              onChange={handleNewsletterChange}
            />
            <div className="w-12 h-12 rounded-full shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform dark:bg-zinc-700 dark:shadow-none">
              <svg
                className="w-6 h-6 text-purple-500 dark:text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <span className="text-sm font-bold text-slate-600 group-hover:text-purple-600 dark:text-slate-300 dark:group-hover:text-purple-400">
              คลิกเพิ่มจดหมายข่าว
            </span>
            <span className="text-xs text-slate-400 mt-1 dark:text-slate-500">
              สำหรับเอกสาร/คำสั่ง
            </span>
          </div>

          {newsletterPreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 animate-fade-in-up">
              {newsletterPreviews.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-sm group/img bg-slate-100 border border-slate-200 dark:bg-zinc-800 dark:border-zinc-700"
                >
                  <Image
                    src={src}
                    alt="newsletter"
                    fill
                    className="object-contain"
                  />
                  <button
                    onClick={() => removeNewsletter(i)}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center text-white transition-opacity"
                  >
                    <svg
                      className="w-6 h-6 drop-shadow-md"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* --- Card 4: ลิงก์ --- */}
        <section className="rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 dark:bg-zinc-900 dark:border-zinc-800 dark:shadow-none">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl dark:bg-indigo-900/30 dark:text-indigo-400">
              🔗
            </div>
            <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">
              ลิงก์ภายนอก / เอกสารแนบ
            </h2>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-3 dark:bg-zinc-800 dark:border-zinc-700">
            <input
              placeholder="ชื่อปุ่ม (เช่น ดาวน์โหลด PDF)"
              value={currentLink.label}
              onChange={(e) =>
                setCurrentLink({ ...currentLink, label: e.target.value })
              }
              className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none dark:bg-zinc-900 dark:border-zinc-600 dark:text-white dark:placeholder-zinc-500"
            />
            <input
              placeholder="วาง URL ที่นี่..."
              value={currentLink.url}
              onChange={(e) =>
                setCurrentLink({ ...currentLink, url: e.target.value })
              }
              className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none font-mono dark:bg-zinc-900 dark:border-zinc-600 dark:text-white dark:placeholder-zinc-500"
            />
            <button
              type="button"
              onClick={addLink}
              className="bg-slate-800 hover:bg-black text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-slate-800/20 whitespace-nowrap dark:bg-indigo-600 dark:hover:bg-indigo-500 dark:shadow-none"
            >
              + เพิ่มลิงก์
            </button>
          </div>

          {links.length > 0 && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {links.map((l, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border border-slate-200 p-3 pl-4 rounded-xl shadow-sm hover:border-indigo-300 transition-colors group dark:border-zinc-700 dark:hover:border-indigo-500"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs dark:bg-indigo-900/30 dark:text-indigo-400">
                      Link
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-sm text-slate-700 truncate dark:text-slate-200">
                        {l.label}
                      </span>
                      <span className="text-xs text-slate-400 truncate font-mono dark:text-slate-500">
                        {l.url}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLink(i)}
                    className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors dark:text-zinc-500 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                  >
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* --- Action Bar (ล่างสุด) --- */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 z-50 flex justify-center shadow-2xl dark:bg-black/80 dark:border-zinc-800">
        <div className="max-w-5xl w-full flex gap-4">
          <Link
            href="/dashboard/news"
            className="px-8 py-3 rounded-full border-2 border-slate-200 font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300 transition-all text-center min-w-[140px] dark:border-zinc-700 dark:text-slate-400 dark:hover:bg-zinc-800 dark:hover:text-slate-200"
          >
            ยกเลิก
          </Link>
          <button
            onClick={handleSubmit}
            disabled={isLoading || isCompressing} // ห้ามกดถ้าโหลด หรือ บีบไฟล์อยู่
            className={`flex-1 py-3 rounded-full font-bold text-lg shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2
                ${
                  isLoading || isCompressing
                    ? "bg-slate-300 text-slate-500 cursor-not-allowed dark:bg-zinc-700 dark:text-zinc-500"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/50 dark:shadow-none"
                }`}
          >
            {isLoading || isCompressing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {isCompressing ? "กำลังบีบอัดรูป..." : "กำลังบันทึก..."}
              </>
            ) : (
              <>✨ บันทึกข่าวสาร</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
