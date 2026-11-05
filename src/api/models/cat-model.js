const catItems = [
  {
    cat_id: 9592,
    cat_name: 'Frank',
    weight: 11,
    owner: 3609,
    filename: 'frank.jpg',
    birthdate: '2021-10-12',
  },
  {
    cat_id: 9590,
    cat_name: 'Mittens',
    weight: 8,
    owner: 3602,
    filename: 'mittens.jpg',
    birthdate: '2022-05-14',
  },
];

const listAllCats = () => {
  return catItems;
};

const findCatById = (catId) => {
  return catItems.find((cat) => cat.cat_id === Number(catId));
};

const addCat = (cat) => {
  const {cat_name, weight, owner, filename, birthdate} = cat;

  const newId = Math.max(0, ...catItems.map((item) => item.cat_id)) + 1;

  catItems.push({
    cat_id: newId,
    cat_name,
    weight,
    owner,
    filename,
    birthdate,
  });

  return {cat_id: newId};
};

export {listAllCats, findCatById, addCat};
