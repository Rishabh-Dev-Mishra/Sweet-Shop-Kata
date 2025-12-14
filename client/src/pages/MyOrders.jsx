import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, [navigate]);

    const fetchOrders = async () => {
        const token = localStorage.getItem('auth-token');
        if (!token) return navigate('/login');

        try {
            const res = await fetch(`${API_URL}/sweets/my/orders`, {
                headers: { 'auth-token': token }
            });
            const data = await res.json();
            setOrders(data);
        } catch (err) {
            console.error(err);
        }
    };

    // 👇 NEW FUNCTION: Handle Order Deletion
    const handleRemoveOrder = async (orderId) => {
        if (!confirm("Are you sure you want to remove this order from your history?")) return;

        const token = localStorage.getItem('auth-token');
        try {
            const res = await fetch(`${API_URL}/sweets/orders/${orderId}`, {
                method: 'DELETE',
                headers: { 'auth-token': token }
            });

            if (res.ok) {
                // Update UI instantly by filtering out the deleted order
                setOrders(orders.filter(order => order._id !== orderId));
            } else {
                alert("Failed to delete order");
            }
        } catch (err) {
            alert("Error connecting to server");
        }
    };

    return (
        <div className="min-h-screen bg-pink-50 p-4 md:p-8">
            <div className="max-w-3xl mx-auto">

                <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800"> Purchase History</h2>
                        <p className="text-gray-500 text-sm mt-1">Track your sweet treats</p>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="px-4 py-2 bg-pink-100 text-pink-600 rounded-lg font-medium hover:bg-pink-200 transition-colors"
                    >
                        ← Shop More
                    </button>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                        <p className="text-6xl mb-4">🍩</p>
                        <p className="text-gray-500 text-lg">No purchases yet.</p>
                        <button onClick={() => navigate('/')} className="mt-4 text-pink-500 font-bold hover:underline">
                            Start Buying!
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {orders.map(order => (
                            <div key={order._id} className="bg-white p-6 rounded-xl shadow-sm border border-pink-100 hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-center gap-4">

                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-xl">
                                        🍬
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-800">{order.sweetName}</h3>
                                        <p className="text-xs text-gray-500">
                                            Ordered on {new Date(order.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Qty</p>
                                        <p className="font-medium text-gray-700">x {order.quantity}</p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total</p>
                                        <p className="text-xl font-bold text-green-600">₹{order.totalPrice}</p>
                                    </div>

                                    {/* 👇 NEW: Remove Button */}
                                    <button
                                        onClick={() => handleRemoveOrder(order._id)}
                                        className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors"
                                        title="Remove Order"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyOrders;