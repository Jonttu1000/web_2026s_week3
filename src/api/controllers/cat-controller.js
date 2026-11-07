import {
  addCat,
  findCatById,
  listAllCats,
  listCatsByUserId,
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
  console.log('Request body:', req.body);
  console.log('Request file:', req.file);

  const result = await addCat({...req.body, filename: req.file?.filename});

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

export {
  getCat,
  getCatById,
  getCatsByUserId,
  postCat,
  putCat,
  deleteCat,
};
