import { NextRequest, NextResponse } from 'next/server';
import { generateImage } from '@/lib/novita-api';

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
        width: 1024,
        height: 1536
    });
    return result.url;
}

function buildPromptFromCustomization(customization: CustomizationData): { prompt: string; negativePrompt: string } {
    const styleDescriptor = customization.style === 'anime'
        ? 'anime character, illustrated, cel-shaded'
        : 'photorealistic, beautiful woman, professional portrait photography';

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

    const allDescriptors = [
        styleDescriptor,
        ageDescriptor,
        bodyDescriptor,
        ethnicityDescriptor,
        hairDescriptor,
        faceDescriptor,
        bodyDetailsDescriptor,
    ].filter(Boolean);

    let prompt = allDescriptors.join(', ') + ', high quality, detailed, centered, frontal view, raw photo, film grain, natural lighting, highly detailed skin texture, sharp focus, Fujifilm instax, 4k, masterpiece, ultra-realistic, shot on 35mm lens, kodak portra 400 aesthetic, natural skin texture';

    const baseNegative = 'deformed face, distorted face, bad anatomy, wrong proportions, extra limbs, extra arms, extra legs, extra fingers, extra toes, missing fingers, fused fingers, long fingers, short fingers, broken hands, malformed hands, twisted wrists, asymmetrical face, uneven eyes, crossed eyes, lazy eye, misaligned pupils, double pupils, melting face, warped face, collapsed jaw, broken mouth, stretched mouth, floating teeth, multiple mouths, open mouth smile, exaggerated smile, uncanny valley, fake human, artificial look, plastic skin, waxy skin, rubber skin, doll face, mannequin, cgi, 3d render, overly smooth skin, airbrushed skin, beauty filter, face retouching, perfect symmetry, hyper symmetry, oversharpened, unreal detail, hdr, overprocessed, bad lighting, harsh studio lighting, ring light, beauty light, anime, cartoon, illustration, painting, stylized, fantasy, wide angle distortion, fisheye, extreme perspective, long neck, short neck, broken neck, disproportionate body, stretched torso, tiny head, big head, unnatural shoulders, broken clavicle, incorrect hip width, warped waist, bad legs anatomy, bow legs, twisted legs, bad feet, malformed feet, missing feet, floating body parts, disconnected limbs, duplicate body parts, cloned face, low quality, blurry, jpeg artifacts, motion blur, depth of field error, wrong shadows, floating shadows, bad pose, unnatural pose, model pose, fashion pose, runway pose, professional photoshoot, nsfw anatomy error';

    // Length safety
    if (prompt.length > 1000) prompt = prompt.substring(0, 1000);
    let negativePrompt = baseNegative;
    if (negativePrompt.length > 1000) negativePrompt = negativePrompt.substring(0, 1000);

    return { prompt, negativePrompt };
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

        // Build prompt from customization
        const { prompt, negativePrompt } = buildPromptFromCustomization(customization);
        console.log('📝 Generated prompt:', prompt);

        // Generate image
        const imageUrl = await generateImageWithNovita(prompt, negativePrompt, customization.style);
        console.log('✅ Character image generated:', imageUrl);

        return NextResponse.json({
            success: true,
            image_url: imageUrl,
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
