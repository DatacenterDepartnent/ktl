"use client";
"use strict";
exports.__esModule = true;
exports.LayoutGrid = void 0;
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
var utils_1 = require("@/lib/utils");
exports.LayoutGrid = function (_a) {
  var cards = _a.cards;
  var _b = react_1.useState(null),
    selected = _b[0],
    setSelected = _b[1];
  var _c = react_1.useState(null),
    lastSelected = _c[0],
    setLastSelected = _c[1];
  var handleClick = function (card) {
    setLastSelected(selected);
    setSelected(card);
  };
  var handleOutsideClick = function () {
    setLastSelected(selected);
    setSelected(null);
  };
  return react_1["default"].createElement(
    "div",
    {
      className:
        "w-full h-full p-10 grid grid-cols-1 md:grid-cols-3  max-w-[1600px] mx-auto gap-4 relative",
    },
    cards.map(function (card, i) {
      return react_1["default"].createElement(
        "div",
        { key: i, className: utils_1.cn(card.className, "") },
        react_1["default"].createElement(
          framer_motion_1.motion.div,
          {
            onClick: function () {
              return handleClick(card);
            },
            className: utils_1.cn(
              card.className,
              "relative overflow-hidden",
              (selected === null || selected === void 0
                ? void 0
                : selected.id) === card.id
                ? "rounded-lg cursor-pointer absolute inset-0 h-1/2 w-full md:w-1/2 m-auto z-50 flex justify-center items-center flex-wrap flex-col"
                : (lastSelected === null || lastSelected === void 0
                      ? void 0
                      : lastSelected.id) === card.id
                  ? "z-40 bg-white rounded-xl h-full w-full"
                  : "bg-white rounded-xl h-full w-full",
            ),
            layoutId: "card-" + card.id,
          },
          (selected === null || selected === void 0 ? void 0 : selected.id) ===
            card.id &&
            react_1["default"].createElement(SelectedCard, {
              selected: selected,
            }),
          react_1["default"].createElement(ImageComponent, { card: card }),
        ),
      );
    }),
    react_1["default"].createElement(framer_motion_1.motion.div, {
      onClick: handleOutsideClick,
      className: utils_1.cn(
        "absolute h-full w-full left-0 top-0 bg-black opacity-0 z-10",
        (selected === null || selected === void 0 ? void 0 : selected.id)
          ? "pointer-events-auto"
          : "pointer-events-none",
      ),
      animate: {
        opacity: (
          selected === null || selected === void 0 ? void 0 : selected.id
        )
          ? 0.3
          : 0,
      },
    }),
  );
};
var ImageComponent = function (_a) {
  var card = _a.card;
  return react_1["default"].createElement(framer_motion_1.motion.img, {
    layoutId: "image-" + card.id + "-image",
    src: card.thumbnail,
    height: "500",
    width: "500",
    className: utils_1.cn(
      "object-cover object-top absolute inset-0 h-full w-full transition duration-200",
    ),
    alt: "thumbnail",
  });
};
var SelectedCard = function (_a) {
  var selected = _a.selected;
  return react_1["default"].createElement(
    "div",
    {
      className:
        "bg-transparent h-full w-full flex flex-col justify-end rounded-lg shadow-2xl relative z-[60]",
    },
    react_1["default"].createElement(framer_motion_1.motion.div, {
      initial: {
        opacity: 0,
      },
      animate: {
        opacity: 0.6,
      },
      className: "absolute inset-0 h-full w-full bg-black opacity-60 z-10",
    }),
    react_1["default"].createElement(framer_motion_1.motion.div, {
      layoutId:
        "content-" +
        (selected === null || selected === void 0 ? void 0 : selected.id),
      initial: {
        opacity: 0,
        y: 100,
      },
      animate: {
        opacity: 1,
        y: 0,
      },
      exit: {
        opacity: 0,
        y: 100,
      },
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
      className: "relative px-8 pb-4 z-[70]",
    }),
  );
};
