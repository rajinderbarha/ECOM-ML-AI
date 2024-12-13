import { Router } from "express";
import qs from 'qs';
import Category from "../models/Category.js";
import uploader from '../utils/cloudinary.js';
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


router.get('/products-by-category', async (req, res) => {
    try {
        const parsedQuery = qs.parse(req.query, { ignoreQueryPrefix: true });
        const categories = parsedQuery.categories;
        //   console.log("categories",categories);
        if (!categories) {
            return res.status(400).json({ error: "Categories parameter is required" });
        }

        const decodedCategories = decodeURIComponent(categories)
            .split('|') // Keep existing delimiter
            .map((cat) => cat.trim());

        // console.log("Decoded categories:", decodedCategories);

        const products = await Product.find({ categoryName: { $in: decodedCategories } });

        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Failed to fetch products by category" });
    }
});

router.get('/discount-products', async (req, res) => {
    try {
        const { discount } = req.query;

        // Validate discount value
        if (!discount || ![20, 50].includes(Number(discount))) {
            return res.status(400).json({ error: 'Invalid discount value. Use 20 or 50.' });
        }

        // Fetch products with salePrice less than price
        const products = await Product.find({
            $expr: { $lt: ["$salePrice", "$price"] }
        });

        // Filter products by discount
        const filteredProducts = products.filter((product) => {
            const calculatedDiscount = Math.round(
                ((product.price - product.salePrice) / product.price) * 100
            );
            return calculatedDiscount >= Number(discount);
        });

        // Shuffle the filtered products array
        const shuffledProducts = filteredProducts.sort(() => Math.random() - 0.5);

        // Limit the shuffled products to 8
        const limitedProducts = shuffledProducts.slice(0, 10);

        res.json(limitedProducts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching products.' });
    }
});

router.get('/products-under-price', async (req, res) => {
    try {
        const { price } = req.query;
        // if (![500, 1000].includes(Number(price))) {
        //     return res.status(400).json({ error: 'Invalid price range. Use 500 or 1000.' });
        // }

        // Find all products where salePrice is less than price
        const products = await Product.find({
            salePrice: { $lt: Number(price) }
        });

        // Shuffle the products
        const shuffledProducts = products.sort(() => Math.random() - 0.5);

        // Limit to 8 products per price range
        const limitedProducts = shuffledProducts.slice(0, 10);

        res.json(limitedProducts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching products.' });
    }
});

router.get('/search', async (req, res) => {
    const { search, category, brand, priceRange, inStock } = req.query;
    console.log(req.query);
    const filters = {};
    if (search) filters.$text = { $search: search };
    if (category) filters.categoryName = category;
    if (brand) filters.brand = { $regex: brand, $options: "i" };
    if (inStock) filters.inStock = inStock === "true";
    if (priceRange) {
        const [min, max] = priceRange.split(",").map(Number);
        filters.price = { $gte: min, $lte: max };
    }

    try {
        const products = await Product.find(filters).sort({ createdAt: -1 });
        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch products" });
    }

})

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