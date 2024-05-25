const express = require("express");
const Products = require("../models/products");
const multer = require("multer");

const router = express.Router();

const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
}).fields([
  { name: "photo", maxCount: 1 },
  { name: "otherPhotos", maxCount: 10 },
]);

router.post("/", upload, async (req, res) => {
  try {
    const { name, price, description, rating, numOfRating } = req.body;

    const photo = req.files["photo"]?.[0]?.buffer.toString("base64");
    const otherPhotos =
      req.files["otherPhotos"]?.map((file) => file.buffer.toString("base64")) ||
      [];

    if (!name || !price || !description || !rating || !numOfRating || !photo) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (isNaN(price) || isNaN(rating) || isNaN(numOfRating)) {
      return res
        .status(400)
        .json({ error: "Price, rating, and numOfRating must be numbers" });
    }

    const newProduct = new Products({
      name,
      rating,
      numOfRating,
      price,
      photo,
      otherPhotos,
      description,
    });

    const product = await newProduct.save();

    res.status(201).json(product);
  } catch (err) {
    console.error("Error uploading product:", err.message);
    res.status(500).json({ error: "Error uploading product" });
  }
});

router.get("/", async (req, res) => {
  try {
    const products = await Products.find({});
    return res.status(200).json(products);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Internal Server Error...!!");
  }
});

router.get("/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    const product = await Products.findOne({ _id });

    if (!product) {
      return res.status(404).send("No products found...!!");
    }

    return res.status(200).json(product);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: error.message });
  }
});

router.put("/:_id", async (req, res) => {
  const { _id } = req.params;
  const { name, price, description, stock } = req.body;

  try {
    if (!name || !price || !description || !stock) {
      return res.status(400).json({ message: "Incomplete data" });
    }

    const product = await Products.findOne({ _id });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const update = {
      name,
      price,
      description,
      stock,
    };

    const updatedProduct = await Products.findByIdAndUpdate(_id, update, {
      new: true,
    });

    return res.status(200).json({ message: "Product updated", updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    await Products.deleteOne({ _id });
    return res.status(201).send("Product Deleted..!!");
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: error.message });
  }
});

module.exports = router;
