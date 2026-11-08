import express from 'express';
import {body} from 'express-validator';
import {authenticateToken} from '../../middlewares/authentication.js';
import {validationErrors} from '../../middlewares/error-handlers.js';

import {
  getUser,
  getUserById,
  postUser,
  putUser,
  deleteUser,
} from '../controllers/user-controller.js';

const userRouter = express.Router();

const userFields = [
  body('name').isLength({min: 2, max: 100}),
  body('username').isAlphanumeric().isLength({min: 3, max: 20}),
  body('email').isEmail(),
  body('password').isLength({min: 8}),
];

userRouter
  .route('/')
  .get(getUser)
  .post(userFields, validationErrors, postUser);

userRouter
  .route('/:id')
  .get(getUserById)
  .put(
    authenticateToken,
    [
      body('name').optional().isLength({min: 2, max: 100}),
      body('username').optional().isAlphanumeric().isLength({min: 3, max: 20}),
      body('email').optional().isEmail(),
      body('password').optional().isLength({min: 8}),
      body('role').optional().isIn(['user', 'admin']),
    ],
    validationErrors,
    putUser
  )
  .delete(authenticateToken, deleteUser);

export default userRouter;
