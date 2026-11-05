import {addCat, findCatById, listAllCats} from '../models/cat-model.js';

const getCat = (req, res) => {
  res.json(listAllCats());
};

const getCatById = (req, res) => {
  const cat = findCatById(req.params.id);
  if (cat) {
    res.json(cat);
  } else {
    res.status(404).json({error: 'Cat not found'});
  }
};

const postCat = (req, res) => {
  const result = addCat(req.body);

  if (result.cat_id) {
    res.status(201).json({
      message: 'New cat added.',
      result,
    });
  } else {
    res.sendStatus(400);
  }
};

const putCat = (req, res) => {
  res.json({message: 'Cat item updated, id: ' + req.params.id});
};

const deleteCat = (req, res) => {
  res.json({message: 'Cat item deleted, id: ' + req.params.id});
};

export {getCat, getCatById, postCat, putCat, deleteCat};
