import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase-admin"

export async function GET() {
    try {
        const supabase = await createAdminClient()
        if (!supabase) return NextResponse.json({ error: "DB unavailable" }, { status: 500 })

        const { data: rawSettings } = await supabase
            .from('settings')
            .select('*')
            .in('key', ['currency_config', 'site_name', 'logo_text', 'site_url', 'brand_config', 'pricing_config', 'tagline', 'site_language'])

        const settings: Record<string, any> = {}
        rawSettings?.forEach(s => { settings[s.key] = s.value })

        return NextResponse.json({
            success: true,
            settings: {
                currency: settings.currency_config || { code: 'USD', symbol: '$', rate: 1.0 },
                siteName: settings.site_name || null,
                logoText: settings.logo_text || null,
                tagline:  settings.tagline  || null,
                siteUrl:  settings.site_url  || "",
                brandConfig:  settings.brand_config   || null,
                pricingConfig: settings.pricing_config || null,
                language: (settings.site_language as "en" | "sv") || "en",
            }
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
