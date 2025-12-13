import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

function Home() {
    const [sweets, setSweets] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [userRole, setUserRole] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSweets = async () => {
            const token = localStorage.getItem('auth-token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const res = await fetch(`${API_URL}/sweets`, {
                    headers: { 'auth-token': token }
                });
                if (res.status === 401) {
                    navigate('/login');
                    return;
                }
                const data = await res.json();
                setSweets(data);
                const role = localStorage.getItem('user-role');
                setUserRole(role);
            } catch (err) {
                setError('Failed to load sweets');
            }
        };
        fetchSweets();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('user-role');
        navigate('/login');
    };

    const filteredSweets = sweets.filter(sweet =>
        sweet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sweet.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePurchase = async (id) => {
        const token = localStorage.getItem('auth-token');
        try {
            const res = await fetch(`http://localhost:5000/api/sweets/${id}/purchase`, {
                method: 'POST',
                headers: {
                    'auth-token': token,
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();
            if (res.ok) {
                setSweets(sweets.map(sweet =>
                    sweet._id === id ? { ...sweet, quantity: data.quantity } : sweet
                ));
            } else {
                alert(data.message);
            }
        } catch (err) {
            alert("Error purchasing sweet");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this sweet?")) return;
        const token = localStorage.getItem('auth-token');
        await fetch(`http://localhost:5000/api/sweets/${id}`, {
            method: 'DELETE',
            headers: { 'auth-token': token }
        });
        setSweets(sweets.filter(s => s._id !== id));
    };

    const handleRestock = async (id) => {
        const token = localStorage.getItem('auth-token');
        const res = await fetch(`http://localhost:5000/api/sweets/${id}/restock`, {
            method: 'POST',
            headers: { 'auth-token': token }
        });
        const data = await res.json();
        setSweets(sweets.map(s => s._id === id ? { ...s, quantity: data.quantity } : s));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
                <h1 className="text-xl font-bold text-pink-600">(❁´◡`❁) Sweet Shop</h1>

                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/orders')}
                        className="text-gray-600 hover:text-blue-500 font-medium"
                    >
                        My Orders
                    </button>

                    <button
                        onClick={handleLogout}
                        className="text-gray-600 hover:text-red-500 font-medium"
                    >
                        Logout
                    </button>
                </div>

                
            </nav>

            <div className="container mx-auto p-8">
                <div className="mb-8 flex justify-center">
                    <input
                        type="text"
                        placeholder="Search for chocolates, candies..."
                        className="w-full max-w-md px-4 py-2 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {error && <p className="text-red-500 text-center">{error}</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSweets.map(sweet => (
                        <div key={sweet._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex flex-col justify-between">

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">{sweet.name}</h3>
                                        <span className="inline-block bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full mt-1">
                                            {sweet.category}
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold text-green-600">₹{sweet.price}</p>
                                </div>

                                <div className="flex justify-between items-center mt-6">
                                    <p className={`text-sm font-medium ${sweet.quantity > 0 ? 'text-gray-600' : 'text-red-500'}`}>
                                        Stock: {sweet.quantity} Kg
                                    </p>

                                    <button
                                        className={`px-4 py-2 rounded-lg font-bold text-white transition-colors duration-200 
                                            ${sweet.quantity > 0
                                                ? 'bg-blue-500 hover:bg-blue-600'
                                                : 'bg-gray-400 cursor-not-allowed'
                                            }`}
                                        disabled={sweet.quantity === 0}
                                        onClick={() => handlePurchase(sweet._id)}
                                    >
                                        {sweet.quantity > 0 ? 'Purchase' : 'Out of Stock'}
                                    </button>
                                </div>
                            </div>

                            {userRole === 'admin' && (
                                <div className="bg-gray-50 px-6 py-3 border-t flex gap-2">
                                    <button
                                        onClick={() => handleRestock(sweet._id)}
                                        className="flex-1 bg-yellow-500 text-white py-1 rounded hover:bg-yellow-600 text-xs font-bold"
                                    >
                                        +5 Stock
                                    </button>
                                    <button
                                        onClick={() => navigate(`/edit/${sweet._id}`)}
                                        className="flex-1 bg-blue-500 text-white py-1 rounded hover:bg-blue-600 text-xs font-bold"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(sweet._id)}
                                        className="flex-1 bg-red-600 text-white py-1 rounded hover:bg-red-700 text-xs font-bold"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {filteredSweets.length === 0 && (
                    <p className="text-center text-gray-500 mt-10">No sweets found.</p>
                )}
            </div>
        </div>
    );
}

export default Home;