/* global process*/

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import 'dotenv/config';

import {findUserByUsername} from '../models/user-model.js';

const postLogin = async (req, res, next) => {
  try {
    const {username, password} = req.body || {};

    if (!username || !password) {
      const error = new Error('Username and password required');
      error.status = 400;
      return next(error);
    }

    const user = await findUserByUsername(username);

    if (!user) {
      const error = new Error('Invalid username or password');
      error.status = 401;
      return next(error);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      const error = new Error('Invalid username or password');
      error.status = 401;
      return next(error);
    }

    // Create user object without password
    const userWithNoPassword = {
      user_id: user.user_id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    // Generate JWT token
    const token = jwt.sign(
      userWithNoPassword,
      process.env.JWT_SECRET,
      {expiresIn: '24h'}
    );

    res.json({
      user: userWithNoPassword,
      token,
    });
  } catch (error) {
    next(error);
  }
};

const getMe = (req, res, next) => {
  if (res.locals.user) {
    res.json({
      message: 'token ok',
      user: res.locals.user,
    });
  } else {
    const error = new Error('Unauthenticated');
    error.status = 401;
    next(error);
  }
};

export {postLogin, getMe};
