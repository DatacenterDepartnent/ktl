const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://allmaster:allmaster@panyatouch.9qicf.mongodb.net/?retryWrites=true&w=majority&appName=panyatouch';

async function check() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('ktltc_db');
    const user = await db.collection('users').findOne({ role: /super_admin/i });
    console.log('USER_DATA:', JSON.stringify(user));
  } catch (err) {
    console.error('DB_ERROR:', err);
  } finally {
    await client.close();
  }
}

check();
