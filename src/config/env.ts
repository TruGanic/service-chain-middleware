import { FabricConfig } from "../interfaces/fabric-config.interface";

function requireEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`❌ Missing required env variable: ${key}`);
    }
    return value; 
}

export const config: FabricConfig = {
    port: parseInt(process.env.PORT || '3000'),

    mspId:          requireEnv('MSP_ID'),
    channelName:    requireEnv('CHANNEL_NAME'),
    chaincodeName:  requireEnv('CHAINCODE_NAME'),
    peerEndpoint:   requireEnv('PEER_ENDPOINT'),
    peerHostAlias:  requireEnv('PEER_HOST_ALIAS'),
    cryptoPath:     requireEnv('CRYPTO_PATH'),
    keyDirPath:     requireEnv('KEY_DIR_PATH'),
    certPath:       requireEnv('CERT_PATH'),
    tlsCertPath:    requireEnv('TLS_CERT_PATH'),
};

