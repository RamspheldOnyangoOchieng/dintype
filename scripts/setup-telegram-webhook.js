// Script to set up Telegram webhook
// Run this once after deploying to production

const TELEGRAM_BOT_TOKEN = '8503547134:AAGDJn47j17m6N_kVCDIVf7hgBixBA0uKZw';

async function setWebhook(webhookUrl) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                url: webhookUrl,
                allowed_updates: ['message', 'callback_query'],
                drop_pending_updates: true,
            }),
        });

        const result = await response.json();
        console.log('Webhook setup result:', result);

        if (result.ok) {
            console.log('✅ Webhook successfully set to:', webhookUrl);
        } else {
            console.error('❌ Failed to set webhook:', result.description);
        }

        return result;
    } catch (error) {
        console.error('Error setting webhook:', error);
        throw error;
    }
}

async function getWebhookInfo() {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo`;

    try {
        const response = await fetch(url);
        const result = await response.json();
        console.log('Current webhook info:', JSON.stringify(result, null, 2));
        return result;
    } catch (error) {
        console.error('Error getting webhook info:', error);
        throw error;
    }
}

async function deleteWebhook() {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/deleteWebhook`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ drop_pending_updates: true }),
        });

        const result = await response.json();
        console.log('Webhook deleted:', result);
        return result;
    } catch (error) {
        console.error('Error deleting webhook:', error);
        throw error;
    }
}

// Main execution
const args = process.argv.slice(2);
const command = args[0];

if (command === 'set' && args[1]) {
    // Example: node setup-telegram-webhook.js set https://dintype.se/api/webhooks/telegram
    setWebhook(args[1]);
} else if (command === 'info') {
    getWebhookInfo();
} else if (command === 'delete') {
    deleteWebhook();
} else {
    console.log(`
Telegram Webhook Setup Script for Dintype

Usage:
  node setup-telegram-webhook.js set <webhook_url>   Set the webhook URL
  node setup-telegram-webhook.js info                Get current webhook info
  node setup-telegram-webhook.js delete              Delete the webhook

Example:
  node setup-telegram-webhook.js set https://dintype.se/api/webhooks/telegram
  `);
}
