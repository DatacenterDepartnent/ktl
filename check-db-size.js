const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

async function check() {
  console.log("--- DEBUG START ---");
  
  let uri = "";
  try {
    const envPath = path.join(process.cwd(), ".env");
    console.log("Checking .env at:", envPath);
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, "utf8");
        const lines = envContent.split("\n");
        for (const line of lines) {
            if (line.startsWith("MONGODB_URI=")) {
                uri = line.split("=")[1].trim();
                break;
            }
        }
    }
  } catch (e) {
    console.error("Error reading .env:", e);
  }

  if (!uri) {
    console.error("MONGODB_URI not found in .env manually");
    return;
  }

  console.log("Connecting to:", uri.substring(0, 20) + "...");
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected successfully");
    const db = client.db("ktltc_db");
    const collections = ["users", "attendances", "leave_requests", "logs"];
    
    console.log("--- Collection Stats ---");
    for (const coll of collections) {
      const count = await db.collection(coll).countDocuments();
      console.log(`${coll}: ${count} documents`);
    }
  } catch (e) {
    console.error("DB Error:", e);
  } finally {
    await client.close();
    console.log("--- DEBUG END ---");
  }
}

check();
