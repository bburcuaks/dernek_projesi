import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { haberService, type Haber } from '../../services/haberService';
import { duyuruService, type Duyuru } from '../../services/duyuruService';
import { ChevronRight } from 'lucide-react';
import { websocketService } from '../../services/websocket';
import './Home.css';

const BASE_URL = 'http://localhost:8080';

const getImageUrl = (resimYolu?: string) => {
  if (!resimYolu) return '';
  if (resimYolu.startsWith('http')) return resimYolu;
  const temizYol = resimYolu.startsWith('/') ? resimYolu.substring(1) : resimYolu;
  return `${BASE_URL}/${temizYol}`;
};

const Home = () => {
  const [haberler, setHaberler] = useState<Haber[]>([]);
  const [duyurular, setDuyurular] = useState<Duyuru[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const hData = await haberService.getHaberler();
      const dData = await duyuruService.getDuyurular();

      const sortedH = [...hData].sort((a,b) => (b.gecerlilikTarihi || '').localeCompare(a.gecerlilikTarihi || ''));
      const sortedD = [...dData].sort((a,b) => (b.gecerlilikTarihi || '').localeCompare(a.gecerlilikTarihi || ''));

      setHaberler(sortedH.slice(0, 3)); 
      setDuyurular(sortedD.slice(0, 3));
    };
    fetchData();

    // HABERLER SUB
    const habCreateSub = websocketService.subscribe('/topic/haberler', (y: Haber) => {
      toast.success(`Yeni haber eklendi: ${y.konu}`);
      setHaberler(prev => {
        if (prev.some(i => i.id === y.id)) return prev;
        return [y, ...prev].slice(0, 3);
      });
    });
    const habUpdateSub = websocketService.subscribe('/topic/haberler-guncelle', (y: Haber) => {
      toast(`Haber güncellendi: ${y.konu}`);
      setHaberler(prev => prev.map(i => i.id === y.id ? y : i));
    });
    const habDeleteSub = websocketService.subscribe('/topic/haberler-sil', (id: number) => {
      toast.error('Bir haber silindi');
      setHaberler(prev => prev.filter(i => i.id !== id));
    });

    // DUYURULAR SUB
    const duyCreateSub = websocketService.subscribe('/topic/duyurular', (y: Duyuru) => {
      toast.success(`Yeni duyuru eklendi: ${y.konu}`);
      setDuyurular(prev => {
        if (prev.some(i => i.id === y.id)) return prev;
        return [y, ...prev].slice(0, 3);
      });
    });
    const duyUpdateSub = websocketService.subscribe('/topic/duyurular-guncelle', (y: Duyuru) => {
      toast(`Duyuru güncellendi: ${y.konu}`);
      setDuyurular(prev => prev.map(i => i.id === y.id ? y : i));
    });
    const duyDeleteSub = websocketService.subscribe('/topic/duyurular-sil', (id: number) => {
      toast.error('Bir duyuru silindi');
      setDuyurular(prev => prev.filter(i => i.id !== id));
    });

    return () => {
      habCreateSub.unsubscribe();
      habUpdateSub.unsubscribe();
      habDeleteSub.unsubscribe();
      duyCreateSub.unsubscribe();
      duyUpdateSub.unsubscribe();
      duyDeleteSub.unsubscribe();
    };
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <h1>İyilik İçin Bizimle Omuz Omuza</h1>
          <p>Kan bağışı, afet yönetimi ve sosyal destek faaliyetlerimizle umut olmaya devam ediyoruz.</p>
          <div className="hero-buttons">
            <Link to="/gonullu-ol" className="btn btn-primary" style={{ padding: '15px 30px', fontSize: '1.1rem', display: 'inline-block', textDecoration: 'none' }}>Gönüllü Ol</Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mt-section">
        <div className="grid grid-2-col gap-6">
          {/* Son Haberler */}
          <div className="home-card glass-panel">
            <div className="section-header">
              <h2>Son Haberler</h2>
              <Link to="/haberler" className="view-all-link">Tümü <ChevronRight size={16}/></Link>
            </div>
            <div className="list-group">
              {haberler.map(h => (
                <div key={h.id} className="list-item">
                  <div className="item-date">{h.gecerlilikTarihi || '-'}</div>
                  <div className="item-title">{h.konu}</div>
                  <div className="item-desc">{h.icerik?.substring(0, 45)}...</div>
                </div>
              ))}
            </div>
          </div>

          {/* Son Duyurular */}
          <div className="home-card glass-panel">
            <div className="section-header">
              <h2>Duyurular & İlanlar</h2>
              <Link to="/duyurular" className="view-all-link">Tümü <ChevronRight size={16}/></Link>
            </div>
            <div className="list-group">
              {duyurular.map(d => (
                <div key={d.id} className="list-item" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  {d.resimYolu ? (
                    <img 
                      src={getImageUrl(d.resimYolu)} 
                      alt={d.konu} 
                      style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} 
                    />
                  ) : (
                    <div style={{ width: '80px', height: '80px', backgroundColor: '#fce7f3', color: '#db2777', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', flexShrink: 0, fontWeight: 'bold', fontSize: '0.85rem' }}>
                      Duyuru
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="item-date">{d.gecerlilikTarihi || '-'}</div>
                    <div className="item-title">{d.konu}</div>
                    <div className="item-desc">{d.icerik?.substring(0, 45)}...</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
