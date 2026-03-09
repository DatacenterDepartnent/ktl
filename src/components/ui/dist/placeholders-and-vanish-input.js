"use client";
"use strict";
exports.__esModule = true;
exports.PlaceholdersAndVanishInput = void 0;
var framer_motion_1 = require("framer-motion");
var react_1 = require("react");
var utils_1 = require("@/lib/utils");
function PlaceholdersAndVanishInput(_a) {
    var placeholders = _a.placeholders, onChange = _a.onChange, onSubmit = _a.onSubmit;
    var _b = react_1.useState(0), currentPlaceholder = _b[0], setCurrentPlaceholder = _b[1];
    var intervalRef = react_1.useRef(null);
    var startAnimation = react_1.useCallback(function () {
        intervalRef.current = setInterval(function () {
            setCurrentPlaceholder(function (prev) { return (prev + 1) % placeholders.length; });
        }, 3000);
    }, [placeholders.length]);
    var handleVisibilityChange = react_1.useCallback(function () {
        if (document.visibilityState !== "visible" && intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        else if (document.visibilityState === "visible") {
            startAnimation();
        }
    }, [startAnimation]);
    react_1.useEffect(function () {
        startAnimation();
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return function () {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [startAnimation, handleVisibilityChange]);
    var canvasRef = react_1.useRef(null);
    var newDataRef = react_1.useRef([]);
    var inputRef = react_1.useRef(null);
    var _c = react_1.useState(""), value = _c[0], setValue = _c[1];
    var _d = react_1.useState(false), animating = _d[0], setAnimating = _d[1];
    var draw = react_1.useCallback(function () {
        if (!inputRef.current)
            return;
        var canvas = canvasRef.current;
        if (!canvas)
            return;
        var ctx = canvas.getContext("2d");
        if (!ctx)
            return;
        canvas.width = 800;
        canvas.height = 800;
        ctx.clearRect(0, 0, 800, 800);
        var computedStyles = getComputedStyle(inputRef.current);
        var fontSize = parseFloat(computedStyles.getPropertyValue("font-size"));
        ctx.font = fontSize * 2 + "px " + computedStyles.fontFamily;
        ctx.fillStyle = "#FFF";
        ctx.fillText(value, 16, 40);
        var imageData = ctx.getImageData(0, 0, 800, 800);
        var pixelData = imageData.data;
        var newData = [];
        for (var t = 0; t < 800; t++) {
            var i = 4 * t * 800; // ✅ เปลี่ยนเป็น const
            for (var n = 0; n < 800; n++) {
                var e = i + 4 * n; // ✅ เปลี่ยนเป็น const
                if (pixelData[e] !== 0 &&
                    pixelData[e + 1] !== 0 &&
                    pixelData[e + 2] !== 0) {
                    newData.push({
                        x: n,
                        y: t,
                        color: [
                            pixelData[e],
                            pixelData[e + 1],
                            pixelData[e + 2],
                            pixelData[e + 3],
                        ]
                    });
                }
            }
        }
        newDataRef.current = newData.map(function (_a) {
            var x = _a.x, y = _a.y, color = _a.color;
            return ({
                x: x,
                y: y,
                r: 1,
                color: "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", " + color[3] + ")"
            });
        });
    }, [value]);
    react_1.useEffect(function () {
        draw();
    }, [value, draw]);
    var animate = function (start) {
        var animateFrame = function (pos) {
            if (pos === void 0) { pos = 0; }
            requestAnimationFrame(function () {
                var _a;
                var newArr = [];
                for (var i = 0; i < newDataRef.current.length; i++) {
                    var current = newDataRef.current[i];
                    if (current.x < pos) {
                        newArr.push(current);
                    }
                    else {
                        if (current.r <= 0) {
                            current.r = 0;
                            continue;
                        }
                        current.x += Math.random() > 0.5 ? 1 : -1;
                        current.y += Math.random() > 0.5 ? 1 : -1;
                        current.r -= 0.05 * Math.random();
                        newArr.push(current);
                    }
                }
                newDataRef.current = newArr;
                var ctx = (_a = canvasRef.current) === null || _a === void 0 ? void 0 : _a.getContext("2d");
                if (ctx) {
                    ctx.clearRect(pos, 0, 800, 800);
                    newDataRef.current.forEach(function (t) {
                        var n = t.x, i = t.y, s = t.r, color = t.color;
                        if (n > pos) {
                            ctx.beginPath();
                            ctx.rect(n, i, s, s);
                            ctx.fillStyle = color;
                            ctx.strokeStyle = color;
                            ctx.stroke();
                        }
                    });
                }
                if (newDataRef.current.length > 0) {
                    animateFrame(pos - 8);
                }
                else {
                    setValue("");
                    setAnimating(false);
                }
            });
        };
        animateFrame(start);
    };
    var vanishAndSubmit = react_1.useCallback(function () {
        var _a;
        setAnimating(true);
        draw();
        var val = ((_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.value) || "";
        if (val && inputRef.current) {
            var maxX = newDataRef.current.reduce(function (prev, current) { return (current.x > prev ? current.x : prev); }, 0);
            animate(maxX);
        }
    }, [draw]);
    var handleKeyDown = function (e) {
        if (e.key === "Enter" && !animating) {
            vanishAndSubmit();
        }
    };
    var handleSubmit = function (e) {
        e.preventDefault();
        vanishAndSubmit();
        if (onSubmit) {
            // ✅ แก้ไข Short-circuit เป็น If-statement
            onSubmit(e);
        }
    };
    return (React.createElement("form", { className: utils_1.cn("relative mx-auto h-12 w-full max-w-xl overflow-hidden rounded-full bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] transition duration-200 dark:bg-zinc-800", value && "bg-gray-50"), onSubmit: handleSubmit },
        React.createElement("canvas", { className: utils_1.cn("pointer-events-none absolute left-2 top-[20%] origin-top-left scale-50 transform pr-20 text-base invert filter dark:invert-0 sm:left-8", !animating ? "opacity-0" : "opacity-100"), ref: canvasRef }),
        React.createElement("input", { onChange: function (e) {
                if (!animating) {
                    setValue(e.target.value);
                    if (onChange) {
                        // ✅ แก้ไข Short-circuit เป็น If-statement
                        onChange(e);
                    }
                }
            }, onKeyDown: handleKeyDown, ref: inputRef, value: value, type: "text", className: utils_1.cn("relative z-50 h-full w-full rounded-full border-none bg-transparent pl-4 pr-20 text-sm text-black focus:outline-none focus:ring-0 dark:text-white sm:pl-10 sm:text-base", animating && "text-transparent dark:text-transparent") }),
        React.createElement("button", { disabled: !value, type: "submit", className: "absolute right-2 top-1/2 z-50 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black transition duration-200 disabled:bg-gray-100 dark:bg-zinc-900 dark:disabled:bg-zinc-800" },
            React.createElement(framer_motion_1.motion.svg, { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "h-4 w-4 text-gray-300" },
                React.createElement("path", { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
                React.createElement(framer_motion_1.motion.path, { d: "M5 12l14 0", initial: {
                        strokeDasharray: "50%",
                        strokeDashoffset: "50%"
                    }, animate: {
                        strokeDashoffset: value ? 0 : "50%"
                    }, transition: {
                        duration: 0.3,
                        ease: "linear"
                    } }),
                React.createElement("path", { d: "M13 18l6 -6" }),
                React.createElement("path", { d: "M13 6l6 6" }))),
        React.createElement("div", { className: "pointer-events-none absolute inset-0 flex items-center rounded-full" },
            React.createElement(framer_motion_1.AnimatePresence, { mode: "wait" }, !value && (React.createElement(framer_motion_1.motion.p, { initial: {
                    y: 5,
                    opacity: 0
                }, key: "current-placeholder-" + currentPlaceholder, animate: {
                    y: 0,
                    opacity: 1
                }, exit: {
                    y: -15,
                    opacity: 0
                }, transition: {
                    duration: 0.3,
                    ease: "linear"
                }, className: "w-[calc(100%-2rem)] truncate pl-4 text-left text-sm font-normal text-neutral-500 dark:text-zinc-500 sm:pl-12 sm:text-base" }, placeholders[currentPlaceholder]))))));
}
exports.PlaceholdersAndVanishInput = PlaceholdersAndVanishInput;
