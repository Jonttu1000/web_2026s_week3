import express from 'express';
import multer from 'multer';
import path from 'node:path';
import {randomUUID} from 'node:crypto';

import {
  getCat,
  getCatById,
  postCat,
  putCat,
  deleteCat,
} from '../controllers/cat-controller.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    cb(null, `${randomUUID()}${extension}`);
  },
});

const catRouter = express.Router();

const upload = multer({storage});

catRouter.route('/').get(getCat).post(upload.single('cat'), postCat);

catRouter.route('/:id').get(getCatById).put(putCat).delete(deleteCat);

export default catRouter;
