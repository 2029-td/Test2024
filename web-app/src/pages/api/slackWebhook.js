// /pages/api/slackWebhook.js
export default async function handler(req, res) {
    if (req.method === 'POST') {
        const slackWebhookUrl = 'https://hooks.slack.com/services/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';
        const { text } = req.body;

        try {
            const response = await fetch(slackWebhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                throw new Error(`Slack notification failed: ${response.status} ${response.statusText}`);
            }

            res.status(200).json({ success: true });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Failed to send Slack notification' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
