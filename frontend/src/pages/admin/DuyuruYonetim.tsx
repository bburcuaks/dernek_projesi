import { useEffect, useState } from 'react';
import api from '../../services/api';
import { duyuruService, type Duyuru, type DuyuruRequestDto } from '../../services/duyuruService';
import { Edit, Trash2, Plus } from 'lucide-react';
import Modal from '../../components/Modal';
import './AdminPages.css';

const emptyForm: DuyuruRequestDto = {
  konu: '',
  icerik: '',
  gecerlilikTarihi: undefined,
  resimYolu: ''
};

const DuyuruYonetim = () => {
  const [duyurular, setDuyurular] = useState<Duyuru[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<DuyuruRequestDto>(emptyForm);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchDuyurular();
  }, []);

  const fetchDuyurular = async () => {
    try {
      const data = await duyuruService.getDuyurular();
      setDuyurular(data);
    } catch (error) {
      console.error('Duyurular yüklenemedi:', error);
    }
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleEdit = (duyuru: Duyuru) => {
    setEditingId(duyuru.id);
    setFormData({
      konu: duyuru.konu || '',
      icerik: duyuru.icerik || '',
      gecerlilikTarihi: duyuru.gecerlilikTarihi || undefined,
      resimYolu: duyuru.resimYolu || ''
    });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let resimYolu = formData.resimYolu?.trim() || '';

      if (selectedFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', selectedFile);

        const response = await api.post('/duyurular/upload', formDataUpload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        resimYolu = response.data;
      }

      const payload: DuyuruRequestDto = {
        konu: formData.konu?.trim() || '',
        icerik: formData.icerik?.trim() || '',
        resimYolu,
        ...(formData.gecerlilikTarihi
          ? { gecerlilikTarihi: formData.gecerlilikTarihi }
          : {})
      };

      if (editingId) {
        await duyuruService.updateDuyuru(editingId, payload);
      } else {
        await duyuruService.createDuyuru(payload);
      }

      await fetchDuyurular();
      setIsModalOpen(false);
      setEditingId(null);
      setFormData(emptyForm);
      setSelectedFile(null);
    } catch (error: any) {
      console.error('Kaydetme hatası:', error);
      alert(
        `Duyuru kaydedilemedi!\nDetay: ${error.response?.data?.message ||
        error.response?.data?.error ||
        error.message
        }`
      );
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Silmek istediğinizden emin misiniz?')) {
      try {
        await duyuruService.deleteDuyuru(id);
        await fetchDuyurular();
      } catch (error: any) {
        console.error('Silme hatası:', error);
        alert(
          `Duyuru silinemedi!\nDetay: ${error.response?.data?.message ||
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
          <h1>Duyuru Yönetimi</h1>
          <p>Duyuru ekleyip, düzenleyebilir veya silebilirsiniz.</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>
          <Plus size={18} /> Yeni Duyuru Ekle
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
            {duyurular.map((d) => (
              <tr key={d.id}>
                <td>{d.gecerlilikTarihi || '-'}</td>
                <td>{d.konu}</td>
                <td>{d.icerik ? `${d.icerik.substring(0, 40)}...` : '-'}</td>
                <td className="actions">
                  <button
                    type="button"
                    className="action-btn edit"
                    onClick={() => handleEdit(d)}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    type="button"
                    className="action-btn delete"
                    onClick={() => handleDelete(d.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}

            {duyurular.length === 0 && (
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
        title={editingId ? 'Duyuru Düzenle' : 'Yeni Duyuru Ekle'}
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
            <label className="form-label">Resim Seç</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleFileChange}
            />
            {selectedFile && (
              <p style={{ marginTop: '8px', fontSize: '14px' }}>
                Seçilen dosya: {selectedFile.name}
              </p>
            )}
            {!selectedFile && formData.resimYolu && (
              <p style={{ marginTop: '8px', fontSize: '14px' }}>
                Mevcut resim: {formData.resimYolu}
              </p>
            )}
          </div>

          <button type="submit" className="btn btn-primary">
            Kaydet
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default DuyuruYonetim;