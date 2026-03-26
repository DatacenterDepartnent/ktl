const fs = require('fs');
const path = require('path');
const https = require('https');

const BASE_URL = 'https://raw.githubusercontent.com/vladmandic/face-api/master/model/';
const OUT_DIR = path.join(__dirname, 'public', 'models');

const FILES = [
  'ssd_mobilenetv1_model-weights_manifest.json',
  'ssd_mobilenetv1_model-shard1',
  'face_landmark_68_model-weights_manifest.json',
  'face_landmark_68_model-shard1',
  'face_recognition_model-weights_manifest.json',
  'face_recognition_model-shard1',
  'face_recognition_model-shard2',
];

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function download(filename) {
  return new Promise((resolve, reject) => {
    const url = BASE_URL + filename;
    const dest = path.join(OUT_DIR, filename);
    const file = fs.createWriteStream(dest);
    console.log(`Downloading: ${filename}`);
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        https.get(res.headers.location, (res2) => {
          res2.pipe(file);
          file.on('finish', () => { file.close(); console.log(`  ✅ Done: ${filename}`); resolve(); });
        }).on('error', reject);
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); console.log(`  ✅ Done: ${filename}`); resolve(); });
    }).on('error', (err) => { fs.unlink(dest, () => {}); reject(err); });
  });
}

(async () => {
  console.log('=== Downloading face-api.js models ===');
  for (const f of FILES) {
    await download(f);
  }
  console.log('\n✅ All models downloaded to public/models/');
})();
