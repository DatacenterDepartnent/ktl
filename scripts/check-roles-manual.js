const { MongoClient } = require("mongodb");
const fs = require('fs');
const path = require('path');

async function run() {
  if (!process.env.MONGODB_URI) {
    const envPath = path.resolve(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      envContent.split('\n').forEach(line => {
        const match = line.match(/^\s*MONGODB_URI\s*=\s*(.*)\s*$/);
        if (match) process.env.MONGODB_URI = match[1].trim();
      });
    }
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) { process.exit(1); }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("ktltc_db");
    const stats = await db.collection("users").aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ]).toArray();
    console.log("ROLES_IN_DB:", JSON.stringify(stats, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}
run();
