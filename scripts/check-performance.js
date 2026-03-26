const { MongoClient } = require('mongodb');

async function run() {
  const uri = "mongodb+srv://ktlltc:1685@cluster0.aekx2.mongodb.net/ktltc_db?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('ktltc_db');
    
    console.log("--- Attendances Indexes ---");
    const attIdx = await db.collection("attendances").listIndexes().toArray();
    console.log(JSON.stringify(attIdx, null, 2));

    console.log("\n--- Leave Requests Indexes ---");
    const leaveIdx = await db.collection("leave_requests").listIndexes().toArray();
    console.log(JSON.stringify(leaveIdx, null, 2));

    console.log("\n--- Sample Attendance Record to Check Size ---");
    const sample = await db.collection("attendances").findOne({});
    if (sample) {
        const sizeKb = Buffer.byteLength(JSON.stringify(sample)) / 1024;
        console.log(`Sample size: ${sizeKb.toFixed(2)} KB`);
        console.log("Keys:", Object.keys(sample));
    }
  } catch(e) {
    console.error(e);
  } finally {
    await client.close();
  }
}
run();
