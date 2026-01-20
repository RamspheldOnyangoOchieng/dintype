// No secrets needed here as it connects to localhost

async function testAPIEndpoint() {
  try {
    console.log('🧪 Testing /api/admin/content endpoint...\n')

    // Simulate what the browser would send
    const response = await fetch('http://localhost:3000/api/admin/content', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    console.log('📡 Response status:', response.status, response.statusText)

    const data = await response.json()

    if (response.ok) {
      console.log(`✅ Success! Received ${data.length} blocks\n`)
      console.log('📋 Sample blocks:')
      data.slice(0, 3).forEach(block => {
        console.log(`   • ${block.page}/${block.block_key}: "${block.content_sv?.substring(0, 40)}..."`)
      })
    } else {
      console.log('❌ Error response:', data)
    }

  } catch (error) {
    console.error('❌ Request failed:', error.message)
    console.log('\n💡 Make sure your Next.js dev server is running on port 3000')
    console.log('   Run: pnpm dev')
  }
}

testAPIEndpoint()
