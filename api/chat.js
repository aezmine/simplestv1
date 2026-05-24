export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method Not Allowed' } });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: { message: 'Server configuration error: GROQ_API_KEY is missing in environment variables.' } });
  }

  try {
    const { messages, model, temperature, max_tokens } = req.body;

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model || 'llama-3.3-70b-versatile',
        messages: messages,
        temperature: temperature || 0.85,
        max_tokens: max_tokens || 1024
      })
    });

    const data = await groqResponse.json();

    if (!groqResponse.ok) {
      return res.status(groqResponse.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('API Chat Error:', error);
    return res.status(500).json({ error: { message: 'Internal Server Error connecting to Groq', details: error.message } });
  }
}
