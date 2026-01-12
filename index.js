const express = require('express');
const cors = require('cors');
const yts = require('yt-search');
const ytdl = require('ytdl-core');

const app = express();
app.use(cors());
app.use(express.json());

// Rota principal
app.get('/', (req, res) => {
    res.json({ 
        status: true, 
        msg: "Sua API Particular está Online!",
        minha_api: "http://45.7.27.195:2077/api/ytmp3?url="
    });
});

app.get('/api/ytmp3', async (req, res) => {
    const query = req.query.url;
    if (!query) return res.json({ status: false, msg: "Falta o nome da música!" });

    try {
        const search = await yts(query);
        const video = search.videos[0];
        
        if (!video) return res.json({ status: false, msg: "Música não encontrada!" });

        // Extrai o áudio real do YouTube
        const info = await ytdl.getInfo(video.url);
        const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio', filter: 'audioonly' });

        // O resultado agora inclui explicitamente o link da sua API
        res.json({
            status: true,
            api_oficial: `http://45.7.27.195:2077/api/ytmp3?url=${encodeURIComponent(query)}`,
            result: {
                titulo: video.title,
                thumb: video.thumbnail,
                url_original: video.url,
                download: format.url, // Link direto do áudio
                canal: video.author.name
            }
        });
    } catch (e) {
        res.json({ status: false, msg: "Erro: " + e.message });
    }
});

const PORT = process.env.PORT || 2077;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`API ONLINE EM: http://45.7.27.195:${PORT}`);
});
