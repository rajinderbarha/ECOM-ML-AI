import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function ProductForm() {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        salePrice: '',
        discount: '',
        weight: '',
        dimensions: '',
        brand: '',
        categoryName: '',
        usageFrequency: 'daily',
        images: null,
    });
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/categories/categories');
                setCategories(response.data);
                // console.log(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, images: e.target.files });
    };


    const clearFileInput = () => {
        fileInputRef.current.value = null;
    };


    const handleSubmit = async (e) => {
        setIsLoading(true)
        e.preventDefault();
        const form = new FormData();

        Object.keys(formData).forEach(key => {
            if (key === 'images') {
                Array.from(formData.images).forEach(file => form.append('images', file));
            } else {
                form.append(key, formData[key]);
            }
        });

        try {
            const response = await axios.post('http://localhost:5000/api/categories/add-product', form, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Product added successfully!');
            setFormData({
                name: '',
                description: '',
                price: '',
                salePrice: '',
                discount: '',
                weight: '',
                dimensions: '',
                brand: '',
                categoryName: '',
                usageFrequency: 'daily',
                images: null,
            });
            clearFileInput();
        } catch (error) {
            alert('Failed to add product. ' + (error.response?.data.message || error.message));
        } finally{
            setIsLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto p-8  m-24 bg-white text-black  shadow-md rounded-lg space-y-8"
        >
            <h1 className="text-3xl font-bold text-center text-gray-800">Add New Product</h1>

            {/* Section: Product Details */}
            <section className="grid gap-6">
                <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                    className="input-field"
                    required
                />
            </section>

            {/* Section: Pricing and Dimensions */}
            <section className="grid grid-cols-2 gap-6">
                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleChange}
                    className="input-field"
                    required
                />
                <input
                    type="number"
                    name="salePrice"
                    placeholder="Sale Price"
                    value={formData.salePrice}
                    onChange={handleChange}
                    className="input-field"
                />
                <input
                    type="text"
                    name="dimensions"
                    placeholder="Dimensions (e.g., 10x5x3 cm)"
                    value={formData.dimensions}
                    onChange={handleChange}
                    className="input-field"
                />
                <input
                    type="text"
                    name="brand"
                    placeholder="Brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="input-field"
                />
            </section>
            <section className="grid gap-6">
                <label htmlFor="usageFrequency" className="text-sm font-medium text-gray-600">Usage Frequency</label>
                <select
                    name="usageFrequency"
                    value={formData.usageFrequency}
                    onChange={handleChange}
                    className="input-field"
                    required
                >
                    <option value="" disabled>Select Usage Frequency</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                </select>
            </section>

            {/* Section: Category and Images */}
            <section className="grid gap-6">
                <select
                    name="categoryName"
                    value={formData.categoryName}
                    onChange={handleChange}
                    className="input-field"
                    required
                >
                    <option value="" disabled>Select Category</option>
                    {categories.map((category) => (
                        <option key={category._id} value={category.name}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <input
                    type="file"
                    name="images"
                    multiple
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="file-input"
                />

            </section>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                disabled={isLoading}
            >
                {isLoading ? 'Submitting...' : 'Submit'}
            </button>
        </form>
    );

}
