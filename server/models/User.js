import mongoose, { Schema } from "mongoose";

const userSchema = mongoose.Schema(
  {
    // Basic Information
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    image: { type: String, default: "" }, // Google profile picture URL

    // Shopping Data
    cart: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
      },
    ],
    wishlist: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    orderHistory: [{ type: Schema.Types.ObjectId, ref: "Order" }], // List of past orders

    // Google Authentication
    googleId: { type: String, unique: true }, // For Google login via NextAuth
    lastLogin: { type: Date, default: Date.now }, // Track last login timestamp

    // Personalization Data
    preferences: { type: [String], default: [] },
    searchHistory: { type: [String], default: [] },
    likedProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    viewedProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],

    // Other Details
    familyMembers: { type: Number, default: 1 },
    dateOfBirth: { type: Date },
    location: {
      city: { type: String, default: "" },
      country: { type: String, default: "" },
    },

    // Saved Addresses
    savedAddresses: [
      {
        addressLine1: { type: String },
        addressLine2: { type: String },
        city: { type: String },
        state: { type: String },
        postalCode: { type: String },
        country: { type: String },
        isDefault: { type: Boolean, default: false },
      },
    ],

    // Notifications and Communication Preferences
    notificationsEnabled: { type: Boolean, default: true },
    marketingOptIn: { type: Boolean, default: false },
    communicationPreferences: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
    },

    // Analytics and Metadata
    sessionCount: { type: Number, default: 0 },
    referralCode: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Middleware: Update `updatedAt` field on save
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
