"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const healthRoutes_1 = __importDefault(require("./routes/healthRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const testRoutes_1 = __importDefault(require("./routes/testRoutes"));
const transportRoutes_1 = __importDefault(require("./routes/transportRoutes"));
// Load Env Config
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Register Routes
app.use('/api/health', healthRoutes_1.default);
app.use('/api/test', testRoutes_1.default);
app.use('/api/transport', transportRoutes_1.default);
// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`🛠  Environment: ${process.env.NODE_ENV || 'development'}`);
});
