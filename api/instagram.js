const fetch = require('node-fetch');

module.exports = async (req, res) => {
    try {
        const response = await fetch(
            `https://graph.instagram.com/me/media?fields=media_url,caption,media_type,permalink&access_token=${process.env.IG_ACCESS_TOKEN}`
        );
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
}
