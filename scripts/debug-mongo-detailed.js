const { MongoClient } = require('mongodb');
const fs = require('fs');
const dns = require('dns');

async function debugMongo() {
  const envFile = fs.readFileSync('.env', 'utf8');
  const match = envFile.match(/MONGODB_URI=(.*)/);
  const uri = match[1].trim();
  
  console.log("--- DNS CHECK ---");
  try {
    const host = "ktltc.igrso.mongodb.net";
    const addresses = await dns.promises.resolve(host, 'TXT');
    console.log("DNS TXT Records for host:", addresses);
  } catch (err) {
    console.error("DNS Error:", err.message);
  }

  console.log("--- CONNECTION CHECK ---");
  const client = new MongoClient(uri, {
    connectTimeoutMS: 5000,
    serverSelectionTimeoutMS: 5000,
  });
  
  try {
    console.log("Attempting connect...");
    await client.connect();
    console.log("CONNECTED!");
  } catch (err) {
    console.error("Connection Error:", err.message);
  } finally {
    await client.close();
  }
}

debugMongo();
