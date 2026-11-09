import 'server-only';

export interface DiscordEmbed {
    title?: string;
    description?: string;
    color?: number;
    fields?: { name: string; value: string; inline?: boolean }[];
    image?: { url: string };
    thumbnail?: { url: string };
    timestamp?: string;
}

export interface DiscordWebhookPayload {
    content?: string;
    embeds: DiscordEmbed[];
}

export async function postEventsWebhook(payload: DiscordWebhookPayload): Promise<void> {
    const url = process.env.EVENTS_WEBHOOK_URL;
    if (!url) {
        return;
    }
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            console.error('events webhook failed:', res.status, await res.text());
        }
    } catch (err) {
        console.error('events webhook threw:', err);
    }
}
