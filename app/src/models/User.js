import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  image: { type: String },
  preferences: { type: Array, default: [] },
  searchHistory: { type: Array, default: [] },
  familyMembers: { type: Number, default: 1 },
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
