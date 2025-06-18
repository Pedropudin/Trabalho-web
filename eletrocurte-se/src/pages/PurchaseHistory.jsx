import React, { useMemo, useState, useEffect } from 'react';
import Header from '../components/Header';
import '../styles/PurchaseHistory.css';
import Footer from '../components/Footer';
import UserRating from '../components/UserRating';
import '../styles/UserRating.css';
import ProductCard from '../components/Products/ProductCard';
import ProductDetailsModal from '../components/Products/ProductDetailsModal';
import ScrollToTop from '../components/ScrollToTop';

/*
  User purchase history page.
  - Displays products grouped by purchase month/year.
  - Allows rating products that haven't been rated yet.
  - Details modal without purchase button.
*/

export default function PurchaseHistory() {
  // Gets products from the history via products.js
  const [produtos, setProdutos] = useState([]);
  // State for product details modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  // State to control the index of the product selected for review
  const [produtoAvaliacaoIdx, setProdutoAvaliacaoIdx] = useState(0);

  // Refetch products after review to keep reviews in sync
  const fetchProdutos = React.useCallback(() => {
    fetch(process.env.REACT_APP_API_URL + '/api/products')
      .then(res => res.json())
      .then(data => {
        let produtos = Array.isArray(data) ? data : [];
        // Only products that were paid and have a payedDate
        produtos = produtos.filter(p => p.payed && p.payedDate);
        setProdutos(produtos);
      });
  }, []);

  useEffect(() => {
    fetchProdutos();
  }, [fetchProdutos]);

  // Get logged-in username
  const nomeUsuario = localStorage.getItem('nomeUsuario');
  // Only products paid and not yet reviewed by this user
  const produtosAguardando = produtos.filter(p =>
    p.payed &&
    (!Array.isArray(p.reviews) || !p.reviews.some(r => r.username === nomeUsuario))
  );

  const produtosAguardandoPadronizados = produtosAguardando.map(p => ({
    ...p,
    img: p.image || p.img || p.imagem || '/logo-sem-borda.png',
    nome: p.name || p.nome || 'Product',
    preco: typeof p.price === 'number'
      ? `R$${Number(p.price).toFixed(2).replace('.', ',')}`
      : p.preco || '',
    data: p.payedDate
      ? new Date(p.payedDate).toLocaleDateString()
      : (p.data || '')
  }));

  // Function called when reviewing a product
  const handleAvaliar = (nota, comentario, idx) => {
    const produtoAvaliado = produtosAguardando[idx];
    if (produtoAvaliado && nomeUsuario) {
      // Send review to backend
      fetch(`${process.env.REACT_APP_API_URL}/api/products/${produtoAvaliado.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: nomeUsuario,
          rating: nota,
          comment: comentario
        })
      }).then(() => {
        // Refetch products to update reviews state
        fetchProdutos();
      });
    }
  };

  // Agrupy products payed in real date (payedDate)
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
      {/* Review bar for products awaiting user review */}
      {produtosAguardando.length > 0 && (
        <div
          className="avaliacao"
          style={{
            margin: '20px auto 0 auto',
            borderRadius: 10,
            background: '#007b99',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: 'calc(100% - 40px)',
            minWidth: 220,
            padding: 20,
            boxSizing: 'border-box'
          }}
        >
          <img
            src={
              (() => {
                const idx = produtoAvaliacaoIdx >= 0 && produtoAvaliacaoIdx < produtosAguardandoPadronizados.length
                  ? produtoAvaliacaoIdx
                  : 0;
                const prod = produtosAguardandoPadronizados[idx];
                return (
                  (prod?.img && typeof prod.img === 'string' && prod.img.trim() !== '')
                  || '/logo-sem-borda.png'
                );
              })()
            }
            alt="Review"
            style={{
              width: 48,
              height: 48,
              borderRadius: 8,
              background: '#fff',
              marginRight: 18,
              objectFit: 'contain',
              boxShadow: '0 2px 8px #0002'
            }}
          />
          <p style={{ flex: 1, fontSize: '1.1rem', textAlign: 'center', margin: 0 }}>
            {produtosAguardandoPadronizados.length} product{produtosAguardandoPadronizados.length > 1 ? 's' : ''} awaiting your review!
          </p>
          {/* UserRating só aparece se houver produtos aguardando avaliação */}
          <UserRating
            produtosAguardando={produtosAguardandoPadronizados.length}
            produtosParaAvaliar={produtosAguardandoPadronizados}
            onAvaliar={handleAvaliar}
            produtoAvaliacaoIdx={produtoAvaliacaoIdx}
            setProdutoAvaliacaoIdx={setProdutoAvaliacaoIdx}
          />
        </div>
      )}
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