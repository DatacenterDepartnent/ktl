const fs = require('fs');
const { MongoClient } = require('mongodb');

async function checkNavbar() {
  const envFile = fs.readFileSync('.env', 'utf8');
  const match = envFile.match(/MONGODB_URI=(.*)/);
  if (!match) {
    fs.writeFileSync('navbar-log.txt', "MONGODB_URI not found in .env");
    process.exit(1);
  }
  const uri = match[1].trim();
  
  const client = new MongoClient(uri);
  let log = "";
  try {
    await client.connect();
    const db = client.db("ktltc_db");
    const navItems = await db.collection("navbar").find({}).toArray();
    log += "Current Navbar Items:\n";
    navItems.forEach(item => {
      log += `- ${item.label}: ${item.path}\n`;
    });

    const updates = navItems
      .filter(item => item.path && !item.path.startsWith("/") && !item.path.startsWith("http"))
      .map(item => ({
        updateOne: {
          filter: { _id: item._id },
          update: { $set: { path: `/${item.path}` } }
        }
      }));

    if (updates.length > 0) {
      log += `\nFound ${updates.length} relative paths. Fixing...\n`;
      await db.collection("navbar").bulkWrite(updates);
      log += "Success: All paths are now absolute.\n";
    } else {
      log += "\nNo relative paths found.\n";
    }

  } catch (err) {
    log += "Error: " + err.message + "\n";
  } finally {
    await client.close();
    fs.writeFileSync('navbar-log.txt', log);
  }
}

checkNavbar();
