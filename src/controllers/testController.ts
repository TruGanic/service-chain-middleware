import { Request, Response } from 'express';
import { getContract } from '../services/fabricGateway';
import { TextDecoder } from 'util';

export const testConnection = async (req: Request, res: Response) => {
    try {
        console.log("Testing Fabric Connection...");
        
        const contract = await getContract();

        // 1. We call 'InitLedger' because your chaincode has this function.
        // It creates ORG101 and ORG102.
        console.log("Submit Transaction: InitLedger");
        await contract.submitTransaction('InitLedger');

        // 2. Now let's read one of them to prove it worked.
        console.log("Evaluate Transaction: QueryAsset ORG101");
        const resultBytes = await contract.evaluateTransaction('QueryAsset', 'ORG101');
        
        const resultString = new TextDecoder().decode(resultBytes);

        res.status(200).json({
            status: 'SUCCESS',
            message: 'Blockchain Connected & Initialized',
            data: JSON.parse(resultString)
        });

    } catch (error: any) {
        // If InitLedger ran before, it might fail with "Asset already exists", which is fine.
        console.error("Test Error:", error);
        res.status(500).json({
            status: 'ERROR',
            message: error.message
        });
    }
};