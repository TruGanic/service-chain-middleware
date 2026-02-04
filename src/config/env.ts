// src/config/env.ts

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
    // If process.env.PORT is set by app.ts, use it. Otherwise 3000.
    port: parseInt(process.env.PORT || '3000'),

    mspId: process.env.MSP_ID || 'FarmerMSP',
    channelName: process.env.CHANNEL_NAME || 'supplychainchannel',
    chaincodeName: process.env.CHAINCODE_NAME || 'transport',
    peerEndpoint: process.env.PEER_ENDPOINT || 'localhost:7051',
    peerHostAlias: process.env.PEER_HOST_ALIAS || 'peer0.farmer.supplychain.net',
    
    cryptoPath: process.env.CRYPTO_PATH || '',
    keyDirPath: process.env.KEY_DIR_PATH || '',
    certPath: process.env.CERT_PATH || '',
    tlsCertPath: process.env.TLS_CERT_PATH || '',
};

// Validation
// We do NOT exit here. We let app.ts handle the exit logic to avoid silent crashes.
if (!config.cryptoPath) {
    console.error("⚠️  WARNING: CRYPTO_PATH is missing. App may fail to connect.");
}