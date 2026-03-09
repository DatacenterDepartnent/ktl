"use client";
"use strict";
exports.__esModule = true;
exports.LinkPreview = void 0;
var HoverCardPrimitive = require("@radix-ui/react-hover-card");
var qss_1 = require("qss");
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
var utils_1 = require("@/lib/utils");
exports.LinkPreview = function (_a) {
    var children = _a.children, url = _a.url, className = _a.className, _b = _a.width, width = _b === void 0 ? 200 : _b, _c = _a.height, height = _c === void 0 ? 125 : _c, _d = _a.isStatic, isStatic = _d === void 0 ? false : _d, _e = _a.imageSrc, imageSrc = _e === void 0 ? "" : _e;
    var src;
    if (!isStatic) {
        var params = qss_1.encode({
            url: url,
            screenshot: true,
            meta: false,
            embed: "screenshot.url",
            colorScheme: "dark",
            "viewport.isMobile": true,
            "viewport.deviceScaleFactor": 1,
            "viewport.width": width * 3,
            "viewport.height": height * 3
        });
        src = "https://api.microlink.io/?" + params;
    }
    else {
        src = imageSrc;
    }
    var _f = react_1["default"].useState(false), isOpen = _f[0], setOpen = _f[1];
    var _g = react_1["default"].useState(false), isMounted = _g[0], setIsMounted = _g[1];
    react_1["default"].useEffect(function () {
        setIsMounted(true);
    }, []);
    var springConfig = { stiffness: 100, damping: 15 };
    var x = framer_motion_1.useMotionValue(0);
    var translateX = framer_motion_1.useSpring(x, springConfig);
    var handleMouseMove = function (event) {
        var targetRect = event.target.getBoundingClientRect();
        var eventOffsetX = event.clientX - targetRect.left;
        var offsetFromCenter = (eventOffsetX - targetRect.width / 2) / 2; // Reduce the effect to make it subtle
        x.set(offsetFromCenter);
    };
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        isMounted ? (react_1["default"].createElement("div", { className: "hidden" },
            react_1["default"].createElement("img", { src: src, width: width, height: height, alt: "hidden image" }))) : null,
        react_1["default"].createElement(HoverCardPrimitive.Root, { openDelay: 50, closeDelay: 100, onOpenChange: function (open) {
                setOpen(open);
            } },
            react_1["default"].createElement(HoverCardPrimitive.Trigger, { onMouseMove: handleMouseMove, className: utils_1.cn("text-black dark:text-white", className), href: url }, children),
            react_1["default"].createElement(HoverCardPrimitive.Content, { className: "origin-(--radix-hover-card-content-transform-origin)", side: "top", align: "center", sideOffset: 10 },
                react_1["default"].createElement(framer_motion_1.AnimatePresence, null, isOpen && (react_1["default"].createElement(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20, scale: 0.6 }, animate: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: {
                            type: "spring",
                            stiffness: 260,
                            damping: 20
                        }
                    }, exit: { opacity: 0, y: 20, scale: 0.6 }, className: "rounded-xl shadow-xl", style: {
                        x: translateX
                    } },
                    react_1["default"].createElement("a", { href: url, className: "block rounded-xl border-2 border-transparent bg-white p-1 shadow hover:border-neutral-200 dark:hover:border-neutral-800", style: { fontSize: 0 } },
                        react_1["default"].createElement("img", { src: isStatic ? imageSrc : src, width: width, height: height, className: "rounded-lg", alt: "preview image" })))))))));
};
