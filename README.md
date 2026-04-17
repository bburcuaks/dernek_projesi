# Dernek Yönetim Sistemi

## Proje Hakkında
Bu proje, bir dernek için geliştirilmiş fullstack web uygulamasıdır.  
Sistem üzerinden haber ve duyurular yönetilebilir, admin paneli ile içerikler kontrol edilebilir.

---

## Kullanılan Teknolojiler

### Backend
- Java
- Spring Boot
- Spring Security (JWT Authentication)
- PostgreSQL
- WebSocket

### Frontend
- React
- TypeScript
- Vite
- Axios

---

## Özellikler
- Admin giriş sistemi (JWT ile güvenli login)
- Haber yönetimi (ekleme, listeleme)
- Duyuru yönetimi
- Görsel yükleme ve gösterme
- WebSocket ile anlık güncelleme

---

## Kullanım Senaryosu

### Admin Kullanıcı
- Sisteme kullanıcı adı ve şifre ile giriş yapar
- Admin paneline yönlendirilir
- Haber ekleyebilir, güncelleyebilir ve silebilir
- Duyuru oluşturabilir ve yönetebilir
- Sistemdeki içerikleri kontrol eder

### Ziyaretçi Kullanıcı
- Siteye giriş yapmadan içerikleri görüntüleyebilir
- Haberleri okuyabilir
- Duyuruları takip edebilir

---

## Varsayılan Admin (Seed Data)

Uygulama ilk çalıştığında otomatik olarak aşağıdaki admin oluşturulur:

- Kullanıcı adı: admin
- Şifre: 1234

---

## Kurulum

### Backend
```bash
cd backend
mvn spring-boot:run
