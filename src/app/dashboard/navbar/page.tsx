"use client";

import { useState, useEffect, useCallback } from "react";
import { NavItem } from "@/types/nav";
import Link from "next/link";

export default function ManageNavbar() {
  const [navItems, setNavItems] = useState<NavItem[]>([]);

  // Form States
  const [label, setLabel] = useState("");
  const [path, setPath] = useState("/");
  const [order, setOrder] = useState(0);
  const [parentId, setParentId] = useState("");

  // Edit State
  const [editId, setEditId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNav = useCallback(async () => {
    try {
      const res = await fetch("/api/navbar");
      if (res.ok) {
        const data = await res.json();
        setNavItems(data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }, []);

  useEffect(() => {
    fetchNav();
  }, [fetchNav]);

  const resetForm = () => {
    setLabel("");
    setPath("/");
    setOrder(0);
    setParentId("");
    setEditId(null);
  };

  const handleEdit = (item: NavItem) => {
    setEditId(item._id || null); // ✅ เติม || null
    setLabel(item.label);
    setPath(item.path);
    setOrder(item.order);
    setParentId(item.parentId || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const method = editId ? "PUT" : "POST";
    const bodyData = {
      _id: editId,
      label,
      path,
      order: Number(order),
      parentId: parentId === "" ? null : parentId,
    };

    try {
      const res = await fetch("/api/navbar", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (res.ok) {
        alert(editId ? "แก้ไขเมนูสำเร็จ!" : "บันทึกเมนูสำเร็จ!");
        resetForm();
        fetchNav();
      }
    } catch {
      alert("Error saving data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("ยืนยันลบเมนู?")) {
      const res = await fetch(`/api/navbar/${id}`, { method: "DELETE" });
      if (res.ok) {
        if (editId === id) resetForm();
        fetchNav();
      }
    }
  };

  const parentOptions = navItems.filter((item) => !item.parentId);

  return (
    <div className="max-w-7xl mx-auto  p-4 md:p-8 text-zinc-800 ">
      <div className="">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-zinc-200 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight">
              จัดการเมนู (Navbar)
            </h1>
            <p className="text-zinc-500 mt-1 text-sm md:text-base">
              ตั้งค่าลิงก์และโครงสร้างเมนูบนหัวเว็บ
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm font-bold text-zinc-500 hover:text-blue-600 transition-colors self-start md:self-auto"
          >
            ← กลับ Dashboard
          </Link>
        </div>

        {/* Form Section */}
        <section className="mb-12  p-6 md:p-8 rounded-3xl shadow-sm border border-zinc-200">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-zinc-800">
            {editId ? (
              <>
                <span className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-sm">
                  ✏️
                </span>
                แก้ไขเมนู
              </>
            ) : (
              <>
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm">
                  ➕
                </span>
                เพิ่มเมนูใหม่
              </>
            )}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-zinc-600">
                  ชื่อเมนู (Label)
                </label>
                <input
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className=" p-3 border border-zinc-200 rounded-xl text-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                  placeholder="เช่น หน้าแรก"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-zinc-600">
                  ลิงก์ (Path)
                </label>
                <input
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                  className=" p-3 border border-zinc-200 rounded-xl text-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                  placeholder="เช่น /about"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-zinc-600">
                  ลำดับ (Order)
                </label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className=" p-3 border border-zinc-200 rounded-xl text-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-zinc-600">
                  เมนูหลัก (Parent)
                </label>
                <select
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className=" p-3 border border-zinc-200 rounded-xl text-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm cursor-pointer"
                  disabled={
                    !!editId && navItems.some((i) => i.parentId === editId)
                  }
                >
                  <option value="">-- เป็นเมนูหลัก (Main Menu) --</option>
                  {parentOptions.map(
                    (p) =>
                      p._id !== editId && (
                        <option key={p._id} value={p._id}>
                          {p.label}
                        </option>
                      ),
                  )}
                </select>
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg active:scale-95 ${
                  editId
                    ? "bg-yellow-500 hover:bg-yellow-400 text-white shadow-yellow-200"
                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-200"
                }`}
              >
                {isLoading
                  ? "กำลังประมวลผล..."
                  : editId
                    ? "บันทึกการแก้ไข"
                    : "เพิ่มเมนู"}
              </button>

              {editId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 md:px-8 py-3.5 rounded-xl font-bold bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition-colors"
                >
                  ยกเลิก
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Tree Structure Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-800 mb-6 flex items-center gap-2">
            <span className="text-2xl">🌳</span> โครงสร้างเมนูปัจจุบัน
          </h2>

          <div className="space-y-4">
            {parentOptions.map((parent) => (
              <div
                key={parent._id}
                className={`border rounded-2xl p-4 md:p-5 transition-all duration-300 ${
                  editId === parent._id
                    ? "bg-yellow-50 border-yellow-300 ring-2 ring-yellow-200 shadow-md"
                    : " border-zinc-200 hover:shadow-md"
                }`}
              >
                {/* Parent Row */}
                <div className="flex justify-between items-center mb-3 gap-2">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                      {parent.order}
                    </span>
                    <div className="min-w-0">
                      <span className="font-bold text-zinc-800 text-lg block truncate">
                        {parent.label}
                      </span>
                      <span className="text-xs text-zinc-400 font-mono bg-zinc-100 px-2 py-0.5 rounded hidden md:inline-block">
                        {parent.path}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 md:gap-2 shrink-0">
                    <button
                      onClick={() => handleEdit(parent)}
                      className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="แก้ไข"
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
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(parent._id || "")} // ✅ เติม || ""
                      className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="ลบ"
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
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Children Rows (Fix: Mobile Padding & Icons) */}
                <div className="pl-2 md:pl-11 space-y-2 mt-2">
                  {navItems
                    .filter((c) => c.parentId === parent._id)
                    .map((child) => (
                      <div
                        key={child._id}
                        className={`flex justify-between items-center text-sm p-3 rounded-xl border transition-all ${
                          editId === child._id
                            ? "bg-yellow-100 border-yellow-300 text-yellow-800"
                            : "bg-zinc-50 border-zinc-100 text-zinc-600 hover:border-zinc-300"
                        }`}
                      >
                        <div className="flex items-center gap-2 md:gap-3 overflow-hidden">
                          <span className="text-zinc-300 shrink-0">↳</span>
                          <span className="w-6 h-6 rounded bg-zinc-200 text-zinc-500 flex items-center justify-center font-bold text-[10px] shrink-0">
                            {child.order}
                          </span>
                          <div className="min-w-0 flex flex-col md:block">
                            <span className="font-medium truncate block md:inline">
                              {child.label}
                            </span>
                            <span className="text-[10px] md:text-xs text-zinc-400 font-mono md:ml-2 truncate hidden sm:inline">
                              ({child.path})
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-1 shrink-0 ml-2">
                          <button
                            onClick={() => handleEdit(child)}
                            className="p-1.5 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="แก้ไข"
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
                          </button>
                          <button
                            onClick={() => handleDelete(child._id || "")} // ✅ เติม || ""
                            className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="ลบ"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
