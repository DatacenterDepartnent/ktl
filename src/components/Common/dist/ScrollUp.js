"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
function ScrollUp() {
    var _a = react_1.useState(false), isVisible = _a[0], setIsVisible = _a[1];
    // ตรวจจับการเลื่อนหน้าจอ
    react_1.useEffect(function () {
        var toggleVisibility = function () {
            if (window.scrollY > 300) {
                setIsVisible(true);
            }
            else {
                setIsVisible(false);
            }
        };
        window.addEventListener("scroll", toggleVisibility);
        return function () { return window.removeEventListener("scroll", toggleVisibility); };
    }, []);
    // ฟังก์ชันเลื่อนขึ้นบนสุด
    var scrollToTop = function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };
    return (React.createElement("div", { className: "fixed bottom-8 right-8 z-[999]" },
        React.createElement(framer_motion_1.AnimatePresence, null, isVisible && (React.createElement(framer_motion_1.motion.button, { onClick: scrollToTop, initial: { opacity: 0, scale: 0.5, y: 20 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.5, y: 20 }, whileHover: {
                scale: 1.1,
                y: -5,
                boxShadow: "0px 10px 25px rgba(217, 119, 6, 0.6)"
            }, whileTap: { scale: 0.9 }, transition: { type: "spring", stiffness: 400, damping: 17 }, className: "group relative flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-gradient-to-tr from-yellow-600 via-amber-500 to-yellow-400 text-white shadow-lg backdrop-blur-sm", "aria-label": "Scroll to top" },
            React.createElement("span", { className: "absolute inset-0 -z-10 rounded-full bg-amber-400 opacity-0 transition-opacity duration-500 group-hover:animate-ping group-hover:opacity-30" }),
            React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 2.5, stroke: "currentColor", className: "h-6 w-6 transition-transform duration-300 group-hover:-translate-y-1" },
                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M4.5 15.75l7.5-7.5 7.5 7.5" })))))));
}
exports["default"] = ScrollUp;
