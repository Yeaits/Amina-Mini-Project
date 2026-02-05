import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import NavBar from '../../components/NavBar';
import MedicineCard from '../../components/MedicineCard';

export default function PharmacyDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [pharmacy, setPharmacy] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [cart, setCart] = useState([]);
  const [pickupTime, setPickupTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPharmacyDetails();
      fetchMedicines();
    }
  }, [id]);

  const fetchPharmacyDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/pharmacies/${id}`);
      setPharmacy(response.data);
    } catch (err) {
      console.error('Error fetching pharmacy:', err);
      setError('Failed to load pharmacy details');
    }
  };

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:4000/api/medicines/pharmacy/${id}`);
      setMedicines(response.data);
    } catch (err) {
      console.error('Error fetching medicines:', err);
      setError('Failed to load medicines');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (medicine) => {
    const existingItem = cart.find((item) => item._id === medicine._id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item._id === medicine._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...medicine, quantity: 1 }]);
    }
    setShowCart(true);
  };

  const updateQuantity = (medicineId, newQuantity) => {
    if (newQuantity === 0) {
      setCart(cart.filter((item) => item._id !== medicineId));
    } else {
      setCart(
        cart.map((item) =>
          item._id === medicineId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    try {
      const orderData = {
        pharmacyId: id,
        items: cart.map((item) => ({
          medicineId: item._id,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        pickupTime: pickupTime || null,
      };

      const response = await axios.post(
        'http://localhost:4000/api/orders',
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert('Order placed successfully!');
      router.push('/customer/orders');
    } catch (err) {
      console.error('Checkout error:', err);
      alert(err.response?.data?.message || 'Failed to place order');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <div className="max-w-7xl mx-auto p-6 text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <div className="max-w-7xl mx-auto p-6 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <NavBar />

      <main className="max-w-7xl mx-auto p-6">
        {/* Pharmacy Header */}
        {pharmacy && (
          <div className="card mb-6">
            <h1 className="text-3xl font-bold mb-2">{pharmacy.name}</h1>
            <p className="text-gray-600">{pharmacy.address}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Medicines List */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">Available Medicines</h2>

            {medicines.length === 0 ? (
              <div className="card text-center py-8">
                <p className="text-gray-500">No medicines available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {medicines.map((medicine) => (
                  <MedicineCard
                    key={medicine._id}
                    medicine={medicine}
                    onAdd={addToCart}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-6">
              <h3 className="text-xl font-semibold mb-4">
                Your Cart ({cart.length})
              </h3>

              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Cart is empty</p>
              ) : (
                <>
                  <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item._id} className="flex justify-between items-center border-b pb-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            ₹{item.unitPrice.toFixed(2)} each
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="w-6 h-6 bg-gray-200 rounded text-sm"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="w-6 h-6 bg-indigo-600 text-white rounded text-sm"
                            disabled={item.quantity >= item.stock}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mb-4">
                    <label className="label">Pickup Time (Optional)</label>
                    <input
                      type="datetime-local"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="input text-sm"
                    />
                  </div>

                  <div className="border-t pt-4 mb-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>₹{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <button onClick={handleCheckout} className="btn-primary w-full">
                    Place Order
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
