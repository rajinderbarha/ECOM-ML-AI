import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default function ProductDetail() {
    const [showMore, setShowMore] = useState(false);
  const [product, setProduct] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/products/products/${id}`
          );
          setProduct(response.data);
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      }
    };

    fetchProduct();
  }, [id]);


 const handleShowMore=()=>{
    setShowMore(prev=>!prev);
 }



  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="text-lg font-bold text-orange-600 py-5 product-detail-breadcrumb">
        {product.breadcrumb}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Carousel showThumbs={false} autoPlay infiniteLoop className="w-full">
          {product.images.map((img, index) => (
            <div key={index}>
              <img
                src={img}
                alt={product.name}
                className="h-96 w-full object-cover"
              />
            </div>
          ))}
        </Carousel>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
          <div className="relative">
            <p className={`text-gray-600 my-4 text-[16px] leading-[24px] product-description overflow-hidden ${showMore ? "h-auto" : "h-[96px]"}`}>{product.description} <br/>&nbsp;</p>
            <p className="text-gray-800  absolute -bottom-[3px] right-[3px] bg-white cursor-pointer transition-all" onClick={handleShowMore}>{showMore ? "...less" : "...more"}</p>
          </div>
          <div className="flex justify-between items-center my-4">
            <span className="text-green-600 font-bold text-2xl product-detail-price-text">
              ₹{product.salePrice}
            </span>
            {product.price && (
              <span className="line-through text-gray-500 text-xl  product-detail-price-text">
                ₹{product.price}
              </span>
            )}
          </div>
          <ul className="list-disc pl-6">
            <li>Brand: {product.brand}</li>
            <li>Category: {product.categoryName}</li>
            <li>Dimensions: {product.dimensions}</li>
            <li>Usage Frequency: {product.usageFrequency}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
