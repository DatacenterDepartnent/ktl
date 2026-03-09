"use strict";
exports.__esModule = true;
exports.CardDescription = exports.CardTitle = exports.Card = exports.HoverEffect = void 0;
var utils_1 = require("@/lib/utils");
var framer_motion_1 = require("framer-motion");
var link_1 = require("next/link");
var react_1 = require("react");
exports.HoverEffect = function (_a) {
    var items = _a.items, className = _a.className;
    var _b = react_1.useState(null), hoveredIndex = _b[0], setHoveredIndex = _b[1];
    return (React.createElement("div", { className: utils_1.cn("grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3  py-10", className) }, items.map(function (item, idx) { return (React.createElement(link_1["default"], { href: item === null || item === void 0 ? void 0 : item.link, key: item === null || item === void 0 ? void 0 : item.link, className: "relative group  block p-2 h-full w-full", onMouseEnter: function () { return setHoveredIndex(idx); }, onMouseLeave: function () { return setHoveredIndex(null); } },
        React.createElement(framer_motion_1.AnimatePresence, null, hoveredIndex === idx && (React.createElement(framer_motion_1.motion.span, { className: "absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/80 block  rounded-3xl", layoutId: "hoverBackground", initial: { opacity: 0 }, animate: {
                opacity: 1,
                transition: { duration: 0.15 }
            }, exit: {
                opacity: 0,
                transition: { duration: 0.15, delay: 0.2 }
            } }))),
        React.createElement(exports.Card, null,
            React.createElement(exports.CardTitle, null, item.title),
            React.createElement(exports.CardDescription, null, item.description)))); })));
};
exports.Card = function (_a) {
    var className = _a.className, children = _a.children;
    return (React.createElement("div", { className: utils_1.cn("rounded-2xl h-full w-full p-4 overflow-hidden bg-black border border-transparent dark:border-white/20 group-hover:border-slate-700 relative z-20", className) },
        React.createElement("div", { className: "relative z-50" },
            React.createElement("div", { className: "p-4" }, children))));
};
exports.CardTitle = function (_a) {
    var className = _a.className, children = _a.children;
    return (React.createElement("h4", { className: utils_1.cn("text-zinc-100 font-bold tracking-wide mt-4", className) }, children));
};
exports.CardDescription = function (_a) {
    var className = _a.className, children = _a.children;
    return (React.createElement("p", { className: utils_1.cn("mt-8 text-zinc-400 tracking-wide leading-relaxed text-sm", className) }, children));
};
