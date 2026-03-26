
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dmez2x7ez',
  api_key: '238175287533225',
  api_secret: 'shzOF6QSd2y5xFxKMOwSEhRd73c',
});

async function checkUsage() {
  try {
    const result = await cloudinary.api.usage();
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error);
  }
}

checkUsage();
