const { MongoClient } = require("mongodb");

async function check() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not defined in .env file");
    return;
  }
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("ktltc_db");
    const docs = await db
      .collection("attendances")
      .find({})
      .sort({ date: -1 })
      .limit(5)
      .toArray();
    console.log("Recent Attendance Docs:");
    docs.forEach((d) => {
      console.log(
        `ID: ${d._id}, Date: ${d.date.toISOString()}, Status: ${d.status}`,
      );
    });
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

check();
