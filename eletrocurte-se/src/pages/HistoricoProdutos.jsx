import React, { useMemo, useEffect, useState } from 'react';
import Header from '../components/Header';
import '../styles/HistoricoProdutos.css';
import Footer from '../components/Footer';
import ProductCard from '../components/Produtos/ProductCard';
import ProductDetailsModal from '../components/Produtos/ProductDetailsModal';
import ScrollToTop from '../components/ScrollToTop';

/*
  Página de histórico de produtos visualizados pelo usuário.
  - Exibe produtos agrupados por mês/ano de visualização.
  - Modal de detalhes sempre com botão de compra.
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

export default function HistoricoProdutos() {
  // Estado para produtos (simulando fetch)
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/data/products.json')
      .then(res => res.json())
      .then(data => {
        setProdutos(getProdutosByRoute('/historico-produtos', data));
      });
  }, []);

  // Data dinâmica e agrupamento por ano/mês
  const { produtosPorAnoMes } = useMemo(() => {
    // Agrupa produtos por ano e mês
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

  // Função utilitária para renderizar o cabeçalho de mês/ano
  function renderCabecalhoMesAno(mes, ano) {
    const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    return (
      <section className="compras">
        <p>
          Produtos visualizados em {meses[parseInt(mes, 10) - 1]} de {ano}
        </p>
      </section>
    );
  }

  // Estado para modal de detalhes
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Handlers para abrir/fechar modal de detalhes
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
      {/* Produtos agrupados por mês/ano de visualização */}
      <section className="produtos">
        {Object.entries(produtosPorAnoMes)
          .sort((a, b) => {
            // Ordena por ano e mês decrescente (mais recente primeiro)
            const [anoA, mesA] = a[0].split('-').map(Number);
            const [anoB, mesB] = b[0].split('-').map(Number);
            if (anoA !== anoB) return anoB - anoA;
            return mesB - mesA;
          })
          .map(([chave, { ano, mes, produtos }], idx) => (
            <div key={chave}>
              {renderCabecalhoMesAno(mes, ano)}
              <div className="produtos">
                {Array.isArray(produtos) ? produtos.map((produto, idx) => (
                  <ProductCard product={produto} onClick={handleCardClick} key={(produto.id || produto.nome) + '-' + idx} showBuyButton={true} />
                )) : null}
              </div>
            </div>
          ))}
      </section>
      {/* Modal de detalhes do produto */}
      <ProductDetailsModal open={modalOpen} onClose={handleModalClose} product={selectedProduct} />
      <ScrollToTop />
      <Footer />
    </>
  );
}