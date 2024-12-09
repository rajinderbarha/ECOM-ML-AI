import { Router } from "express";
import Category from "../models/Category.js";
import   uploader from '../utils/cloudinary.js';
import Product from "../models/Product.js";

const router = Router();

router.get('/getCategoryNames', async (req, res) => {
    try {
        const CategoryNameList = await Category.find({}, 'name'); 
        // console.log(CategoryNameList); 
        res.status(200).json(CategoryNameList); 
    } catch (error) {
        console.error('Error fetching category names:', error); 
        res.status(500).json({ message: 'Error fetching category names', error });
    }
});
router.get('/getCategories', async (req, res) => {
    try {
        const CategoryList = await Category.find({}); 
        // console.log(CategoryList); 
        res.status(200).json(CategoryList); 
    } catch (error) {
        console.error('Error fetching categories :', error); 
        res.status(500).json({ message: 'Error fetching category names', error });
    }
});



router.get('/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
});

router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error });
    }
});

router.get("/categories", async (req, res) => {
    try {
        const categories = await Category.find().select('name breadcrumb');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Add a new product
router.post('/add-product', uploader.array('images', 5), async (req, res) => {
    try {
        const { name, description, price, salePrice, discount, weight, dimensions, brand, categoryName, usageFrequency } = req.body;
        const category = await Category.findOne({ name: categoryName });

        if (!category) {
            return res.status(400).json({ success: false, message: "Category not found" });
        }

        const breadcrumb = `${category.breadcrumb} > ${name}`;
        const images = req.files.map(file => file.path);

        const product = new Product({
            name,
            description,
            price,
            salePrice,
            discount,
            weight,
            dimensions,
            brand,
            categoryName,
            category: category._id,
            breadcrumb,
            images,
            usageFrequency
        });

        await product.save();
        res.status(201).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/add-category', uploader.single('image'), async (req, res) => {
    console.log(req.body);
    try {
        const { name, breadcrumb } = req.body;
        const image = req.file.path;

        const category = new Category({ name, image, breadcrumb });
        await category.save();

        res.status(201).json({ success: true, category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
export default router;