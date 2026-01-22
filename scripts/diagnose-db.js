const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

function loadEnv() {
    try {
        const envPath = path.resolve(__dirname, '..', '.env');
        if (fs.existsSync(envPath)) {
            const envConfig = fs.readFileSync(envPath, 'utf8');
            const lines = envConfig.split(/\r?\n/);
            lines.forEach(line => {
                const trimmedLine = line.trim();
                if (!trimmedLine || trimmedLine.startsWith('#')) return;
                const match = trimmedLine.match(/^([^=]+)=(.*)$/);
                if (match) {
                    const key = match[1].trim();
                    const value = match[2].trim().replace(/^["']|["']$/g, '');
                    process.env[key] = value;
                }
            });
        }
    } catch (e) { }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkDb() {
    console.log("🔍 Checking connection to Supabase...");
    try {
        // Try to fetch one row from profiles
        const { data: profile, error: pError } = await supabase.from('profiles').select('id').limit(1);
        if (pError) throw pError;
        console.log("✅ Basic connection successful");

        console.log("🔍 Inspecting 'generated_images' table...");
        const { data: images, error: iError } = await supabase.from('generated_images').select('*').limit(1);
        if (iError) {
            console.error("❌ Error reading 'generated_images':", iError);
        } else {
            console.log("✅ Successfully read from 'generated_images'");
            if (images.length > 0) {
                console.log("Columns found:", Object.keys(images[0]));
            } else {
                console.log("Table is empty, trying to find column names via rpc or just trying an insert...");
            }
        }

        // Try a test insert with minimal fields
        console.log("🔍 Attempting test insert into 'generated_images'...");
        const testId = 'test_' + Date.now();
        const { error: insError } = await supabase.from('generated_images').insert({
            user_id: profile[0].id,
            prompt: 'test prompt',
            image_url: 'https://example.com/test.jpg',
            status: 'completed',
            task_id: testId,
            model: 'test-model'
        });

        if (insError) {
            console.error("❌ Test insert failed:", insError);
        } else {
            console.log("✅ Test insert successful!");
            // Cleanup
            await supabase.from('generated_images').delete().eq('task_id', testId);
        }

    } catch (err) {
        console.error("❌ Full Diagnostic Failure:", err);
    }
}

checkDb();
