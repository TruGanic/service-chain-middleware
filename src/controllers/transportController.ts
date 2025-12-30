import { Request, Response } from 'express';
import { getContract } from '../services/fabricGateway';
import { TextDecoder } from 'util';

const utf8Decoder = new TextDecoder();

// =========================================================================
// 1. Confirm Pickup (Start of Journey)
// =========================================================================
export const confirmPickup = async (req: Request, res: Response) => {
    try {
        // Extract data from the Mobile App's JSON payload
        const { batchID, farmerName, newOwner, location } = req.body;

        // Validation
        if (!batchID || !farmerName || !newOwner || !location) {
            return res.status(400).json({ error: 'Missing required fields: batchID, farmerName, newOwner, location' });
        }

        console.log(`[🚚 PICKUP] Submitting transaction for ${batchID}...`);

        // Get Fabric Contract
        const contract = await getContract();

        // Submit to Blockchain
        await contract.submitTransaction(
            'ConfirmPickup',
            batchID,
            farmerName,
            newOwner,
            location
        );

        console.log(`[✅ SUCCESS] Pickup confirmed for ${batchID}`);

        res.status(200).json({
            success: true,
            message: 'Pickup confirmed. Status updated to IN_TRANSIT.',
            batchID
        });

    } catch (error: any) {
        console.error(`[❌ ERROR] Pickup failed:`, error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// =========================================================================
// 2. Complete Trip (The Novelty Sync)
// =========================================================================
export const completeTrip = async (req: Request, res: Response) => {
    try {
        const { batchID, min, max, avg, merkleRoot } = req.body;

        if (!batchID || !merkleRoot) {
            return res.status(400).json({ error: 'Missing batchID or merkleRoot' });
        }

        console.log(`[🏁 COMPLETE] Syncing offline data for ${batchID}...`);

        const contract = await getContract();

        // Note: We must convert numbers to strings for Fabric
        await contract.submitTransaction(
            'CompleteTrip',
            batchID,
            String(min),
            String(max),
            String(avg),
            merkleRoot
        );

        console.log(`[✅ SUCCESS] Trip synced. Merkle Root locked: ${merkleRoot}`);

        res.status(200).json({
            success: true,
            message: 'Trip completed. Data integrity verified.',
            batchID
        });

    } catch (error: any) {
        console.error(`[❌ ERROR] Trip Sync failed:`, error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// =========================================================================
// 3. Read Batch (Query)
// =========================================================================
export const getBatch = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        console.log(`[🔍 QUERY] Reading asset ${id}...`);
        
        const contract = await getContract();
        
        // EvaluateTransaction is for READING (Fast, no consensus needed)
        const resultBytes = await contract.evaluateTransaction('ReadAsset', id);
        const resultJson = utf8Decoder.decode(resultBytes);

        res.status(200).json(JSON.parse(resultJson));

    } catch (error: any) {
        console.error(`[❌ ERROR] Query failed:`, error);
        res.status(404).json({ error: `Asset ${req.params.id} not found.` });
    }
};