"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var antd_1 = require("antd");
var framer_motion_1 = require("framer-motion");
var icons_1 = require("@ant-design/icons");
var dayjs_1 = require("dayjs");
require("dayjs/locale/th"); // ถ้าต้องการภาษาไทย
// ตั้งค่า locale เป็นไทย (Optional)
// dayjs.locale('th');
function CalendarPage() {
    var _a = react_1.useState(dayjs_1["default"]()), selectedDate = _a[0], setSelectedDate = _a[1];
    var onPanelChange = function (value, mode) {
        console.log(value.format("YYYY-MM-DD"), mode);
    };
    var onSelect = function (newValue) {
        setSelectedDate(newValue);
    };
    // จำลองข้อมูลกิจกรรม (Events)
    var getListData = function (value) {
        var listData;
        switch (value.date()) {
            case 1:
                listData = [{ type: "warning", content: "วันพระ" }];
                break;
            case 31:
                listData = [{ type: "success", content: "ประชุมวิชาการ" }];
                break;
            default:
        }
        return listData || [];
    };
    // Custom Cell Rendering (แสดงจุดสีเล็กๆ ใต้วันที่มีกิจกรรม)
    var dateCellRender = function (value) {
        var listData = getListData(value);
        return (react_1["default"].createElement("ul", { className: "events m-0 list-none p-0" }, listData.map(function (item) { return (react_1["default"].createElement("li", { key: item.content },
            react_1["default"].createElement(antd_1.Badge, { status: item.type }))); })));
    };
    return (react_1["default"].createElement(antd_1.ConfigProvider, { theme: {
            token: {
                colorPrimary: "#6366f1",
                borderRadius: 12,
                fontFamily: "var(--font-sans)"
            },
            components: {
                Calendar: {
                    fullBg: "#ffffff",
                    itemActiveBg: "#e0e7ff"
                }
            }
        } },
        react_1["default"].createElement("section", { className: "min-h-[500px] px-4 bg-slate-50/50 py-12 font-sans dark:bg-neutral-950" },
            react_1["default"].createElement(framer_motion_1.motion.div, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { delay: 0.2, duration: 0.8, ease: "easeOut" }, className: "" },
                react_1["default"].createElement("div", { className: "flex flex-col items-center justify-center gap-8 lg:flex-row lg:items-start" },
                    react_1["default"].createElement("div", { className: "w-full max-w-md" },
                        react_1["default"].createElement("div", { className: "relative overflow-hidden rounded-3xl bg-white px-2 py-2 shadow-xl ring-1 ring-slate-100 dark:bg-neutral-900 dark:ring-neutral-800" },
                            react_1["default"].createElement("div", { className: "mb-6 flex items-center justify-between border-b border-slate-100 pb-4 dark:border-neutral-800" },
                                react_1["default"].createElement("div", { className: "flex items-center gap-3" },
                                    react_1["default"].createElement("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400" },
                                        react_1["default"].createElement(icons_1.CalendarOutlined, { style: { fontSize: "20px" } })),
                                    react_1["default"].createElement("div", null,
                                        react_1["default"].createElement("h2", { className: "text-lg font-bold text-slate-800 dark:text-slate-100" }, "\u0E1B\u0E0F\u0E34\u0E17\u0E34\u0E19\u0E01\u0E34\u0E08\u0E01\u0E23\u0E23\u0E21"),
                                        react_1["default"].createElement("p", { className: "text-xs text-slate-400" }, "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E14\u0E39\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14")))),
                            react_1["default"].createElement(antd_1.Calendar, { fullscreen: false, onPanelChange: onPanelChange, onSelect: onSelect, cellRender: dateCellRender }))),
                    react_1["default"].createElement("div", { className: "w-full max-w-md " },
                        react_1["default"].createElement("div", { className: "h-full rounded-3xl py-4 bg-white px-4 shadow-lg ring-1 ring-slate-100 dark:bg-neutral-900 dark:ring-neutral-800" },
                            react_1["default"].createElement("h3", { className: "mb-4 text-xl font-bold text-slate-800 dark:text-slate-100" }, "\u0E01\u0E34\u0E08\u0E01\u0E23\u0E23\u0E21\u0E40\u0E14\u0E37\u0E2D\u0E19\u0E19\u0E35\u0E49"),
                            react_1["default"].createElement("div", { className: "space-y-4 " },
                                react_1["default"].createElement("div", { className: "flex gap-4 rounded-r-xl border-l-4 border-indigo-500 bg-slate-50 p-4 dark:bg-neutral-800" },
                                    react_1["default"].createElement("div", null,
                                        react_1["default"].createElement("p", { className: "font-semibold text-slate-700 dark:text-slate-200" }, "No activities."),
                                        react_1["default"].createElement("p", { className: "text-sm text-slate-500" }, "Time Any"))),
                                react_1["default"].createElement("div", { className: "flex gap-4 rounded-r-xl border-l-4 border-orange-400 bg-slate-50 p-4 dark:bg-neutral-800" },
                                    react_1["default"].createElement("div", null,
                                        react_1["default"].createElement("p", { className: "font-semibold text-slate-700 dark:text-slate-200" }, "No activities."),
                                        react_1["default"].createElement("p", { className: "text-sm text-slate-500" }, "Time Any")))))))))));
}
exports["default"] = CalendarPage;
