import { Request, Response } from 'express';
import { getContract } from '../services/fabricGateway';
import { IHarvestRecordRequest } from '../interfaces/harvest-record.interface';

/**
 * Handles the creation of the initial harvest record by the Farmer Org.
 * This is the first entry in the blockchain history for a batch.
 */
export const createHarvestRecord = async (req: Request, res: Response) => {
    try {
        // 1. Extract and cast body to our interface
        const { 
            batchId, 
            farmerId, 
            organicLevel, 
            plantedDate, 
            harvestedDate 
        } = req.body as IHarvestRecordRequest;

        // 2. Simple validation
        if (!batchId || !farmerId || !organicLevel || !plantedDate || !harvestedDate) {
            return res.status(400).json({ 
                success: false, 
                error: 'Missing required fields: batchId, farmerId, organicLevel, plantedDate, and harvestedDate are all mandatory.' 
            });
        }

        console.log(`[🌾 FARMER] Recording harvest for Batch: ${batchId}`);

        // 3. Get the contract instance from the Gateway service
        const contract = await getContract();

        // 4. Submit Transaction to the FarmerContract namespace
        // Note: All arguments must be strings for Fabric submitTransaction
        await contract.submitTransaction(
            'FarmerContract:CreateHarvestRecord',
            batchId,
            farmerId,
            organicLevel,
            plantedDate,
            harvestedDate
        );

        console.log(`[✅ SUCCESS] Harvest record committed to ledger for ${batchId}`);

        // 5. Respond to frontend
        return res.status(201).json({
            success: true,
            message: 'Harvest record successfully created on the blockchain.',
            batchId
        });

    } catch (error: any) {
        console.error(`[❌ ERROR] Farmer Contract Invocation Failed:`, error);
        
        // Handle specific Fabric errors (like "already exists")
        const statusCode = error.message.includes('already exists') ? 409 : 500;
        
        return res.status(statusCode).json({
            success: false,
            error: error.message || 'Internal Server Error during blockchain transaction.'
        });
    }
};