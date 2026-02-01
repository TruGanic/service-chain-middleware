"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
// Load variables from .env file
dotenv_1.default.config({ path: process.env.DOTENV_CONFIG_PATH || '.env' });
exports.config = {
    port: parseInt(process.env.PORT || '3000'),
    // Updated Defaults for the Supply Chain Network
    mspId: process.env.MSP_ID || 'FarmerMSP',
    channelName: process.env.CHANNEL_NAME || 'supplychainchannel',
    chaincodeName: process.env.CHAINCODE_NAME || 'transport',
    peerEndpoint: process.env.PEER_ENDPOINT || 'localhost:7051',
    peerHostAlias: process.env.PEER_HOST_ALIAS || 'peer0.farmer.supplychain.net',
    // Critical Paths
    cryptoPath: process.env.CRYPTO_PATH || '',
    keyDirPath: process.env.KEY_DIR_PATH || '',
    certPath: process.env.CERT_PATH || '',
    tlsCertPath: process.env.TLS_CERT_PATH || ''
};
// Validation: Stop server if critical configuration is missing
if (!exports.config.cryptoPath || !exports.config.keyDirPath || !exports.config.certPath) {
    console.error("❌ FATAL ERROR: Crypto paths are missing in .env file.");
    console.error("Please check CRYPTO_PATH, KEY_DIR_PATH, and CERT_PATH.");
    process.exit(1);
}
