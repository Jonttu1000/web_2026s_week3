import sharp from 'sharp';
import multer from 'multer';
import path from 'node:path';
import {randomUUID} from 'node:crypto';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    cb(null, `${randomUUID()}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: {fileSize: 10 * 1024 * 1024},
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith('image/') ||
      file.mimetype.startsWith('video/')
    ) {
      cb(null, true);
      return;
    } else {
      const error = new Error('Only image and video files are allowed');
      error.status = 400;
      cb(error);
    }
  },
});

/**
 * Creates a thumbnail for the uploaded image.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */

const createThumbnail = async (req, res, next) => {
  if (!req.file) {
    next();
    return;
  }

  if (req.file.mimetype.startsWith('video/')) {
    next();
    return;
  }

  const parsedPath = path.parse(req.file.path);
  const thumbnailPath = path.join(
    parsedPath.dir,
    `${parsedPath.name}_thumb.png`
  );

  try {
    await sharp(req.file.path)
      .resize(160, 160, {fit: 'cover'})
      .png()
      .toFile(thumbnailPath);
    next();
  } catch (error) {
    next(error);
  }
};

export {createThumbnail, upload};
