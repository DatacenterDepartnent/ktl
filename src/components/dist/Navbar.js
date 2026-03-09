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
var db_1 = require("@/lib/db");
var headers_1 = require("next/headers");
var NavbarClient_1 = require("./NavbarClient");
var jose_1 = require("jose"); // Library สำหรับจัดการ JWT บน Server/Edge
// --- ฟังก์ชัน 1: ดึงและจัดโครงสร้างเมนู ---
function getNavItems() {
    return __awaiter(this, void 0, void 0, function () {
        var client, db, items, allItems_1, parents, menuTree, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, db_1["default"]];
                case 1:
                    client = _a.sent();
                    db = client.db("ktltc_db");
                    return [4 /*yield*/, db
                            .collection("navbar")
                            .find({})
                            .sort({ order: 1 })
                            .toArray()];
                case 2:
                    items = _a.sent();
                    allItems_1 = JSON.parse(JSON.stringify(items));
                    parents = allItems_1.filter(function (item) { return !item.parentId; });
                    menuTree = parents.map(function (parent) {
                        var children = allItems_1.filter(function (child) { return child.parentId === parent._id; });
                        // คืนค่ากลับไปพร้อมลูกๆ
                        return __assign(__assign({}, parent), { children: children });
                    });
                    return [2 /*return*/, menuTree];
                case 3:
                    error_1 = _a.sent();
                    console.error("Failed to fetch nav items:", error_1);
                    return [2 /*return*/, []]; // ถ้ามี Error ให้ส่ง Array ว่างกลับไป เมนูจะไม่พังแต่แค่ไม่แสดง
                case 4: return [2 /*return*/];
            }
        });
    });
}
// --- Main Component (Server Component) ---
function Navbar() {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var menuTree, cookieStore, token, username, role, secret, payload, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getNavItems()];
                case 1:
                    menuTree = _b.sent();
                    return [4 /*yield*/, headers_1.cookies()];
                case 2:
                    cookieStore = _b.sent();
                    token = (_a = cookieStore.get("token")) === null || _a === void 0 ? void 0 : _a.value;
                    username = undefined;
                    role = undefined;
                    if (!token) return [3 /*break*/, 6];
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 5, , 6]);
                    secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_key_change_me");
                    return [4 /*yield*/, jose_1.jwtVerify(token, secret)];
                case 4:
                    payload = (_b.sent()).payload;
                    // ดึงข้อมูล Username และ Role ออกมาจาก Payload
                    if (payload.username)
                        username = payload.username;
                    if (payload.role)
                        role = payload.role;
                    return [3 /*break*/, 6];
                case 5:
                    error_2 = _b.sent();
                    console.error("Token verification failed:", error_2);
                    return [3 /*break*/, 6];
                case 6: 
                // 3. Render: ส่งข้อมูลที่ประมวลผลเสร็จแล้วไปให้ Client Component แสดงผล
                return [2 /*return*/, React.createElement(NavbarClient_1["default"], { menuTree: menuTree, username: username, role: role })];
            }
        });
    });
}
exports["default"] = Navbar;
