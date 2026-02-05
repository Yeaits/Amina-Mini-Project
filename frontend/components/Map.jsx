import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

export default function Map({ center, pharmacies, onSelect }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="h-72 rounded-lg overflow-hidden shadow bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="h-72 rounded-lg overflow-hidden shadow">
      <MapContainer
        center={center}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {pharmacies.map((pharmacy) => (
          <Marker
            key={pharmacy._id}
            position={[pharmacy.latitude, pharmacy.longitude]}
          >
            <Popup>
              <div className="p-2">
                <div className="font-semibold text-lg">{pharmacy.name}</div>
                <div className="text-sm text-gray-600">{pharmacy.address}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {(pharmacy.distance / 1000).toFixed(2)} km away
                </div>
                <button
                  onClick={() => onSelect(pharmacy)}
                  className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
                >
                  View Pharmacy
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
