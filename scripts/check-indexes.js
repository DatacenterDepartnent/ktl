const { MongoClient } = require('mongodb');

async function checkIndexes() {
  const uri = "mongodb+srv://allm:admin@ktltc.igrso.mongodb.net/ktltc_db?retryWrites=true&w=majority&appName=ktltc";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("ktltc_db");
    
    console.log("Checking indexes for 'attendances'...");
    const attIndexes = await db.collection("attendances").indexes();
    console.log(JSON.stringify(attIndexes, null, 2));

    console.log("\nChecking indexes for 'leave_requests'...");
    const leaveIndexes = await db.collection("leave_requests").indexes();
    console.log(JSON.stringify(leaveIndexes, null, 2));

    console.log("\nChecking indexes for 'users'...");
    const userIndexes = await db.collection("users").indexes();
    console.log(JSON.stringify(userIndexes, null, 2));

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

checkIndexes();
