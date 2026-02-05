import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import NavBar from '../../components/NavBar';

export default function ManagePharmacies() {
  const router = useRouter();
  const [pharmacies, setPharmacies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || user.role !== 'admin') {
      router.push('/auth/login');
      return;
    }

    fetchPharmacies();
  }, []);

  const fetchPharmacies = async () => {
    try {
      // Fetch all pharmacies (you may want to filter by owner in production)
      const response = await axios.get('http://localhost:4000/api/pharmacies/nearby?lat=17.4239&lng=78.4738&radius=50000');
      setPharmacies(response.data);
    } catch (err) {
      console.error('Error fetching pharmacies:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:4000/api/pharmacies',
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert('Pharmacy created successfully!');
      setShowForm(false);
      setFormData({
        name: '',
        address: '',
        latitude: '',
        longitude: '',
      });
      fetchPharmacies();
    } catch (err) {
      console.error('Error creating pharmacy:', err);
      alert(err.response?.data?.message || 'Failed to create pharmacy');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          });
          alert('Location captured! Latitude and Longitude fields updated.');
        },
        (error) => {
          alert('Unable to get location. Please enter manually.');
        }
      );
    }
  };

  const fillSampleData = () => {
    setFormData({
      name: 'My Demo Pharmacy',
      address: 'Near Gandhi Nagar, Hyderabad',
      latitude: '17.4350',
      longitude: '78.4400',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <NavBar />

      <main className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Pharmacies</h1>
            <p className="text-gray-600">Create and manage your pharmacy locations</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
          >
            {showForm ? 'Cancel' : '+ Add New Pharmacy'}
          </button>
        </div>

        {/* Create Pharmacy Form */}
        {showForm && (
          <div className="card mb-6 bg-blue-50">
            <h2 className="text-xl font-semibold mb-4">Add New Pharmacy</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Pharmacy Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., MediCare Pharmacy"
                  required
                />
              </div>

              <div>
                <label className="label">Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., Banjara Hills, Hyderabad"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Latitude *</label>
                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    className="input"
                    placeholder="17.4239"
                    required
                  />
                </div>
                <div>
                  <label className="label">Longitude *</label>
                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    className="input"
                    placeholder="78.4738"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={useCurrentLocation}
                  className="btn-secondary"
                >
                  📍 Use Current Location
                </button>
                <button
                  type="button"
                  onClick={fillSampleData}
                  className="btn-secondary"
                >
                  📝 Fill Sample Data
                </button>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm">
                <p className="font-medium mb-1">💡 Tip for getting coordinates:</p>
                <ol className="list-decimal list-inside space-y-1 text-gray-700">
                  <li>Go to <a href="https://www.google.com/maps" target="_blank" className="text-blue-600 underline">Google Maps</a></li>
                  <li>Right-click on your pharmacy location</li>
                  <li>Click on the coordinates at the top to copy them</li>
                  <li>Paste here (format: Latitude, Longitude)</li>
                </ol>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? 'Creating...' : 'Create Pharmacy'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Pharmacies List */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Pharmacies ({pharmacies.length})</h2>

          {pharmacies.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-500 text-lg mb-4">No pharmacies yet</p>
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary"
              >
                Create Your First Pharmacy
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pharmacies.map((pharmacy) => (
                <div key={pharmacy._id} className="card">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-semibold">{pharmacy.name}</h3>
                      <p className="text-sm text-gray-600">{pharmacy.address}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      Active
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                    <div>
                      <p className="text-gray-500">Latitude</p>
                      <p className="font-medium">{pharmacy.latitude}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Longitude</p>
                      <p className="font-medium">{pharmacy.longitude}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t">
                    <button
                      onClick={() => router.push(`/admin?pharmacy=${pharmacy._id}`)}
                      className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                      View Orders
                    </button>
                    <button
                      onClick={() => router.push(`/pharmacy/${pharmacy._id}`)}
                      className="flex-1 px-3 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    >
                      View as Customer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
