import '../styles/globals.css';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Setup Socket.IO connection
    if (typeof window !== 'undefined' && !window.__socket) {
      window.__socket = io('http://localhost:4000');
      console.log('Socket.IO connected');
    }

    // Load user from localStorage
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

    // Setup notification permissions
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }

    // Cleanup socket on unmount
    return () => {
      if (window.__socket) {
        window.__socket.disconnect();
        window.__socket = null;
      }
    };
  }, []);

  return <Component {...pageProps} user={user} setUser={setUser} />;
}

export default MyApp;
