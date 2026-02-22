import multer from 'multer';

// Use memory storage so we don't write files to the server's disk
const storage = multer.memoryStorage();

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB limit
    },
});