import { Request, Response } from 'express';
import { getContract } from '../services/fabricGateway';
import { uploadToIPFS } from '../services/ipfsService';
import { TextDecoder } from 'util';

const utf8Decoder = new TextDecoder();

// =========================================================================
// 1. Confirm Pickup (Start of Journey)
// =========================================================================
export const confirmPickup = async (req: Request, res: Response) => {
    try {
        // 1. Authenticate user
        const transporterId = req.user?.sub;
        if (!transporterId) {
            return res.status(401).json({ error: 'Unauthorized: No Supabase ID found' });
        }

        // 2. Extract text fields (Note: when using multipart/form-data, numbers might come through as strings)
        const { produceType, supplierId, farmerName, pickupLocation, weightKg, notes } = req.body;

        if (!produceType || !supplierId || !farmerName || !pickupLocation || !weightKg) {
            return res.status(400).json({ error: 'Missing required fields in payload' });
        }

        // 3. Handle the optional file upload to IPFS
        let invoiceHash = "NONE";
        if (req.file) {
            console.log(`[📦 IPFS] Uploading invoice for new pickup...`);
            invoiceHash = await uploadToIPFS(req.file.buffer, req.file.originalname);
        }

        // 4. Generate unique Batch ID
        const batchID = `BATCH-${Date.now()}`;
        console.log(`[🚚 PICKUP] Submitting transaction ${batchID} to ledger...`);

        const contract = await getContract();

        // 5. Submit to Hyperledger Fabric
        await contract.submitTransaction(
            'ConfirmPickup',
            batchID,
            produceType,
            farmerName,
            supplierId,
            transporterId,
            pickupLocation,
            weightKg,
            invoiceHash,
            notes || "NONE"
        );

        console.log(`[✅ SUCCESS] Pickup confirmed for ${batchID}`);

        res.status(200).json({
            success: true,
            message: 'Pickup confirmed and recorded on-chain.',
            batchID,
            invoiceIpfs: invoiceHash !== "NONE" ? invoiceHash : null
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

        // Parse the raw blockchain data
        const batchData = JSON.parse(resultJson);

        // Safely attach the Pinata URL
        if (batchData.invoiceHash && batchData.invoiceHash !== "NONE") {
          
            const gateway = process.env.PINATA_GATEWAY_URL 
            batchData.invoiceUrl = `${gateway}/ipfs/${batchData.invoiceHash}`;
        } else {
            batchData.invoiceUrl = null;
        }

        // Send the modified object
        res.status(200).json(batchData);

    } catch (error: any) {
        // Log the actual JavaScript/Blockchain error to your Node console
        console.error(`[❌ ERROR] Query failed:`, error);
        
        // Check if it's specifically a Fabric error stating the asset is missing
        if (error.message && error.message.includes('does not exist')) {
            return res.status(404).json({ error: `Asset ${req.params.id} not found.` });
        }
        
        // If it's a JavaScript error (like a typo), return a 500 error instead
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};