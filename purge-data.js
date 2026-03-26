const { MongoClient } = require('mongodb');

async function purgeTestData() {
  const uri = "mongodb+srv://allm:admin@ktltc.igrso.mongodb.net/ktltc_db?retryWrites=true&w=majority&appName=ktltc";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("ktltc_db");
    
    console.log("🔥 Purging test data...");

    const attResult = await db.collection("attendances").deleteMany({});
    console.log(`✅ Deleted ${attResult.deletedCount} attendance records.`);

    const leaveResult = await db.collection("leave_requests").deleteMany({});
    console.log(`✅ Deleted ${leaveResult.deletedCount} leave requests.`);

    const logResult = await db.collection("activity_logs").deleteMany({});
    console.log(`✅ Deleted ${logResult.deletedCount} activity logs.`);

    // Check counts after purge
    const userCount = await db.collection("users").countDocuments();
    console.log(`ℹ️ System remains with ${userCount} Users.`);

    console.log("✨ Data Purge Complete. System is now 100% Real Usage Mode.");

  } catch (err) {
    console.error("❌ Purge Failed:", err.message);
  } finally {
    await client.close();
  }
}

purgeTestData();
