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
import {
  FiArrowLeft,
  FiCalendar,
  FiImage,
  FiFileText,
  FiLink,
  FiYoutube,
  FiCheckCircle,
  FiPlus,
} from "react-icons/fi";

// --- Config ---
const CATEGORIES = [
  { value: "PR", label: "ข่าวประชาสัมพันธ์", color: "bg-blue-500" },
  { value: "Newsletter", label: "จดหมายข่าว", color: "bg-purple-500" },
  { value: "Internship", label: "ฝึกงาน/ประสบการณ์", color: "bg-emerald-500" },
  { value: "Announcement", label: "ข่าวประกาศ", color: "bg-orange-500" },
  { value: "Bidding", label: "ประกวดราคา", color: "bg-pink-500" },
  { value: "Order", label: "คำสั่งวิทยาลัย", color: "bg-indigo-500" },
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
      className={`relative rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-700 group touch-none bg-slate-100 dark:bg-zinc-800 ${isVertical ? "aspect-[3/4]" : "aspect-video"}`}
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
          <span className="opacity-0 group-hover:opacity-100 text-white text-[10px] bg-black/40 px-2 py-1 rounded-md">
            ลากเพื่อย้าย
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
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
  const [categories, setCategories] = useState<string[]>(["PR"]);
  const [content, setContent] = useState("");
  const [publishDate, setPublishDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [currentUser, setCurrentUser] = useState<any>({
    name: "งานศูนย์ข้อมูล...",
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
          setCurrentUser({
            name:
              userData.name ||
              userData.user?.name ||
              "งานศูนย์ข้อมูล วิทยาลัยเทคนิคกันทรลักษ์",
            image: userData.image || userData.user?.image || null,
          });
        }
      } catch (err) {
        setCurrentUser({
          name: "งานศูนย์ข้อมูล วิทยาลัยเทคนิคกันทรลักษ์",
          image: null,
        });
      }
    };
    fetchUser();
    import("suneditor-react").then((mod) =>
      setSunEditorComponent(() => mod.default),
    );
  }, []);

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

  // ✅ แก้ไข: รวมฟังก์ชันจัดการไฟล์ให้ชื่อตรงกับที่เรียกใน JSX
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "general" | "newsletter",
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsCompressing(true);
      const originalFiles = Array.from(e.target.files);
      const compressedFiles = await Promise.all(
        originalFiles.map((file) => compressImage(file)),
      );
      const newPreviews = compressedFiles.map((f) => URL.createObjectURL(f));

      if (type === "general") {
        setImageFiles((prev) => [...prev, ...compressedFiles]);
        setImagePreviews((prev) => [...prev, ...newPreviews]);
      } else {
        setNewsletterFiles((prev) => [...prev, ...compressedFiles]);
        setNewsletterPreviews((prev) => [...prev, ...newPreviews]);
      }
      setIsCompressing(false);
      e.target.value = "";
    }
  };

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

  const handleSubmit = async () => {
    if (!content || content === "<p><br></p>")
      return alert("กรุณาใส่เนื้อหาข่าวด้วยครับ");
    setIsLoading(true);
    try {
      const generalUploads = await Promise.all(
        imageFiles.map((f) => uploadToCloudinary(f, "ktltc_news")),
      );
      const newsletterUploads = await Promise.all(
        newsletterFiles.map((f) => uploadToCloudinary(f, "ktltc_newsletters")),
      );
      const payload = {
        title:
          content
            .replace(/<[^>]*>/g, "")
            .substring(0, 100)
            .trim() + "...",
        categories,
        content,
        images: generalUploads.filter((u) => u !== null),
        announcementImages: newsletterUploads.filter((u) => u !== null),
        links,
        videoEmbeds,
        createdAt: new Date(publishDate).toISOString(),
        userName: currentUser.name,
        userImage: currentUser.image || null,
      };
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        router.push("/dashboard/news");
        router.refresh();
      }
    } catch (error) {
      alert("เกิดข้อผิดพลาด");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 pb-20 font-['Sarabun']">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700;800&display=swap");
        .sun-editor-editable {
          font-family: "Sarabun", sans-serif !important;
          border-radius: 1.5rem !important;
        }
      `}</style>

      <div className="border-b border-slate-200 sticky top-0 z-20 shadow-sm backdrop-blur-md bg-white/80 dark:bg-black/80 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
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
                ย้อนกลับไปดูข่าวสารทั้งหมด
              </h1>
              <p className="text-xs text-slate-500">
                ผู้ใช้:{" "}
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {currentUser.name}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-12">
        {/* 1. วันที่ และ หมวดหมู่ */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
              <FiCalendar className="text-indigo-500" /> วันที่ลงข่าว
            </label>
            <input
              type="date"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              className="w-full bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-indigo-500 font-bold text-sm outline-none"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">
              เลือกหมวดหมู่ (สามารถเลือกได้มากกว่า 1 หมวด)
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() =>
                    setCategories((prev) =>
                      prev.includes(cat.value)
                        ? prev.length > 1
                          ? prev.filter((c) => c !== cat.value)
                          : prev
                        : [...prev, cat.value],
                    )
                  }
                  className={`px-4 py-2 rounded-xl text-[10px] font-extrabold border transition-all ${categories.includes(cat.value) ? `${cat.color} text-white border-transparent` : "text-slate-400 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 2. เนื้อหาข่าวสาร */}
        <section className="space-y-4">
          {/* ✅ แก้ไข: ลบ text-slate-400 ออกเพื่อให้เหลือแค่สีเดียวตามที่ Tailwind แจ้งเตือน */}
          <label className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2 italic text-indigo-600">
            <FiFileText /> เนื้อหาข่าวสาร
          </label>
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
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
                    [
                      "bold",
                      "underline",
                      "italic",
                      "strike",
                      "fontColor",
                      "hiliteColor",
                    ],
                    ["align", "list", "table", "link", "image", "video"],
                    ["fullScreen", "codeView"],
                  ],
                }}
              />
            ) : (
              <div className="h-[450px] flex items-center justify-center text-slate-400 italic">
                กำลังโหลด...
              </div>
            )}
          </div>
        </section>

        {/* 3. อัลบั้มรูปภาพ */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold flex items-center gap-2">
              <FiImage className="text-indigo-500" /> อัลบั้มรูปภาพ
            </h2>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {imagePreviews.length} รูปภาพ
            </span>
          </div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(e) => handleDragEnd(e, "general")}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
              <label className="aspect-video border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50/30 transition-all group bg-white dark:bg-zinc-900">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "general")}
                />
                <FiPlus
                  size={24}
                  className="text-slate-300 group-hover:text-indigo-500"
                />
                <span className="text-[10px] font-bold text-slate-400 mt-2">
                  เพิ่มรูปภาพประกอบ
                </span>
              </label>
            </div>
          </DndContext>
        </section>

        {/* 4. จดหมายข่าว (แนวตั้ง) */}
        <section className="space-y-6">
          <h2 className="font-extrabold flex items-center gap-2 text-lg">
            <FiFileText className="text-purple-500" /> จดหมายข่าว (A4)
          </h2>
          <DndContext
            sensors={sensors}
            onDragEnd={(e) => handleDragEnd(e, "newsletter")}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              <label className="aspect-[3/4] border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-purple-50 transition-all group bg-white dark:bg-zinc-900">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "newsletter")}
                />
                <FiPlus className="text-slate-300 group-hover:text-purple-500" />
                <span className="text-[10px] font-bold text-slate-400 mt-2 text-center px-2">
                  เพิ่มแผ่นจดหมาย
                </span>
              </label>
            </div>
          </DndContext>
        </section>

        {/* 5. ลิงก์ที่เกี่ยวข้อง */}
        <section className="space-y-4">
          <h3 className="text-lg font-black flex items-center gap-2">
            <FiLink className="text-blue-500" /> ลิงก์ที่เกี่ยวข้อง
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              placeholder="ชื่อปุ่ม (เช่น อ่านเพิ่มเติม)"
              value={currentLink.label}
              onChange={(e) =>
                setCurrentLink({ ...currentLink, label: e.target.value })
              }
              className="w-full bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs outline-none"
            />
            <input
              placeholder="https://..."
              value={currentLink.url}
              onChange={(e) =>
                setCurrentLink({ ...currentLink, url: e.target.value })
              }
              className="w-full bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs outline-none text-blue-500"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              if (currentLink.label && currentLink.url) {
                setLinks([...links, currentLink]);
                setCurrentLink({ label: "", url: "" });
              }
            }}
            className="w-full bg-blue-50 text-blue-600 dark:bg-blue-900/20 py-4 rounded-2xl text-[11px] font-black hover:bg-blue-100 transition-all"
          >
            เพิ่มลิงก์
          </button>
        </section>

        {/* 6. วิดีโอ YouTube */}
        <section className="space-y-4">
          <h3 className="text-lg font-black flex items-center gap-2">
            <FiYoutube className="text-red-500" /> วิดีโอ YouTube
          </h3>
          <textarea
            placeholder="วาง <iframe> code"
            value={currentEmbed}
            onChange={(e) => setCurrentEmbed(e.target.value)}
            className="w-full bg-white dark:bg-zinc-900 p-4 rounded-2xl text-xs border border-slate-200 dark:border-zinc-800 h-28 outline-none"
          />
          <button
            type="button"
            onClick={() => {
              if (currentEmbed.includes("<iframe")) {
                setVideoEmbeds([...videoEmbeds, currentEmbed]);
                setCurrentEmbed("");
              }
            }}
            className="w-full bg-red-50 text-red-600 dark:bg-red-900/20 py-4 rounded-2xl text-[11px] font-black hover:bg-red-100 transition-all"
          >
            เพิ่มวิดีโอ
          </button>
        </section>

        {/* 7. ยืนยันและเผยแพร่ */}
        <section className="pt-10 border-t border-slate-200 dark:border-zinc-800">
          <button
            onClick={handleSubmit}
            disabled={isLoading || isCompressing}
            className={`w-full py-6 rounded-[2.5rem] font-black text-xl transition-all flex items-center justify-center gap-4 ${isLoading || isCompressing ? "bg-slate-200 text-slate-400" : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl"}`}
          >
            {isLoading ? (
              "กำลังบันทึก..."
            ) : (
              <>
                <FiCheckCircle size={28} /> ยืนยันและเผยแพร่ข่าวสาร
              </>
            )}
          </button>
        </section>
      </main>

      {isCompressing && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] bg-indigo-600 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-4 animate-bounce">
          <span className="text-sm font-black italic">
            กำลังเตรียมรูปภาพ...
          </span>
        </div>
      )}
    </div>
  );
}
