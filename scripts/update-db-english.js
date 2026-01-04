const { Client } = require('pg');
require('dotenv').config();

const POSTGRES_URL = process.env.POSTGRES_URL;

async function updateDatabaseToEnglish() {
    const client = new Client({
        connectionString: POSTGRES_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to database');

        // 1. Update footer_content
        const footerContent = {
            "legal": [
                { "id": 1, "url": "/terms", "title": "Terms and Conditions" },
                { "id": 2, "url": "/privacy-policy", "title": "Privacy Policy" },
                { "id": 3, "url": "/report", "title": "Report and Complaints" },
                { "id": 4, "url": "/guidelines", "title": "Guidelines" },
                { "id": 5, "url": "/cookies", "title": "Cookies" }
            ],
            "aboutUs": [
                { "id": 1, "url": "/how-it-works", "title": "How it Works" },
                { "id": 2, "url": "/about-us", "title": "About Us" },
                { "id": 3, "url": "/roadmap", "title": "Roadmap" },
                { "id": 4, "url": "/blog", "title": "Blog" },
                { "id": 5, "url": "/guide", "title": "Guide" },
                { "id": 6, "url": "/contact", "title": "Contact Us" },
                { "id": 7, "url": "/faq", "title": "FAQ" }
            ],
            "features": [
                { "id": 1, "url": "/generate", "title": "Create Image" },
                { "id": 2, "url": "/chat", "title": "Chat" },
                { "id": 3, "url": "/create-character", "title": "Create Companion" },
                { "id": 4, "url": "/characters", "title": "Explore" }
            ],
            "companyName": "Pocketlove",
            "companyDescription": "Pocketlove provides immersive experiences with AI companions that feel real, allowing users to create images and chat."
        };

        await client.query('UPDATE footer_content SET content = $1 WHERE id = 1', [JSON.stringify(footerContent)]);
        console.log('✅ Updated footer_content');

        // 2. Update faq_items
        const faqUpdates = [
            {
                id: '73da8526-c6f7-415e-bfd5-fcfc07e70d43',
                question: 'How do tokens work?',
                answer: 'Tokens are used to generate messages (5 tokens), images (5-10 tokens), and create AI characters (2 tokens). You can purchase more tokens in various packages starting from $9.'
            },
            {
                id: '00719e6e-ded3-42a3-b1ba-4b1a6aada03b',
                question: 'Can I create multiple AI companions?',
                answer: 'Free users can have 1 active character. Premium users can have up to 3 active characters simultaneously.'
            }
        ];

        for (const update of faqUpdates) {
            await client.query('UPDATE faq_items SET question = $1, answer = $2 WHERE id = $3', [update.question, update.answer, update.id]);
        }
        console.log('✅ Updated faq_items');

        // 3. Update site_settings
        await client.query("UPDATE site_settings SET value = '\"Pocketlove\"' WHERE key IN ('site_name', 'logo_text')");
        console.log('✅ Updated site_settings');

        // 4. Update faqs (rebranding YourFantasy AI)
        await client.query("UPDATE faqs SET question = REPLACE(question, 'YourFantasy AI', 'Pocketlove'), answer = REPLACE(answer, 'YourFantasy AI', 'Pocketlove')");
        console.log('✅ Updated faqs rebranding');

        // 5. Update characters name if they contain Dintyp or similar (unlikely but good practice)
        // No specific characters identified with Swedish names yet, but let's check if any character descriptions are Swedish.
        // For now, focusing on UI text.

    } catch (err) {
        console.error('Error updating database:', err);
    } finally {
        await client.end();
    }
}

updateDatabaseToEnglish();
