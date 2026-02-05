import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import NavBar from '../../components/NavBar';
import OrderCard from '../../components/OrderCard';

export default function CustomerOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      router.push('/auth/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    fetchOrders();
    setupNotifications(parsedUser);
  }, []);

  const setupNotifications = (user) => {
    if (window.__socket) {
      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }

      // Identify socket
      window.__socket.emit('identify', {
        userId: user.id,
        role: user.role,
      });

      // Listen for order ready notifications
      window.__socket.on('order-ready', (data) => {
        console.log('Order ready:', data);

        // Show browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Order Ready for Pickup! ✅', {
            body: `Your order is ready at ${data.order.pharmacy.name}`,
            icon: '/icon.png',
          });
        }

        // Refresh orders
        fetchOrders();
      });
    }

    // Cleanup
    return () => {
      if (window.__socket) {
        window.__socket.off('order-ready');
      }
    };
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await axios.get('http://localhost:4000/api/orders/customer', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(response.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      if (err.response?.status === 401) {
        router.push('/auth/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const filterOrdersByStatus = (status) => {
    return orders.filter((order) => order.status === status);
  };

  const activeOrders = orders.filter(
    (o) => !['picked_up', 'cancelled'].includes(o.status)
  );
  const completedOrders = orders.filter((o) =>
    ['picked_up', 'cancelled'].includes(o.status)
  );

  if (loading) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <div className="max-w-7xl mx-auto p-6 text-center">
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <NavBar />

      <main className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-gray-600">Track your medicine orders</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="card bg-blue-50">
            <p className="text-sm text-gray-600">Active Orders</p>
            <p className="text-3xl font-bold text-blue-600">
              {activeOrders.length}
            </p>
          </div>
          <div className="card bg-green-50">
            <p className="text-sm text-gray-600">Ready for Pickup</p>
            <p className="text-3xl font-bold text-green-600">
              {filterOrdersByStatus('ready').length}
            </p>
          </div>
          <div className="card bg-gray-50">
            <p className="text-sm text-gray-600">Total Orders</p>
            <p className="text-3xl font-bold text-gray-600">{orders.length}</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No orders yet</p>
            <p className="text-gray-400 text-sm mb-6">
              Start by finding a nearby pharmacy and ordering medicines
            </p>
            <button
              onClick={() => router.push('/')}
              className="btn-primary"
            >
              Find Pharmacies
            </button>
          </div>
        ) : (
          <>
            {/* Active Orders */}
            {activeOrders.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Active Orders</h2>
                <div className="space-y-4">
                  {activeOrders.map((order) => (
                    <OrderCard
                      key={order._id}
                      order={order}
                      isAdmin={false}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Orders */}
            {completedOrders.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Order History</h2>
                <div className="space-y-4">
                  {completedOrders.map((order) => (
                    <OrderCard
                      key={order._id}
                      order={order}
                      isAdmin={false}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
