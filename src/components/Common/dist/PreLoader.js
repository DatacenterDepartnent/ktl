"use strict";
exports.__esModule = true;
var react_1 = require("react");
var PreLoader = function () {
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement("div", { className: "fixed left-0 top-0 z-999999 flex h-screen w-screen items-center justify-center " },
            react_1["default"].createElement("div", { className: "h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent" }))));
};
exports["default"] = PreLoader;
