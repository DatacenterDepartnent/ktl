"use client";
"use strict";
exports.__esModule = true;
var navigation_1 = require("next/navigation");
var react_1 = require("react");
function ViewAllNewslettersButton() {
    var router = navigation_1.useRouter();
    var _a = react_1.useTransition(), isPending = _a[0], startTransition = _a[1];
    var handleClick = function () {
        startTransition(function () {
            // สั่งให้เปลี่ยนหน้าไปที่หน้ารวมข่าว โดยกรองเฉพาะหมวด Newsletter
            router.push("/news?category=Newsletter");
        });
    };
    return (React.createElement("button", { onClick: handleClick, disabled: isPending, className: "\n        inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-white shadow-lg transition-all active:scale-95 group\n        " + (isPending
            ? "bg-yellow-300 cursor-wait shadow-none" // สถานะกำลังโหลด
            : "bg-yellow-500 hover:bg-yellow-600 shadow-yellow-200" // สถานะปกติ
        ) + "\n      " }, isPending ? (
    // ✅ 1. สถานะกำลังโหลด
    React.createElement(React.Fragment, null,
        React.createElement("svg", { className: "animate-spin h-5 w-5 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24" },
            React.createElement("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
            React.createElement("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })),
        "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E40\u0E1B\u0E34\u0E14...")) : (
    // ✅ 2. สถานะปกติ
    React.createElement(React.Fragment, null,
        React.createElement("svg", { className: "w-5 h-5 group-hover:rotate-180 transition-transform duration-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
            React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" })),
        "\u0E14\u0E39\u0E08\u0E14\u0E2B\u0E21\u0E32\u0E22\u0E02\u0E48\u0E32\u0E27\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14"))));
}
exports["default"] = ViewAllNewslettersButton;
