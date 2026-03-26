const dns = require('dns');

async function testDNS() {
  console.log("--- DNS START ---");
  try {
    const host = "google.com";
    const addresses = await dns.promises.resolve(host);
    console.log("DNS for google.com:", addresses);
    
    const atlasHost = "ktltc.igrso.mongodb.net";
    const atlasAddresses = await dns.promises.resolve(atlasHost, 'TXT');
    console.log("DNS TXT for Atlas:", atlasAddresses);
  } catch (err) {
    console.error("DNS ERROR:", err.message);
  }
  console.log("--- DNS END ---");
}

testDNS();
