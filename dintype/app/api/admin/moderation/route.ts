import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';

export async function GET(req: Request) {
    const supabase = createClient(headers().get('cookie'));
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 401 });
    }
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();
    if (profileError || !profile?.is_admin) {
        return NextResponse.json({ error: 'Forbidden: You do not have admin privileges.' }, { status: 403 });
    }
    const { data: logs, error: logsError } = await supabase
        .from('moderation_logs')
        .select('*')
        .order('timestamp', { ascending: false });
    if (logsError) {
        return NextResponse.json({ error: 'Failed to fetch logs.' }, { status: 500 });
    }
    return NextResponse.json(logs);
} 