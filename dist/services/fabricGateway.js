"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContract = void 0;
const grpc = __importStar(require("@grpc/grpc-js"));
const fabric_gateway_1 = require("@hyperledger/fabric-gateway");
const crypto = __importStar(require("crypto"));
const fs_1 = require("fs");
const path = __importStar(require("path"));
const env_1 = require("../config/env");
// Singleton variable to hold the contract connection
let contract = null;
const getContract = async () => {
    // 1. If we are already connected, return the existing contract
    if (contract) {
        return contract;
    }
    console.log('🔄 Initializing Hyperledger Fabric Connection...');
    // 2. Resolve Full Paths
    const keyDirectoryPath = path.join(env_1.config.cryptoPath, env_1.config.keyDirPath);
    const certPath = path.join(env_1.config.cryptoPath, env_1.config.certPath);
    const tlsCertPath = path.join(env_1.config.cryptoPath, env_1.config.tlsCertPath);
    try {
        // 3. Read The Certificate & TLS Root Cert
        const tlsRootCert = await fs_1.promises.readFile(tlsCertPath);
        const cert = await fs_1.promises.readFile(certPath);
        // 4. Find the Private Key (The file name is random, e.g., "priv_sk")
        const keyFiles = await fs_1.promises.readdir(keyDirectoryPath);
        const keyFile = keyFiles.find((f) => f.endsWith('_sk') || f.includes('sk'));
        if (!keyFile) {
            throw new Error(`❌ Private Key not found in ${keyDirectoryPath}`);
        }
        const privateKeyPem = await fs_1.promises.readFile(path.join(keyDirectoryPath, keyFile));
        const privateKey = crypto.createPrivateKey(privateKeyPem);
        const signer = fabric_gateway_1.signers.newPrivateKeySigner(privateKey);
        // 5. Setup gRPC Client
        const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
        const client = new grpc.Client(env_1.config.peerEndpoint, tlsCredentials, {
            'grpc.ssl_target_name_override': env_1.config.peerHostAlias,
        });
        // 6. Connect the Gateway
        const gateway = (0, fabric_gateway_1.connect)({
            client,
            identity: { mspId: env_1.config.mspId, credentials: cert },
            signer,
            // Timeouts to prevent hanging requests
            evaluateOptions: () => ({ deadline: Date.now() + 15000 }), // 15s for reads
            submitOptions: () => ({ deadline: Date.now() + 15000 }), // 15s for writes
        });
        // 7. Get Network & Contract
        const network = gateway.getNetwork(env_1.config.channelName);
        contract = network.getContract(env_1.config.chaincodeName);
        console.log('✅ Connected to Fabric Network & Chaincode');
        return contract;
    }
    catch (error) {
        console.error('❌ Failed to connect to Fabric:', error);
        throw error;
    }
};
exports.getContract = getContract;
