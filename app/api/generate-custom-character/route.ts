import { NextRequest, NextResponse } from 'next/server';
import { generateImage } from '@/lib/novita-api';
import { getUnifiedNovitaKey } from '@/lib/unified-api-keys';

interface CustomizationData {
    style: 'realistic' | 'anime';
    age: string;
    body: string;
    ethnicity: string;
    hair_style: string;
    hair_length: string;
    hair_color: string;
    eye_color: string;
    eye_shape: string;
    lip_shape: string;
    face_shape: string;
    hips: string;
    bust: string;
}

async function generateImageWithNovita(prompt: string, negativePrompt: string, style: 'realistic' | 'anime'): Promise<string> {
    const result = await generateImage({
        prompt,
        negativePrompt,
        style,
        width: 1600,
        height: 2400
    });
    return result.url;
}

// AI-Enhanced prompt generation using DeepSeek for realistic, healthy, smooth skin
async function enhancePromptWithAI(customization: CustomizationData): Promise<string> {
    const { key: novitaApiKey } = await getUnifiedNovitaKey();
    if (!novitaApiKey) {
        console.warn('⚠️ No Novita API key available for prompt enhancement');
        return buildBasicPrompt(customization);
    }

    const characterDescription = buildCharacterDescription(customization);

    try {
        const response = await fetch('https://api.novita.ai/v3/openai/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${novitaApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'deepseek/deepseek-v3.1',
                messages: [
                    {
                        role: 'system',
                        content: `You are a master prompt engineer specializing in ultra-realistic human photography. Your mission is to create breathtaking, REAL-looking character portraits with healthy, smooth, natural skin.

CRITICAL REALISM RULES:
1. SKIN QUALITY (TOP PRIORITY): Create prompts for "healthy, smooth, radiant skin". Use terms like "natural healthy glow", "soft supple skin", "even skin tone", "smooth clear complexion", "vibrant youthful skin", "dewy fresh skin", "natural subsurface scattering". ABSOLUTELY AVOID plastic, waxy, airbrushed, or synthetic-looking skin.

2. PHOTOGRAPHIC REALISM: Use professional photography terms: "shot on Canon EOS R5", "85mm portrait lens", "f/1.8 aperture", "natural soft lighting", "golden hour warmth", "studio softbox", "deep depth of field", "RAW unprocessed photo", "film grain texture".

3. NATURAL HUMAN FEATURES: Emphasize "realistic eye moisture", "natural lip texture", "soft facial contours", "authentic bone structure", "natural hair physics", "realistic skin pores visible at close range".

4. ENVIRONMENTAL GROUNDING: Always place the subject in a REAL, specific environment. Choose from: luxury apartment, rooftop bar, beach sunset, cozy café, art gallery, botanical garden, city street at dusk, modern kitchen, elegant bathroom.

5. MOOD & EXPRESSION: Use "confident gaze", "warm genuine smile", "relaxed natural pose", "authentic candid moment", "approachable demeanor".

6. ANATOMY PERFECTION: Specify "anatomically perfect hands with five fingers", "natural body proportions", "elegant posture", "graceful limb placement".

7. ANTI-PLASTIC MANDATE: Explicitly include "(NOT plastic skin:2.0), (NOT waxy:2.0), (NOT airbrushed:1.8), (NOT CGI:2.0), (real human being:1.9), (actual photograph:1.8), (organic skin texture:1.7)".

OUTPUT: Return ONLY the enhanced photographic prompt (under 200 words). No explanations.`
                    },
                    {
                        role: 'user',
                        content: `Create a stunning, ultra-realistic photographic prompt for this character:

CHARACTER DETAILS:
- Style: ${customization.style === 'anime' ? 'High-quality anime illustration' : 'Hyper-realistic photography'}
- Age: ${customization.age || 'young adult'}
- Body Type: ${customization.body || 'fit'}
- Ethnicity: ${customization.ethnicity || 'mixed'}
- Hair: ${customization.hair_color || 'natural'} ${customization.hair_length || ''} ${customization.hair_style || ''} hair
- Eyes: ${customization.eye_color || 'beautiful'} ${customization.eye_shape || ''} eyes
- Face: ${customization.face_shape || 'elegant'} face with ${customization.lip_shape || 'natural'} lips
- Figure: ${customization.bust || 'natural'} bust, ${customization.hips || 'natural'} hips

Create a masterpiece prompt that produces a REAL-looking person with healthy, smooth, natural skin - NOT plastic or artificial. Focus on photographic authenticity.`
                    }
                ],
                max_tokens: 400,
                temperature: 0.7,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            const enhancedPrompt = data.choices?.[0]?.message?.content?.trim();
            if (enhancedPrompt) {
                console.log('✅ AI-Enhanced prompt generated successfully');
                // Add mandatory realism anchors
                return addRealismAnchors(enhancedPrompt, customization);
            }
        }
        console.warn('⚠️ AI enhancement failed, using fallback');
        return buildBasicPrompt(customization);
    } catch (error) {
        console.error('❌ Error in AI prompt enhancement:', error);
        return buildBasicPrompt(customization);
    }
}

// Build character description from customization
function buildCharacterDescription(customization: CustomizationData): string {
    return [
        customization.age && `${customization.age} years old`,
        customization.ethnicity && `${customization.ethnicity}`,
        customization.body && `${customization.body} body type`,
        customization.hair_color && customization.hair_style && `${customization.hair_color} ${customization.hair_style} hair`,
        customization.eye_color && `${customization.eye_color} eyes`,
        customization.face_shape && `${customization.face_shape} face`,
        customization.lip_shape && `${customization.lip_shape} lips`,
        customization.bust && `${customization.bust} bust`,
        customization.hips && `${customization.hips} hips`,
    ].filter(Boolean).join(', ');
}

// Add mandatory realism anchors to any prompt
function addRealismAnchors(prompt: string, customization: CustomizationData): string {
    const realismPrefix = customization.style === 'anime' 
        ? '' 
        : `(MANDATORY PHOTOREALISTIC:2.0), (real photograph:1.9), (NOT plastic skin:2.0), (NOT waxy:2.0), (NOT airbrushed:1.8), (NOT CGI:2.0), (real human being:1.9), (actual person:1.8), `;
    
    const skinQuality = `(healthy smooth radiant skin:1.9), (natural skin texture:1.8), (soft supple skin:1.7), (even skin tone:1.8), (vibrant youthful complexion:1.7), (dewy fresh skin:1.6), (natural subsurface scattering:1.5), (organic skin texture:1.7), `;
    
    const photoQuality = customization.style === 'anime' 
        ? `masterpiece, best quality, highly detailed, sharp focus, `
        : `(shot on Canon EOS R5:1.3), (85mm portrait lens:1.2), (natural soft lighting:1.4), (RAW unprocessed photo:1.5), (film grain:1.2), (deep depth of field:1.3), (8k UHD:1.3), `;
    
    const anatomyGuard = `(anatomically perfect:1.8), (natural body proportions:1.7), (five fingers per hand:1.9), (correct limb placement:1.8), `;

    return `${realismPrefix}${skinQuality}${photoQuality}${anatomyGuard}${prompt}`;
}

function buildBasicPrompt(customization: CustomizationData): string {
    const styleDescriptor = customization.style === 'anime'
        ? 'masterpiece anime character, highly detailed illustration, best quality'
        : '(MANDATORY PHOTOREALISTIC:2.0), (real photograph:1.9), beautiful woman, professional portrait photography, (NOT plastic:2.0), (NOT waxy:2.0), (real human being:1.8)';

    const ageDescriptor = customization.age ? `${customization.age} years old` : '';
    const bodyDescriptor = customization.body || '';
    const ethnicityDescriptor = customization.ethnicity ? `${customization.ethnicity} ethnicity` : '';

    const hairDescriptor = [
        customization.hair_style && `${customization.hair_style.toLowerCase()} hair style`,
        customization.hair_length && `${customization.hair_length.toLowerCase()} hair`,
        customization.hair_color && `${customization.hair_color.toLowerCase()} hair color`,
    ].filter(Boolean).join(', ');

    const faceDescriptor = [
        customization.eye_color && `${customization.eye_color.toLowerCase()} eyes`,
        customization.eye_shape && `${customization.eye_shape.toLowerCase()} eye shape`,
        customization.lip_shape && `${customization.lip_shape.toLowerCase()} lips`,
        customization.face_shape && `${customization.face_shape.toLowerCase()} face`,
    ].filter(Boolean).join(', ');

    const bodyDetailsDescriptor = [
        customization.bust && `${customization.bust.toLowerCase()} bust`,
        customization.hips && `${customization.hips.toLowerCase()} hips`,
    ].filter(Boolean).join(', ');

    // Enhanced skin quality terms
    const skinQuality = customization.style === 'anime' 
        ? ''
        : ', (healthy smooth radiant skin:1.9), (natural skin texture:1.8), (soft supple skin:1.7), (even skin tone:1.8), (vibrant youthful complexion:1.7), (dewy fresh skin:1.6), (organic skin texture:1.7), (NOT plastic skin:2.0), (NOT waxy:2.0), (NOT airbrushed:1.8)';

    const allDescriptors = [
        styleDescriptor,
        ageDescriptor,
        bodyDescriptor,
        ethnicityDescriptor,
        hairDescriptor,
        faceDescriptor,
        bodyDetailsDescriptor,
    ].filter(Boolean);

    return allDescriptors.join(', ') + skinQuality + ', high quality, detailed, centered, raw photo, film grain, natural lighting, highly detailed skin texture, sharp focus, 8k UHD, masterpiece, shot on Canon EOS R5, 85mm lens, natural soft lighting, deep depth of field';
}

function buildPromptFromCustomization(customization: CustomizationData): { prompt: string; negativePrompt: string } {
    // Use basic prompt as fallback - AI enhancement is done separately
    const prompt = buildBasicPrompt(customization);

    // Enhanced negative prompt to prevent plastic/artificial look
    const baseNegative = customization.style === 'anime'
        ? 'low quality, blurry, distorted, deformed, bad anatomy, ugly, malformed hands, extra fingers, missing fingers, fused fingers, distorted face, uneven eyes, lowres, text, watermark, error, worst quality, jpeg artifacts, duplicate, photorealistic, photography, 3d render'
        : '(plastic skin:3.0), (waxy skin:3.0), (airbrushed:2.5), (CGI look:3.0), (synthetic skin:3.0), (mannequin:3.0), (doll face:3.0), (artificial look:3.0), (rubbery texture:3.0), (shiny plastic:3.0), (overly smooth:2.5), (beauty filter:2.5), (face retouching:2.0), anime, cartoon, illustration, painting, stylized, deformed face, distorted face, bad anatomy, wrong proportions, extra limbs, extra fingers, missing fingers, fused fingers, asymmetrical face, uneven eyes, crossed eyes, melting face, warped face, floating body parts, disconnected limbs, duplicate body parts, low quality, blurry, jpeg artifacts, watermark, text, signature, worst quality, perfect symmetry, hyper symmetry, oversharpened, hdr, overprocessed, harsh lighting, ring light, freckles, spots, moles, blemishes, acne, skin imperfections';

    return { prompt, negativePrompt: baseNegative };
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const customization: CustomizationData = body;

        if (!customization || Object.keys(customization).length === 0) {
            return NextResponse.json(
                { error: 'Missing customization data' },
                { status: 400 }
            );
        }

        console.log('🎨 Generating custom character with:', customization);

        // Use AI-enhanced prompt for realistic, healthy, smooth skin images
        console.log('🤖 Enhancing prompt with AI for ultra-realistic results...');
        const enhancedPrompt = await enhancePromptWithAI(customization);
        console.log('📝 AI-Enhanced prompt:', enhancedPrompt);

        // Get negative prompt from the fallback builder
        const { negativePrompt } = buildPromptFromCustomization(customization);

        // Generate image with enhanced prompt
        const generatedImageUrl = await generateImageWithNovita(enhancedPrompt, negativePrompt, customization.style);
        console.log('✅ Character image generated:', generatedImageUrl);

        // Upload to Cloudinary for permanent storage
        let finalImageUrl = generatedImageUrl;
        try {
            console.log('💾 Uploading character image to Cloudinary...');
            const { uploadImageToCloudinary } = await import('@/lib/cloudinary-upload');
            finalImageUrl = await uploadImageToCloudinary(generatedImageUrl, 'characters');
            console.log('✅ Character image uploaded to Cloudinary:', finalImageUrl);
        } catch (cloudinaryError) {
            console.error('⚠️ Cloudinary upload failed, using original URL:', cloudinaryError);
        }

        return NextResponse.json({
            success: true,
            image_url: finalImageUrl,
            customization: customization,
        });
    } catch (error) {
        console.error('❌ Error generating custom character:', error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Failed to generate character image',
                success: false,
            },
            { status: 500 }
        );
    }
}
