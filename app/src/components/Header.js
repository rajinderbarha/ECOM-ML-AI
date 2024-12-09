import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { FiSearch, FiShoppingCart, FiHeart, FiUser, FiX } from "react-icons/fi";

const Header = () => {
  const { data: session } = useSession();
  const [isAccountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [isCartModalOpen, setCartModalOpen] = useState(false);
  const [isWishlistModalOpen, setWishlistModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      // Add search logic here (e.g., API call, navigation)
    }
  };

  const clearSearch = () => setSearchQuery("");

  return (
    <header className="bg-gray-800 text-white py-4 px-6 sticky top-0 left-0 w-full z-[1000]">
      <nav className="flex justify-between items-center">
        {/* Logo */}
        <div>
          <Link href="/" className="text-xl font-bold">
            ECOM-ML-AI
          </Link>
        </div>

        {/* Search */}
        <div className=" items-center justify-center xl:ms-32 lg:mx-10 md:mx-5 max-w-[670px] flex-grow mx-4 relative sm:flex hidden">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full max-w-[670px] px-4 py-2 rounded-md text-gray-800"
          />
          {/* Clear Icon */}
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-10 text-gray-500 hover:text-gray-800"
            >
              <FiX className="text-xl" />
            </button>
          )}
          {/* Search Icon */}
          <button
            onClick={handleSearch}
            className="absolute right-2 text-gray-500 hover:text-gray-800"
          >
            <FiSearch className="text-xl" />
          </button>
        </div>
        <div className=" items-center justify-center xl:ms-32 lg:mx-10 md:mx-5 max-w-[670px] flex-grow mx-4 relative sm:hidden flex">
        <button
            onClick={handleSearch}
            className="absolute right-2 text-white hover:text-white/80"
          >
            <FiSearch className="text-xl " />
          </button>
        </div>
        {/* Icons */}
        <div className="flex items-center gap-6">
          {/* Wishlist */}
          <button
            onClick={() => setWishlistModalOpen(true)}
            className="relative"
          >
            <FiHeart className="text-xl" />
          </button>

          {/* Cart */}
          <button onClick={() => setCartModalOpen(true)} className="relative">
            <FiShoppingCart className="text-xl" />
            {/* <p className="card-count absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">1</p> */}
            <p className="card-count absolute -top-[6px] -right-[8px] text-[10px] leading-none bg-red-500 text-white rounded-full w-[14px] h-[14px] flex items-center justify-center p-[2px]">1</p>
          </button>

          {/* Account */}
          <div className="relative">
            <button
              className="flex items-center gap-2 "
              onClick={() => setAccountDropdownOpen(!isAccountDropdownOpen)}
            >
             <span className="hidden md:inline"> {session ? session.user.name : ""}</span> {session ? <img src={session ? session.user.image : ""} alt="User" className="w-8 h-8 rounded-full" /> : <FiUser className="text-xl" />}
            </button>
            {isAccountDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-2 z-10">
                {session ? (
                  <>
                    <p className="px-4 py-2 truncate">{session.user.email}</p>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-red-500"
                      onClick={() => signOut()}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => signIn("google")}
                  >
                    Login
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Cart Modal */}
      {isCartModalOpen && (
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
      )}

      {/* Wishlist Modal */}
      {isWishlistModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1050]">
          <div className="bg-white rounded-lg p-4 w-96 z-[1100]">
            <h2 className="bg-white rounded-lg p-4 w-full z-[1100] text-black">Your Wishlist</h2>
            {/* Wishlist items go here */}
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setWishlistModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
