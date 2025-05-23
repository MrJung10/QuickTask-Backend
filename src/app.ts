import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import router from './routes/route.js';
import corsOptions from './config/cors.js';
import { errorHandler } from './app/http/middlewares/error.middleware.js';

dotenv.config();

const app = express();

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());

// Rate limiter
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// Routes
app.use('/api', router);

// Global Error handler
app.use(errorHandler);

export default app;
