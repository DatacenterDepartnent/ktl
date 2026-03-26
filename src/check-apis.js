async function checkAPIs() {
  const apis = [
    "/api/admin/users",
    "/api/admin/reports/summary",
    "/api/admin/logs"
  ];
  for (const api of apis) {
    try {
      const start = Date.now();
      const res = await fetch(`http://localhost:3000${api}`);
      const duration = Date.now() - start;
      console.log(`API: ${api} | Status: ${res.status} | Duration: ${duration}ms`);
    } catch (err) {
      console.error(`API: ${api} | Error: ${err.message}`);
    }
  }
}

checkAPIs();
