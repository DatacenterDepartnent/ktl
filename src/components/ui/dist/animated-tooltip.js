"use client";
"use strict";
exports.__esModule = true;
exports.AnimatedTooltip = void 0;
var image_1 = require("@heroui/image");
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
exports.AnimatedTooltip = function (_a) {
    var items = _a.items;
    var _b = react_1.useState(null), hoveredIndex = _b[0], setHoveredIndex = _b[1];
    var springConfig = { stiffness: 100, damping: 5 };
    var x = framer_motion_1.useMotionValue(0); // going to set this value on mouse move
    // rotate the tooltip
    var rotate = framer_motion_1.useSpring(framer_motion_1.useTransform(x, [-100, 100], [-45, 45]), springConfig);
    // translate the tooltip
    var translateX = framer_motion_1.useSpring(framer_motion_1.useTransform(x, [-100, 100], [-50, 50]), springConfig);
    var handleMouseMove = function (event) {
        var halfWidth = event.target.offsetWidth / 2;
        x.set(event.nativeEvent.offsetX - halfWidth); // set the x value, which is then used in transform and rotate
    };
    return (React.createElement(React.Fragment, null, items.map(function (item) { return (React.createElement("div", { className: "group relative grid gap-4 px-4 py-4", key: item.name, onMouseEnter: function () { return setHoveredIndex(item.id); }, onMouseLeave: function () { return setHoveredIndex(null); } },
        React.createElement(framer_motion_1.AnimatePresence, { mode: "popLayout" }, hoveredIndex === item.id && (React.createElement(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20, scale: 0.6 }, animate: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 10
                }
            }, exit: { opacity: 0, y: 20, scale: 0.6 }, style: {
                translateX: translateX,
                rotate: rotate,
                whiteSpace: "nowrap"
            }, className: "absolute -top-16 -left-1/2 z-50 flex translate-x-1/2 flex-col items-center justify-center rounded-md bg-black px-4 py-2 text-xs shadow-xl" },
            React.createElement("div", { className: "absolute inset-x-10 -bottom-px z-30 h-px w-[20%] bg-linear-to-r from-transparent via-emerald-500 to-transparent" }),
            React.createElement("div", { className: "absolute -bottom-px left-10 z-30 h-px w-[40%] bg-linear-to-r from-transparent via-sky-500 to-transparent" }),
            React.createElement("div", { className: "relative z-30 text-base font-bold text-white" }, item.name),
            React.createElement("div", { className: "text-sm text-white" }, item.designation)))),
        React.createElement(image_1.Image, { onMouseMove: handleMouseMove, height: 100, width: 100, src: item.image, alt: item.name, className: "relative m-0! h-32 w-32 rounded-full border-2 border-white object-cover object-top p-0! transition duration-500 group-hover:z-30 group-hover:scale-105" }))); })));
};
