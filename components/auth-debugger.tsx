"use client";

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';

/**
 * Auth Debugger Component
 * Add this to your create-character page temporarily to debug auth issues
 * 
 * Usage:
 * import AuthDebugger from '@/components/auth-debugger';
 * 
 * Then add: <AuthDebugger /> anywhere in your JSX
 */
export default function AuthDebugger() {
    const [authState, setAuthState] = useState({
        hasSession: false,
        hasUser: false,
        userId: null,
        email: null,
        error: null
    });

    const supabase = createClient();

    const checkAuth = useCallback(async () => {
        try {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            const { data: { user }, error: userError } = await supabase.auth.getUser();

            setAuthState({
                hasSession: !!session,
                hasUser: !!user,
                userId: user?.id || null,
                email: user?.email || null,
                error: sessionError?.message || userError?.message || null
            });

            console.log('🔍 Auth State:', {
                hasSession: !!session,
                hasUser: !!user,
                userId: user?.id,
                email: user?.email
            });
        } catch (error: any) {
            console.error('❌ Auth check error:', error);
            setAuthState(prev => ({ ...prev, error: error.message }));
        }
    }, [supabase]);

    useEffect(() => {
        checkAuth();

        // Subscribe to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('🔔 Auth state changed:', event, session?.user?.email);
            checkAuth();
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [checkAuth, supabase]);

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            padding: '15px',
            borderRadius: '8px',
            fontSize: '12px',
            fontFamily: 'monospace',
            zIndex: 9999,
            maxWidth: '300px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
            <div style={{ fontWeight: 'bold', marginBottom: '10px', borderBottom: '1px solid #444', paddingBottom: '5px' }}>
                🔍 Auth Debugger
            </div>

            <div style={{ marginBottom: '8px' }}>
                <span style={{ color: authState.hasSession ? '#4ade80' : '#f87171' }}>
                    {authState.hasSession ? '✅' : '❌'} Session
                </span>
            </div>

            <div style={{ marginBottom: '8px' }}>
                <span style={{ color: authState.hasUser ? '#4ade80' : '#f87171' }}>
                    {authState.hasUser ? '✅' : '❌'} User
                </span>
            </div>

            {authState.email && (
                <div style={{ marginBottom: '8px', fontSize: '11px', opacity: 0.8 }}>
                    📧 {authState.email}
                </div>
            )}

            {authState.userId && (
                <div style={{ marginBottom: '8px', fontSize: '10px', opacity: 0.6 }}>
                    🆔 {authState.userId.substring(0, 8)}...
                </div>
            )}

            {authState.error && (
                <div style={{ marginTop: '8px', padding: '8px', background: '#ef4444', borderRadius: '4px', fontSize: '10px' }}>
                    ❌ {authState.error}
                </div>
            )}

            <button
                onClick={checkAuth}
                style={{
                    marginTop: '10px',
                    width: '100%',
                    padding: '6px',
                    background: '#3b82f6',
                    border: 'none',
                    borderRadius: '4px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '11px'
                }}
            >
                🔄 Refresh
            </button>
        </div>
    );
}
