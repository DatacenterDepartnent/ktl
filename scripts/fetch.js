const fs = require('fs');
fetch('http://localhost:3000/api/debug')
  .then(res => res.text())
  .then(text => fs.writeFileSync('debug.json', text))
  .catch(err => fs.writeFileSync('debug.json', 'ERR: ' + err.message));
