// upload.middleware.ts
import { Request } from 'express';
import multer from 'multer';

// Define storage settings
const storage = multer.memoryStorage(); // Store files in memory temporarily

// Create file filter for images
const imageFilter = (req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedMimeTypes.includes(file.mimetype)) {
        return callback(null, false);
    }
    callback(null, true);
    };

// Configure multer
export const uploadOptions = {
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
    },
    fileFilter: imageFilter,
};

export const uploadImage = multer(uploadOptions);