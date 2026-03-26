const { MongoClient, ObjectId } = require("mongodb");
const fs = require("fs");

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not defined in .env file");
    return;
  }
  if (!uri) {
    console.error("MONGODB_URI not found");
    return;
  }
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("ktltc_db");

    let output = "";
    output += "--- Attendances Sample ---\n";
    const attSample = await db
      .collection("attendances")
      .find()
      .limit(5)
      .toArray();
    attSample.forEach((doc) => {
      output += `ID: ${doc._id} (${typeof doc._id}), userId: ${doc.userId} (${typeof doc.userId})\n`;
    });

    output += "\n--- Leave Requests Sample ---\n";
    const leaveSample = await db
      .collection("leave_requests")
      .find()
      .limit(5)
      .toArray();
    leaveSample.forEach((doc) => {
      output += `ID: ${doc._id} (${typeof doc._id}), userId: ${doc.userId} (${typeof doc.userId})\n`;
    });

    output += "\n--- Users Sample ---\n";
    const userSample = await db.collection("users").find().limit(5).toArray();
    userSample.forEach((doc) => {
      output += `ID: ${doc._id} (${typeof doc._id}), username: ${doc.username}\n`;
    });

    fs.writeFileSync("db-inspection-results.txt", output);
    console.log("Results written to db-inspection-results.txt");
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}
run();
