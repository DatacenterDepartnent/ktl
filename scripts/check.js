const { MongoClient } = require('mongodb');
const fs = require('fs');

async function run() {
  const envText = fs.readFileSync('.env', 'utf-8');
  let uri = '';
  envText.split('\n').forEach(line => {
    if (line.startsWith('MONGODB_URI=')) {
      uri = line.split('=')[1].trim();
    }
  });

  if (!uri) {
    fs.writeFileSync('output.json', 'No URI');
    return;
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('ktltc_db');
    const cols = await db.listCollections().toArray();
    let res = { cols: cols.map(c => c.name) };
    if (res.cols.includes('attendances')) res.attCount = await db.collection('attendances').countDocuments();
    if (res.cols.includes('attendance')) res.attendanceCount = await db.collection('attendance').countDocuments();
    fs.writeFileSync('output.json', JSON.stringify(res, null, 2));
  } catch(e) {
    fs.writeFileSync('output.json', e.message);
  } finally {
    await client.close();
  }
}
run();
