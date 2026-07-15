import express, { Express } from 'express';
import dotenv from 'dotenv';
import reconciliationRouter from './routes/reconciliationRoutes';
import { globalErrorHandler } from './utils/errorHandler';

// Load environmental variables
dotenv.config();

const app: Express = express();

// Standard Express Middlewares
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Health Check API Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Servidor de Conciliação Naval está online.',
    timestamp: new Date().toISOString()
  });
});

// Mounting Main API Routes
app.use('/api', reconciliationRouter);

// Global Error Handling Middleware
app.use(globalErrorHandler);

export default app;
