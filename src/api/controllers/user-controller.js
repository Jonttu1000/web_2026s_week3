import bcrypt from 'bcrypt';

import {
  listAllUsers,
  findUserById,
  addUser,
  modifyUser,
  removeUser,
} from '../models/user-model.js';

const getUser = async (req, res) => {
  try {
    res.json(await listAllUsers());
  } catch {
    res.status(500).json({error: 'Failed to fetch users'});
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await findUserById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({error: 'User not found'});
    }
  } catch {
    res.status(500).json({error: 'Failed to fetch user'});
  }
};

const postUser = async (req, res) => {
  try {
    const body = req.body || {};
    const {name, username, email, password} = body;
    if (!name || !username || !email || !password) {
      res.status(400).json({error: 'Required user fields are missing'});
      return;
    }

    const result = await addUser({
      ...body,
      password: await bcrypt.hash(password, 10),
      role: 'user',
    });

    res.status(201).json({
      message: 'New user added.',
      result,
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({error: 'Username is already in use'});
      return;
    }
    res.status(500).json({error: 'Failed to add user'});
  }
};

const putUser = async (req, res) => {
  const currentUser = res.locals.user;
  const userId = Number(req.params.id);

  if (currentUser.role !== 'admin' && currentUser.user_id !== userId) {
    res.sendStatus(403);
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
      res.status(404).json({error: 'User not found'});
    } else if (result === null) {
      res.status(400).json({error: 'No valid user fields provided'});
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({error: 'Username is already in use'});
      return;
    }
    res.status(500).json({error: 'Failed to update user'});
  }
};

const deleteUser = async (req, res) => {
  const currentUser = res.locals.user;
  const userId = Number(req.params.id);

  if (currentUser.role !== 'admin' && currentUser.user_id !== userId) {
    res.sendStatus(403);
    return;
  }

  try {
    const result = await removeUser(userId);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({error: 'User not found'});
    }
  } catch {
    res.status(500).json({error: 'Failed to remove user'});
  }
};

export {getUser, getUserById, postUser, putUser, deleteUser};
