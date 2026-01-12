const express = require('express');
const cors = require('cors');
const yts = require('yt-search');
const ytdl = require('ytdl-cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/ytmp3', async (req, res) => {
    const query = req.query.url;
    if (!query) return res.json({ status: false, msg: "Falta o nome da música!" });

    try {
        const search = await yts(query);
        const video = search.videos[0];
        if (!video) return res.json({ status: false, msg: "Não encontrado!" });

        const info = await ytdl.getInfo(video.url);
        const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio', filter: 'audioonly' });

        res.json({
            status: true,
            minha_api_oficial: `http://45.7.27.195:2077/api/ytmp3?url=${encodeURIComponent(query)}`,
            result: {
                titulo: video.title,
                thumb: video.thumbnail,
                download: format.url // Áudio direto gerado pela sua própria API
            }
        });
    } catch (e) {
        res.json({ status: false, erro: e.message });
    }
});

const PORT = process.env.PORT || 2077;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`API ligada em: http://45.7.27.195:${PORT}`);
});
