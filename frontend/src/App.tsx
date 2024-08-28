import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

function App() {
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [emailData, setEmailData] = useState<EmailData>({ to: '', subject: '', html: '' });
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [testMessage, setTestMessage] = useState<string>('');

  const API_BASE_URL = import.meta.env.VITE_BACKEND_API || 'http://localhost:3000';

  console.log("API_BASE_URL", API_BASE_URL)

  useEffect(() => {
    // Obtener el token CSRF
    axios.get(`${API_BASE_URL}/api/csrf-token`, { withCredentials: true })
      .then(response => {
        setCsrfToken(response.data.csrfToken);
      })
      .catch(error => {
        console.error('Error fetching CSRF token:', error);
      });

    // Obtener el mensaje del endpoint de prueba
    axios.get(`${API_BASE_URL}/`, { withCredentials: true })
      .then(response => {
        setTestMessage(response.data.message);
      })
      .catch(error => {
        console.error('Error fetching test message:', error);
      });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmailData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}/api/send-email`, emailData, {
        headers: {
          'csrf-token': csrfToken,
        },
        withCredentials: true,
      });
      console.log(response)
      setStatusMessage('Email sent successfully!');
    } catch (error) {
      setStatusMessage('Failed to send email.');
      console.error('Error sending email:', error);
    }
  };

  return (
    <div className="app-container">
      <h1>Send Email</h1>
      <p>CSRF Token: {csrfToken}</p>
      <p>Test Message: {testMessage}</p>
      <form onSubmit={handleSubmit}>
        <label>
          To:
          <input
            type="email"
            name="to"
            value={emailData.to}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />
        <label>
          Subject:
          <input
            type="text"
            name="subject"
            value={emailData.subject}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />
        <label>
          HTML Content:
          <textarea
            name="html"
            value={emailData.html}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />
        <button type="submit">Send Email</button>
      </form>
      {statusMessage && <p>{statusMessage}</p>}
    </div>
  );
}

export default App;
