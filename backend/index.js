// pnpm install express body-parser cookie-parser cors csrf resend dotenv
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import csrf from 'csurf';
import { Resend } from 'resend';

const app = express();
const port = process.env.PORT || 3000;

// Inicializar Resend con la clave API
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware para parsear JSON y cookies
app.use(bodyParser.json());
app.use(cookieParser()); // Requerido para la protección CSRF

// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend's URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization', 'csrf-token'],
  credentials: true // Allow credentials (cookies) to be sent in CORS requests
}));

// CSRF protection
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS in production
    sameSite: 'strict', // Adjust as needed
  }
});
app.use(csrfProtection);

// Endpoint simple para probar la integración
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Test endpoint is working!' });
});

// Endpoint para proporcionar el token CSRF al frontend
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Endpoint para enviar un correo
app.post('/api/send-email', async (req, res) => {
  const { to, subject, html } = req.body;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ["luizarnoldch@gmail.com"],
      subject: "Example Resend",
      html: "Example HTMML",
      // from: 'Acme <onboarding@resend.dev>',
      // to: [to],
      // subject: subject,
      // html: html,
    });

    if (error) {
      return res.status(500).json({ message: 'Failed to send email', error });
    }

    res.status(200).json({ message: 'Email sent successfully', data });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
