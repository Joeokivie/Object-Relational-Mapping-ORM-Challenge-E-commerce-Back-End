const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// Get all products with their associated Category and Tag data
router.get('/', async (req, res) => {
  try {
    // Find all products with specified attributes and include associated Category and Tag data
    const dbProductData = await Product.findAll({
      attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
      include: [
        {
          model: Category,
          attributes: ['category_name']
        },
        {
          model: Tag,
          attributes: ['tag_name']
        }
      ]
    });

    if (dbProductData.length === 0) {
      // If no products found, return a 404 response
      return res.status(404).json({ message: 'No products found' });
    }

    // Return the JSON response with the retrieved product data
    res.json(dbProductData);
  } catch (err) {
    // Handle errors and log them
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/:id', async(req, res) => {
// find one category by its `id` value
try {
  const categorydata = await Product.findOne({
    where: {
      id: req.params.id
    },
    include: [Category]
  })
  res.status(200).json(categorydata)
} catch (error) { 
  console.log(error)
  res.status(500).json(error)
 }

// be sure to include its associated Products

})

// Create a new product
router.post('/', async (req, res) => {
  try {
    const { product_name, price, stock, tagIds } = req.body;

    // Create a new product
    const newProduct = await Product.create({
      product_name,
      price,
      stock,
    });

    if (tagIds && tagIds.length > 0) {
      // If there are product tags, create pairings in the ProductTag model
      const productTagIdArr = tagIds.map((tag_id) => ({
        product_id: newProduct.id,
        tag_id,
      }));

      await ProductTag.bulkCreate(productTagIdArr);
    }

    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const { tagIds, ...updatedProductData } = req.body;

    // Update product data
    await Product.update(updatedProductData, {
      where: {
        id: req.params.id,
      },
    });

    // Find all associated tags from ProductTag
    const productTags = await ProductTag.findAll({ where: { product_id: req.params.id } });

    // Get list of current tag_ids
    const productTagIds = productTags.map(({ tag_id }) => tag_id);

    // Create filtered list of new tag_ids
       // Create filtered list of new tag_ids
       const newProductTags = tagIds
       .filter((tag_id) => !productTagIds.includes(tag_id))
       .map((tag_id) => ({
         product_id: req.params.id,
         tag_id,
       }));

    // Figure out which ones to remove
    const productTagsToRemove = productTags
      .filter(({ tag_id }) => !tagIds.includes(tag_id))
      .map(({ id }) => id);

    // Run both actions
    await Promise.all([
      ProductTag.destroy({ where: { id: productTagsToRemove } }),
      ProductTag.bulkCreate(newProductTags),
    ]);

    res.status(200).json({ message: 'Product updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    // Delete one product by its `id` value
    const dbProductData = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!dbProductData) {
      return res.status(404).json({ message: 'No product found with this ID' });
    }

    res.json(dbProductData);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
