import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import Link from 'next/link';

const ProductUnderPriceSection = () => {
    const [productsUnder500, setProductsUnder500] = useState([]);
    const [productsUnder1000, setProductsUnder1000] = useState([]);

    useEffect(() => {
        // Fetch products under 500
        fetch('http://localhost:5000/api/products/products-under-price?price=500')
            .then(res => res.json())
            .then(data => setProductsUnder500(data))
            .catch(err => console.error('Error fetching products under 500', err));

        // Fetch products under 1000
        fetch('http://localhost:5000/api/products/products-under-price?price=1000')
            .then(res => res.json())
            .then(data => setProductsUnder1000(data))
            .catch(err => console.error('Error fetching products under 1000', err));
    }, []);

    return (
        <section className=" bg-red-400 border-b border-slate-900">
            <div className="container mx-auto px-4">

                <h2 className="text-2xl font-bold mb-6">Shop by Price</h2>

                <div>
                    <div className="flex justify-between align-center">
                        <h3 className="text-xl font-semibold mb-4">Under 500</h3>
                        <Link className='hover:text-blue-600 hover:underline' href="/products">{`View All >`}</Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {productsUnder500?.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </div>
                <div className="mb-10 mt-5 bg-red-400">
                    <div className="flex justify-between align-center">
                        <h3 className="text-xl font-semibold mb-4">Under 1000</h3>
                        <Link className='hover:text-blue-600 hover:underline' href="/products">{`View All >`}</Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {productsUnder1000?.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default ProductUnderPriceSection;
