"use strict";
/**
 * Note: Use position fixed according to your needs
 * Desktop navbar is better positioned at the bottom
 * Mobile navbar is better positioned at bottom right.
 **/
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
exports.__esModule = true;
exports.FloatingDock = void 0;
var utils_1 = require("@/lib/utils");
var icons_react_1 = require("@tabler/icons-react");
var framer_motion_1 = require("framer-motion");
var link_1 = require("next/link");
var react_1 = require("react");
exports.FloatingDock = function (_a) {
    var items = _a.items, desktopClassName = _a.desktopClassName, mobileClassName = _a.mobileClassName;
    return (React.createElement(React.Fragment, null,
        React.createElement(FloatingDockDesktop, { items: items, className: desktopClassName }),
        React.createElement(FloatingDockMobile, { items: items, className: mobileClassName })));
};
var FloatingDockMobile = function (_a) {
    var items = _a.items, className = _a.className;
    var _b = react_1.useState(false), open = _b[0], setOpen = _b[1];
    return (React.createElement("div", { className: utils_1.cn("relative block md:hidden", className) },
        React.createElement(framer_motion_1.AnimatePresence, null, open && (React.createElement(framer_motion_1.motion.div, { layoutId: "nav", className: "absolute bottom-full mb-2 inset-x-0 flex flex-col gap-2" }, items.map(function (item, idx) { return (React.createElement(framer_motion_1.motion.div, { key: item.title, initial: { opacity: 0, y: 10 }, animate: {
                opacity: 1,
                y: 0
            }, exit: {
                opacity: 0,
                y: 10,
                transition: {
                    delay: idx * 0.05
                }
            }, transition: { delay: (items.length - 1 - idx) * 0.05 } },
            React.createElement(link_1["default"], { href: item.href, key: item.title, className: "h-10 w-10 rounded-full bg-gray-50 dark:bg-neutral-900 flex items-center justify-center" },
                React.createElement("div", { className: "h-4 w-4" }, item.icon)))); })))),
        React.createElement("button", { onClick: function () { return setOpen(!open); }, className: "h-10 w-10 rounded-full bg-gray-50 dark:bg-neutral-800 flex items-center justify-center" },
            React.createElement(icons_react_1.IconLayoutNavbarCollapse, { className: "h-5 w-5 text-neutral-500 dark:text-neutral-400" }))));
};
var FloatingDockDesktop = function (_a) {
    var items = _a.items, className = _a.className;
    var mouseX = framer_motion_1.useMotionValue(Infinity);
    return (React.createElement(framer_motion_1.motion.div, { onMouseMove: function (e) { return mouseX.set(e.pageX); }, onMouseLeave: function () { return mouseX.set(Infinity); }, className: utils_1.cn("mx-auto hidden md:flex h-16 gap-4 items-end  rounded-2xl bg-gray-50 dark:bg-neutral-900 px-4 pb-3", className) }, items.map(function (item) { return (React.createElement(IconContainer, __assign({ mouseX: mouseX, key: item.title }, item))); })));
};
function IconContainer(_a) {
    var mouseX = _a.mouseX, title = _a.title, icon = _a.icon, href = _a.href;
    var ref = react_1.useRef(null);
    var distance = framer_motion_1.useTransform(mouseX, function (val) {
        var _a, _b;
        var bounds = (_b = (_a = ref.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect()) !== null && _b !== void 0 ? _b : { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });
    var widthTransform = framer_motion_1.useTransform(distance, [-150, 0, 150], [40, 80, 40]);
    var heightTransform = framer_motion_1.useTransform(distance, [-150, 0, 150], [40, 80, 40]);
    var widthTransformIcon = framer_motion_1.useTransform(distance, [-150, 0, 150], [20, 40, 20]);
    var heightTransformIcon = framer_motion_1.useTransform(distance, [-150, 0, 150], [20, 40, 20]);
    var width = framer_motion_1.useSpring(widthTransform, {
        mass: 0.1,
        stiffness: 150,
        damping: 12
    });
    var height = framer_motion_1.useSpring(heightTransform, {
        mass: 0.1,
        stiffness: 150,
        damping: 12
    });
    var widthIcon = framer_motion_1.useSpring(widthTransformIcon, {
        mass: 0.1,
        stiffness: 150,
        damping: 12
    });
    var heightIcon = framer_motion_1.useSpring(heightTransformIcon, {
        mass: 0.1,
        stiffness: 150,
        damping: 12
    });
    var _b = react_1.useState(false), hovered = _b[0], setHovered = _b[1];
    return (React.createElement(link_1["default"], { href: href },
        React.createElement(framer_motion_1.motion.div, { ref: ref, style: { width: width, height: height }, onMouseEnter: function () { return setHovered(true); }, onMouseLeave: function () { return setHovered(false); }, className: "aspect-square rounded-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center relative" },
            React.createElement(framer_motion_1.AnimatePresence, null, hovered && (React.createElement(framer_motion_1.motion.div, { initial: { opacity: 0, y: 10, x: "-50%" }, animate: { opacity: 1, y: 0, x: "-50%" }, exit: { opacity: 0, y: 2, x: "-50%" }, className: "px-2 py-0.5 whitespace-pre rounded-md bg-gray-100 border dark:bg-neutral-800 dark:border-neutral-900 dark:text-white border-gray-200 text-neutral-700 absolute left-1/2 -translate-x-1/2 -top-8 w-fit text-xs" }, title))),
            React.createElement(framer_motion_1.motion.div, { style: { width: widthIcon, height: heightIcon }, className: "flex items-center justify-center" }, icon))));
}
