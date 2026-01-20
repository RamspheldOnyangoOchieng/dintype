#!/usr/bin/env node

const https = require('https');

require('dotenv').config();

const SUPABASE_HOST = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname : '';
if (!SUPABASE_HOST) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL in .env');

const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_SERVICE_KEY) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY in .env');

const options = {
  hostname: SUPABASE_HOST,
  path: '/rest/v1/characters?limit=1',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    'apikey': SUPABASE_SERVICE_KEY
  }
};

console.log('Testing with native HTTPS module...\n');

const req = https.request(options, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', JSON.stringify(res.headers, null, 2));

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('\n✅ SUCCESS! Response received');
    console.log('Data length:', data.length);
    try {
      const json = JSON.parse(data);
      console.log('Characters found:', json.length);
    } catch (e) {
      console.log('Response preview:', data.substring(0, 200));
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
});

req.end();
