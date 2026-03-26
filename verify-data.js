const { MongoClient } = require('mongodb');
const fs = require('fs');
require('dotenv').config();

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    fs.writeFileSync('diagnostic-results.json', JSON.stringify({ error: "No MONGODB_URI" }));
    return;
  }
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("ktltc_db");
    const collections = await db.listCollections().toArray();
    const colNames = collections.map(c => c.name);
    
    const results = {
      uri: uri.split('@')[1], // Show cluster name only for safety
      collections: colNames,
      counts: {}
    };

    if (colNames.includes("attendances")) results.counts.attendances = await db.collection("attendances").countDocuments();
    if (colNames.includes("attendance")) results.counts.attendance = await db.collection("attendance").countDocuments();
    if (colNames.includes("leave_requests")) results.counts.leave_requests = await db.collection("leave_requests").countDocuments();
    if (colNames.includes("suvery")) results.counts.suvery = await db.collection("suvery").countDocuments();
    if (colNames.includes("users")) results.counts.users = await db.collection("users").countDocuments();

    fs.writeFileSync('diagnostic-results.json', JSON.stringify(results, null, 2));
    console.log("Diagnostic complete. Results in diagnostic-results.json");
  } catch (e) {
    fs.writeFileSync('diagnostic-results.json', JSON.stringify({ error: e.message }));
  } finally {
    await client.close();
  }
}
run();
