const fs = require("fs");
const { MongoClient } = require("mongodb");

async function verifyLogs() {
  const envFile = fs.readFileSync(".env", "utf8");
  const match = envFile.match(/MONGODB_URI=(.*)/);
  if (!match) {
    console.error("MONGODB_URI not found in .env");
    process.exit(1);
  }
  const uri = match[1].trim();

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("ktltc_db");
    const logs = await db
      .collection("logs")
      .find({})
      .sort({ timestamp: -1 })
      .limit(5)
      .toArray();
    console.log("Latest Logs:");
    console.log(JSON.stringify(logs, null, 2));
  } catch (err) {
    console.error("Connection error:", err);
  } finally {
    await client.close();
  }
}

verifyLogs();
