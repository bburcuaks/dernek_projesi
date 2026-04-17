import { useEffect, useState } from 'react';
import { haberService, type Haber, type HaberRequestDto } from '../../services/haberService';
import { Edit, Trash2, Plus } from 'lucide-react';
import Modal from '../../components/Modal';
import './AdminPages.css';

const emptyForm: HaberRequestDto = {
  konu: '',
  icerik: '',
  gecerlilikTarihi: undefined,
  haberLinki: ''
};

const HaberYonetim = () => {
  const [haberler, setHaberler] = useState<Haber[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<HaberRequestDto>(emptyForm);

  useEffect(() => {
    fetchHaberler();
  }, []);

  const fetchHaberler = async () => {
    try {
      const data = await haberService.getHaberler();
      setHaberler(data);
    } catch (error) {
      console.error('Haberler yüklenemedi:', error);
    }
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const handleEdit = (haber: Haber) => {
    setEditingId(haber.id);
    setFormData({
      konu: haber.konu || '',
      icerik: haber.icerik || '',
      gecerlilikTarihi: haber.gecerlilikTarihi || undefined,
      haberLinki: haber.haberLinki || ''
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: HaberRequestDto = {
      konu: formData.konu?.trim() || '',
      icerik: formData.icerik?.trim() || '',
      haberLinki: formData.haberLinki?.trim() || '',
      ...(formData.gecerlilikTarihi
        ? { gecerlilikTarihi: formData.gecerlilikTarihi }
        : {})
    };

    try {
      if (editingId) {
        await haberService.updateHaber(editingId, payload);
      } else {
        await haberService.createHaber(payload);
      }

      await fetchHaberler();
      setIsModalOpen(false);
      setEditingId(null);
      setFormData(emptyForm);
    } catch (error: any) {
      console.error('Kaydetme hatası:', error);
      alert(
        `Haber kaydedilemedi!\nDetay: ${error.response?.data?.message ||
        error.response?.data?.error ||
        error.message
        }`
      );
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Silmek istediğinizden emin misiniz?')) {
      try {
        await haberService.deleteHaber(id);
        await fetchHaberler();
      } catch (error: any) {
        console.error('Silme hatası:', error);
        alert(
          `Haber silinemedi!\nDetay: ${error.response?.data?.message ||
          error.response?.data?.error ||
          error.message
          }`
        );
      }
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header flex-between">
        <div>
          <h1>Haber Yönetimi</h1>
          <p>Haber ekleyip, düzenleyebilir veya silebilirsiniz.</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>
          <Plus size={18} /> Yeni Haber Ekle
        </button>
      </div>

      <div className="admin-table-container glass-panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Geçerlilik Tarihi</th>
              <th>Konu</th>
              <th>İçerik</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {haberler.map((h) => (
              <tr key={h.id}>
                <td>{h.gecerlilikTarihi || '-'}</td>
                <td>{h.konu}</td>
                <td>{h.icerik ? `${h.icerik.substring(0, 40)}...` : '-'}</td>
                <td className="actions">
                  <button
                    type="button"
                    className="action-btn edit"
                    onClick={() => handleEdit(h)}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    type="button"
                    className="action-btn delete"
                    onClick={() => handleDelete(h.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}

            {haberler.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="text-center text-muted"
                  style={{ padding: '20px' }}
                >
                  Kayıt bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Haber Düzenle' : 'Yeni Haber Ekle'}
      >
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Konu</label>
            <input
              type="text"
              className="form-control"
              value={formData.konu || ''}
              onChange={(e) =>
                setFormData({ ...formData, konu: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">İçerik</label>
            <textarea
              className="form-control"
              rows={5}
              value={formData.icerik || ''}
              onChange={(e) =>
                setFormData({ ...formData, icerik: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Geçerlilik Tarihi</label>
            <input
              type="date"
              className="form-control"
              value={formData.gecerlilikTarihi || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  gecerlilikTarihi: e.target.value || undefined
                })
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">Haber Linki</label>
            <input
              type="url"
              className="form-control"
              value={formData.haberLinki || ''}
              onChange={(e) =>
                setFormData({ ...formData, haberLinki: e.target.value })
              }
              placeholder="https://..."
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Kaydet
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default HaberYonetim;