import promisePool from '../../utils/database.js';

const listAllUsers = async () => {
  const [rows] = await promisePool.execute(
    'SELECT user_id, name, username, email, role FROM wsk_users'
  );

  return rows;
};

const findUserById = async (id) => {
  const [rows] = await promisePool.execute(
    'SELECT user_id, name, username, email, role FROM wsk_users WHERE user_id = ?',
    [id]
  );

  return rows[0] || null;
};

const addUser = async (user) => {
  const {name, username, email, role, password} = user;
  const [result] = await promisePool.execute(
    'INSERT INTO wsk_users (name, username, email, password, role) VALUES (?, ?, ?, ?, ?)',
    [name, username, email, password, role]
  );

  if (result.affectedRows === 0) {
    throw new Error('Failed to add user');
  }

  return {user_id: result.insertId};
};

const modifyUser = async (user, id) => {
  const allowedFields = ['name', 'username', 'email', 'password', 'role'];

  const updates = [];
  const values = [];

  for (const field of allowedFields) {
    if (Object.hasOwn(user, field)) {
      updates.push(`${field} = ?`);
      values.push(user[field]);
    }
  }

  if (updates.length === 0) {
    return null;
  }

  const [existingUsers] = await promisePool.execute(
    'SELECT user_id FROM wsk_users WHERE user_id = ?',
    [id]
  );

  if (existingUsers.length === 0) {
    return false;
  }

  values.push(id);

  const sql = `UPDATE wsk_users SET ${updates.join(', ')} WHERE user_id = ?`;

  await promisePool.execute(sql, values);

  return {message: 'success'};
};

const removeUser = async (id) => {
  const connection = await promisePool.getConnection();

  try {
    await connection.beginTransaction();

    const [users] = await connection.execute(
      'SELECT user_id FROM wsk_users WHERE user_id = ?',
      [id]
    );
    if (users.length === 0) {
      await connection.rollback();
      return false;
    }

    await connection.execute('DELETE FROM wsk_cats WHERE owner = ?', [id]);
    const [result] = await connection.execute(
      'DELETE FROM wsk_users WHERE user_id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      throw new Error('Failed to remove user');
    }

    await connection.commit();
    return {message: 'success'};
  } catch (error) {
    try {
      await connection.rollback();
    } catch (rollbackError) {
      error.rollbackError = rollbackError;
    }
    throw error;
  } finally {
    connection.release();
  }
};

const findUserByUsername = async (username) => {
  const [rows] = await promisePool.execute(
    'SELECT user_id, name, username, email, password, role FROM wsk_users WHERE username = ?',
    [username]
  );

  return rows[0] || null;
};

export {
  listAllUsers,
  findUserById,
  addUser,
  modifyUser,
  removeUser,
  findUserByUsername,
};
