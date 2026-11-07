import express from 'express';
import {createThumbnail, upload} from '../../middlewares/upload.js';

import {
  getCat,
  getCatById,
  postCat,
  putCat,
  deleteCat,
  getCatsByUserId,
} from '../controllers/cat-controller.js';

const catRouter = express.Router();

catRouter
  .route('/')
  .get(getCat)
  .post(upload.single('cat'), createThumbnail, postCat);

catRouter.route('/user/:id').get(getCatsByUserId);
catRouter.route('/:id').get(getCatById).put(putCat).delete(deleteCat);

export default catRouter;
