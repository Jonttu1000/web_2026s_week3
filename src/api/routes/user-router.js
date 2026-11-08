import express from 'express';
import {authenticateToken} from '../../middlewares/authentication.js';

import {
  getUser,
  getUserById,
  postUser,
  putUser,
  deleteUser,
} from '../controllers/user-controller.js';

const userRouter = express.Router();

userRouter.route('/').get(getUser).post(postUser);

userRouter.route('/:id').get(getUserById).put(authenticateToken, putUser).delete(authenticateToken, deleteUser);

export default userRouter;

