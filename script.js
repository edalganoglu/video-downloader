class TwitterVideoDownloader {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.isDownloading = false;
    }

    initializeElements() {
        this.urlInput = document.getElementById('twitterUrl');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.status = document.getElementById('status');
        this.progress = document.getElementById('progress');
        this.progressFill = document.querySelector('.progress-fill');
        this.progressText = document.querySelector('.progress-text');
    }

    bindEvents() {
        this.downloadBtn.addEventListener('click', () => this.handleDownload());
        this.urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleDownload();
            }
        });
        
        this.urlInput.addEventListener('paste', () => {
            setTimeout(() => this.validateUrl(), 100);
        });
    }

    validateUrl() {
        const url = this.urlInput.value.trim();
        const twitterRegex = /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[^\/]+\/status\/\d+/;
        
        if (url && twitterRegex.test(url)) {
            this.downloadBtn.disabled = false;
            this.showStatus('URL geçerli! İndirmeye hazır.', 'success');
        } else if (url) {
            this.downloadBtn.disabled = true;
            this.showStatus('Geçersiz Twitter URL\'si. Lütfen doğru URL\'yi yapıştırın.', 'error');
        } else {
            this.downloadBtn.disabled = true;
            this.hideStatus();
        }
    }

    async handleDownload() {
        if (this.isDownloading) return;

        const url = this.urlInput.value.trim();
        if (!url) {
            this.showStatus('Lütfen bir Twitter URL\'si girin.', 'error');
            return;
        }

        this.isDownloading = true;
        this.downloadBtn.disabled = true;
        this.showProgress();
        this.updateProgress(10, 'Video indiriliyor...');

        try {
            // Yeni backend: Tek adımda video indir
            const response = await fetch('https://video-downloader-b30n.onrender.com/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url })
            });

            if (!response.ok) {
                throw new Error('Video indirilemedi!');
            }

            this.updateProgress(60, 'Video indiriliyor...');
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `twitter_video_${Date.now()}.mp4`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(downloadUrl);

            this.updateProgress(100, 'İndirme tamamlandı!');
            setTimeout(() => {
                this.hideProgress();
                this.showStatus('Video başarıyla indirildi! Galerinizde bulabilirsiniz.', 'success');
                this.resetForm();
            }, 1000);
        } catch (error) {
            console.error('İndirme hatası:', error);
            this.hideProgress();
            this.showStatus('Video indirilemedi. Lütfen URL\'yi kontrol edin ve tekrar deneyin.', 'error');
        } finally {
            this.isDownloading = false;
            this.downloadBtn.disabled = false;
        }
    }

    // extractVideoInfo ve getDownloadUrl fonksiyonlarını tamamen kaldırıyorum

    async downloadVideo(downloadUrl) {
        this.updateProgress(70, 'Video indiriliyor...');

        return new Promise((resolve, reject) => {
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `twitter_video_${Date.now()}.mp4`;
            link.style.display = 'none';
            
            document.body.appendChild(link);
            
            link.addEventListener('click', () => {
                setTimeout(() => {
                    document.body.removeChild(link);
                    resolve();
                }, 100);
            });

            link.addEventListener('error', (error) => {
                document.body.removeChild(link);
                reject(error);
            });

            link.click();
        });
    }

    showProgress() {
        this.progress.classList.remove('hidden');
        this.hideStatus();
    }

    hideProgress() {
        this.progress.classList.add('hidden');
    }

    updateProgress(percentage, text) {
        this.progressFill.style.width = `${percentage}%`;
        this.progressText.textContent = text;
    }

    showStatus(message, type = 'info') {
        this.status.textContent = message;
        this.status.className = `status ${type}`;
        this.status.classList.remove('hidden');
    }

    hideStatus() {
        this.status.classList.add('hidden');
    }

    resetForm() {
        this.urlInput.value = '';
        this.downloadBtn.disabled = true;
    }

    simulateDownload() {
        this.showStatus('Demo modu: Video indirme simülasyonu başlatılıyor...', 'info');
        
        setTimeout(() => {
            this.showProgress();
            this.updateProgress(25, 'Video analiz ediliyor...');
        }, 500);

        setTimeout(() => {
            this.updateProgress(50, 'Video bilgileri alındı');
        }, 1500);

        setTimeout(() => {
            this.updateProgress(75, 'İndirme linki hazırlandı');
        }, 2500);

        setTimeout(() => {
            this.updateProgress(100, 'İndirme tamamlandı!');
        }, 3500);

        setTimeout(() => {
            this.hideProgress();
            this.showStatus('Demo: Video başarıyla indirildi! Gerçek uygulamada galerinize kaydedilecek.', 'success');
        }, 4000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const downloader = new TwitterVideoDownloader();
    
    window.downloader = downloader;
    
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Demo modu aktif. Gerçek indirme için backend API gerekli.');
    }
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker kayıt edildi:', registration);
            })
            .catch(error => {
                console.log('Service Worker kayıt hatası:', error);
            });
    });
}

if ('share' in navigator) {
    const shareBtn = document.createElement('button');
    shareBtn.innerHTML = '<i class="fas fa-share"></i> Paylaş';
    shareBtn.className = 'share-btn';
    shareBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #1da1f2 0%, #0d8bd9 100%);
        color: white;
        border: none;
        padding: 15px 20px;
        border-radius: 50px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 5px 15px rgba(29, 161, 242, 0.3);
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    
    shareBtn.addEventListener('click', async () => {
        try {
            await navigator.share({
                title: 'Twitter Video İndirici',
                text: 'Twitter videolarını kolayca indirin!',
                url: window.location.href
            });
        } catch (error) {
            console.log('Paylaşım iptal edildi');
        }
    });
    
    document.body.appendChild(shareBtn);
} 