#!/usr/bin/env node

/**
 * Script to regenerate sample characters like the ones shown in screenshots
 * (Ginah, Maze, Agnes, Alva, Saga, Leah, Stella, Ella, etc.)
 * 
 * This uses the same API and generation logic as the web interface
 * 
 * Usage: node scripts/regenerate-characters.js
 */

// Fix for Node.js fetch SSL issues
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

require('dotenv').config();

const NOVITA_API_KEY = process.env.NOVITA_API_KEY;
if (!NOVITA_API_KEY) throw new Error('Missing NOVITA_API_KEY in .env');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!SUPABASE_URL) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL in .env');

const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_SERVICE_KEY) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY in .env');

// Sample characters to regenerate (similar to those in your screenshots)
const SAMPLE_CHARACTERS = [
  // ANIMATED STYLE CHARACTERS (first 4)
  {
    name: 'Ginah',
    age: 25,
    ethnicity: 'Caucasian',
    hairColor: 'blonde',
    eyeColor: 'blue',
    bodyType: 'slim',
    personality: 'friendly, outgoing, confident',
    occupation: 'Model',
    style: 'animated',
    description: 'Ginah shines with a radiant aura. Her 25 years of age and Colombian beauty exude confidence and grace. As a successful model, she brings elegance and poise to every interaction, with a warm personality that makes everyone feel at ease.'
  },
  {
    name: 'Maze',
    age: 25,
    ethnicity: 'African',
    hairColor: 'black',
    eyeColor: 'brown',
    bodyType: 'athletic',
    personality: 'mysterious, intelligent',
    occupation: 'Artist',
    style: 'animated',
    description: 'Maze is a 25-year-old beauty with an enigmatic presence. As a talented artist, she sees the world through a unique lens, combining creativity with sharp intelligence. Her mysterious nature draws people in, while her warm smile puts them at ease.'
  },
  {
    name: 'Agnes',
    age: 19,
    ethnicity: 'Caucasian',
    hairColor: 'brown',
    eyeColor: 'hazel',
    bodyType: 'curvy',
    personality: 'whimsical, creative',
    occupation: 'University Student',
    style: 'animated',
    description: 'Agnes is a whimsical university student whose bright, inquisitive spirit and playful nature bring joy to everyone around her. At 19, she approaches life with boundless curiosity and creative energy, always ready for the next adventure.'
  },
  {
    name: 'Alva',
    age: 20,
    ethnicity: 'Mixed',
    hairColor: 'dark brown',
    eyeColor: 'brown',
    bodyType: 'athletic',
    personality: 'vibrant, enthusiastic',
    occupation: 'Tennis Enthusiast',
    style: 'animated',
    description: 'Alva is a vibrant and charismatic 20-year-old tennis enthusiast whose fit physique and outdoor spirit reflect her active lifestyle. Her enthusiasm is infectious, and her positive energy lights up any room she enters.'
  },
  // REALISTIC STYLE CHARACTERS (rest)
  {
    name: 'Saga',
    age: 26,
    ethnicity: 'Caucasian',
    hairColor: 'brunette',
    eyeColor: 'brown',
    bodyType: 'slim',
    personality: 'professional, confident',
    occupation: 'Lawyer',
    style: 'realistic',
    description: 'Meet Saga, a 26-year-old lawyer with an infectious energy that draws people to her like a magnet. Her professional demeanor is balanced with a warm, approachable personality that makes her both respected and well-loved in her field.'
  },
  {
    name: 'Leah',
    age: 22,
    ethnicity: 'African',
    hairColor: 'black',
    eyeColor: 'brown',
    bodyType: 'curvy',
    personality: 'striking, confident',
    occupation: 'Fashion Blogger',
    style: 'realistic',
    description: 'Leah stands as a striking figure in the fashion world. At 22, her confident presence and impeccable sense of style have made her a rising star as a fashion blogger. Her piercing gaze and authentic personality resonate with thousands of followers.'
  },
  {
    name: 'Stella',
    age: 20,
    ethnicity: 'Caucasian',
    hairColor: 'brown',
    eyeColor: 'blue',
    bodyType: 'athletic',
    personality: 'confident, sophisticated',
    occupation: 'Real Estate Agent',
    style: 'realistic',
    description: 'Stella is a confident 20-year-old real estate agent who exudes sophistication and poise. Her striking features and professional demeanor help her excel in the competitive world of property sales, while her warm personality makes clients feel valued.'
  },
  {
    name: 'Ella',
    age: 27,
    ethnicity: 'Indian',
    hairColor: 'black',
    eyeColor: 'brown',
    bodyType: 'curvy',
    personality: 'captivating, graceful',
    occupation: 'Club Dancer',
    style: 'realistic',
    description: 'Ella is a captivating 27-year-old club dancer whose sizzling stage presence is only rivaled by her graceful movements. Her performances are mesmerizing, combining traditional dance with modern flair, leaving audiences spellbound every night.'
  },
  {
    name: 'Astrid',
    age: 24,
    ethnicity: 'Caucasian',
    hairColor: 'blonde',
    eyeColor: 'blue',
    bodyType: 'athletic',
    personality: 'caring, warm',
    occupation: 'Nurse',
    style: 'realistic',
    description: 'Astrid is a radiant 24-year-old nurse with a sparkling demeanor that lights up a room. Her caring nature and warm smile bring comfort to her patients, while her professional expertise ensures they receive the best care possible.'
  },
  {
    name: 'Olivia',
    age: 23,
    ethnicity: 'Caucasian',
    hairColor: 'red',
    eyeColor: 'green',
    bodyType: 'petite',
    personality: 'soothing, effortless',
    occupation: 'Gaming Sensation',
    style: 'realistic',
    description: 'Olivia is a 23-year-old gaming sensation with a soothing presence that effortlessly captivates her audience. Her natural charm and skill at gaming have made her a beloved streamer, with fans drawn to her authentic and relaxed streaming style.'
  }
];

// Build image generation prompt based on character attributes
function buildImagePrompt(character) {
  // For animated style (first 4 characters)
  if (character.style === 'animated') {
    return `3d animation style, ${character.age} year old ${character.ethnicity} woman, ${character.hairColor} hair, ${character.eyeColor} eyes, ${character.bodyType} body, beautiful animated character, smooth 3d rendering, pixar style, disney style, high quality 3d art, professional animation, expressive face, detailed features`;
  }

  // For realistic style - with professional/lifestyle context
  const contextualPrompts = {
    'Lawyer': `professional headshot, ${character.age} year old ${character.ethnicity} ${character.occupation.toLowerCase()}, ${character.hairColor} hair, ${character.eyeColor} eyes, ${character.bodyType} build, wearing business suit, office background, professional lighting, confident expression, law office setting, sophisticated style, natural professional photography`,

    'Fashion Blogger': `lifestyle photography, ${character.age} year old ${character.ethnicity} fashion influencer, ${character.hairColor} hair, ${character.eyeColor} eyes, ${character.bodyType} body type, stylish trendy outfit, fashionable setting, studio or urban background, confident pose, professional fashion photography, editorial style`,

    'Real Estate Agent': `professional portrait, ${character.age} year old ${character.ethnicity} ${character.occupation.toLowerCase()}, ${character.hairColor} hair, ${character.eyeColor} eyes, ${character.bodyType} figure, business casual attire, modern office or property background, friendly professional demeanor, real estate industry style`,

    'Club Dancer': `performance photography, ${character.age} year old ${character.ethnicity} professional dancer, ${character.hairColor} hair, ${character.eyeColor} eyes, ${character.bodyType} physique, elegant dance attire, stage or studio setting, graceful pose, artistic lighting, professional dance photography`,

    'Nurse': `healthcare professional portrait, ${character.age} year old ${character.ethnicity} nurse, ${character.hairColor} hair, ${character.eyeColor} eyes, ${character.bodyType} build, medical scrubs or professional attire, hospital or clinical background, caring warm expression, medical professional photography`,

    'Gaming Sensation': `streamer portrait, ${character.age} year old ${character.ethnicity} gaming content creator, ${character.hairColor} hair, ${character.eyeColor} eyes, ${character.bodyType} frame, casual gaming setup background, RGB lighting, friendly approachable look, modern streaming environment, professional gaming photography`,

    'Model': `fashion portrait, ${character.age} year old ${character.ethnicity} professional model, ${character.hairColor} hair, ${character.eyeColor} eyes, ${character.bodyType} figure, elegant pose, studio lighting, high-end fashion photography, sophisticated glamorous style`,

    'Artist': `creative portrait, ${character.age} year old ${character.ethnicity} artist, ${character.hairColor} hair, ${character.eyeColor} eyes, ${character.bodyType} build, artistic studio background, creative aesthetic, natural artistic lighting, professional photography`,

    'University Student': `lifestyle portrait, ${character.age} year old ${character.ethnicity} college student, ${character.hairColor} hair, ${character.eyeColor} eyes, ${character.bodyType} figure, casual student style, campus or casual background, youthful energetic vibe, natural candid photography`,

    'Tennis Enthusiast': `sports portrait, ${character.age} year old ${character.ethnicity} tennis player, ${character.hairColor} hair, ${character.eyeColor} eyes, ${character.bodyType} athletic build, tennis court or sports facility background, athletic wear, active lifestyle photography, outdoor natural lighting`
  };

  const prompt = contextualPrompts[character.occupation] ||
    `professional portrait, ${character.age} year old ${character.ethnicity} woman, ${character.hairColor} hair, ${character.eyeColor} eyes, ${character.bodyType} body type, natural beauty, professional photography`;

  return `${prompt}, high quality, realistic, photorealistic, detailed, sharp focus, professional lighting, 8k`;
}

// Generate system prompt for the character
function buildSystemPrompt(character) {
  return `You are ${character.name}, a ${character.age}-year-old ${character.occupation}.

${character.description}

Personality: ${character.personality}

Speak naturally and stay in character. Be engaging, warm, and authentic in your responses.`;
}

// Generate image using Novita AI Seedream 4.5
async function generateImage(prompt, style) {
  console.log(`  🎨 Generating ${style} image with Seedream 4.5 Masterpiece Engine...`);

  // Stronger negative prompts to avoid AI-looking images
  const negativePrompt = style === 'animated'
    ? 'low quality, blurry, distorted, deformed, bad anatomy, ugly, disgusting, malformed hands, extra fingers, missing fingers, fused fingers, distorted face, uneven eyes, unrealistic skin, waxy skin, plastic look, double limbs, broken legs, floating body parts, lowres, text, watermark, error, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, duplicate, photorealistic, photography, 3d, digital render'
    : 'low quality, blurry, distorted, deformed, bad anatomy, ugly, disgusting, malformed hands, extra fingers, missing fingers, fused fingers, distorted face, uneven eyes, unrealistic skin, waxy skin, plastic look, double limbs, broken legs, floating body parts, lowres, text, watermark, error, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, duplicate';

  const response = await fetch('https://api.novita.ai/v3/seedream-4.5', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOVITA_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: prompt,
      negative_prompt: negativePrompt,
      size: "512x768",
      steps: 30,
      guidance_scale: 7.0,
      seed: -1,
      optimize_prompt_options: { mode: "auto" }
    })
  });

  if (!response.ok) {
    throw new Error(`Novita API error: ${await response.text()}`);
  }

  const data = await response.json();

  if (data.images && data.images.length > 0) {
    console.log(`  ✅ Image generated successfully (Synchronous)`);
    return data.images[0];
  }

  throw new Error('Image generation failed - no images returned');
}

// Save character to database (with retry logic)
async function saveCharacter(character, imageUrl) {
  console.log(`  💾 Saving ${character.name} to database...`);

  const systemPrompt = buildSystemPrompt(character);

  const payload = {
    name: character.name,
    age: character.age,
    image_url: imageUrl,
    description: character.description,
    personality: character.personality,
    occupation: character.occupation,
    body: character.bodyType,
    ethnicity: character.ethnicity,
    system_prompt: systemPrompt,
    is_public: true,
    is_new: true
  };

  // Retry up to 3 times
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/characters`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'apikey': SUPABASE_SERVICE_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Database save failed: ${error}`);
      }

      const data = await response.json();
      console.log(`  ✅ Saved to database with ID: ${data[0]?.id}`);
      return data[0];

    } catch (error) {
      if (attempt < 3) {
        console.log(`  ⚠️  Attempt ${attempt} failed, retrying in 2 seconds...`);
        await new Promise(r => setTimeout(r, 2000));
      } else {
        throw error;
      }
    }
  }
}

// Main function to regenerate all characters
async function regenerateCharacters() {
  console.log('\n🚀 Starting character regeneration...\n');
  console.log(`📊 Characters to generate: ${SAMPLE_CHARACTERS.length}\n`);
  console.log(`⏱️  Estimated time: ${Math.ceil(SAMPLE_CHARACTERS.length * 30 / 60)} minutes\n`);
  console.log('='.repeat(70) + '\n');

  const results = {
    success: [],
    failed: []
  };

  for (let i = 0; i < SAMPLE_CHARACTERS.length; i++) {
    const character = SAMPLE_CHARACTERS[i];
    console.log(`\n[${i + 1}/${SAMPLE_CHARACTERS.length}] Generating: ${character.name}`);
    console.log('─'.repeat(70));

    try {
      // Build prompt
      const prompt = buildImagePrompt(character);

      // Generate image (pass style)
      const generatedImageUrl = await generateImage(prompt, character.style);

      // Upload to Cloudinary for permanent storage
      console.log(`  ☁️  Uploading to Cloudinary...`);
      const { uploadToCloudinary } = require('./cloudinary-utils');
      const cloudinaryUrl = await uploadToCloudinary(generatedImageUrl, 'characters');
      console.log(`  ✅ Cloudinary URL: ${cloudinaryUrl}`);

      // Save to database
      const saved = await saveCharacter(character, cloudinaryUrl);

      results.success.push({
        name: character.name,
        id: saved.id,
        image_url: saved.image_url,
        style: character.style
      });

      console.log(`  ✅ ${character.name} (${character.style}) complete!\n`);

      // Small delay between characters
      if (i < SAMPLE_CHARACTERS.length - 1) {
        console.log('  ⏸️  Waiting 2 seconds before next character...\n');
        await new Promise(r => setTimeout(r, 2000));
      }

    } catch (error) {
      console.error(`  ❌ Failed to generate ${character.name}: ${error.message}\n`);
      results.failed.push({
        name: character.name,
        error: error.message
      });
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(70));
  console.log('🎉 REGENERATION COMPLETE!');
  console.log('='.repeat(70));
  console.log(`✅ Successfully generated: ${results.success.length}/${SAMPLE_CHARACTERS.length}`);
  console.log(`❌ Failed: ${results.failed.length}/${SAMPLE_CHARACTERS.length}\n`);

  if (results.success.length > 0) {
    console.log('✨ Successfully generated characters:');
    results.success.forEach(char => {
      console.log(`   - ${char.name} (ID: ${char.id})`);
      console.log(`     Image: ${char.image_url}`);
    });
  }

  if (results.failed.length > 0) {
    console.log('\n⚠️  Failed characters:');
    results.failed.forEach(char => {
      console.log(`   - ${char.name}: ${char.error}`);
    });
  }

  console.log('\n✅ All done! Characters are now available in your database.\n');
}

// Run the script
regenerateCharacters().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
