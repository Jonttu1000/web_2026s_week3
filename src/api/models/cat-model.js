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

  const [result] = await promisePool.query(
    'INSERT INTO wsk_cats (cat_name, weight, owner, filename, birthdate) VALUES (?, ?, ?, ?, ?)',
    [cat_name, weight, owner, filename, birthdate]
  );

  if (result.affectedRows === 0) {
    throw new Error('Failed to add cat');
  } else {
    console.log(`Cat added with ID: ${result.insertId}`);
    return {cat_id: result.insertId};
  }
};

const modifyCat = async (cat, id) => {
  const sql = promisePool.format(`UPDATE wsk_cats SET ? WHERE cat_id = ?`, [
    cat,
    id,
  ]);
  const rows = await promisePool.execute(sql);
  console.log('rows', rows);
  if (rows[0].affectedRows === 0) {
    return false;
  }
  return {message: 'success'};
};

const removeCat = async (id) => {
  const [rows] = await promisePool.execute(
    'DELETE FROM wsk_cats WHERE cat_id = ?',
    [id]
  );
  console.log('rows', rows);
  if (rows.affectedRows === 0) {
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
