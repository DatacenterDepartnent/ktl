"use client";

import React from "react";
import Link from "next/link";

import type { QRCodeProps } from "antd";
import {
  Input,
  QRCode,
  Space,
  Button,
  Segmented,
  ConfigProvider,
  theme,
} from "antd";

function doDownload(url: string, fileName: string) {
  const a = document.createElement("a");
  a.download = fileName;
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

const downloadCanvasQRCode = () => {
  const canvas = document
    .getElementById("myqrcode")
    ?.querySelector<HTMLCanvasElement>("canvas");
  if (canvas) {
    const url = canvas.toDataURL();
    doDownload(url, "QRCode.png");
  }
};

const downloadSvgQRCode = () => {
  const svg = document
    .getElementById("myqrcode")
    ?.querySelector<SVGElement>("svg");
  const svgData = new XMLSerializer().serializeToString(svg!);
  const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  doDownload(url, "QRCode.svg");
};

export default function CreateQRCode() {
  const [text, setText] = React.useState("");
  const [renderType, setRenderType] =
    React.useState<QRCodeProps["type"]>("canvas");

  return (
    // เพิ่ม min-h-screen และสีพื้นหลังหลัก เพื่อรองรับ Dark Mode เต็มหน้าจอ
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="relative z-10 overflow-hidden  pb-[60px]">
        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-gray-700"></div>
        <div className="text-center">
          <h1 className="flex justify-center text-xl font-semibold text-black dark:text-white">
            ระบบสร้าง QR Code
          </h1>
          <h1 className="flex justify-center pb-8 text-xl text-[#DAA520] font-bold mt-2">
            วิทยาลัยเทคนิคกันทรลักษ์
          </h1>
          <ul className="flex items-center justify-center gap-2.5">
            <li>
              <Link
                href="/"
                className="flex items-center gap-2.5 text-base font-medium text-black hover:text-blue-600 dark:text-white dark:hover:text-blue-400 transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <p className="flex items-center gap-2.5 text-base font-medium text-gray-500 dark:text-gray-400">
                <span>/</span>
                Qrcode
              </p>
            </li>
          </ul>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex justify-center pt-10 pb-24">
        <Space id="myqrcode" orientation="vertical" size="large">
          {/* Toggle Switch (Segmented) */}
          <div className="flex justify-center pb-2">
            {/* ใช้ className ปรับสี Segmented ใน Dark Mode */}
            <div className="bg-gray-100 p-1 rounded-lg dark:bg-gray-800">
              <Segmented
                options={["canvas", "svg"]}
                value={renderType}
                onChange={setRenderType}
                className="dark:text-gray-200"
              />
            </div>
          </div>

          <div className="pt-4">
            <Space orientation="vertical" align="center" size={30}>
              {/* QRCode Container */}
              {/* ใส่พื้นหลังสีขาวเสมอ เพื่อให้ QR Scan ติดง่าย แม้จะอยู่บน Dark Mode */}
              <div className="p-6 bg-white rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 dark:shadow-none">
                <QRCode
                  type={renderType}
                  value={text || "-"}
                  size={200}
                  style={{ margin: "auto" }}
                />
              </div>

              {/* Input Area */}
              <div className="w-full">
                <Input
                  size="large"
                  allowClear
                  placeholder="กรอกข้อความหรือ URL ที่นี่"
                  maxLength={200}
                  style={{ width: 320, textAlign: "center" }}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  // Class overrides สำหรับ Antd Input ให้รองรับ Dark Mode
                  className="
                    !bg-transparent 
                    !border-gray-300 
                    focus:!border-blue-500 
                    dark:!text-white 
                    dark:!border-gray-600 
                    dark:placeholder:!text-gray-500
                    dark:focus:!border-blue-400
                    [&>input]:dark:!bg-transparent
                    [&>input]:dark:!text-white
                  "
                />
              </div>

              {/* Download Button */}
              <div>
                <Button
                  type="primary"
                  size="large"
                  onClick={
                    renderType === "canvas"
                      ? downloadCanvasQRCode
                      : downloadSvgQRCode
                  }
                  className="h-12 px-8 rounded-xl font-medium shadow-blue-500/30 hover:shadow-blue-500/50 transition-shadow"
                >
                  Download QR Code
                </Button>
              </div>
            </Space>
          </div>
        </Space>
      </div>
    </div>
  );
}
