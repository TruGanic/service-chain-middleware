import * as grpc from '@grpc/grpc-js';
import { connect, Contract, Identity, Signer, signers } from '@hyperledger/fabric-gateway';
import * as crypto from 'crypto';
import { promises as fs } from 'fs';
import * as path from 'path';
import { config } from '../config/env';

// Singleton variable to hold the contract connection
let contract: Contract | null = null;

export const getContract = async (): Promise<Contract> => {
    // 1. If we are already connected, return the existing contract
    if (contract) {
        return contract;
    }

    console.log('🔄 Initializing Hyperledger Fabric Connection...');

    // 2. Resolve Full Paths
    const keyDirectoryPath = path.join(config.cryptoPath, config.keyDirPath);
    const certPath = path.join(config.cryptoPath, config.certPath);
    const tlsCertPath = path.join(config.cryptoPath, config.tlsCertPath);

    

    try {
        // 3. Read The Certificate & TLS Root Cert
        const tlsRootCert = await fs.readFile(tlsCertPath);
        const cert = await fs.readFile(certPath);

        // 4. Find the Private Key (The file name is random, e.g., "priv_sk")
        const keyFiles = await fs.readdir(keyDirectoryPath);
        const keyFile = keyFiles.find((f) => f.endsWith('_sk') || f.includes('sk'));
        
        if (!keyFile) {
            throw new Error(`❌ Private Key not found in ${keyDirectoryPath}`);
        }
        
        const privateKeyPem = await fs.readFile(path.join(keyDirectoryPath, keyFile));
        const privateKey = crypto.createPrivateKey(privateKeyPem);
        const signer = signers.newPrivateKeySigner(privateKey);

        // 5. Setup gRPC Client
        const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
        const client = new grpc.Client(config.peerEndpoint, tlsCredentials, {
            'grpc.ssl_target_name_override': config.peerHostAlias,
        });

        // 6. Connect the Gateway
        const gateway = connect({
            client,
            identity: { mspId: config.mspId, credentials: cert },
            signer,
            // Timeouts to prevent hanging requests
            evaluateOptions: () => ({ deadline: Date.now() + 15000 }), // 15s for reads
            submitOptions: () => ({ deadline: Date.now() + 15000 }),   // 15s for writes
        });

        // 7. Get Network & Contract
        const network = gateway.getNetwork(config.channelName);
        contract = network.getContract(config.chaincodeName);

        console.log('✅ Connected to Fabric Network & Chaincode');
        return contract;

    } catch (error) {
        console.error('❌ Failed to connect to Fabric:', error);
        throw error;
    }
};