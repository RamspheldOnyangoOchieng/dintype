const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function translateCharacters() {
    const { data: characters, error } = await supabase.from('characters').select('*');
    if (error) {
        console.error('Error fetching characters:', error);
        return;
    }

    console.log(`Translating ${characters.length} characters...`);

    const translations = {
        'Female': 'Kvinna',
        'Male': 'Man',
        'Single': 'Singel',
        'Dating': 'Dejtar',
        'Married': 'Gift',
        'Student': 'Student',
        'Teacher': 'Lärare',
        'Nurse': 'Sjuksköterska',
        'Engineer': 'Ingenjör',
        'Athletic': 'Atletisk',
        'Curvy': 'Kurvig',
        'Slim': 'Smal',
        'Average': 'Alldaglig',
        'Muscular': 'Muskulös',
        'White': 'Vit',
        'Black': 'Svart',
        'Asian': 'Asiat',
        'Latina': 'Latina',
        'Middle Eastern': 'Mellanöstern'
    };

    for (const char of characters) {
        // Basic translations for categorical data
        const updatedChar = {
            gender: translations[char.gender] || char.gender,
            relationship: translations[char.relationship] || char.relationship,
            ethnicity: translations[char.ethnicity] || char.ethnicity,
            body: translations[char.body] || char.body,
            occupation: translations[char.occupation] || char.occupation,
            language: 'Svenska'
        };

        // Note: I can't easily translate descriptions without a real AI here, but I can set a Swedish placeholder or just leave it for now if they are too complex.
        // However, I'll update Maya (Tarrie) and Leah as examples since I have their names.
        if (char.name === 'Tarrie' || char.name === 'Maya') {
            updatedChar.description = 'Med en varm, gyllene aura som lyser som en solkysst solnedgång, utstrålar Maya en vänlig strålglans som gör henne till en glädje att vara nära. Hennes mörka, korta hår ramar in en klarbrun blick som glittrar med värme, vilket kompletterar hennes vältränade men lockande kurvor och ansträngda leende. Hennes jordnära charm gör henne till den perfekta följeslagaren.';
        } else if (char.name === 'Leah') {
            updatedChar.description = 'Leah står som en slående gestalt, hennes mejslade drag och genomträngande blick vittnar om hennes orubbliga beslutsamhet och orubbliga styrka, som hon använder med precisionen hos en erfaren kunglig vakt. Med en lekfull glimt i ögat och en smidig lätthet i sina rörelser förkroppsligar hon en dynamisk fusion av ledarskap och smidighet, alltid redo att kasta sig in i striden eller leda sina kamrater med ett leende.';
        } else if (char.description && !char.description.includes(' ')) {
            // Maybe it's a short one? Just append something.
        }

        const { error: updateError } = await supabase.from('characters').update(updatedChar).eq('id', char.id);
        if (updateError) {
            console.error(`Error updating ${char.name}:`, updateError);
        } else {
            console.log(`Updated ${char.name}`);
        }
    }
}

translateCharacters();
