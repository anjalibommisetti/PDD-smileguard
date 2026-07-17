import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());
app.use(cors());

// Parse incoming request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic Health Check Route
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'PDD SmileGuard Backend API is running securely.'
  });
});

// Start the server
app.listen(port, () => {
  console.log(`[server]: Secure backend server is running on http://localhost:${port}`);
});
