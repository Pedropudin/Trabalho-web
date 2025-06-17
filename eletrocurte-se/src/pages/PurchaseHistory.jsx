import React, { useMemo, useState, useEffect } from 'react';
import Header from '../components/Header';
import '../styles/PurchaseHistory.css';
import Footer from '../components/Footer';
import UserRating from '../components/UserRating';
import '../styles/UserRating.css';
import ProductCard from '../components/Products/ProductCard';
import ProductDetailsModal from '../components/Products/ProductDetailsModal';
import ScrollToTop from '../components/ScrollToTop';
import ROUTES from '../routes';

/*
  User purchase history page.
  - Displays products grouped by purchase month/year.
  - Allows rating products that haven't been rated yet.
  - Details modal without purchase button.
*/

function getProdutosByRoute(route, data) {
  switch (route) {
    case ROUTES.PURCHASE_HISTORY:
      return data.produtosHistorico || [];
    case ROUTES.PRODUCT_HISTORY:
      return data.produtosVisualizados || [];
    default:
      return [];
  }
}

export default function PurchaseHistory() {
  // Gets products from the history via products.js
  const [produtos, setProdutos] = useState([]);
  // State for product details modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  // State to control the index of the product selected for review
  const [produtoAvaliacaoIdx, setProdutoAvaliacaoIdx] = useState(0);

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/data/products.json')
      .then(res => res.json())
      .then(data => {
        let produtos = Array.isArray(data) ? data : [];
        // Adds up to 4 real products from JSON without reviews, with recent dates (functionality test intention)
        const produtosSemAvaliacao = [];
        for (let i = 0; i < 4 && i < produtos.length; i++) {
          const novoProduto = { ...produtos[i] };
          delete novoProduto.evaluation;
          // Different dates for each product
          const dia = 10 + i;
          novoProduto.data = `${dia.toString().padStart(2, '0')}/06/2024`;
          produtosSemAvaliacao.push(novoProduto);
        }
        produtos = [...produtosSemAvaliacao, ...produtos];

        // Applies reviews from the logged-in user, if any
        const nomeUsuario = localStorage.getItem('nomeUsuario');
        let avaliacoes = {};
        if (nomeUsuario) {
          avaliacoes = JSON.parse(localStorage.getItem(`avaliacoes_${nomeUsuario}`) || '{}');
        }
        produtos = produtos.map(prod => {
          if (avaliacoes[prod.id]) {
            return { ...prod, evaluation: avaliacoes[prod.id].nota, comment: avaliacoes[prod.id].comentario };
          }
          return { ...prod, evaluation: prod.evaluation, comment: undefined };
        });

        setProdutos(produtos);
      });
  }, []);

  // Products awaiting review: have null or undefined review
  const produtosAguardando = produtos.filter(p => p.evaluation == null);

  // Function called when reviewing a product
  const handleAvaliar = (nota, comentario, idx) => {
    setProdutos(produtosAntigos => {
      // Updates the reviewed product with the rating and comment
      const nomeUsuario = localStorage.getItem('nomeUsuario');
      let avaliacoes = {};
      if (nomeUsuario) {
        avaliacoes = JSON.parse(localStorage.getItem(`avaliacoes_${nomeUsuario}`) || '{}');
      }
      const produtoAvaliado = produtosAguardando[idx];
      if (produtoAvaliado) {
        avaliacoes[produtoAvaliado.id] = { nota, comentario };
        if (nomeUsuario) {
          localStorage.setItem(`avaliacoes_${nomeUsuario}`, JSON.stringify(avaliacoes));
        }
      }
      return produtosAntigos.map((p, i) => {
        if (produtoAvaliado && p.id === produtoAvaliado.id) {
          return { ...p, evaluation: nota, comment: comentario };
        }
        return p;
      });
    });
  };

  // Dynamic date and grouping by year/month
  const { produtosPorAnoMes } = useMemo(() => {
    // Groups products by year and month
    function agruparPorAnoMes(produtos) {
      return produtos.reduce((acc, produto) => {
        if (!produto.data) return acc;
        // const [dia, mes, ano] = produto.data.split('/');
        const [, mes, ano] = produto.data.split('/');
        const chave = `${ano}-${mes}`;
        if (!acc[chave]) acc[chave] = { ano, mes, produtos: [] };
        acc[chave].produtos.push(produto);
        return acc;
      }, {});
    }
    const agrupados = agruparPorAnoMes(produtos);
    return { produtosPorAnoMes: agrupados };
  }, [produtos]);

  // Utility function to render month/year header
  function renderCabecalhoMesAno(mes, ano) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return (
      <section className="compras">
        <p>
          Purchases made in {months[parseInt(mes, 10) - 1]} {ano}
        </p>
      </section>
    );
  }

  // Function to open details of the reviewed product
  const handleProductClick = (product) => {
    // Never shows the purchase button in the purchase history modal
    setSelectedProduct({ ...product, showBuyButton: false });
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <Header />
      {/* Highlighted review section at the top, if there are products awaiting review */}
      {produtosAguardando.length > 0 && (
        <section className="avaliacao">
          <img
            src={produtosAguardando[produtoAvaliacaoIdx]?.image || "/imagens/raquete_elétrica2.jpeg"}
            alt="Product awaiting review"
            className="img-miniatura"
          />
          <p>
            {produtosAguardando.length > 0
              ? `${produtosAguardando.length} product${produtosAguardando.length > 1 ? 's' : ''} waiting for your review`
              : 'All products have already been reviewed!'}
          </p>
          <UserRating
            produtosAguardando={produtosAguardando.length}
            imagem={produtosAguardando[produtoAvaliacaoIdx]?.img}
            produtosParaAvaliar={produtosAguardando}
            onAvaliar={handleAvaliar}
            produtoAvaliacaoIdx={produtoAvaliacaoIdx}
            setProdutoAvaliacaoIdx={setProdutoAvaliacaoIdx}
          />
        </section>
      )}
      {/* Products grouped by month/year of purchase */}
      <section className="produtos">
        {Object.entries(produtosPorAnoMes)
          .sort((a, b) => {
            // Sorts by year and month descending (most recent first)
            const [anoA, mesA] = a[0].split('-').map(Number);
            const [anoB, mesB] = b[0].split('-').map(Number);
            if (anoA !== anoB) return anoB - anoA;
            return mesB - mesA;
          })
          .map(([chave, { ano, mes, produtos }]) => (
            <div key={chave}>
              {renderCabecalhoMesAno(mes, ano)}
              <div className="produtos">
                {Array.isArray(produtos) ? produtos.map((produto, idx) => (
                  <ProductCard product={produto} onClick={handleProductClick} key={produto.name + idx} showBuyButton={false} />
                )) : null}
              </div>
            </div>
          ))}
      </section>
      {/* Product details modal */}
      <ProductDetailsModal open={modalOpen} onClose={handleModalClose} product={selectedProduct} />
      <ScrollToTop />
      <Footer />
    </>
  );
}