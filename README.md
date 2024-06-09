# Veteriner Yönetim Uygulaması

Bu, full-stack bir Veteriner Yönetim Uygulamasıdır. Uygulama, bir backend API ve bir frontend arayüzünden oluşmaktadır. Backend Spring Boot ile, frontend ise React kullanılarak geliştirilmiştir.

## Canlı Demo

- **Backend**: [Vet App Backend](https://vet-app-jb21.onrender.com)
- **Frontend**: [Vet App Frontend](https://illustrious-sprite-fc0fa6.netlify.app/)

## Özellikler

### Backend

- Hayvanları Yönet
- Müşterileri Yönet
- Randevuları Yönet
- Doktorları Yönet
- Aşıları Yönet
- Raporları Yönet
- Çalışma Günlerini Yönet

### Frontend

- Veteriner klinik verilerini yönetmek için kullanıcı dostu arayüz
- Hayvanlar, müşteriler, randevular, doktorlar, aşılar ve raporlar için kayıt ekleme, güncelleme ve silme işlemleri
- Kayıtları filtrelemek için arama işlevselliği

## Kullanılan Teknolojiler

### Backend

- Spring Boot
- Spring Data JPA
- Hibernate
- PostgreSQL
- Maven

### Frontend

- React
- React Bootstrap
- Axios
- Toastify ile bildirimler

## Uygulamayı Yerel Olarak Çalıştırma

### Gereksinimler

- Node.js ve npm yüklü
- Java JDK yüklü
- Maven yüklü
- PostgreSQL veritabanı çalışır durumda

### Backend

1. Depoyu klonlayın:
    ```sh
    git clone https://github.com/kullaniciadi/vet-app-backend.git
    ```
2. Proje dizinine gidin:
    ```sh
    cd vet-app-backend
    ```
3. `application.properties` dosyasını MySQL veritabanı yapılandırmanızla güncelleyin.
4. Uygulamayı derleyin ve çalıştırın:
    ```sh
    mvn clean install
    mvn spring-boot:run
    ```
5. Backend API şu adreste çalışıyor olacak: `https://vet-app-jb21.onrender.com`.

### Frontend

1. Depoyu klonlayın:
    ```sh
    git clone https://github.com/kullaniciadi/vet-app-frontend.git
    ```
2. Proje dizinine gidin:
    ```sh
    cd vet-app-frontend
    ```
3. Bağımlılıkları yükleyin:
    ```sh
    npm install
    ```
4. `.env` dosyasındaki API URL'sini backend API URL'inizle güncelleyin.
5. Geliştirme sunucusunu başlatın:
    ```sh
    npm start
    ```
6. Frontend uygulaması şu adreste çalışıyor olacak: `http://localhost:3000`.

## Kullanım

### Backend Uç Noktaları

- `GET /api/v1/animals` - Tüm hayvanları getir
- `POST /api/v1/animals` - Yeni bir hayvan ekle
- `PUT /api/v1/animals/{id}` - Bir hayvanı güncelle
- `DELETE /api/v1/animals/{id}` - Bir hayvanı sil
- Benzer uç noktalar müşteriler, randevular, doktorlar, aşılar ve raporlar için de geçerlidir.

### Frontend Sayfaları

- **Hayvanlar**: Hayvan ekleme, güncelleme, silme ve arama
- **Müşteriler**: Müşteri ekleme, güncelleme, silme ve arama
- **Randevular**: Randevu ekleme, güncelleme, silme ve arama
- **Doktorlar**: Doktor ekleme, güncelleme, silme ve arama, çalışma günlerini yönetme
- **Aşılar**: Aşı ekleme, güncelleme, silme ve arama
- **Raporlar**: Rapor ekleme, güncelleme, silme ve arama

## Katkıda Bulunma

1. Depoyu fork edin
2. Yeni bir dal oluşturun (`git checkout -b feature-branch`)
3. Değişikliklerinizi yapın
4. Değişikliklerinizi commit edin (`git commit -m 'Bazı özellikler ekle'`)
5. Dalınıza push edin (`git push origin feature-branch`)
6. Bir Pull Request açın

## Lisans

Bu proje MIT Lisansı ile lisanslanmıştır.
