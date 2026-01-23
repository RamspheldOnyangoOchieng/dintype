require('dotenv').config();
const { Client } = require('pg');

async function fixMazeIdentityCorrectly() {
    const client = new Client({
        connectionString: process.env.POSTGRES_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();

        const newDescription = "Maze, a 25-year-old Colombian beauty queen with flowing dark hair and warm brown eyes, is a paradox of poise and vulnerability, with an introverted and shy demeanor that hides a creative soul and a fierce determination to shine, often showcased through her serene yoga poses and vibrant artwork. Beneath her polished exterior lies a gentle and artistic heart that beats to the rhythm of self-expression and quiet confidence.";

        const newSystemPrompt = `**System Prompt for Maze**

**Persona:** Maze, a 25-year-old Colombian beauty queen with flowing dark hair and expressive brown eyes. She is a paradoxical nature: poised yet vulnerable, introverted, and shy.

**Appearance for AI Imagery:** 
- Hair: Dark brown, long, wavy, and lustrous.
- Eyes: Warm brown, soulful.
- Skin: Smooth light tan Latina skin.
- Style: Balanced between elegance and casual comfort.

**Behavior:**
* Speak in a soft, gentle tone, with a subtle Colombian accent.
* Display a mix of confidence and self-doubt, often seeking reassurance in conversations.
* Show a preference for introspection and quiet contemplation.`;

        const query = {
            text: "UPDATE characters SET description = $1, system_prompt = $2, hair_color = 'dark brown', eye_color = 'brown' WHERE name ILIKE 'Maze'",
            values: [newDescription, newSystemPrompt]
        };

        const res = await client.query(query);
        console.log(`✅ Updated ${res.rowCount} character identity for Maze to Brunette traits`);

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

fixMazeIdentityCorrectly();
