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
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (!userId) return setProdutos([]);
    fetch(`${process.env.REACT_APP_API_URL}/api/orders/user/${userId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => res.json())
      .then(data => {
        // Cross-adaptation: flatten orders into products, each with order info
        const produtosComprados = [];
        (Array.isArray(data) ? data : []).forEach(order => {
          (order.itens || []).forEach(item => {
            produtosComprados.push({
              ...item,
              payed: true,
              payedDate: order.createdAt,
              orderStatus: order.status,
              orderId: order._id || order.id
            });
          });
        });
        setProdutos(produtosComprados);
      });
  }, []);

  useEffect(() => {
    fetchProdutos();
  }, [fetchProdutos]);

  // Get logged-in user info from backend
  const [usuarioBackend, setUsuarioBackend] = useState(null);
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}`)
        .then(res => res.json())
        .then(user => setUsuarioBackend(user));
    }
  }, []);

  // Groups purchased products by date and by id (one card per product per date)
  const produtosPorData = useMemo(() => {
    const comprados = produtos.filter(p => p.payed && p.payedDate);
    // Agrupa por data (YYYY-MM-DD)
    const agrupado = {};
    comprados.forEach(produto => {
      const date = new Date(produto.payedDate);
      const key = date.toLocaleDateString('en-CA'); // YYYY-MM-DD
      if (!agrupado[key]) agrupado[key] = {};
      // Usa produto.id como chave para garantir 1 card por produto por data
      agrupado[key][produto.id] = agrupado[key][produto.id] || { ...produto };
      // Se houver múltiplos, pode somar quantidade se quiser mostrar
    });
    // Converte para { [date]: [produtosUnicos] }
    const resultado = {};
    Object.entries(agrupado).forEach(([date, prodsObj]) => {
      resultado[date] = Object.values(prodsObj);
    });
    return resultado;
  }, [produtos]);

  // List of products awaiting review: only ONE per product (by id) that the logged-in user has not yet reviewed
  const produtosAguardando = useMemo(() => {
    // Só produtos pagos, agrupados por id, e que o usuário logado ainda não avaliou
    const avaliadosIds = new Set();
    return produtos
      .filter(p =>
        p.payed &&
        p.id &&
        (!Array.isArray(p.reviews) ||
          !p.reviews.some(r => r.username === (usuarioBackend?.firstName || '')))
      )
      .filter(p => {
        if (avaliadosIds.has(p.id)) return false;
        avaliadosIds.add(p.id);
        return true;
      });
  }, [produtos, usuarioBackend]);

  // Standardizes products awaiting review
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
    const produtoAvaliado = produtosAguardandoPadronizados[idx];
    if (produtoAvaliado && usuarioBackend && usuarioBackend.firstName) {
      fetch(`${process.env.REACT_APP_API_URL}/api/products/${produtoAvaliado.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usuarioBackend.firstName,
          rating: nota,
          comment: comentario
        })
      }).then(() => {
        fetchProdutos();
      });
    }
  };

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
      {produtosAguardandoPadronizados.length > 0 && (
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
                  <ProductCard product={produto} onClick={handleProductClick} key={produto.id || produto.name || idx} showBuyButton={false} />
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