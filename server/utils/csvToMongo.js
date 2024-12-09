import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { fileURLToPath } from 'url';

// Polyfill for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB connection
mongoose
  .connect('mongodb+srv://rajinderbarha:rajinderbarha@cluster0.qodga.mongodb.net/ECOM-AI?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit if unable to connect
  });

// Define schemas
import Product from '../models/Product.js';
const Category = mongoose.model('Category', new mongoose.Schema({ name: String }));
const SubCategory = mongoose.model('SubCategory', new mongoose.Schema({ name: String }));
const Brand = mongoose.model('Brand', new mongoose.Schema({ name: String }));
const Type = mongoose.model('Type', new mongoose.Schema({ name: String }));

// Helper to save entities with error handling
const saveEntity = async (Model, name, map) => {
    if (!map.has(name)) {
      try {
        // Check if the entity already exists in the database
        let existingEntity = await Model.findOne({ name });
        
        // If entity doesn't exist, create and save a new one
        if (!existingEntity) {
          existingEntity = new Model({ name });
          await existingEntity.save();
          console.log(`Added ${Model.modelName.toLowerCase()}: ${name}`);
        }
  
        // Use the existing entity (either found or newly created) in the map
        map.set(name, existingEntity);
  
      } catch (err) {
        console.error(`Error adding ${Model.modelName.toLowerCase()} ${name}: ${err.message}`);
      }
    }
  };
  
  

// Helper to process a chunk of products
const processChunk = async (chunk, uniqueCategories, uniqueSubCategories, uniqueBrands, uniqueTypes) => {
  for (const row of chunk) {
    const {
      product: title,
      category,
      sub_category,
      brand,
      sale_price,
      market_price,
      type,
      rating,
      description,
    } = row;

    // Use 'No Data Available' for missing data fields
    const processedTitle = title || "No Data Available";
    const processedCategory = category || "No Data Available";
    const processedSubCategory = sub_category || "No Data Available";
    const processedBrand = brand || "No Data Available";
    const processedType = type || "No Data Available";
    const processedSalePrice = parseFloat(sale_price) || 0;
    const processedMarketPrice = parseFloat(market_price) || 0;
    const processedRating = parseFloat(rating) || 0;
    const processedDescription = description || "No Data Available";

    console.log(`Processing product: ${processedTitle}`);

    // Save categories, subcategories, brands, and types
    await saveEntity(Category, processedCategory, uniqueCategories);
    await saveEntity(SubCategory, processedSubCategory, uniqueSubCategories);
    await saveEntity(Brand, processedBrand, uniqueBrands);
    await saveEntity(Type, processedType, uniqueTypes);

    // Save product with 'No Data Available' for missing fields
    const product = new Product({
      title: processedTitle,
      category_id: uniqueCategories.get(processedCategory)?._id,
      category_name: processedCategory,
      sub_category_id: uniqueSubCategories.get(processedSubCategory)?._id,
      sub_category_name: processedSubCategory,
      brand_id: uniqueBrands.get(processedBrand)?._id,
      brand_name: processedBrand,
      sale_price: processedSalePrice,
      market_price: processedMarketPrice,
      type_id: uniqueTypes.get(processedType)?._id,
      type_name: processedType,
      rating: processedRating,
      description: processedDescription,
    });

    try {
      await product.save();
      console.log(`Added product: ${processedTitle}`);
    } catch (err) {
      console.error(`Error adding product ${processedTitle}: ${err.message}`);
    }
  }
};

// Process CSV file in chunks
const processCSVInChunks = async (filePath, chunkSize = 25000) => {
  const uniqueCategories = new Map();
  const uniqueSubCategories = new Map();
  const uniqueBrands = new Map();
  const uniqueTypes = new Map();
  const rows = [];
  let count = 0;

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        rows.push(row);
        count++;

        // Process a chunk when the chunk size is reached
        if (rows.length === chunkSize) {
          processChunk([...rows], uniqueCategories, uniqueSubCategories, uniqueBrands, uniqueTypes)
            .then(() => {
              rows.length = 0; // Clear processed rows
            })
            .catch(reject);
        }
      })
      .on('end', async () => {
        // Process any remaining rows after the stream ends
        if (rows.length > 0) {
          await processChunk(rows, uniqueCategories, uniqueSubCategories, uniqueBrands, uniqueTypes);
        }
        console.log(`Processed ${count} rows in total.`);
        resolve();
      })
      .on('error', (err) => {
        console.error('Error reading CSV file:', err.message);
        reject(err);
      });
  });
};

// Start processing
(async () => {
  try {
    const csvFilePath = path.join(__dirname, 'BigBasketProducts.csv');
    await processCSVInChunks(csvFilePath);
  } catch (err) {
    console.error('Error during CSV processing:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
})();
