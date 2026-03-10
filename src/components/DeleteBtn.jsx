// "use client";

// import { useState, useEffect } from "react";
// import { HiOutlineTrash } from "react-icons/hi";
// import { useRouter } from "next/navigation";
// import { CgSpinner } from "react-icons/cg";

// // 1. เพิ่ม prop 'title' เพื่อเอาไว้บันทึกใน Log
// const DeleteBtn = ({ id, title }) => {
//   const router = useRouter();
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [currentUser, setCurrentUser] = useState("Unknown User");

//   // 2. ดึงข้อมูลผู้ใช้งานปัจจุบัน (เพื่อใส่ใน Log ว่าใครเป็นคนลบ)
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await fetch("/api/profile");
//         if (res.ok) {
//           const userData = await res.json();
//           setCurrentUser(userData.name || userData.user?.name || "Admin");
//         }
//       } catch (err) {
//         console.error("Fetch user error:", err);
//       }
//     };
//     fetchUser();
//   }, []);

//   const handleDelete = async (e) => {
//     e.stopPropagation();

//     const confirmed = window.confirm(
//       `คุณแน่ใจหรือไม่ว่าต้องการลบข่าว: "${title}"?\n\n⚠️ การกระทำนี้ไม่สามารถยกเลิกได้`,
//     );

//     if (!confirmed) return;

//     setIsDeleting(true);

//     try {
//       // --- ส่วนที่ 1: ลบข้อมูลข่าว ---
//       const res = await fetch(`/api/news?id=${id}`, {
//         // เปลี่ยนเป็น /api/news ตามโครงสร้างคุณ
//         method: "DELETE",
//       });

//       if (!res.ok) throw new Error("เกิดข้อผิดพลาดในการลบข้อมูล");

//       // --- ส่วนที่ 2: บันทึก Log การลบ (Delete Log) ---
//       await fetch("/api/admin/logs", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userName: currentUser,
//           action: "DELETE_POST",
//           details: `ลบข่าวประชาสัมพันธ์หัวข้อ: "${title}" (ID: ${id})`,
//         }),
//       });

//       router.refresh();
//     } catch (error) {
//       console.error("❌ Error:", error.message);
//       alert(`ลบข้อมูลไม่สำเร็จ: ${error.message}`);
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   return (
//     <button
//       onClick={handleDelete}
//       disabled={isDeleting}
//       className={`rounded-lg p-2 transition-all duration-200 ${
//         isDeleting
//           ? "cursor-not-allowed text-gray-400 opacity-50"
//           : "text-red-500 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
//       }`}
//       title="ลบข้อมูล"
//     >
//       {isDeleting ? (
//         <CgSpinner className="animate-spin" size={20} />
//       ) : (
//         <HiOutlineTrash size={20} />
//       )}
//     </button>
//   );
// };

// export default DeleteBtn;
