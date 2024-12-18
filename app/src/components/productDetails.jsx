import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useSession } from "next-auth/react";

export default function ProductDetail() {
  const [showMore, setShowMore] = useState(false);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/products/${id}`
          );
          setProduct(response.data);
          console.log(response.data);
          // Add product to recently viewed if user is logged in
          if (session) {
            await addToRecentlyViewed(response.data._id);
          }
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      }
    };

    fetchProduct();
  }, [id, session]);


  const addToRecentlyViewed = async (productId) => {
    // if (!session) {
    //   console.log("User not logged in");
    //   return; // Don't proceed if there's no session
    // }

    // try {
    //   const response = await axios.post(
    //     `http://localhost:5000/api/add-to-recently-viewed/${session.user.id}/${productId}`
    //   );
    //   console.log(response.data.message);
    // } catch (error) {
    //   console.error('Error adding to recently viewed:', error);
    // }
  };



  const handleShowMore = () => setShowMore((prev) => !prev);

  const addToCart = async (e) => {
    e.preventDefault();
    if (!session) return setShowLoginModal(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/add-to-cart",
        { productId: product._id, userId: session?.user?.id }
      );
      console.log(response.data.message);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleQuantityChange = (event) => {
    setQuantity(Math.max(1, parseInt(event.target.value, 10) || 1));
  };

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-6">
      {/* Breadcrumb */}
      <div className="text-lg font-bold text-orange-600 py-5">
        {product.breadcrumb}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <Carousel showThumbs={false} autoPlay infiniteLoop>
          {product.images.map((img, index) => (
            <div key={index}>
              <img src={img} alt={product.name} className="h-96 w-full object-cover" />
            </div>
          ))}
        </Carousel>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-yellow-500 font-bold my-2">
            ⭐ {product.rating} ({product.reviewsCount} Reviews)
          </p>

          {/* Description */}
          <div className="relative">
            <p
              className={`text-gray-600 my-4 text-[16px] leading-[24px] overflow-hidden ${showMore ? "h-auto" : "h-[96px]"
                }`}
            >
              {product.description}
            </p>
            <p
              className="text-gray-800 absolute -bottom-[3px] right-[3px] bg-white cursor-pointer transition-all"
              onClick={handleShowMore}
            >
              {showMore ? "...less" : "...more"}
            </p>
          </div>

          {/* Pricing */}
          <div className="flex justify-between items-center my-4">
            <span className="text-green-600 font-bold text-2xl">₹{product.salePrice}</span>
            {product.price && (
              <span className="line-through text-gray-500 text-xl">₹{product.price}</span>
            )}
          </div>

          {/* Stock Info */}
          <p
            className={`${product.stock > 0 ? "text-green-500" : "text-red-500"
              } font-bold`}
          >
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </p>

          {/* Quantity Selector */}
          <div className="my-4">
            <label htmlFor="quantity" className="mr-2">
              Quantity:
            </label>
            <input
              id="quantity"
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              className="border border-gray-300 px-2 py-1 w-16 text-center"
              min="1"
            />
          </div>

          {/* Add to Cart Button */}
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            onClick={addToCart}
            disabled={product.stock === 0}
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Tabs for Details */}
      <div className="mt-8">
        <ul className="flex border-b">
          <li className="mr-4">
            <button className="py-2 px-4 border-b-2 border-blue-600">Description</button>
          </li>
          <li className="mr-4">
            <button className="py-2 px-4">Specifications</button>
          </li>
          <li>
            <button className="py-2 px-4">Reviews</button>
          </li>
        </ul>
        <div className="mt-4">
          <p>{product.description}</p>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Related Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* {product.relatedProducts.map((related, index) => (
            <div key={index} className="border rounded p-4 shadow hover:shadow-lg">
              <img
                src={related.image}
                alt={related.name}
                className="h-48 w-full object-cover mb-2"
              />
              <h3 className="text-lg font-bold">{related.name}</h3>
              <p className="text-green-600 font-bold">₹{related.salePrice}</p>
            </div>
          ))} */}
        </div>
      </div>
    </div>
  );
}