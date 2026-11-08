import {
  addCat,
  findCatById,
  listAllCats,
  listCatsByUserId,
  modifyCat,
  removeCat,
} from '../models/cat-model.js';

const getCat = async (req, res) => {
  const cats = await listAllCats();
  res.json(cats);
};

const getCatById = async (req, res) => {
  const cat = await findCatById(req.params.id);
  if (cat) {
    res.json(cat);
  } else {
    res.status(404).json({error: 'Cat not found'});
  }
};

const getCatsByUserId = async (req, res) => {
  const cats = await listCatsByUserId(req.params.id);
  res.json(cats);
};

const postCat = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({error: 'Cat image is required'});
  }

  const result = await addCat({
    ...req.body,
    owner: res.locals.user.user_id,
    filename: req.file?.filename,
  });

  if (result.cat_id) {
    res.status(201).json({
      message: 'New cat added.',
      result,
    });
  } else {
    res.sendStatus(400);
  }
};

const putCat = async (req, res) => {
  try {
    const result = await modifyCat(
      req.body || {},
      req.params.id,
      res.locals.user
    );

    if (result === null) {
      return res.status(400).json({error: 'No valid fields to update'});
    }

    if (result === false) {
      const status = res.locals.user.role === 'admin' ? 404 : 403;
      return res.status(status).json({error: 'Cat not found or access denied'});
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Failed to update cat'});
  }
};

const deleteCat = async (req, res) => {
  try {
    const result = await removeCat(req.params.id, res.locals.user);

    if (!result) {
      const status = res.locals.user.role === 'admin' ? 404 : 403;
      return res.status(status).json({error: 'Cat not found or access denied'});
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Failed to delete cat'});
  }
};

export {getCat, getCatById, getCatsByUserId, postCat, putCat, deleteCat};
