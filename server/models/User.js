import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    // Basic Information
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    image: { type: String, default: "" }, // Google profile picture URL

    // Google Authentication
    googleId: { type: String, unique: true }, // For Google login via NextAuth
    lastLogin: { type: Date, default: Date.now }, // Track last login timestamp

    // Personalization Data
    preferences: { type: [String], default: [] }, // User's preferences (categories, interests, etc.)
    searchHistory: { type: [String], default: [] }, // List of user search queries
    likedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // Products liked by the user
    viewedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // Recently viewed products
    recommendedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // Recommendations based on history

    // Demographics & Personal Data
    familyMembers: { type: Number, default: 1 },
    dateOfBirth: { type: Date }, // Optional for personalized experiences
    location: { 
      city: { type: String, default: "" },
      country: { type: String, default: "" },
    },

    // Account Data
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // Current cart items
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // User wishlist
    orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }], // List of past orders
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
    marketingOptIn: { type: Boolean, default: false }, // Consent for marketing emails
    communicationPreferences: { 
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
    },

    // Analytics
    sessionCount: { type: Number, default: 0 }, // Track total login sessions
    referralCode: { type: String }, // Referral code if applicable

    // System Metadata
    createdAt: { type: Date, default: Date.now }, // Auto-tracked timestamp
    updatedAt: { type: Date, default: Date.now }, // Updated timestamp
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
