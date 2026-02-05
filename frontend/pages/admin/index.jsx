import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import NavBar from '../../components/NavBar';
import OrderCard from '../../components/OrderCard';

export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check authentication and role
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      router.push('/auth/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    if (parsedUser.role !== 'admin') {
      router.push('/');
      return;
    }

    // First fetch pharmacies, then orders
    fetchPharmacies();
  }, []);

  useEffect(() => {
    if (selectedPharmacy && user) {
      fetchOrders(selectedPharmacy._id);
      setupNotifications(user, selectedPharmacy._id);
    }
  }, [selectedPharmacy]);

  const fetchPharmacies = async () => {
    try {
      // Fetch all pharmacies in Hyderabad area
      const response = await axios.get(
        'http://localhost:4000/api/pharmacies/nearby?lat=17.4239&lng=78.4738&radius=50000'
      );
      const pharmacyList = response.data;
      setPharmacies(pharmacyList);
      
      // Auto-select first pharmacy
      if (pharmacyList.length > 0) {
        setSelectedPharmacy(pharmacyList[0]);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching pharmacies:', err);
      setLoading(false);
    }
  };

  const setupNotifications = (user, pharmId) => {
    if (window.__socket) {
      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }

      // Identify socket
      window.__socket.emit('identify', {
        userId: user.id,
        role: user.role,
        pharmacyId: pharmId,
      });

      // Listen for new orders
      window.__socket.on('new-order', (data) => {
        console.log('New order received:', data);
        
        // Show browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('New Order Received! 🎉', {
            body: `Order from ${data.order.customer.name}`,
            icon: '/icon.png',
          });
        }

        // Refresh orders
        fetchOrders(pharmId);
      });

      // Listen for order updates
      window.__socket.on('order-updated', (data) => {
        console.log('Order updated:', data);
        fetchOrders(pharmId);
      });
    }

    // Cleanup
    return () => {
      if (window.__socket) {
        window.__socket.off('new-order');
        window.__socket.off('order-updated');
      }
    };
  };

  const fetchOrders = async (pharmId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `http://localhost:4000/api/orders/pharmacy/${pharmId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:4000/api/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Refresh orders
      fetchOrders(selectedPharmacy._id);
    } catch (err) {
      console.error('Error updating order:', err);
      alert('Failed to update order status');
    }
  };

  const filterOrdersByStatus = (status) => {
    return orders.filter((order) => order.status === status);
  };

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
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">
              Manage orders and inventory for your pharmacy
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/admin/pharmacies')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              🏥 Manage Pharmacies
            </button>
          </div>
        </div>

        {/* Pharmacy Selector and Statistics */}
        {selectedPharmacy && (
          <>
            <div className="card bg-indigo-50 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">📍 {selectedPharmacy.name}</h2>
                  <p className="text-sm text-gray-600">{selectedPharmacy.address}</p>
                </div>
                {pharmacies.length > 1 && (
                  <select
                    value={selectedPharmacy._id}
                    onChange={(e) => {
                      const pharmacy = pharmacies.find(p => p._id === e.target.value);
                      setSelectedPharmacy(pharmacy);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    {pharmacies.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="card bg-blue-50">
                <p className="text-sm text-gray-600">New Orders</p>
                <p className="text-3xl font-bold text-blue-600">
                  {filterOrdersByStatus('placed').length}
                </p>
              </div>
              <div className="card bg-yellow-50">
                <p className="text-sm text-gray-600">Packing</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {filterOrdersByStatus('packed').length}
                </p>
              </div>
              <div className="card bg-green-50">
                <p className="text-sm text-gray-600">Ready</p>
                <p className="text-3xl font-bold text-green-600">
                  {filterOrdersByStatus('ready').length}
                </p>
              </div>
              <div className="card bg-gray-50">
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-gray-600">
                  {orders.length}
                </p>
              </div>
            </div>

            {/* Orders List */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Recent Orders</h2>

              {orders.length === 0 ? (
                <div className="card text-center py-12">
                  <p className="text-gray-500 text-lg">No orders yet</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Orders will appear here when customers place them
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <OrderCard
                      key={order._id}
                      order={order}
                      onStatusUpdate={handleStatusUpdate}
                      isAdmin={true}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {!selectedPharmacy && !loading && (
          <div className="card text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No pharmacies found</p>
            <p className="text-gray-400 text-sm mb-6">
              Create a pharmacy to start receiving orders
            </p>
            <button
              onClick={() => router.push('/admin/pharmacies')}
              className="btn-primary"
            >
              Create Pharmacy
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
