"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// 1. LOAD CONFIGURATION FIRST
// This pushes .env.transporter variables (PORT=3001) into process.env
const envFile = process.env.DOTENV_CONFIG_PATH;
dotenv_1.default.config({ path: envFile });
console.log(`✅ Environment Config Loaded from: ${envFile}`);
// 2. NOW IMPORT OTHER FILES
// Since config is loaded, these files will see PORT=3001
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const healthRoutes_1 = __importDefault(require("./routes/healthRoutes"));
const testRoutes_1 = __importDefault(require("./routes/testRoutes"));
const transportRoutes_1 = __importDefault(require("./routes/transportRoutes"));
const app = (0, express_1.default)();
// 3. ASSIGN PORT
// Reads the variable we just loaded.
const PORT = parseInt(process.env.PORT || '3000');
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/health', healthRoutes_1.default);
app.use('/api/test', testRoutes_1.default);
app.use('/api/transport', transportRoutes_1.default);
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
server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.error(`❌ FATAL ERROR: Port ${PORT} is busy! Kill the old process.`);
    }
    else {
        console.error('❌ SERVER ERROR:', e);
    }
});
