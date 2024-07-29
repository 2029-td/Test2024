import { useState } from 'react';

export default function Home() {
    const [shinkeiseiDelayed, setShinkeiseiDelayed] = useState(null);
    const [keiseiDelayed, setKeiseiDelayed] = useState(null);
    const [loading, setLoading] = useState(false);
    const slackWebhookUrl = '/api/slackWebhook'; // APIルートを修正

    async function fetchTrainStatus(url) {
        const response = await fetch(`/api/fetchTrainStatus?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        return data.delays;
    }

    async function sendSlackNotification(lineName) {
        const message = {
            text: `${lineName}は遅延しています`
        };
        const response = await fetch(slackWebhookUrl, { // APIエンドポイントを修正
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        });
        if (!response.ok) {
            throw new Error(`Slack notification failed: ${response.status} ${response.statusText}`);
        }
    }

    async function notifyDelays(lineName, isDelayed) {
        if (isDelayed) {
            await sendSlackNotification(lineName);
        }
    }

    async function checkDelays() {
        setLoading(true);
        try {
            const shinkeiseiUrl = 'https://transit.yahoo.co.jp/diainfo/127/0';
            const keiseiUrl = 'https://transit.yahoo.co.jp/diainfo/96/0';

            const shinkeiseiDelayed = await fetchTrainStatus(shinkeiseiUrl);
            const keiseiDelayed = await fetchTrainStatus(keiseiUrl);

            setShinkeiseiDelayed(shinkeiseiDelayed);
            setKeiseiDelayed(keiseiDelayed);

            await notifyDelays('新京成線', shinkeiseiDelayed);
            await notifyDelays('京成線', keiseiDelayed);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>運行情報通知</h1>
            <button onClick={checkDelays} disabled={loading} style={styles.button}>
                {loading ? '読み込み中...' : '運行情報を確認'}
            </button>
            {shinkeiseiDelayed !== null && (
                <p style={styles.status}>新京成線の遅延: {shinkeiseiDelayed ? 'あり' : 'なし'}</p>
            )}
            {keiseiDelayed !== null && (
                <p style={styles.status}>京成線の遅延: {keiseiDelayed ? 'あり' : 'なし'}</p>
            )}
        </div>
    );
}

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        textAlign: 'center',
        background: '#f0f0f0',
        minHeight: '100vh',
    },
    header: {
        fontSize: '2em',
        marginBottom: '20px',
    },
    button: {
        padding: '10px 20px',
        fontSize: '1em',
        background: '#0070f3',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    status: {
        marginTop: '20px',
        fontSize: '1.2em',
    },
};
