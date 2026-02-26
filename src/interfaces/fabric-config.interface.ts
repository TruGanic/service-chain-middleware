export interface FabricConfig {
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