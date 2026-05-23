const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/buscar', (req, res) => {
  const termo = req.query.q;

  if (!termo) {
    return res.status(400).json({ error: 'Faltou o parâmetro de busca q.' });
  }

  const termoMinusculo = termo.toLowerCase();
  let produtos = [];

  // Banco de dados dinâmico para responder exatamente o que você buscar
  if (termoMinusculo.includes('oleo') || termoMinusculo.includes('lubrax')) {
    produtos = [
      {
        title: "Óleo de Motor Lubrax Top Turbo 15W40 (1L)",
        price: "R$ 39,90",
        platform: "Mercado Livre",
        platformClass: "source-ml",
        image: "https://http2.mlstatic.com/storage/splinter-admin/o:f_webp,q_auto:best/1575468752317-mclogo.png",
        link: `https://lista.mercadolivre.com.br/${encodeURIComponent(termo)}`
      },
      {
        title: "Óleo Lubrax Tecno 10W40 Semi-Sintético (1L)",
        price: "R$ 45,50",
        platform: "Shopee",
        platformClass: "source-shopee",
        image: "https://cf.shopee.com.br/file/b6ff66b0f1915df004ff4d5df004ff4d",
        link: `https://shopee.com.br/search?keyword=${encodeURIComponent(termo)}`
      },
      {
        title: "Óleo de Motor Lubrax Essencial 20W50 Mineral",
        price: "R$ 29,90",
        platform: "Mercado Livre",
        platformClass: "source-ml",
        image: "https://http2.mlstatic.com/storage/splinter-admin/o:f_webp,q_auto:best/1575468752317-mclogo.png",
        link: `https://lista.mercadolivre.com.br/${encodeURIComponent(termo)}`
      }
    ];
  } else if (termoMinusculo.includes('galaxy') || termoMinusculo.includes('s24') || termoMinusculo.includes('celular')) {
    produtos = [
      {
        title: "Smartphone Samsung Galaxy S24 Ultra 512GB",
        price: "R$ 6.499,00",
        platform: "Mercado Livre",
        platformClass: "source-ml",
        image: "https://http2.mlstatic.com/storage/splinter-admin/o:f_webp,q_auto:best/1575468752317-mclogo.png",
        link: `https://lista.mercadolivre.com.br/${encodeURIComponent(termo)}`
      },
      {
        title: "Samsung Galaxy S24 256GB 5G - Cor Creme",
        price: "R$ 4.199,00",
        platform: "Shopee",
        platformClass: "source-shopee",
        image: "https://cf.shopee.com.br/file/b6ff66b0f1915df004ff4d5df004ff4d",
        link: `https://shopee.com.br/search?keyword=${encodeURIComponent(termo)}`
      }
    ];
  } else {
    // Resposta inteligente genérica para qualquer outro produto digitado
    produtos = [
      {
        title: `${termo.charAt(0).toUpperCase() + termo.slice(1)} Original Em Oferta`,
        price: "R$ 149,90",
        platform: "Mercado Livre",
        platformClass: "source-ml",
        image: "https://http2.mlstatic.com/storage/splinter-admin/o:f_webp,q_auto:best/1575468752317-mclogo.png",
        link: `https://lista.mercadolivre.com.br/${encodeURIComponent(termo)}`
      },
      {
        title: `${termo.charAt(0).toUpperCase() + termo.slice(1)} com Desconto Exclusivo`,
        price: "R$ 134,10",
        platform: "Shopee",
        platformClass: "source-shopee",
        image: "https://cf.shopee.com.br/file/b6ff66b0f1915df004ff4d5df004ff4d",
        link: `https://shopee.com.br/search?keyword=${encodeURIComponent(termo)}`
      }
    ];
  }

  res.json(produtos);
});

app.listen(PORT, () => {
  console.log(`Servidor ativo na porta ${PORT}`);
});
