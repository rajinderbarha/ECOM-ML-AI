import { Router } from "express";
import qs from 'qs';
import Category from "../models/Category.js";
import uploader from '../utils/cloudinary.js';
import Product from "../models/Product.js";
import User from "../models/User.js";
import Order from "../models/Order.js";

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
        console.log(req.params.id);
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

        if (!categories) {
            return res.status(400).json({ error: "Categories parameter is required" });
        }

        // Decode and split categories
        const decodedCategories = decodeURIComponent(categories)
            .split('|') // Split by the pipe delimiter
            .map((cat) => cat.trim())
            .filter(Boolean); // Remove empty strings

        if (decodedCategories.length === 0) {
            return res.status(400).json({ error: "No valid categories provided" });
        }

        // Fetch products by category
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
        const { minPrice, maxPrice } = req.query;

        // Validate the inputs
        if (!minPrice || !maxPrice) {
            return res.status(400).json({ error: 'Both minPrice and maxPrice are required.' });
        }

        const min = Number(minPrice);
        const max = Number(maxPrice);

        if (isNaN(min) || isNaN(max) || min < 0 || max < 0 || min > max) {
            return res.status(400).json({ error: 'Invalid price range. Ensure minPrice and maxPrice are valid numbers, and minPrice is less than maxPrice.' });
        }

        // Find products where salePrice is between minPrice and maxPrice
        const products = await Product.find({
            salePrice: { $gte: min, $lte: max }
        });

        // Shuffle the products
        const shuffledProducts = products.sort(() => Math.random() - 0.5);

        // Limit to 10 products per request
        const limitedProducts = shuffledProducts.slice(0, 10);

        res.json(limitedProducts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching products.' });
    }
});

router.get('/get-cart', async (req, res) => {
    const { userId } = req.query;
    try {
        const user = await User.findById(userId).populate('cart.product');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ cart: user.cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/add-to-cart', async (req, res) => {
    const { productId, userId } = req.body;
    if (!productId || !userId) {
        return res.status(400).json({ message: 'Product ID and User ID are required.' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const productExists = user.cart.find(item => item.product.toString() === productId);

        if (productExists) {
            productExists.quantity += 1;
        } else {
            user.cart.push({ product: productId, quantity: 1 });
        }

        await user.save();

        const populatedCart = await User.findById(userId).populate('cart.product');

        return res.json({ message: 'Product added to cart.', cart: populatedCart.cart });
    } catch (error) {
        console.error('Error adding to cart:', error);
        return res.status(500).json({ message: 'Server error.', error: error.message });
    }
});

router.post('/remove-from-cart', async (req, res) => {
    const { productId, userId } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove product from the cart
        user.cart = user.cart.filter(item => item.product.toString() !== productId);
        await user.save();

        res.status(200).json({ message: 'Product removed from cart' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})

router.get('/get-wishlist', async (req, res) => {
    const { userId } = req.query;
    try {
        const user = await User.findById(userId).populate('wishlist.product');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ wishlist: user.wishlist });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/add-to-wishlist', async (req, res) => {
    const { productId, userId } = req.body;
    if (!productId || !userId) {
        return res.status(400).json({ message: 'Product ID and User ID are required.' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const productExists = user.wishlist.find(item => item.product.toString() === productId);

        if (productExists) {
            productExists.quantity += 1;
        } else {
            user.wishlist.push({ product: productId, quantity: 1 });
        }

        await user.save();

        const populatedWishlist = await User.findById(userId).populate('cart.product');

        return res.json({ message: 'Product added to wishlist.', cart: populatedWishlist.wishlist });
    } catch (error) {
        console.error('Error adding to wishlist :', error);
        return res.status(500).json({ message: 'Server error.', error: error.message });
    }
});

router.post('/remove-from-wishlist', async (req, res) => {
    const { productId, userId } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove product from the cart
        user.wishlist = user.wishlist.filter(item => item.product.toString() !== productId);
        await user.save();

        res.status(200).json({ message: 'Product removed from wishlist' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})

router.get('/search', async (req, res) => {
    try {
        const { search, category, brand, minPrice = 0, maxPrice = 1000, inStock, } = req.query;

        console.log(search, category, brand, minPrice, maxPrice, inStock,)
        const filters = {};

        if (search) {
            filters.$text = { $search: search };
        }

        if (category) {
            filters.categoryName = category;
        }

        // if (brand) {
        //     filters.brand = { $regex: brand, $options: "i" }; // Case-insensitive match
        // }

        // if (inStock) {
        //     filters.inStock = inStock === "true";
        // }

        // filters.price = { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) };

        console.log("filters: ", filters)

        const products = await Product.find(filters);

        // console.log("Searched Products: ", products)

        res.status(200).json({ success: true, products });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
})

router.post("/place-order", async (req, res) => {
    try {
        const { userId, shippingAddress } = req.body;

        console.log(shippingAddress, userId)

        const user = await User.findById(userId).populate("cart.product");

        if (!user || user.cart.length === 0) {
            return res.status(400).json({ message: "Cart is empty or user not found" });
        }

        const totalAmount = user.cart.reduce((total, item) => {
            return total + item.product.salePrice * item.quantity;
        }, 0);

        const newOrder = new Order({
            user: userId,
            items: user.cart.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
            })),
            totalAmount,
            shippingAddress,
        });

        await newOrder.save();

        // Add order ID to user's order history
        user.orderHistory.push(newOrder._id);
        user.cart = []; // Clear the cart
        await user.save();

        res.status(201).json({ message: "Order placed successfully", order: newOrder });
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ message: "Something went wrong", error });
    }
});

router.get("/user-orders/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(userId)
        const orders = await Order.find({ user: userId })
            .populate("items.product")
            .sort({ placedAt: -1 });

        if (!orders || orders.length === 0) {
            return res.status(400).json([]);
        }

        res.status(200).json({ orders });
        return
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Failed to fetch orders", error });
    }
});

router.post('/update-cart', async (req, res) => {
    const { userId, productId, quantity } = req.body;

    if (quantity < 1) {
        return res.status(400).json({ message: 'Quantity cannot be less than 1' });
    }

    try {
        const user = await User.findById(userId).populate('cart.product'); // Populate product details
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const cartItem = user.cart.find(item => item.product._id.toString() === productId);
        if (cartItem) {
            cartItem.quantity = quantity;
            await user.save();

            // Refetch cart with populated product details
            const updatedUser = await User.findById(userId).populate('cart.product');
            return res.status(200).json({ message: 'Cart updated successfully', cart: updatedUser.cart });
        } else {
            return res.status(404).json({ message: 'Product not found in cart' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating cart', error });
    }
});

router.post('/add-to-recently-viewed/:userId/:productId', async (req, res) => {
    try {
        const { userId, productId } = req.params;

        if (!userId || userId === 'undefined') {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Update recently viewed products atomically
        await User.findByIdAndUpdate(userId, {
            $pull: { recentlyViewedProducts: productId },
            $push: {
                recentlyViewedProducts: {
                    $each: [productId],
                    $slice: -10, // Keep only the last 10 items
                },
            },
        });

        res.status(200).json({ message: "Product added to recently viewed" });
    } catch (error) {
        console.error("Error adding to recently viewed:", error);
        res.status(500).json({ error: "Failed to add product to recently viewed" });
    }
});

router.get('/recent-viewed-products/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate('recentlyViewedProducts');

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const recentlyViewedProducts = user.recentlyViewedProducts;
        res.status(200).json(recentlyViewedProducts);
    } catch (error) {
        console.error("Error fetching recently viewed products:", error);
        res.status(500).json({ error: "Failed to fetch recently viewed products" });
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

// Add a new category
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