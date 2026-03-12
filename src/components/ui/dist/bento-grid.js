"use strict";
exports.__esModule = true;
exports.BentoGridItem = exports.BentoGrid = void 0;
var utils_1 = require("@/lib/utils");
exports.BentoGrid = function (_a) {
  var className = _a.className,
    children = _a.children;
  return React.createElement(
    "div",
    {
      className: utils_1.cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-2 gap-2 max-w-[1600px] mx-auto ",
        className,
      ),
    },
    children,
  );
};
exports.BentoGridItem = function (_a) {
  var className = _a.className,
    title = _a.title,
    description = _a.description,
    header = _a.header,
    icon = _a.icon;
  return React.createElement(
    "div",
    {
      className: utils_1.cn(
        "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/20 bg-white border border-transparent justify-between flex flex-col space-y-4",
        className,
      ),
    },
    header,
    React.createElement(
      "div",
      { className: "group-hover/bento:translate-x-2 transition duration-200" },
      icon,
      React.createElement(
        "div",
        {
          className:
            "font-sans font-bold text-neutral-600 dark:text-neutral-200 mb-2 mt-2",
        },
        title,
      ),
      React.createElement(
        "div",
        {
          className:
            "font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300",
        },
        description,
      ),
    ),
  );
};
