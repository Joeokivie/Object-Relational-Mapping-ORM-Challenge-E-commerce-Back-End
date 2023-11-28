const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  Tag.findAll({
    include: {
      model: Product,
      attributes: ["id", "product_name", "price", "stock", "category_id"],
    },
  })
    .then((dbTagData) => {
      if (dbTagData.length === 0) {
        // Handle case where no categories are found
        return res.status(404).json({ message: "No categories found." });
      }
      // Categories found, respond with the data
      return res.json(dbTagData);
    })
    .catch((err) => {
      console.error(err);
      // Handle other errors
      return res.status(500).json({ error: "Internal server error." });
    });
  

router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  upTag.findOne({
    where: {
      id: req.params.id,
    },
    include: {
      model: Product,
      attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
    },
  })
    .then((dbTagData) => {
      if (!dbTagData) {
        // Handle case where no category is found with the given id
        return res.status(404).json({ message: "No category found with this id" });
      }
      // Category found, respond with the data
      return res.json(dbTagData);
    })
    .catch((err) => {
      console.error(err);
      // Handle other errors
      return res.status(500).json({ error: "Internal server error" });
    });
  
});

router.post('/', (req, res) => {
  // create a new tag
  Tag.create({
    tag_name: req.body.tag_name,
  })
    .then((dbTagData) => {
      // Respond with the created tag data
      return res.json(dbTagData);
    })
    .catch((err) => {
      console.error(err);
      // Handle errors and send a 500 response
      return res.status(500).json({ error: "Internal server error" });
    });
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((rowsAffected) => {
      if (rowsAffected[0] === 0) {
        // No tag found with the given ID
        return res.status(404).json({ message: "Tag not found with the specified ID" });
      }
      // Tag updated successfully, respond with the updated data
      return res.json({ message: "Tag updated successfully" });
    })
    .catch((err) => {
      console.error(err);
      // Handle errors and send a 500 response
      return res.status(500).json({ error: "Internal server error" });
    });
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
  Tag.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((rowsAffected) => {
      if (rowsAffected === 0) {
        // No tag found with the given ID
        return res.status(404).json({ message: "Tag not found with the specified ID" });
      }
      // Tag deleted successfully, respond with a success message
      return res.json({ message: "Tag deleted successfully" });
    })
    .catch((err) => {
      console.error(err);
      // Handle errors and send a 500 response
      return res.status(500).json({ error: "Internal server error" });
    });
  
});

module.exports = router;
