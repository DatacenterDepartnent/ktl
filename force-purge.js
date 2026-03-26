const { MongoClient } = require('mongodb');

async function forcePurge() {
  const uri = "mongodb+srv://allm:admin@ktltc.igrso.mongodb.net/ktltc_db?retryWrites=true&w=majority&appName=ktltc";
  console.log(">>> [PURGE] Attempting to connect to Atlas...");
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });

  try {
    await client.connect();
    console.log(">>> [PURGE] Connected Successfully!");
    const db = client.db("ktltc_db");
    
    const collections = ["attendances", "leave_requests", "activity_logs"];
    for (const col of collections) {
      console.log(`>>> [PURGE] Clearing collection: ${col}...`);
      const result = await db.collection(col).deleteMany({});
      console.log(`>>> [PURGE] Result for ${col}: Deleted ${result.deletedCount} documents.`);
    }

    console.log(">>> [PURGE] COMPLETED SUCCESSFULLY. System is now clean.");
  } catch (err) {
    console.error(">>> [PURGE] FAILED:", err.message);
  } finally {
    await client.close();
    process.exit(0);
  }
}

forcePurge();
