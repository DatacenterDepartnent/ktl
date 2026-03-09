"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
exports.HoveredLink = exports.ProductItem = exports.Menu = exports.MenuItem = void 0;
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
var link_1 = require("next/link");
var image_1 = require("@heroui/image");
var transition = {
    type: "spring",
    mass: 0.5,
    damping: 11.5,
    stiffness: 100,
    restDelta: 0.001,
    restSpeed: 0.001
};
exports.MenuItem = function (_a) {
    var setActive = _a.setActive, active = _a.active, item = _a.item, children = _a.children;
    return (react_1["default"].createElement("div", { onMouseEnter: function () { return setActive(item); }, className: "relative" },
        react_1["default"].createElement(framer_motion_1.motion.div, { transition: { duration: 0.3 }, className: "cursor-pointer text-black hover:opacity-[0.9] dark:text-white" }, item),
        active !== null && (react_1["default"].createElement(framer_motion_1.motion.div, { initial: { opacity: 0, scale: 0.85, y: 10 }, animate: { opacity: 1, scale: 1, y: 0 }, transition: transition }, active === item && (react_1["default"].createElement("div", { className: "absolute left-1/2 top-[calc(100%+1.2rem)] -translate-x-1/2 transform pt-4" },
            react_1["default"].createElement(framer_motion_1.motion.div, { transition: transition, layoutId: "active" // layoutId ensures smooth animation
                , className: "overflow-hidden rounded-2xl border border-black/20 bg-white shadow-xl backdrop-blur-sm dark:border-white/20 dark:bg-black" },
                react_1["default"].createElement(framer_motion_1.motion.div, { layout // layout ensures smooth animation
                    : true, className: "h-full w-max p-2" }, children))))))));
};
exports.Menu = function (_a) {
    var setActive = _a.setActive, children = _a.children;
    return (react_1["default"].createElement("nav", { onMouseLeave: function () { return setActive(null); }, className: "flex justify-center space-x-4 px-8 py-6" }, children));
};
exports.ProductItem = function (_a) {
    var title = _a.title, description = _a.description, href = _a.href, src = _a.src;
    return (react_1["default"].createElement(link_1["default"], { href: href, className: "flex space-x-2" },
        react_1["default"].createElement(image_1.Image, { src: src, width: 140, height: 70, alt: title, className: "shrink-0 shadow-2xl" }),
        react_1["default"].createElement("div", null,
            react_1["default"].createElement("h4", { className: "mb-1 text-xl font-bold text-black dark:text-white" }, title),
            react_1["default"].createElement("p", { className: "max-w-40 text-sm text-neutral-700 dark:text-neutral-300" }, description))));
};
exports.HoveredLink = function (_a) {
    var children = _a.children, rest = __rest(_a, ["children"]);
    return (react_1["default"].createElement(link_1["default"], __assign({}, rest, { className: "text-neutral-700 hover:text-sky-600 dark:text-neutral-200 dark:hover:text-sky-700" }),
        react_1["default"].createElement("div", { className: "px-2 py-2" }, children)));
};
