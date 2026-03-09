"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var next_themes_1 = require("next-themes");
function ThemeToggle() {
    var _a = next_themes_1.useTheme(), theme = _a.theme, setTheme = _a.setTheme;
    var _b = react_1.useState(false), mounted = _b[0], setMounted = _b[1];
    // ป้องกัน Error Hydration (รอให้โหลดหน้าเว็บเสร็จก่อนค่อยแสดงปุ่ม)
    react_1.useEffect(function () {
        setMounted(true);
    }, []);
    if (!mounted) {
        return React.createElement("div", { className: "w-9 h-9" }); // Placeholder กันกระตุก
    }
    return (React.createElement("button", { onClick: function () { return setTheme(theme === "dark" ? "light" : "dark"); }, className: "p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-yellow-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all shadow-sm", "aria-label": "Toggle Theme" }, theme === "dark" ? (
    // ไอคอนพระอาทิตย์ (สำหรับโหมดมืด -> กดเพื่อไปสว่าง)
    React.createElement("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" }))) : (
    // ไอคอนพระจันทร์ (สำหรับโหมดสว่าง -> กดเพื่อไปมืด)
    React.createElement("svg", { className: "w-5 h-5 text-zinc-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" })))));
}
exports["default"] = ThemeToggle;
