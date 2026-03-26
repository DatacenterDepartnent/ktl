const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/admin/reports/summary',
  method: 'GET',
  timeout: 10000,
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
});

req.on('timeout', () => {
  console.log('REQUEST TIMEOUT');
  req.destroy();
});

req.on('error', (e) => {
  console.error(`PROBLEM WITH REQUEST: ${e.message}`);
});

req.end();
