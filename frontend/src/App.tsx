import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { websocketService } from './services/websocket';
import Navbar from './components/Navbar';
import AdminSidebar from './components/AdminSidebar';

// Public Pages
import Home from './pages/public/Home';
import Haberler from './pages/public/Haberler';
import Duyurular from './pages/public/Duyurular';
import GonulluOl from './pages/public/GonulluOl';

// Admin Pages
import Login from './pages/admin/Login';
import HaberYonetim from './pages/admin/HaberYonetim';
import DuyuruYonetim from './pages/admin/DuyuruYonetim';

import './App.css';

const PublicLayout = () => {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <footer style={{ backgroundColor: 'var(--color-gray-900)', color: 'white', padding: '40px 0', textAlign: 'center', marginTop: 'auto' }}>
        <p>&copy; {new Date().getFullYear()} Dernek Yönetim Sistemi. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
};

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  useEffect(() => {
    websocketService.connect();
    
    // Uygulama kapanınca sekme kapatılınca temizlenmesi için
    return () => {
      websocketService.disconnect();
    };
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="haberler" element={<Haberler />} />
          <Route path="duyurular" element={<Duyurular />} />
          <Route path="gonullu-ol" element={<GonulluOl />} />
        </Route>

        {/* Admin Login (No Layout) */}
        <Route path="/admin/login" element={<Login />} />

        {/* Admin Routes with Sidebar Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="haberler" replace />} />
          <Route path="panel" element={<Navigate to="haberler" replace />} />
          <Route path="haberler" element={<HaberYonetim />} />
          <Route path="duyurular" element={<DuyuruYonetim />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
