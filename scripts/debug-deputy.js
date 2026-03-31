const { MongoClient } = require("mongodb");
const fs = require('fs');
const path = require('path');

async function run() {
  const envPath = path.resolve(__dirname, '../.env');
  let uri = process.env.MONGODB_URI;
  if (!uri && fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    uri = envContent.match(/MONGODB_URI=(.*)/)?.[1]?.trim();
  }
  if (!uri) process.exit(1);

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("ktltc_db");
    const users = await db.collection("users").find({ role: /deputy/i }).toArray();
    console.log("DEPUTY_USERS:", JSON.stringify(users.map(u => ({ name: u.name, role: u.role })), null, 2));
  } finally {
    await client.close();
  }
}
run();
