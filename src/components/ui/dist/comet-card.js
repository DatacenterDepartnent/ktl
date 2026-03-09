"use client";
"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
exports.__esModule = true;
exports.CometCard = void 0;
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
var utils_1 = require("@/lib/utils");
exports.CometCard = function (_a) {
    var _b = _a.rotateDepth, rotateDepth = _b === void 0 ? 17.5 : _b, _c = _a.translateDepth, translateDepth = _c === void 0 ? 20 : _c, className = _a.className, children = _a.children;
    var ref = react_1.useRef(null);
    var x = framer_motion_1.useMotionValue(0);
    var y = framer_motion_1.useMotionValue(0);
    var mouseXSpring = framer_motion_1.useSpring(x);
    var mouseYSpring = framer_motion_1.useSpring(y);
    var rotateX = framer_motion_1.useTransform(mouseYSpring, [-0.5, 0.5], ["-" + rotateDepth + "deg", rotateDepth + "deg"]);
    var rotateY = framer_motion_1.useTransform(mouseXSpring, [-0.5, 0.5], [rotateDepth + "deg", "-" + rotateDepth + "deg"]);
    var translateX = framer_motion_1.useTransform(mouseXSpring, [-0.5, 0.5], ["-" + translateDepth + "px", translateDepth + "px"]);
    var translateY = framer_motion_1.useTransform(mouseYSpring, [-0.5, 0.5], [translateDepth + "px", "-" + translateDepth + "px"]);
    var glareX = framer_motion_1.useTransform(mouseXSpring, [-0.5, 0.5], [0, 100]);
    var glareY = framer_motion_1.useTransform(mouseYSpring, [-0.5, 0.5], [0, 100]);
    var glareBackground = framer_motion_1.useMotionTemplate(templateObject_1 || (templateObject_1 = __makeTemplateObject(["radial-gradient(circle at ", "% ", "%, rgba(255, 255, 255, 0.9) 10%, rgba(255, 255, 255, 0.75) 20%, rgba(255, 255, 255, 0) 80%)"], ["radial-gradient(circle at ", "% ", "%, rgba(255, 255, 255, 0.9) 10%, rgba(255, 255, 255, 0.75) 20%, rgba(255, 255, 255, 0) 80%)"])), glareX, glareY);
    var handleMouseMove = function (e) {
        if (!ref.current)
            return;
        var rect = ref.current.getBoundingClientRect();
        var width = rect.width;
        var height = rect.height;
        var mouseX = e.clientX - rect.left;
        var mouseY = e.clientY - rect.top;
        var xPct = mouseX / width - 0.5;
        var yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };
    var handleMouseLeave = function () {
        x.set(0);
        y.set(0);
    };
    return (react_1["default"].createElement("div", { className: utils_1.cn("perspective-distant transform-3d", className) },
        react_1["default"].createElement(framer_motion_1.motion.div, { ref: ref, onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave, style: {
                rotateX: rotateX,
                rotateY: rotateY,
                translateX: translateX,
                translateY: translateY,
                boxShadow: " "
            }, initial: { scale: 1, z: 0 }, whileHover: {
                scale: 1.05,
                z: 50,
                transition: { duration: 0.2 }
            }, className: "relative rounded-2xl" },
            children,
            react_1["default"].createElement(framer_motion_1.motion.div, { className: "h-full w-full rounded-2xl mix-blend-overlay", style: {
                    background: glareBackground,
                    opacity: 0.6
                }, transition: { duration: 0.2 } }))));
};
var templateObject_1;
