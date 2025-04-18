import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { chatRouter } from './routes/chat';
import { tradeRouter } from './routes/trade';
import planetRoutes from './routes/planetRoutes';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Configure CORS
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/chat', chatRouter);
app.use('/api/trade', tradeRouter);
app.use('/api/planets', planetRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 