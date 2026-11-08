import {
  addCat,
  findCatById,
  listAllCats,
  listCatsByUserId,
  modifyCat,
  removeCat,
} from '../models/cat-model.js';

const getCat = async (req, res, next) => {
  try {
    res.json(await listAllCats());
  } catch (error) {
    next(error);
  }
};

const getCatById = async (req, res, next) => {
  try {
    const cat = await findCatById(req.params.id);
    if (cat) {
      res.json(cat);
    } else {
      const error = new Error('Cat not found');
      error.status = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

const getCatsByUserId = async (req, res, next) => {
  try {
    res.json(await listCatsByUserId(req.params.id));
  } catch (error) {
    next(error);
  }
};

const postCat = async (req, res, next) => {
  if (!req.file) {
    const error = new Error('Cat image or video is required');
    error.status = 400;
    next(error);
    return;
  }

  try {
    const result = await addCat({
      cat_name: req.body.cat_name,
      weight: req.body.weight,
      birthdate: req.body.birthdate,
      owner: res.locals.user.user_id,
      filename: req.file.filename,
    });

    if (result.cat_id) {
      res.status(201).json({
        message: 'New cat added.',
        result,
      });
    } else {
      const error = new Error('Invalid cat data');
      error.status = 400;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

const putCat = async (req, res, next) => {
  try {
    const result = await modifyCat(
      req.body || {},
      req.params.id,
      res.locals.user
    );

    if (result === null) {
      const error = new Error('No valid fields to update');
      error.status = 400;
      return next(error);
    }

    if (result === false) {
      const status = res.locals.user.role === 'admin' ? 404 : 403;
      const error = new Error('Cat not found or access denied');
      error.status = status;
      return next(error);
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

const deleteCat = async (req, res, next) => {
  try {
    const result = await removeCat(req.params.id, res.locals.user);

    if (!result) {
      const status = res.locals.user.role === 'admin' ? 404 : 403;
      const error = new Error('Cat not found or access denied');
      error.status = status;
      return next(error);
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export {getCat, getCatById, getCatsByUserId, postCat, putCat, deleteCat};
