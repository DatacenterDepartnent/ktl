// src/components/CustomAlertDialog.tsx
"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
// -----------------------------------------------------------------
// --- Component: CustomAlertDialog ---
// -----------------------------------------------------------------
var CustomAlertDialog = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, _b = _a.title, title = _b === void 0 ? "แจ้งเตือน" : _b, message = _a.message, _c = _a.confirmText, confirmText = _c === void 0 ? "ตกลง" : _c, onConfirm = _a.onConfirm, _d = _a.type, type = _d === void 0 ? "info" : _d;
    if (!isOpen)
        return null;
    // กำหนดสีและไอคอนตามประเภท
    var getStyles = function () {
        switch (type) {
            case "success":
                return {
                    color: "text-green-700",
                    bg: "bg-green-50",
                    icon: (react_1["default"].createElement("svg", { className: "h-6 w-6 text-green-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                        react_1["default"].createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" })))
                };
            case "error":
                return {
                    color: "text-red-700",
                    bg: "bg-red-50",
                    icon: (react_1["default"].createElement("svg", { className: "h-6 w-6 text-red-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                        react_1["default"].createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" })))
                };
            case "warning":
                return {
                    color: "text-yellow-700",
                    bg: "bg-yellow-50",
                    icon: (react_1["default"].createElement("svg", { className: "h-6 w-6 text-yellow-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                        react_1["default"].createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" })))
                };
            case "info":
            default:
                return {
                    color: "text-indigo-700",
                    bg: "bg-indigo-50",
                    icon: (react_1["default"].createElement("svg", { className: "h-6 w-6 text-indigo-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg" },
                        react_1["default"].createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })))
                };
        }
    };
    var styles = getStyles();
    var handleAction = function () {
        if (onConfirm) {
            onConfirm();
        }
        onClose(); // ปิด Modal เสมอหลังดำเนินการ
    };
    return (
    // Backdrop: พื้นหลังเบลอ
    react_1["default"].createElement("div", { className: "fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm backdrop-filter transition-opacity duration-300", "aria-labelledby": "alert-dialog-title", role: "dialog", "aria-modal": "true" },
        react_1["default"].createElement("div", { className: "w-full max-w-sm scale-100 transform rounded-xl border bg-white p-6 shadow-2xl transition-transform duration-300 " + styles.bg },
            react_1["default"].createElement("div", { className: "mb-4 flex items-center space-x-3" },
                styles.icon,
                react_1["default"].createElement("h3", { className: "text-xl font-bold " + styles.color }, title)),
            react_1["default"].createElement("div", { className: "text-gray-5000 mb-6 text-sm leading-relaxed" }, message),
            react_1["default"].createElement("div", { className: "flex justify-end space-x-3" },
                react_1["default"].createElement("button", { onClick: handleAction, className: "rounded-lg px-4 py-2 font-semibold shadow-md transition " + styles.color.replace("text-", "bg-").replace("-700", "-600") + " " + styles.color.replace("text-", "hover:bg-").replace("-700", "-700") + " text-white" }, confirmText),
                onConfirm && (react_1["default"].createElement("button", { onClick: onClose, className: "text-gray-5000 rounded-lg bg-gray-200 px-4 py-2 shadow-md transition hover:bg-gray-300" }, "\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01"))))));
};
exports["default"] = CustomAlertDialog;
