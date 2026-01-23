"use client";

import { useState, useEffect, useCallback } from "react";
// 1. เรียกใช้ dynamic import สำหรับ Editor
import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css"; // Import CSS ของ Editor
import Link from "next/link";

// โหลด Editor แบบ Dynamic เพื่อไม่ให้พังใน Next.js
const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

interface PageItem {
  _id: string;
  slug: string;
  title: string;
  content: string;
}

export default function ManagePages() {
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); // เก็บเป็น HTML String
  const [pages, setPages] = useState<PageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const fetchPages = useCallback(async () => {
    try {
      const res = await fetch("/api/pages");
      if (res.ok) {
        const data = await res.json();
        setPages(data);
      }
    } catch (error) {
      console.error("Failed to fetch pages:", error);
    }
  }, []);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  // ฟังก์ชันเคลียร์ค่า
  const resetForm = () => {
    setSlug("");
    setTitle("");
    setContent("");
    setEditId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const cleanSlug = slug.replace(/^\//, "");

    const method = editId ? "PUT" : "POST";
    const bodyData = { _id: editId, slug: cleanSlug, title, content };

    try {
      const res = await fetch("/api/pages", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (res.ok) {
        alert("บันทึกหน้าเว็บสำเร็จ!");
        fetchPages();
        resetForm();
      }
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาด");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (p: PageItem) => {
    setEditId(p._id);
    setSlug(p.slug);
    setTitle(p.title);
    setContent(p.content);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto  p-8 text-zinc-800 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-zinc-200">
          <div>
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight">
              จัดการเนื้อหาหน้าเว็บ (Pages)
            </h1>
            <p className="text-zinc-500 mt-1">
              สร้างหน้าเว็บใหม่ด้วย Rich Text Editor
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm font-bold text-zinc-500 hover:text-blue-600 transition-colors"
          >
            ← กลับ Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-zinc-200 h-fit">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2 text-zinc-800">
                {editId ? (
                  <>
                    <span className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-sm">
                      ✏️
                    </span>
                    แก้ไขเนื้อหา
                  </>
                ) : (
                  <>
                    <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm">
                      ➕
                    </span>
                    เพิ่มหน้าใหม่
                  </>
                )}
              </h2>
              {editId && (
                <button
                  onClick={resetForm}
                  className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 px-3 py-1 rounded-full transition-colors"
                >
                  ยกเลิกแก้ไข
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-zinc-600 mb-2">
                    ลิงก์ (Slug)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-zinc-400 font-mono">
                      /
                    </span>
                    <input
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="about"
                      className="w-full bg-white border border-zinc-200 p-3 pl-6 rounded-xl text-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm font-mono text-sm"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-600 mb-2">
                    หัวข้อหน้า (Title)
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="เช่น เกี่ยวกับเรา"
                    className="w-full bg-white border border-zinc-200 p-3 rounded-xl text-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                    required
                  />
                </div>
              </div>

              {/* --- ส่วน Editor --- */}
              <div>
                <label className="block text-sm font-bold text-zinc-600 mb-2">
                  เนื้อหา (Content)
                </label>
                <div className="rounded-xl overflow-hidden border border-zinc-200 shadow-sm">
                  {/* SunEditor ใช้ธีมสีขาวอยู่แล้ว เข้ากับหน้าเว็บได้เลย */}
                  <SunEditor
                    setContents={content}
                    onChange={setContent}
                    height="400px"
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
                        ["fontColor", "hiliteColor"],
                        ["removeFormat"],
                        ["outdent", "indent"],
                        ["align", "horizontalRule", "list", "lineHeight"],
                        ["table", "link", "image", "video"],
                        ["fullScreen", "showBlocks", "codeView"],
                      ],
                      defaultTag: "div",
                      minHeight: "400px",
                      showPathLabel: false,
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg active:scale-95 ${
                  editId
                    ? "bg-yellow-500 hover:bg-yellow-400 text-white shadow-yellow-200"
                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-200"
                }`}
              >
                {isLoading
                  ? "กำลังบันทึก..."
                  : editId
                    ? "บันทึกการแก้ไข"
                    : "บันทึกข้อมูล"}
              </button>
            </form>
          </div>

          {/* List Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">📑</span> รายชื่อหน้าทั้งหมด
            </h2>

            {pages.length > 0 ? (
              <div className="grid gap-4">
                {pages.map((p) => (
                  <div
                    key={p._id}
                    className={`p-5 border rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-300 ${
                      editId === p._id
                        ? "bg-yellow-50 border-yellow-300 ring-2 ring-yellow-200 shadow-md"
                        : "bg-white border-zinc-200 hover:shadow-lg hover:-translate-y-1"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-blue-600 text-lg flex items-center gap-1">
                        <span className="text-zinc-400 font-normal text-sm">
                          /
                        </span>
                        {p.slug}
                      </div>
                      <div className="text-zinc-500 font-medium mt-1">
                        {p.title}
                      </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                      <button
                        onClick={() => handleEdit(p)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-zinc-50 hover:bg-white hover:text-blue-600 border border-zinc-200 hover:border-blue-200 px-4 py-2 rounded-lg text-sm font-bold text-zinc-600 transition-all shadow-sm"
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        แก้ไข
                      </button>
                      <Link
                        href={`/${p.slug}`}
                        target="_blank"
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
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
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                        ดูหน้าเว็บ
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-zinc-200 rounded-3xl bg-white">
                <div className="text-4xl mb-4 opacity-50">📄</div>
                <h3 className="text-lg font-bold text-zinc-600">
                  ยังไม่มีข้อมูลหน้าเว็บ
                </h3>
                <p className="text-zinc-400 text-sm">
                  เริ่มสร้างหน้าแรกของคุณได้เลย
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
