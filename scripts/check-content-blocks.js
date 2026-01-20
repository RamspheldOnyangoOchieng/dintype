const { createClient } = require('@supabase/supabase-js')

require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!supabaseUrl) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL in .env');

const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseKey) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY in .env');

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkContentBlocks() {
  try {
    console.log('🔍 Checking content_blocks table...\n')

    // Try to fetch all content blocks
    const { data, error } = await supabase
      .from('content_blocks')
      .select('*')
      .limit(5)

    if (error) {
      console.log('❌ Error fetching content_blocks:', error.message)
      console.log('   Error details:', error)
      return
    }

    console.log(`📊 Total blocks found: ${data ? data.length : 0}`)

    if (data && data.length > 0) {
      console.log('\n✅ Sample content blocks:')
      console.log(JSON.stringify(data, null, 2))

      console.log('\n📋 Table columns found:')
      console.log(Object.keys(data[0]).join(', '))
    } else {
      console.log('\n⚠️  No content blocks in database')
      console.log('\nExpected columns: page, block_key, content_sv, content_en, content_type')
      console.log('Need to either:')
      console.log('1. Run the migration to create the table with correct schema')
      console.log('2. Insert sample data')
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

checkContentBlocks()
