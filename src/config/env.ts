import dotenv from 'dotenv';
import path from 'path';

// Load variables from .env file
dotenv.config();

// Define interface for strict typing
interface FabricConfig {
    port: number;
    mspId: string;
    channelName: string;
    chaincodeName: string;
    peerEndpoint: string;
    peerHostAlias: string;
    cryptoPath: string;
    keyDirPath: string;
    certPath: string;
    tlsCertPath: string;
}

export const config: FabricConfig = {
    port: parseInt(process.env.PORT || '3000'),
    mspId: process.env.MSP_ID || 'Org1MSP',
    channelName: process.env.CHANNEL_NAME || 'service-channel',
    chaincodeName: process.env.CHAINCODE_NAME || 'transport',
    peerEndpoint: process.env.PEER_ENDPOINT || 'localhost:7051',
    peerHostAlias: process.env.PEER_HOST_ALIAS || 'peer0.org1.example.com',
    
    // Critical Paths from setup
    cryptoPath: process.env.CRYPTO_PATH || '',
    keyDirPath: process.env.KEY_DIR_PATH || '',
    certPath: process.env.CERT_PATH || '',
    tlsCertPath: process.env.TLS_CERT_PATH || ''
};

// Validation: Stop server if crypto path is missing
if (!config.cryptoPath) {
    console.error("❌ FATAL ERROR: CRYPTO_PATH is missing in .env file.");
    process.exit(1);
}