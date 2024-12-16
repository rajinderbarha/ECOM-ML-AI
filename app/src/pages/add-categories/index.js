import { useState } from 'react';
import axios from 'axios';

const AddCategory = () => {
    const [name, setName] = useState('');
    const [breadcrumb, setBreadcrumb] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('breadcrumb', breadcrumb);
        formData.append('image', image);

        try {
            const res = await axios.post('http://localhost:5000/api/add-category', formData);
            console.log(res.data);
            alert('Category added successfully!');
        } catch (error) {
            console.error(error);
            alert('Error adding category!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md h-screen  mx-auto mt-10 text-slate-950">
            <h1 className="text-2xl text-white font-bold mb-5">Add Category</h1>
            <form className="space-y-5 text-white" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-white text-sm font-medium mb-2">Name</label>
                    <input
                        type="text"
                        className="w-full text-black p-2 border rounded"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-white text-sm font-medium mb-2">Breadcrumb</label>
                    <input
                        type="text"
                        className="w-full text-black p-2 border rounded"
                        value={breadcrumb}
                        onChange={(e) => setBreadcrumb(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-white text-sm font-medium mb-2">Image</label>
                    <input
                        type="file"
                        className="w-full text-white p-2 border rounded"
                        onChange={(e) => setImage(e.target.files[0])}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    disabled={loading}
                >
                    {loading ? 'Adding...' : 'Add Category'}
                </button>
            </form>
        </div>
    );
};

export default AddCategory;
