// src/components/SuveryEditForm.tsx
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
var navigation_1 = require("next/navigation");
var link_1 = require("next/link");
var lucide_react_1 = require("lucide-react");
var COLLEGE_NAME = "วิทยาลัยเทคนิคกันทรลักษ์";
var COLLEGE_PROVINCE = "ศรีสะเกษ";
// ✅ Styles: blue/Green Theme & Dark Mode Support (Same as GraduatesuveryForm)
var inputClass = "w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 shadow-sm transition duration-150";
var labelClass = "block text-sm font-medium text-gray-5000 dark:text-gray-300 mb-1";
var sectionTitleClass = "text-2xl font-extrabold text-green-800 dark:text-green-400 mb-6 flex items-center gap-3";
var FormSection = function (_a) {
    var title = _a.title, Icon = _a.icon, children = _a.children;
    return (react_1["default"].createElement("div", { className: "mb-8" },
        react_1["default"].createElement("h2", { className: sectionTitleClass },
            react_1["default"].createElement(Icon, { className: "h-6 w-6 text-blue-600 dark:text-blue-400" }),
            title),
        react_1["default"].createElement("div", { className: "space-y-6" }, children)));
};
// ✅ Component: Custom Alert Modal
var CustomAlertModal = function (_a) {
    var isOpen = _a.isOpen, type = _a.type, title = _a.title, message = _a.message, onClose = _a.onClose;
    if (!isOpen)
        return null;
    return (react_1["default"].createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity" },
        react_1["default"].createElement("div", { className: "w-full max-w-sm scale-100 transform overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl transition-all dark:border-gray-700 dark:bg-gray-800" },
            react_1["default"].createElement("div", { className: "p-6 text-center" },
                react_1["default"].createElement("div", { className: "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full " + (type === "success" ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30") }, type === "success" ? (react_1["default"].createElement(lucide_react_1.CheckCircle, { className: "h-10 w-10 text-green-600 dark:text-green-400" })) : (react_1["default"].createElement(lucide_react_1.AlertCircle, { className: "h-10 w-10 text-red-600 dark:text-red-400" }))),
                react_1["default"].createElement("h3", { className: "mb-2 text-xl font-bold text-gray-900 dark:text-white" }, title),
                react_1["default"].createElement("p", { className: "text-sm text-gray-500 dark:text-gray-300" }, message)),
            react_1["default"].createElement("div", { className: "flex justify-center bg-gray-50 px-6 py-4 dark:bg-gray-700/50" },
                react_1["default"].createElement("button", { onClick: onClose, className: "inline-flex w-full justify-center rounded-xl px-4 py-2 text-base font-medium text-white shadow-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none sm:text-sm " + (type === "success" ? "bg-green-600 hover:bg-green-700 focus:ring-green-500" : "bg-red-600 hover:bg-red-700 focus:ring-red-500") }, "\u0E15\u0E01\u0E25\u0E07")))));
};
var SuveryEditForm = function (_a) {
    var suvery = _a.suvery;
    var router = navigation_1.useRouter();
    var _b = react_1.useState(false), isLoading = _b[0], setIsLoading = _b[1];
    var _c = react_1.useState(__assign({}, suvery)), formData = _c[0], setFormData = _c[1];
    // ✅ Alert State
    var _d = react_1.useState({
        isOpen: false,
        type: "success",
        title: "",
        message: ""
    }), alertState = _d[0], setAlertState = _d[1];
    var handleChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value, type = _a.type;
        // Handle radio buttons specifically if needed, though standard value works for both usually in this setup
        var newValue = value;
        setFormData(function (prev) {
            var _a;
            var newData = __assign(__assign({}, prev), (_a = {}, _a[name] = newValue, _a));
            // --- Logic Cleansing (Same as GraduatesuveryForm) ---
            if (name === "currentStatus") {
                if (value === "ไม่ได้ทำงาน") {
                    // Clear Work
                    newData.employmentType = "";
                    newData.employmentTypeOther = "";
                    newData.jobTitle = "";
                    newData.workplaceName = "";
                    newData.workplaceAddrNumber = "";
                    newData.workplaceAddrMoo = "";
                    newData.workplaceAddrSoi = "";
                    newData.workplaceAddrRoad = "";
                    newData.workplaceAddrSubDistrict = "";
                    newData.workplaceAddrDistrict = "";
                    newData.workplaceAddrProvince = "";
                    newData.workplaceAddrZipCode = "";
                    newData.workplaceTel = "";
                    newData.salaryRange = "";
                    newData.salaryRangeOther = "";
                    newData.jobMatch = "";
                    newData.jobSatisfaction = "";
                    // Clear Study
                    newData.furtherStudyLevel = "";
                    newData.furtherStudyMajor = "";
                    newData.furtherStudyMajorDetail = "";
                    newData.furtherStudyReason = "";
                    newData.furtherStudyReasonOther = "";
                }
                else if (value === "ทำงานแล้ว") {
                    // Clear Not Work
                    newData.notWorkingReasonGroup = "";
                    newData.notWorkingReasonOther = "";
                    newData.unemployedReason = "";
                    newData.unemployedReasonOther = "";
                    newData.jobSearchProblem = "";
                    // Clear Study
                    newData.furtherStudyLevel = "";
                    newData.furtherStudyMajor = "";
                    newData.furtherStudyMajorDetail = "";
                    newData.furtherStudyReason = "";
                    newData.furtherStudyReasonOther = "";
                }
                else if (value === "ศึกษาต่อ") {
                    // ✅ Clear All Work & Not Work
                    newData.employmentType = "";
                    newData.employmentTypeOther = "";
                    newData.jobTitle = "";
                    newData.workplaceName = "";
                    newData.workplaceAddrNumber = "";
                    newData.workplaceAddrMoo = "";
                    newData.workplaceAddrSoi = "";
                    newData.workplaceAddrRoad = "";
                    newData.workplaceAddrSubDistrict = "";
                    newData.workplaceAddrDistrict = "";
                    newData.workplaceAddrProvince = "";
                    newData.workplaceAddrZipCode = "";
                    newData.workplaceTel = "";
                    newData.salaryRange = "";
                    newData.salaryRangeOther = "";
                    newData.jobMatch = "";
                    newData.jobSatisfaction = "";
                    newData.notWorkingReasonGroup = "";
                    newData.notWorkingReasonOther = "";
                    newData.unemployedReason = "";
                    newData.unemployedReasonOther = "";
                    newData.jobSearchProblem = "";
                    // ✅ Auto-set Intention
                    newData.furtherStudyIntention = "ต้องการศึกษาต่อ";
                }
            }
            // Dependent field clearing
            if (name === "notWorkingReasonGroup" && value !== "หางานทำไม่ได้")
                newData.jobSearchProblem = "";
            if (name === "unemployedReason" && value !== "4")
                newData.unemployedReasonOther = "";
            if (name === "employmentType" && value !== "อื่นๆ")
                newData.employmentTypeOther = "";
            if (name === "salaryRange" && value !== "5")
                newData.salaryRangeOther = "";
            if (name === "furtherStudyIntention" && value === "ไม่ต้องการศึกษาต่อ") {
                newData.furtherStudyLevel = "";
                newData.furtherStudyMajor = "";
                newData.furtherStudyMajorDetail = "";
                newData.furtherStudyReason = "";
                newData.furtherStudyReasonOther = "";
            }
            if (name === "furtherStudyMajor" && value !== "ระบุสาขา")
                newData.furtherStudyMajorDetail = "";
            if (name === "furtherStudyReason" && value !== "4")
                newData.furtherStudyReasonOther = "";
            return newData;
        });
    };
    var handleCloseAlert = function () {
        setAlertState(function (prev) { return (__assign(__assign({}, prev), { isOpen: false })); });
        if (alertState.type === "success") {
            router.push("/EmploymentDashboard");
            router.refresh();
        }
    };
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var res, errorData, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    setIsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    return [4 /*yield*/, fetch("/api/suvery?id=" + formData._id, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(formData)
                        })];
                case 2:
                    res = _a.sent();
                    if (!res.ok) return [3 /*break*/, 3];
                    setAlertState({
                        isOpen: true,
                        type: "success",
                        title: "บันทึกการแก้ไขสำเร็จ!",
                        message: "ข้อมูลของคุณได้รับการอัปเดตเรียบร้อยแล้ว"
                    });
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, res.json()];
                case 4:
                    errorData = _a.sent();
                    throw new Error(errorData.message || "การอัปเดตข้อมูลล้มเหลว");
                case 5: return [3 /*break*/, 8];
                case 6:
                    err_1 = _a.sent();
                    console.error("Update error:", err_1);
                    setAlertState({
                        isOpen: true,
                        type: "error",
                        title: "เกิดข้อผิดพลาด",
                        message: err_1.message || "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้"
                    });
                    return [3 /*break*/, 8];
                case 7:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    // Logic variables
    var isWorking = formData.currentStatus === "ทำงานแล้ว";
    var isNotWorking = formData.currentStatus === "ไม่ได้ทำงาน";
    var isStudying = formData.currentStatus === "ศึกษาต่อ"; // ✅ Added
    var isWorkingOther = isWorking && formData.employmentType === "อื่นๆ";
    var isSalaryOther = isWorking && formData.salaryRange === "5";
    var isUnemployedLookingForJob = isNotWorking && formData.notWorkingReasonGroup === "หางานทำไม่ได้";
    var isUnemployedReasonOther = isNotWorking && formData.unemployedReason === "4";
    // ✅ Updated Logic for Further Study Section
    var isFurtherStudyIntention = formData.furtherStudyIntention === "ต้องการศึกษาต่อ" || isStudying;
    var isFurtherStudyMajorNew = isFurtherStudyIntention && formData.furtherStudyMajor === "ระบุสาขา";
    var isFurtherStudyReasonOther = isFurtherStudyIntention && formData.furtherStudyReason === "4";
    return (react_1["default"].createElement("div", { className: "font-inter mx-auto max-w-5xl px-4 py-12 sm:px-6" },
        react_1["default"].createElement("form", { onSubmit: handleSubmit, className: "" },
            react_1["default"].createElement(FormSection, { title: "1. \u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E2A\u0E48\u0E27\u0E19\u0E15\u0E31\u0E27", icon: lucide_react_1.User },
                react_1["default"].createElement("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-4" },
                    react_1["default"].createElement("div", { className: "md:col-span-1" },
                        react_1["default"].createElement("label", { htmlFor: "studentId", className: labelClass }, "\u0E23\u0E2B\u0E31\u0E2A\u0E19\u0E31\u0E01\u0E28\u0E36\u0E01\u0E29\u0E32 *"),
                        react_1["default"].createElement("input", { id: "studentId", name: "studentId", type: "text", value: formData.studentId, onChange: handleChange, className: inputClass, required: true })),
                    react_1["default"].createElement("div", { className: "md:col-span-2" },
                        react_1["default"].createElement("label", { htmlFor: "fullName", className: labelClass }, "\u0E0A\u0E37\u0E48\u0E2D-\u0E2A\u0E01\u0E38\u0E25 *"),
                        react_1["default"].createElement("input", { id: "fullName", name: "fullName", type: "text", value: formData.fullName, onChange: handleChange, className: inputClass, required: true })),
                    react_1["default"].createElement("div", { className: "md:col-span-1" },
                        react_1["default"].createElement("label", { htmlFor: "roomId", className: labelClass }, "\u0E2B\u0E49\u0E2D\u0E07\u0E40\u0E23\u0E35\u0E22\u0E19"),
                        react_1["default"].createElement("input", { id: "roomId", name: "roomId", type: "text", value: formData.roomId, onChange: handleChange, className: inputClass })),
                    react_1["default"].createElement("div", { className: "md:col-span-1" },
                        react_1["default"].createElement("label", { htmlFor: "age", className: labelClass }, "\u0E2D\u0E32\u0E22\u0E38"),
                        react_1["default"].createElement("input", { id: "age", name: "age", type: "number", value: formData.age, onChange: handleChange, className: inputClass })),
                    react_1["default"].createElement("div", { className: "md:col-span-1" },
                        react_1["default"].createElement("label", { htmlFor: "contactTel", className: labelClass }, "\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C\u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D"),
                        react_1["default"].createElement("input", { id: "contactTel", name: "contactTel", type: "tel", value: formData.contactTel, onChange: handleChange, className: inputClass })),
                    react_1["default"].createElement("div", { className: "md:col-span-2" },
                        react_1["default"].createElement("label", { htmlFor: "contactEmail", className: labelClass }, "E-mail"),
                        react_1["default"].createElement("input", { id: "contactEmail", name: "contactEmail", type: "email", value: formData.contactEmail, onChange: handleChange, className: inputClass })),
                    react_1["default"].createElement("div", { className: "flex flex-col md:col-span-4" },
                        react_1["default"].createElement("label", { className: labelClass }, "\u0E40\u0E1E\u0E28 *"),
                        react_1["default"].createElement("div", { className: "mt-1 flex gap-6" }, ["ชาย", "หญิง"].map(function (g) { return (react_1["default"].createElement("label", { key: g, className: "group inline-flex cursor-pointer items-center" },
                            react_1["default"].createElement("input", { type: "radio", name: "gender", value: g, checked: formData.gender === g, onChange: handleChange, className: "form-radio h-5 w-5 border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-700", required: true }),
                            react_1["default"].createElement("span", { className: "text-gray-5000 ml-2 transition group-hover:text-blue-600 dark:text-gray-300 dark:group-hover:text-blue-400" }, g))); })))),
                react_1["default"].createElement("h3", { className: "mt-4 border-t pt-4 text-lg font-bold text-gray-800 dark:border-gray-700 dark:text-gray-200" }, "\u0E17\u0E35\u0E48\u0E2D\u0E22\u0E39\u0E48\u0E17\u0E35\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D\u0E44\u0E14\u0E49 (\u0E1B\u0E31\u0E08\u0E08\u0E38\u0E1A\u0E31\u0E19)"),
                react_1["default"].createElement("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4" },
                    react_1["default"].createElement("input", { name: "addrNumber", value: formData.addrNumber, onChange: handleChange, className: inputClass, type: "text", placeholder: "\u0E40\u0E25\u0E02\u0E17\u0E35\u0E48" }),
                    react_1["default"].createElement("input", { name: "addrBuilding", value: formData.addrBuilding, onChange: handleChange, className: inputClass, type: "text", placeholder: "\u0E2D\u0E32\u0E04\u0E32\u0E23/\u0E2B\u0E21\u0E39\u0E48\u0E1A\u0E49\u0E32\u0E19" }),
                    react_1["default"].createElement("input", { name: "addrMoo", value: formData.addrMoo, onChange: handleChange, className: inputClass, type: "text", placeholder: "\u0E2B\u0E21\u0E39\u0E48" }),
                    react_1["default"].createElement("input", { name: "addrSoi", value: formData.addrSoi, onChange: handleChange, className: inputClass, type: "text", placeholder: "\u0E0B\u0E2D\u0E22" }),
                    react_1["default"].createElement("input", { name: "addrRoad", value: formData.addrRoad, onChange: handleChange, className: inputClass, type: "text", placeholder: "\u0E16\u0E19\u0E19" }),
                    react_1["default"].createElement("input", { name: "addrSubDistrict", value: formData.addrSubDistrict, onChange: handleChange, className: inputClass, type: "text", placeholder: "\u0E15\u0E33\u0E1A\u0E25/\u0E41\u0E02\u0E27\u0E07" }),
                    react_1["default"].createElement("input", { name: "addrDistrict", value: formData.addrDistrict, onChange: handleChange, className: inputClass, type: "text", placeholder: "\u0E2D\u0E33\u0E40\u0E20\u0E2D/\u0E40\u0E02\u0E15" }),
                    react_1["default"].createElement("input", { name: "addrProvince", value: formData.addrProvince, onChange: handleChange, className: inputClass, type: "text", placeholder: "\u0E08\u0E31\u0E07\u0E2B\u0E27\u0E31\u0E14" }),
                    react_1["default"].createElement("input", { name: "addrZipCode", value: formData.addrZipCode, onChange: handleChange, className: inputClass, type: "text", placeholder: "\u0E23\u0E2B\u0E31\u0E2A\u0E44\u0E1B\u0E23\u0E29\u0E13\u0E35\u0E22\u0E4C" }))),
            react_1["default"].createElement(FormSection, { title: "2. \u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E01\u0E32\u0E23\u0E28\u0E36\u0E01\u0E29\u0E32", icon: lucide_react_1.GraduationCap },
                react_1["default"].createElement("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-4" },
                    react_1["default"].createElement("div", { className: "flex flex-col md:col-span-2" },
                        react_1["default"].createElement("label", { className: labelClass }, "\u0E27\u0E34\u0E17\u0E22\u0E32\u0E25\u0E31\u0E22"),
                        react_1["default"].createElement("input", { value: COLLEGE_NAME, className: inputClass + " cursor-not-allowed bg-gray-100 text-gray-500 dark:bg-gray-600 dark:text-gray-400", type: "text", disabled: true })),
                    react_1["default"].createElement("div", { className: "flex flex-col" },
                        react_1["default"].createElement("label", { className: labelClass }, "\u0E08\u0E31\u0E07\u0E2B\u0E27\u0E31\u0E14 (\u0E27\u0E34\u0E17\u0E22\u0E32\u0E25\u0E31\u0E22)"),
                        react_1["default"].createElement("input", { value: COLLEGE_PROVINCE, className: inputClass + " cursor-not-allowed bg-gray-100 text-gray-500 dark:bg-gray-600 dark:text-gray-400", type: "text", disabled: true })),
                    react_1["default"].createElement("div", { className: "flex flex-col" },
                        react_1["default"].createElement("label", { htmlFor: "homeProvince", className: labelClass }, "\u0E20\u0E39\u0E21\u0E34\u0E25\u0E33\u0E40\u0E19\u0E32 (\u0E08\u0E31\u0E07\u0E2B\u0E27\u0E31\u0E14)"),
                        react_1["default"].createElement("input", { id: "homeProvince", name: "homeProvince", value: formData.homeProvince, onChange: handleChange, className: inputClass, type: "text" })),
                    react_1["default"].createElement("div", { className: "flex flex-col" },
                        react_1["default"].createElement("label", { htmlFor: "graduationYear", className: labelClass }, "\u0E1B\u0E35\u0E17\u0E35\u0E48\u0E08\u0E1A\u0E01\u0E32\u0E23\u0E28\u0E36\u0E01\u0E29\u0E32 *"),
                        react_1["default"].createElement("input", { id: "graduationYear", name: "graduationYear", value: formData.graduationYear, onChange: handleChange, className: inputClass, type: "number", required: true })),
                    react_1["default"].createElement("div", { className: "flex flex-col" },
                        react_1["default"].createElement("label", { htmlFor: "educationLevel", className: labelClass }, "\u0E23\u0E30\u0E14\u0E31\u0E1A\u0E01\u0E32\u0E23\u0E28\u0E36\u0E01\u0E29\u0E32\u0E17\u0E35\u0E48\u0E08\u0E1A *"),
                        react_1["default"].createElement("select", { id: "educationLevel", name: "educationLevel", value: formData.educationLevel, onChange: handleChange, className: inputClass, required: true },
                            react_1["default"].createElement("option", { value: "" }, "-- \u0E40\u0E25\u0E37\u0E2D\u0E01\u0E23\u0E30\u0E14\u0E31\u0E1A --"),
                            react_1["default"].createElement("option", { value: "\u0E1B\u0E27\u0E0A." }, "\u0E1B\u0E27\u0E0A."),
                            react_1["default"].createElement("option", { value: "\u0E1B\u0E27\u0E2A." }, "\u0E1B\u0E27\u0E2A."))),
                    react_1["default"].createElement("div", { className: "flex flex-col md:col-span-2" },
                        react_1["default"].createElement("label", { htmlFor: "gpa", className: labelClass }, "\u0E40\u0E01\u0E23\u0E14\u0E40\u0E09\u0E25\u0E35\u0E48\u0E22\u0E2A\u0E30\u0E2A\u0E21"),
                        react_1["default"].createElement("input", { id: "gpa", name: "gpa", value: formData.gpa, onChange: handleChange, className: inputClass, type: "number", step: "0.01", max: "4.00", placeholder: "\u0E40\u0E0A\u0E48\u0E19 3.50" })))),
            react_1["default"].createElement(FormSection, { title: "3. \u0E2A\u0E16\u0E32\u0E19\u0E01\u0E32\u0E23\u0E13\u0E4C\u0E17\u0E33\u0E07\u0E32\u0E19\u0E1B\u0E31\u0E08\u0E08\u0E38\u0E1A\u0E31\u0E19", icon: lucide_react_1.Briefcase },
                react_1["default"].createElement("div", { className: "flex flex-col" },
                    react_1["default"].createElement("label", { htmlFor: "currentStatus", className: labelClass }, "\u0E2A\u0E16\u0E32\u0E19\u0E01\u0E32\u0E23\u0E13\u0E4C\u0E17\u0E33\u0E07\u0E32\u0E19\u0E1B\u0E31\u0E08\u0E08\u0E38\u0E1A\u0E31\u0E19 *"),
                    react_1["default"].createElement("select", { id: "currentStatus", name: "currentStatus", value: formData.currentStatus, onChange: handleChange, className: inputClass, required: true },
                        react_1["default"].createElement("option", { value: "" }, "-- \u0E40\u0E25\u0E37\u0E2D\u0E01\u0E2A\u0E16\u0E32\u0E19\u0E30 --"),
                        react_1["default"].createElement("option", { value: "\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E17\u0E33\u0E07\u0E32\u0E19" }, "1 \u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E17\u0E33\u0E07\u0E32\u0E19"),
                        react_1["default"].createElement("option", { value: "\u0E17\u0E33\u0E07\u0E32\u0E19\u0E41\u0E25\u0E49\u0E27" }, "2 \u0E17\u0E33\u0E07\u0E32\u0E19\u0E41\u0E25\u0E49\u0E27"),
                        react_1["default"].createElement("option", { value: "\u0E28\u0E36\u0E01\u0E29\u0E32\u0E15\u0E48\u0E2D" }, "3 \u0E28\u0E36\u0E01\u0E29\u0E32\u0E15\u0E48\u0E2D"),
                        " ")),
                isNotWorking && (react_1["default"].createElement("div", { className: "mt-4 space-y-4 rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-800 dark:bg-red-900/20" },
                    react_1["default"].createElement("p", { className: "flex items-center gap-2 text-lg font-bold text-red-700 dark:text-red-400" },
                        react_1["default"].createElement(lucide_react_1.X, { className: "h-5 w-5" }),
                        " \u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E1C\u0E39\u0E49\u0E17\u0E35\u0E48 **\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E17\u0E33\u0E07\u0E32\u0E19**"),
                    react_1["default"].createElement("div", { className: "flex flex-col" },
                        react_1["default"].createElement("label", { className: labelClass }, "\u0E40\u0E2B\u0E15\u0E38\u0E1C\u0E25\u0E17\u0E35\u0E48\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E17\u0E33\u0E07\u0E32\u0E19 (\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E01\u0E25\u0E38\u0E48\u0E21\u0E40\u0E2B\u0E15\u0E38\u0E1C\u0E25) *"),
                        react_1["default"].createElement("select", { name: "notWorkingReasonGroup", value: formData.notWorkingReasonGroup, onChange: handleChange, className: inputClass, required: isNotWorking },
                            react_1["default"].createElement("option", { value: "" }, "-- \u0E40\u0E25\u0E37\u0E2D\u0E01\u0E40\u0E2B\u0E15\u0E38\u0E1C\u0E25\u0E2B\u0E25\u0E31\u0E01 --"),
                            react_1["default"].createElement("option", { value: "\u0E28\u0E36\u0E01\u0E29\u0E32\u0E15\u0E48\u0E2D" }, "\u0E28\u0E36\u0E01\u0E29\u0E32\u0E15\u0E48\u0E2D"),
                            react_1["default"].createElement("option", { value: "\u0E2B\u0E32\u0E07\u0E32\u0E19\u0E17\u0E33\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49" }, "\u0E2B\u0E32\u0E07\u0E32\u0E19\u0E17\u0E33\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49"),
                            react_1["default"].createElement("option", { value: "\u0E23\u0E2D\u0E1F\u0E31\u0E07\u0E04\u0E33\u0E15\u0E2D\u0E1A" }, "\u0E23\u0E2D\u0E1F\u0E31\u0E07\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E08\u0E32\u0E01\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E07\u0E32\u0E19"),
                            react_1["default"].createElement("option", { value: "\u0E44\u0E21\u0E48\u0E1B\u0E23\u0E30\u0E2A\u0E07\u0E04\u0E4C\u0E08\u0E30\u0E17\u0E33\u0E07\u0E32\u0E19" }, "\u0E44\u0E21\u0E48\u0E1B\u0E23\u0E30\u0E2A\u0E07\u0E04\u0E4C\u0E08\u0E30\u0E17\u0E33\u0E07\u0E32\u0E19"))),
                    isUnemployedLookingForJob && (react_1["default"].createElement("div", { className: "flex flex-col" },
                        react_1["default"].createElement("label", { htmlFor: "jobSearchProblem", className: labelClass }, "\u0E1B\u0E31\u0E0D\u0E2B\u0E32\u0E43\u0E19\u0E01\u0E32\u0E23\u0E2B\u0E32\u0E07\u0E32\u0E19\u0E17\u0E33 *"),
                        react_1["default"].createElement("select", { id: "jobSearchProblem", name: "jobSearchProblem", value: formData.jobSearchProblem, onChange: handleChange, className: inputClass, required: isUnemployedLookingForJob },
                            react_1["default"].createElement("option", { value: "" }, "-- \u0E40\u0E25\u0E37\u0E2D\u0E01\u0E1B\u0E31\u0E0D\u0E2B\u0E32 --"),
                            react_1["default"].createElement("option", { value: "\u0E44\u0E21\u0E48\u0E21\u0E35\u0E1B\u0E31\u0E0D\u0E2B\u0E32" }, "\u0E44\u0E21\u0E48\u0E21\u0E35\u0E1B\u0E31\u0E0D\u0E2B\u0E32"),
                            react_1["default"].createElement("option", { value: "1 \u0E44\u0E21\u0E48\u0E17\u0E23\u0E32\u0E1A\u0E41\u0E2B\u0E25\u0E48\u0E07\u0E07\u0E32\u0E19" }, "1 \u0E44\u0E21\u0E48\u0E17\u0E23\u0E32\u0E1A\u0E41\u0E2B\u0E25\u0E48\u0E07\u0E07\u0E32\u0E19"),
                            react_1["default"].createElement("option", { value: "2 \u0E2B\u0E32\u0E07\u0E32\u0E19\u0E17\u0E35\u0E48\u0E16\u0E39\u0E01\u0E43\u0E08\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49" }, "2 \u0E2B\u0E32\u0E07\u0E32\u0E19\u0E17\u0E35\u0E48\u0E16\u0E39\u0E01\u0E43\u0E08\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49"),
                            react_1["default"].createElement("option", { value: "3 \u0E15\u0E49\u0E2D\u0E07\u0E2A\u0E2D\u0E1A\u0E08\u0E36\u0E07\u0E44\u0E21\u0E48\u0E2D\u0E22\u0E32\u0E01\u0E2A\u0E21\u0E31\u0E04\u0E23" }, "3 \u0E15\u0E49\u0E2D\u0E07\u0E2A\u0E2D\u0E1A\u0E08\u0E36\u0E07\u0E44\u0E21\u0E48\u0E2D\u0E22\u0E32\u0E01\u0E2A\u0E21\u0E31\u0E04\u0E23"),
                            react_1["default"].createElement("option", { value: "4 \u0E02\u0E32\u0E14\u0E04\u0E19\u0E2A\u0E19\u0E31\u0E1A\u0E2A\u0E19\u0E38\u0E19" }, "4 \u0E02\u0E32\u0E14\u0E04\u0E19\u0E2A\u0E19\u0E31\u0E1A\u0E2A\u0E19\u0E38\u0E19"),
                            react_1["default"].createElement("option", { value: "5 \u0E02\u0E32\u0E14\u0E04\u0E19\u0E2B\u0E23\u0E37\u0E2D\u0E40\u0E07\u0E34\u0E19\u0E04\u0E49\u0E33\u0E1B\u0E23\u0E30\u0E01\u0E31\u0E19" }, "5 \u0E02\u0E32\u0E14\u0E04\u0E19\u0E2B\u0E23\u0E37\u0E2D\u0E40\u0E07\u0E34\u0E19\u0E04\u0E49\u0E33\u0E1B\u0E23\u0E30\u0E01\u0E31\u0E19"),
                            react_1["default"].createElement("option", { value: "6 \u0E2B\u0E19\u0E48\u0E27\u0E22\u0E07\u0E32\u0E19\u0E44\u0E21\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23" }, "6 \u0E2B\u0E19\u0E48\u0E27\u0E22\u0E07\u0E32\u0E19\u0E44\u0E21\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23"),
                            react_1["default"].createElement("option", { value: "7 \u0E40\u0E07\u0E34\u0E19\u0E40\u0E14\u0E37\u0E2D\u0E19\u0E19\u0E49\u0E2D\u0E22" }, "7 \u0E40\u0E07\u0E34\u0E19\u0E40\u0E14\u0E37\u0E2D\u0E19\u0E19\u0E49\u0E2D\u0E22"),
                            react_1["default"].createElement("option", { value: "8 \u0E2A\u0E2D\u0E1A\u0E40\u0E02\u0E49\u0E32\u0E17\u0E33\u0E07\u0E32\u0E19\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49" }, "8 \u0E2A\u0E2D\u0E1A\u0E40\u0E02\u0E49\u0E32\u0E17\u0E33\u0E07\u0E32\u0E19\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49")))),
                    react_1["default"].createElement("div", { className: "flex flex-col" },
                        react_1["default"].createElement("label", { htmlFor: "unemployedReason", className: labelClass }, "\u0E2A\u0E32\u0E40\u0E2B\u0E15\u0E38\u0E17\u0E35\u0E48\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E17\u0E33\u0E07\u0E32\u0E19 (\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14) *"),
                        react_1["default"].createElement("select", { id: "unemployedReason", name: "unemployedReason", value: formData.unemployedReason, onChange: handleChange, className: inputClass, required: isNotWorking },
                            react_1["default"].createElement("option", { value: "" }, "-- \u0E40\u0E25\u0E37\u0E2D\u0E01\u0E2A\u0E32\u0E40\u0E2B\u0E15\u0E38 --"),
                            react_1["default"].createElement("option", { value: "\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E1B\u0E23\u0E30\u0E2A\u0E07\u0E04\u0E4C\u0E17\u0E33\u0E07\u0E32\u0E19" }, "1 \u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E1B\u0E23\u0E30\u0E2A\u0E07\u0E04\u0E4C\u0E17\u0E33\u0E07\u0E32\u0E19"),
                            react_1["default"].createElement("option", { value: "\u0E23\u0E2D\u0E1F\u0E31\u0E07\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E08\u0E32\u0E01\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E07\u0E32\u0E19" }, "2 \u0E23\u0E2D\u0E1F\u0E31\u0E07\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E08\u0E32\u0E01\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E07\u0E32\u0E19"),
                            react_1["default"].createElement("option", { value: "\u0E2B\u0E32\u0E07\u0E32\u0E19\u0E17\u0E33\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49" }, "3 \u0E2B\u0E32\u0E07\u0E32\u0E19\u0E17\u0E33\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49"),
                            react_1["default"].createElement("option", { value: "4" }, "4 \u0E2D\u0E37\u0E48\u0E19\u0E46 (\u0E42\u0E1B\u0E23\u0E14\u0E23\u0E30\u0E1A\u0E38)")),
                        isUnemployedReasonOther && (react_1["default"].createElement("input", { name: "unemployedReasonOther", value: formData.unemployedReasonOther, onChange: handleChange, className: inputClass + " mt-2", type: "text", placeholder: "\u0E42\u0E1B\u0E23\u0E14\u0E23\u0E30\u0E1A\u0E38\u0E2A\u0E32\u0E40\u0E2B\u0E15\u0E38\u0E2D\u0E37\u0E48\u0E19\u0E46", required: true }))))),
                isWorking && (react_1["default"].createElement("div", { className: "mt-4 space-y-4 rounded-xl border border-green-200 bg-green-50 p-5 dark:border-green-800 dark:bg-green-900/20" },
                    react_1["default"].createElement("p", { className: "flex items-center gap-2 text-lg font-bold text-green-700 dark:text-green-400" },
                        react_1["default"].createElement(lucide_react_1.Check, { className: "h-5 w-5" }),
                        " \u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E1C\u0E39\u0E49\u0E17\u0E35\u0E48 **\u0E17\u0E33\u0E07\u0E32\u0E19\u0E41\u0E25\u0E49\u0E27**"),
                    react_1["default"].createElement("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2" },
                        react_1["default"].createElement("input", { name: "jobTitle", value: formData.jobTitle, onChange: handleChange, className: inputClass, type: "text", placeholder: "\u0E15\u0E33\u0E41\u0E2B\u0E19\u0E48\u0E07\u0E07\u0E32\u0E19\u0E41\u0E25\u0E30\u0E2B\u0E19\u0E49\u0E32\u0E17\u0E35\u0E48 *", required: isWorking }),
                        react_1["default"].createElement("input", { name: "workplaceName", value: formData.workplaceName, onChange: handleChange, className: inputClass, type: "text", placeholder: "\u0E0A\u0E37\u0E48\u0E2D\u0E2A\u0E16\u0E32\u0E19\u0E17\u0E35\u0E48\u0E17\u0E33\u0E07\u0E32\u0E19 *", required: isWorking }),
                        react_1["default"].createElement("div", { className: "md:col-span-2" },
                            react_1["default"].createElement("label", { htmlFor: "employmentType", className: labelClass }, "\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E07\u0E32\u0E19/\u0E2A\u0E16\u0E32\u0E19\u0E30\u0E01\u0E32\u0E23\u0E17\u0E33\u0E07\u0E32\u0E19 *"),
                            react_1["default"].createElement("select", { id: "employmentType", name: "employmentType", onChange: handleChange, value: formData.employmentType, className: inputClass, required: isWorking },
                                react_1["default"].createElement("option", { value: "" }, "-- \u0E40\u0E25\u0E37\u0E2D\u0E01\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17 --"),
                                react_1["default"].createElement("option", { value: "\u0E02\u0E49\u0E32\u0E23\u0E32\u0E0A\u0E01\u0E32\u0E23/\u0E40\u0E08\u0E49\u0E32\u0E2B\u0E19\u0E49\u0E32\u0E17\u0E35\u0E48\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E07\u0E32\u0E19\u0E02\u0E2D\u0E07\u0E23\u0E31\u0E10" }, "\u0E02\u0E49\u0E32\u0E23\u0E32\u0E0A\u0E01\u0E32\u0E23/\u0E40\u0E08\u0E49\u0E32\u0E2B\u0E19\u0E49\u0E32\u0E17\u0E35\u0E48\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E07\u0E32\u0E19\u0E02\u0E2D\u0E07\u0E23\u0E31\u0E10"),
                                react_1["default"].createElement("option", { value: "\u0E23\u0E31\u0E10\u0E27\u0E34\u0E2A\u0E32\u0E2B\u0E01\u0E34\u0E08" }, "\u0E23\u0E31\u0E10\u0E27\u0E34\u0E2A\u0E32\u0E2B\u0E01\u0E34\u0E08"),
                                react_1["default"].createElement("option", { value: "\u0E1E\u0E19\u0E31\u0E01\u0E07\u0E32\u0E19\u0E1A\u0E23\u0E34\u0E29\u0E31\u0E17\u0E34/\u0E2D\u0E07\u0E04\u0E4C\u0E01\u0E23\u0E18\u0E38\u0E23\u0E01\u0E34\u0E08\u0E40\u0E2D\u0E01\u0E0A\u0E19" }, "\u0E1E\u0E19\u0E31\u0E01\u0E07\u0E32\u0E19\u0E1A\u0E23\u0E34\u0E29\u0E31\u0E17\u0E34/\u0E2D\u0E07\u0E04\u0E4C\u0E01\u0E23\u0E18\u0E38\u0E23\u0E01\u0E34\u0E08\u0E40\u0E2D\u0E01\u0E0A\u0E19"),
                                react_1["default"].createElement("option", { value: "\u0E14\u0E33\u0E40\u0E19\u0E34\u0E19\u0E18\u0E38\u0E23\u0E01\u0E34\u0E08\u0E2D\u0E34\u0E2A\u0E23\u0E30/\u0E40\u0E08\u0E49\u0E32\u0E02\u0E2D\u0E07\u0E18\u0E38\u0E23\u0E01\u0E34\u0E08" }, "\u0E14\u0E33\u0E40\u0E19\u0E34\u0E19\u0E18\u0E38\u0E23\u0E01\u0E34\u0E08\u0E2D\u0E34\u0E2A\u0E23\u0E30/\u0E40\u0E08\u0E49\u0E32\u0E02\u0E2D\u0E07\u0E18\u0E38\u0E23\u0E01\u0E34\u0E08"),
                                react_1["default"].createElement("option", { value: "\u0E1E\u0E19\u0E31\u0E01\u0E07\u0E32\u0E19\u0E2D\u0E07\u0E04\u0E4C\u0E01\u0E23\u0E15\u0E48\u0E32\u0E07\u0E1B\u0E23\u0E30\u0E40\u0E17\u0E28/\u0E23\u0E30\u0E2B\u0E27\u0E48\u0E32\u0E07\u0E1B\u0E23\u0E30\u0E40\u0E17\u0E28" }, "\u0E1E\u0E19\u0E31\u0E01\u0E07\u0E32\u0E19\u0E2D\u0E07\u0E04\u0E4C\u0E01\u0E23\u0E15\u0E48\u0E32\u0E07\u0E1B\u0E23\u0E30\u0E40\u0E17\u0E28/\u0E23\u0E30\u0E2B\u0E27\u0E48\u0E32\u0E07\u0E1B\u0E23\u0E30\u0E40\u0E17\u0E28"),
                                react_1["default"].createElement("option", { value: "\u0E2D\u0E37\u0E48\u0E19\u0E46" }, "\u0E2D\u0E37\u0E48\u0E19\u0E46")),
                            isWorkingOther && (react_1["default"].createElement("input", { name: "employmentTypeOther", value: formData.employmentTypeOther, onChange: handleChange, className: inputClass + " mt-2", type: "text", placeholder: "\u0E42\u0E1B\u0E23\u0E14\u0E23\u0E30\u0E1A\u0E38\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E2D\u0E37\u0E48\u0E19\u0E46", required: true })))),
                    react_1["default"].createElement("h3", { className: "text-md text-gray-5000 flex items-center gap-1 pt-3 font-bold dark:text-gray-300" },
                        react_1["default"].createElement(lucide_react_1.MapPin, { className: "h-4 w-4" }),
                        " \u0E17\u0E35\u0E48\u0E2D\u0E22\u0E39\u0E48\u0E2A\u0E16\u0E32\u0E19\u0E17\u0E35\u0E48\u0E17\u0E33\u0E07\u0E32\u0E19"),
                    react_1["default"].createElement("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4" },
                        react_1["default"].createElement("input", { name: "workplaceAddrNumber", value: formData.workplaceAddrNumber, onChange: handleChange, className: inputClass, type: "text", placeholder: "\u0E40\u0E25\u0E02\u0E17\u0E35\u0E48" }),
                        react_1["default"].createElement("input", { name: "workplaceAddrMoo", value: formData.workplaceAddrMoo, onChange: handleChange, className: inputClass, type: "text", placeholder: "\u0E2B\u0E21\u0E39\u0E48" }),
                        react_1["default"].createElement("input", { name: "workplaceAddrSoi", value: formData.workplaceAddrSoi, onChange: handleChange, className: inputClass, type: "text", placeholder: "\u0E0B\u0E2D\u0E22" }),
                        react_1["default"].createElement("input", { name: "workplaceAddrRoad", value: formData.workplaceAddrRoad, onChange: handleChange, className: inputClass, type: "text", placeholder: "\u0E16\u0E19\u0E19" }),
                        react_1["default"].createElement("input", { name: "workplaceAddrSubDistrict", value: formData.workplaceAddrSubDistrict, onChange: handleChange, className: inputClass, type: "text", placeholder: "\u0E15\u0E33\u0E1A\u0E25/\u0E41\u0E02\u0E27\u0E07" }),
                        react_1["default"].createElement("input", { name: "workplaceAddrDistrict", value: formData.workplaceAddrDistrict, onChange: handleChange, className: inputClass, type: "text", placeholder: "\u0E2D\u0E33\u0E40\u0E20\u0E2D/\u0E40\u0E02\u0E15" }),
                        react_1["default"].createElement("input", { name: "workplaceAddrProvince", value: formData.workplaceAddrProvince, onChange: handleChange, className: inputClass, type: "text", placeholder: "\u0E08\u0E31\u0E07\u0E2B\u0E27\u0E31\u0E14" }),
                        react_1["default"].createElement("input", { name: "workplaceAddrZipCode", value: formData.workplaceAddrZipCode, onChange: handleChange, className: inputClass, type: "text", placeholder: "\u0E23\u0E2B\u0E31\u0E2A\u0E44\u0E1B\u0E23\u0E29\u0E13\u0E35\u0E22\u0E4C" }),
                        react_1["default"].createElement("div", { className: "md:col-span-4" },
                            react_1["default"].createElement("input", { name: "workplaceTel", value: formData.workplaceTel, onChange: handleChange, className: inputClass, type: "tel", placeholder: "\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C\u0E2A\u0E16\u0E32\u0E19\u0E17\u0E35\u0E48\u0E17\u0E33\u0E07\u0E32\u0E19" }))),
                    react_1["default"].createElement("h3", { className: "text-md text-gray-5000 flex items-center gap-1 pt-3 font-bold dark:text-gray-300" },
                        react_1["default"].createElement(lucide_react_1.Check, { className: "h-4 w-4" }),
                        " \u0E23\u0E32\u0E22\u0E44\u0E14\u0E49\u0E41\u0E25\u0E30\u0E04\u0E27\u0E32\u0E21\u0E1E\u0E36\u0E07\u0E1E\u0E2D\u0E43\u0E08"),
                    react_1["default"].createElement("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-3" },
                        react_1["default"].createElement("div", { className: "md:col-span-3" },
                            react_1["default"].createElement("label", { htmlFor: "salaryRange", className: labelClass }, "\u0E1B\u0E31\u0E08\u0E08\u0E38\u0E1A\u0E31\u0E19\u0E17\u0E48\u0E32\u0E19\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A\u0E40\u0E07\u0E34\u0E19\u0E04\u0E48\u0E32\u0E08\u0E49\u0E32\u0E07 (\u0E40\u0E09\u0E25\u0E35\u0E48\u0E22\u0E15\u0E48\u0E2D\u0E40\u0E14\u0E37\u0E2D\u0E19) *"),
                            react_1["default"].createElement("select", { id: "salaryRange", name: "salaryRange", value: formData.salaryRange, onChange: handleChange, className: inputClass, required: isWorking },
                                react_1["default"].createElement("option", { value: "" }, "-- \u0E40\u0E25\u0E37\u0E2D\u0E01\u0E0A\u0E48\u0E27\u0E07\u0E23\u0E32\u0E22\u0E44\u0E14\u0E49 --"),
                                react_1["default"].createElement("option", { value: "\u0E15\u0E48\u0E33\u0E01\u0E27\u0E48\u0E32 7,940 \u0E1A\u0E32\u0E17" }, "1 \u0E15\u0E48\u0E33\u0E01\u0E27\u0E48\u0E32 7,940 \u0E1A\u0E32\u0E17"),
                                react_1["default"].createElement("option", { value: "7,941 - 10,000 \u0E1A\u0E32\u0E17" }, "2 7,941 - 10,000 \u0E1A\u0E32\u0E17"),
                                react_1["default"].createElement("option", { value: "10,001 - 15,000 \u0E1A\u0E32\u0E17" }, "3 10,001 - 15,000 \u0E1A\u0E32\u0E17"),
                                react_1["default"].createElement("option", { value: "15,001 - 20,000 \u0E1A\u0E32\u0E17" }, "4 15,001 - 20,000 \u0E1A\u0E32\u0E17"),
                                react_1["default"].createElement("option", { value: "5" }, "5 \u0E2D\u0E37\u0E48\u0E19\u0E46 (\u0E42\u0E1B\u0E23\u0E14\u0E23\u0E30\u0E1A\u0E38)")),
                            isSalaryOther && (react_1["default"].createElement("input", { name: "salaryRangeOther", value: formData.salaryRangeOther, onChange: handleChange, className: inputClass + " mt-2", type: "text", placeholder: "\u0E42\u0E1B\u0E23\u0E14\u0E23\u0E30\u0E1A\u0E38\u0E08\u0E33\u0E19\u0E27\u0E19\u0E40\u0E07\u0E34\u0E19", required: true }))),
                        react_1["default"].createElement("div", { className: "flex flex-col" },
                            react_1["default"].createElement("label", { className: labelClass }, "\u0E07\u0E32\u0E19\u0E15\u0E23\u0E07\u0E2A\u0E32\u0E02\u0E32\u0E2B\u0E23\u0E37\u0E2D\u0E44\u0E21\u0E48 *"),
                            react_1["default"].createElement("div", { className: "mt-2 flex gap-6" },
                                react_1["default"].createElement("label", { className: "group inline-flex cursor-pointer items-center" },
                                    react_1["default"].createElement("input", { type: "radio", name: "jobMatch", value: "\u0E15\u0E23\u0E07", checked: formData.jobMatch === "ตรง", onChange: handleChange, className: "form-radio h-5 w-5 border-gray-300 text-green-600 focus:ring-green-500 dark:border-gray-500 dark:bg-gray-700" }),
                                    react_1["default"].createElement("span", { className: "text-gray-5000 ml-2 group-hover:text-green-600 dark:text-gray-300 dark:group-hover:text-green-400" }, "1 \u0E15\u0E23\u0E07")),
                                react_1["default"].createElement("label", { className: "group inline-flex cursor-pointer items-center" },
                                    react_1["default"].createElement("input", { type: "radio", name: "jobMatch", value: "\u0E44\u0E21\u0E48\u0E15\u0E23\u0E07", checked: formData.jobMatch === "ไม่ตรง", onChange: handleChange, className: "form-radio h-5 w-5 border-gray-300 text-red-600 focus:ring-red-500 dark:border-gray-500 dark:bg-gray-700" }),
                                    react_1["default"].createElement("span", { className: "text-gray-5000 ml-2 group-hover:text-red-600 dark:text-gray-300 dark:group-hover:text-red-400" }, "2 \u0E44\u0E21\u0E48\u0E15\u0E23\u0E07")))),
                        react_1["default"].createElement("div", { className: "flex flex-col" },
                            react_1["default"].createElement("label", { className: labelClass }, "\u0E04\u0E27\u0E32\u0E21\u0E1E\u0E36\u0E07\u0E1E\u0E2D\u0E43\u0E08 *"),
                            react_1["default"].createElement("div", { className: "mt-2 flex gap-6" },
                                react_1["default"].createElement("label", { className: "group inline-flex cursor-pointer items-center" },
                                    react_1["default"].createElement("input", { type: "radio", name: "jobSatisfaction", value: "\u0E1E\u0E36\u0E07\u0E1E\u0E2D\u0E43\u0E08", checked: formData.jobSatisfaction === "พึงพอใจ", onChange: handleChange, className: "form-radio h-5 w-5 border-gray-300 text-green-600 focus:ring-green-500 dark:border-gray-500 dark:bg-gray-700" }),
                                    react_1["default"].createElement("span", { className: "text-gray-5000 ml-2 group-hover:text-green-600 dark:text-gray-300 dark:group-hover:text-green-400" }, "1 \u0E1E\u0E36\u0E07\u0E1E\u0E2D\u0E43\u0E08")),
                                react_1["default"].createElement("label", { className: "group inline-flex cursor-pointer items-center" },
                                    react_1["default"].createElement("input", { type: "radio", name: "jobSatisfaction", value: "\u0E44\u0E21\u0E48\u0E1E\u0E36\u0E07\u0E1E\u0E2D\u0E43\u0E08", checked: formData.jobSatisfaction === "ไม่พึงพอใจ", onChange: handleChange, className: "form-radio h-5 w-5 border-gray-300 text-red-600 focus:ring-red-500 dark:border-gray-500 dark:bg-gray-700" }),
                                    react_1["default"].createElement("span", { className: "text-gray-5000 ml-2 group-hover:text-red-600 dark:text-gray-300 dark:group-hover:text-red-400" }, "2 \u0E44\u0E21\u0E48\u0E1E\u0E36\u0E07\u0E1E\u0E2D\u0E43\u0E08")))))))),
            react_1["default"].createElement(FormSection, { title: "4. \u0E04\u0E27\u0E32\u0E21\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E28\u0E36\u0E01\u0E29\u0E32\u0E15\u0E48\u0E2D", icon: lucide_react_1.BookOpen },
                react_1["default"].createElement("div", { className: "flex flex-col" },
                    react_1["default"].createElement("label", { className: labelClass }, "\u0E17\u0E48\u0E32\u0E19\u0E21\u0E35\u0E04\u0E27\u0E32\u0E21\u0E1B\u0E23\u0E30\u0E2A\u0E07\u0E04\u0E4C\u0E08\u0E30\u0E28\u0E36\u0E01\u0E29\u0E32\u0E15\u0E48\u0E2D\u0E2B\u0E23\u0E37\u0E2D\u0E44\u0E21\u0E48 *"),
                    react_1["default"].createElement("div", { className: "mt-1 flex gap-6" },
                        react_1["default"].createElement("label", { className: "group inline-flex cursor-pointer items-center " + (isStudying ? "cursor-not-allowed opacity-50" : "") },
                            react_1["default"].createElement("input", { type: "radio", name: "furtherStudyIntention", value: "\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E28\u0E36\u0E01\u0E29\u0E32\u0E15\u0E48\u0E2D", checked: formData.furtherStudyIntention === "ต้องการศึกษาต่อ" ||
                                    isStudying, onChange: handleChange, className: "form-radio h-5 w-5 border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-700", disabled: isStudying }),
                            react_1["default"].createElement("span", { className: "text-gray-5000 ml-2 group-hover:text-blue-600 dark:text-gray-300 dark:group-hover:text-blue-400" }, "\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E28\u0E36\u0E01\u0E29\u0E32\u0E15\u0E48\u0E2D")),
                        react_1["default"].createElement("label", { className: "group inline-flex cursor-pointer items-center " + (isStudying ? "cursor-not-allowed opacity-50" : "") },
                            react_1["default"].createElement("input", { type: "radio", name: "furtherStudyIntention", value: "\u0E44\u0E21\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E28\u0E36\u0E01\u0E29\u0E32\u0E15\u0E48\u0E2D", checked: formData.furtherStudyIntention === "ไม่ต้องการศึกษาต่อ" &&
                                    !isStudying, onChange: handleChange, className: "form-radio h-5 w-5 border-gray-300 text-gray-600 focus:ring-gray-500 dark:border-gray-500 dark:bg-gray-700", disabled: isStudying }),
                            react_1["default"].createElement("span", { className: "text-gray-5000 ml-2 group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-white" }, "\u0E44\u0E21\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E28\u0E36\u0E01\u0E29\u0E32\u0E15\u0E48\u0E2D")))),
                isFurtherStudyIntention && (react_1["default"].createElement("div", { className: "mt-4 space-y-4 rounded-xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-800 dark:bg-blue-900/20" },
                    react_1["default"].createElement("p", { className: "flex items-center gap-2 text-lg font-bold text-blue-700 dark:text-blue-400" },
                        react_1["default"].createElement(lucide_react_1.BookOpen, { className: "h-5 w-5" }),
                        " \u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E01\u0E32\u0E23\u0E28\u0E36\u0E01\u0E29\u0E32\u0E15\u0E48\u0E2D"),
                    react_1["default"].createElement("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2" },
                        react_1["default"].createElement("div", null,
                            react_1["default"].createElement("label", { htmlFor: "furtherStudyLevel", className: labelClass }, "\u0E23\u0E30\u0E14\u0E31\u0E1A\u0E01\u0E32\u0E23\u0E28\u0E36\u0E01\u0E29\u0E32\u0E17\u0E35\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E28\u0E36\u0E01\u0E29\u0E32\u0E15\u0E48\u0E2D *"),
                            react_1["default"].createElement("select", { id: "furtherStudyLevel", name: "furtherStudyLevel", value: formData.furtherStudyLevel, onChange: handleChange, className: inputClass, required: isFurtherStudyIntention },
                                react_1["default"].createElement("option", { value: "" }, "-- \u0E40\u0E25\u0E37\u0E2D\u0E01\u0E23\u0E30\u0E14\u0E31\u0E1A --"),
                                react_1["default"].createElement("option", { value: "\u0E1B\u0E23\u0E34\u0E0D\u0E0D\u0E32\u0E15\u0E23\u0E35" }, "\u0E23\u0E30\u0E14\u0E31\u0E1A\u0E1B\u0E23\u0E34\u0E0D\u0E0D\u0E32\u0E15\u0E23\u0E35"),
                                react_1["default"].createElement("option", { value: "\u0E1B\u0E23\u0E34\u0E0D\u0E0D\u0E32\u0E42\u0E17" }, "\u0E23\u0E30\u0E14\u0E31\u0E1A\u0E1B\u0E23\u0E34\u0E0D\u0E0D\u0E32\u0E42\u0E17"),
                                react_1["default"].createElement("option", { value: "\u0E1B\u0E23\u0E34\u0E0D\u0E0D\u0E32\u0E40\u0E2D\u0E01" }, "\u0E23\u0E30\u0E14\u0E31\u0E1A\u0E1B\u0E23\u0E34\u0E0D\u0E0D\u0E32\u0E40\u0E2D\u0E01"))),
                        react_1["default"].createElement("div", null,
                            react_1["default"].createElement("label", { htmlFor: "furtherStudyMajor", className: labelClass }, "\u0E2A\u0E32\u0E02\u0E32\u0E17\u0E35\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E28\u0E36\u0E01\u0E29\u0E32\u0E15\u0E48\u0E2D *"),
                            react_1["default"].createElement("select", { id: "furtherStudyMajor", name: "furtherStudyMajor", value: formData.furtherStudyMajor, onChange: handleChange, className: inputClass, required: isFurtherStudyIntention },
                                react_1["default"].createElement("option", { value: "" }, "-- \u0E40\u0E25\u0E37\u0E2D\u0E01\u0E2A\u0E32\u0E02\u0E32 --"),
                                react_1["default"].createElement("option", { value: "\u0E2A\u0E32\u0E02\u0E32\u0E40\u0E14\u0E34\u0E21" }, "\u0E28\u0E36\u0E01\u0E29\u0E32\u0E15\u0E48\u0E2D\u0E2A\u0E32\u0E02\u0E32\u0E40\u0E14\u0E34\u0E21"),
                                react_1["default"].createElement("option", { value: "\u0E23\u0E30\u0E1A\u0E38\u0E2A\u0E32\u0E02\u0E32" }, "\u0E23\u0E30\u0E1A\u0E38\u0E2A\u0E32\u0E02\u0E32\u0E43\u0E2B\u0E21\u0E48")),
                            isFurtherStudyMajorNew && (react_1["default"].createElement("input", { name: "furtherStudyMajorDetail", value: formData.furtherStudyMajorDetail, onChange: handleChange, className: inputClass + " mt-2", type: "text", placeholder: "\u0E42\u0E1B\u0E23\u0E14\u0E23\u0E30\u0E1A\u0E38\u0E2A\u0E32\u0E02\u0E32\u0E43\u0E2B\u0E21\u0E48", required: true }))),
                        react_1["default"].createElement("div", { className: "md:col-span-2" },
                            react_1["default"].createElement("label", { htmlFor: "furtherStudyReason", className: labelClass }, "\u0E40\u0E2B\u0E15\u0E38\u0E1C\u0E25\u0E17\u0E35\u0E48\u0E17\u0E48\u0E32\u0E19\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E28\u0E36\u0E01\u0E29\u0E32\u0E15\u0E48\u0E2D *"),
                            react_1["default"].createElement("select", { id: "furtherStudyReason", name: "furtherStudyReason", value: formData.furtherStudyReason, onChange: handleChange, className: inputClass, required: isFurtherStudyIntention },
                                react_1["default"].createElement("option", { value: "" }, "-- \u0E40\u0E25\u0E37\u0E2D\u0E01\u0E40\u0E2B\u0E15\u0E38\u0E1C\u0E25 --"),
                                react_1["default"].createElement("option", { value: "\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E1E\u0E39\u0E19\u0E04\u0E27\u0E32\u0E21\u0E23\u0E39\u0E49\u0E04\u0E27\u0E32\u0E21\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16" }, "1 \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E1E\u0E39\u0E19\u0E04\u0E27\u0E32\u0E21\u0E23\u0E39\u0E49\u0E04\u0E27\u0E32\u0E21\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16"),
                                react_1["default"].createElement("option", { value: "\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E1B\u0E23\u0E31\u0E1A\u0E27\u0E38\u0E12\u0E34\u0E01\u0E32\u0E23\u0E28\u0E36\u0E01\u0E29\u0E32" }, "2 \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E1B\u0E23\u0E31\u0E1A\u0E27\u0E38\u0E12\u0E34\u0E01\u0E32\u0E23\u0E28\u0E36\u0E01\u0E29\u0E32"),
                                react_1["default"].createElement("option", { value: "\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E1B\u0E23\u0E31\u0E1A\u0E1B\u0E23\u0E38\u0E07\u0E15\u0E33\u0E41\u0E2B\u0E19\u0E48\u0E07\u0E2B\u0E19\u0E49\u0E32\u0E17\u0E35\u0E48\u0E01\u0E32\u0E23\u0E07\u0E32\u0E19" }, "3 \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E1B\u0E23\u0E31\u0E1A\u0E1B\u0E23\u0E38\u0E07\u0E15\u0E33\u0E41\u0E2B\u0E19\u0E48\u0E07\u0E2B\u0E19\u0E49\u0E32\u0E17\u0E35\u0E48\u0E01\u0E32\u0E23\u0E07\u0E32\u0E19"),
                                react_1["default"].createElement("option", { value: "4" }, "4 \u0E2D\u0E37\u0E48\u0E19\u0E46 (\u0E42\u0E1B\u0E23\u0E14\u0E23\u0E30\u0E1A\u0E38)")),
                            isFurtherStudyReasonOther && (react_1["default"].createElement("input", { name: "furtherStudyReasonOther", value: formData.furtherStudyReasonOther, onChange: handleChange, className: inputClass + " mt-2", type: "text", placeholder: "\u0E42\u0E1B\u0E23\u0E14\u0E23\u0E30\u0E1A\u0E38\u0E40\u0E2B\u0E15\u0E38\u0E1C\u0E25\u0E2D\u0E37\u0E48\u0E19\u0E46", required: true }))))))),
            react_1["default"].createElement(FormSection, { title: "5. \u0E02\u0E49\u0E2D\u0E40\u0E2A\u0E19\u0E2D\u0E41\u0E19\u0E30", icon: lucide_react_1.MessageSquare },
                react_1["default"].createElement("div", { className: "mb-8" },
                    react_1["default"].createElement("label", { htmlFor: "suggestion", className: labelClass }, "\u0E02\u0E49\u0E2D\u0E40\u0E2A\u0E19\u0E2D\u0E41\u0E19\u0E30\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E01\u0E32\u0E23\u0E1E\u0E31\u0E12\u0E19\u0E32\u0E27\u0E34\u0E17\u0E22\u0E32\u0E25\u0E31\u0E22 (\u0E44\u0E21\u0E48\u0E1A\u0E31\u0E07\u0E04\u0E31\u0E1A)"),
                    react_1["default"].createElement("textarea", { id: "suggestion", name: "suggestion", value: formData.suggestion, onChange: handleChange, rows: 4, className: inputClass + " resize-none", placeholder: "\u0E01\u0E23\u0E2D\u0E01\u0E02\u0E49\u0E2D\u0E40\u0E2A\u0E19\u0E2D\u0E41\u0E19\u0E30\u0E17\u0E35\u0E48\u0E19\u0E35\u0E48..." }))),
            react_1["default"].createElement("div", { className: "mt-8 flex flex-col justify-end gap-4 border-t border-gray-200 pt-6 sm:flex-row dark:border-gray-700" },
                react_1["default"].createElement(link_1["default"], { href: "/EmploymentDashboard", className: "text-gray-5000 flex items-center justify-center gap-1 rounded-xl border border-gray-300 bg-gray-100 px-6 py-3 font-medium transition hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600" },
                    react_1["default"].createElement(lucide_react_1.X, { className: "h-5 w-5" }),
                    " \u0E22\u0E01\u0E40\u0E25\u0E34\u0E01"),
                react_1["default"].createElement("button", { type: "submit", disabled: isLoading, className: "flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-6 py-3 font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-600 hover:shadow-blue-600/40 focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-blue-800" }, isLoading ? (react_1["default"].createElement(react_1["default"].Fragment, null,
                    react_1["default"].createElement(lucide_react_1.Loader2, { className: "h-5 w-5 animate-spin" }),
                    " \u0E01\u0E33\u0E25\u0E31\u0E07\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01...")) : (react_1["default"].createElement(react_1["default"].Fragment, null,
                    react_1["default"].createElement(lucide_react_1.ChevronRight, { className: "h-5 w-5" }),
                    " \u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E01\u0E32\u0E23\u0E41\u0E01\u0E49\u0E44\u0E02"))))),
        react_1["default"].createElement(CustomAlertModal, { isOpen: alertState.isOpen, type: alertState.type, title: alertState.title, message: alertState.message, onClose: handleCloseAlert })));
};
exports["default"] = SuveryEditForm;
