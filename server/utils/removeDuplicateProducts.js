import mongoose from 'mongoose';
import Product from '../models/Product.js'; // Adjust the path to your Product model

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://rajinderbarha:rajinderbarha@cluster0.qodga.mongodb.net/ECOM-AI?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB.');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// Function to remove duplicate products
const removeDuplicateProducts = async () => {
  try {
    console.log('Finding duplicates...');
    const duplicates = await Product.aggregate([
      {
        $group: {
          _id: { title: "$title" }, // Group by the 'title' field
          ids: { $push: "$_id" },   // Collect all IDs for each group
          count: { $sum: 1 },       // Count how many in each group
        },
      },
      { $match: { count: { $gt: 1 } } }, // Filter for duplicates (count > 1)
    ]);

    console.log(`${duplicates.length} duplicate groups found.`);

    // Remove duplicates
    for (const group of duplicates) {
      const [firstId, ...duplicateIds] = group.ids; // Keep the first ID, delete the rest
      await Product.deleteMany({ _id: { $in: duplicateIds } });
      console.log(`Removed ${duplicateIds.length} duplicates for title: ${group._id.title}`);
    }

    console.log('Duplicate removal complete.');
  } catch (err) {
    console.error('Error removing duplicates:', err.message);
  }
};

// Main function to connect to DB, clean up duplicates, and disconnect
const main = async () => {
  await connectDB();
  await removeDuplicateProducts();
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB.');
};

// Run the script
main().catch(console.error);
