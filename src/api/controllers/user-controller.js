import {listAllUsers, findUserById, addUser} from '../models/user-model.js';

const getUser = (req, res) => {
  res.json(listAllUsers());
};

const getUserById = (req, res) => {
  const user = findUserById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({error: 'User not found'});
  }
};

const postUser = (req, res) => {
  const result = addUser(req.body);

  if (result.user_id) {
    res.status(201).json({
      message: 'New user added.',
      result,
    });
  } else {
    res.status(400).json({error: 'Failed to add user'});
  }
};

const putUser = (req, res) => {
  res.json({message: 'User item updated, id: ' + req.params.id});
};

const deleteUser = (req, res) => {
  res.json({message: 'User item deleted, id: ' + req.params.id});
};

export {getUser, getUserById, postUser, putUser, deleteUser};
