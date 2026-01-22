const dns = require('dns');

const host = 'ycauwbjneezdfauvhxjg.supabase.co';

console.log(`🔍 Resolving DNS for ${host}...`);

dns.resolve(host, (err, addresses) => {
    if (err) {
        console.error(`❌ DNS Resolution failed: ${err.message}`);
        console.log("This means the Supabase URL is likely incorrect or there is no internet connection.");
    } else {
        console.log(`✅ Success! Addresses: ${addresses.join(', ')}`);
    }
});
