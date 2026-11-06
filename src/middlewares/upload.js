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

const upload = multer({storage});

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

  const parsedPath = path.parse(req.file.path);
  const thumbnailPath = path.join(
    parsedPath.dir,
    `${parsedPath.name}_thumb.png`
  );

  await sharp(req.file.path)
    .resize(160, 160, {fit: 'cover'})
    .png()
    .toFile(thumbnailPath);

  next();
};

export {createThumbnail, upload};
