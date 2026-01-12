const express = require('express');
const cors = require('cors');
const yts = require('yt-search');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ status: true, msg: "API Online na Speed Hosting!" });
});

app.get('/api/ytmp3', async (req, res) => {
    const query = req.query.url;
    if (!query) return res.json({ status: false, msg: "Diga o nome da música!" });

    try {
        const search = await yts(query);
        const video = search.videos[0];
        
        if (!video) return res.json({ status: false, msg: "Música não encontrada!" });

        res.json({
            status: true,
            result: {
                titulo: video.title,
                thumb: video.thumbnail,
                url: video.url,
                // Usando um servidor de download público para facilitar
                download: `https://api.dlow.top/api/ytmp3?url=${video.url}`
            }
        });
    } catch (e) {
        res.json({ status: false, msg: "Erro ao buscar música." });
    }
});

const PORT = process.env.PORT || 2077;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
