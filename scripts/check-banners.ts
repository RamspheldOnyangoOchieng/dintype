
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkBanners() {
    const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching banners:', error)
        return
    }

    console.log(`Found ${data.length} banners:`)
    data.forEach((banner, index) => {
        console.log(`${index + 1}. [${banner.is_active ? 'ACTIVE' : 'INACTIVE'}] ${banner.title} (ID: ${banner.id})`)
    })
}

checkBanners()
