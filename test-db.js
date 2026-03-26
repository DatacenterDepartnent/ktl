const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env' });

async function checkData() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log("No MONGODB_URI found");
    return;
  }
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("ktltc_db");
    
    const attendances = await db.collection("attendances").find().limit(5).toArray();
    console.log("Attendances:", JSON.stringify(attendances, null, 2));

    const leaveRequests = await db.collection("leave_requests").find().limit(5).toArray();
    console.log("Leave Requests:", JSON.stringify(leaveRequests, null, 2));

  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

checkData();
