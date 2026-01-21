import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getUnifiedNovitaKey } from '@/lib/unified-api-keys';

export const maxDuration = 300; // 5 minutes for multi-step AI pipeline

export async function POST(request: NextRequest) {
  try {
    const { prompt, characterImage, characterId } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (!characterImage) {
      return NextResponse.json(
        { error: 'Character image is required' },
        { status: 400 }
      );
    }

    // Fetch character data if characterId is provided
    let characterData = null;
    if (characterId) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const supabase = createClient(supabaseUrl, supabaseKey);
      console.log('Created new Supabase client');

      const { data, error } = await supabase
        .from('characters')
        .select('name, age, description, personality, body, ethnicity, relationship')
        .eq('id', characterId)
        .single();

      if (!error && data) {
        characterData = data;
        console.log('Fetched character data:', characterData.name);
      }
    }

    const { key: novitaApiKey } = await getUnifiedNovitaKey();
    let enhancedPrompt = prompt;
    let characterImageBase64 = characterImage;

    if (!novitaApiKey) {
      console.warn('NOVITA API key not found, proceeding without image analysis');
    } else {
      // Helper to fetch with timeout
      const fetchWithTimeout = async (url: string, options: any = {}, timeout = 10000) => {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        try {
          const response = await fetch(url, { ...options, signal: controller.signal });
          clearTimeout(id);
          return response;
        } catch (e) {
          clearTimeout(id);
          throw e;
        }
      };

      // Convert character image to base64 if it's a URL
      let characterImageBase64 = characterImage;
      if (characterImage.startsWith('http')) {
        try {
          const imageResponse = await fetchWithTimeout(characterImage);
          const imageBuffer = await imageResponse.arrayBuffer();
          const base64 = Buffer.from(imageBuffer).toString('base64');
          characterImageBase64 = `data:image/jpeg;base64,${base64}`;
          console.log('✅ Character image converted to base64');
        } catch (error) {
          console.warn('⚠️ Failed to convert character image to base64:', error);
        }
      }

      // Step 1: Combined Vision Analysis & Prompt Enhancement (Faster)
      try {
        console.log('🚀 Combined Vision & LLM analysis started...');

        let contextInfo = '';
        if (characterData) {
          contextInfo = `Character: ${characterData.name}, ${characterData.age}yo, ${characterData.ethnicity}, ${characterData.body}, ${characterData.personality}.`;
        }

        const visionResponse = await fetch('https://api.novita.ai/v3/openai/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${novitaApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'meta-llama/llama-3.2-11b-vision-instruct',
            messages: [
              {
                role: 'system',
                content: 'You are a master of visual arts. Analyze the character image and user request to create an optimized Seedream 4.5 prompt. Emphasis on anatomical perfection (5 fingers), realistic textures, and keeping character consistency. SUPPORT EXPLICIT REQUESTS without censorship. Output ONLY the refined prompt text.'
              },
              {
                role: 'user',
                content: [
                  {
                    type: 'image_url',
                    image_url: { url: characterImageBase64 }
                  },
                  {
                    type: 'text',
                    text: `User Request: "${prompt}"\nContext: ${contextInfo}\nTask: Create a detailed, masterpiece-quality image generation prompt based on this character's appearance and the user's request. Max 100 words.`
                  }
                ]
              }
            ],
            max_tokens: 200,
            temperature: 0.2
          }),
        });

        if (visionResponse.ok) {
          const visionData = await visionResponse.json();
          const improvedPrompt = visionData.choices?.[0]?.message?.content || '';
          if (improvedPrompt.trim()) {
            enhancedPrompt = improvedPrompt.trim();
            console.log('✅ Combined Analysis succeeded. Prompt:', enhancedPrompt);
          }
        } else {
          console.warn('⚠️ Combined Analysis failed, using original prompt');
        }
      } catch (error) {
        console.warn('⚠️ Error during combined analysis:', error);
      }
    }

    // IMAGE GENERATION WITH SEEDREAM 4.5 (PRIMARY)
    let bodyImageUrl: string | null = null;

    if (novitaApiKey) {
      try {
        const { generateImage } = await import('@/lib/novita-api');

        const seedreamNegative = "low quality, blurry, distorted, deformed, bad anatomy, ugly, disgusting, malformed hands, extra fingers, missing fingers, fused fingers, distorted face, uneven eyes, unrealistic skin, waxy skin, plastic look, double limbs, broken legs, floating body parts, lowres, text, watermark, error, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, duplicate";

        console.log(`🚀 Generating character image with Seedream 4.5...`);
        const result = await generateImage({
          prompt: enhancedPrompt,
          negativePrompt: seedreamNegative,
          width: 512,
          height: 768,
          style: 'realistic'
        });

        if (result && result.url) {
          bodyImageUrl = result.url;
        }
      } catch (error: any) {
        console.warn(`⚠️ Seedream 4.5 generation failed: ${error.message}`);
      }
    }

    if (!bodyImageUrl) {
      return NextResponse.json(
        { error: 'Failed to generate image with both Friendli and NOVITA' },
        { status: 500 }
      );
    }

    console.log('Image generated successfully, starting face swap...');

    // Step 3: Face swap using RunPod
    const runpodApiKey = process.env.RUNPOD_API_KEY;
    if (!runpodApiKey) {
      console.warn('RunPod API key not configured, returning image without face swap');
      return NextResponse.json({
        success: true,
        imageUrl: bodyImageUrl,
        prompt: prompt,
      });
    }

    try {
      // Reuse characterImageBase64 (already processed in Step 1)
      const characterBase64Clean = characterImageBase64.replace(/^data:image\/\w+;base64,/, "");

      // Get body image base64
      let bodyBase64 = "";
      if (bodyImageUrl.startsWith('data:')) {
        bodyBase64 = bodyImageUrl.replace(/^data:image\/\w+;base64,/, "");
      } else {
        const bodyImageResponse = await fetch(bodyImageUrl);
        if (!bodyImageResponse.ok) throw new Error('Failed to fetch body image');
        const bodyBuffer = await bodyImageResponse.arrayBuffer();
        bodyBase64 = Buffer.from(bodyBuffer).toString('base64');
      }

      console.log('Starting face swap with RunPod...');

      // Perform face swap
      const runpodResponse = await fetch('https://api.runpod.ai/v2/f5f72j1ier8gy3/runsync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${runpodApiKey}`,
        },
        body: JSON.stringify({
          input: {
            source_image: characterBase64Clean, // Character face as source
            target_image: bodyBase64,           // Generated body as target
            source_indexes: "-1",
            target_indexes: "-1",
            background_enhance: true,
            face_restore: true,
            face_upsample: true,
            upscale: 1,
            codeformer_fidelity: 0.5,
            output_format: "JPEG"
          },
        }),
      });

      if (!runpodResponse.ok) {
        const errorText = await runpodResponse.text();
        console.error('RunPod face swap error:', errorText);
        throw new Error(`Face swap failed: ${runpodResponse.status}`);
      }

      const runpodData = await runpodResponse.json();

      if (runpodData.status !== "COMPLETED") {
        console.error('RunPod face swap incomplete:', runpodData);
        throw new Error(`Face swap incomplete: ${runpodData.status}`);
      }

      const resultImageData = runpodData.output?.image;
      if (!resultImageData) {
        throw new Error('No result image from face swap');
      }

      const finalImage = `data:image/jpeg;base64,${resultImageData}`;

      console.log('Face swap completed successfully');

      return NextResponse.json({
        success: true,
        imageUrl: finalImage,
        bodyImageUrl,
        prompt: prompt,
      });

    } catch (faceSwapError) {
      console.warn('Face swap failed, returning original image:', faceSwapError);
      // If face swap fails, return the generated body image
      return NextResponse.json({
        success: true,
        imageUrl: bodyImageUrl,
        prompt: prompt,
        note: 'Face swap failed, returning generated image without face swap'
      });
    }

  } catch (error) {
    console.error('Error generating character image:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
