import clientPromise from "@/lib/db";

export async function getAllTickets() {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");
    const tickets = await db.collection("tickets").find({}).toArray();

    return { tickets };
  } catch (error) {
    console.error("❌ Error fetching tickets directly:", error);
    return { tickets: [] };
  }
}
