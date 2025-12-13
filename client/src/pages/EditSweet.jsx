import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API_URL from '../config';

function EditSweet() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        quantity: ''
    });

    useEffect(() => {
        const fetchSweet = async () => {
            const token = localStorage.getItem('auth-token');
            const res = await fetch('${API_URL}/sweets', {
                headers: { 'auth-token': token }
            });
            const data = await res.json();
            const sweet = data.find(s => s._id === id);

            if (sweet) {
                setFormData({
                    name: sweet.name,
                    category: sweet.category,
                    price: sweet.price,
                    quantity: sweet.quantity
                });
            }
        };
        fetchSweet();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('auth-token');

        try {
            const res = await fetch(`http://localhost:5000/api/sweets/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: JSON.stringify({
                    ...formData,
                    price: Number(formData.price),
                    quantity: Number(formData.quantity)
                })
            });

            if (res.ok) {
                alert('Sweet Updated Successfully!');
                navigate('/');
            } else {
                alert('Failed to update sweet');
            }
        } catch (err) {
            alert('Error connecting to server');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-yellow-50">
            <div className="bg-white p-8 rounded-lg shadow-md w-96 border border-yellow-200">
                <h2 className="text-2xl font-bold mb-6 text-center text-yellow-600">
                    Edit Sweet
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        />
                    </div>
                    <div className="flex gap-4 mb-6">
                        <div className="w-1/2">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Price</label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                onFocus={(e) => e.target.select()}
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Quantity</label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                onFocus={(e) => e.target.select()}
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-yellow-500 text-white font-bold py-2 px-4 rounded hover:bg-yellow-600">
                        Save Changes
                    </button>
                    <button type="button" onClick={() => navigate('/')} className="w-full mt-2 text-gray-500 text-sm">
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditSweet;