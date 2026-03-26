async function testNetwork() {
  try {
    const res = await fetch("https://api.github.com", {
      headers: { "User-Agent": "Node.js" }
    });
    console.log(`GitHub API Status: ${res.status}`);
  } catch (err) {
    console.error(`Network Error: ${err.message}`);
  }
}

testNetwork();
