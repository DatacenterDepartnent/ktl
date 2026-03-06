/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { uploadToCloudinary } from "@/lib/upload";
import imageCompression from "browser-image-compression";
import "suneditor/dist/css/suneditor.min.css";

// --- DND Kit Imports ---
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
  "Roboto",
  "Arial",
  "Tahoma",
];

// --- Sub-Component: Sortable Image Item ---
function SortableImage({ id, src, onRemove, isVertical = false }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-zinc-700 group touch-none bg-slate-100 dark:bg-zinc-800 ${isVertical ? "aspect-[3/4]" : "aspect-video"}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <Image
          src={src}
          alt="preview"
          fill
          className={isVertical ? "object-contain" : "object-cover"}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 text-white text-xs bg-black/40 px-2 py-1 rounded-md">
            ลากเพื่อย้าย
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-md z-10 hover:bg-red-600 transition-colors"
      >
        ✕
      </button>
    </div>
  );
}

export default function AddNewsPage() {
  const router = useRouter();

  // --- States ---
  const [categories, setCategories] = useState<string[]>(["PR"]);
  const [content, setContent] = useState("");
  // วันที่ลงข้อมูล
  const [publishDate, setPublishDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [newsletterFiles, setNewsletterFiles] = useState<File[]>([]);
  const [newsletterPreviews, setNewsletterPreviews] = useState<string[]>([]);
  const [links, setLinks] = useState<{ label: string; url: string }[]>([]);
  const [currentLink, setCurrentLink] = useState({ label: "", url: "" });
  const [videoEmbeds, setVideoEmbeds] = useState<string[]>([]);
  const [currentEmbed, setCurrentEmbed] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const [SunEditorComponent, setSunEditorComponent] =
    useState<React.ComponentType<any> | null>(null);
  useEffect(() => {
    import("suneditor-react").then((mod) =>
      setSunEditorComponent(() => mod.default),
    );
  }, []);

  const handleDragEnd = (
    event: DragEndEvent,
    type: "general" | "newsletter",
  ) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      if (type === "general") {
        const oldIndex = imagePreviews.indexOf(active.id as string);
        const newIndex = imagePreviews.indexOf(over.id as string);
        setImagePreviews((items) => arrayMove(items, oldIndex, newIndex));
        setImageFiles((items) => arrayMove(items, oldIndex, newIndex));
      } else {
        const oldIndex = newsletterPreviews.indexOf(active.id as string);
        const newIndex = newsletterPreviews.indexOf(over.id as string);
        setNewsletterPreviews((items) => arrayMove(items, oldIndex, newIndex));
        setNewsletterFiles((items) => arrayMove(items, oldIndex, newIndex));
      }
    }
  };

  const generateTitleFromContent = (htmlContent: string) => {
    if (typeof window === "undefined") return "";
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const text = doc.body.textContent || "";
    const cleanText = text.replace(/\s+/g, " ").trim();
    if (!cleanText) return "";
    const limit = 100;
    return cleanText.length > limit
      ? cleanText.substring(0, limit) + "..."
      : cleanText;
  };

  const compressImage = async (file: File) => {
    const options = {
      maxSizeMB: 0.8,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    return await imageCompression(file, options);
  };

  const toggleCategory = (value: string) => {
    setCategories((prev) =>
      prev.includes(value)
        ? prev.length === 1
          ? prev
          : prev.filter((c) => c !== value)
        : [...prev, value],
    );
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsCompressing(true);
      const originalFiles = Array.from(e.target.files);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const autoTitle = generateTitleFromContent(content);
    if (!autoTitle) return alert("กรุณาใส่เนื้อหาข่าวที่เป็นข้อความด้วยครับ");
    if (isLoading || isCompressing) return;
    setIsLoading(true);

    try {
      const generalUploads = await Promise.all(
        imageFiles.map((f) => uploadToCloudinary(f, "ktltc_news")),
      );
      const newsletterUploads = await Promise.all(
        newsletterFiles.map((f) => uploadToCloudinary(f, "ktltc_newsletters")),
      );

      const payload = {
        title: autoTitle,
        categories,
        content,
        images: generalUploads.filter((u) => u !== null),
        announcementImages: newsletterUploads.filter((u) => u !== null),
        links,
        videoEmbeds,
        createdAt: new Date(publishDate).toISOString(),
      };

      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("บันทึกข่าวเรียบร้อยแล้ว");
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

  // ฟังก์ชันจัดรูปแบบวันที่ วัน/เดือน/ปี (พ.ศ.)
  const formatThaiDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-40 text-slate-800 relative dark:bg-black dark:text-slate-200">
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
        /* ทำให้ input date แสดงผลแบบ วัน/เดือน/ปี ในเบราว์เซอร์ที่รองรับ */
        input[type="date"]::-webkit-datetime-edit-text {
          color: #94a3b8;
          padding: 0 0.2em;
        }
        input[type="date"]::-webkit-inner-spin-button {
          display: none;
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
              ←
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                สร้างข่าวใหม่
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ระบุวันที่ลงข้อมูล (วัน/เดือน/ปี)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
        {/* --- Card 1: ข้อมูลข่าวสารและวันที่ --- */}
        <section className="">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl dark:bg-indigo-900/30 dark:text-indigo-400">
              📅
            </div>
            <h2 className="text-lg font-bold">กำหนดวันที่และหมวดหมู่</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* ส่วนของวันที่ที่เน้น วัน/เดือน/ปี */}
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-400 ml-1">
                วันที่ลงข้อมูล (เดือน / วัน / ปี)
              </label>
              <div className="relative group">
                <input
                  type="date"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:bg-zinc-800 dark:border-zinc-700 dark:text-white text-lg font-medium"
                />
                <div className="mt-3 flex items-center gap-3 bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                  <span className="text-indigo-600 dark:text-indigo-300 font-bold text-sm">
                    รูปแบบที่บันทึก:
                  </span>
                  <span className="text-indigo-700 dark:text-indigo-200 font-bold tracking-widest">
                    {formatThaiDate(publishDate)}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed px-2">
                * หากเบราว์เซอร์ของคุณตั้งค่าเป็นภาษาไทย ปฏิทินจะแสดงผลเป็นปี
                พ.ศ. โดยอัตโนมัติ
              </p>
            </div>

            {/* ส่วนหมวดหมู่ */}
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-400 ml-1">
                หมวดหมู่ข่าวสาร
              </label>
              <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map((cat) => (
                  <div
                    key={cat.value}
                    onClick={() => toggleCategory(cat.value)}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all text-center font-bold text-sm ${categories.includes(cat.value) ? cat.color : "border-slate-50 text-slate-400 dark:border-zinc-800 dark:text-slate-600"}`}
                  >
                    {cat.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
            <label className="text-sm font-bold text-slate-600 dark:text-slate-400 ml-1 block mb-3">
              เนื้อหาข่าวสาร
            </label>
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-700 shadow-inner">
              {SunEditorComponent ? (
                <SunEditorComponent
                  setContents={content}
                  onChange={setContent}
                  height="450px"
                  setOptions={{
                    font: fontList,
                    buttonList: [
                      ["undo", "redo"],
                      ["font", "fontSize", "formatBlock"],
                      ["bold", "underline", "italic", "strike"],
                      ["fontColor", "hiliteColor"],
                      ["table", "link", "image", "video"],
                      ["fullScreen", "codeView"],
                    ],
                  }}
                />
              ) : (
                <div className="h-[450px] flex items-center justify-center bg-slate-50 text-slate-400">
                  กำลังเตรียมพื้นที่เขียนข่าว...
                </div>
              )}
            </div>
          </div>
        </section>

        {/* --- ส่วนจัดการรูปภาพ --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="">
            <h2 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 text-lg">
              🖼️ อัลบั้มภาพ (แนวนอน)
            </h2>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(e) => handleDragEnd(e, "general")}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <SortableContext
                  items={imagePreviews}
                  strategy={rectSortingStrategy}
                >
                  {imagePreviews.map((src, i) => (
                    <SortableImage
                      key={src}
                      id={src}
                      src={src}
                      onRemove={() => {
                        setImageFiles((prev) =>
                          prev.filter((_, idx) => idx !== i),
                        );
                        setImagePreviews((prev) =>
                          prev.filter((_, idx) => idx !== i),
                        );
                      }}
                    />
                  ))}
                </SortableContext>
                <label className="aspect-video border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-indigo-300 transition-all dark:border-zinc-700 dark:hover:bg-zinc-800 group">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <span className="text-3xl text-slate-300 group-hover:text-indigo-400 transition-colors">
                    +
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 mt-1">
                    เพิ่มรูปภาพ
                  </span>
                </label>
              </div>
            </DndContext>
          </section>

          <section className="">
            <h2 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 text-lg">
              📜 จดหมายข่าว (แนวตั้ง)
            </h2>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(e) => handleDragEnd(e, "newsletter")}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <SortableContext
                  items={newsletterPreviews}
                  strategy={rectSortingStrategy}
                >
                  {newsletterPreviews.map((src, i) => (
                    <SortableImage
                      key={src}
                      id={src}
                      src={src}
                      isVertical
                      onRemove={() => {
                        setNewsletterFiles((prev) =>
                          prev.filter((_, idx) => idx !== i),
                        );
                        setNewsletterPreviews((prev) =>
                          prev.filter((_, idx) => idx !== i),
                        );
                      }}
                    />
                  ))}
                </SortableContext>
                <label className="aspect-[3/4] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-indigo-300 transition-all dark:border-zinc-700 dark:hover:bg-zinc-800 group">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleNewsletterChange}
                  />
                  <span className="text-3xl text-slate-300 group-hover:text-indigo-400 transition-colors">
                    +
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 mt-1">
                    เพิ่มไฟล์แนวตั้ง
                  </span>
                </label>
              </div>
            </DndContext>
          </section>
        </div>

        {/* --- ส่วนลิงก์และวิดีโอ --- */}
        <section className="">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center text-xl dark:bg-zinc-800 dark:text-slate-400">
              🔗
            </div>
            <h2 className="font-bold text-lg dark:text-white">
              ลิงก์แนบและสื่อวิดีโอ
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* --- ส่วนจัดการลิงก์ --- */}
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                  เพิ่มลิงก์ภายนอก / เอกสารดาวน์โหลด
                </label>
                <div className="flex flex-col sm:flex-row gap-2 p-2 bg-slate-50 dark:bg-zinc-800/50 rounded-2xl border border-slate-100 dark:border-zinc-700">
                  <input
                    placeholder="ชื่อปุ่ม (เช่น ดาวน์โหลด PDF)"
                    value={currentLink.label}
                    onChange={(e) =>
                      setCurrentLink({ ...currentLink, label: e.target.value })
                    }
                    className="flex-1 bg-white dark:bg-zinc-800 p-3 rounded-xl border border-slate-200 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
                  />
                  <input
                    placeholder="URL (https://...)"
                    value={currentLink.url}
                    onChange={(e) =>
                      setCurrentLink({ ...currentLink, url: e.target.value })
                    }
                    className="flex-[1.5] bg-white dark:bg-zinc-800 p-3 rounded-xl border border-slate-200 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (currentLink.label && currentLink.url) {
                        setLinks([...links, currentLink]);
                        setCurrentLink({ label: "", url: "" });
                      }
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-md shadow-indigo-500/10 active:scale-95"
                  >
                    เพิ่ม
                  </button>
                </div>
              </div>

              {/* รายการลิงก์ที่เพิ่มแล้ว */}
              <div className="grid grid-cols-1 gap-2 max-h-[250px] overflow-y-auto pr-2 scrollbar-thin">
                {links.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-slate-100 dark:border-zinc-800 rounded-2xl text-slate-400 text-xs">
                    ยังไม่มีการเพิ่มลิงก์
                  </div>
                )}
                {links.map((l, i) => (
                  <div
                    key={i}
                    className="group flex justify-between items-center p-4 bg-white dark:bg-zinc-800 rounded-xl border border-slate-100 dark:border-zinc-700 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500 text-xs">
                        Link
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">
                          {l.label}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate w-full">
                          {l.url}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setLinks(links.filter((_, idx) => idx !== i))
                      }
                      className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 transition-all"
                      title="ลบลิงก์"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* --- ส่วนจัดการวิดีโอ --- */}
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                  ฝังวิดีโอจาก YouTube (Embed Code)
                </label>
                <div className="space-y-3">
                  <textarea
                    placeholder="วางโค้ด <iframe> ที่ได้จาก YouTube (คลิกแชร์ > ฝัง)"
                    value={currentEmbed}
                    onChange={(e) => setCurrentEmbed(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-slate-200 dark:border-zinc-700 h-28 outline-none focus:ring-2 focus:ring-red-500/20 text-sm font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (currentEmbed.includes("<iframe")) {
                        setVideoEmbeds([...videoEmbeds, currentEmbed]);
                        setCurrentEmbed("");
                      } else {
                        alert("กรุณาวางโค้ด iframe ที่ถูกต้องจาก YouTube");
                      }
                    }}
                    className="w-full bg-red-50 hover:bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 py-3 rounded-xl font-bold transition-all border border-red-100 dark:border-red-900/50 active:scale-[0.99]"
                  >
                    + เพิ่มวิดีโอลงในข่าว
                  </button>
                </div>
              </div>

              {/* Preview รายการวิดีโอ */}
              <div className="grid grid-cols-2 gap-3 max-h-[250px] overflow-y-auto pr-2 scrollbar-thin">
                {videoEmbeds.map((code, i) => (
                  <div
                    key={i}
                    className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-700 bg-black group"
                  >
                    <div
                      className="w-full h-full pointer-events-none opacity-60 scale-[0.5]"
                      dangerouslySetInnerHTML={{ __html: code }}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() =>
                          setVideoEmbeds(
                            videoEmbeds.filter((_, idx) => idx !== i),
                          )
                        }
                        className="bg-white text-red-600 w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* --- Action Bar ด้านล่าง --- */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-md border-t border-slate-200 flex justify-center z-40 dark:bg-zinc-900/90 dark:border-zinc-800">
        <div className="max-w-5xl w-full flex gap-4">
          <Link
            href="/dashboard/news"
            className="px-8 py-4 rounded-full border border-slate-200 font-bold text-slate-500 hover:bg-slate-50 transition-colors"
          >
            ยกเลิก
          </Link>
          <button
            onClick={handleSubmit}
            disabled={isLoading || isCompressing}
            className={`flex-1 py-4 rounded-full font-bold text-white transition-all transform active:scale-[0.98] ${isLoading || isCompressing ? "bg-slate-300 cursor-wait" : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl shadow-indigo-500/30"}`}
          >
            {isLoading
              ? "⏳ กำลังบันทึกข้อมูล..."
              : "✨ ยืนยันการบันทึกข่าวสาร"}
          </button>
        </div>
      </div>
    </div>
  );
}
