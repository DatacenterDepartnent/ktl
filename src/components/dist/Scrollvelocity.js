// ScrollVelocity
"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
var utils_1 = require("@motionone/utils");
function ParallaxText(_a) {
    var children = _a.children, _b = _a.baseVelocity, baseVelocity = _b === void 0 ? 50 : _b;
    var baseX = framer_motion_1.useMotionValue(0);
    var scrollY = framer_motion_1.useScroll().scrollY;
    var scrollVelocity = framer_motion_1.useVelocity(scrollY);
    var smoothVelocity = framer_motion_1.useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 500
    });
    var velocityFactor = framer_motion_1.useTransform(smoothVelocity, [0, 2000], [0, 5], {
        clamp: false
    });
    /**
     * This is a magic wrapping for the length of the text - you
     * have to replace for wrapping that works for you or dynamically
     * calculate
     */
    var x = framer_motion_1.useTransform(baseX, function (v) { return utils_1.wrap(-20, -45, v) + "%"; });
    var directionFactor = react_1.useRef(1);
    framer_motion_1.useAnimationFrame(function (t, delta) {
        var moveBy = directionFactor.current * baseVelocity * (delta / 3000);
        /**
         * This is what changes the direction of the scroll once we
         * switch scrolling directions.
         */
        if (velocityFactor.get() < 0) {
            directionFactor.current = -1;
        }
        else if (velocityFactor.get() > 0) {
            directionFactor.current = 1;
        }
        moveBy += directionFactor.current * moveBy * velocityFactor.get();
        baseX.set(baseX.get() + moveBy);
    });
    /**
     * The number of times to repeat the child text should be dynamically calculated
     * based on the size of the text and viewport. Likewise, the x motion value is
     * currently wrapped between -20 and -45% - this 25% is derived from the fact
     * we have four children (100% / 4). This would also want deriving from the
     * dynamically generated number of children.
     */
    return (React.createElement("div", { className: "parallax" },
        React.createElement(framer_motion_1.motion.div, { className: "scroller", style: { x: x } },
            React.createElement("span", null,
                children,
                " "),
            React.createElement("span", null,
                children,
                " "),
            React.createElement("span", null,
                children,
                " "),
            React.createElement("span", null,
                children,
                " "))));
}
function ScrollVelocity() {
    return (React.createElement(React.Fragment, null,
        React.createElement("section", null,
            React.createElement("div", { className: "pb-4" },
                React.createElement(ParallaxText, { baseVelocity: -5 }, "\u0E27\u0E34\u0E17\u0E22\u0E32\u0E25\u0E31\u0E22\u0E40\u0E17\u0E04\u0E19\u0E34\u0E04\u0E01\u0E31\u0E19\u0E17\u0E23\u0E25\u0E31\u0E01\u0E29\u0E4C KTLTC kantharalak technical college")),
            React.createElement("div", { className: "pt-4" },
                React.createElement(ParallaxText, { baseVelocity: 5 }, "welcome KTLTC kantharalak technical college")))));
}
exports["default"] = ScrollVelocity;
