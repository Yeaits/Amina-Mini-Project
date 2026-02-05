import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function NavBar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Failed to parse user:', e);
        }
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      router.push('/auth/login');
    }
  };

  return (
    <nav className="w-full py-4 px-6 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="text-2xl font-bold text-indigo-600">💊 MediPickup</div>
            <div className="hidden md:block text-sm text-gray-500">
              Fast medicine pickup from nearby pharmacies
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/"
            className="text-gray-700 hover:text-indigo-600 transition-colors">
              Find Pharmacy
            
          </Link>

          {user ? (
            <>
              {user.role === 'admin' ? (
                <Link href="/admin"
                  className="text-gray-700 hover:text-indigo-600 transition-colors">
                    Admin Dashboard
                  
                </Link>
              ) : (
                <Link href="/customer/orders"
                  className="text-gray-700 hover:text-indigo-600 transition-colors">
                    My Orders
                  
                </Link>
              )}

              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600">
                  Hi, <span className="font-medium">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/auth/login"
                 className="text-indigo-600 hover:text-indigo-700 transition-colors">
                  Login
                
              </Link>
              <Link href="/auth/register"
                 className="btn-primary">Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
