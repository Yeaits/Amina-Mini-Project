import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NavBar from '../components/NavBar';
import Map from '../components/Map';
import axios from 'axios';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [coords, setCoords] = useState([17.4239, 78.4738]); // Default: Hyderabad, India
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Automatically load Hyderabad pharmacies on page load
    loadHyderabadPharmacies();
  }, []);

  const loadHyderabadPharmacies = () => {
    console.log('Loading Hyderabad pharmacies...');
    setCoords([17.4239, 78.4738]);
    fetchNearbyPharmacies(17.4239, 78.4738);
  };

  const fetchNearbyPharmacies = async (lat, lng) => {
    try {
      setLoading(true);
      console.log(`Fetching pharmacies near: ${lat}, ${lng}`);
      
      const response = await axios.get(
        `http://localhost:4000/api/pharmacies/nearby?lat=${lat}&lng=${lng}&radius=50000`
      );
      
      console.log('Pharmacies found:', response.data.length);
      setPharmacies(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching pharmacies:', err);
      setError('Failed to load pharmacies. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const openPharmacy = (pharmacy) => {
    router.push(`/pharmacy/${pharmacy._id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <NavBar />

      <main className="max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Find Nearby Pharmacies
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Order medicines online and skip the queue
          </p>
          
          {/* Always show button for easy access */}
          <button
            onClick={loadHyderabadPharmacies}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium mb-4"
          >
            🔄 {pharmacies.length > 0 ? 'Refresh' : 'Load'} Hyderabad Pharmacies
          </button>
          
          {loading && (
            <p className="text-gray-500 text-sm">Loading pharmacies...</p>
          )}
          
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg max-w-md mx-auto">
              {error}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map and Pharmacy List */}
          <div className="lg:col-span-2">
            {!loading && pharmacies.length > 0 && (
              <Map
                center={coords}
                pharmacies={pharmacies}
                onSelect={openPharmacy}
              />
            )}
            
            {loading && (
              <div className="h-72 bg-white rounded-lg shadow flex items-center justify-center">
                <p className="text-gray-500">Loading map...</p>
              </div>
            )}

            <div className="mt-6">
              <h2 className="text-2xl font-semibold mb-4">
                Available Pharmacies ({pharmacies.length})
              </h2>

              {pharmacies.length === 0 && !loading ? (
                <div className="card text-center py-12">
                  <p className="text-gray-500 text-xl mb-4">
                    No pharmacies loaded yet
                  </p>
                  <p className="text-gray-400 mb-6">
                    Click the button above to load Hyderabad pharmacies
                  </p>
                  <button
                    onClick={loadHyderabadPharmacies}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                  >
                    📍 Load Pharmacies Now
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {pharmacies.map((pharmacy) => (
                    <div
                      key={pharmacy._id}
                      className="card flex items-center justify-between hover:shadow-xl transition-shadow"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {pharmacy.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {pharmacy.address}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          📍 {(pharmacy.distance / 1000).toFixed(1)} km away
                        </p>
                      </div>
                      <Link href={`/pharmacy/${pharmacy._id}`}
                        className="btn-primary">View Medicines
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="card">
              <h3 className="font-semibold text-lg mb-3">Why MediPickup?</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 text-xl">✓</span>
                  <div>
                    <p className="font-medium">Skip the Queue</p>
                    <p className="text-sm text-gray-600">
                      Order online and pick up when ready
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 text-xl">✓</span>
                  <div>
                    <p className="font-medium">Real-time Updates</p>
                    <p className="text-sm text-gray-600">
                      Get notified when your order is ready
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 text-xl">✓</span>
                  <div>
                    <p className="font-medium">Find Nearby</p>
                    <p className="text-sm text-gray-600">
                      See pharmacies in Hyderabad area
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 text-xl">✓</span>
                  <div>
                    <p className="font-medium">Schedule Pickup</p>
                    <p className="text-sm text-gray-600">
                      Choose your convenient pickup time
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {pharmacies.length === 0 && (
              <div className="card bg-indigo-50">
                <h3 className="font-semibold text-lg mb-2">Get Started</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Load pharmacies to start ordering medicines
                </p>
                <button
                  onClick={loadHyderabadPharmacies}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Load Pharmacies
                </button>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
