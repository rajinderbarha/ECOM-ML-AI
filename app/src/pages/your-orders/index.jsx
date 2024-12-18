import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

const YourOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const { data: session } = useSession();

    useEffect(() => {
        const fetchOrders = async () => {
            if (!session?.user?.id) return; 
            try {
                const userId = session.user.id;
                const response = await axios.get(`http://localhost:5000/api/user-orders/${userId}`);
                setOrders(response.data.orders);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching orders:", error);
                setLoading(false);
            }
        };

        fetchOrders();
    }, [session?.user?.id]);

    if (loading) return <div>Loading your orders...</div>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
            {orders.length === 0 ? (
                <p>You have no orders yet.</p>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div
                            key={order._id}
                            className="p-4 border rounded-md shadow-sm bg-white space-y-2"
                        >
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-semibold">Order ID: {order._id}</h2>
                                <span className="text-sm text-gray-500">
                                    Placed on: {new Date(order.placedAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Status: {order.status}</p>
                                <p className="text-sm text-gray-600">
                                    Total Amount: ₹{order.totalAmount.toFixed(2)}
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Items:</h3>
                                <ul className="list-disc list-inside">
                                    {order.items.map(item => (
                                        <li key={item.product._id} className="text-sm">
                                            {item.product.name} - Quantity: {item.quantity}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default YourOrders;
