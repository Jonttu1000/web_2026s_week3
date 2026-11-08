import express from 'express';
import {body} from 'express-validator';
import {createThumbnail, upload} from '../../middlewares/upload.js';
import {authenticateToken} from '../../middlewares/authentication.js';
import {validationErrors} from '../../middlewares/error-handlers.js';

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
  .post(
    authenticateToken,
    upload.single('cat'),
    createThumbnail,
    [
      body('cat_name').isLength({min: 3, max: 50}),
      body('weight').isFloat({gt: 0}),
      body('birthdate').isISO8601(),
    ],
    validationErrors,
    postCat
  );

catRouter.route('/user/:id').get(getCatsByUserId);
catRouter
  .route('/:id')
  .get(getCatById)
  .put(
    authenticateToken,
    [
      body('cat_name').optional().isLength({min: 3, max: 50}),
      body('weight').optional().isFloat({gt: 0}),
      body('birthdate').optional().isISO8601(),
      body('owner').optional().isInt({gt: 0}),
    ],
    validationErrors,
    putCat
  )
  .delete(authenticateToken, deleteCat);

export default catRouter;
