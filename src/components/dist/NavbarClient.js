"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var link_1 = require("next/link");
var image_1 = require("next/image");
var MobileMenu_1 = require("./MobileMenu");
var ThemeToggle_1 = require("./ThemeToggle");
var LogoutBtn_1 = require("./LogoutBtn"); // อย่าลืม import ถ้ามี component นี้
function NavbarClient(_a) {
  var menuTree = _a.menuTree,
    username = _a.username,
    role = _a.role;
  var _b = react_1.useState(false),
    isScrolled = _b[0],
    setIsScrolled = _b[1];
  var _c = react_1.useState(false),
    isUserDropdownOpen = _c[0],
    setIsUserDropdownOpen = _c[1];
  react_1.useEffect(function () {
    var handleScroll = function () {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return function () {
      return window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return React.createElement(
    "nav",
    {
      className:
        "sticky top-0 z-50 w-full transition-all duration-300 ease-in-out border-b " +
        (isScrolled
          ? "py-2 bg-white/95 dark:bg-zinc-950/95 shadow-md border-zinc-200 dark:border-zinc-800 backdrop-blur-md"
          : "py-4 bg-white/50 dark:bg-zinc-950/50 shadow-none border-transparent backdrop-blur-sm"),
    },
    React.createElement(
      "div",
      {
        className:
          "max-w-[1600px] mx-auto px-6 flex items-center justify-between",
      },
      React.createElement(
        link_1["default"],
        {
          href: "/",
          className:
            "font-black tracking-tighter flex items-center gap-2 hover:opacity-80 transition-transform duration-300 " +
            (isScrolled ? "scale-90" : "scale-100"),
        },
        React.createElement(image_1["default"], {
          src: "/images/favicon.ico",
          alt: "KTL Logo",
          width: 44,
          height: 44,
          priority: true,
          className: "w-10 h-10 md:w-11 md:h-11",
        }),
        React.createElement(
          "span",
          {
            className:
              "  text-zinc-800 dark:text-white font-extrabold tracking-tighter text-xl",
          },
          "KTLTC",
        ),
      ),
      React.createElement(
        "div",
        { className: "hidden xl:flex items-center gap-6" },
        React.createElement(
          link_1["default"],
          {
            href: "/",
            className:
              "text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition",
          },
          "\u0E2B\u0E19\u0E49\u0E32\u0E41\u0E23\u0E01",
        ),
        menuTree.map(function (item) {
          return React.createElement(
            "div",
            {
              key: item._id,
              className: "relative group flex items-center h-full py-2",
            },
            React.createElement(
              link_1["default"],
              {
                href: item.path || "#",
                className:
                  "flex items-center gap-1 text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer",
              },
              item.label,
              item.children &&
                item.children.length > 0 &&
                React.createElement(
                  "svg",
                  {
                    className:
                      "w-3 h-3 group-hover:rotate-180 transition-transform duration-200",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor",
                  },
                  React.createElement("path", {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M19 9l-7 7-7-7",
                  }),
                ),
            ),
            item.children &&
              item.children.length > 0 &&
              React.createElement(
                "div",
                {
                  className:
                    "absolute left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-4 group-hover:translate-y-0 " +
                    (isScrolled ? "top-8" : "top-10"),
                },
                React.createElement(
                  "div",
                  {
                    className:
                      "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl overflow-hidden min-w-[220px] py-2",
                  },
                  item.children.map(function (child) {
                    return React.createElement(
                      link_1["default"],
                      {
                        key: child._id,
                        href: child.path,
                        className:
                          "block px-4 py-2.5 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-blue-50 dark:hover:bg-zinc-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors",
                      },
                      child.label,
                    );
                  }),
                ),
              ),
          );
        }),
      ),
      React.createElement(
        "div",
        { className: "flex items-center gap-3 sm:gap-4" },
        React.createElement(ThemeToggle_1["default"], null),
        React.createElement(
          "div",
          { className: "hidden xl:flex items-center gap-4" },
          username
            ? React.createElement(
                "div",
                {
                  className: "relative",
                  onMouseEnter: function () {
                    return setIsUserDropdownOpen(true);
                  },
                  onMouseLeave: function () {
                    return setIsUserDropdownOpen(false);
                  },
                },
                React.createElement(
                  "button",
                  {
                    className:
                      "flex items-center gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-3 py-1.5 rounded-full transition-colors cursor-pointer border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700",
                  },
                  React.createElement(
                    "div",
                    { className: "text-right hidden sm:block" },
                    React.createElement(
                      "div",
                      {
                        className:
                          "text-[10px] font-bold tracking-widest uppercase text-zinc-400",
                      },
                      (role === null || role === void 0
                        ? void 0
                        : role.replace("_", " ")) || "Member",
                    ),
                    React.createElement(
                      "div",
                      {
                        className:
                          "text-xs font-bold text-zinc-700 dark:text-zinc-200",
                      },
                      username,
                    ),
                  ),
                  React.createElement(
                    "div",
                    {
                      className:
                        "w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20",
                    },
                    username.charAt(0).toUpperCase(),
                  ),
                ),
                isUserDropdownOpen &&
                  React.createElement(
                    "div",
                    {
                      className:
                        "absolute right-0 top-full pt-2 w-64 animate-in fade-in zoom-in-95 duration-200",
                    },
                    React.createElement(
                      "div",
                      {
                        className:
                          "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden",
                      },
                      React.createElement(
                        "div",
                        {
                          className:
                            "px-5 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/50",
                        },
                        React.createElement(
                          "p",
                          {
                            className:
                              "text-xs text-slate-500 dark:text-slate-400 font-medium",
                          },
                          "Signed in as",
                        ),
                        React.createElement(
                          "p",
                          {
                            className:
                              "text-sm font-bold text-slate-800 dark:text-white truncate",
                          },
                          username,
                        ),
                      ),
                      React.createElement(
                        "div",
                        { className: "p-2 space-y-1" },
                        role === "super_admin" &&
                          React.createElement(
                            link_1["default"],
                            {
                              href: "/dashboard/super-admin",
                              className:
                                "flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-yellow-600 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-900/20 rounded-lg transition-colors",
                            },
                            React.createElement("span", null, "\u26A1"),
                            " Super Admin Console",
                          ),
                        React.createElement(
                          link_1["default"],
                          {
                            href: "/dashboard",
                            className:
                              "flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-lg transition-colors",
                          },
                          React.createElement("span", null, "\uD83D\uDE80"),
                          " \u0E44\u0E1B\u0E17\u0E35\u0E48 Dashboard",
                        ),
                        React.createElement(
                          link_1["default"],
                          {
                            href: "/dashboard/profile",
                            className:
                              "flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-lg transition-colors",
                          },
                          React.createElement("span", null, "\uD83D\uDC64"),
                          " \u0E08\u0E31\u0E14\u0E01\u0E32\u0E23\u0E42\u0E1B\u0E23\u0E44\u0E1F\u0E25\u0E4C",
                        ),
                        React.createElement(
                          "div",
                          {
                            className:
                              "border-t border-zinc-100 dark:border-zinc-800 mt-2 pt-2",
                          },
                          React.createElement(LogoutBtn_1["default"], null),
                        ),
                      ),
                    ),
                  ),
              )
            : React.createElement(
                link_1["default"],
                {
                  href: "/login",
                  className:
                    "px-5 py-2 rounded-full bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 shadow-md shadow-blue-500/20 transition hover:scale-105 active:scale-95",
                },
                "\u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E23\u0E30\u0E1A\u0E1A",
              ),
        ),
        React.createElement(
          "div",
          { className: "xl:hidden" },
          React.createElement(MobileMenu_1["default"], { menuTree: menuTree }),
        ),
      ),
    ),
  );
}
exports["default"] = NavbarClient;
