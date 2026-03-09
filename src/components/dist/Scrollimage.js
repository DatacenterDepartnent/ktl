"use client";
"use strict";
exports.__esModule = true;
var antd_1 = require("antd");
var framer_motion_1 = require("framer-motion");
var image_1 = require("next/image");
var slides = [
    "/images/banners/19.webp",
    "/images/banners/17.webp",
    "/images/banners/18.webp",
    "/images/banners/8.webp",
    "/images/banners/1.webp",
    "/images/banners/2.webp",
];
var Scrollimage = function () {
    return (React.createElement(antd_1.ConfigProvider, { theme: {
            components: {
                Carousel: {
                    dotActiveWidth: 30,
                    dotWidth: 8,
                    dotHeight: 4
                }
            }
        } },
        React.createElement(framer_motion_1.motion.section, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.8 }, viewport: { once: true }, className: "relative w-full max-w-7xl mx-auto mt-4 mb-8 px-4 overflow-hidden" },
            React.createElement("div", { className: "relative rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-200/50 bg-slate-100" },
                React.createElement(antd_1.Carousel, { arrows: true, infinite: true, autoplay: true, autoplaySpeed: 5000, effect: "fade", className: "group custom-carousel-fix" }, slides.map(function (src, index) { return (React.createElement("div", { key: index, 
                    // Aspect Ratio: 16/9 มาตรฐาน
                    className: "relative aspect-video w-full" },
                    React.createElement("div", { className: "absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" }),
                    React.createElement(image_1["default"], { src: src, alt: "KTLTC Activity Slide " + (index + 1), fill: true, 
                        // ✅ Optimization: โหลดรูปแรกทันที (Priority) รูปอื่นโหลดแบบ Lazy
                        priority: index === 0, className: "object-cover object-center", sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px" }),
                    React.createElement("div", { className: "absolute bottom-6 left-6 md:bottom-10 md:left-10 z-20 text-white hidden md:block" },
                        React.createElement(framer_motion_1.motion.h2, { initial: { opacity: 0, x: -20 }, whileInView: { opacity: 1, x: 0 }, transition: { delay: 0.5 }, className: "text-lg md:text-3xl font-bold tracking-widest uppercase drop-shadow-md" }, "Kantharalak Technical College")))); }))),
            React.createElement("style", { jsx: true, global: true }, "\n          /* 1. \u0E08\u0E31\u0E14\u0E15\u0E33\u0E41\u0E2B\u0E19\u0E48\u0E07\u0E08\u0E38\u0E14 (Dots) */\n          .custom-carousel-fix .slick-dots {\n            bottom: 20px !important;\n          }\n          .custom-carousel-fix .slick-dots li button {\n            background: rgba(255, 255, 255, 0.5) !important;\n          }\n          .custom-carousel-fix .slick-dots li.slick-active button {\n            background: #fff !important;\n          }\n\n          /* 2. \u0E1B\u0E23\u0E31\u0E1A\u0E41\u0E15\u0E48\u0E07\u0E1B\u0E38\u0E48\u0E21\u0E25\u0E39\u0E01\u0E28\u0E23 (Arrows) */\n          .custom-carousel-fix .slick-prev,\n          .custom-carousel-fix .slick-next {\n            top: 50% !important;\n            transform: translateY(-50%) !important;\n            width: 48px !important;\n            height: 48px !important;\n            background: rgba(255, 255, 255, 0.1) !important;\n            backdrop-filter: blur(8px);\n            border: 1px solid rgba(255, 255, 255, 0.2) !important;\n            border-radius: 50% !important;\n            z-index: 30 !important;\n            display: flex !important;\n            align-items: center !important;\n            justify-content: center !important;\n            opacity: 0;\n            transition: all 0.3s ease;\n          }\n\n          /* \u0E2A\u0E23\u0E49\u0E32\u0E07\u0E23\u0E39\u0E1B\u0E25\u0E39\u0E01\u0E28\u0E23\u0E14\u0E49\u0E27\u0E22 CSS Pure (Chevron) */\n          .custom-carousel-fix .slick-prev::after,\n          .custom-carousel-fix .slick-next::after {\n            content: \"\" !important;\n            display: block !important;\n            width: 10px !important;\n            height: 10px !important;\n            border-top: 2.5px solid white !important;\n            border-right: 2.5px solid white !important;\n            transform: rotate(-135deg) !important; /* \u0E25\u0E39\u0E01\u0E28\u0E23\u0E0A\u0E35\u0E49\u0E0B\u0E49\u0E32\u0E22 */\n            margin-left: 4px !important;\n          }\n\n          .custom-carousel-fix .slick-next::after {\n            transform: rotate(45deg) !important; /* \u0E25\u0E39\u0E01\u0E28\u0E23\u0E0A\u0E35\u0E49\u0E02\u0E27\u0E32 */\n            margin-left: -4px !important;\n          }\n\n          /* \u0E41\u0E2A\u0E14\u0E07\u0E1B\u0E38\u0E48\u0E21\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E40\u0E2D\u0E32\u0E40\u0E21\u0E32\u0E2A\u0E4C\u0E27\u0E32\u0E07 (Hover Group) */\n          .custom-carousel-fix.group:hover .slick-prev {\n            left: 20px;\n            opacity: 1;\n          }\n          .custom-carousel-fix.group:hover .slick-next {\n            right: 20px;\n            opacity: 1;\n          }\n\n          /* Hover State \u0E02\u0E2D\u0E07\u0E1B\u0E38\u0E48\u0E21 */\n          .custom-carousel-fix .slick-prev:hover,\n          .custom-carousel-fix .slick-next:hover {\n            background: #f97316 !important; /* \u0E2A\u0E35\u0E2A\u0E49\u0E21 Theme \u0E27\u0E34\u0E17\u0E22\u0E32\u0E25\u0E31\u0E22 */\n            border-color: #f97316 !important;\n          }\n\n          /* \u0E0B\u0E48\u0E2D\u0E19\u0E1B\u0E38\u0E48\u0E21\u0E1A\u0E19\u0E21\u0E37\u0E2D\u0E16\u0E37\u0E2D */\n          @media (max-width: 768px) {\n            .custom-carousel-fix .slick-prev,\n            .custom-carousel-fix .slick-next {\n              display: none !important;\n            }\n          }\n        "))));
};
exports["default"] = Scrollimage;
