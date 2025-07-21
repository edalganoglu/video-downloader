const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://twitter-video-downloader.vercel.app', 'https://your-domain.vercel.app']
        : true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, './')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/extract-video', async (req, res) => {
    try {
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({ error: 'URL gerekli' });
        }

        console.log('Video analiz ediliyor:', url);
        
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const $ = cheerio.load(response.data);
        
        let videoUrl = null;
        
        $('meta[property="og:video"]').each((i, elem) => {
            const content = $(elem).attr('content');
            if (content && content.includes('.mp4')) {
                videoUrl = content;
                return false;
            }
        });

        if (!videoUrl) {
            $('meta[property="og:video:url"]').each((i, elem) => {
                const content = $(elem).attr('content');
                if (content && content.includes('.mp4')) {
                    videoUrl = content;
                    return false;
                }
            });
        }

        if (!videoUrl) {
            const scripts = $('script').map((i, el) => $(el).html()).get();
            for (const script of scripts) {
                if (script.includes('video_url') || script.includes('videoUrl')) {
                    const match = script.match(/"video_url":"([^"]+)"/) || 
                                 script.match(/"videoUrl":"([^"]+)"/);
                    if (match) {
                        videoUrl = match[1].replace(/\\/g, '');
                        break;
                    }
                }
            }
        }

        if (!videoUrl) {
            return res.status(404).json({ error: 'Video URL\'si bulunamadı' });
        }

        const videoInfo = {
            originalUrl: url,
            videoUrl: videoUrl,
            title: $('meta[property="og:title"]').attr('content') || 'Twitter Video',
            description: $('meta[property="og:description"]').attr('content') || '',
            thumbnail: $('meta[property="og:image"]').attr('content') || ''
        };

        res.json(videoInfo);
        
    } catch (error) {
        console.error('Video çıkarma hatası:', error);
        res.status(500).json({ error: 'Video analiz edilemedi' });
    }
});

app.post('/api/get-download-url', async (req, res) => {
    try {
        const { videoUrl } = req.body;
        
        if (!videoUrl) {
            return res.status(400).json({ error: 'Video URL gerekli' });
        }

        console.log('İndirme URL\'si oluşturuluyor:', videoUrl);
        
        const response = await axios.get(videoUrl, {
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const contentType = response.headers['content-type'];
        const contentLength = response.headers['content-length'];
        
        if (!contentType || !contentType.includes('video')) {
            return res.status(400).json({ error: 'Geçersiz video dosyası' });
        }

        res.json({
            downloadUrl: videoUrl,
            contentType: contentType,
            contentLength: contentLength
        });
        
    } catch (error) {
        console.error('İndirme URL hatası:', error);
        res.status(500).json({ error: 'İndirme linki oluşturulamadı' });
    }
});

app.get('/api/download/:videoId', async (req, res) => {
    try {
        const { videoId } = req.params;
        const { url } = req.query;
        
        if (!url) {
            return res.status(400).json({ error: 'Video URL gerekli' });
        }

        console.log('Video indiriliyor:', url);
        
        const response = await axios.get(url, {
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const contentType = response.headers['content-type'];
        const contentLength = response.headers['content-length'];
        
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Length', contentLength);
        res.setHeader('Content-Disposition', `attachment; filename="twitter_video_${videoId}.mp4"`);
        
        response.data.pipe(res);
        
    } catch (error) {
        console.error('Video indirme hatası:', error);
        res.status(500).json({ error: 'Video indirilemedi' });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Sayfa bulunamadı' });
});

app.use((error, req, res, next) => {
    console.error('Server hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
});

app.listen(PORT, () => {
    console.log(`Twitter Video İndirici sunucusu ${PORT} portunda çalışıyor`);
    console.log(`http://localhost:${PORT} adresinden erişebilirsiniz`);
}); 