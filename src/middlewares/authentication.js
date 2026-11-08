/* global process */

import jwt from 'jsonwebtoken';
import 'dotenv/config';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.sendStatus(401);
    return;
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    res.sendStatus(401);
    return;
  }

  try {
    res.locals.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({message: 'Invalid or expired token'});
  }
};

export {authenticateToken};
