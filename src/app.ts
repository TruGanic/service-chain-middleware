import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import healthRoutes from './routes/healthRoutes';
import dotenv from 'dotenv';
import testRoutes from './routes/testRoutes';

// Load Env Config
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Register Routes
app.use('/api/health', healthRoutes);
app.use('/api/test', testRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`🛠  Environment: ${process.env.NODE_ENV || 'development'}`);
});