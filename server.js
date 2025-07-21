const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/download", (req, res) => {
  const tweetUrl = req.body.url;
  if (!tweetUrl) return res.status(400).send("Tweet URL gerekli");

  const id = Date.now();
  const outputFile = `video-${id}.mp4`;

  // yt-dlp ile videoyu indir
  const command = `yt-dlp -f mp4 -o ${outputFile} "${tweetUrl}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("Hata:", stderr);
      return res.status(500).send("Video indirilemedi.");
    }

    // Dosyayı cevap olarak döndür
    const filePath = path.join(__dirname, outputFile);
    res.download(filePath, () => {
      // İş bitince dosyayı sil
      fs.unlinkSync(filePath);
    });
  });
});

app.listen(3000, () => {
  console.log("Server çalışıyor: http://localhost:3000");
}); 