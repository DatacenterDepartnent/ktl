"use client";
"use strict";
exports.__esModule = true;
exports.useOutsideClick = exports.ModalFooter = exports.ModalContent = exports.ModalBody = exports.ModalTrigger = exports.Modal = exports.useModal = exports.ModalProvider = void 0;
var utils_1 = require("@/lib/utils");
var react_1 = require("motion/react");
var react_2 = require("react");
var ModalContext = react_2.createContext(undefined);
exports.ModalProvider = function (_a) {
    var children = _a.children;
    var _b = react_2.useState(false), open = _b[0], setOpen = _b[1];
    return (react_2["default"].createElement(ModalContext.Provider, { value: { open: open, setOpen: setOpen } }, children));
};
exports.useModal = function () {
    var context = react_2.useContext(ModalContext);
    if (!context) {
        throw new Error("useModal must be used within a ModalProvider");
    }
    return context;
};
function Modal(_a) {
    var children = _a.children;
    return react_2["default"].createElement(exports.ModalProvider, null, children);
}
exports.Modal = Modal;
exports.ModalTrigger = function (_a) {
    var children = _a.children, className = _a.className;
    var setOpen = exports.useModal().setOpen;
    return (react_2["default"].createElement("button", { className: utils_1.cn("px-4 py-2 rounded-md text-black dark:text-white text-center relative overflow-hidden", className), onClick: function () { return setOpen(true); } }, children));
};
exports.ModalBody = function (_a) {
    var children = _a.children, className = _a.className;
    var open = exports.useModal().open;
    react_2.useEffect(function () {
        if (open) {
            document.body.style.overflow = "hidden";
        }
        else {
            document.body.style.overflow = "auto";
        }
    }, [open]);
    var modalRef = react_2.useRef(null);
    var setOpen = exports.useModal().setOpen;
    exports.useOutsideClick(modalRef, function () { return setOpen(false); });
    return (react_2["default"].createElement(react_1.AnimatePresence, null, open && (react_2["default"].createElement(react_1.motion.div, { initial: {
            opacity: 0
        }, animate: {
            opacity: 1,
            backdropFilter: "blur(10px)"
        }, exit: {
            opacity: 0,
            backdropFilter: "blur(0px)"
        }, className: "fixed perspective-midrange transform-3d inset-0 h-full w-full  flex items-center justify-center z-50" },
        react_2["default"].createElement(Overlay, null),
        react_2["default"].createElement(react_1.motion.div, { ref: modalRef, className: utils_1.cn("min-h-[50%] max-h-[90%] md:max-w-[40%] bg-white dark:bg-neutral-950 border border-transparent dark:border-neutral-800 md:rounded-2xl relative z-50 flex flex-col flex-1 overflow-hidden", className), initial: {
                opacity: 0,
                scale: 0.5,
                rotateX: 40,
                y: 40
            }, animate: {
                opacity: 1,
                scale: 1,
                rotateX: 0,
                y: 0
            }, exit: {
                opacity: 0,
                scale: 0.8,
                rotateX: 10
            }, transition: {
                type: "spring",
                stiffness: 260,
                damping: 15
            } },
            react_2["default"].createElement(CloseIcon, null),
            children)))));
};
exports.ModalContent = function (_a) {
    var children = _a.children, className = _a.className;
    return (react_2["default"].createElement("div", { className: utils_1.cn("flex flex-col flex-1 p-8 md:p-10", className) }, children));
};
exports.ModalFooter = function (_a) {
    var children = _a.children, className = _a.className;
    return (react_2["default"].createElement("div", { className: utils_1.cn("flex justify-end p-4 bg-gray-100 dark:bg-neutral-900", className) }, children));
};
var Overlay = function (_a) {
    var className = _a.className;
    return (react_2["default"].createElement(react_1.motion.div, { initial: {
            opacity: 0
        }, animate: {
            opacity: 1,
            backdropFilter: "blur(10px)"
        }, exit: {
            opacity: 0,
            backdropFilter: "blur(0px)"
        }, className: "fixed inset-0 h-full w-full bg-black bg-opacity-50 z-50 " + className }));
};
var CloseIcon = function () {
    var setOpen = exports.useModal().setOpen;
    return (react_2["default"].createElement("button", { onClick: function () { return setOpen(false); }, className: "absolute top-4 right-4 group" },
        react_2["default"].createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "text-black dark:text-white h-4 w-4 group-hover:scale-125 group-hover:rotate-3 transition duration-200" },
            react_2["default"].createElement("path", { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
            react_2["default"].createElement("path", { d: "M18 6l-12 12" }),
            react_2["default"].createElement("path", { d: "M6 6l12 12" }))));
};
// Hook to detect clicks outside of a component.
// Add it in a separate file, I've added here for simplicity
exports.useOutsideClick = function (ref, callback) {
    react_2.useEffect(function () {
        var listener = function (event) {
            // DO NOTHING if the element being clicked is the target element or their children
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }
            callback(event);
        };
        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);
        return function () {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [ref, callback]);
};
