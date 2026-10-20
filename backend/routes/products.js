const express = require("express");
const Product = require("../models/Product");

const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/auth");

const router = express.Router();

// ================= GET ALL PRODUCTS =================
// Ye public hai — normal users bhi products dekh sakte hain
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get products",
      error: error.message,
    });
  }
});

// ================= ADD PRODUCT =================
// Sirf logged-in admin product add kar sakta hai
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const {
        name,
        price,
        image,
        description,
        category,
      } = req.body;

      if (!name || !price || !image || !description || !category) {
        return res.status(400).json({
          message: "All fields are required",
        });
      }

      const product = new Product({
        name,
        price,
        image,
        description,
        category,
      });

      await product.save();

      res.status(201).json({
        message: "Product created successfully",
        product,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to create product",
        error: error.message,
      });
    }
  }
);

// ================= UPDATE PRODUCT =================
// Sirf logged-in admin product update kar sakta hai
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const {
        name,
        price,
        image,
        description,
        category,
      } = req.body;

      const updatedProduct =
        await Product.findByIdAndUpdate(
          req.params.id,
          {
            name,
            price,
            image,
            description,
            category,
          },
          { new: true }
        );

      if (!updatedProduct) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      res.json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to update product",
        error: error.message,
      });
    }
  }
);

// ================= DELETE PRODUCT =================
// Sirf logged-in admin product delete kar sakta hai
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const deletedProduct =
        await Product.findByIdAndDelete(req.params.id);

      if (!deletedProduct) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      res.json({
        message: "Product deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to delete product",
        error: error.message,
      });
    }
  }
);

module.exports = router;