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

async function inspectTable() {
    console.log("🔍 Inspecting 'generated_images' columns...");
    try {
        // Query to get column names in Supabase (Postgres)
        const { data, error } = await supabase.rpc('get_table_columns_info', { t_name: 'generated_images' });

        if (error) {
            console.log("RPC failed (might not exist), trying alternative...");
            // Alternative: select one row and check keys
            const { data: row, error: rError } = await supabase.from('generated_images').select('*').limit(1).maybeSingle();
            if (rError) {
                console.error("❌ Error fetching row:", rError);
            } else if (row) {
                console.log("✅ Columns found from existing row:", Object.keys(row));
            } else {
                console.log("ℹ️ Table is empty. Trying to guess by attempting a broad insert...");
                const { error: iError } = await supabase.from('generated_images').insert({
                    non_existent_column_test: 'test'
                });
                console.log("Insert response (error should list valid columns if it fails with 'column does not exist'):", iError.message);
            }
        } else {
            console.log("✅ Table Columns:", data);
        }
    } catch (err) {
        console.error("❌ Diagnostic Failure:", err);
    }
}

inspectTable();
