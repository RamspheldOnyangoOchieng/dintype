const { Client } = require('pg');
const https = require('https');
require('dotenv').config();

const POSTGRES_URL = process.env.POSTGRES_URL;
const GOOGLE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;

// Translation logic for structured fields
function translateValue(value) {
    if (!value) return value;
    
    const map = {
        // Relationships
        "Singel": "Single",
        "Gift": "Married",
        "Dejtar": "Dating",
        "Komplicerat": "Complicated",
        
        // Body
        "Atletisk": "Athletic",
        "Kurvig": "Curvy",
        "Smal": "Slim",
        "Alldaglig": "Average",
        "Muskulös": "Muscular",
        "Kropp": "Body", // fallback if header ends up in value
        
        // Personality
        "Sportig": "Athletic",
        "Lekfull": "Playful",
        "Nyfiken": "Curious",
        "Busig": "Mischievous",
        "Snäll": "Kind",
        "Intelligent": "Intelligent",
        "Rolig": "Funny",
        "Seriös": "Serious",
        "Driven": "Driven",
        
        // Occupations
        "Universitetsstudent": "University Student",
        "Student": "Student",
        "Lärare": "Teacher",
        "Sjuksköterska": "Nurse",
        "Ingenjör": "Engineer",
        
        // Ethnicity
        "Vit": "White",
        "Svart": "Black",
        "Asiat": "Asian",
        "Latina": "Latina",
        "Mellanöstern": "Middle Eastern",
        
        // Languages
        "Svenska": "Swedish",
        "Engelska": "English"
    };

    // Strict match
    if (map[value]) return map[value];
    
    // Case insensitive match
    const lowerValue = value.toLowerCase();
    for (const [k, v] of Object.entries(map)) {
        if (k.toLowerCase() === lowerValue) return v;
    }

    return value; // Return original if no match
}

// Google Translate helper
function translateText(text) {
    return new Promise((resolve, reject) => {
        if (!text || !GOOGLE_API_KEY) {
            resolve(text);
            return;
        }

        const data = JSON.stringify({
            q: text,
            target: 'en',
            format: 'text'
        });

        const options = {
            hostname: 'translation.googleapis.com',
            path: `/language/translate/v2?key=${GOOGLE_API_KEY}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const parsed = JSON.parse(body);
                        if (parsed.data && parsed.data.translations && parsed.data.translations.length > 0) {
                            resolve(parsed.data.translations[0].translatedText);
                        } else {
                            resolve(text);
                        }
                    } catch (e) {
                        console.error('Failed to parse translate response', e);
                        resolve(text);
                    }
                } else {
                    console.error('Translate API Error:', res.statusCode, body);
                    resolve(text); // Fallback to original
                }
            });
        });

        req.on('error', (e) => {
            console.error('Translate Request Error:', e);
            resolve(text);
        });

        req.write(data);
        req.end();
    });
}

async function translateCharacters() {
    const client = new Client({
        connectionString: POSTGRES_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to database to translate characters...');

        const res = await client.query('SELECT id, name, description, personality, hobbies, occupation, body, ethnicity, relationship, language FROM characters');
        const characters = res.rows;
        
        console.log(`Found ${characters.length} characters to process.`);

        for (const char of characters) {
            console.log(`Processing ${char.name} (${char.id})...`);
            
            let updates = {};
            let hasChanges = false;

            // Translate structured fields
            const fields = ['personality', 'hobbies', 'occupation', 'body', 'ethnicity', 'relationship', 'language'];
            
            for (const field of fields) {
                if (char[field]) {
                    const translated = translateValue(char[field]);
                    if (translated !== char[field]) {
                        updates[field] = translated;
                        hasChanges = true;
                    }
                }
            }

            // Translate Description separately (async, expensive)
            const currentDesc = char.description;
            if (currentDesc) {
                // Heuristic: check if it looks non-english (e.g. contains common Swedish words)
                // or just try to translate everything that isn't clearly english.
                // For safety, we'll try to translate all descriptions if we have a key.
                const translatedDesc = await translateText(currentDesc);
                if (translatedDesc && translatedDesc !== currentDesc) {
                    updates['description'] = translatedDesc;
                    hasChanges = true;
                    console.log(`  Translated description: "${currentDesc.substring(0, 20)}..." -> "${translatedDesc.substring(0, 20)}..."`);
                }
            }

            if (hasChanges) {
                const setClause = Object.keys(updates).map((key, i) => `${key} = $${i + 1}`).join(', ');
                const values = Object.values(updates);
                
                await client.query(`UPDATE characters SET ${setClause} WHERE id = $${values.length + 1}`, [...values, char.id]);
                console.log(`  ✅ Updated ${Object.keys(updates).join(', ')}`);
            } else {
                console.log(`  No changes needed.`);
            }
        }

        console.log('Translation complete!');

    } catch (err) {
        console.error('Error translating database:', err);
    } finally {
        await client.end();
    }
}

translateCharacters();
