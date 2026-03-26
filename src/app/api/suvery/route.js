import clientPromise from "@/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// =======================================================
// 💡 POST Handler: สำหรับรับข้อมูลสำรวจใหม่ (Create)
// =======================================================
export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.studentId || !body.fullName) {
      return NextResponse.json(
        { message: "รหัสนักศึกษาและชื่อ-สกุลเป็นข้อมูลที่จำเป็น" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db("ktltc_db");
    
    // Convert ID if present (unlikely for new POST but safe)
    if (body._id) delete body._id;

    await db.collection("suvery").insertOne(body);

    return NextResponse.json(
      { message: "บันทึกข้อมูลสำรวจสำเร็จ" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating suvery entry:", error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return NextResponse.json(
        {
          message: `ข้อมูลซ้ำ: รหัส ${field} นี้มีอยู่ในระบบแล้ว`,
          field: field,
          value: error.keyValue[field],
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการบันทึกข้อมูลสำรวจ", error: error.message },
      { status: 500 },
    );
  }
}

// =======================================================
// 🚀 GET Handler: ดึงข้อมูลทั้งหมด หรือ ดึงข้อมูลเดียวตาม ID
// =======================================================
export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (id) {
      if (!ObjectId.isValid(id)) {
        return NextResponse.json(
          { message: "Invalid ID format" },
          { status: 400 },
        );
      }

      const suvery = await db.collection("suvery").findOne({ _id: new ObjectId(id) });

      if (!suvery) {
        return NextResponse.json(
          { message: `Suvery with ID ${id} not found.` },
          { status: 404 },
        );
      }
      return NextResponse.json({ suvery }, { status: 200 });
    } else {
      const suverys = await db.collection("suvery").find().toArray();
      return NextResponse.json({ suverys }, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching suvery entries:", error);
    return NextResponse.json(
      {
        message: "เกิดข้อผิดพลาดในการดึงข้อมูลสำรวจ",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

// =======================================================
// 🗑️ DELETE Handler: สำหรับลบข้อมูลสำรวจตาม ID
// =======================================================
export async function DELETE(request) {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "ID parameter is required" },
        { status: 400 },
      );
    }
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid ID format" },
        { status: 400 },
      );
    }

    const result = await db.collection("suvery").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: `Suvery with ID ${id} not found.` },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { message: "Suvery deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("❌ SERVER DELETE ERROR:", error);
    return NextResponse.json(
      {
        message: "Failed to delete suvery due to server error.",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

// =======================================================
// ✏️ PUT Handler: สำหรับอัปเดตข้อมูลสำรวจตาม ID
// =======================================================
export async function PUT(request) {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const updatedData = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: "ID parameter is required for update" },
        { status: 400 },
      );
    }
    if (!updatedData || Object.keys(updatedData).length === 0) {
      return NextResponse.json(
        { message: "Update data is required" },
        { status: 400 },
      );
    }
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid ID format" },
        { status: 400 },
      );
    }

    delete updatedData._id;

    const result = await db.collection("suvery").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updatedData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json(
        { message: `Suvery with ID ${id} not found.` },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Suvery updated successfully", suvery: result },
      { status: 200 },
    );
  } catch (error) {
    console.error("❌ SERVER PUT (UPDATE) ERROR:", error);
    return NextResponse.json(
      {
        message: "Failed to update suvery due to server error.",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
