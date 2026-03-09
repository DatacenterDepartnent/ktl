"use strict";
exports.__esModule = true;
exports.BackgroundGradient = void 0;
var utils_1 = require("@/lib/utils");
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
exports.BackgroundGradient = function (_a) {
    var children = _a.children, className = _a.className, containerClassName = _a.containerClassName, _b = _a.animate, animate = _b === void 0 ? true : _b;
    var variants = {
        initial: {
            backgroundPosition: "0 50%"
        },
        animate: {
            backgroundPosition: ["0, 50%", "100% 50%", "0 50%"]
        }
    };
    return (react_1["default"].createElement("div", { className: utils_1.cn("relative p-1 group ", containerClassName) },
        react_1["default"].createElement(framer_motion_1.motion.div, { variants: animate ? variants : undefined, initial: animate ? "initial" : undefined, animate: animate ? "animate" : undefined, transition: animate
                ? {
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "reverse"
                }
                : undefined, style: {
                backgroundSize: animate ? "400% 400%" : undefined
            }, className: utils_1.cn("absolute inset-0 rounded-3xl z-1 opacity-60 group-hover:opacity-100 blur-xl  transition duration-500 will-change-transform", " bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)]") }),
        react_1["default"].createElement(framer_motion_1.motion.div, { variants: animate ? variants : undefined, initial: animate ? "initial" : undefined, animate: animate ? "animate" : undefined, transition: animate
                ? {
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "reverse"
                }
                : undefined, style: {
                backgroundSize: animate ? "400% 400%" : undefined
            }, className: utils_1.cn("absolute inset-0 rounded-3xl z-1 will-change-transform", "bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)]") }),
        react_1["default"].createElement("div", { className: utils_1.cn("relative z-10", className) }, children)));
};
