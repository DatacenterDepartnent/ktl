const { MongoClient } = require('mongodb');
const fs = require('fs');
require('dotenv').config();

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    fs.writeFileSync('db-list.json', JSON.stringify({ error: "No MONGODB_URI" }));
    return;
  }
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const admin = client.db().admin();
    const dbs = await admin.listDatabases();
    
    const results = {
      uri: uri.split('@')[1],
      databases: dbs.databases.map(d => d.name)
    };

    fs.writeFileSync('db-list.json', JSON.stringify(results, null, 2));
    console.log("DB list complete. Results in db-list.json");
  } catch (e) {
    fs.writeFileSync('db-list.json', JSON.stringify({ error: e.message }));
  } finally {
    await client.close();
  }
}
run();
