import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import Link from 'next/link';

const DiscountSection = () => {
    const [products20, setProducts20] = useState([]);
    const [products50, setProducts50] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/products/discount-products?discount=20')
            .then((res) => res.json())
            .then((data) => (
                // console.log(data),
                setProducts20(data)
            ))

        fetch('http://localhost:5000/api/products/discount-products?discount=50')
            .then((res) => res.json())
            .then((data) => (
                // console.log(data),
                setProducts50(data)
            ))
    }, []);

    return (
        <section className=" bg-sky-300 border-b border-slate-900">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold mb-6">Discounted Products</h2>
                <div className=''>
                    <div className="flex justify-between align-center">
                        <h3 className="text-xl font-semibold mb-4">upto 50% Off</h3>
                        <Link className='hover:text-blue-600 hover:underline' href="/products">{`View All >`}</Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {products50?.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </div>
                <div className="mb-10 mt-5">
                    <div className="flex justify-between align-center">
                        <h3 className="text-xl font-semibold mb-4">upto 20% Off</h3>
                        <Link className='hover:text-blue-600 hover:underline' href="/products">{`View All >`}</Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {products20?.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default DiscountSection;
