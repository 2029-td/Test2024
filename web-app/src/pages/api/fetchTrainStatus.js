import axios from 'axios';
import { JSDOM } from 'jsdom';

export default async function handler(req, res) {
    const { url } = req.query;

    try {
        const response = await axios.get(url);
        const dom = new JSDOM(response.data);
        const document = dom.window.document;

        const delays = document.querySelector('dd.trouble') !== null;

        res.status(200).json({ delays });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch train status' });
    }
}
