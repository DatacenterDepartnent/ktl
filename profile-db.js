const { MongoClient } = require('mongodb');

async function profileDb() {
  const uri = "mongodb+srv://allm:admin@ktltc.igrso.mongodb.net/ktltc_db?retryWrites=true&w=majority&appName=ktltc";
  console.log("Starting DB Profile...");
  const start = Date.now();
  const client = new MongoClient(uri, {
    connectTimeoutMS: 5000,
    serverSelectionTimeoutMS: 5000
  });

  try {
    console.log("Connecting to MongoDB Atlas...");
    const connStart = Date.now();
    await client.connect();
    const connEnd = Date.now();
    console.log(`✅ Connected in ${connEnd - connStart}ms`);

    const db = client.db("ktltc_db");
    
    console.log("Querying 'attendances' count...");
    const qStart = Date.now();
    const count = await db.collection("attendances").countDocuments();
    const qEnd = Date.now();
    console.log(`✅ Count: ${count} documents, Query took ${qEnd - qStart}ms`);

    console.log("Querying first 20 records (Sorted by date)...");
    const aStart = Date.now();
    const records = await db.collection("attendances")
      .find({})
      .sort({ date: -1 })
      .limit(20)
      .toArray();
    const aEnd = Date.now();
    console.log(`✅ Fetch took ${aEnd - aStart}ms`);

  } catch (err) {
    console.error("❌ DB Profile Failed:", err.message);
  } finally {
    await client.close();
    console.log(`Total operation took ${Date.now() - start}ms`);
  }
}

profileDb();
