
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        name: String,
        price: Number,
        quantity: Number,

        // Customer ki product customization
        customization: {
          fulfillmentType: {
            type: String,
            enum: ["stitched", "unstitched"],
          },

          fabricType: String,
          fabricColor: String,

          measurements: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
          },

          design: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
          },
        },
      },
    ],

    // Customer ki delivery details
    deliveryDetails: {
      name: String,
      phone: String,
      houseNo: String,
      street: String,
      area: String,
      city: String,
      notes: String,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
