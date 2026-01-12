const express = require('express');
const cors = require('cors');
const yts = require('yt-search');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// Rota principal para testar se está online
app.get('/', (req, res) => {
    res.json({ status: true, msg: "API Online na Speed Hosting!" });
});

// Comando de música ytmp3
app.get('/api/ytmp3', async (req, res) => {
    const query = req.query.url;
    if (!query) return res.json({ status: false, msg: "Falta o nome ou link da música!" });

    try {
        const search = await yts(query);
        const video = search.videos[0];
        
        if (!video) return res.json({ status: false, msg: "Música não encontrada!" });

        // Aqui vai o link do seu conversor (exemplo de retorno)
        res.json({
            status: true,
            result: {
                titulo: video.title,
                thumb: video.thumbnail,
                canal: video.author.name,
                url: video.url,
                download: `https://thbot-api-tz.onrender.com/api/download?url=${video.url}` // Ajuste conforme seu backend de download
            }
        });
    } catch (e) {
        res.json({ status: false, msg: "Erro interno na API" });
    }
});

// --- CONFIGURAÇÃO DE PORTA (CORRIGIDA) ---
const PORT = process.env.PORT || 2077;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`
    =========================================
    API LIGADA COM SUCESSO!
    Porta: ${PORT}
    IP: 45.7.27.195
    Link: http://45.7.27.195:${PORT}/api/ytmp3?url=
    =========================================
    `);
});
