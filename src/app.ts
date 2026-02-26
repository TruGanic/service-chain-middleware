import dotenv from 'dotenv';


const envFile = process.env.DOTENV_CONFIG_PATH;
dotenv.config({ path: envFile });

console.log(`✅ Environment Config Loaded from: ${envFile}`);


import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import healthRoutes from './routes/healthRoutes';
import testRoutes from './routes/testRoutes';
import transportRoutes from './routes/transportRoutes';
import retailerRoutes from './routes/retailerRoutes';

const app = express();

// Reads the variable just loaded.
const PORT = parseInt(process.env.PORT || '3000');

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/test', testRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/retailer', retailerRoutes);

// 4. START SERVER
const server = app.listen(PORT, () => {
    console.log(`===========================================================`);
    console.log(`🚀 ${process.env.MSP_ID || 'App'} is running on PORT ${PORT}`);
    console.log(`🛠  Source File: ${envFile}`);
    console.log(`===========================================================`);
});

// Heartbeat
setInterval(() => { }, 1000 * 60 * 60);

// Error Handling
server.on('error', (e: any) => {
    if (e.code === 'EADDRINUSE') {
        console.error(`❌ FATAL ERROR: Port ${PORT} is busy! Kill the old process.`);
    } else {
        console.error('❌ SERVER ERROR:', e);
    }
});