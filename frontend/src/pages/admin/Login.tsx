import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartPulse } from 'lucide-react';
import { authService } from '../../services/authService';
import './AdminPages.css';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      const data = await authService.login(username, password);

      // Başarılı olursa token ve kullanıcı bilgilerini kaydet
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      localStorage.setItem('role', data.role);

      // Admin haberler sayfasına yönlendir
      navigate('/admin/haberler');
    } catch (error) {
      setErrorMessage('Kullanıcı adı veya şifre hatalı!');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card glass-panel">
        <div className="login-header text-center">
          <HeartPulse size={40} color="var(--primary-red)" />
          <h2>Yönetim Paneli Girişi</h2>
        </div>

        {errorMessage && (
          <div
            style={{
              color: 'var(--primary-red)',
              backgroundColor: 'var(--primary-red-light)',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '16px',
              textAlign: 'center',
              fontSize: '0.9rem'
            }}
          >
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Kullanıcı Adı</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Şifre</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;