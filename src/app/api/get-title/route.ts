import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ title: null }, { status: 400 });
  }

  try {
    // ดึงข้อมูล HTML จาก URL ปลายทาง (ตั้ง Timeout 5 วิ ป้องกันเว็บค้าง)
    const response = await fetch(targetUrl, {
      signal: AbortSignal.timeout(5000),
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; KTLTC-Bot/1.0)", // บางเว็บป้องกันบอท จึงต้องใส่ Header ให้เนียนๆ
      },
    });

    const html = await response.text();

    // ใช้ Regex ค้นหาแท็ก <title>...</title> ใน HTML
    const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    let title = match ? match[1].trim() : targetUrl; // ถ้าไม่เจอ ให้ใช้ URL แทน

    return NextResponse.json({ title });
  } catch (error) {
    // ถ้าดึงไม่ได้ (เช่น เว็บล่ม หรือไม่ใช่ลิงก์เว็บ) ให้คืนค่าเดิมกลับไป
    return NextResponse.json({ title: targetUrl }, { status: 500 });
  }
}
