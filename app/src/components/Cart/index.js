import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppContext } from '@/contexts/AppContext';
import { MdClose } from "react-icons/md";

export default function Cart({ setCartModalOpen }) {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAppContext();
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/get-cart?userId=${user?.id}`);
        // console.log(response.data);
        setCartItems(response.data.cart);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    if (user?.id) fetchCart();
  }, [user?.id]);


  const removeFromCart = async (productId) => {
    try {
      await axios.post('http://localhost:5000/api/remove-from-cart', { productId, userId: user.id });
      setCartItems((prevItems) => prevItems.filter(item => item.product._id !== productId)); // Update the UI
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.product.salePrice * item.quantity;
    }, 0);
  };

  const handleCheckout = () => {
    setCheckoutModalOpen(true);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1050]">
        <div className="bg-white rounded-lg p-4 m-6 w-[40rem] z-[1100] overflow-hidden">
          <div className='flex justify-between'>
            <h2 className="text-2xl font-semibold text-black mb-4">Your Cart</h2>
            <MdClose
              color='black'
              className='mr-2 mt-2 cursor-pointer'
              onClick={() => setCartModalOpen(false)}
              size={24}
            />
          </div>

          <div className="overflow-y-auto min-h-80 max-h-80">
            {cartItems.length > 0 ? (
              cartItems.map(item => (
                <div key={item.product._id} className="flex justify-between items-center py-3 px-4 mb-3 bg-gray-100 text-black rounded-lg shadow-md">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div>
                      <h3 className="text-sm truncate">{item.product.name.slice(0, 50)}...</h3>
                      <div className='flex justify-between align-center pt-2 px-3 font-bold'>
                        <p className="text-sm text-gray-500">₹{item.product.salePrice}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => removeFromCart(item.product._id)}
                      className="bg-red-500 text-white px-3 py-2 rounded-md text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 h-full">Your cart is empty</p>
            )}
          </div>

          <div className="mt-4 flex justify-between items-center">
            <p className="text-lg font-semibold text-black">Total: ₹{calculateTotal()}</p>
            <button
              className="bg-sky-700 text-white px-4 py-2 rounded"
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>

      {checkoutModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1050]">
          <div className="bg-white rounded-lg p-4 m-6 w-[40rem] z-[1100] overflow-hidden">
            <div className='flex justify-between'>
              <h2 className="text-2xl font-semibold text-black mb-4">Checkout</h2>
              <MdClose
                color='black'
                className='mr-2 mt-2 cursor-pointer'
                onClick={() => setCheckoutModalOpen(false)}
                size={24}
              />
            </div>

            <div className="overflow-y-auto min-h-80 max-h-80">
              {cartItems.map(item => (
                <div key={item.product._id} className="flex justify-between items-center py-3 px-4 mb-3 bg-gray-100 text-black rounded-lg shadow-md">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div>
                      <h3 className="text-sm truncate">{item.product.name.slice(0, 50)}...</h3>
                      <div className='flex justify-between align-center pt-2 px-3 font-bold'>
                        <p className="text-sm text-gray-500">₹{item.product.salePrice}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-between items-center">
              <p className="text-lg font-semibold text-black">Total: ₹{calculateTotal()}</p>
              <button
                className="bg-green-700 text-white px-4 py-2 rounded"
                onClick={() => alert('Order Placed!')} // Placeholder action
              >
                Buy
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
