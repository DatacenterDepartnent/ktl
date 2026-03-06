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
      className={`relative rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-zinc-700 group touch-none bg-slate-100 dark:bg-zinc-800 ${
        isVertical ? "aspect-[3/4]" : "aspect-video"
      }`}
    >
      {/* Drag Handle Area */}
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

      {/* Remove Button */}
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

// --- Main Page Component ---
export default function AddNewsPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<string[]>(["PR"]);
  const [content, setContent] = useState("");

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

  // DND Sensors
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

  // --- Handlers ---
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

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
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

  const addEmbed = () => {
    if (!currentEmbed.trim()) return;
    if (!currentEmbed.includes("<iframe"))
      return alert("กรุณาวางโค้ด Embed ที่ถูกต้อง");
    setVideoEmbeds([...videoEmbeds, currentEmbed]);
    setCurrentEmbed("");
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
      const validImages = generalUploads.filter(
        (url) => url !== null,
      ) as string[];
      const validNewsletter = newsletterUploads.filter(
        (url) => url !== null,
      ) as string[];

      const payload = {
        title: autoTitle,
        categories,
        content,
        images: validImages,
        announcementImages: validNewsletter,
        links,
        videoEmbeds,
      };

      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("บันทึกสำเร็จ!");
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
                ลากเพื่อเปลี่ยนลำดับรูปภาพได้ทันที
              </p>
            </div>
          </div>
          {isCompressing && (
            <span className="text-blue-600 text-xs font-black animate-pulse bg-blue-50 px-3 py-1 rounded-full border border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
              ⏳ กำลังย่อขนาดรูป...
            </span>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
        {/* --- Card 1: Details --- */}
        <section className="rounded-3xl space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl dark:bg-blue-900/30 dark:text-blue-400">
              📝
            </div>
            <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">
              รายละเอียดข่าว
            </h2>
          </div>
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 dark:text-slate-500">
                หมวดหมู่
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {CATEGORIES.map((cat) => (
                  <div
                    key={cat.value}
                    onClick={() => toggleCategory(cat.value)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all text-center font-bold text-sm ${categories.includes(cat.value) ? cat.color : "border-slate-100 text-slate-400 hover:border-slate-200 dark:border-zinc-700 dark:text-slate-500 dark:hover:border-zinc-600"}`}
                  >
                    {cat.label}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 dark:text-slate-500">
                เนื้อหาข่าว (Rich Text)
              </label>
              <div className="rounded-2xl shadow-sm border border-slate-200 overflow-hidden dark:border-zinc-700">
                {SunEditorComponent ? (
                  <SunEditorComponent
                    setContents={content}
                    onChange={setContent}
                    height="400px"
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
                  <div className="h-[400px] flex items-center justify-center bg-slate-50 text-slate-400 dark:bg-zinc-800 dark:text-slate-500">
                    กำลังโหลด Editor...
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* --- Card 2: General Images (DND) --- */}
        <section className="rounded-3xl space-y-6">
          <h2 className="font-bold text-slate-700 flex items-center gap-2 text-lg dark:text-slate-200">
            🖼️ รูปภาพทั่วไป (แนวนอน) -{" "}
            <span className="text-sm font-normal text-slate-400">
              ลากเพื่อเรียงลำดับ
            </span>
          </h2>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(e) => handleDragEnd(e, "general")}
          >
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <SortableContext
                items={imagePreviews}
                strategy={rectSortingStrategy}
              >
                {imagePreviews.map((src, i) => (
                  <SortableImage
                    key={src}
                    id={src}
                    src={src}
                    onRemove={() => removeImage(i)}
                  />
                ))}
              </SortableContext>
              <label className="aspect-video border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-all dark:border-zinc-600 dark:hover:bg-blue-900/20 dark:hover:border-blue-500">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <span className="text-xl text-slate-400">+</span>
                <span className="text-[10px] font-black text-slate-400 uppercase">
                  Add More
                </span>
              </label>
            </div>
          </DndContext>
        </section>

        {/* --- Card 3: Newsletter (DND) --- */}
        <section className="rounded-3xl space-y-6">
          <h2 className="font-bold text-slate-700 flex items-center gap-2 text-lg dark:text-slate-200">
            📜 จดหมายข่าว (แนวตั้ง) -{" "}
            <span className="text-sm font-normal text-slate-400">
              ลากเพื่อเรียงลำดับ
            </span>
          </h2>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(e) => handleDragEnd(e, "newsletter")}
          >
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
                    onRemove={() => removeNewsletter(i)}
                  />
                ))}
              </SortableContext>
              <label className="aspect-[3/4] border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-purple-50 hover:border-purple-400 transition-all dark:border-zinc-600 dark:hover:bg-purple-900/20 dark:hover:border-purple-500">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleNewsletterChange}
                />
                <span className="text-xl text-slate-400">+</span>
                <span className="text-[10px] font-black text-slate-400 uppercase">
                  Add More
                </span>
              </label>
            </div>
          </DndContext>
        </section>

        {/* --- Card 4: Links --- */}
        <section className="rounded-3xl space-y-6">
          <h2 className="font-bold text-slate-700 flex items-center gap-2 text-lg dark:text-slate-200">
            🔗 ลิงก์ภายนอก / เอกสารแนบ
          </h2>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              placeholder="ชื่อปุ่ม"
              value={currentLink.label}
              onChange={(e) =>
                setCurrentLink({ ...currentLink, label: e.target.value })
              }
              className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-200 dark:bg-zinc-800 dark:border-zinc-700"
            />
            <input
              placeholder="URL"
              value={currentLink.url}
              onChange={(e) =>
                setCurrentLink({ ...currentLink, url: e.target.value })
              }
              className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-200 dark:bg-zinc-800 dark:border-zinc-700"
            />
            <button
              type="button"
              onClick={addLink}
              className="bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold dark:bg-zinc-700"
            >
              + เพิ่มลิงก์
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            {links.map((l, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border dark:bg-zinc-800 dark:border-zinc-700"
              >
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-bold dark:text-slate-200">
                    {l.label}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate">
                    {l.url}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setLinks(links.filter((_, idx) => idx !== i))}
                  className="text-red-400 font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* --- Card 5: Videos --- */}
        <section className="rounded-3xl space-y-6">
          <h2 className="font-bold text-slate-700 flex items-center gap-3 text-lg dark:text-slate-200">
            <span className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center dark:bg-red-900/30">
              🎥
            </span>{" "}
            วิดีโอ (Embed Code)
          </h2>
          <textarea
            rows={3}
            placeholder="วางโค้ด Embed ที่นี่..."
            value={currentEmbed}
            onChange={(e) => setCurrentEmbed(e.target.value)}
            className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
          />
          <button
            type="button"
            onClick={addEmbed}
            className="bg-red-600 text-white px-8 py-3 rounded-2xl font-bold self-end"
          >
            + เพิ่มวิดีโอ
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {videoEmbeds.map((code, i) => (
              <div
                key={i}
                className="relative group border border-slate-200 rounded-xl p-2 bg-white dark:bg-zinc-800 dark:border-zinc-700"
              >
                <button
                  type="button"
                  onClick={() =>
                    setVideoEmbeds(videoEmbeds.filter((_, idx) => idx !== i))
                  }
                  className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md z-20 hover:scale-110 transition-transform"
                >
                  ✕
                </button>
                <div
                  className="aspect-video w-full overflow-hidden rounded-lg bg-black/5 [&>iframe]:w-full [&>iframe]:h-full"
                  dangerouslySetInnerHTML={{ __html: code }}
                />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* --- Action Bar --- */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-md border-t border-slate-200 flex justify-center z-40 dark:bg-zinc-900/90 dark:border-zinc-800">
        <div className="max-w-5xl w-full flex gap-4">
          <Link
            href="/dashboard/news"
            className="px-10 py-4 rounded-full border-2 font-bold text-slate-400 hover:bg-slate-50 dark:border-zinc-700 dark:text-slate-500 dark:hover:bg-zinc-800"
          >
            ยกเลิก
          </Link>
          <button
            onClick={handleSubmit}
            disabled={isLoading || isCompressing}
            className={`flex-1 py-4 rounded-full font-bold text-white transition-all ${isLoading || isCompressing ? "bg-slate-300 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/30"}`}
          >
            {isLoading ? "⏳ กำลังบันทึก..." : "✨ บันทึกข่าวสาร"}
          </button>
        </div>
      </div>
    </div>
  );
}
