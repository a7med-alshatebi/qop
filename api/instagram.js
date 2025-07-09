import fetch from 'node-fetch';

export default async (req, res) => {
  const response = await fetch(
    `https://graph.instagram.com/me/media?fields=media_url,caption&access_token=${process.env.IG_ACCESS_TOKEN}`
  );
  const data = await response.json();
  res.status(200).json(data);
};
