import React, { useMemo, useEffect, useState } from 'react';
import Header from '../components/Header';
import '../styles/ProductHistory.css';
import Footer from '../components/Footer';
import ProductCard from '../components/Products/ProductCard';
import ProductDetailsModal from '../components/Products/ProductDetailsModal';
import ScrollToTop from '../components/ScrollToTop';
import ROUTES from '../routes';

/*
  Page for user's viewed products history.
  - Displays products grouped by month/year of view.
  - Details modal always includes buy button.
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

export default function ProductsHistory() {
  // State for products (simulating fetch)
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/data/products.json')
      .then(res => res.json())
      .then(data => {
        // Flags visualized: false por padrão
        const produtos = (Array.isArray(data) ? data : []).map(p => ({
          ...p,
          visualized: p.visualized ?? false,
          visualizedDate: p.visualizedDate ?? null
        }));
        // Carrega histórico do localStorage (produtos visualizados pelo usuário)
        const visualizedHistory = JSON.parse(localStorage.getItem('visualizedHistory') || '[]');
        // Atualiza flags para produtos visualizados
        visualizedHistory.forEach(hist => {
          const idx = produtos.findIndex(prod => prod.id === hist.id);
          if (idx !== -1) {
            produtos[idx].visualized = true;
            produtos[idx].visualizedDate = hist.visualizedDate;
          }
        });
        setProdutos(produtos);
      });
  }, []);

  // Agrupa produtos visualizados por data real (visualizedDate)
  const produtosPorData = useMemo(() => {
    // Só produtos visualizados
    const visualizados = produtos.filter(p => p.visualized && p.visualizedDate);
    // Agrupa por data (YYYY-MM-DD)
    return visualizados.reduce((acc, produto) => {
      const date = new Date(produto.visualizedDate);
      const key = date.toLocaleDateString('en-CA'); // YYYY-MM-DD
      if (!acc[key]) acc[key] = [];
      acc[key].push(produto);
      return acc;
    }, {});
  }, [produtos]);

  // Mensagem se não houver produtos visualizados
  const hasVisualized = Object.keys(produtosPorData).length > 0;

  // Utility function to render month/year header
  function renderMonthYearHeader(month, year) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    return (
      <section className="compras">
        <p>
          Products viewed in {months[parseInt(month, 10) - 1]} {year}
        </p>
      </section>
    );
  }

  // State for details modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Handlers to open/close details modal
  const handleCardClick = (product) => {
    setSelectedProduct({ ...product, showBuyButton: true });
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <Header />
      <section className="produtos">
        {!hasVisualized && (
          <div style={{ width: "100%", textAlign: "center", margin: "40px auto", color: "#007b99", fontWeight: 600 }}>
            You haven't viewed any products yet.<br />
            Browse the store and click on products to see your history here!
          </div>
        )}
        {Object.entries(produtosPorData)
          .sort((a, b) => new Date(b[0]) - new Date(a[0]))
          .map(([date, produtos], idx) => (
            <div key={date}>
              <section className="compras">
                <p>
                  Products viewed on {new Date(date).toLocaleDateString()}
                </p>
              </section>
              <div className="produtos">
                {Array.isArray(produtos) ? produtos.map((produto, idx) => (
                  <ProductCard product={produto} onClick={handleCardClick} key={(produto.id || produto.nome) + '-' + idx} showBuyButton={true} />
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