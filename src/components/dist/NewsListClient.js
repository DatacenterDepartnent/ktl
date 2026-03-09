"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var link_1 = require("next/link");
var image_1 = require("next/image");
// --- Configuration ---
var FILTER_CATEGORIES = [
    { value: "All", label: "ทุกหมวดหมู่" },
    { value: "PR", label: "ข่าวประชาสัมพันธ์" },
    { value: "Newsletter", label: "จดหมายข่าว" },
    { value: "Internship", label: "ฝึกประสบการณ์" },
    { value: "Announcement", label: "ข่าวประกาศ" },
    { value: "Bidding", label: "ประกวดราคา" },
    { value: "Order", label: "คำสั่งวิทยาลัย" },
];
var MONTHS = [
    { value: "All", label: "ทุกเดือน" },
    { value: "0", label: "มกราคม" },
    { value: "1", label: "กุมภาพันธ์" },
    { value: "2", label: "มีนาคม" },
    { value: "3", label: "เมษายน" },
    { value: "4", label: "พฤษภาคม" },
    { value: "5", label: "มิถุนายน" },
    { value: "6", label: "กรกฎาคม" },
    { value: "7", label: "สิงหาคม" },
    { value: "8", label: "กันยายน" },
    { value: "9", label: "ตุลาคม" },
    { value: "10", label: "พฤศจิกายน" },
    { value: "11", label: "ธันวาคม" },
];
// URL Redirect ปีเก่า
var REDIRECT_URLS = {
    "2566": "https://ktltcv1.vercel.app/pressrelease/2566",
    "2567": "https://ktltcv1.vercel.app/pressrelease/2567",
    "2568": "https://ktltcv3.vercel.app/pressrelease/2568"
};
// ✅ 1. เพิ่มฟังก์ชัน getGridClass ตามที่คุณต้องการ
function getGridClass(count) {
    if (count === 1)
        return "grid-cols-1";
    if (count === 2)
        return "grid-cols-1 md:grid-cols-2";
    // ปรับให้รองรับได้ถึง 4 คอลัมน์ตามจำนวนข่าวที่มี
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
}
function NewsListClient(_a) {
    var _b = _a.initialNews, initialNews = _b === void 0 ? [] : _b;
    var _c = react_1.useState("All"), selectedCategory = _c[0], setSelectedCategory = _c[1];
    var _d = react_1.useState("All"), selectedMonth = _d[0], setSelectedMonth = _d[1];
    var _e = react_1.useState("All"), selectedYear = _e[0], setSelectedYear = _e[1];
    var _f = react_1.useState(12), visibleCount = _f[0], setVisibleCount = _f[1];
    // --- Redirect Logic ---
    react_1.useEffect(function () {
        if (REDIRECT_URLS[selectedYear]) {
            var confirmMsg = "\u0E04\u0E38\u0E13\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E14\u0E39\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1B\u0E35 " + selectedYear + "\n\u0E23\u0E30\u0E1A\u0E1A\u0E08\u0E30\u0E1E\u0E32\u0E04\u0E38\u0E13\u0E44\u0E1B\u0E22\u0E31\u0E07\u0E40\u0E27\u0E47\u0E1A\u0E44\u0E0B\u0E15\u0E4C\u0E40\u0E27\u0E2D\u0E23\u0E4C\u0E0A\u0E31\u0E19\u0E40\u0E01\u0E48\u0E32 \u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E14\u0E33\u0E40\u0E19\u0E34\u0E19\u0E01\u0E32\u0E23\u0E15\u0E48\u0E2D\u0E2B\u0E23\u0E37\u0E2D\u0E44\u0E21\u0E48?";
            if (window.confirm(confirmMsg)) {
                window.open(REDIRECT_URLS[selectedYear], "_blank");
            }
            setSelectedYear("All");
        }
    }, [selectedYear]);
    // --- Filter Logic ---
    var availableYears = react_1.useMemo(function () {
        var years = new Set();
        initialNews.forEach(function (news) {
            var year = new Date(news.createdAt).getFullYear() + 543;
            years.add(year.toString());
        });
        years.add("2566");
        years.add("2567");
        years.add("2568");
        return Array.from(years).sort(function (a, b) { return b.localeCompare(a); });
    }, [initialNews]);
    var filteredNews = react_1.useMemo(function () {
        var result = Array.isArray(initialNews) ? initialNews : [];
        if (selectedCategory !== "All") {
            result = result.filter(function (news) {
                var cats = news.categories || (news.category ? [news.category] : []);
                return cats.includes(selectedCategory);
            });
        }
        if (selectedYear !== "All" && !REDIRECT_URLS[selectedYear]) {
            result = result.filter(function (news) {
                var year = new Date(news.createdAt).getFullYear() + 543;
                return year.toString() === selectedYear;
            });
        }
        if (selectedMonth !== "All") {
            result = result.filter(function (news) {
                var month = new Date(news.createdAt).getMonth();
                return month.toString() === selectedMonth;
            });
        }
        return result;
    }, [initialNews, selectedCategory, selectedMonth, selectedYear]);
    var paginatedNews = filteredNews.slice(0, visibleCount);
    var handleLoadMore = function () { return setVisibleCount(function (prev) { return prev + 12; }); }; // โหลดเพิ่มทีละ 12 (ลงตัวกับ 2, 3, 4)
    return (React.createElement("div", { className: "w-full" },
        React.createElement("div", { className: "mb-16 bg-white/70 backdrop-blur-xl p-3 md:p-4 rounded-[2.5rem] border border-slate-200/60 top-24 z-20 shadow-xl shadow-slate-200/30 dark:bg-slate-900/80 dark:border-slate-700 dark:shadow-black/40" },
            React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3" },
                React.createElement("div", { className: "relative group" },
                    React.createElement("select", { value: selectedCategory, onChange: function (e) {
                            setSelectedCategory(e.target.value);
                            setVisibleCount(12);
                        }, className: "w-full bg-white border-none rounded-full px-6 py-4 text-sm font-bold text-slate-700 appearance-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all shadow-sm group-hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:group-hover:bg-slate-700" }, FILTER_CATEGORIES.map(function (cat) { return (React.createElement("option", { key: cat.value, value: cat.value }, cat.label)); })),
                    React.createElement("div", { className: "absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500" },
                        React.createElement("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                            React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 3, d: "M19 9l-7 7-7-7" })))),
                React.createElement("div", { className: "relative group" },
                    React.createElement("select", { value: selectedYear, onChange: function (e) {
                            setSelectedYear(e.target.value);
                            setVisibleCount(12);
                        }, className: "w-full bg-white border-none rounded-full px-6 py-4 text-sm font-bold text-slate-700 appearance-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all shadow-sm group-hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:group-hover:bg-slate-700" },
                        React.createElement("option", { value: "All" }, "\u0E17\u0E38\u0E01\u0E1B\u0E35 \u0E1E.\u0E28."),
                        availableYears.map(function (year) { return (React.createElement("option", { key: year, value: year },
                            "\u0E1E.\u0E28. ",
                            year,
                            " ",
                            REDIRECT_URLS[year] ? "🔗" : "")); })),
                    React.createElement("div", { className: "absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500" },
                        React.createElement("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                            React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 3, d: "M19 9l-7 7-7-7" })))),
                React.createElement("div", { className: "relative group" },
                    React.createElement("select", { value: selectedMonth, onChange: function (e) {
                            setSelectedMonth(e.target.value);
                            setVisibleCount(12);
                        }, className: "w-full bg-white border-none rounded-full px-6 py-4 text-sm font-bold text-slate-700 appearance-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all shadow-sm group-hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:group-hover:bg-slate-700" }, MONTHS.map(function (m) { return (React.createElement("option", { key: m.value, value: m.value }, m.label)); })),
                    React.createElement("div", { className: "absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500" },
                        React.createElement("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                            React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 3, d: "M19 9l-7 7-7-7" })))))),
        paginatedNews.length > 0 ? (
        // ✅ 2. ใช้ฟังก์ชัน getGridClass ที่นี่ เพื่อปรับ Column ตามจำนวนข่าวที่แสดง
        React.createElement("div", { className: "grid gap-8 md:gap-10 " + getGridClass(paginatedNews.length) }, paginatedNews.map(function (news) {
            var _a, _b;
            var coverImage = ((_a = news.announcementImages) === null || _a === void 0 ? void 0 : _a[0]) || ((_b = news.images) === null || _b === void 0 ? void 0 : _b[0]) ||
                "/no-image.png";
            var displayCategories = news.categories && news.categories.length > 0
                ? news.categories
                : news.category
                    ? [news.category]
                    : ["General"];
            return (React.createElement(link_1["default"], { key: news._id, href: "/news/" + news._id, className: "group flex flex-col bg-white dark:bg-zinc-900/50 rounded-3xl overflow-hidden border border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300" },
                React.createElement("div", { className: "relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-zinc-800" },
                    React.createElement(image_1["default"], { src: coverImage, alt: news.title, fill: true, sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw", className: "object-cover transition-transform duration-700 ease-out group-hover:scale-105" }),
                    React.createElement("div", { className: "absolute top-4 left-4 flex flex-wrap gap-2 max-w-[90%]" }, displayCategories.map(function (cat, index) { return (React.createElement("span", { key: index, className: "px-3 py-1.5 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm border border-slate-100 dark:border-slate-800" }, cat)); })),
                    React.createElement("div", { className: "absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" })),
                React.createElement("div", { className: "px-6 py-8 flex flex-col flex-1" },
                    React.createElement("div", { className: "flex items-center gap-4 mb-5" },
                        React.createElement("div", { className: "h-px w-10 bg-blue-600/30 group-hover:w-16 transition-all duration-700 ease-in-out dark:bg-blue-500/50" }),
                        React.createElement("span", { className: "text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] dark:text-slate-500" }, new Date(news.createdAt).toLocaleDateString("th-TH", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                        }))),
                    React.createElement("h3", { className: "text-xl font-bold text-slate-800 line-clamp-2 leading-[1.35] group-hover:text-blue-600 transition-colors duration-300 dark:text-slate-100 dark:group-hover:text-blue-400" }, news.title),
                    React.createElement("p", { className: "mt-4 text-slate-500 text-sm leading-relaxed line-clamp-2 font-medium opacity-70 dark:text-slate-400" }, "\u0E04\u0E25\u0E34\u0E01\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E2D\u0E48\u0E32\u0E19\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E01\u0E34\u0E08\u0E01\u0E23\u0E23\u0E21\u0E41\u0E25\u0E30\u0E04\u0E27\u0E32\u0E21\u0E40\u0E04\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E44\u0E2B\u0E27\u0E17\u0E35\u0E48\u0E40\u0E01\u0E34\u0E14\u0E02\u0E36\u0E49\u0E19\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E04\u0E23\u0E1A\u0E16\u0E49\u0E27\u0E19..."),
                    React.createElement("div", { className: "mt-auto pt-8 border-t border-slate-100 flex items-center justify-between dark:border-slate-800" },
                        React.createElement("span", { className: "text-[11px] font-black text-slate-900 uppercase tracking-widest group-hover:text-blue-600 transition-all duration-300 transform group-hover:translate-x-2 dark:text-slate-300 dark:group-hover:text-blue-400" }, "\u0E2D\u0E48\u0E32\u0E19\u0E1A\u0E17\u0E04\u0E27\u0E32\u0E21\u0E09\u0E1A\u0E31\u0E1A\u0E40\u0E15\u0E47\u0E21"),
                        React.createElement("div", { className: "w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all duration-500 dark:border-slate-700 dark:group-hover:bg-blue-500 dark:group-hover:border-blue-500" },
                            React.createElement("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M17 8l4 4m0 0l-4 4m4-4H3" })))))));
        }))) : (React.createElement("div", { className: "py-48 text-center flex flex-col items-center" },
            React.createElement("div", { className: "w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8 border border-slate-100 dark:bg-slate-800 dark:border-slate-700" },
                React.createElement("span", { className: "text-5xl opacity-20" }, "\uD83D\uDCC2")),
            React.createElement("h4", { className: "text-xl font-bold text-slate-800 tracking-tight dark:text-slate-200" }, "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E35\u0E48\u0E04\u0E38\u0E13\u0E04\u0E49\u0E19\u0E2B\u0E32"),
            React.createElement("p", { className: "text-slate-400 mt-2 font-medium dark:text-slate-500" }, "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E25\u0E2D\u0E07\u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E40\u0E07\u0E37\u0E48\u0E2D\u0E19\u0E44\u0E02\u0E01\u0E32\u0E23\u0E01\u0E23\u0E2D\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E43\u0E2B\u0E21\u0E48"),
            React.createElement("button", { onClick: function () {
                    setSelectedCategory("All");
                    setSelectedMonth("All");
                    setSelectedYear("All");
                }, className: "mt-8 text-blue-600 text-xs font-black uppercase tracking-widest hover:text-blue-800 transition-colors underline decoration-2 underline-offset-8 dark:text-blue-400 dark:hover:text-blue-300" }, "Reset Filters"))),
        filteredNews.length > visibleCount && (React.createElement("div", { className: "flex flex-col items-center justify-center mt-24 space-y-6" },
            React.createElement("button", { onClick: handleLoadMore, className: "group relative px-16 py-5 bg-slate-900 text-white rounded-full font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl hover:bg-blue-600 transition-all duration-500 active:scale-95 dark:bg-slate-800 dark:hover:bg-blue-600" }, "Load More Stories"),
            React.createElement("p", { className: "text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] dark:text-slate-500" },
                filteredNews.length - visibleCount,
                " \u0E40\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E23\u0E32\u0E27\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E40\u0E15\u0E34\u0E21\u0E43\u0E19\u0E1F\u0E35\u0E14")))));
}
exports["default"] = NewsListClient;
