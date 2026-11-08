import bcrypt from 'bcrypt';

import {
  listAllUsers,
  findUserById,
  addUser,
  modifyUser,
  removeUser,
} from '../models/user-model.js';

const getUser = async (req, res, next) => {
  try {
    res.json(await listAllUsers());
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await findUserById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      const error = new Error('User not found');
      error.status = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

const postUser = async (req, res, next) => {
  try {
    const result = await addUser({
      ...req.body,
      password: await bcrypt.hash(req.body.password, 10),
      role: 'user',
    });

    res.status(201).json({
      message: 'New user added.',
      result,
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      error.status = 409;
      error.message = 'Username is already in use';
      next(error);
      return;
    }
    next(error);
  }
};

const putUser = async (req, res, next) => {
  const currentUser = res.locals.user;
  const userId = Number(req.params.id);

  if (currentUser.role !== 'admin' && currentUser.user_id !== userId) {
    const error = new Error('Forbidden');
    error.status = 403;
    next(error);
    return;
  }

  try {
    const updateData = {...(req.body || {})};
    if (currentUser.role !== 'admin') {
      delete updateData.role;
    }
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const result = await modifyUser(updateData, userId);
    if (result === false) {
      const error = new Error('User not found');
      error.status = 404;
      next(error);
    } else if (result === null) {
      const error = new Error('No valid user fields provided');
      error.status = 400;
      next(error);
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      error.status = 409;
      error.message = 'Username is already in use';
      next(error);
      return;
    }
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  const currentUser = res.locals.user;
  const userId = Number(req.params.id);

  if (currentUser.role !== 'admin' && currentUser.user_id !== userId) {
    const error = new Error('Forbidden');
    error.status = 403;
    next(error);
    return;
  }

  try {
    const result = await removeUser(userId);
    if (result) {
      res.status(200).json(result);
    } else {
      const error = new Error('User not found');
      error.status = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

export {getUser, getUserById, postUser, putUser, deleteUser};
