const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

// Rota de teste
app.get('/', (req, res) => {
    res.json({ status: "API Online", dono: "TH" });
});

// Sua própria rota de YouTube MP3
app.get('/api/ytmp3', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json({ status: false, msg: "Falta a URL" });
    
    try {
        // Aqui sua API usa um servidor de busca estável
        const response = await axios.get(`https://api.vreden.my.id/api/ytmp3?url=${url}`);
        res.json(response.data);
    } catch (e) {
        res.status(500).json({ status: false, erro: e.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
