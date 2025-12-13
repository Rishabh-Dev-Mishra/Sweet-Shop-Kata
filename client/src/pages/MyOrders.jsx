import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('auth-token');
            if (!token) return navigate('/login');

            const res = await fetch('${API_URL}/sweets/my/orders', {
                headers: { 'auth-token': token }
            });
            const data = await res.json();
            setOrders(data);
        };
        fetchOrders();
    }, [navigate]);

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
                                            Ordered on {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Quantity</p>
                                        <p className="font-medium text-gray-700">x {order.quantity}</p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total</p>
                                        <p className="text-xl font-bold text-green-600">${order.totalPrice}</p>
                                    </div>

                                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                                        PAID
                                    </div>
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