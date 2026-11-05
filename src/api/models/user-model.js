const userItems = [
  {
    user_id: 3609,
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@metropolia.fi',
    role: 'user',
    password: 'password',
  },
  {
    user_id: 3610,
    name: 'Jane Smith',
    username: 'janesmith',
    email: 'jane.smith@metropolia.fi',
    role: 'admin',
    password: 'securepassword123',
  },
  {
    user_id: 3611,
    name: 'Matti Meikäläinen',
    username: 'mattimeikäläinen',
    email: 'matti.meikalainen@metropolia.fi',
    role: 'user',
    password: 'salasana2026',
  },
];

const listAllUsers = () => {
  return userItems;
};

const findUserById = (userId) => {
  return userItems.find((user) => user.user_id === Number(userId));
};

const addUser = (user) => {
  const {name, username, email, role, password} = user;

  const newId = Math.max(0, ...userItems.map((item) => item.user_id)) + 1;
  const newUser = {
    user_id: newId,
    name,
    username,
    email,
    role,
    password,
  };
  userItems.push(newUser);

  return {user_id: newId};
};

export {listAllUsers, findUserById, addUser};
