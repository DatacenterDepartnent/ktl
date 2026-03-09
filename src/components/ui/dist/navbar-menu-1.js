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
exports.HoveredLink1 = exports.ProductItem = exports.Menu1 = exports.MenuItem1 = void 0;
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
var link_1 = require("next/link");
var image_1 = require("@heroui/image");
var transition = {};
exports.MenuItem1 = function (_a) {
    var setActive = _a.setActive, active = _a.active, item = _a.item, children = _a.children;
    return (react_1["default"].createElement("div", { onMouseEnter: function () { return setActive(item); }, className: " " },
        react_1["default"].createElement(framer_motion_1.motion.div, null, item),
        active !== null && (react_1["default"].createElement(framer_motion_1.motion.div, null, active === item && (react_1["default"].createElement("div", null,
            react_1["default"].createElement(framer_motion_1.motion.div, { transition: transition, layoutId: " " // layoutId ensures smooth animation
                , className: " " },
                react_1["default"].createElement(framer_motion_1.motion.div, { layout // layout ensures smooth animation
                    : true, className: "p-2" }, children))))))));
};
exports.Menu1 = function (_a) {
    var setActive = _a.setActive, children = _a.children;
    return (react_1["default"].createElement("nav", { onMouseLeave: function () { return setActive(null); }, className: "px-8" }, children));
};
exports.ProductItem = function (_a) {
    var title = _a.title, description = _a.description, href = _a.href, src = _a.src;
    return (react_1["default"].createElement(link_1["default"], { href: href, className: " " },
        react_1["default"].createElement(image_1.Image, { src: src, className: " " }),
        react_1["default"].createElement("div", null,
            react_1["default"].createElement("h4", { className: " " }, title),
            react_1["default"].createElement("p", { className: " " }, description))));
};
exports.HoveredLink1 = function (_a) {
    var children = _a.children, rest = __rest(_a, ["children"]);
    return (react_1["default"].createElement(link_1["default"], __assign({}, rest, { className: "text-neutral-700 hover:text-sky-600 dark:text-neutral-200 dark:hover:text-sky-700" }),
        react_1["default"].createElement("div", { className: "px-2 py-2" }, children)));
};
