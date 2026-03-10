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
      "bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800",
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
          unoptimized
          className={isVertical ? "object-contain" : "object-cover"}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 text-white text-xs bg-black/40 px-2 py-1 rounded-md pointer-events-none">
            ลากเพื่อย้าย
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
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
  const [publishDate, setPublishDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  // 🔗 เชื่อมโยง: ข้อมูลผู้ใช้เริ่มต้น
  const [currentUser, setCurrentUser] = useState<any>({
    name: "กำลังดึงข้อมูลผู้เขียน...",
    image: null,
  });

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
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const userData = await res.json();
          // Log ดูค่าที่ได้จาก API จริงๆ ว่าหน้าตาเป็นอย่างไร
          console.log("User Data from API:", userData);

          // ตรวจสอบว่า API ส่งชื่อมาใน field ไหน (เช่น userData.name หรือ userData.user.name)
          setCurrentUser({
            name:
              userData.name ||
              userData.user?.name ||
              "งานศูนย์ข้อมูล วิทยาลัยเทคนิคกันทรลักษ์",
            image: userData.image || userData.user?.image || null,
          });
        } else {
          throw new Error("Unauthorized");
        }
      } catch (err) {
        console.log("Fetch failed, using fallback name.");
        setCurrentUser({
          name: "งานศูนย์ข้อมูล วิทยาลัยเทคนิคกันทรลักษ์",
          image: null,
        });
      }
    };

    fetchUser();

    // ส่วนของ SunEditor และ Cleanup คงเดิมไว้ครับ
    import("suneditor-react").then((mod) =>
      setSunEditorComponent(() => mod.default),
    );

    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
      newsletterPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
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
    return cleanText.length > 100
      ? cleanText.substring(0, 100) + "..."
      : cleanText;
  };

  const compressImage = async (file: File) => {
    const options = {
      maxSizeMB: 0.8,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      return await imageCompression(file, options);
    } catch (error) {
      return file;
    }
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
      const newPreviews = compressedFiles.map((f) => URL.createObjectURL(f));
      setImageFiles((prev) => [...prev, ...compressedFiles]);
      setImagePreviews((prev) => [...prev, ...newPreviews]);
      setIsCompressing(false);
      e.target.value = "";
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
      const newPreviews = compressedFiles.map((f) => URL.createObjectURL(f));
      setNewsletterFiles((prev) => [...prev, ...compressedFiles]);
      setNewsletterPreviews((prev) => [...prev, ...newPreviews]);
      setIsCompressing(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const autoTitle = generateTitleFromContent(content);

    if (!content || content === "<p><br></p>")
      return alert("กรุณาใส่เนื้อหาข่าวด้วยครับ");
    if (isLoading || isCompressing) return;

    setIsLoading(true);
    try {
      // 1. Upload Images
      const generalUploads = await Promise.all(
        imageFiles.map((f) => uploadToCloudinary(f, "ktltc_news")),
      );
      const newsletterUploads = await Promise.all(
        newsletterFiles.map((f) => uploadToCloudinary(f, "ktltc_newsletters")),
      );

      // 2. Prepare Data (🔗 เชื่อมโยง: ใช้ชื่อจาก currentUser)
      const payload = {
        title: autoTitle,
        categories,
        content,
        images: generalUploads.filter((u) => u !== null),
        announcementImages: newsletterUploads.filter((u) => u !== null),
        links,
        videoEmbeds,
        createdAt: new Date(publishDate).toISOString(),
        userName: currentUser.name, // ✅ ส่งชื่อจาก API /auth/me
        userImage: currentUser.image || null,
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
        const err = await res.json();
        alert(err.error || "เกิดข้อผิดพลาดในการบันทึก");
      }
    } catch (error) {
      console.error("Submit Error:", error);
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
          font-size: 16px !important;
        }
      `}</style>

      {/* Top Bar */}
      <div className="border-b border-slate-200 sticky top-0 z-20 shadow-sm backdrop-blur-md bg-white/80 dark:bg-black/80 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/news"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-zinc-800"
            >
              {" "}
              ←{" "}
            </Link>
            <div>
              <h1 className="text-xl font-bold dark:text-white">
                สร้างข่าวใหม่
              </h1>
              <p className="text-xs text-slate-500">
                ผู้เขียน:{" "}
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {currentUser.name}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 space-y-12">
        {/* Date & Categories */}
        <section className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-400">
                วันที่ลงข้อมูล
              </label>
              <input
                type="date"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-200 dark:bg-zinc-800 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-400">
                หมวดหมู่
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CATEGORIES.map((cat) => (
                  <div
                    key={cat.value}
                    onClick={() => toggleCategory(cat.value)}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all text-center font-bold text-xs ${categories.includes(cat.value) ? cat.color : "border-slate-100 text-slate-400 dark:border-zinc-800"}`}
                  >
                    {" "}
                    {cat.label}{" "}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6">
            <label className="text-sm font-bold text-slate-600 dark:text-slate-400 block mb-3">
              เนื้อหาข่าวสาร
            </label>
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-700 bg-white">
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
                      ["align", "list", "lineHeight"],
                      ["table", "link", "image", "video"],
                      ["fullScreen", "codeView"],
                    ],
                  }}
                />
              ) : (
                <div className="h-[450px] flex items-center justify-center bg-slate-50">
                  กำลังเตรียมพื้นที่เขียนข่าว...
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Images & Video Sections... (ส่วนที่เหลือคงเดิมตามดีไซน์ของคุณ) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* อัลบั้มภาพ */}
          <section className="space-y-4">
            <h2 className="font-bold text-lg flex items-center gap-2">
              🖼️ อัลบั้มภาพ
            </h2>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(e) => handleDragEnd(e, "general")}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-2 border-dashed border-slate-200 p-4 rounded-3xl dark:border-zinc-800">
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
                <label className="aspect-video border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:border-zinc-700">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  {isCompressing ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                  ) : (
                    <span className="text-slate-400 text-xs">+ เพิ่มรูป</span>
                  )}
                </label>
              </div>
            </DndContext>
          </section>

          {/* จดหมายข่าว */}
          <section className="space-y-4">
            <h2 className="font-bold text-lg flex items-center gap-2">
              📜 จดหมายข่าว (A4)
            </h2>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(e) => handleDragEnd(e, "newsletter")}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-2 border-dashed border-slate-200 p-4 rounded-3xl dark:border-zinc-800">
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
                <label className="aspect-[3/4] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:border-zinc-700">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleNewsletterChange}
                  />
                  {isCompressing ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                  ) : (
                    <span className="text-slate-400 text-xs">+ เพิ่ม A4</span>
                  )}
                </label>
              </div>
            </DndContext>
          </section>
        </div>

        {/* Links & Video Embed */}
        <section className="bg-white dark:bg-zinc-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-zinc-800 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-400 uppercase">
                ลิงก์แนบ
              </label>
              <div className="flex gap-2">
                <input
                  placeholder="ชื่อปุ่ม"
                  value={currentLink.label}
                  onChange={(e) =>
                    setCurrentLink({ ...currentLink, label: e.target.value })
                  }
                  className="flex-1 bg-slate-50 p-3 rounded-xl dark:bg-zinc-800 border-none"
                />
                <input
                  placeholder="URL"
                  value={currentLink.url}
                  onChange={(e) =>
                    setCurrentLink({ ...currentLink, url: e.target.value })
                  }
                  className="flex-1 bg-slate-50 p-3 rounded-xl dark:bg-zinc-800 border-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (currentLink.label && currentLink.url) {
                      setLinks([...links, currentLink]);
                      setCurrentLink({ label: "", url: "" });
                    }
                  }}
                  className="bg-indigo-600 text-white px-4 rounded-xl"
                >
                  เพิ่ม
                </button>
              </div>
              <div className="space-y-2">
                {links.map((l, i) => (
                  <div
                    key={i}
                    className="flex justify-between p-3 bg-slate-50 dark:bg-zinc-800 rounded-lg text-sm"
                  >
                    <span>{l.label}</span>
                    <button
                      onClick={() =>
                        setLinks(links.filter((_, idx) => idx !== i))
                      }
                      className="text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-400 uppercase">
                YouTube Embed
              </label>
              <textarea
                placeholder="วาง <iframe> โค้ดที่นี่"
                value={currentEmbed}
                onChange={(e) => setCurrentEmbed(e.target.value)}
                className="w-full bg-slate-50 p-4 rounded-2xl dark:bg-zinc-800 h-24 border-none"
              />
              <button
                type="button"
                onClick={() => {
                  if (currentEmbed.includes("<iframe")) {
                    setVideoEmbeds([...videoEmbeds, currentEmbed]);
                    setCurrentEmbed("");
                  }
                }}
                className="w-full bg-red-600 text-white py-3 rounded-xl"
              >
                + เพิ่มวิดีโอ
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-md border-t border-slate-200 flex justify-center z-40 dark:bg-zinc-900/90 dark:border-zinc-800">
        <div className="max-w-5xl w-full flex gap-4">
          <Link
            href="/dashboard/news"
            className="px-8 py-4 rounded-full border border-slate-200 font-bold text-slate-500"
          >
            {" "}
            ยกเลิก{" "}
          </Link>
          <button
            onClick={handleSubmit}
            disabled={isLoading || isCompressing}
            className={`flex-1 py-4 rounded-full font-bold text-white ${isLoading || isCompressing ? "bg-slate-300" : "bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30"}`}
          >
            {isLoading
              ? "⏳ กำลังบันทึก..."
              : isCompressing
                ? "⚙️ กำลังประมวลผลรูป..."
                : "✨ ยืนยันการบันทึกข่าวสาร"}
          </button>
        </div>
      </div>
    </div>
  );
}
