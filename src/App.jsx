import { useState, useEffect } from 'react';
import AnimatedBackground from './components/AnimatedBackground/AnimatedBackground';
import OrderingPanel from './components/OrderingPanel/OrderingPanel';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import AdminLogin from './components/AdminLogin/AdminLogin';
import useCart from './hooks/useCart';
import useTableNumber from './hooks/useTableNumber';
import './styles/global.css';

function App() {
  const tableNumber = useTableNumber();
  const cart = useCart();

  // Routing Logic
  const urlParams = new URLSearchParams(window.location.search);
  const isAdminParam = urlParams.has('admin');
  const hasTableParam = urlParams.has('table');

  // Show Admin if explicitly requested OR if no table is specified (Root URL)
  const showAdmin = isAdminParam || !hasTableParam;

  // Session Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check Session Storage on Mount
    const sessionToken = sessionStorage.getItem('admin_token');
    if (sessionToken === 'valid') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    sessionStorage.setItem('admin_token', 'valid');
    setIsAuthenticated(true);
  };

  // ADMIN VIEW
  if (showAdmin) {
    if (!isAuthenticated) {
      return <AdminLogin onLogin={handleLogin} />;
    }
    return <AdminDashboard />;
  }

  // CUSTOMER VIEW
  return (
    <div className="app">
      <AnimatedBackground />
      <OrderingPanel
        tableNumber={tableNumber}
        cart={cart}
      />
    </div>
  );
}

export default App;
