import { useState } from 'react';
import './App.css';

function App() {
  const [form, setForm] = useState({
    symptom: '',
    duration: '',
    severity: '',
    extras: ''
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('https://ai-triage-backend.onrender.com/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: 'Failed to get a response' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>AI Triage Assistant</h1>
      <form onSubmit={handleSubmit}>
        <input name="symptom" placeholder="Main symptom" onChange={handleChange} required />
        <input name="duration" placeholder="Duration (e.g. 2 days)" onChange={handleChange} required />
        <input name="severity" placeholder="Severity (e.g. mild, severe)" onChange={handleChange} required />
        <input name="extras" placeholder="Other symptoms" onChange={handleChange} />
        <button type="submit" disabled={loading}>
          {loading ? 'Analyzing...' : 'Submit'}
        </button>
      </form>

      {result && (
        <div className="result">
          <h3>AI Suggestion</h3>
          {result.error ? (
            <p>Error: {result.error}</p>
          ) : (
            <>
              <p><strong>Urgency:</strong> {result.urgency}</p>
              <p><strong>Doctor Type:</strong> {result.doctor_type}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
