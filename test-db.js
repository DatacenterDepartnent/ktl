const { MongoClient } = require('mongodb');

async function check() {
 const uri = process.env.MONGODB_URI;
 if (!uri) {
   fs.writeFileSync(
     "diagnostic-results.json",
     JSON.stringify({ error: "No MONGODB_URI" }),
   );
   return;
 }  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("ktltc_db");
    console.log("Connected to ktltc_db");
    
    const collections = await db.listCollections().toArray();
    console.log("Collections Found:", collections.map(c => c.name));
    
    const attCount = await db.collection("attendances").countDocuments();
    console.log("Attendances Count:", attCount);
    
    const leaveCount = await db.collection("leave_requests").countDocuments();
    console.log("Leaves Count:", leaveCount);
    
    const suveryCount = await db.collection("suvery").countDocuments();
    console.log("Suverys Count:", suveryCount);
    
    const sampleAtt = await db.collection("attendances").findOne({});
    console.log("Sample Attendance:", JSON.stringify(sampleAtt, null, 2));

  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

check();
