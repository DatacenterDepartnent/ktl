'use client';

import { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Search, 
  RefreshCcw, 
  ShieldCheck, 
  UserCog,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

interface User {
  _id: string;
  username: string;
  name: string;
  role: string;
  department?: string;
}

export default function ManageRolesPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users?_t=" + Date.now());
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      toast.error("โหลดข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const changeRole = async (targetId: string, newRole: string, targetName: string) => {
    try {
      const res = await fetch(`/api/users/${targetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        toast.success(`เปลี่ยนสิทธิ์ ${targetName} เรียบร้อย`);
        fetchData();
      }
    } catch (error) {
      toast.error("เปลี่ยนสิทธิ์ไม่สำเร็จ");
    }
  };

  const changeDepartment = async (targetId: string, newDept: string, targetName: string) => {
    try {
      const res = await fetch(`/api/users/${targetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ department: newDept }),
      });
      if (res.ok) {
        toast.success(`เปลี่ยนสังกัด ${targetName} เรียบร้อย`);
        fetchData();
      }
    } catch (error) {
      toast.error("เปลี่ยนสังกัดไม่สำเร็จ");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // สิทธิ์ที่อนุญาตให้เลือกเปลี่ยนได้ (ห้าม super_admin, editor, admin, director)
  const allowedRoles = [
    { value: 'deputy_resource', label: 'รอง ผอ. (ทรัพยากร)' },
    { value: 'deputy_strategy', label: 'รอง ผอ. (แผนงาน)' },
    { value: 'deputy_activities', label: 'รอง ผอ. (กิจกรรม)' },
    { value: 'deputy_student_affairs', label: 'รอง ผอ. (นักเรียน)' },
    { value: 'teacher', label: 'ครู (TEACHER)' },
    { value: 'hr', label: 'ฝ่ายบุคคล (HR)' },
    { value: 'staff', label: 'เจ้าหน้าที่ (STAFF)' },
    { value: 'janitor', label: 'ภารโรง (JANITOR)' },
    { value: 'user', label: 'ผู้ใช้ทั่วไป (USER)' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 font-sans gap-4">
        <RefreshCcw className="w-10 h-10 text-blue-500 animate-spin" />
        <span className="text-sm font-bold text-slate-400">กำลังโหลดรายชื่อ...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-zinc-950 p-4 md:p-8 font-sans">
      <Toaster position="top-right" />
      
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
             <Link href="/attendance-dashboard" className="p-2 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-slate-200 dark:border-zinc-800 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300">
               <ArrowLeft size={20} />
             </Link>
             <div>
               <h1 className="text-2xl font-black text-slate-800 dark:text-zinc-100 uppercase flex items-center gap-2">
                 <UserCog size={24} className="text-blue-600" />
                 จัดการสิทธิ์บุคลากร
               </h1>
               <p className="text-xs text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-widest">Manage User Roles & Departments</p>
             </div>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="ค้นหาชื่อหรือไอดี..."
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold text-slate-700 dark:text-zinc-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-zinc-800/50 border-b border-slate-200 dark:border-zinc-800 text-[10px] uppercase font-black text-slate-400 dark:text-zinc-500 tracking-widest">
                  <th className="p-6">ชื่อบุคลากร / ชื่อผู้ใช้</th>
                  <th className="p-6">สิทธิ์ที่อนุญาตให้เปลี่ยน</th>
                  <th className="p-6">สังกัด / แผนก</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="p-6">
                      <div className="font-black text-slate-800 dark:text-zinc-100 text-base">{user.name}</div>
                      <div className="text-xs text-blue-500 font-bold opacity-80">@{user.username}</div>
                      <div className="mt-1 text-[10px] font-black uppercase text-slate-600 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded inline-block">
                         ปัจจุบัน: {user.role}
                      </div>
                    </td>
                    <td className="p-6">
                      <select 
                        value={allowedRoles.some(r => r.value === user.role) ? user.role : 'user'}
                        onChange={(e) => changeRole(user._id, e.target.value, user.name)}
                        className="w-full max-w-[200px] bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-2.5 text-xs font-bold text-slate-700 dark:text-zinc-200 outline-none focus:border-blue-500 transition-all cursor-pointer"
                      >
                        {allowedRoles.map((role) => (
                          <option key={role.value} value={role.value}>{role.label}</option>
                        ))}
                      </select>
                    </td>
                      <select 
                        value={user.department || "ไม่มีสังกัด"}
                        onChange={(e) => changeDepartment(user._id, e.target.value, user.name)}
                        className="w-full max-w-[200px] bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-2.5 text-xs font-bold text-slate-700 dark:text-zinc-200 outline-none focus:border-blue-500 transition-all cursor-pointer"
                      >
                        <option value="ไม่มีสังกัด">- ไม่ระบุสังกัด -</option>
                        <option value="ผู้บริหารสถานศึกษา">ผู้บริหารสถานศึกษา</option>
                        <optgroup label="๑. ฝ่ายบริหารทรัพยากร">
                          <option value="งานบริหารงานทั่วไป">งานบริหารงานทั่วไป</option>
                          <option value="งานบริหารและพัฒนาทรัพยากรบุคคล">งานบริหารและพัฒนาทรัพยากรบุคคล</option>
                          <option value="งานการเงิน">งานการเงิน</option>
                          <option value="งานการบัญชี">งานการบัญชี</option>
                          <option value="งานพัสดุ">งานพัสดุ</option>
                          <option value="งานอาคารสถานที่">งานอาคารสถานที่</option>
                          <option value="งานทะเบียน">งานทะเบียน</option>
                          <option value="งานภารโรง">งานภารโรง</option>
                        </optgroup>
                        <optgroup label="๒. ฝ่ายยุทธศาสตร์และแผนงาน">
                          <option value="งานพัฒนายุทธศาสตร์ แผนงาน และงบประมาณ">งานพัฒนายุทธศาสตร์ แผนงาน และงบประมาณ</option>
                          <option value="งานมาตรฐานและการประกันคุณภาพ">งานมาตรฐานและการประกันคุณภาพ</option>
                          <option value="งานศูนย์ดิจิทัลและสื่อสารองค์กร">งานศูนย์ดิจิทัลและสื่อสารองค์กร</option>
                          <option value="งานส่งเสริมการวิจัย นวัตกรรม และสิ่งประดิษฐ์">งานส่งเสริมการวิจัย นวัตกรรม และสิ่งประดิษฐ์</option>
                          <option value="งานส่งเสริมธุรกิจและการเป็นผู้ประกอบการ">งานส่งเสริมธุรกิจและการเป็นผู้ประกอบการ</option>
                          <option value="งานติดตามและประเมินผลการ">งานติดตามและประเมินผลการ</option>
                        </optgroup>
                        <optgroup label="๓. ฝ่ายพัฒนากิจการนักเรียน นักศึกษา">
                          <option value="งานกิจกรรมนักเรียนนักศึกษา">งานกิจกรรมนักเรียนนักศึกษา</option>
                          <option value="งานครูที่ปรึกษาและการแนะแนว">งานครูที่ปรึกษาและการแนะแนว</option>
                          <option value="งานปกครองและความปลอดภัยนักเรียนนักศึกษา">งานปกครองและความปลอดภัยนักเรียนนักศึกษา</option>
                          <option value="งานสวัสดิการนักเรียนนักศึกษา">งานสวัสดิการนักเรียนนักศึกษา</option>
                          <option value="งานโครงการพิเศษและการบริการ">งานโครงการพิเศษและการบริการ</option>
                        </optgroup>
                        <optgroup label="๔. ฝ่ายวิชาการ">
                          <option value="งานพัฒนาหลักสูตรและการจัดการเรียนรู้">งานพัฒนาหลักสูตรและการจัดการเรียนรู้</option>
                          <option value="งานวัดผลและประเมินผล">งานวัดผลและประเมินผล</option>
                          <option value="งานอาชีวศึกษาระบบทวิภาคีและความร่วมมือ">งานอาชีวศึกษาระบบทวิภาคีและความร่วมมือ</option>
                          <option value="งานวิทยบริการและเทคโนโลยีการศึกษา">งานวิทยบริการและเทคโนโลยีการศึกษา</option>
                          <option value="งานการศึกษาพิเศษและความเสมอภาคทางการศึกษา">งานการศึกษาพิเศษและความเสมอภาคทางการศึกษา</option>
                          <option value="งานพัฒนาหลักสูตรสายเทคโนโลยี หรือสายปฏิบัติการ">งานพัฒนาหลักสูตรสายเทคโนโลยี หรือสายปฏิบัติการ</option>
                          <option disabled>──────────</option>
                          <option value="แผนกวิชาช่างยนต์">แผนกวิชาช่างยนต์</option>
                          <option value="แผนกวิชาช่างกลโรงงาน">แผนกวิชาช่างกลโรงงาน</option>
                          <option value="แผนกวิชาช่างเชื่อมโลหะ">แผนกวิชาช่างเชื่อมโลหะ</option>
                          <option value="แผนกวิชาช่างไฟฟ้ากำลัง">แผนกวิชาช่างไฟฟ้ากำลัง</option>
                          <option value="แผนกวิชาช่างอิเล็กทรอนิกส์">แผนกวิชาช่างอิเล็กทรอนิกส์</option>
                          <option value="แผนกวิชาช่างก่อสร้าง">แผนกวิชาช่างก่อสร้าง</option>
                          <option value="แผนกวิชาการบัญชี">แผนกวิชาการบัญชี</option>
                          <option value="แผนกวิชาการตลาด">แผนกวิชาการตลาด</option>
                          <option value="แผนกวิชาเทคโนโลยีธุรกิจดิจิทัล">แผนกวิชาธุรกิจดิจิทัล</option>
                          <option value="แผนกวิชาการโรงแรม">แผนกวิชาการโรงแรม</option>
                        </optgroup>
                      </select>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="p-20 text-center text-slate-300 dark:text-zinc-700">
               <Users size={48} className="mx-auto mb-4 opacity-20" />
               <p className="font-bold">ไม่พบรายชื่อบุคลากร</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
