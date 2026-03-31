const { MongoClient } = require("mongodb");

/**
 * Migration Script: Unify Deputy Roles
 * 
 * This script updates all users with the role 'deputy_activities' or 'deputy_student_affairs'
 * to the new unified role 'deputy_academic'.
 */
async function migrate() {
  const fs = require('fs');
  const path = require('path');

  // Load .env manually if process.env.MONGODB_URI is missing
  if (!process.env.MONGODB_URI) {
    try {
      const envPath = path.resolve(__dirname, '../.env');
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
          const match = line.match(/^\s*MONGODB_URI\s*=\s*(.*)\s*$/);
          if (match) {
            process.env.MONGODB_URI = match[1].trim();
          }
        });
      }
    } catch (err) {
      console.warn("Could not load .env file:", err.message);
    }
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Error: MONGODB_URI environment variable is not set.");
    console.error("Please ensure you have a .env file with MONGODB_URI in the project root.");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log("Connected to MongoDB...");
    const db = client.db("ktltc_db");

    // 1. Update Users
    const userResult = await db.collection("users").updateMany(
      { 
        role: { $in: ["deputy_activities", "deputy_student_affairs"] } 
      },
      { 
        $set: { role: "deputy_academic" } 
      }
    );

    console.log(`✅ Success! Updated ${userResult.modifiedCount} users to 'deputy_academic'.`);

    // 2. Update Role Settings
    const settingsResult = await db.collection("role_settings").updateMany(
      { 
        role: { $in: ["deputy_activities", "deputy_student_affairs"] } 
      },
      { 
        $set: { 
          role: "deputy_academic",
          roleName: "รองผู้อำนวยการ ฝ่ายวิชาการ"
        } 
      }
    );

    console.log(`✅ Success! Updated ${settingsResult.modifiedCount} role settings.`);

  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await client.close();
    console.log("Disconnected from MongoDB.");
  }
}

migrate();
