
const express = require("express");
const jwt = require("jsonwebtoken");
const Order = require("../models/order");

const router = express.Router();

// ================= PLACE ORDER =================
router.post("/", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Please login first",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, "MY_SECRET_KEY");

    const { products, totalAmount, deliveryDetails } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    if (
      !deliveryDetails ||
      !deliveryDetails.name ||
      !deliveryDetails.phone ||
      !deliveryDetails.houseNo ||
      !deliveryDetails.area ||
      !deliveryDetails.city
    ) {
      return res.status(400).json({
        message: "Please fill in all required delivery details",
      });
    }

    const order = new Order({
      userId: decoded.userId,
      products,
      totalAmount,
      deliveryDetails,
    });

    await order.save();

    return res.status(201).json({
      message: "Order placed successfully!",
      order,
    });
  } catch (error) {
    console.error("ORDER ERROR:", error);

    return res.status(500).json({
      message: "Failed to place order",
      error: error.message,
    });
  }
});

// ================= GET ALL ORDERS (ADMIN) =================
router.get("/", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Please login first",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, "MY_SECRET_KEY");

    if (decoded.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return res.json(orders);
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);

    return res.status(500).json({
      message: "Failed to get orders",
      error: error.message,
    });
  }
});

module.exports = router;
