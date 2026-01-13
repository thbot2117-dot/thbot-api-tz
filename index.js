const express = require('express');
const cors = require('cors');
const yts = require('yt-search');
const ytdl = require('ytdl-core');

const app = express();

// Ativa o CORS para que o Chrome e o seu Bot consigam acessar a API
app.use(cors());
app.use(express.json());

// Rota Principal
app.get('/api/ytmp3', async (req, res) => {
    const query = req.query.url;
    if (!query) {
        return res.status(400).json({ 
            status: false, 
            msg: "Por favor, envie o nome da música ou o link do YouTube!" 
        });
    }

    try {
        // Realiza a busca no YouTube
        const search = await yts(query);
        const video = search.videos[0];

        if (!video) {
            return res.status(404).json({ status: false, msg: "Nenhum vídeo encontrado!" });
        }

        // Obtém as informações de download
        const info = await ytdl.getInfo(video.url);
        
        // Escolhe o melhor formato apenas de áudio
        const format = ytdl.chooseFormat(info.formats, { 
            quality: 'highestaudio', 
            filter: 'audioonly' 
        });

        // Resposta da API
        res.json({
            status: true,
            minha_api_oficial: `http://45.7.27.195:2077/api/ytmp3?url=${encodeURIComponent(query)}`,
            result: {
                titulo: video.title,
                canal: video.author.name,
                duracao: video.timestamp,
                views: video.views,
                thumb: video.thumbnail,
                link_original: video.url,
                download: format.url // Este link é o que o seu bot vai usar para tocar
            }
        });

    } catch (error) {
        console.error("Erro na API:", error.message);
        res.status(500).json({ 
            status: false, 
            erro: "Erro ao processar o download. Tente novamente." 
        });
    }
});

// CONFIGURAÇÃO DE PORTA DA HOST (NÃO MEXER)
// O process.env.PORT pega a porta automática da Speed Hosting
const PORT = process.env.PORT || 2077;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`========================================`);
    console.log(`✅ API ONLINE COM SUCESSO!`);
    console.log(`🌍 ACESSO EXTERNO: http://45.7.27.195:${PORT}`);
    console.log(`========================================`);
});
