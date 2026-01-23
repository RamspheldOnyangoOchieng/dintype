#!/usr/bin/env node

/**
 * Seed Plan Restrictions
 * 
 * This script ensures all required plan restrictions exist in the database.
 * It adds default restrictions for both free and premium plans including:
 * - can_generate_nsfw
 * - can_use_flux
 * - can_use_stability
 * - can_use_seedream (NEW)
 * - daily_free_messages
 * - weekly_image_generation
 * - active_girlfriends_limit
 * - monthly_tokens
 * - tokens_per_image
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables');
    console.log('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Default restrictions that should exist for full site control
const DEFAULT_RESTRICTIONS = {
    'can_generate_nsfw': { description: 'Whether users can generate NSFW content', defaultFree: 'true', defaultPremium: 'true' },
    'can_use_flux': { description: 'Whether users can use the Flux model', defaultFree: 'true', defaultPremium: 'true' },
    'can_use_stability': { description: 'Whether users can use Stability AI models', defaultFree: 'true', defaultPremium: 'true' },
    'can_use_seedream': { description: 'Whether users can use the Seedream 4.5 model', defaultFree: 'true', defaultPremium: 'true' },
    'daily_free_messages': { description: 'Number of free messages per day', defaultFree: 'null', defaultPremium: 'null' },
    'weekly_image_generation': { description: 'Weekly image generation limit', defaultFree: '5', defaultPremium: 'null' },
    'active_girlfriends_limit': { description: 'Maximum active AI companions', defaultFree: '1', defaultPremium: '3' },
    'monthly_tokens': { description: 'Monthly token allocation', defaultFree: '50', defaultPremium: '200' },
    'tokens_per_image': { description: 'Tokens cost per image generation', defaultFree: '0', defaultPremium: '5' },
};

async function seedRestrictions() {
    console.log('🌱 Seeding plan restrictions...\n');

    let insertedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    for (const [key, config] of Object.entries(DEFAULT_RESTRICTIONS)) {
        for (const planType of ['free', 'premium']) {
            const defaultValue = planType === 'free' ? config.defaultFree : config.defaultPremium;

            // Check if restriction already exists
            const { data: existing, error: checkError } = await supabase
                .from('plan_restrictions')
                .select('id, restriction_value, description')
                .eq('plan_type', planType)
                .eq('restriction_key', key)
                .maybeSingle();

            if (checkError) {
                console.error(`❌ Error checking ${planType}.${key}:`, checkError.message);
                continue;
            }

            if (existing) {
                // Update description if missing
                if (!existing.description) {
                    const { error: updateError } = await supabase
                        .from('plan_restrictions')
                        .update({
                            description: config.description,
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', existing.id);

                    if (updateError) {
                        console.error(`❌ Error updating ${planType}.${key}:`, updateError.message);
                    } else {
                        console.log(`📝 Updated description for ${planType}.${key}`);
                        updatedCount++;
                    }
                } else {
                    console.log(`⏭️  ${planType}.${key} already exists (value: ${existing.restriction_value})`);
                    skippedCount++;
                }
            } else {
                // Insert new restriction
                const { error: insertError } = await supabase
                    .from('plan_restrictions')
                    .insert({
                        plan_type: planType,
                        restriction_key: key,
                        restriction_value: defaultValue,
                        description: config.description,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    });

                if (insertError) {
                    console.error(`❌ Error inserting ${planType}.${key}:`, insertError.message);
                } else {
                    console.log(`✅ Added ${planType}.${key} = ${defaultValue}`);
                    insertedCount++;
                }
            }
        }
    }

    console.log('\n📊 Summary:');
    console.log(`   ✅ Inserted: ${insertedCount}`);
    console.log(`   📝 Updated: ${updatedCount}`);
    console.log(`   ⏭️  Skipped: ${skippedCount}`);

    // List all current restrictions
    console.log('\n📋 Current restrictions:');
    const { data: allRestrictions } = await supabase
        .from('plan_restrictions')
        .select('plan_type, restriction_key, restriction_value')
        .order('plan_type')
        .order('restriction_key');

    if (allRestrictions) {
        console.log('\n🆓 FREE PLAN:');
        allRestrictions.filter(r => r.plan_type === 'free').forEach(r => {
            console.log(`   ${r.restriction_key}: ${r.restriction_value}`);
        });

        console.log('\n💎 PREMIUM PLAN:');
        allRestrictions.filter(r => r.plan_type === 'premium').forEach(r => {
            console.log(`   ${r.restriction_key}: ${r.restriction_value}`);
        });
    }

    console.log('\n✨ Done!');
}

seedRestrictions().catch(console.error);
