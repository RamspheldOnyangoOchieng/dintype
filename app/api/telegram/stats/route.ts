import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Check if user is admin
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single()

        if (!profile?.is_admin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // Get stats
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        // Total users
        const { count: totalUsers } = await supabase
            .from('telegram_users')
            .select('*', { count: 'exact', head: true })

        // Active today (users who had any activity today)
        const { count: activeToday } = await supabase
            .from('telegram_users')
            .select('*', { count: 'exact', head: true })
            .gte('last_active_at', today.toISOString())

        // Total interactions (you can customize this based on your tracking)
        const { count: totalInteractions } = await supabase
            .from('chat_history')
            .select('*', { count: 'exact', head: true })
            .not('telegram_user_id', 'is', null)

        // Character selections
        const { count: characterSelections } = await supabase
            .from('telegram_users')
            .select('*', { count: 'exact', head: true })
            .not('active_character_id', 'is', null)

        return NextResponse.json({
            total_users: totalUsers || 0,
            active_today: activeToday || 0,
            total_interactions: totalInteractions || 0,
            character_selections: characterSelections || 0,
        })
    } catch (error) {
        console.error('Error fetching Telegram stats:', error)
        return NextResponse.json(
            { error: 'Failed to fetch stats' },
            { status: 500 }
        )
    }
}
