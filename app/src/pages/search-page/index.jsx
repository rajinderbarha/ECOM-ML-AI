import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ProductCard from "@/components/ProductCard";

const SearchPage = () => {
  const router = useRouter();
  const { search } = router.query;
  console.log(search);
  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    priceRange: [0, 1000],
    inStock: false,
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Prepare query parameters
      const query = new URLSearchParams({
        search: search || "",
        category: filters.category,
        brand: filters.brand,
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
        inStock: filters.inStock,
      }).toString();

      // Fetch products from the backend
      const response = await fetch(`http://localhost:5000/api/search?${query}`);
      const data = await response.json();

      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
  fetchProducts();
}, [search, filters]);


  return (
    <div className="flex">
      {/* Filters Section */}
      <aside className="w-1/4 p-4 bg-gray-100 sticky top-0 h-screen">
        <h2 className="text-xl font-bold mb-4">Filters</h2>
        <div className="mb-4">
          <label className="block font-medium">Category</label>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded"
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="fashion">Fashion</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block font-medium">Brand</label>
          <input
            type="text"
            value={filters.brand}
            onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
            placeholder="Search Brand"
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Price Range</label>
          <input
            type="range"
            min="0"
            max="1000"
            value={filters.priceRange[1]}
            onChange={(e) =>
              setFilters({ ...filters, priceRange: [0, Number(e.target.value)] })
            }
          />
          <span>{filters.priceRange[1]}</span>
        </div>
        <div className="mb-4">
          <label className="block font-medium">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) =>
                setFilters({ ...filters, inStock: e.target.checked })
              }
            />
            In Stock Only
          </label>
        </div>
        <button
          onClick={() => fetchProducts()}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Apply Filters
        </button>
        <button
          onClick={() => setFilters({ category: "", brand: "", priceRange: [0, 1000], inStock: false })}
          className="bg-gray-500 text-white py-2 px-4 rounded"
        >
          Reset Filters
        </button>

      </aside>

      {/* Products Section */}
      <main className="w-3/4 p-4">
        <h2 className="text-xl font-bold mb-4">Products</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {products?.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchPage;
