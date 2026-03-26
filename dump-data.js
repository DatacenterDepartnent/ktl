const { MongoClient } = require('mongodb');
const fs = require('fs');
require('dotenv').config();

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    fs.writeFileSync('db-dump.json', JSON.stringify({ error: "No MONGODB_URI" }));
    return;
  }
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("ktltc_db");
    const collections = await db.listCollections().toArray();
    
    const dump = {
      dbName: db.databaseName,
      collections: collections.map(c => c.name),
      attendances: await db.collection("attendances").find().limit(10).toArray(),
      suvery: await db.collection("suvery").find().limit(10).toArray(),
      users: await db.collection("users").find().limit(10).toArray()
    };

    fs.writeFileSync('db-dump.json', JSON.stringify(dump, null, 2));
    console.log("Dump complete.");
  } catch (e) {
    fs.writeFileSync('db-dump.json', JSON.stringify({ error: e.message }));
  } finally {
    await client.close();
  }
}
run();
