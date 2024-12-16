import { useAppContext } from '@/contexts/AppContext';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { MdClose } from 'react-icons/md';

export default function WishList({ setWishlistModalOpen }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const { user } = useAppContext();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/get-wishlist?userId=${user?.id}`);
        // console.log(response.data);
        setWishlistItems(response.data.wishlist);
      } catch (error) {
        console.log("Error fetching Wishlist", error)
      }
    }
    if (user?.id) fetchWishlist();
  }, [user?.id])

  const removeFromWishlist = async (productId) => {
    try {
      await axios.post('http://localhost:5000/api/remove-from-wishlist', { productId, userId: user.id });
      setWishlistItems((prevItems) => prevItems.filter(item => item.product._id !== productId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  }
  return (
    <div className="fixed  inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1050]">
      <div className="bg-white rounded-lg p-4 m-6 w-[40rem] z-[1100] overflow-hidden">
        <div className='flex justify-between '>
                  <h2 className="text-2xl font-semibold text-black mb-4">Your Wishlist</h2>
                  <MdClose color='black' className='mr-2 mt-2  cursor-pointer ' onClick={() => setWishlistModalOpen(false)} size={24} />
                </div>

        <div className="overflow-y-auto min-h-80 max-h-80"> {/* Scrollable container */}
          {wishlistItems.length > 0 ? (
            wishlistItems.map(item => (
              <div key={item.product._id} className="flex justify-between items-center py-3 px-4 mb-3 bg-gray-100 text-black rounded-lg shadow-md">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.product.images[0]} // Use the first image of the product
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <h3 className="text-sm truncate">{item.product.name.slice(0, 50)}...</h3>
                    <div className='flex justify-between align-center pt-2'>
                      <p className="text-sm text-gray-500">₹{item.product.salePrice}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => removeFromWishlist(item.product._id)}
                    className="bg-red-500 text-white px-3 py-2 rounded-md text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">You dont have any item in wishlist</p>
          )}
        </div>
      </div>
    </div>
  )
}
