const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });
const fs = require('fs');

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected");
    
    // access raw collections to avoid Schema casting
    const db = mongoose.connection.db;
    const atts = await db.collection('attendances').find().limit(5).toArray();
    const leaves = await db.collection('leave_requests').find().limit(5).toArray();
    
    const output = {
      attendances: atts.map(a => ({ id: a._id.toString(), userId: a.userId, isObjectId: a.userId instanceof mongoose.Types.ObjectId })),
      leaves: leaves.map(l => ({ id: l._id.toString(), userId: l.userId, isObjectId: l.userId instanceof mongoose.Types.ObjectId }))
    };
    
    fs.writeFileSync('db-inspect.json', JSON.stringify(output, null, 2));
    console.log("Wrote to db-inspect.json");
  } catch (err) {
    fs.writeFileSync('db-inspect.json', "Error: " + err.message);
  } finally {
    await mongoose.disconnect();
  }
}
run();
