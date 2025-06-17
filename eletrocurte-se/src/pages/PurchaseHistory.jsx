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
        // Garante evaluation: 0 por padrão
        produtos = produtos.map(p => ({
          ...p,
          evaluation: typeof p.evaluation === "number" ? p.evaluation : 0,
          payed: p.payed ?? false,
          payedDate: p.payedDate ?? null
        }));
        // Carrega histórico do localStorage (produtos comprados pelo usuário)
        const payedHistory = JSON.parse(localStorage.getItem('payedHistory') || '[]');
        payedHistory.forEach(hist => {
          const idx = produtos.findIndex(prod => prod.id === hist.id);
          if (idx !== -1) {
            produtos[idx].payed = true;
            produtos[idx].payedDate = hist.payedDate;
          }
        });
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

        // Aplica avaliações do usuário logado, se houver
        const nomeUsuario = localStorage.getItem('nomeUsuario');
        let avaliacoes = {};
        if (nomeUsuario) {
          avaliacoes = JSON.parse(localStorage.getItem(`avaliacoes_${nomeUsuario}`) || '{}');
        }
        produtos = produtos.map(prod => {
          if (avaliacoes[prod.id]) {
            return { ...prod, evaluation: avaliacoes[prod.id].nota, comment: avaliacoes[prod.id].comentario };
          }
          return prod;
        });
        setProdutos(produtos);
      });
  }, []);

  // Products awaiting review: have null or undefined review AND payed: true
  const produtosAguardando = produtos.filter(p => p.evaluation == null && p.payed);

  // Function called when reviewing a product
  const handleAvaliar = (nota, comentario, idx) => {
    setProdutos(produtosAntigos => {
      // Atualiza apenas após avaliação do usuário
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

  // Agrupa produtos comprados por data real (payedDate)
  const produtosPorData = useMemo(() => {
    const comprados = produtos.filter(p => p.payed && p.payedDate);
    return comprados.reduce((acc, produto) => {
      const date = new Date(produto.payedDate);
      const key = date.toLocaleDateString('en-CA'); // YYYY-MM-DD
      if (!acc[key]) acc[key] = [];
      acc[key].push(produto);
      return acc;
    }, {});
  }, [produtos]);

  const hasPayed = Object.keys(produtosPorData).length > 0;

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
      {!hasPayed && (
        <div style={{ width: "100%", textAlign: "center", margin: "40px auto", color: "#007b99", fontWeight: 600 }}>
          You haven't purchased any products yet.<br />
          Complete a purchase and see your history here!
        </div>
      )}
      <section className="produtos">
        {Object.entries(produtosPorData)
          .sort((a, b) => new Date(b[0]) - new Date(a[0]))
          .map(([date, produtos]) => (
            <div key={date}>
              <section className="compras">
                <p>
                  Purchases made on {new Date(date).toLocaleDateString()}
                </p>
              </section>
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