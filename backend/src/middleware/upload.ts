import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { AppError } from '../utils/errors';

declare global {
  namespace Express {
    interface Request {
      fileValidationError?: string;
    }
  }
}

// Define storage settings
const storage = multer.memoryStorage();

// Create file filter for images
const imageFilter = (req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedMimeTypes.includes(file.mimetype)) {
        req.fileValidationError = `File type not allowed. Accepted types: ${allowedMimeTypes.join(', ')}`;
        return callback(null, false);
    }
    
    callback(null, true);
};

export const uploadOptions = {
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
    },
    fileFilter: imageFilter,
};

export const uploadImage = multer(uploadOptions);

// Error handling middleware for multer
export const handleMulterError = (req: Request, res: Response, next: NextFunction) => {
    if (req.fileValidationError) {
        return next(new AppError(req.fileValidationError, 400));
    }
    
    if (req.headers['content-type']?.includes('multipart/form-data') && 
        req.body.name &&
        !req.file) {
        return next(new AppError('File upload failed. The file may be too large (max: 5MB).', 400));
    }
    
    next();
};