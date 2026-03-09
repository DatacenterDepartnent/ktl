"use client";
"use strict";
exports.__esModule = true;
exports.Card = exports.Header = exports.ContainerScroll = void 0;
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
exports.ContainerScroll = function (_a) {
    var titleComponent = _a.titleComponent, children = _a.children;
    var containerRef = react_1.useRef(null);
    var scrollYProgress = framer_motion_1.useScroll({
        target: containerRef
    }).scrollYProgress;
    var _b = react_1["default"].useState(false), isMobile = _b[0], setIsMobile = _b[1];
    react_1["default"].useEffect(function () {
        var checkMobile = function () {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return function () {
            window.removeEventListener("resize", checkMobile);
        };
    }, []);
    var scaleDimensions = function () {
        return isMobile ? [0.7, 0.9] : [1.05, 1];
    };
    var rotate = framer_motion_1.useTransform(scrollYProgress, [0, 1], [20, 0]);
    var scale = framer_motion_1.useTransform(scrollYProgress, [0, 1], scaleDimensions());
    var translate = framer_motion_1.useTransform(scrollYProgress, [0, 1], [0, -100]);
    return (react_1["default"].createElement("div", { className: "h-240 sm:h-[4 0rem] md:h-280 flex items-center justify-center relative p-2 md:p-20", ref: containerRef },
        react_1["default"].createElement("div", { className: "py-10 md:py-40 w-full relative", style: {
                perspective: "1000px"
            } },
            react_1["default"].createElement(exports.Header, { translate: translate, titleComponent: titleComponent }),
            react_1["default"].createElement(exports.Card, { rotate: rotate, translate: translate, scale: scale }, children))));
};
exports.Header = function (_a) {
    var translate = _a.translate, titleComponent = _a.titleComponent;
    return (react_1["default"].createElement(framer_motion_1.motion.div, { style: {
            translateY: translate
        }, className: "div max-w-7xl mx-auto text-center" }, titleComponent));
};
exports.Card = function (_a) {
    var rotate = _a.rotate, scale = _a.scale, children = _a.children;
    return (react_1["default"].createElement(framer_motion_1.motion.div, { style: {
            rotateX: rotate,
            scale: scale,
            boxShadow: "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003"
        }, className: "max-w-5xl -mt-12 mx-auto h-120 md:h-160 w-full border-4 border-[#6C6C6C] p-2 md:p-6 bg-[#222222] rounded-[30px] shadow-2xl" },
        react_1["default"].createElement("div", { className: " h-full w-full  overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-900 md:rounded-2xl md:p-4 " }, children)));
};
