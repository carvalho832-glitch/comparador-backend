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
    // Rota pública de busca da Shopee Brasil - livre de bloqueios rígidos de IP
    const url = `https://shopee.com.br/api/v4/search/search_items?keyword=${encodeURIComponent(termo)}&limit=10&page_type=search&version=1`;
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://shopee.com.br/'
      }
    });

    const itens = response.data.data.sections[0].data.item || [];

    // Formata os dados reais da Shopee para o seu layout "sleek"
    const produtosFormatados = itens.map(prod => {
      // A Shopee envia o preço multiplicado por 100.000, aqui nós corrigimos para Real
      const precoReal = prod.item_basic.price / 100000;
      
      return {
        title: prod.item_basic.name,
        price: precoReal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        platform: "Shopee",
        platformClass: "source-shopee",
        // Monta o link real da imagem do produto na Shopee
        image: `https://down-br.img.sgi.blinkstore.io/file/${prod.item_basic.image}`,
        // Monta o link de direcionamento para o comprador
        link: `https://shopee.com.br/product/${prod.item_basic.shopid}/${prod.item_basic.itemid}`
      };
    });

    res.json(produtosFormatados);
  } catch (error) {
    console.error('Erro na busca da Shopee:', error.message);
    res.status(500).json({ error: 'Erro ao buscar dados na Shopee.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor ativo na porta ${PORT}`);
});
