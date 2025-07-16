'use client';
import { useState, useEffect } from 'react';

interface ModerationLog {
    id: string;
    user_id: string;
    content_type: string;
    original_content: string;
    moderated_content: string | null;
    policy_violation: string | null;
    action_taken: string;
    triggered_rules: string[];
    timestamp: string;
    metadata: any;
}

export default function AdminModerationPage() {
    const [logs, setLogs] = useState<ModerationLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchLogs() {
            try {
                setLoading(true);
                const response = await fetch('/api/admin/moderation');
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch moderation logs');
                }
                setLogs(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchLogs();
    }, []);

    if (loading) return <p>Loading moderation logs...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Moderation Logs</h1>
            {logs.length === 0 ? (
                <p>No moderation logs found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-800">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">Timestamp</th>
                                <th className="px-4 py-2">User ID</th>
                                <th className="px-4 py-2">Type</th>
                                <th className="px-4 py-2">Original Content</th>
                                <th className="px-4 py-2">Action</th>
                                <th className="px-4 py-2">Violation</th>
                                <th className="px-4 py-2">Rules</th>
                                <th className="px-4 py-2">Metadata</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log.id} className="border-b dark:border-gray-700">
                                    <td className="px-4 py-2 text-sm">{new Date(log.timestamp).toLocaleString()}</td>
                                    <td className="px-4 py-2 text-sm">{log.user_id?.substring(0, 8)}...</td>
                                    <td className="px-4 py-2 text-sm">{log.content_type}</td>
                                    <td className="px-4 py-2 text-sm max-w-xs overflow-auto">{log.original_content}</td>
                                    <td className="px-4 py-2 text-sm font-semibold">{log.action_taken}</td>
                                    <td className="px-4 py-2 text-sm text-red-600">{log.policy_violation || 'N/A'}</td>
                                    <td className="px-4 py-2 text-sm">{log.triggered_rules?.join(', ') || 'N/A'}</td>
                                    <td className="px-4 py-2 text-sm max-w-xs overflow-auto">
                                        <pre className="text-xs break-all">{JSON.stringify(log.metadata, null, 2)}</pre>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
} 