const express = require('express');
const cors = require('cors');
const yts = require('yt-search');
const ytdl = require('@distube/ytdl-core');

const app = express();
app.use(cors());

app.get('/api/ytmp3', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json({ status: false, msg: "Falta o link ou nome" });

    try {
        let videoUrl = url;

        // Se não for um link, ele pesquisa no YouTube pelo nome
        if (!ytdl.validateURL(url)) {
            const search = await yts(url);
            if (!search.all || search.all.length === 0) {
                return res.json({ status: false, msg: "Nada encontrado" });
            }
            videoUrl = search.all[0].url;
        }

        const info = await ytdl.getInfo(videoUrl);
        const format = ytdl.chooseFormat(info.formats, { filter: 'audioonly', quality: 'highestaudio' });

        res.json({
            status: true,
            result: {
                title: info.videoDetails.title,
                thumb: info.videoDetails.thumbnails[0].url,
                download: format.url
            }
        });

    } catch (e) {
        res.status(500).json({ status: false, erro: e.message });
    }
});

const PORT = process.env.PORT || 2077;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`API ligada com sucesso na porta ${PORT}`);
});