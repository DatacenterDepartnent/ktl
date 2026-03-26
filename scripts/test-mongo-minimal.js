const { MongoClient } = require('mongodb');
const fs = require('fs');

async function testMongo() {
  const envFile = fs.readFileSync('.env', 'utf8');
  const match = envFile.match(/MONGODB_URI=(.*)/);
  const uri = match[1].trim();
  console.log("Connecting to:", uri.replace(/:([^@]+)@/, ":****@"));
  const client = new MongoClient(uri, {
    connectTimeoutMS: 5000,
    serverSelectionTimeoutMS: 5000,
  });
  try {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db("ktltc_db");
    const result = await db.command({ ping: 1 });
    console.log("Ping result:", result);
  } catch (err) {
    console.error("Connection Error:", err.message);
  } finally {
    await client.close();
  }
}

testMongo();
