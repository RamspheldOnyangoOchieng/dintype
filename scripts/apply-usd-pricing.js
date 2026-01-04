#!/usr/bin/env node

/**
 * Apply USD Pricing Migration
 * Updates token_packages table with US Dollar pricing
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function applyMigration() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    console.error('   Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('🚀 Starting USD pricing migration...\n');

  try {
    console.log(' Checking current token packages...\n');

    const { data: beforeData, error: beforeError } = await supabase
      .from('token_packages')
      .select('*')
      .order('tokens');

    if (beforeError) {
      console.log('⚠️  Could not fetch current packages:', beforeError.message);
      console.log('   Continuing with migration...\n');
    } else if (beforeData && beforeData.length > 0) {
      console.log('Current packages:');
      beforeData.forEach(pkg => {
        console.log(`  - ${pkg.name}: ${pkg.tokens} tokens, Price: ${pkg.price}`);
      });
      console.log('');
    } else {
      console.log('   No existing packages found\n');
    }

    // Update prices - just the price field
    console.log('🔄 Updating prices to US Dollars...\n');
    
    const updates = [
      { tokens: 200, price: 9.99, name: 'Small Package' },
      { tokens: 550, price: 24.99, name: 'Medium Package' },
      { tokens: 1550, price: 49.99, name: 'Large Package' },
      { tokens: 5800, price: 149.99, name: 'Mega Package' }
    ];

    for (const update of updates) {
      const { error } = await supabase
        .from('token_packages')
        .update({ price: update.price })
        .eq('tokens', update.tokens);

      if (error) {
        console.error(`❌ Error updating ${update.tokens} tokens package:`, error.message);
        console.log(`   Trying to insert instead...`);
        
        // If update failed, try to insert
        const { error: insertError } = await supabase
          .from('token_packages')
          .insert({
            name: update.name,
            tokens: update.tokens,
            price: update.price
          });
          
        if (insertError) {
          console.error(`❌ Insert also failed:`, insertError.message);
        } else {
          console.log(`✅ Inserted ${update.tokens} tokens → $${update.price}`);
        }
      } else {
        console.log(`✅ Updated ${update.tokens} tokens → $${update.price}`);
      }
    }

    // Verify the changes
    console.log('\n📊 Verifying final state...\n');
    const { data: afterData, error: afterError } = await supabase
      .from('token_packages')
      .select('*')
      .order('tokens');

    if (afterError) {
      console.error('❌ Error fetching updated packages:', afterError.message);
    } else if (afterData && afterData.length > 0) {
      console.log('✅ Final packages:');
      afterData.forEach(pkg => {
        console.log(`  ✓ ${pkg.name}: ${pkg.tokens} tokens → $${pkg.price}`);
      });
    }

    console.log('\n✅ Migration completed successfully!');
    console.log('\nSummary:');
    console.log('   • 200 tokens = $9.99');
    console.log('   • 550 tokens = $24.99');
    console.log('   • 1,550 tokens = $49.99');
    console.log('   • 5,800 tokens = $149.99');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  }
}

applyMigration();
