import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';

export async function GET(request: NextRequest) {
    try {
        const supabaseAdmin = await createAdminClient();
        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const { data, error } = await supabaseAdmin
            .from('profile_photo_suggestion_prompts')
            .select('*')
            .order('category', { ascending: true });

        if (error) {
            console.error('Error fetching suggestions:', error);
            return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 });
        }

        // Group by category
        const grouped = (data || []).reduce((acc: any, item: any) => {
            if (!acc[item.category]) {
                acc[item.category] = [];
            }
            acc[item.category].push(item);
            return acc;
        }, {});

        return NextResponse.json({ suggestions: grouped });

    } catch (error) {
        console.error('Suggestions API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
