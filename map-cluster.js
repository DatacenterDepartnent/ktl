const { MongoClient } = require('mongodb');
const fs = require('fs');
require('dotenv').config();

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    fs.writeFileSync('cluster-map.json', JSON.stringify({ error: "No MONGODB_URI" }));
    return;
  }
  const client = new MongoClient(uri, { connectTimeoutMS: 5000 });
  try {
    await client.connect();
    const admin = client.db().admin();
    const dbs = await admin.listDatabases();
    
    const map = {};
    for (const dbInfo of dbs.databases) {
      const db = client.db(dbInfo.name);
      const cols = await db.listCollections().toArray();
      map[dbInfo.name] = cols.map(c => c.name);
    }

    fs.writeFileSync('cluster-map.json', JSON.stringify({ cluster: uri.split('@')[1], map }, null, 2));
    console.log("Map complete.");
  } catch (e) {
    fs.writeFileSync('cluster-map.json', JSON.stringify({ error: e.message }));
  } finally {
    await client.close();
  }
}
run();
