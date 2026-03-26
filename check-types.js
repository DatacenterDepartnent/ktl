const { MongoClient } = require('mongodb');
async function run() {
  const uri = "mongodb+srv://ktlltc:1685@cluster0.aekx2.mongodb.net/ktltc_db?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('ktltc_db');
    const sampleAtt = await db.collection("attendances").findOne({});
    console.log("Sample Attendance userId type:", typeof sampleAtt.userId, sampleAtt.userId);
    const sampleUser = await db.collection("users").findOne({});
    console.log("Sample User _id type:", typeof sampleUser._id, sampleUser._id);
  } finally {
    await client.close();
  }
}
run();
