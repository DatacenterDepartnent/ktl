const { MongoClient, ObjectId } = require('mongodb');

async function run() {
  const uri = process.env.MONGODB_URI || "mongodb+srv://ktlltc:1685@cluster0.aekx2.mongodb.net/ktltc_db?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('ktltc_db');
    
    const adminUser = await db.collection("users").findOne({ $or: [{ role: "super_admin" }, { role: "admin" }] });
    if (!adminUser) {
        console.log("No admin found");
        return;
    }

    const oId = new ObjectId("60d0fe4f5311236168a109ca");
    
    const result = await db.collection("attendances").updateMany(
      { userId: oId },
      { $set: { userId: adminUser._id } }
    );
    
    const result2 = await db.collection("attendances").updateMany(
      { userId: "60d0fe4f5311236168a109ca" },
      { $set: { userId: adminUser._id } }
    );
    
    console.log(`Success! Fixed ObjectIds: ${result.modifiedCount}, Fixed Strings: ${result2.modifiedCount}. Assigned to admin: ${adminUser.username || adminUser.name} (${adminUser._id})`);
  } catch(e) {
    console.error(e);
  } finally {
    await client.close();
  }
}
run();
