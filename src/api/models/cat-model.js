import promisePool from '../../utils/database.js';

const listAllCats = async () => {
  const [rows] = await promisePool.execute(
    `SELECT c.*, u.name AS owner_name
     FROM wsk_cats c
     JOIN wsk_users u ON c.owner = u.user_id`
  );

  return rows;
};

const findCatById = async (catId) => {
  const [rows] = await promisePool.execute(
    `SELECT c.*, u.name AS owner_name
     FROM wsk_cats c
     JOIN wsk_users u ON c.owner = u.user_id
     WHERE c.cat_id = ?`,
    [catId]
  );

  return rows[0] || null;
};

const listCatsByUserId = async (userId) => {
  const [rows] = await promisePool.execute(
    `SELECT c.*, u.name AS owner_name
     FROM wsk_cats c
     JOIN wsk_users u ON c.owner = u.user_id
     WHERE c.owner = ?`,
    [userId]
  );

  return rows;
};

const addCat = async (cat) => {
  const {cat_name, weight, owner, filename, birthdate} = cat;

  const [result] = await promisePool.execute(
    'INSERT INTO wsk_cats (cat_name, weight, owner, filename, birthdate) VALUES (?, ?, ?, ?, ?)',
    [cat_name, weight, owner, filename, birthdate]
  );

  if (result.affectedRows === 0) {
    throw new Error('Failed to add cat');
  } else {
    return {cat_id: result.insertId};
  }
};

const modifyCat = async (cat, id, user) => {
  const allowedFields = ['cat_name', 'weight', 'filename', 'birthdate'];

  if (user.role === 'admin') {
    allowedFields.push('owner');
  }

  const updates = [];
  const values = [];

  for (const field of allowedFields) {
    if (Object.hasOwn(cat, field)) {
      updates.push(`${field} = ?`);
      values.push(cat[field]);
    }
  }

  if (updates.length === 0) {
    return null;
  }

  let sql = `UPDATE wsk_cats SET ${updates.join(', ')} WHERE cat_id = ?`;
  values.push(id);

  if (user.role !== 'admin') {
    sql += ' AND owner = ?';
    values.push(user.user_id);
  }

  const [result] = await promisePool.execute(sql, values);

  if (result.affectedRows === 0) {
    let checkSql = 'SELECT cat_id FROM wsk_cats WHERE cat_id = ?';
    const checkValues = [id];

    if (user.role !== 'admin') {
      checkSql += ' AND owner = ?';
      checkValues.push(user.user_id);
    }

    const [rows] = await promisePool.execute(checkSql, checkValues);

    if (rows.length === 0) {
      return false;
    }
  }

  return {message: 'success'};
};

const removeCat = async (id, user) => {
  let sql = 'DELETE FROM wsk_cats WHERE cat_id = ?';
  const params = [id];

  if (user.role !== 'admin') {
    sql += ' AND owner = ?';
    params.push(user.user_id);
  }

  const [result] = await promisePool.execute(sql, params);

  if (result.affectedRows === 0) {
    return false;
  }

  return {message: 'success'};
};

export {
  listAllCats,
  findCatById,
  listCatsByUserId,
  addCat,
  modifyCat,
  removeCat,
};
