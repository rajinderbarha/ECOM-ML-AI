// import Link from 'next/link';

// const ProductCard = ({ product }) => {
//     return (
//         <Link href={`/product/${product._id}`} className="product-card">
//             <div className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer">
//                 {product.images.length > 0 && (
//                     <img
//                         src={product.images[0]}
//                         alt={product.name}
//                         className="h-48 w-full object-cover"
//                     />
//                 )}
//                 <div className="p-4">
//                     <h2 className="text-lg font-bold text-gray-800 truncate">{product.name}</h2>
//                     <p className="text-gray-600">{product.description.slice(0, 60)}...</p>
//                     <div className="flex justify-between items-center mt-4">
//                         <span className="text-green-600 font-bold product-list-price-text">
//                             ₹{product.salePrice}
//                         </span>
//                         {product.price && (
//                             <span className="line-through text-gray-500 product-list-price-text">
//                                 ₹{product.price}
//                             </span>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </Link>
//     );
// };

// export default ProductCard;


import Link from 'next/link';
import { FiHeart } from 'react-icons/fi';
import { useState } from 'react';

const ProductCard = ({ product, onAddToCart, onToggleWishlist }) => {
    const [isInWishlist, setInWishlist] = useState(false);

    const toggleWishlist = (e) => {
        e.preventDefault(); // Prevent navigation to product page on button click
        setInWishlist(!isInWishlist);
        onToggleWishlist(product._id);
    };

    return (
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
                        onClick={(e) => {
                            e.preventDefault(); // Prevent navigation
                            onAddToCart(product._id);
                        }}
                        className="bg-orange-500 text-white px-4 py-2 rounded font-medium hover:bg-orange-600 transition"
                    >
                        Add to Cart
                    </button>

                    {/* Wishlist Button */}
                    <button
                        onClick={toggleWishlist}
                        className={`text-xl ${isInWishlist ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 transition`}
                    >
                        <FiHeart />
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
