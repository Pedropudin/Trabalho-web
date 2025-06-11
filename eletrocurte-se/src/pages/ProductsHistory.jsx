import React, { useMemo, useEffect, useState } from 'react';
import Header from '../components/Header';
import '../styles/ProductHistory.css';
import Footer from '../components/Footer';
import ProductCard from '../components/Products/ProductCard';
import ProductDetailsModal from '../components/Products/ProductDetailsModal';
import ScrollToTop from '../components/ScrollToTop';

/*
  Page for user's viewed products history.
  - Displays products grouped by month/year of view.
  - Details modal always includes buy button.
*/

function getProdutosByRoute(route, data) {
  switch (route) {
    case '/historico-compras':
      return data.produtosHistorico || [];
    case '/historico-produtos':
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
        setProdutos(getProdutosByRoute('/historico-produtos', data));
      });
  }, []);

  // Dynamic date and grouping by year/month
  const { produtosPorAnoMes } = useMemo(() => {
    // Groups products by year and month
    function groupByYearMonth(produtos) {
      return produtos.reduce((acc, produto) => {
        if (!produto.data) return acc;
        // const [day, month, year] = produto.data.split('/');
        const [, month, year] = produto.data.split('/');
        const key = `${year}-${month}`;
        if (!acc[key]) acc[key] = { year, month, produtos: [] };
        acc[key].produtos.push(produto);
        return acc;
      }, {});
    }
    const grouped = groupByYearMonth(produtos);
    return { produtosPorAnoMes: grouped };
  }, [produtos]);

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
      {/* Products grouped by view month/year */}
      <section className="produtos">
        {Object.entries(produtosPorAnoMes)
          .sort((a, b) => {
            // Sort by year and month descending (most recent first)
            const [yearA, monthA] = a[0].split('-').map(Number);
            const [yearB, monthB] = b[0].split('-').map(Number);
            if (yearA !== yearB) return yearB - yearA;
            return monthB - monthA;
          })
          .map(([key, { year, month, produtos }], idx) => (
            <div key={key}>
              {renderMonthYearHeader(month, year)}
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