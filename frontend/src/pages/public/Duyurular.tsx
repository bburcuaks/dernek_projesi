import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { duyuruService, type Duyuru } from '../../services/duyuruService';
import { websocketService } from '../../services/websocket';
import Modal from '../../components/Modal';
import './PublicPages.css';

const BASE_URL = 'http://localhost:8080';

const getImageUrl = (resimYolu?: string) => {
  if (!resimYolu) return '';
  if (resimYolu.startsWith('http')) return resimYolu;
  const temizYol = resimYolu.startsWith('/') ? resimYolu.substring(1) : resimYolu;
  return `${BASE_URL}/${temizYol}`;
};

const Duyurular = () => {
  const [duyurular, setDuyurular] = useState<Duyuru[]>([]);
  const [selectedDuyuru, setSelectedDuyuru] = useState<Duyuru | null>(null);

  useEffect(() => {
    const fetchDuyurular = async () => {
      try {
        const data = await duyuruService.getDuyurular();
        console.log('API DUYURULAR:', data);
        setDuyurular(data);
      } catch (error) {
        console.error('Duyurular alınamadı:', error);
      }
    };

    fetchDuyurular();
    websocketService.connect();

    const createSub = websocketService.subscribe('/topic/duyurular', (yeniDuyuru: Duyuru) => {
      console.log('WEBSOCKET DUYURU:', yeniDuyuru);
      toast.success(`Yeni duyuru eklendi: ${yeniDuyuru.konu}`);
      setDuyurular((prev) => {
        const zatenVar = prev.some((item) => item.id === yeniDuyuru.id);
        if (zatenVar) return prev;
        return [yeniDuyuru, ...prev];
      });
    });

    const updateSub = websocketService.subscribe('/topic/duyurular-guncelle', (guncelDuyuru: Duyuru) => {
      console.log('GÜNCELLEME MESAJI GELDİ:', guncelDuyuru);
      toast(`Duyuru güncellendi: ${guncelDuyuru.konu}`);
      setDuyurular((prev) =>
        prev.map((item) => (item.id === guncelDuyuru.id ? guncelDuyuru : item))
      );
      setSelectedDuyuru((prev) =>
        prev && prev.id === guncelDuyuru.id ? guncelDuyuru : prev
      );
    });

    const deleteSub = websocketService.subscribe('/topic/duyurular-sil', (silinenId: number) => {
      console.log('SİLME MESAJI GELDİ, ID:', silinenId);
      toast.error('Bir duyuru silindi');
      setDuyurular((prev) => prev.filter((item) => item.id !== silinenId));
      setSelectedDuyuru((prev) =>
        prev && prev.id === silinenId ? null : prev
      );
    });

    return () => {
      createSub.unsubscribe();
      updateSub.unsubscribe();
      deleteSub.unsubscribe();
    };
  }, []);

  const sortedDuyurular = [...duyurular].sort((a, b) => {
    const timeA = a.gecerlilikTarihi ? new Date(a.gecerlilikTarihi).getTime() : 0;
    const timeB = b.gecerlilikTarihi ? new Date(b.gecerlilikTarihi).getTime() : 0;
    return timeB - timeA;
  });

  return (
    <div className="container page-container">
      <div className="page-header">
        <h1>Duyurular İlan Panosu</h1>
        <p>Kurumumuza ait resmi duyuru ve ilanlar.</p>
      </div>

      {sortedDuyurular.length > 0 ? (
        <div className="grid page-grid">
          {sortedDuyurular.map((duyuru) => (
            <div
              key={duyuru.id}
              className="news-card glass-panel"
              onClick={() => setSelectedDuyuru(duyuru)}
              style={{ cursor: 'pointer' }}
            >
              {duyuru.resimYolu ? (
                <img
                  src={getImageUrl(duyuru.resimYolu)}
                  alt={duyuru.konu}
                  style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                />
              ) : (
                <div className="news-card-img-placeholder" style={{ backgroundColor: '#fce7f3', color: '#db2777' }}>
                  <span>Duyuru</span>
                </div>
              )}

              <div className="news-card-body">
                <span className="news-date">
                  {duyuru.gecerlilikTarihi || '-'}
                </span>

                <h3 className="news-title">{duyuru.konu}</h3>

                <p className="news-summary">
                  {duyuru.icerik
                    ? duyuru.icerik.length > 100
                      ? `${duyuru.icerik.substring(0, 100)}...`
                      : duyuru.icerik
                    : 'İçerik bulunmamaktadır.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted">
          Henüz duyuru bulunmamaktadır.
        </p>
      )}

      <Modal
        isOpen={!!selectedDuyuru}
        onClose={() => setSelectedDuyuru(null)}
        title={selectedDuyuru?.konu || ''}
      >
        {selectedDuyuru && (
          <div className="news-detail" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <span className="news-date">
              {selectedDuyuru.gecerlilikTarihi || '-'}
            </span>

            {selectedDuyuru.resimYolu && (
              <img
                src={getImageUrl(selectedDuyuru.resimYolu)}
                alt={selectedDuyuru.konu}
                style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }}
              />
            )}

            <p className="detail-content">{selectedDuyuru.icerik}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Duyurular;