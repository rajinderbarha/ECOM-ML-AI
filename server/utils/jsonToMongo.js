//////////JSON TO MONGO ATLAS/////////////
import fs from 'fs';
import { MongoClient } from 'mongodb';

// MongoDB Atlas connection details
const uri = "mongodb+srv://rajinderbarha:rajinderbarha@cluster0.qodga.mongodb.net/ECOM-AI?retryWrites=true&w=majority&appName=Cluster0";
const databaseName = "ECOM-AI"; // Update with your database name
const collectionName = "products"; // Update with your collection name

async function uploadJSONToMongoDB() {
  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB for JSON upload");

    const db = client.db(databaseName);
    const collection = db.collection(collectionName);

    // Read JSON file
    const rawData = fs.readFileSync('products.json');
    const data = JSON.parse(rawData);

    // Insert data into MongoDB
    const result = await collection.insertMany(data);
    console.log(`${result.insertedCount} documents were inserted`);
    console.log('Inserted documents:', result.insertedIds);

  } catch (error) {
    console.error('Error uploading JSON to MongoDB:', error);
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
    console.log("Connection closed");
  }
}

uploadJSONToMongoDB();
