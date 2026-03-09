"use strict";
exports.__esModule = true;
var SectionTitle = function (_a) {
    var subtitle = _a.subtitle, title = _a.title, paragraph = _a.paragraph, _b = _a.width, width = _b === void 0 ? "635px" : _b, center = _a.center;
    return (React.createElement("div", { className: "-mx-4 flex flex-wrap" },
        React.createElement("div", { className: "wow fadeInUp w-full px-4 " + (center ? "mx-auto text-center" : ""), "data-wow-delay": ".1s", style: { maxWidth: width } },
            subtitle && (React.createElement("span", { className: "text-primary mb-2 block text-lg font-semibold" }, subtitle)),
            React.createElement("h2", { className: "mb-4 text-3xl font-bold text-black sm:text-4xl md:text-[40px] md:leading-[1.2]" }, title),
            React.createElement("p", { className: "text-body-color text-base leading-relaxed sm:leading-relaxed" }, paragraph))));
};
exports["default"] = SectionTitle;
