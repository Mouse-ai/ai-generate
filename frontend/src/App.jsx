import { useState } from 'react';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('Идея для стартапа');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await fetch('http://localhost:3001/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error('Ошибка сервера');

      const data = await res.json();
      setResponse(data.result);
    } catch (err) {
      setError('Не удалось получить ответ. Проверьте, запущен ли бэкенд и Ollama.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h1>🧠 Генератор идей (Ollama)</h1>
      <div className="prompt-area">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Введите запрос..."
        />
        <button onClick={handleGenerate} disabled={loading}>
          {loading ? 'Генерация...' : 'Сгенерировать идею'}
        </button>
      </div>
      <div className="result">
        {loading && <p className="loader">⏳ Загрузка...</p>}
        {error && <p className="error">{error}</p>}
        {response && <p className="generated-text">{response}</p>}
      </div>
    </div>
  );
}

export default App;
