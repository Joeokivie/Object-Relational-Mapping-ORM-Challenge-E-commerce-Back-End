const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categorydata = await Category.findAll({
      include: [Product]
    })
    res.status(200).json(categorydata)
  } catch (error) { 
    console.log(error)
    res.status(500).json(error)
   }

});

router.get('/:id',  async (req, res) => {
  // find one category by its `id` value
  try {
    const categorydata = await Category.findOne({
      where: {
        id: req.params.id
      },
      include: [Product]
    })
    res.status(200).json(categorydata)
  } catch (error) { 
    console.log(error)
    res.status(500).json(error)
   }

  // be sure to include its associated Products
});

router.post('/',  async (req, res) => {
  // create a new category
  try {
    const categorydata = await Category.create(req.body)
    res.status(200).json(categorydata)
  } catch (error) { 
    console.log(error)
    res.status(500).json(error)
   }

});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
  Category.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((dbCategoryData) => {
      if (!dbCategoryData) {
        res.status(404).json();
        return;
      }
      res.json(dbCategoryData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  try {
    const catagoryData = await Category.destroy({
      where: {
        id: req.params.id
      }
    });
    res.status(200).json(catagoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
