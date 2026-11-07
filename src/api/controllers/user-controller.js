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
    const {name, username, email, password, role} = body;
    if (!name || !username || !email || !password || !role) {
      res.status(400).json({error: 'Required user fields are missing'});
      return;
    }

    const result = await addUser(body);
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
  try {
    const result = await modifyUser(req.body || {}, req.params.id);
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
  try {
    const result = await removeUser(req.params.id);
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
