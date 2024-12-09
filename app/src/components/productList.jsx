import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';


export default function ProductList() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="container mx-auto p-0 mt-[80px]">
            <h1 className="text-3xl font-bold text-center mb-8">Our Products</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                    <Link key={product._id} href={`/product/${product._id}`}>
                        <div className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer">
                            <Carousel
                               showThumbs={false}
                               autoPlay
                               infiniteLoop
                               className="w-full relative z-[10]"
                            >
                                {product.images.map((img, index) => (
                                    <div key={index}>
                                        <img
                                            src={img}
                                            alt={product.name}
                                            className="h-48 w-full object-cover"
                                        />
                                    </div>
                                ))}
                            </Carousel>
                            <div className="p-4">
                                <h2 className="text-lg font-bold text-gray-800">
                                    {product.name}
                                </h2>
                                <p className="text-gray-600">
                                    {product.description.slice(0, 60)}...
                                </p>
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-green-600 font-bold">
                                        ₹{product.salePrice}
                                    </span>
                                    {product.price && (
                                        <span className="line-through text-gray-500">
                                            ₹{product.price}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
