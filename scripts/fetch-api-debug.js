const fs = require('fs');

async function run() {
  const url = "http://localhost:3000/api/admin/data?type=attendance&debug_secret=ktltc_secret";
  try {
    const res = await fetch(url);
    const json = await res.json();
    fs.writeFileSync('api-debug-dump.json', JSON.stringify(json, null, 2));
    console.log("API Dump complete.");
  } catch (e) {
    fs.writeFileSync('api-debug-dump.json', JSON.stringify({ error: e.message }));
  }
}
run();
