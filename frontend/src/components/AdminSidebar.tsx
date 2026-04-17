import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Bell, LogOut } from 'lucide-react';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
      </div>
      <ul className="sidebar-nav">
        <li>
          <Link to="/admin/haberler" className={isActive('/admin/haberler')}>
            <FileText size={20} />
            Haber Yönetimi
          </Link>
        </li>
        <li>
          <Link to="/admin/duyurular" className={isActive('/admin/duyurular')}>
            <Bell size={20} />
            Duyuru Yönetimi
          </Link>
        </li>
      </ul>
      <div className="sidebar-footer">
        <Link to="/" className="logout-btn">
          <LogOut size={20} />
          Çıkış Yap
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
