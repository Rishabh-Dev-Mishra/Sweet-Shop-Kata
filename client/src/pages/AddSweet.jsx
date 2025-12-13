import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

function AddSweet() {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('auth-token');

        try {
            const res = await fetch('${API_URL}/sweets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: JSON.stringify({
                    name,
                    category,
                    price: Number(price),
                    quantity: Number(quantity)
                })
            });

            if (res.ok) {
                alert('Sweet Added Successfully! 🍨');
                navigate('/'); // Go back home to see it
            } else {
                alert('Failed to add sweet');
            }
        } catch (err) {
            alert('Error connecting to server');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-pink-50">
            <div className="bg-white p-8 rounded-lg shadow-md w-96 border border-pink-100">
                <h2 className="text-2xl font-bold mb-6 text-center text-pink-600">
                    Add New Sweet
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Sweet Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
                        <input
                            type="text"
                            placeholder="e.g. Chocolate, Hard Candy"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex gap-4 mb-6">
                        <div className="w-1/2">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Price ($)</label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Quantity</label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-pink-500 text-white font-bold py-2 px-4 rounded hover:bg-pink-600 transition duration-200"
                    >
                        Add to Inventory
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="w-full mt-2 text-gray-500 text-sm hover:underline"
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddSweet;