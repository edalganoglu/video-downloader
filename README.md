# Twitter Video İndirici

Modern ve kullanıcı dostu Twitter video indirme web uygulaması. Samsung S25 ve diğer mobil cihazlarda galeriye direkt kaydetme desteği.

## Özellikler

- 🎥 Twitter videolarını kolayca indirin
- 📱 Mobil uyumlu tasarım
- 🚀 Hızlı ve güvenli indirme
- 💾 Galeriye direkt kaydetme
- 🎨 Modern ve güzel arayüz
- ⚡ Gerçek zamanlı ilerleme takibi

## Kurulum

### Gereksinimler

- Node.js (v14 veya üzeri)
- npm veya yarn

### Adımlar

1. Projeyi klonlayın:
```bash
git clone <repository-url>
cd twitter-video-download
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Uygulamayı başlatın:
```bash
npm start
```

4. Tarayıcınızda şu adresi açın:
```
http://localhost:3000
```

## Kullanım

1. Twitter'da paylaşmak istediğiniz videoyu bulun
2. Video URL'sini kopyalayın
3. URL'yi uygulamadaki kutuya yapıştırın
4. "Video İndir" butonuna tıklayın
5. Video otomatik olarak galerinize kaydedilecek

## Mobil Kullanım

- Samsung S25 ve diğer Android cihazlarda galeriye direkt kaydetme
- iOS cihazlarda dosyalar uygulamasına kaydetme
- Responsive tasarım ile tüm ekran boyutlarında mükemmel görünüm

## API Endpoints

- `POST /api/extract-video` - Video bilgilerini çıkarır
- `POST /api/get-download-url` - İndirme linki oluşturur
- `GET /api/download/:videoId` - Video dosyasını indirir
- `GET /api/health` - Sunucu durumu

## Teknolojiler

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Video İşleme**: Axios, Cheerio
- **UI/UX**: Font Awesome, CSS Grid, Flexbox

## Geliştirme

Geliştirme modunda çalıştırmak için:

```bash
npm run dev
```

Bu komut nodemon ile otomatik yeniden başlatma özelliğini etkinleştirir.

## Lisans

MIT License

## Destek

Herhangi bir sorun yaşarsanız, lütfen issue açın veya iletişime geçin.

---

**Not**: Bu uygulama eğitim amaçlıdır. Telif hakkı korumalı içerikleri indirirken yasal düzenlemelere uygun hareket edin. 