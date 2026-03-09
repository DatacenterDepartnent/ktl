// src/components/SuveryList.tsx
"use client";
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_1 = require("react");
var hi_1 = require("react-icons/hi");
var SuveryModal_1 = require("@/components/SuveryModal");
var CustomAlertDialog_1 = require("./CustomAlertDialog");
// ---------------------------------------------
// Admin Password
// ---------------------------------------------
var ADMIN_PASSWORD = "admin1234";
// ---------------------------------------------
// Helpers & Constants
// ---------------------------------------------
var formatDate = function (iso) {
    if (!iso)
        return "N/A";
    var d = new Date(iso);
    if (isNaN(d.getTime()))
        return "Invalid Date";
    return d.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};
var STATUS_COLOR_MAP = {
    "1": "text-red-700 bg-red-100 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
    "2": "text-green-700 bg-green-100 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
    ไม่ได้ทำงาน: "text-red-700 bg-red-100 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
    ทำงานแล้ว: "text-green-700 bg-green-100 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
};
// ---------------------------------------------
// Sub-Components (เพื่อลด code duplicate)
// ---------------------------------------------
// 1. Badge แสดงสถานะ
var StatusBadge = function (_a) {
    var status = _a.status;
    var statusColor = STATUS_COLOR_MAP[status || ""] ||
        "text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600";
    return (react_1["default"].createElement("span", { className: "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap " + statusColor }, status === "1"
        ? "ไม่ได้ทำงาน"
        : status === "2"
            ? "ทำงานแล้ว"
            : status || "ไม่ระบุ"));
};
// 2. ปุ่ม Action (Edit, View, Delete)
var ActionButtons = function (_a) {
    var suvery = _a.suvery, onDetailClick = _a.onDetailClick;
    return (react_1["default"].createElement("div", { className: "flex items-center gap-1 sm:gap-2" },
        react_1["default"].createElement("button", { onClick: function (e) {
                e.stopPropagation();
                onDetailClick(suvery, "edit");
            }, className: "rounded-lg p-2 text-gray-400 transition-colors hover:bg-yellow-50 hover:text-yellow-600 dark:hover:bg-yellow-900/20 dark:hover:text-yellow-400", title: "\u0E41\u0E01\u0E49\u0E44\u0E02" },
            react_1["default"].createElement(hi_1.HiPencilAlt, { size: 20 })),
        react_1["default"].createElement("button", { onClick: function (e) {
                e.stopPropagation();
                onDetailClick(suvery, "view");
            }, className: "rounded-lg p-2 text-blue-500 transition-colors hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20 dark:hover:text-blue-300", title: "\u0E14\u0E39\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14" },
            react_1["default"].createElement(hi_1.HiEye, { size: 20 })),
        react_1["default"].createElement("button", { onClick: function (e) {
                e.stopPropagation();
                onDetailClick(suvery, "delete");
            }, className: "rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300", title: "\u0E25\u0E1A" },
            react_1["default"].createElement(hi_1.HiTrash, { size: 20 }))));
};
// 3. Desktop Table Row
var DesktopTableRow = function (_a) {
    var suvery = _a.suvery, onDetailClick = _a.onDetailClick;
    return (react_1["default"].createElement("tr", { className: "cursor-pointer border-b border-gray-100 transition-colors hover:bg-blue-50/50 dark:border-gray-700 dark:hover:bg-gray-700/50", onClick: function () { return onDetailClick(suvery, "view"); } },
        react_1["default"].createElement("td", { className: "px-4 py-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-100" }, suvery.fullName),
        react_1["default"].createElement("td", { className: "px-4 py-4 whitespace-nowrap" },
            react_1["default"].createElement(StatusBadge, { status: suvery.currentStatus || "" })),
        react_1["default"].createElement("td", { className: "px-4 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400" }, formatDate(suvery.submittedAt)),
        react_1["default"].createElement("td", { className: "px-4 py-4 text-right whitespace-nowrap" },
            react_1["default"].createElement("div", { className: "flex justify-end" },
                react_1["default"].createElement(ActionButtons, { suvery: suvery, onDetailClick: onDetailClick })))));
};
// 4. Mobile Card Item
var MobileCardItem = function (_a) {
    var suvery = _a.suvery, onDetailClick = _a.onDetailClick;
    return (react_1["default"].createElement("div", { className: "flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800", onClick: function () { return onDetailClick(suvery, "view"); } },
        react_1["default"].createElement("div", { className: "flex items-start justify-between gap-2" },
            react_1["default"].createElement("h3", { className: "line-clamp-2 text-sm font-bold text-gray-900 dark:text-white" }, suvery.fullName),
            react_1["default"].createElement(StatusBadge, { status: suvery.currentStatus || "" })),
        react_1["default"].createElement("div", { className: "text-xs text-gray-500 dark:text-gray-400" },
            react_1["default"].createElement("span", { className: "mr-1 font-medium" }, "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E40\u0E21\u0E37\u0E48\u0E2D:"),
            formatDate(suvery.submittedAt)),
        react_1["default"].createElement("div", { className: "h-px w-full bg-gray-100 dark:bg-gray-700" }),
        react_1["default"].createElement("div", { className: "flex items-center justify-end" },
            react_1["default"].createElement(ActionButtons, { suvery: suvery, onDetailClick: onDetailClick }))));
};
// ---------------------------------------------
// Component: DeleteConfirmModal
// ---------------------------------------------
var DeleteConfirmModal = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, onConfirm = _a.onConfirm, fullName = _a.fullName, isDeleting = _a.isDeleting;
    if (!isOpen)
        return null;
    return (react_1["default"].createElement("div", { className: "fixed inset-0 z-60 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm transition-opacity" },
        react_1["default"].createElement("div", { className: "w-full max-w-sm scale-100 transform overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl transition-all dark:border-gray-700 dark:bg-gray-800" },
            react_1["default"].createElement("div", { className: "flex flex-col items-center p-6 pb-0 text-center" },
                react_1["default"].createElement("div", { className: "mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30" },
                    react_1["default"].createElement(hi_1.HiTrash, { className: "h-8 w-8 text-red-600 dark:text-red-400" })),
                react_1["default"].createElement("h3", { className: "mb-2 text-xl font-bold text-gray-900 dark:text-white" }, "\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E01\u0E32\u0E23\u0E25\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25"),
                react_1["default"].createElement("p", { className: "text-sm leading-relaxed text-gray-500 dark:text-gray-400" },
                    "\u0E04\u0E38\u0E13\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E25\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E02\u0E2D\u0E07 ",
                    react_1["default"].createElement("br", null),
                    react_1["default"].createElement("span", { className: "text-base font-semibold text-gray-800 dark:text-gray-200" },
                        "\"",
                        fullName,
                        "\""),
                    react_1["default"].createElement("br", null),
                    "\u0E43\u0E0A\u0E48\u0E2B\u0E23\u0E37\u0E2D\u0E44\u0E21\u0E48? \u0E01\u0E32\u0E23\u0E01\u0E23\u0E30\u0E17\u0E33\u0E19\u0E35\u0E49\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E22\u0E49\u0E2D\u0E19\u0E01\u0E25\u0E31\u0E1A\u0E44\u0E14\u0E49")),
            react_1["default"].createElement("div", { className: "flex gap-3 p-6" },
                react_1["default"].createElement("button", { onClick: onClose, disabled: isDeleting, className: "text-gray-5000 flex-1 rounded-xl bg-gray-100 px-4 py-2.5 font-medium transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600" }, "\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01"),
                react_1["default"].createElement("button", { onClick: onConfirm, disabled: isDeleting, className: "flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 font-medium text-white shadow-lg shadow-red-500/30 transition-all hover:bg-red-700 disabled:opacity-70" }, isDeleting ? "กำลังลบ..." : "ลบข้อมูล")))));
};
// ---------------------------------------------
// Component: PasswordModal
// ---------------------------------------------
var PasswordModal = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, onSuccess = _a.onSuccess, expectedPassword = _a.expectedPassword, suveryIdToDelete = _a.suveryIdToDelete, onDeleteConfirmed = _a.onDeleteConfirmed;
    var _b = react_1.useState(""), password = _b[0], setPassword = _b[1];
    var _c = react_1.useState(""), error = _c[0], setError = _c[1];
    if (!isOpen)
        return null;
    var handleVerify = function () {
        if (password === ADMIN_PASSWORD || password === expectedPassword) {
            if (suveryIdToDelete) {
                onDeleteConfirmed(suveryIdToDelete);
            }
            else {
                onSuccess();
            }
        }
        else {
            setError("รหัสผ่านไม่ถูกต้อง โปรดลองอีกครั้ง");
            setPassword("");
        }
    };
    return (react_1["default"].createElement("div", { className: "fixed inset-0 z-70 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" },
        react_1["default"].createElement("div", { className: "w-full max-w-sm rounded-xl border border-gray-100 bg-white p-6 shadow-2xl sm:p-8 dark:border-gray-700 dark:bg-gray-800" },
            react_1["default"].createElement("h3", { className: "mb-4 text-center text-xl font-bold text-green-700 dark:text-green-400" }, "\uD83D\uDD10 \u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E48\u0E32\u0E19"),
            react_1["default"].createElement("p", { className: "mb-4 text-center text-sm text-gray-600 dark:text-gray-300" },
                "\u0E1B\u0E49\u0E2D\u0E19\u0E23\u0E2B\u0E31\u0E2A\u0E19\u0E31\u0E01\u0E28\u0E36\u0E01\u0E29\u0E32 ",
                react_1["default"].createElement("b", null, "\u0E2B\u0E23\u0E37\u0E2D"),
                " \u0E23\u0E2B\u0E31\u0E2A Admin"),
            react_1["default"].createElement("input", { type: "password", value: password, onChange: function (e) {
                    setPassword(e.target.value);
                    setError("");
                }, onKeyDown: function (e) { return e.key === "Enter" && handleVerify(); }, placeholder: "\u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E48\u0E32\u0E19", className: "mb-3 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white", autoFocus: true }),
            error && (react_1["default"].createElement("p", { className: "mb-3 text-center text-sm text-red-600 dark:text-red-400" }, error)),
            react_1["default"].createElement("div", { className: "mt-4 flex flex-col gap-3 sm:flex-row" },
                react_1["default"].createElement("button", { onClick: function () {
                        onClose();
                        setPassword("");
                        setError("");
                    }, className: "order-2 w-full rounded-lg bg-gray-100 px-4 py-2 text-gray-600 transition-colors hover:bg-gray-200 sm:order-1 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600" }, "\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01"),
                react_1["default"].createElement("button", { onClick: handleVerify, className: "order-1 w-full rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 sm:order-2 dark:focus:ring-blue-800" }, "\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19")))));
};
// ---------------------------------------------
// Main: SuveryList
// ---------------------------------------------
var SuveryList = function (_a) {
    var suverys = _a.suverys, isLoading = _a.isLoading, isError = _a.isError;
    var _b = react_1.useState(null), selectedSuvery = _b[0], setSelectedSuvery = _b[1];
    var _c = react_1.useState(null), verifiedSuveryId = _c[0], setVerifiedSuveryId = _c[1];
    var _d = react_1.useState(false), isDetailModalOpen = _d[0], setIsDetailModalOpen = _d[1];
    // Modal Password & Action states
    var _e = react_1.useState(false), isPasswordModalOpen = _e[0], setIsPasswordModalOpen = _e[1];
    var _f = react_1.useState(null), pendingAction = _f[0], setPendingAction = _f[1];
    var _g = react_1.useState(null), targetId = _g[0], setTargetId = _g[1];
    var _h = react_1.useState(""), studentPassword = _h[0], setStudentPassword = _h[1];
    // Delete Modal States
    var _j = react_1.useState(false), isDeleteConfirmOpen = _j[0], setIsDeleteConfirmOpen = _j[1];
    var _k = react_1.useState(false), isDeletingProcess = _k[0], setIsDeletingProcess = _k[1];
    // Custom Alert
    var _l = react_1.useState(false), isCustomAlertOpen = _l[0], setIsCustomAlertOpen = _l[1];
    var _m = react_1.useState({
        title: "",
        message: "",
        type: "info"
    }), alertContent = _m[0], setAlertContent = _m[1];
    var handleProtectedAction = function (suvery, action) {
        setSelectedSuvery(suvery);
        setPendingAction(action);
        setTargetId(suvery._id);
        setStudentPassword(suvery.studentId);
        if (verifiedSuveryId === suvery._id) {
            executeAction(suvery, action);
        }
        else {
            setIsPasswordModalOpen(true);
        }
    };
    var executeAction = function (suvery, action) {
        var encoded = btoa(suvery._id);
        if (action === "view") {
            setIsDetailModalOpen(true);
            return;
        }
        if (action === "edit") {
            window.location.href = "/suvery/edit/" + encoded;
            return;
        }
        if (action === "delete") {
            setIsDeleteConfirmOpen(true);
            return;
        }
    };
    var onPasswordSuccess = function () {
        if (selectedSuvery)
            setVerifiedSuveryId(selectedSuvery._id);
        setIsPasswordModalOpen(false);
        if (selectedSuvery && pendingAction) {
            executeAction(selectedSuvery, pendingAction);
        }
        setPendingAction(null);
    };
    var handlePasswordConfirmedDelete = function (id) {
        setIsPasswordModalOpen(false);
        setIsDeleteConfirmOpen(true);
        setPendingAction(null);
    };
    var confirmDelete = function () { return __awaiter(void 0, void 0, void 0, function () {
        var res, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selectedSuvery)
                        return [2 /*return*/];
                    setIsDeletingProcess(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, fetch("/api/suvery?id=" + selectedSuvery._id, {
                            method: "DELETE"
                        })];
                case 2:
                    res = _a.sent();
                    if (res.ok) {
                        setIsDeleteConfirmOpen(false);
                        setAlertContent({
                            title: "ลบสำเร็จ!",
                            message: "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E16\u0E39\u0E01\u0E25\u0E1A\u0E41\u0E25\u0E49\u0E27",
                            type: "success"
                        });
                        setIsCustomAlertOpen(true);
                        setTimeout(function () { return window.location.reload(); }, 600);
                    }
                    else {
                        throw new Error("ไม่สามารถลบข้อมูลได้");
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    setIsDeleteConfirmOpen(false);
                    setAlertContent({
                        title: "Error",
                        message: "ไม่สามารถติดต่อเซิร์ฟเวอร์ได้",
                        type: "error"
                    });
                    setIsCustomAlertOpen(true);
                    return [3 /*break*/, 5];
                case 4:
                    setIsDeletingProcess(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // -------------------------
    // Render States
    // -------------------------
    if (isLoading)
        return (react_1["default"].createElement("div", { className: "flex h-40 items-center justify-center" },
            react_1["default"].createElement("div", { className: "flex flex-col items-center gap-2" },
                react_1["default"].createElement("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" }),
                react_1["default"].createElement("p", { className: "text-gray-500 dark:text-gray-400" }, "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25..."))));
    if (isError)
        return (react_1["default"].createElement("div", { className: "rounded-xl bg-red-50 p-6 text-center text-red-600 dark:bg-red-900/20 dark:text-red-400" },
            react_1["default"].createElement("p", null, "\u0E42\u0E2B\u0E25\u0E14\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E25\u0E49\u0E21\u0E40\u0E2B\u0E25\u0E27 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48\u0E20\u0E32\u0E22\u0E2B\u0E25\u0E31\u0E07")));
    if (suverys.length === 0)
        return (react_1["default"].createElement("div", { className: "rounded-xl border border-dashed border-gray-300 p-10 text-center dark:border-gray-700" },
            react_1["default"].createElement("p", { className: "text-gray-500 dark:text-gray-400" }, "\u0E44\u0E21\u0E48\u0E21\u0E35\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E2A\u0E33\u0E23\u0E27\u0E08")));
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement("div", { className: "grid grid-cols-1 gap-4 md:hidden" }, suverys.map(function (sv) { return (react_1["default"].createElement(MobileCardItem, { key: sv._id, suvery: sv, onDetailClick: handleProtectedAction })); })),
        react_1["default"].createElement("div", { className: "hidden rounded-xl border border-gray-100 bg-white shadow-lg md:block dark:border-gray-700 dark:bg-gray-800" },
            react_1["default"].createElement("div", { className: "overflow-x-auto" },
                react_1["default"].createElement("table", { className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700" },
                    react_1["default"].createElement("thead", { className: "bg-blue-50 dark:bg-gray-700/50" },
                        react_1["default"].createElement("tr", null,
                            react_1["default"].createElement("th", { className: "px-4 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase dark:text-gray-300" }, "\u0E0A\u0E37\u0E48\u0E2D-\u0E2A\u0E01\u0E38\u0E25"),
                            react_1["default"].createElement("th", { className: "px-4 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase dark:text-gray-300" }, "\u0E2A\u0E16\u0E32\u0E19\u0E30\u0E07\u0E32\u0E19"),
                            react_1["default"].createElement("th", { className: "px-4 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase dark:text-gray-300" }, "\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E01\u0E23\u0E2D\u0E01"),
                            react_1["default"].createElement("th", { className: "px-4 py-3 text-right text-xs font-semibold tracking-wider text-gray-600 uppercase dark:text-gray-300" }, "\u0E08\u0E31\u0E14\u0E01\u0E32\u0E23"))),
                    react_1["default"].createElement("tbody", { className: "divide-y divide-gray-100 bg-white dark:divide-gray-700 dark:bg-gray-800" }, suverys.map(function (sv) { return (react_1["default"].createElement(DesktopTableRow, { key: sv._id, suvery: sv, onDetailClick: handleProtectedAction })); }))))),
        isDetailModalOpen && selectedSuvery && (react_1["default"].createElement(SuveryModal_1["default"], { suvery: selectedSuvery, isOpen: isDetailModalOpen, onClose: function () { return setIsDetailModalOpen(false); } })),
        react_1["default"].createElement(PasswordModal, { isOpen: isPasswordModalOpen, onClose: function () { return setIsPasswordModalOpen(false); }, onSuccess: onPasswordSuccess, expectedPassword: studentPassword, suveryIdToDelete: pendingAction === "delete" ? targetId : null, onDeleteConfirmed: handlePasswordConfirmedDelete }),
        react_1["default"].createElement(DeleteConfirmModal, { isOpen: isDeleteConfirmOpen, onClose: function () { return setIsDeleteConfirmOpen(false); }, onConfirm: confirmDelete, fullName: (selectedSuvery === null || selectedSuvery === void 0 ? void 0 : selectedSuvery.fullName) || "", isDeleting: isDeletingProcess }),
        react_1["default"].createElement(CustomAlertDialog_1["default"], { isOpen: isCustomAlertOpen, onClose: function () { return setIsCustomAlertOpen(false); }, title: alertContent.title, message: alertContent.message, type: alertContent.type, confirmText: "\u0E23\u0E31\u0E1A\u0E17\u0E23\u0E32\u0E1A" })));
};
exports["default"] = SuveryList;
