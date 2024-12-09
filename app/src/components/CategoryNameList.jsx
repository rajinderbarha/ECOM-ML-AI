import { useEffect, useState } from 'react';
import axios from 'axios';

export default function CategoryNameList() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/categories/getCategoryNames');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="w-full bg-gray-100 py- pt-8">
            <h2 className="text-lg font-bold px-4 mb-2">Categories</h2>
            <div className="flex overflow-x-auto space-x-4 px-4 hide-scrollbar">
                {categories.map((category) => (
                    <div
                        key={category._id}
                        className="flex-none bg-white shadow-md rounded-lg p-3 min-w-[120px] text-center cursor-pointer hover:bg-gray-200 transition"
                    >
                        <span className="text-sm font-semibold text-gray-700">{category.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
