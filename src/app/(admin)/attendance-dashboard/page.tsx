"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Activity, Users, Clock, AlertTriangle, Calendar } from "lucide-react";
import dynamic from "next/dynamic";

const MapDashboard = dynamic(() => import("@/components/MapDashboard"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 dark:bg-neutral-800 animate-pulse flex items-center justify-center text-slate-400 rounded-2xl">
      กำลังโหลดพื้นที่แผนที่ตรวจสอบพิกัด...
    </div>
  ),
});

export default function AdminAttendanceDashboard() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    // Use local Date to avoid timezone shift on initial render
    const offset = d.getTimezoneOffset();
    d.setMinutes(d.getMinutes() - offset);
    return d.toISOString().split("T")[0];
  });

  const [data, setData] = useState([
    { name: "มาทำงานตรงเวลา", value: 0, color: "#22c55e" },
    { name: "มาสาย", value: 0, color: "#eab308" },
    { name: "ลา / ขาด", value: 0, color: "#ef4444" },
  ]);
  const [markers, setMarkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/attendance/dashboard?date=${selectedDate}&_t=${Date.now()}`,
        );
        const json = await res.json();
        if (json.success) {
          setData(json.data);
          setMarkers(json.markers || []);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [selectedDate]);

  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 py-4 px-2 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row py-4 justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-neutral-100">
              Attendance Dashboard
            </h1>
            <p className="text-gray-500 dark:text-neutral-400">
              ภาพรวมการเข้างานตามวันที่เลือก (Work from Anywhere)
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="pl-11 pr-5 py-2.5 w-full sm:w-auto rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-gray-800 dark:text-neutral-200 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-md hover:shadow-lg font-bold tracking-wide cursor-pointer appearance-none"
              style={{ minWidth: "180px", colorScheme: "light dark" }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Stat Cards */}
          <div className="bg-white dark:bg-neutral-900 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">ยอดตอบกลับ</p>
              <p className="text-2xl font-bold">{total}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-neutral-900 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800 flex items-center space-x-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-xl">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">มาตรงเวลา</p>
              <p className="text-2xl font-bold">{data[0].value}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-neutral-900 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800 flex items-center space-x-4">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 rounded-xl">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">มาสาย</p>
              <p className="text-2xl font-bold">{data[1].value}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-neutral-900 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800 flex items-center space-x-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-xl">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">ลา / ขาด</p>
              <p className="text-2xl font-bold">{data[2].value}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2 bg-white dark:bg-neutral-900 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800 h-96 relative z-0">
            <MapDashboard markers={markers} />
          </div>

          <div className="col-span-1 bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800">
            <h3 className="font-bold text-lg mb-2 dark:text-gray-200">
              สัดส่วนการเข้างานวันนี้
            </h3>
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-400">กำลังโหลด...</p>
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip wrapperClassName="dark:bg-black rounded-lg" />
                    <Legend verticalAlign="bottom" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
            <div className="mt-4 space-y-2">
              {data.map((d, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="flex items-center space-x-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: d.color }}
                    ></span>
                    <span className="text-gray-600 dark:text-gray-300">
                      {d.name}
                    </span>
                  </span>
                  <span className="font-semibold dark:text-white">
                    {d.value} คน
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
