function mergeTimeWithDate(originalDateStr, thTimeStr) {
  if (!thTimeStr || !originalDateStr) return null;
  try {
    const d = new Date(originalDateStr);
    const [hours, minutes] = thTimeStr.split(":").map(Number);
    
    // ตั้งเวลาในเขตเวลาไทย (เราหักลบ 7 ชม. เพื่อเป็น UTC)
    const utcDate = new Date(d.getTime());
    utcDate.setUTCHours(hours - 7, minutes, 0, 0);
    return utcDate.toISOString();
  } catch (e) {
    return null;
  }
}

function getTHTime(dateStr) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    // ปรับเป็นเวลาไทย (UTC+7)
    const thTime = new Date(d.getTime() + 7 * 60 * 60 * 1000);
    const hours = String(thTime.getUTCHours()).padStart(2, '0');
    const minutes = String(thTime.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch (e) {
    return "";
  }
}

console.log("--- Time Merge Verification ---");

const originalDate = "2026-03-26T00:00:00.000Z"; 
console.log(`Original Date (UTC): ${originalDate}`);

// Test 08:30 TH -> 01:30 UTC
const thTime1 = "08:30";
const utcTime1 = mergeTimeWithDate(originalDate, thTime1);
console.log(`Test 1: ${thTime1} TH -> ${utcTime1} (Expected ~01:30 UTC)`);

// Test 16:30 TH -> 09:30 UTC
const thTime2 = "16:30";
const utcTime2 = mergeTimeWithDate(originalDate, thTime2);
console.log(`Test 2: ${thTime2} TH -> ${utcTime2} (Expected ~09:30 UTC)`);

// Test Round-trip
const roundTrip = getTHTime(utcTime2);
console.log(`Round-trip Test: ${utcTime2} -> ${roundTrip} TH (Expected 16:30)`);
