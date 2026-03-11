import Ticket from "@/app/models/Ticket";
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/db";

interface LogMetadata {
  ip?: string;
  adminName?: string;
  ticketId?: string;
  [key: string]: any;
}

async function saveLog(
  action: string,
  details: string,
  metadata: LogMetadata = {},
) {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");
    await db.collection("logs").insertOne({
      action,
      details,
      ...metadata,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Log Error:", error);
  }
}

// 🛠 แก้ไข PUT: เติม Promise และ await params
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params; // ✅ ต้อง await ตรงนี้
    const body = await req.json();
    const ticketData = body.formData || body;
    const ip = req.headers.get("x-forwarded-for") || "unknown";

    const allowedRoles = ["editor", "admin", "super_admin"];
    if (!allowedRoles.includes(ticketData.userRole)) {
      return NextResponse.json(
        { message: "Forbidden: Insufficient Permissions" },
        { status: 403 },
      );
    }

    if (ticketData.reply) {
      await Ticket.findByIdAndUpdate(id, {
        $push: {
          replies: {
            content: ticketData.reply,
            author: ticketData.adminName || "Admin",
            createdAt: new Date(),
          },
        },
        $set: { status: "answered" },
      });

      await saveLog("REPLY_TICKET", `Admin replied to ticket ID: ${id}`, {
        adminName: ticketData.adminName,
        ticketId: id,
        ip: ip,
      });
    } else {
      await Ticket.findByIdAndUpdate(id, { ...ticketData });
      await saveLog("UPDATE_TICKET", `Updated ticket ID: ${id}`, {
        ip,
        ticketId: id,
      });
    }

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

// 🛠 แก้ไข DELETE: เติม Promise และ await params
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params; // ✅ ต้อง await ตรงนี้
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const deletedTicket = await Ticket.findByIdAndDelete(id);

    await saveLog("DELETE_TICKET", `Deleted ticket: ${deletedTicket?.title}`, {
      ticketId: id,
      ip,
    });
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

// 🛠 GET (อันนี้พี่แก้ไว้แล้ว สวยงามครับ)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const ticket = await Ticket.findOne({ _id: id });

    if (!ticket) {
      return NextResponse.json(
        { message: "Ticket Not Found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ ticket }, { status: 200 });
  } catch (error) {
    console.error("❌ GET BY ID ERROR:", error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
