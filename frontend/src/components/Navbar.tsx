import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, Bell } from 'lucide-react';
import { websocketService } from '../services/websocket';
import './Navbar.css';

type AppNotification = {
  id: string;
  type: 'haber' | 'duyuru';
  konu: string;
  isRead: boolean;
};

const Navbar = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const subHaber = websocketService.subscribe('/topic/haberler', (y: any) => {
      setNotifications(prev => [
        { id: `h-${y.id}`, type: 'haber', konu: y.konu, isRead: false },
        ...prev
      ]);
    });
    
    const subDuyuru = websocketService.subscribe('/topic/duyurular', (y: any) => {
      setNotifications(prev => [
        { id: `d-${y.id}`, type: 'duyuru', konu: y.konu, isRead: false },
        ...prev
      ]);
    });

    return () => {
      subHaber.unsubscribe();
      subDuyuru.unsubscribe();
    };
  }, []);

  // Dropdown dışına tıklanınca kapatmak için
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBellClick = () => {
    setShowDropdown(!showDropdown);
    // Açıldığında okunmamışları okundu işaretle
    if (!showDropdown && unreadCount > 0) {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    }
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="nav-logo">
          <HeartPulse size={28} color="var(--primary-red)" />
          <span>Dernek Yönetimi</span>
        </Link>
        <ul className="nav-links">
          <li><Link to="/">Ana Sayfa</Link></li>
          <li><Link to="/haberler">Haberler</Link></li>
          <li><Link to="/duyurular">Duyurular</Link></li>
          <li><Link to="/gonullu-ol" style={{ fontWeight: '600', color: 'var(--primary-red)' }}>Gönüllü Ol</Link></li>
          
          {/* Bildirim Zili ve Dropdown */}
          <li className="notification-item" ref={dropdownRef}>
            <button className="icon-btn notification-btn" onClick={handleBellClick}>
              <Bell size={22} />
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>

            {showDropdown && (
              <div className="notification-dropdown glass-panel">
                <div className="notification-header">Son Bildirimler</div>
                {notifications.length === 0 ? (
                  <div className="notification-empty">Yeni bildirim bulunmuyor.</div>
                ) : (
                  <ul className="notification-list">
                    {notifications.slice(0, 5).map((n) => (
                      <li key={n.id} className="notification-list-item">
                        <span className={`badge-type ${n.type === 'haber' ? 'badge-haber' : 'badge-duyuru'}`}>
                          {n.type === 'haber' ? 'Haber' : 'Duyuru'}
                        </span>
                        <div className="notification-content">{n.konu}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </li>

          <li><Link to="/admin/login" className="btn btn-danger-outline" style={{ padding: '6px 12px', fontSize: '0.9rem' }}>Admin</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
