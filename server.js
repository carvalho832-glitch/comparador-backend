const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/buscar', async (req, res) => {
  const termo = req.query.q;

  if (!termo) {
    return res.status(400).json({ error: 'Faltou o parâmetro de busca q.' });
  }

  try {
    const url = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(termo)}&limit=12`;
    
    // Configurando headers para simular uma requisição de navegador real
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8'
      }
    });

    const produtosFormatados = response.data.results.map(item => ({
      title: item.title,
      price: item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      platform: "Mercado Livre",
      platformClass: "source-ml",
      image: item.thumbnail.replace('http://', 'https://'),
      link: item.permalink
    }));

    res.json(produtosFormatados);
  } catch (error) {
    // Exibe mais detalhes no log do Render para sabermos se o bloqueio persistir
    console.error('Erro na busca do ML:', error.response ? error.response.status : error.message);
    res.status(500).json({ error: 'Erro ao buscar dados no Mercado Livre.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor ativo na porta ${PORT}`);
});
