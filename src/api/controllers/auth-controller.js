/* global process*/

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import 'dotenv/config';

import {findUserByUsername} from '../models/user-model.js';

const postLogin = async (req, res) => {
  try {
    const {username, password} = req.body || {};

    if (!username || !password) {
      return res.status(400).json({error: 'Username and password required'});
    }

    const user = await findUserByUsername(username);

    if (!user) {
      return res.sendStatus(401);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.sendStatus(401);
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
  } catch {
    res.sendStatus(500);
  }
};

const getMe = (req, res) => {
  if (res.locals.user) {
    res.json({
      message: 'token ok',
      user: res.locals.user,
    });
  } else {
    res.sendStatus(401);
  }
};

export {postLogin, getMe};
