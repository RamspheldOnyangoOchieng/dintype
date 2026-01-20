import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function GET() {
    try {
        const supabase = await createClient()

        // Fetch only public settings
        const { data: rawSettings } = await supabase
            .from('settings')
            .select('*')
            .in('key', ['currency_config', 'site_name', 'logo_text'])

        const settings: Record<string, any> = {}
        rawSettings?.forEach(s => {
            settings[s.key] = s.value
        })

        return NextResponse.json({
            success: true,
            settings: {
                currency: settings.currency_config || { code: 'USD', symbol: '$', rate: 1.0 },
                siteName: settings.site_name || "Pocketlove",
                logoText: settings.logo_text || "Pocketlove"
            }
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
