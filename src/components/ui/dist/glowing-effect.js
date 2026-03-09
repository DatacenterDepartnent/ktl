"use client";
"use strict";
exports.__esModule = true;
exports.GlowingEffect = void 0;
var react_1 = require("react");
var utils_1 = require("@/lib/utils");
var framer_motion_1 = require("framer-motion");
var GlowingEffect = react_1.memo(function (_a) {
    var _b = _a.blur, blur = _b === void 0 ? 0 : _b, _c = _a.inactiveZone, inactiveZone = _c === void 0 ? 0.7 : _c, _d = _a.proximity, proximity = _d === void 0 ? 0 : _d, _e = _a.spread, spread = _e === void 0 ? 20 : _e, _f = _a.variant, variant = _f === void 0 ? "default" : _f, _g = _a.glow, glow = _g === void 0 ? false : _g, className = _a.className, _h = _a.movementDuration, movementDuration = _h === void 0 ? 2 : _h, _j = _a.borderWidth, borderWidth = _j === void 0 ? 1 : _j, _k = _a.disabled, disabled = _k === void 0 ? true : _k;
    var containerRef = react_1.useRef(null);
    var lastPosition = react_1.useRef({ x: 0, y: 0 });
    var animationFrameRef = react_1.useRef(0);
    var handleMove = react_1.useCallback(function (e) {
        if (!containerRef.current)
            return;
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        animationFrameRef.current = requestAnimationFrame(function () {
            var _a, _b;
            var element = containerRef.current;
            if (!element)
                return;
            var _c = element.getBoundingClientRect(), left = _c.left, top = _c.top, width = _c.width, height = _c.height;
            var mouseX = (_a = e === null || e === void 0 ? void 0 : e.x) !== null && _a !== void 0 ? _a : lastPosition.current.x;
            var mouseY = (_b = e === null || e === void 0 ? void 0 : e.y) !== null && _b !== void 0 ? _b : lastPosition.current.y;
            if (e) {
                lastPosition.current = { x: mouseX, y: mouseY };
            }
            var center = [left + width * 0.5, top + height * 0.5];
            var distanceFromCenter = Math.hypot(mouseX - center[0], mouseY - center[1]);
            var inactiveRadius = 0.5 * Math.min(width, height) * inactiveZone;
            if (distanceFromCenter < inactiveRadius) {
                element.style.setProperty("--active", "0");
                return;
            }
            var isActive = mouseX > left - proximity &&
                mouseX < left + width + proximity &&
                mouseY > top - proximity &&
                mouseY < top + height + proximity;
            element.style.setProperty("--active", isActive ? "1" : "0");
            if (!isActive)
                return;
            var currentAngle = parseFloat(element.style.getPropertyValue("--start")) || 0;
            var targetAngle = (180 * Math.atan2(mouseY - center[1], mouseX - center[0])) /
                Math.PI +
                90;
            var angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180;
            var newAngle = currentAngle + angleDiff;
            framer_motion_1.animate(currentAngle, newAngle, {
                duration: movementDuration,
                ease: [0.16, 1, 0.3, 1],
                onUpdate: function (value) {
                    element.style.setProperty("--start", String(value));
                }
            });
        });
    }, [inactiveZone, proximity, movementDuration]);
    react_1.useEffect(function () {
        if (disabled)
            return;
        var handleScroll = function () { return handleMove(); };
        var handlePointerMove = function (e) { return handleMove(e); };
        window.addEventListener("scroll", handleScroll, { passive: true });
        document.body.addEventListener("pointermove", handlePointerMove, {
            passive: true
        });
        return function () {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            window.removeEventListener("scroll", handleScroll);
            document.body.removeEventListener("pointermove", handlePointerMove);
        };
    }, [handleMove, disabled]);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: utils_1.cn("pointer-events-none absolute -inset-px hidden rounded-[inherit] border opacity-0 transition-opacity", glow && "opacity-100", variant === "white" && "border-white", disabled && "block!") }),
        React.createElement("div", { ref: containerRef, style: {
                "--blur": blur + "px",
                "--spread": spread,
                "--start": "0",
                "--active": "0",
                "--glowingeffect-border-width": borderWidth + "px",
                "--repeating-conic-gradient-times": "5",
                "--gradient": variant === "white"
                    ? "repeating-conic-gradient(\n                  from 236.84deg at 50% 50%,\n                  var(--black),\n                  var(--black) calc(25% / var(--repeating-conic-gradient-times))\n                )"
                    : "radial-gradient(circle, #dd7bbb 10%, #dd7bbb00 20%),\n                radial-gradient(circle at 40% 40%, #d79f1e 5%, #d79f1e00 15%),\n                radial-gradient(circle at 60% 60%, #5a922c 10%, #5a922c00 20%), \n                radial-gradient(circle at 40% 60%, #4c7894 10%, #4c789400 20%),\n                repeating-conic-gradient(\n                  from 236.84deg at 50% 50%,\n                  #dd7bbb 0%,\n                  #d79f1e calc(25% / var(--repeating-conic-gradient-times)),\n                  #5a922c calc(50% / var(--repeating-conic-gradient-times)), \n                  #4c7894 calc(75% / var(--repeating-conic-gradient-times)),\n                  #dd7bbb calc(100% / var(--repeating-conic-gradient-times))\n                )"
            }, className: utils_1.cn("pointer-events-none absolute inset-0 rounded-[inherit] opacity-100 transition-opacity", glow && "opacity-100", blur > 0 && "blur-(--blur) ", className, disabled && "hidden!") },
            React.createElement("div", { className: utils_1.cn("glow", "rounded-[inherit]", 'after:content-[""] after:rounded-[inherit] after:absolute after:inset-[calc(-1*var(--glowingeffect-border-width))]', "after:[border:var(--glowingeffect-border-width)_solid_transparent]", "after:[background:var(--gradient)] after:bg-fixed", "after:opacity-(--active) after:transition-opacity after:duration-300", "after:[mask-clip:padding-box,border-box]", "after:mask-intersect", "after:mask-[linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#00000000_0deg,#fff,#00000000_calc(var(--spread)*2deg))]") }))));
});
exports.GlowingEffect = GlowingEffect;
GlowingEffect.displayName = "GlowingEffect";
