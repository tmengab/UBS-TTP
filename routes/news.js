const express = require('express');
const router = express.Router();

router.get('/news', async (req, res) => {
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'You are a news assistant. Give me the latest 3 technology news headlines with a 1-sentence summary for each, in English.' }
        ],
        max_tokens: 400,
        temperature: 0.5
      })
    });
    if (!response.ok) throw new Error('DeepSeek API error');
    const data = await response.json();
    res.json({ news: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

module.exports = router;
