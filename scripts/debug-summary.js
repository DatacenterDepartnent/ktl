const fs = require('fs');
const { MongoClient } = require('mongodb');

async function debugSummary() {
  const envFile = fs.readFileSync('.env', 'utf8');
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

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    console.log("Running aggregation...");
    try {
      const stats = await db
        .collection("logs")
        .aggregate([
          {
            $match: { timestamp: { $gte: thirtyDaysAgo } },
          },
          {
            $group: {
              totalActions: { $sum: 1 },
              approvals: {
                $sum: {
                  $cond: [
                    { $regexMatch: { input: { $ifNull: ["$action", ""] }, regex: "APPROVE|ACCEPT", options: "i" } },
                    1,
                    0,
                  ],
                },
              },
              roleChanges: {
                $sum: {
                  $cond: [
                    { $regexMatch: { input: { $ifNull: ["$action", ""] }, regex: "ROLE|PERMISSION", options: "i" } },
                    1,
                    0,
                  ],
                },
              },
              updates: {
                $sum: {
                  $cond: [
                    { $regexMatch: { input: { $ifNull: ["$action", ""] }, regex: "UPDATE|EDIT|PATCH", options: "i" } },
                    1,
                    0,
                  ],
                },
              },
            },
          },
        ])
        .toArray();
      console.log("Aggregation Result:", JSON.stringify(stats, null, 2));
    } catch (aggError) {
      console.error("Aggregation Error details:", aggError);
    }

    // Check document sample
    const sample = await db.collection("logs").findOne({ timestamp: { $exists: true } });
    console.log("Sample Document:", JSON.stringify(sample, null, 2));

  } catch (err) {
    console.error("Connection error:", err);
  } finally {
    await client.close();
  }
}

debugSummary();
