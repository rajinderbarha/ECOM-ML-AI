import CategoryList from '@/components/categoryList';
import ProductCard from '@/components/ProductCard';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const ShopByCategory = () => {
    const router = useRouter();
    const { categories } = router.query; // Extract categories from query params
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!categories) return;

        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null); // Reset error before fetching
                const encodedCategories = encodeURIComponent(categories);
                const response = await fetch(`http://localhost:5000/api/products-by-category?categories=${encodedCategories}`);
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch products: ${response.status}`);
                }

                const data = await response.json();
                setProducts(data);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to load products. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categories]);

    if (loading) return <p>Loading products...</p>;

    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div>
            <CategoryList />
            <div className="container mx-auto p-0 mt-[80px]">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-6 mb-8">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))
                    ) : (
                        <p>No products found for the selected categories.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShopByCategory;
