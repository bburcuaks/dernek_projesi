import { useEffect, useState } from 'react';
import { haberService, type Haber } from '../../services/haberService';
import Modal from '../../components/Modal';
import './PublicPages.css';
import { websocketService } from '../../services/websocket';

const Haberler = () => {
  const [haberler, setHaberler] = useState<Haber[]>([]);
  const [selectedHaber, setSelectedHaber] = useState<Haber | null>(null);

  useEffect(() => {
    const fetchHaberler = async () => {
      try {
        const data = await haberService.getHaberler();
        setHaberler(data);
      } catch (error) {
        console.error('Haberler yüklenemedi:', error);
      }
    };

    fetchHaberler();
    websocketService.connect();

    const createSub = websocketService.subscribe('/topic/haberler', (yeniHaber: Haber) => {
      console.log('HABER EKLEME MESAJI GELDİ:', yeniHaber);

      setHaberler((prev) => {
        const zatenVar = prev.some((item) => item.id === yeniHaber.id);
        if (zatenVar) {
          return prev;
        }
        return [yeniHaber, ...prev];
      });
    });

    const updateSub = websocketService.subscribe('/topic/haberler-guncelle', (guncelHaber: Haber) => {
      console.log('HABER GÜNCELLEME MESAJI GELDİ:', guncelHaber);

      setHaberler((prev) =>
        prev.map((item) => (item.id === guncelHaber.id ? guncelHaber : item))
      );

      setSelectedHaber((prev) =>
        prev && prev.id === guncelHaber.id ? guncelHaber : prev
      );
    });

    const deleteSub = websocketService.subscribe('/topic/haberler-sil', (silinenId: number) => {
      console.log('HABER SİLME MESAJI GELDİ, ID:', silinenId);

      setHaberler((prev) => prev.filter((item) => item.id !== silinenId));

      setSelectedHaber((prev) =>
        prev && prev.id === silinenId ? null : prev
      );
    });

    return () => {
      createSub.unsubscribe();
      updateSub.unsubscribe();
      deleteSub.unsubscribe();
    };
  }, []);

  const sortedHaberler = [...haberler].sort((a, b) => {
    const timeA = a.gecerlilikTarihi ? new Date(a.gecerlilikTarihi).getTime() : 0;
    const timeB = b.gecerlilikTarihi ? new Date(b.gecerlilikTarihi).getTime() : 0;
    return timeB - timeA;
  });

  return (
    <div className="container page-container">
      <div className="page-header">
        <h1>Basın Odası & Haberler</h1>
        <p>Kurumumuz hakkındaki son gelişmeleri buradan takip edebilirsiniz.</p>
      </div>

      {sortedHaberler.length > 0 ? (
        <div className="grid page-grid">
          {sortedHaberler.map((haber) => (
            <div
              key={haber.id}
              className="news-card glass-panel"
              onClick={() => setSelectedHaber(haber)}
              style={{ cursor: 'pointer' }}
            >
              <div className="news-card-img-placeholder">
                <span>Haber</span>
              </div>

              <div className="news-card-body">
                <span className="news-date">
                  {haber.gecerlilikTarihi || '-'}
                </span>

                <h3 className="news-title">{haber.konu}</h3>

                <p className="news-summary">
                  {haber.icerik
                    ? haber.icerik.length > 100
                      ? `${haber.icerik.substring(0, 100)}...`
                      : haber.icerik
                    : 'İçerik bulunmamaktadır.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted">
          Henüz haber bulunmamaktadır.
        </p>
      )}

      <Modal
        isOpen={!!selectedHaber}
        onClose={() => setSelectedHaber(null)}
        title={selectedHaber?.konu || ''}
      >
        {selectedHaber && (
          <div className="news-detail" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <span className="news-date">
              {selectedHaber.gecerlilikTarihi || '-'}
            </span>

            <p className="detail-content">{selectedHaber.icerik}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Haberler;