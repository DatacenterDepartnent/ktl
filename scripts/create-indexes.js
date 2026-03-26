const { MongoClient } = require('mongodb');

async function run() {
  const uri = "mongodb+srv://ktlltc:1685@cluster0.aekx2.mongodb.net/ktltc_db?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('ktltc_db');
    
    console.log("Creating indices...");
    
    // Attendances
    await db.collection("attendances").createIndex({ date: -1 });
    await db.collection("attendances").createIndex({ userId: 1 });
    
    // Leave Requests
    await db.collection("leave_requests").createIndex({ createdAt: -1 });
    await db.collection("leave_requests").createIndex({ userId: 1 });

    // Users
    await db.collection("users").createIndex({ role: 1 });

    console.log("Indices created successfully!");
  } catch(e) {
    console.error(e);
  } finally {
    await client.close();
  }
}
run();
