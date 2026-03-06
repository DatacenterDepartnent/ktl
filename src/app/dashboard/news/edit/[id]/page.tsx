/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
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
function SortableImage({
  id,
  src,
  onRemove,
  isVertical = false,
  isNew = false,
}: any) {
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
      className={`relative rounded-xl overflow-hidden shadow-sm border-2 group touch-none bg-slate-100 dark:bg-zinc-800 ${
        isVertical ? "aspect-[3/4]" : "aspect-video"
      } ${isNew ? "border-blue-400 dark:border-blue-600" : "border-slate-200 dark:border-zinc-700"}`}
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
        {isNew && (
          <div className="absolute top-1 left-1 bg-blue-600 text-white text-[8px] px-1.5 py-0.5 rounded font-bold uppercase">
            New
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-md z-10 hover:bg-red-600 transition-colors"
      >
        ✕
      </button>
    </div>
  );
}

export default function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [SunEditorComponent, setSunEditorComponent] =
    useState<React.ComponentType<any> | null>(null);

  const [content, setContent] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  // --- Images State (รวมทั้งเก่าและใหม่ไว้ใน Array เดียวกันเพื่อให้ลากสลับกันได้) ---
  // รูปทั่วไป
  const [allImages, setAllImages] = useState<
    { id: string; src: string; file?: File; isNew: boolean }[]
  >([]);
  // จดหมายข่าว
  const [allNewsletters, setAllNewsletters] = useState<
    { id: string; src: string; file?: File; isNew: boolean }[]
  >([]);

  const [links, setLinks] = useState<{ label: string; url: string }[]>([]);
  const [currentLink, setCurrentLink] = useState({ label: "", url: "" });
  const [videoEmbeds, setVideoEmbeds] = useState<string[]>([]);
  const [currentEmbed, setCurrentEmbed] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    import("suneditor-react").then((mod) =>
      setSunEditorComponent(() => mod.default),
    );

    fetch(`/api/news/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setContent(data.content);
        setCategories(
          Array.isArray(data.categories)
            ? data.categories
            : [data.category || "PR"],
        );

        // แปลงข้อมูลรูปเดิมให้อยู่ในรูปแบบที่จัดการง่าย
        setAllImages(
          (data.images || []).map((url: string) => ({
            id: url,
            src: url,
            isNew: false,
          })),
        );
        setAllNewsletters(
          (data.announcementImages || []).map((url: string) => ({
            id: url,
            src: url,
            isNew: false,
          })),
        );

        setLinks(data.links || []);
        setVideoEmbeds(data.videoEmbeds || []);
        setLoading(false);
      });
  }, [id]);

  const compressImage = async (file: File) => {
    const options = {
      maxSizeMB: 0.8,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    return await imageCompression(file, options);
  };

  const generateTitleFromContent = (htmlContent: string) => {
    if (typeof window === "undefined") return "";
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const text = doc.body.textContent || "";
    const cleanText = text.replace(/\s+/g, " ").trim();
    if (!cleanText) return "";
    return cleanText.length > 100
      ? cleanText.substring(0, 100) + "..."
      : cleanText;
  };

  // --- Handlers: Drag & Drop ---
  const handleDragEnd = (
    event: DragEndEvent,
    type: "general" | "newsletter",
  ) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      if (type === "general") {
        setAllImages((items) => {
          const oldIndex = items.findIndex((i) => i.id === active.id);
          const newIndex = items.findIndex((i) => i.id === over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      } else {
        setAllNewsletters((items) => {
          const oldIndex = items.findIndex((i) => i.id === active.id);
          const newIndex = items.findIndex((i) => i.id === over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    }
  };

  // --- Handlers: File Selection ---
  const handleNewFilesChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files) {
      setIsCompressing(true);
      const files = Array.from(e.target.files);
      const compressed = await Promise.all(files.map((f) => compressImage(f)));

      const newItems = compressed.map((file) => {
        const previewUrl = URL.createObjectURL(file);
        return { id: previewUrl, src: previewUrl, file, isNew: true };
      });

      setAllImages((prev) => [...prev, ...newItems]);
      setIsCompressing(false);
    }
  };

  const handleNewNewsletterChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files) {
      setIsCompressing(true);
      const files = Array.from(e.target.files);
      const compressed = await Promise.all(files.map((f) => compressImage(f)));

      const newItems = compressed.map((file) => {
        const previewUrl = URL.createObjectURL(file);
        return { id: previewUrl, src: previewUrl, file, isNew: true };
      });

      setAllNewsletters((prev) => [...prev, ...newItems]);
      setIsCompressing(false);
    }
  };

  const addEmbed = () => {
    if (!currentEmbed.trim() || !currentEmbed.includes("<iframe"))
      return alert("โค้ด Embed ไม่ถูกต้อง");
    setVideoEmbeds([...videoEmbeds, currentEmbed]);
    setCurrentEmbed("");
  };

  // --- Submit Logic ---
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const autoTitle = generateTitleFromContent(content);
    if (!autoTitle || submitting || isCompressing) return;
    setSubmitting(true);

    try {
      // 1. จัดการรูปภาพทั่วไป: อัปโหลดเฉพาะรูปใหม่ สลับลำดับตามที่ลากไว้
      const finalImages = await Promise.all(
        allImages.map(async (item) => {
          if (item.isNew && item.file) {
            return await uploadToCloudinary(item.file, "ktltc_news");
          }
          return item.src; // รูปเดิมส่ง URL กลับไป
        }),
      );

      // 2. จัดการจดหมายข่าว
      const finalNewsletters = await Promise.all(
        allNewsletters.map(async (item) => {
          if (item.isNew && item.file) {
            return await uploadToCloudinary(item.file, "ktltc_newsletters");
          }
          return item.src;
        }),
      );

      const res = await fetch(`/api/news/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: autoTitle,
          content,
          categories,
          images: finalImages.filter((url) => url !== null),
          announcementImages: finalNewsletters.filter((url) => url !== null),
          links,
          videoEmbeds,
        }),
      });

      if (res.ok) {
        alert("✅ แก้ไขข้อมูลเรียบร้อย");
        router.push("/dashboard/news");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาด");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 font-bold dark:bg-black">
        กำลังโหลด...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50/50 pb-40 text-slate-800 antialiased dark:bg-black dark:text-slate-200">
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
      <div className="border-b border-slate-200 sticky top-0 z-30 px-4 py-4 flex items-center justify-between backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/news"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-zinc-800 dark:text-slate-400"
          >
            ←
          </Link>
          <div>
            <h1 className="text-xl font-bold dark:text-white">แก้ไขข่าวสาร</h1>
            <p className="text-[10px] text-slate-400">
              ลากเพื่อจัดลำดับรูปภาพเดิมและรูปภาพใหม่ร่วมกันได้
            </p>
          </div>
        </div>
        {isCompressing && (
          <span className="text-blue-600 text-xs font-black animate-pulse bg-blue-50 px-3 py-1 rounded-full border border-blue-100 dark:bg-blue-900/30">
            ⏳ กำลังย่อขนาดรูป...
          </span>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
        {/* --- Card 1: Content --- */}
        <section className="rounded-3xl space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl text-amber-600 flex items-center justify-center text-xl dark:bg-amber-900/30 dark:text-amber-400">
              📝
            </div>
            <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">
              รายละเอียดข่าว
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.value}
                onClick={() =>
                  setCategories((prev) =>
                    prev.includes(cat.value)
                      ? prev.filter((c) => c !== cat.value)
                      : [...prev, cat.value],
                  )
                }
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all text-center font-bold text-sm ${categories.includes(cat.value) ? cat.color : "border-slate-100 text-slate-400 dark:border-zinc-700"}`}
              >
                {cat.label}
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm dark:border-zinc-700">
            {SunEditorComponent && (
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
            )}
          </div>
        </section>

        {/* --- Card 2: General Images (DND) --- */}
        <section className="rounded-3xl space-y-6">
          <h2 className="font-bold text-slate-700 flex items-center gap-2 text-lg dark:text-slate-200">
            🖼️ รูปภาพทั่วไป (แนวนอน) -{" "}
            <span className="text-sm font-normal text-slate-400">
              ลากสลับลำดับได้
            </span>
          </h2>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(e) => handleDragEnd(e, "general")}
          >
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <SortableContext
                items={allImages.map((i) => i.id)}
                strategy={rectSortingStrategy}
              >
                {allImages.map((item) => (
                  <SortableImage
                    key={item.id}
                    id={item.id}
                    src={item.src}
                    isNew={item.isNew}
                    onRemove={() =>
                      setAllImages(allImages.filter((i) => i.id !== item.id))
                    }
                  />
                ))}
              </SortableContext>
              <label className="aspect-video border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 dark:border-zinc-600 dark:hover:bg-blue-900/20">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleNewFilesChange}
                />
                <span className="text-xl text-slate-400">+</span>
                <span className="text-[10px] font-black text-slate-400">
                  ADD MORE
                </span>
              </label>
            </div>
          </DndContext>
        </section>

        {/* --- Card 3: Newsletters (DND) --- */}
        <section className="rounded-3xl space-y-6">
          <h2 className="font-bold text-slate-700 flex items-center gap-2 text-lg dark:text-slate-200">
            📜 จดหมายข่าว (แนวตั้ง)
          </h2>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(e) => handleDragEnd(e, "newsletter")}
          >
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <SortableContext
                items={allNewsletters.map((i) => i.id)}
                strategy={rectSortingStrategy}
              >
                {allNewsletters.map((item) => (
                  <SortableImage
                    key={item.id}
                    id={item.id}
                    src={item.src}
                    isVertical
                    isNew={item.isNew}
                    onRemove={() =>
                      setAllNewsletters(
                        allNewsletters.filter((i) => i.id !== item.id),
                      )
                    }
                  />
                ))}
              </SortableContext>
              <label className="aspect-[3/4] border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-purple-50 dark:border-zinc-600 dark:hover:bg-purple-900/20">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleNewNewsletterChange}
                />
                <span className="text-xl text-slate-400">+</span>
                <span className="text-[10px] font-black text-slate-400">
                  ADD MORE
                </span>
              </label>
            </div>
          </DndContext>
        </section>

        {/* --- Card 4: Links --- */}
        <section className="rounded-3xl space-y-4">
          <h2 className="font-bold text-slate-700 dark:text-slate-200">
            🔗 ลิงก์ภายนอก / เอกสารแนบ
          </h2>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              placeholder="ชื่อปุ่ม"
              value={currentLink.label}
              onChange={(e) =>
                setCurrentLink({ ...currentLink, label: e.target.value })
              }
              className="flex-1 bg-slate-50 p-4 rounded-2xl border dark:bg-zinc-800 dark:border-zinc-700"
            />
            <input
              placeholder="URL"
              value={currentLink.url}
              onChange={(e) =>
                setCurrentLink({ ...currentLink, url: e.target.value })
              }
              className="flex-1 bg-slate-50 p-4 rounded-2xl border dark:bg-zinc-800 dark:border-zinc-700"
            />
            <button
              type="button"
              onClick={() => {
                if (currentLink.label && currentLink.url) {
                  setLinks([...links, currentLink]);
                  setCurrentLink({ label: "", url: "" });
                }
              }}
              className="bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold dark:bg-zinc-700"
            >
              + เพิ่มลิงก์
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
        <section className="rounded-3xl space-y-4">
          <h2 className="font-bold text-slate-700 dark:text-slate-200">
            🎥 วิดีโอ (Embed Code)
          </h2>
          <textarea
            rows={3}
            placeholder="วางโค้ด Embed ที่นี่..."
            value={currentEmbed}
            onChange={(e) => setCurrentEmbed(e.target.value)}
            className="w-full bg-slate-50 p-4 rounded-2xl border dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
          />
          <button
            type="button"
            onClick={addEmbed}
            className="self-end bg-red-600 text-white px-8 py-3 rounded-2xl font-bold"
          >
            เพิ่มวิดีโอ
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
                  className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md z-20 hover:scale-110"
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
            className="px-10 py-4 rounded-full border-2 font-bold text-slate-400 dark:border-zinc-700"
          >
            ยกเลิก
          </Link>
          <button
            onClick={handleUpdate}
            disabled={submitting || isCompressing}
            className={`flex-1 py-4 rounded-full font-bold text-white transition-all ${submitting || isCompressing ? "bg-slate-300" : "bg-gradient-to-r from-amber-500 to-orange-600 shadow-xl"}`}
          >
            {submitting ? "⏳ กำลังบันทึก..." : "💾 บันทึกการแก้ไขข่าวสาร"}
          </button>
        </div>
      </div>
    </div>
  );
}
