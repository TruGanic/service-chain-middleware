import { Request, Response } from 'express';
import { getContract } from '../services/fabricGateway';
import { TextDecoder } from 'util';

const utf8Decoder = new TextDecoder();

export const getBatchHistory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // The Batch ID
        
        console.log(`[📜 HISTORY] Fetching full audit trail for ${id}...`);
        
        const contract = await getContract();
        
        // We use evaluateTransaction because we are only reading historical data
        const resultBytes = await contract.evaluateTransaction('RetailerContract:GetAssetHistory', id);
        const resultJson = utf8Decoder.decode(resultBytes);

        res.status(200).json(JSON.parse(resultJson));

    } catch (error: any) {
        console.error(`[❌ ERROR] History fetch failed:`, error);
        res.status(404).json({ error: `History for asset ${req.params.id} could not be retrieved.` });
    }
};