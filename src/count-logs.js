const fs = require('fs');
const { MongoClient } = require('mongodb');

async function countLogs() {
  const envFile = fs.readFileSync('.env', 'utf8');
  const match = envFile.match(/MONGODB_URI=(.*)/);
  if (!match) {
    fs.writeFileSync('count-log.txt', "MONGODB_URI not found in .env");
    process.exit(1);
  }
  const uri = match[1].trim();
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("ktltc_db");
    const count = await db.collection("logs").countDocuments();
    const actCount = await db.collection("activity_logs").countDocuments();
    fs.writeFileSync('count-log.txt', `logs count: ${count}, activity_logs count: ${actCount}`);
  } catch (err) {
    fs.writeFileSync('count-log.txt', "Error: " + err.message);
  } finally {
    await client.close();
  }
}

countLogs();
