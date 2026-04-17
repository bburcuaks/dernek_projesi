import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { HeartHandshake, CheckCircle } from 'lucide-react';
import './PublicPages.css';

const GonulluOl = () => {
  const [formData, setFormData] = useState({
    isim: '',
    email: '',
    telefon: '',
    ilgiAlani: 'Kan Bağışı',
    mesaj: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Normalde burada api.post('/gonulluler', formData) tetiklenir :)
    // Ancak sadece UI (frontend) olduğu için simüle ediyoruz:
    
    console.log("Gönderilen Gönüllü Formu:", formData);
    
    // İşlem başarılı efekti
    setTimeout(() => {
      setIsSubmitted(true);
      toast.success('Başvurunuz başarıyla alınmıştır! Teşekkür ederiz.');
    }, 600);
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setFormData({
      isim: '',
      email: '',
      telefon: '',
      ilgiAlani: 'Kan Bağışı',
      mesaj: ''
    });
  };

  return (
    <div className="container page-container">
      <div className="page-header" style={{ marginBottom: '30px' }}>
        <HeartHandshake size={56} color="var(--primary-red)" style={{ margin: '0 auto 15px auto' }} />
        <h1>Gönüllü Ol</h1>
        <p>İyilik hareketimizin bir parçası olun, umudu birlikte yeşertelim.</p>
      </div>

      <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto', padding: '40px' }}>
        {isSubmitted ? (
          <div style={{ textAlign: 'center', padding: '30px 10px' }}>
            <CheckCircle size={64} color="#10b981" style={{ margin: '0 auto 20px auto' }} />
            <h2 style={{ marginBottom: '15px', color: '#111827' }}>Başvurunuz Alındı!</h2>
            <p style={{ color: '#4b5563', lineHeight: '1.6', marginBottom: '30px' }}>
              Değerli <strong>{formData.isim}</strong>, gönüllü kadromuza katılma talebinizi aldık. İlgili ekiplerimiz en kısa sürede {formData.email} adresinizden sizinle iletişime geçecektir.
            </p>
            <button className="btn btn-primary" onClick={resetForm}>
              Yeni Başvuru Yap
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group" style={{ marginBottom: '0' }}>
              <label className="form-label">Adınız Soyadınız</label>
              <input
                type="text"
                className="form-control"
                placeholder="Örn: Ahmet Yılmaz"
                value={formData.isim}
                onChange={(e) => setFormData({ ...formData, isim: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '0' }}>
              <label className="form-label">E-Posta Adresiniz</label>
              <input
                type="email"
                className="form-control"
                placeholder="Örn: ahmet@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '0' }}>
              <label className="form-label">Telefon Numaranız</label>
              <input
                type="tel"
                className="form-control"
                placeholder="Örn: 0555 555 5555"
                value={formData.telefon}
                onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '0' }}>
              <label className="form-label">Destek Olmak İstediğiniz Alan</label>
              <select
                className="form-control"
                value={formData.ilgiAlani}
                onChange={(e) => setFormData({ ...formData, ilgiAlani: e.target.value })}
                required
              >
                <option value="Kan Bağışı Organizasyonları">Kan Bağışı Organizasyonları</option>
                <option value="Doğal Afet ve Kurtarma">Doğal Afet ve Kurtarma</option>
                <option value="Sosyal Yardım / Dağıtım">Sosyal Yardım / Dağıtım</option>
                <option value="Eğitim ve Psikososyal Destek">Eğitim ve Psikososyal Destek</option>
                <option value="Diğer (Mesajda belirtin)">Diğer</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '0' }}>
              <label className="form-label">Eklemek İstedikleriniz (Opsiyonel)</label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="Sahip olduğunuz yetkinlikler veya eklemek istedikleriniz..."
                value={formData.mesaj}
                onChange={(e) => setFormData({ ...formData, mesaj: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '10px', fontSize: '1.05rem', padding: '12px' }}>
              Başvuruyu Tamamla
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default GonulluOl;
