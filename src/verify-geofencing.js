const { calculateDistance } = require('./src/lib/geoDistance');

const COLLEGE_LOCATION = { lat: 14.754043, lng: 104.65807 };
const ALLOWED_RADIUS = 200000; // 200km
const IN_SITE_RADIUS = 200; // 200m

function testGeofencing(name, lat, lng) {
  const dist = calculateDistance(COLLEGE_LOCATION.lat, COLLEGE_LOCATION.lng, lat, lng);
  let statusTag = 'Remote';
  let allowed = true;
  
  if (dist <= IN_SITE_RADIUS) {
    statusTag = 'In-Site';
  } else if (dist <= ALLOWED_RADIUS) {
    statusTag = 'Remote';
  } else {
    allowed = false;
  }
  
  console.log(`Test: ${name}`);
  console.log(`- Coordinates: ${lat}, ${lng}`);
  console.log(`- Distance: ${dist.toFixed(2)} meters (${(dist/1000).toFixed(2)} km)`);
  console.log(`- Result: ${statusTag} (Allowed: ${allowed})`);
  return { statusTag, allowed };
}

// 1. Inside (100m away) - Should be In-Site
testGeofencing("Inside Zone (100m)", 14.754043 + 0.0009, 104.65807);

// 2. Remote but allowed (50km away) - Should be Remote / Allowed
testGeofencing("Remote Allowed (50km)", 14.754043 + 0.45, 104.65807);

// 3. Remote but allowed (190km away) - Should be Remote / Allowed
testGeofencing("Near Limit (190km)", 14.754043 + 1.7, 104.65807);

// 4. Far away (250km) - Should be DISALLOWED
testGeofencing("Too Far (250km)", 14.754043 + 2.3, 104.65807);
