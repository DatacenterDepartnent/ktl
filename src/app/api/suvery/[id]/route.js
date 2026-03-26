// src/app/api/suvery/[id]/route.js

import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

// =======================================================
// 🚀 GET: ดึงข้อมูลแบบสำรวจรายบุคคล (By ID)
// =======================================================
export async function GET(request, { params }) {
    try {
        const client = await clientPromise;
        const db = client.db("ktltc_db");

        // ✅ รองรับ Next.js 15: ต้อง await params ก่อน
        const { id } = await params;

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
        }

        const suvery = await db.collection("suvery").findOne({ _id: new ObjectId(id) });

        if (!suvery) {
            return NextResponse.json({ message: "ไม่พบข้อมูลแบบสำรวจ" }, { status: 404 });
        }

        return NextResponse.json({ suvery }, { status: 200 });

    } catch (error) {
        console.error("Error fetching single suvery:", error);
        return NextResponse.json(
            { message: "Server Error", error: error.message },
            { status: 500 }
        );
    }
}

// =======================================================
// 💾 PUT: อัปเดตข้อมูล (Update)
// =======================================================
export async function PUT(request, { params }) {
    try {
        const client = await clientPromise;
        const db = client.db("ktltc_db");

        // ✅ รองรับ Next.js 15
        const { id } = await params;

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
        }

        const body = await request.json();
        // ลบ _id ออกจาก body ถ้ามี เพื่อป้องกัน error ตอนอัปเดต
        delete body._id;

        const result = await db.collection("suvery").findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: body },
            { returnDocument: 'after' }
        );

        if (!result) {
            return NextResponse.json({ message: "ไม่พบข้อมูลที่จะอัปเดต" }, { status: 404 });
        }

        return NextResponse.json({
            message: "อัปเดตข้อมูลสำเร็จ",
            suvery: result
        }, { status: 200 });

    } catch (error) {
        console.error("Error updating suvery:", error);

        // จัดการ Error กรณีข้อมูลซ้ำ
        if (error.code === 11000) {
            return NextResponse.json(
                { message: "ข้อมูลซ้ำ: รหัสนักศึกษานี้มีอยู่แล้ว" },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { message: "Server Error", error: error.message },
            { status: 500 }
        );
    }
}

// =======================================================
// 🗑️ DELETE: ลบข้อมูล (Delete)
// =======================================================
export async function DELETE(request, { params }) {
    try {
        const client = await clientPromise;
        const db = client.db("ktltc_db");

        // ✅ รองรับ Next.js 15
        const { id } = await params;

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
        }

        const result = await db.collection("suvery").deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: "ไม่พบข้อมูลที่จะลบ" }, { status: 404 });
        }

        return NextResponse.json({ message: "ลบข้อมูลสำเร็จ" }, { status: 200 });

    } catch (error) {
        console.error("Error deleting suvery:", error);
        return NextResponse.json(
            { message: "Server Error", error: error.message },
            { status: 500 }
        );
    }
}