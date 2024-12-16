import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function CategoryList() {
    const [categories, setCategories] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/getCategories');
                setCategories(response.data);
                // console.log(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryClick = (category) => {
        // console.log(category);
        router.push(`/shop-by-category?categories=${encodeURIComponent(
            category?.name
        )}`,);
    };

    return (
        <div className="w-full bg-gray-100 py-4">
            <h2 className="text-lg font-bold px-4 mb-2 ps-4">Shop by Category</h2>
            <div className="flex overflow-x-auto py-[10px] space-x-4 px-4 category-list-scroll">
                {categories.map((category) => (
                    <div
                        key={category._id}
                        onClick={() => handleCategoryClick(category)}
                        className="flex-none bg-white shadow-md rounded-lg p-3 cursor-pointer hover:scale-105 transition transform duration-300 ease-in-out"
                    >
                        {category?.image ? (
                            <Image
                                src={category.image}
                                alt={category.name}
                                className="object-cover rounded-md max-w-[200px] max-h-[200px]"
                                width={200}  // Specify width
                                height={200} // Specify height
                            />
                        ) : (
                            <div className="w-32 h-32 bg-gray-200 rounded-md flex items-center justify-center">
                                <span className="text-gray-500">No Image</span>
                            </div>
                        )}
                        <span className="text-sm font-semibold text-gray-700 mt-2 category-list-text">{category.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
