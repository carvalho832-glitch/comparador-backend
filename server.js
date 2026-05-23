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
    // API pública de busca da Shopee Brasil
    const url = `https://shopee.com.br/api/v4/search/search_items?keyword=${encodeURIComponent(termo)}&limit=10&page_type=search&version=1`;
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://shopee.com.br/',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    // Caminho exato dos itens dentro do JSON da Shopee
    const itens = response.data?.data?.sections?.[0]?.data?.item || [];

    // Formata os dados para o seu layout compacto
    const produtosFormatados = itens.map(prod => {
      const base = prod.item_basic;
      // Ajusta o preço da Shopee (que vem sem a vírgula do centavo)
      const precoReal = base.price / 100000;
      
      return {
        title: base.name,
        price: precoReal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        platform: "Shopee",
        platformClass: "source-shopee",
        // Puxa a foto direto do CDN global de imagens da Shopee
        image: `https://cf.shopee.com.br/file/${base.image}`,
        // Link direto que abre o produto na Shopee
        link: `https://shopee.com.br/product/${base.shopid}/${base.itemid}`
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
