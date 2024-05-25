const express = require("express");
const Carousel = require("../models/carousels");
const multer = require("multer");

const router = express.Router();

const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
}).fields([
  { name: "laptopPhoto", maxCount: 4 },
  { name: "mobilePhotos", maxCount: 4 },
]);

router.post("/", upload, async (req, res) => {
  try {
    const laptopPhotos = req.files["laptopPhotos"]?.map((file) =>
      file.buffer.toString("base64")
    );
    const mobilePhotos = req.files["mobilePhotos"]?.map((file) =>
      file.buffer.toString("base64")
    );

    if (!laptopPhotos || !mobilePhotos) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await Carousel.deleteMany({});

    const newCarousel = new Carousel({
      laptopPhotos,
      mobilePhotos,
    });

    const carousel = await newCarousel.save();
    res.status(201).json(carousel);
  } catch (error) {
    res.status(500).send("Error processing request.");
    console.error("Error processing request:", error);
  }
});

router.get("/", async (req, res) => {
  try {
    const carousels = await Carousel.find({});
    return res.status(200).json(carousels);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Internal Server Error...!!");
  }
});

module.exports = router;
