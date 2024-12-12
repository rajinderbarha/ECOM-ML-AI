import Link from 'next/link';

const ProductCard = ({ product }) => {
    return (
        <Link href={`/product/${product._id}`} className="product-card">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer">
                {product.images.length > 0 && (
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-48 w-full object-cover"
                    />
                )}
                <div className="p-4">
                    <h2 className="text-lg font-bold text-gray-800 truncate">{product.name}</h2>
                    <p className="text-gray-600">{product.description.slice(0, 60)}...</p>
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-green-600 font-bold product-list-price-text">
                            ₹{product.salePrice}
                        </span>
                        {product.price && (
                            <span className="line-through text-gray-500 product-list-price-text">
                                ₹{product.price}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
