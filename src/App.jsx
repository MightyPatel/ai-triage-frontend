
import { useState } from 'react';
import './App.css';
import ClinicMap from './ClinicMap';

function App() {
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    conditions: '',
    medications: '',
    location: '',
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
        <input name="name" placeholder="Full Name" onChange={handleChange} required />
        <input name="age" type="number" placeholder="Age" onChange={handleChange} required />
        <select name="gender" onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input name="conditions" placeholder="Existing Conditions" onChange={handleChange} />
        <input name="medications" placeholder="Current Medications" onChange={handleChange} />
        <input name="location" placeholder="Postal Code or City" onChange={handleChange} required />
        <input name="symptom" placeholder="Main Symptom" onChange={handleChange} required />
        <input name="duration" placeholder="Duration (e.g. 2 days)" onChange={handleChange} required />
        <input name="severity" placeholder="Severity (e.g. mild, severe)" onChange={handleChange} required />
        <input name="extras" placeholder="Other Symptoms" onChange={handleChange} />
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
              {result.specialist && <p><strong>Specialist:</strong> {result.specialist}</p>}
              {result.nearby && result.nearby.length > 0 && (
                <>
                  <h4>Nearby Clinics:</h4>
                  <ul>
                    {result.nearby.map((clinic, index) => (
                      <li key={index}>
                        {clinic.name} - {clinic.address}
                      </li>
                    ))}
                  </ul>
                  <ClinicMap clinics={result.nearby} />
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
