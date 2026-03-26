async function verifyAPI() {
  try {
    const res = await fetch("http://localhost:3000/api/admin/reports/summary");
    const status = res.status;
    const body = await res.text();
    console.log(`API Status: ${status}`);
    console.log(`API Body: ${body}`);
  } catch (err) {
    console.error("Fetch Error:", err.message);
  }
}

verifyAPI();
