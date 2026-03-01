import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url)
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type')
    const next = searchParams.get('next') || '/'

    if (token_hash && type) {
        const supabase = await createClient()

        const { error } = await supabase.auth.verifyOtp({
            type: type as any,
            token_hash,
        })

        if (!error) {
            // Redirect to home with login flag to show success toast
            return NextResponse.redirect(new URL('/?login=true', request.url))
        }

        // Check if user is already logged in (maybe verifyOtp failed because already verified)
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            return NextResponse.redirect(new URL('/?login=true', request.url))
        }

        // If there's an error, log it
        console.error('Email confirmation error:', error)
    }

    // Redirect to login with error message
    return NextResponse.redirect(new URL('/logga-in?error=Invalid+confirmation+link', request.url))
}
