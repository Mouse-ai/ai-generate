import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    const userPrompt = prompt || 'Придумай креативную идею для стартапа';

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'mistral',
        prompt: userPrompt,
        stream: false,
        options: {
          temperature: 0.8,
          num_predict: 100
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama вернул ошибку: ${response.status}`);
    }

    const data = await response.json();
    res.json({ result: data.response });
  } catch (error) {
    console.error('Ошибка:', error);
    res.status(500).json({ 
      error: 'Не удалось сгенерировать идею. Убедитесь, что Ollama запущена.' 
    });
  }
});

app.listen(port, () => {
  console.log(`✅ Backend запущен на http://localhost:${port}`);
});