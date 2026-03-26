const fs = require('fs');
const { MongoClient } = require('mongodb');

async function listCollections() {
  const envFile = fs.readFileSync('.env', 'utf8');
  const match = envFile.match(/MONGODB_URI=(.*)/);
  if (!match) {
    fs.writeFileSync('collections-log.txt', "MONGODB_URI not found in .env");
    process.exit(1);
  }
  const uri = match[1].trim();
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("ktltc_db");
    const collections = await db.listCollections().toArray();
    fs.writeFileSync('collections-log.txt', collections.map(c => c.name).join(', '));
  } catch (err) {
    fs.writeFileSync('collections-log.txt', "Error: " + err.message);
  } finally {
    await client.close();
  }
}

listCollections();
