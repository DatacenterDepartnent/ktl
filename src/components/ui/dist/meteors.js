"use client";
"use strict";
exports.__esModule = true;
exports.Meteors = void 0;
var utils_1 = require("@/lib/utils");
var framer_motion_1 = require("framer-motion");
var react_1 = require("react");
exports.Meteors = function (_a) {
    var number = _a.number, className = _a.className;
    var meteors = new Array(number || 20).fill(true);
    return (react_1["default"].createElement(framer_motion_1.motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.5 } }, meteors.map(function (el, idx) {
        var meteorCount = number || 20;
        // Calculate position to evenly distribute meteors across container width
        var position = idx * (800 / meteorCount) - 400; // Spread across 800px range, centered
        return (react_1["default"].createElement("span", { key: "meteor" + idx, className: utils_1.cn("animate-meteor-effect absolute h-0.5 w-0.5 rotate-45 rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10]", "before:absolute before:top-1/2 before:h-px before:w-[50px] before:-translate-y-[50%] before:transform before:bg-linear-to-r before:from-[#64748b] before:to-transparent before:content-['']", className), style: {
                top: "-40px",
                left: position + "px",
                animationDelay: Math.random() * 5 + "s",
                animationDuration: Math.floor(Math.random() * (10 - 5) + 5) + "s"
            } }));
    })));
};
