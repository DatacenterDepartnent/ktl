const fs = require('fs');
const { MongoClient } = require('mongodb');

async function checkLogsStructure() {
  const envFile = fs.readFileSync('.env', 'utf8');
  const match = envFile.match(/MONGODB_URI=(.*)/);
  if (!match) {
    fs.writeFileSync('audit-logs.txt', "MONGODB_URI not found in .env");
    process.exit(1);
  }
  const uri = match[1].trim();
  
  const client = new MongoClient(uri);
  let log = "";
  try {
    await client.connect();
    const db = client.db("ktltc_db");
    const logs = await db.collection("logs").find({}).sort({ _id: -1 }).limit(10).toArray();
    log += "Recent Logs Structure Audit:\n";
    logs.forEach((item, index) => {
      log += `Document ${index + 1}:\n`;
      log += `  _id: ${item._id}\n`;
      log += `  action: ${typeof item.action} (${item.action})\n`;
      log += `  timestamp: ${typeof item.timestamp} (${item.timestamp})\n`;
      log += `  full: ${JSON.stringify(item)}\n`;
    });
  } catch (err) {
    log += "Error: " + err.message + "\n";
  } finally {
    await client.close();
    fs.writeFileSync('audit-logs.txt', log);
  }
}

checkLogsStructure();
