const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables manually
function loadEnv() {
    try {
        const envPath = path.resolve(__dirname, '..', '.env');
        console.log("Loading .env from:", envPath);
        if (fs.existsSync(envPath)) {
            const envConfig = fs.readFileSync(envPath, 'utf8');
            const lines = envConfig.split(/\r?\n/);
            console.log(`Read ${lines.length} lines from .env`);

            let loadedCount = 0;
            lines.forEach(line => {
                const trimmedLine = line.trim();
                // Skip comments and empty lines
                if (!trimmedLine || trimmedLine.startsWith('#')) return;

                const match = trimmedLine.match(/^([^=]+)=(.*)$/);
                if (match) {
                    const key = match[1].trim();
                    const value = match[2].trim().replace(/^["']|["']$/g, ''); // Remove quotes
                    process.env[key] = value;
                    loadedCount++;
                }
            });
            console.log(`✅ .env file loaded (${loadedCount} variables)`);

            // Debug specific keys
            console.log("GROQ_API_KEY check:", process.env.GROQ_API_KEY ? "Found" : "Missing");
            console.log("NOVITA_API_KEY check:", process.env.NOVITA_API_KEY ? "Found" : "Missing");

        } else {
            console.warn("⚠️ .env file not found at " + envPath);
        }
    } catch (e) {
        console.error("Error loading .env:", e);
    }
}

loadEnv();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const NOVITA_API_KEY = process.env.NOVITA_API_KEY;

function makeRequest(options, body) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        resolve(data);
                    }
                } else {
                    reject({ statusCode: res.statusCode, body: data });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function testGroq() {
    console.log("\n🧪 Testing Groq API...");
    if (!GROQ_API_KEY) {
        console.error("❌ GROQ_API_KEY not found in environment variables");
        return;
    }

    const options = {
        hostname: 'api.groq.com',
        path: '/openai/v1/chat/completions',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
        }
    };

    const body = {
        model: "llama-3.3-70b-versatile", // Using a common model
        messages: [{ role: "user", content: "Hello, confirm you are working with a 1 word response." }],
        max_tokens: 10
    };

    try {
        const response = await makeRequest(options, body);
        if (response.choices && response.choices.length > 0) {
            console.log("✅ Groq Test Passed!");
            console.log("Response:", response.choices[0].message.content);
        } else {
            console.log("⚠️ Groq response format unexpected:", JSON.stringify(response));
        }
    } catch (error) {
        console.error("❌ Groq Test Failed:", error);
    }
}

async function testNovitaSeedream() {
    console.log("\n🧪 Testing Novita Seedream 4.5 API...");
    if (!NOVITA_API_KEY) {
        console.error("❌ NOVITA_API_KEY not found in environment variables");
        return;
    }

    const options = {
        hostname: 'api.novita.ai',
        path: '/v3/seedream-4.5',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${NOVITA_API_KEY}`,
            'Content-Type': 'application/json'
        }
    };

    const body = {
        prompt: "A cute robot waving hello, cyberpunk style, high quality",
        negative_prompt: "low quality, bad anatomy",
        size: "2048x2048", // Compliant resolution (approx 4.1MP > 3.6MP)
        steps: 20,
        guidance_scale: 7,
        optimize_prompt_options: {
            mode: 'standard'
        }
    };

    try {
        const response = await makeRequest(options, body);
        if (response.images && response.images.length > 0) {
            console.log("✅ Novita Seedream Test Passed!");
            console.log("Image encoded length:", response.images[0].length);
            console.log("Image start:", response.images[0].substring(0, 100));
        } else {
            console.log("⚠️ Novita response format unexpected:", JSON.stringify(response));
        }
    } catch (error) {
        console.error("❌ Novita Seedream Test Failed:", error);
        if (error.body) {
            console.error("Error Body:", error.body);
        }
    }
}

async function runTests() {
    await testGroq();
    await testNovitaSeedream();
}

runTests();
