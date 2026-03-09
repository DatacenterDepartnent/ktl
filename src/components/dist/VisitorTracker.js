"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var actions_1 = require("@/app/actions");
function VisitorTracker() {
    // ใช้ useRef ป้องกันการรันซ้ำซ้อนใน React Strict Mode
    var hasRun = react_1.useRef(false);
    react_1.useEffect(function () {
        if (!hasRun.current) {
            actions_1.incrementVisitor(); // เรียก Server Action
            hasRun.current = true;
        }
    }, []);
    return null; // Component นี้ไม่มีหน้าตา แค่ทำงานเบื้องหลัง
}
exports["default"] = VisitorTracker;
