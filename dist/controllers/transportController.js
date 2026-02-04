"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBatch = exports.completeTrip = exports.confirmPickup = void 0;
const fabricGateway_1 = require("../services/fabricGateway");
const util_1 = require("util");
const utf8Decoder = new util_1.TextDecoder();
// =========================================================================
// 1. Confirm Pickup (Start of Journey)
// =========================================================================
const confirmPickup = async (req, res) => {
    try {
        // Extract data from the Mobile App's JSON payload
        const { batchID, farmerName, newOwner, location } = req.body;
        // Validation
        if (!batchID || !farmerName || !newOwner || !location) {
            return res.status(400).json({ error: 'Missing required fields: batchID, farmerName, newOwner, location' });
        }
        console.log(`[🚚 PICKUP] Submitting transaction for ${batchID}...`);
        // Get Fabric Contract
        const contract = await (0, fabricGateway_1.getContract)();
        // Submit to Blockchain
        await contract.submitTransaction('ConfirmPickup', batchID, farmerName, newOwner, location);
        console.log(`[✅ SUCCESS] Pickup confirmed for ${batchID}`);
        res.status(200).json({
            success: true,
            message: 'Pickup confirmed. Status updated to IN_TRANSIT.',
            batchID
        });
    }
    catch (error) {
        console.error(`[❌ ERROR] Pickup failed:`, error);
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.confirmPickup = confirmPickup;
// =========================================================================
// 2. Complete Trip (The Novelty Sync)
// =========================================================================
const completeTrip = async (req, res) => {
    try {
        const { batchID, min, max, avg, merkleRoot } = req.body;
        if (!batchID || !merkleRoot) {
            return res.status(400).json({ error: 'Missing batchID or merkleRoot' });
        }
        console.log(`[🏁 COMPLETE] Syncing offline data for ${batchID}...`);
        const contract = await (0, fabricGateway_1.getContract)();
        // Note: We must convert numbers to strings for Fabric
        await contract.submitTransaction('CompleteTrip', batchID, String(min), String(max), String(avg), merkleRoot);
        console.log(`[✅ SUCCESS] Trip synced. Merkle Root locked: ${merkleRoot}`);
        res.status(200).json({
            success: true,
            message: 'Trip completed. Data integrity verified.',
            batchID
        });
    }
    catch (error) {
        console.error(`[❌ ERROR] Trip Sync failed:`, error);
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.completeTrip = completeTrip;
// =========================================================================
// 3. Read Batch (Query)
// =========================================================================
const getBatch = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`[🔍 QUERY] Reading asset ${id}...`);
        const contract = await (0, fabricGateway_1.getContract)();
        // EvaluateTransaction is for READING (Fast, no consensus needed)
        const resultBytes = await contract.evaluateTransaction('ReadAsset', id);
        const resultJson = utf8Decoder.decode(resultBytes);
        res.status(200).json(JSON.parse(resultJson));
    }
    catch (error) {
        console.error(`[❌ ERROR] Query failed:`, error);
        res.status(404).json({ error: `Asset ${req.params.id} not found.` });
    }
};
exports.getBatch = getBatch;
