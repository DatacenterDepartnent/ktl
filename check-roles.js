require('dotenv').config();
const { MongoClient } = require('mongodb');
async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not defined in .env file");
    return;
  }
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('ktltc_db');
    const roles = await db.collection("users").distinct("role");
    console.log("Existing roles in DB:", roles);
    
    const usersByRole = await db.collection("users").aggregate([
        { $group: { _id: "$role", count: { $sum: 1 } } }
    ]).toArray();
    console.log("Users count per role:", usersByRole);
  } finally {
    await client.close();
  }
}
run();
