const { MongoClient } = require('mongodb');
const fs = require('fs');

async function testMongo() {
  const envFile = fs.readFileSync('.env', 'utf8');
  const match = envFile.match(/MONGODB_URI=(.*)/);
  let uri = match[1].trim();
  // Remove DB name from URI
  uri = uri.split('?')[0].replace(/\/ktltc_db$/, '/') + '?' + (uri.split('?')[1] || '');
  
  console.log("Connecting to:", uri.replace(/:([^@]+)@/, ":****@"));
  const client = new MongoClient(uri, {
    connectTimeoutMS: 5000,
  });
  try {
    await client.connect();
    console.log("Connected successfully to server");
  } catch (err) {
    console.error("Connection Error:", err.message);
  } finally {
    await client.close();
  }
}

testMongo();
