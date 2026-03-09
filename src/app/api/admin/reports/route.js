import Log from "@/models/Log";
import dbConnect from "@/lib/mongodb";

export async function GET(req) {
  await dbConnect();

  const report = await Log.aggregate([
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
          action: "$action",
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
  ]);

  return NextResponse.json(report);
}
