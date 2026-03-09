"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_2 = require("@heroui/react");
var image_1 = require("@heroui/image");
var framer_motion_1 = require("framer-motion");
var icons_1 = require("@ant-design/icons"); // ใช้ Icon จาก Ant Design (หรือเปลี่ยนตามที่คุณมี)
// 1. รวมข้อมูล Page ทั้งหมดไว้ที่นี่ (เพิ่ม/ลบ ได้ง่ายๆ)
var facebookPages = [
    "https://www.facebook.com/profile.php?id=100088379594921",
    "https://www.facebook.com/profile.php?id=61567041267941",
    "https://www.facebook.com/profile.php?id=100065239134417",
    "https://www.facebook.com/ktltc.ac.th.en",
    "https://www.facebook.com/profile.php?id=100068997166818",
    "https://www.facebook.com/profile.php?id=100057195379923&mibextid=ZbWKwL",
    "https://www.facebook.com/profile.php?id=100063483313526",
];
function ShowFacebook() {
    // Helper สำหรับสร้าง URL iframe
    var getIframeSrc = function (pageUrl) {
        var encodedUrl = encodeURIComponent(pageUrl);
        return "https://www.facebook.com/plugins/page.php?href=" + encodedUrl + "&tabs=timeline&width=340&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId";
    };
    return (react_1["default"].createElement("section", { className: "rounded-3xl px-2 bg-slate-50/50 py-12 font-sans dark:bg-neutral-950" },
        react_1["default"].createElement(framer_motion_1.motion.div, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease: "easeOut" }, className: "" },
            react_1["default"].createElement("div", { className: "mb-8  flex flex-col items-center justify-center gap-3 text-center" },
                react_1["default"].createElement(framer_motion_1.motion.div, { whileHover: { scale: 1.1, rotate: 10 }, className: "rounded-full bg-white p-2 shadow-md dark:bg-neutral-800" },
                    react_1["default"].createElement(image_1.Image, { src: "/images/icon/facebook-svgrepo-com.svg", alt: "Facebook Logo", width: 64, height: 64, className: "h-16 w-16" })),
                react_1["default"].createElement("div", null,
                    react_1["default"].createElement("h1", { className: "text-3xl font-extrabold text-slate-800 dark:text-slate-100" },
                        "\u0E15\u0E34\u0E14\u0E15\u0E32\u0E21\u0E02\u0E48\u0E32\u0E27\u0E2A\u0E32\u0E23 ",
                        react_1["default"].createElement("span", { className: "text-[#1877F2]" }, "Facebook")),
                    react_1["default"].createElement("p", { className: "text-slate-500 dark:text-slate-400" }, "\u0E2D\u0E31\u0E1B\u0E40\u0E14\u0E15\u0E01\u0E34\u0E08\u0E01\u0E23\u0E23\u0E21\u0E41\u0E25\u0E30\u0E04\u0E27\u0E32\u0E21\u0E40\u0E04\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E44\u0E2B\u0E27\u0E25\u0E48\u0E32\u0E2A\u0E38\u0E14\u0E08\u0E32\u0E01\u0E40\u0E1E\u0E08\u0E02\u0E2D\u0E07\u0E40\u0E23\u0E32"))),
            react_1["default"].createElement("div", { className: "" },
                react_1["default"].createElement(react_2.Accordion, { variant: "splitted", className: "px-0" },
                    react_1["default"].createElement(react_2.AccordionItem, { key: "1", "aria-label": "Facebook Feeds", className: "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900", indicator: react_1["default"].createElement(icons_1.CaretDownOutlined, { className: "text-[#1877F2]" }), title: react_1["default"].createElement("div", { className: "flex items-center gap-3 py-2" },
                            react_1["default"].createElement("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-[#1877F2] dark:bg-blue-900/20" },
                                react_1["default"].createElement(icons_1.FacebookFilled, { style: { fontSize: "20px" } })),
                            react_1["default"].createElement("div", { className: "flex flex-col text-left" },
                                react_1["default"].createElement("span", { className: "text-lg font-bold text-slate-700 dark:text-slate-200" }, "\u0E23\u0E27\u0E21\u0E40\u0E1E\u0E08\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E07\u0E32\u0E19"),
                                react_1["default"].createElement("span", { className: "text-xs text-slate-400" }, "\u0E04\u0E25\u0E34\u0E01\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E14\u0E39/\u0E0B\u0E48\u0E2D\u0E19 \u0E01\u0E23\u0E30\u0E14\u0E32\u0E19\u0E02\u0E48\u0E32\u0E27"))) },
                        react_1["default"].createElement("div", { className: "bg-slate-50 p-4 sm:p-8 dark:bg-neutral-950/50" },
                            react_1["default"].createElement("div", { className: "grid grid-cols-1 justify-items-center gap-8 md:grid-cols-2 xl:grid-cols-3" }, facebookPages.map(function (url, index) { return (react_1["default"].createElement(framer_motion_1.motion.div, { key: index, initial: { opacity: 0, scale: 0.9 }, whileInView: { opacity: 1, scale: 1 }, transition: { delay: index * 0.1 }, className: "group relative flex h-[500px] w-full max-w-[340px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-xl dark:bg-neutral-800" },
                                react_1["default"].createElement("div", { className: "absolute inset-0 flex animate-pulse items-center justify-center bg-slate-100 dark:bg-neutral-800" },
                                    react_1["default"].createElement("span", { className: "text-slate-300" }, "Loading Feed...")),
                                react_1["default"].createElement("iframe", { src: getIframeSrc(url), width: "340", height: "500", className: "relative z-10 border-none", scrolling: "no", frameBorder: "0", allowFullScreen: true, allow: "autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share", style: { border: "none", overflow: "hidden" } }),
                                react_1["default"].createElement("div", { className: "pointer-events-none absolute inset-0 rounded-xl border-2 border-[#1877F2] opacity-0 transition-opacity duration-300 group-hover:opacity-100" }))); })))))))));
}
exports["default"] = ShowFacebook;
