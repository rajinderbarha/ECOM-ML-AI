import CategoryList from '@/components/categoryList';
import ProductCard from '@/components/ProductCard';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const ShopByCategory = () => {
    const router = useRouter();
    const { categories } = router.query; // Categories from query params
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!categories) return;

        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:5000/api/products/products-by-category?categories=${categories}`);
                const data = await response.json();
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categories]);

    if (loading) return <p>Loading...</p>;

    return (
        <div >
            <CategoryList />
            <div className="container mx-auto p-0 mt-[80px]">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-6 mb-8">
                    {products.map((product) => (

                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ShopByCategory;
