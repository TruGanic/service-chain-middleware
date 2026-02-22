import axios from 'axios';
import FormData from 'form-data';

/**
 * Uploads a file buffer directly to IPFS via Pinata.
 * Returns the IPFS CID (Hash).
 */
export const uploadToIPFS = async (fileBuffer: Buffer, fileName: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', fileBuffer, { filename: fileName });

    try {
        const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            headers: {
                'Authorization': `Bearer ${process.env.PINATA_JWT}`,
                ...formData.getHeaders() // Required for multipart/form-data with axios in Node
            }
        });

        console.log(`[📦 IPFS] File pinned successfully. CID: ${response.data.IpfsHash}`);
        return response.data.IpfsHash;

    } catch (error: any) {
        console.error('[❌ IPFS ERROR]', error.response?.data || error.message);
        throw new Error('Failed to pin file to IPFS');
    }
};