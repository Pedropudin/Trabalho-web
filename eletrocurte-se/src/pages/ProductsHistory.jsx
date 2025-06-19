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

export default function ProductsHistory() {
  // State for products (fetch from backend)
  const [produtos, setProdutos] = useState([]);
  const [produtosBanco, setProdutosBanco] = useState([]);

  useEffect(() => {
    // Fetch products visualized by user from backend
    const userId = localStorage.getItem('userId');
    if (!userId) return setProdutos([]);
    fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}/viewed-products`)
      .then(res => res.json())
      .then(data => {
        setProdutos(Array.isArray(data) ? data : []);
      });
    fetch(`${process.env.REACT_APP_API_URL}/api/products`)
      .then(res => res.json())
      .then(data => setProdutosBanco(Array.isArray(data) ? data : []));
  }, []);

  const produtosBancoMap = useMemo(() => {
    const map = {};
    produtosBanco.forEach(p => {
      map[String(p.id)] = p;
    });
    return map;
  }, [produtosBanco]);

  const produtosPorData = useMemo(() => {
    const visualizados = produtos.filter(p => p.visualizedDate);
    const visualizadosCorrigidos = visualizados.map(p => {
      const banco = produtosBancoMap[String(p.id)];
      return {
        ...p,
        price: banco?.price ?? p.price ?? 0,
        image: banco?.image || p.image,
        name: banco?.name || p.name,
        brand: banco?.brand || p.brand,
        category: banco?.category || p.category,
        inStock: banco?.inStock ?? p.inStock,
      };
    });
    return visualizadosCorrigidos.reduce((acc, produto) => {
      const date = new Date(produto.visualizedDate);
      const key = date.toLocaleDateString('en-CA'); // YYYY-MM-DD
      if (!acc[key]) acc[key] = [];
      acc[key].push(produto);
      return acc;
    }, {});
  }, [produtos, produtosBancoMap]);

  // Message if there are no viewed products
  const hasVisualized = Object.keys(produtosPorData).length > 0;

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