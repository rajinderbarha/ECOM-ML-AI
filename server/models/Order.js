import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true }, // Total price of the order
    shippingAddress: {
      addressLine1: { type: String },
      addressLine2: { type: String },
      city: { type: String},
      state: { type: String },
      postalCode: { type: String},
      country: { type: String},
    },
    status: { type: String, default: "Pending" }, // e.g., Pending, Shipped, Delivered
    placedAt: { type: Date, default: Date.now }, // Time of placing the order
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
