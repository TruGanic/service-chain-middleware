"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = void 0;
const fabricGateway_1 = require("../services/fabricGateway");
const util_1 = require("util");
const testConnection = async (req, res) => {
    try {
        console.log("Testing Fabric Connection...");
        const contract = await (0, fabricGateway_1.getContract)();
        // 1. We call 'InitLedger' because your chaincode has this function.
        // It creates ORG101 and ORG102.
        console.log("Submit Transaction: InitLedger");
        await contract.submitTransaction('InitLedger');
        // 2. Now let's read one of them to prove it worked.
        console.log("Evaluate Transaction: QueryAsset ORG101");
        const resultBytes = await contract.evaluateTransaction('QueryAsset', 'ORG101');
        const resultString = new util_1.TextDecoder().decode(resultBytes);
        res.status(200).json({
            status: 'SUCCESS',
            message: 'Blockchain Connected & Initialized',
            data: JSON.parse(resultString)
        });
    }
    catch (error) {
        // If InitLedger ran before, it might fail with "Asset already exists", which is fine.
        console.error("Test Error:", error);
        res.status(500).json({
            status: 'ERROR',
            message: error.message
        });
    }
};
exports.testConnection = testConnection;
