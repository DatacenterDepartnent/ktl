"use client";
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
exports.CircleIcon = exports.Beam = exports.Cover = void 0;
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
var react_2 = require("react");
var utils_1 = require("@/lib/utils");
var sparkles_1 = require("@/components/ui/sparkles");
exports.Cover = function (_a) {
    var children = _a.children, className = _a.className;
    var hovered = react_1.useState(false)[0];
    var ref = react_2.useRef(null);
    var _b = react_1.useState(0), containerWidth = _b[0], setContainerWidth = _b[1];
    var _c = react_1.useState([]), beamPositions = _c[0], setBeamPositions = _c[1];
    react_1.useEffect(function () {
        var _a, _b, _c, _d;
        if (ref.current) {
            setContainerWidth((_b = (_a = ref.current) === null || _a === void 0 ? void 0 : _a.clientWidth) !== null && _b !== void 0 ? _b : 0);
            var height_1 = (_d = (_c = ref.current) === null || _c === void 0 ? void 0 : _c.clientHeight) !== null && _d !== void 0 ? _d : 0;
            var numberOfBeams_1 = Math.floor(height_1 / 10); // Adjust the divisor to control the spacing
            var positions = Array.from({ length: numberOfBeams_1 }, function (_, i) { return (i + 1) * (height_1 / (numberOfBeams_1 + 1)); });
            setBeamPositions(positions);
        }
    }, []);
    return (react_1["default"].createElement("div", { ref: ref, className: "relative" },
        react_1["default"].createElement(framer_motion_1.AnimatePresence, null, hovered && (react_1["default"].createElement(framer_motion_1.motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: {
                opacity: {
                    duration: 0.2
                }
            }, className: "absolute inset-0 overflow-hidden" },
            react_1["default"].createElement(framer_motion_1.motion.div, { animate: {
                    translateX: ["-50%", "0%"]
                }, transition: {
                    translateX: {
                        duration: 10,
                        ease: "linear",
                        repeat: Infinity
                    }
                }, className: "flex h-full w-[200%]" },
                react_1["default"].createElement(sparkles_1.SparklesCore, { background: "transparent", minSize: 0.4, maxSize: 1, particleDensity: 500, className: "h-full w-full", particleColor: "#FFFFFF" }),
                react_1["default"].createElement(sparkles_1.SparklesCore, { background: "transparent", minSize: 0.4, maxSize: 1, particleDensity: 500, className: "h-full w-full", particleColor: "#FFFFFF" }))))),
        beamPositions.map(function (position, index) { return (react_1["default"].createElement(exports.Beam, { key: index, hovered: hovered, duration: Math.random() * 2 + 1, delay: Math.random() * 2 + 1, width: containerWidth, style: {
                top: position + "px"
            } })); }),
        react_1["default"].createElement(framer_motion_1.motion.span, { key: String(hovered), animate: {
                scale: hovered ? 0.8 : 1,
                x: hovered ? [0, -30, 30, -30, 30, 0] : 0,
                y: hovered ? [0, 30, -30, 30, -30, 0] : 0
            }, exit: {
                filter: "none",
                scale: 1,
                x: 0,
                y: 0
            }, transition: {
                duration: 0.2,
                x: {
                    duration: 0.2,
                    repeat: Infinity,
                    repeatType: "loop"
                },
                y: {
                    duration: 0.2,
                    repeat: Infinity,
                    repeatType: "loop"
                },
                scale: {
                    duration: 0.2
                },
                filter: {
                    duration: 0.2
                }
            }, className: utils_1.cn("relative z-20 inline-block text-neutral-900 transition duration-200 group-hover/cover:text-white dark:text-white", className) }, children),
        react_1["default"].createElement(exports.CircleIcon, { className: "absolute -top-0.5 -right-0.5" }),
        react_1["default"].createElement(exports.CircleIcon, { className: "absolute -right-0.5 -bottom-0.5", delay: 0.4 }),
        react_1["default"].createElement(exports.CircleIcon, { className: "absolute -top-0.5 -left-0.5", delay: 0.8 }),
        react_1["default"].createElement(exports.CircleIcon, { className: "absolute -bottom-0.5 -left-0.5", delay: 1.6 })));
};
exports.Beam = function (_a) {
    var className = _a.className, delay = _a.delay, duration = _a.duration, hovered = _a.hovered, _b = _a.width, width = _b === void 0 ? 600 : _b, svgProps = __rest(_a, ["className", "delay", "duration", "hovered", "width"]);
    var id = react_1.useId();
    return (react_1["default"].createElement(framer_motion_1.motion.svg, __assign({ width: width !== null && width !== void 0 ? width : "600", height: "1", viewBox: "0 0 " + (width !== null && width !== void 0 ? width : "600") + " 1", fill: "none", xmlns: "http://www.w3.org/2000/svg", className: utils_1.cn("absolute inset-x-0 w-full", className) }, svgProps),
        react_1["default"].createElement(framer_motion_1.motion.path, { d: "M0 0.5H" + (width !== null && width !== void 0 ? width : "600"), stroke: "url(#svgGradient-" + id + ")" }),
        react_1["default"].createElement("defs", null,
            react_1["default"].createElement(framer_motion_1.motion.linearGradient, { id: "svgGradient-" + id, key: String(hovered), gradientUnits: "userSpaceOnUse", initial: {
                    x1: "0%",
                    x2: hovered ? "-10%" : "-5%",
                    y1: 0,
                    y2: 0
                }, animate: {
                    x1: "110%",
                    x2: hovered ? "100%" : "105%",
                    y1: 0,
                    y2: 0
                }, transition: {
                    duration: hovered ? 0.5 : (duration !== null && duration !== void 0 ? duration : 2),
                    ease: "linear",
                    repeat: Infinity,
                    delay: hovered ? Math.random() * (1 - 0.2) + 0.2 : 0,
                    repeatDelay: hovered ? Math.random() * (2 - 1) + 1 : (delay !== null && delay !== void 0 ? delay : 1)
                } },
                react_1["default"].createElement("stop", { stopColor: "#2EB9DF", stopOpacity: "0" }),
                react_1["default"].createElement("stop", { stopColor: "#3b82f6" }),
                react_1["default"].createElement("stop", { offset: "1", stopColor: "#3b82f6", stopOpacity: "0" })))));
};
exports.CircleIcon = function (_a) {
    var className = _a.className;
    return react_1["default"].createElement("div", { className: utils_1.cn("", className) });
};
