import express from 'express';
import {body} from 'express-validator';
import {validationErrors} from '../../middlewares/error-handlers.js';

import {
  postLogin,
  getMe,
} from '../controllers/auth-controller.js';

import {authenticateToken} from '../../middlewares/authentication.js';

const authRouter = express.Router();

authRouter
  .route('/login')
  .post(
    body('username').notEmpty(),
    body('password').notEmpty(),
    validationErrors,
    postLogin
  );

authRouter.route('/me').get(authenticateToken, getMe);

export default authRouter;
