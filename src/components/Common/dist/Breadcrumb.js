"use strict";
exports.__esModule = true;
var link_1 = require("next/link");
var Breadcrumb = function (_a) {
    var pageName = _a.pageName, pageDescription = _a.pageDescription;
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "z-10 overflow-hidden pt-[100px] pb-[60px]" },
            React.createElement("div", { className: "from-stroke/0 via-stroke to-stroke/0 absolute bottom-0 left-0 h-px w-full bg-linear-to-r" }),
            React.createElement("div", { className: "container" },
                React.createElement("div", { className: "-mx-4 flex flex-wrap items-center" },
                    React.createElement("div", { className: "w-full" },
                        React.createElement("div", { className: "text-center" },
                            React.createElement("h1", { className: "mb-4 text-3xl font-bold text-black sm:text-4xl md:text-[40px] md:leading-[1.2]" }, pageName),
                            React.createElement("p", { className: "text-body-color mb-5 text-base" }, pageDescription),
                            React.createElement("ul", { className: "flex items-center justify-center gap-2.5" },
                                React.createElement("li", null,
                                    React.createElement(link_1["default"], { href: "/", className: "flex items-center gap-2.5 text-base font-medium text-black" }, "Home")),
                                React.createElement("li", null,
                                    React.createElement("p", { className: "text-body-color flex items-center gap-2.5 text-base font-medium" },
                                        React.createElement("span", { className: "text-body-color" }, " / "),
                                        pageName))))))))));
};
exports["default"] = Breadcrumb;
