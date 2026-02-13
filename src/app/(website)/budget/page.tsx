"use client";

import React, { useState } from "react";
import Link from "next/link";

// --- ไอคอนดาวน์โหลด ---
const DownloadIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </svg>
);

// --- ข้อมูลจำลอง ---
// ⚠️ หมายเหตุ: แก้ไขชื่อไฟล์ใน `pdfUrl` ให้ตรงกับชื่อไฟล์จริงที่มีในโฟลเดอร์ public/pdf/budget/
const budgetData = {
  "2566": {
    title: "สรุปผลการใช้จ่ายเงิน ปีงบประมาณ พ.ศ. 2566",
    pdfUrl: "/pdf/budget/2566.pdf",
    categories: [
      {
        name: "งบบุคลากร",
        amount: "20,731,671",
        color:
          "bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/50",
      },
      {
        name: "งบดำเนินงาน",
        amount: "15,820,874",
        color:
          "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800/50",
      },
      {
        name: "งบลงทุน",
        amount: "21,000,000",
        color:
          "bg-purple-50 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800/50",
      },
      {
        name: "งบเงินอุดหนุน",
        amount: "15,421,861",
        color:
          "bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800/50",
      },
      {
        name: "งบรายจ่ายอื่น",
        amount: "2,005,550",
        color:
          "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800/50",
      },
    ],
    highlights: [
      "โครงการสนับสนุนค่าใช้จ่ายในการจัดการศึกษาตั้งแต่ระดับอนุบาลจนจบการศึกษาขั้นพื้นฐาน (ค่าเครื่องแบบ, ค่าอุปกรณ์, ค่าหนังสือ)",
      "โครงการตามกิจกรรมวิชาการ และกิจกรรมส่งเสริมคุณธรรมจริยธรรม",
      "โครงการบูรณาการพัฒนาทักษะทางวิชาชีพกับการเสริมสร้างคุณลักษณะอันพึงประสงค์ (Fix it Center) 720,000 บาท",
    ],
  },
  "2567": {
    title: "สรุปผลการใช้จ่ายเงิน ปีงบประมาณ พ.ศ. 2567",
    pdfUrl: "/pdf/budget/2567.pdf",
    categories: [
      {
        name: "งบบุคลากร",
        amount: "22,914,343",
        color:
          "bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/50",
      },
      {
        name: "งบดำเนินงาน",
        amount: "16,923,835",
        color:
          "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800/50",
      },
      {
        name: "งบลงทุน (สิ่งก่อสร้าง/ครุภัณฑ์)",
        amount: "2,630,000",
        color:
          "bg-purple-50 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800/50",
      },
      {
        name: "งบเงินอุดหนุน",
        amount: "9,653,176",
        color:
          "bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800/50",
      },
      {
        name: "งบรายจ่ายอื่น",
        amount: "5,038,516",
        color:
          "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800/50",
      },
    ],
    highlights: [
      "โครงการสนับสนุนค่าใช้จ่ายในการจัดการศึกษา (ค่าหนังสือ 4,421,000 บาท, ค่าเครื่องแบบ 1,309,100 บาท)",
      "โครงการเพิ่มประสิทธิภาพการบริหารจัดการศึกษา ระดับอาชีวศึกษา (จัดหาครูจ้าง) 330,132 บาท",
      "โครงการจัดการศึกษาเรียนร่วมหลักสูตรอาชีวศึกษาและมัธยมศึกษาตอนปลาย (ทวิศึกษา) 622,360 บาท",
    ],
  },
  "2568": {
    title: "สรุปผลการใช้จ่ายเงิน ปีงบประมาณ พ.ศ. 2568",
    pdfUrl: "/pdf/budget/2568.pdf",
    categories: [
      {
        name: "งบบุคลากร",
        amount: "รอการตรวจสอบ",
        color:
          "bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/50",
      },
      {
        name: "งบดำเนินงาน",
        amount: "รอการตรวจสอบ",
        color:
          "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800/50",
      },
      {
        name: "งบลงทุน",
        amount: "3,200,000",
        color:
          "bg-purple-50 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800/50",
      },
      {
        name: "งบเงินอุดหนุน",
        amount: "รอการตรวจสอบ",
        color:
          "bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800/50",
      },
      {
        name: "งบรายจ่ายอื่น",
        amount: "3,388,994",
        color:
          "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800/50",
      },
    ],
    highlights: [
      "โครงการเร่งประสิทธิภาพการสอนครูอาชีวศึกษา 625,100 บาท",
      "โครงการพัฒนาศูนย์รับผู้เรียนอาชีวศึกษา 300,000 บาท",
      "โครงการบูรณาการพัฒนาทักษะทางวิชาชีพกับการเสริมสร้างคุณลักษณะอันพึงประสงค์ 1,265,000 บาท",
    ],
  },
};

export default function BudgetPage() {
  const [activeTab, setActiveTab] = useState<"2566" | "2567" | "2568" | "plan">(
    "2567",
  );

  return (
    <div className="min-h-screen bg-transparent py-10 px-4 sm:px-6 lg:px-8 font-sans selection:bg-blue-500 selection:text-white">
      <div className="max-w-7xl mx-auto">
        {/* --- Header --- */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            แผนปฏิบัติราชการและแผนใช้จ่ายเงินงบประมาณ
          </h1>
          <p className="mt-3 text-xl text-slate-500 dark:text-slate-400">
            วิทยาลัยเทคนิคกันทรลักษ์ จังหวัดศรีสะเกษ
          </p>
        </div>

        {/* --- Tabs --- */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-1.5 inline-flex space-x-1 flex-wrap justify-center">
            {(["2566", "2567", "2568", "plan"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 m-1 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-blue-600 text-white shadow-md transform scale-105"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {tab === "plan" ? "ปฏิทินแผนปี 2567" : `ปีงบประมาณ ${tab}`}
              </button>
            ))}
          </div>
        </div>

        {/* --- Content Area --- */}
        <div className="bg-white dark:bg-slate-900 shadow-xl rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors duration-300">
          {activeTab !== "plan" ? (
            <div className="p-6 sm:p-10">
              {/* Title & Download Button */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-slate-200 dark:border-slate-700 pb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  {budgetData[activeTab].title}
                </h2>
                <a
                  href={budgetData[activeTab].pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
                >
                  <DownloadIcon />
                  โหลดเอกสาร (PDF)
                </a>
              </div>

              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-4">
                ภาพรวมรายจ่ายตามงบประมาณ (หน่วย: บาท)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                {budgetData[activeTab].categories.map((cat, index) => (
                  <div
                    key={index}
                    className={`p-5 rounded-2xl border ${cat.color} transition-all hover:-translate-y-1 hover:shadow-md`}
                  >
                    <p className="text-sm font-semibold opacity-80 mb-2">
                      {cat.name}
                    </p>
                    <p className="text-2xl md:text-3xl font-black">
                      {cat.amount}
                    </p>
                  </div>
                ))}
              </div>

              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-4">
                โครงการที่สำคัญ / ไฮไลท์การใช้จ่าย
              </h3>
              <ul className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                {budgetData[activeTab].highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="h-6 w-6 text-emerald-500 mr-3 shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {highlight}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="p-6 sm:p-10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-slate-200 dark:border-slate-700 pb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  ปฏิทินการปฏิบัติราชการและแผนใช้จ่ายเงิน ปีงบประมาณ 2567
                </h2>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                  <thead className="bg-slate-50 dark:bg-slate-800">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-sm font-bold text-slate-600 dark:text-slate-300"
                      >
                        หมวดหมู่ / โครงการ
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-right text-sm font-bold text-slate-600 dark:text-slate-300"
                      >
                        งบประมาณที่ใช้ (บาท)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800/50">
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-slate-900 dark:text-white">
                        รวมทั้งสิ้นเป็นเงินงบประมาณ
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-right font-black text-blue-600 dark:text-blue-400">
                        8,631,457
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400 pl-10">
                        - งบดำเนินงาน (ค่าตอบแทน, ใช้สอย, วัสดุ, สาธารณูปโภค)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-slate-800 dark:text-slate-200">
                        4,605,700
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-slate-900 dark:text-white">
                        โครงการตามภาระงานสถานศึกษา
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-right font-black text-blue-600 dark:text-blue-400">
                        6,191,767
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400 pl-10">
                        - โครงการตามกิจกรรมวิชาการ (ฝ่ายวิชาการ)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-slate-800 dark:text-slate-200">
                        1,687,300
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400 pl-10">
                        - โครงการส่งเสริมคุณธรรมจริยธรรม (ฝ่ายพัฒนาฯ)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-slate-800 dark:text-slate-200">
                        2,292,236
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400 pl-10">
                        - โครงการพัฒนาสถานศึกษาสำรองฉุกเฉิน
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-slate-800 dark:text-slate-200">
                        2,012,231
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-slate-900 dark:text-white">
                        โครงการพิเศษ (ไม่ใช้เงิน สอศ สถานศึกษา)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-right font-black text-blue-600 dark:text-blue-400">
                        45,000
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
