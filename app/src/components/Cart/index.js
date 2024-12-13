import React from 'react'

export default function Cart({setCartModalOpen}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1050]">
    <div className="bg-white rounded-lg p-4 w-96 z-[1100]">
      <h2 className="bg-white rounded-lg p-4 w-full z-[1100] text-black">Your Cart</h2>
      {/* Cart Items items go here */}
      <button
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        onClick={() => setCartModalOpen(false)}
      >
        Close
      </button>
    </div>
  </div>
  )
}
