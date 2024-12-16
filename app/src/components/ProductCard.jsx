import Link from 'next/link';
import { FiHeart } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import LoginModal from './LoginModal';
import { useAppContext } from '@/contexts/AppContext';

const ProductCard = ({ product  }) => {
    const {user} = useAppContext();
    // console.log(user);
    const { data: session } = useSession();
    const [isInWishlist, setInWishlist] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false)

    // useEffect(() => {
    //     console.log('session data: ', session?.user);
    // }, [session]);

    const addToWishlist = async (e) => {
        e.preventDefault();
        if (!session) return setShowLoginModal(true);

        try {
            const response = await axios.post('http://localhost:5000/api/add-to-wishlist', { productId: product._id, userId: user?.id });
            setInWishlist(!isInWishlist);
            console.log(response.data.message);
        } catch (error) {
            console.error('Error toggling wishlist:', error);
        }
    };

    const addToCart = async (e) => {
        e.preventDefault();
        if (!session) return setShowLoginModal(true);

        try {
            const response = await axios.post('http://localhost:5000/api/add-to-cart', { productId: product._id, userId: user.id });
            console.log(response.data.message);
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    return (
        <>
            <Link href={`/product/${product._id}`} className="product-card block relative bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer border border-slate-400 pt-2">
                {/* Discount Badge */}
                <span className="absolute top-2 left-2 bg-green-700 text-white text-sm font-bold px-2 py-1 rounded">
                    {`${Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF`}
                </span>

                {/* Product Image */}
                {product.images.length > 0 && (
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-48 w-full object-cover"
                    />
                )}

                <div className="p-4">
                    {/* Product Name */}
                    <h2 className="text-lg font-bold text-gray-800 truncate" title={product.name}>
                        {product.name}
                    </h2>

                    {/* Product Description */}
                    <p className="text-gray-600 text-sm truncate">{product.description.slice(0, 60)}...</p>

                    {/* Price Section */}
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

                    {/* Button Section */}
                    <div className="flex justify-between items-center mt-4">
                        {/* Add to Cart Button */}
                        <button
                            onClick={addToCart}
                            className="bg-orange-500 text-white px-4 py-2 rounded font-medium hover:bg-orange-600 transition"
                        >
                            Add to Cart
                        </button>

                        {/* Wishlist Button */}
                        <button
                            onClick={addToWishlist}
                            className={`text-xl ${isInWishlist ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 transition`}
                        >
                            <FiHeart />
                        </button>
                    </div>
                </div>
            </Link>
            {showLoginModal && <LoginModal setShowLoginModal={setShowLoginModal}/>}
        </>
    );
};
export default ProductCard;
