import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const size = parseInt(searchParams.get("size") || "0");

  if (size > 0) {
    // Generate dummy data for download test (max 20MB to be safe)
    const bufferSize = Math.min(size, 20 * 1024 * 1024);
    const data = new Uint8Array(bufferSize);
    return new NextResponse(data, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Content-Disposition": "attachment; filename=speedtest.bin",
      },
    });
  }

  // Small response for Ping/RTT
  return NextResponse.json({ status: "ok", timestamp: Date.now() });
}

export async function POST(request: Request) {
  // Read the body to ensure it's fully uploaded
  await request.arrayBuffer();
  return NextResponse.json({ status: "ok", timestamp: Date.now() });
}
