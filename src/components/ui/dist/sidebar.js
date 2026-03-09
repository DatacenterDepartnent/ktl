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
exports.SidebarLink = exports.MobileSidebar = exports.DesktopSidebar = exports.SidebarBody = exports.Sidebar = exports.SidebarProvider = exports.useSidebar = void 0;
var utils_1 = require("@/lib/utils");
var link_1 = require("next/link");
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
var icons_react_1 = require("@tabler/icons-react");
var SidebarContext = react_1.createContext(undefined);
exports.useSidebar = function () {
    var context = react_1.useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
};
exports.SidebarProvider = function (_a) {
    var children = _a.children, openProp = _a.open, setOpenProp = _a.setOpen, _b = _a.animate, animate = _b === void 0 ? true : _b;
    var _c = react_1.useState(false), openState = _c[0], setOpenState = _c[1];
    var open = openProp !== undefined ? openProp : openState;
    var setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;
    return (react_1["default"].createElement(SidebarContext.Provider, { value: { open: open, setOpen: setOpen, animate: animate } }, children));
};
exports.Sidebar = function (_a) {
    var children = _a.children, open = _a.open, setOpen = _a.setOpen, animate = _a.animate;
    return (react_1["default"].createElement(exports.SidebarProvider, { open: open, setOpen: setOpen, animate: animate }, children));
};
exports.SidebarBody = function (props) {
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(exports.DesktopSidebar, __assign({}, props)),
        react_1["default"].createElement(exports.MobileSidebar, __assign({}, props))));
};
exports.DesktopSidebar = function (_a) {
    var className = _a.className, children = _a.children, props = __rest(_a, ["className", "children"]);
    var _b = exports.useSidebar(), open = _b.open, setOpen = _b.setOpen, animate = _b.animate;
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(framer_motion_1.motion.div, __assign({ className: utils_1.cn("hidden h-full w-[300px] shrink-0 bg-neutral-100 px-4 py-4 md:flex md:flex-col dark:bg-neutral-800", className), animate: {
                width: animate ? (open ? "300px" : "60px") : "300px"
            }, onMouseEnter: function () { return setOpen(true); }, onMouseLeave: function () { return setOpen(false); } }, props), children)));
};
exports.MobileSidebar = function (_a) {
    var className = _a.className, children = _a.children, props = __rest(_a, ["className", "children"]);
    var _b = exports.useSidebar(), open = _b.open, setOpen = _b.setOpen;
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement("div", __assign({ className: utils_1.cn("flex h-10 w-full flex-row items-center justify-between bg-neutral-100 px-4 py-4 md:hidden dark:bg-neutral-800") }, props),
            react_1["default"].createElement("div", { className: "z-20 flex w-full justify-end" },
                react_1["default"].createElement(icons_react_1.IconMenu2, { className: "text-neutral-800 dark:text-neutral-200", onClick: function () { return setOpen(!open); } })),
            react_1["default"].createElement(framer_motion_1.AnimatePresence, null, open && (react_1["default"].createElement(framer_motion_1.motion.div, { initial: { x: "-100%", opacity: 0 }, animate: { x: 0, opacity: 1 }, exit: { x: "-100%", opacity: 0 }, transition: {
                    duration: 0.3,
                    ease: "easeInOut"
                }, className: utils_1.cn("fixed inset-0 z-100 flex h-full w-full flex-col justify-between bg-white p-10 dark:bg-neutral-900", className) },
                react_1["default"].createElement("div", { className: "absolute top-10 right-10 z-50 text-neutral-800 dark:text-neutral-200", onClick: function () { return setOpen(!open); } },
                    react_1["default"].createElement(icons_react_1.IconX, null)),
                children))))));
};
exports.SidebarLink = function (_a) {
    var link = _a.link, className = _a.className, props = __rest(_a, ["link", "className"]);
    var _b = exports.useSidebar(), open = _b.open, animate = _b.animate;
    return (react_1["default"].createElement(link_1["default"], __assign({ href: link.href, className: utils_1.cn("group/sidebar flex items-center justify-start gap-2 py-2", className) }, props),
        link.icon,
        react_1["default"].createElement(framer_motion_1.motion.span, { animate: {
                display: animate ? (open ? "inline-block" : "none") : "inline-block",
                opacity: animate ? (open ? 1 : 0) : 1
            }, className: "m-0! inline-block p-0! text-sm whitespace-pre text-neutral-700 transition duration-150 group-hover/sidebar:translate-x-1 dark:text-neutral-200" }, link.label)));
};
