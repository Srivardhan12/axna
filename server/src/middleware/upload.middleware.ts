import multer from "multer";

// Store file in memory (you can also set destination to save on disk)
const storage = multer.memoryStorage();

export const upload = multer({
    storage,
    limits: {
        fileSize: Number(process.env.MAX_UPLOAD_SIZE) || 5 * 1024 * 1024
    }
});
