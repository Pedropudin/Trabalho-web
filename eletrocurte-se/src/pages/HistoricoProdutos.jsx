import React, { useMemo, useEffect, useState } from 'react';
import Header from '../components/Header';
import '../styles/HistoricoProdutos.css';
import Footer from '../components/Footer';
import ProductCard from '../components/Produtos/ProductCard';
import ProductDetailsModal from '../components/Produtos/ProductDetailsModal';

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
  const [jsonData, setJsonData] = useState({});

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/data/products.json')
      .then(res => res.json())
      .then(data => {
        setJsonData(data);
        setProdutos(getProdutosByRoute('/historico-produtos', data));
      });
  }, []);

  // Data dinâmica e agrupamento por ano/mês
  const { dataVisualizacao, produtosPorAnoMes, anoMesAtual } = useMemo(() => {
    // Agrupa produtos por ano e mês
    function agruparPorAnoMes(produtos) {
      return produtos.reduce((acc, produto) => {
        if (!produto.data) return acc;
        const [dia, mes, ano] = produto.data.split('/');
        const chave = `${ano}-${mes}`;
        if (!acc[chave]) acc[chave] = { ano, mes, produtos: [] };
        acc[chave].produtos.push(produto);
        return acc;
      }, {});
    }
    const agrupados = agruparPorAnoMes(produtos);
    // Descobre o mês/ano mais recente (considerando produtos ordenados por data)
    let anoMesAtual = null;
    if (produtos.length > 0) {
      const datas = produtos.map(p => {
        const [d, m, a] = p.data.split('/');
        return new Date(`${a}-${m}-${d}`);
      });
      const maisRecente = new Date(Math.max.apply(null, datas));
      const mes = String(maisRecente.getMonth() + 1).padStart(2, '0');
      const ano = String(maisRecente.getFullYear());
      anoMesAtual = { ano, mes };
    }
    // Nome do mês/ano atual
    function nomeMes(mes) {
      const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
      return meses[parseInt(mes, 10) - 1] || mes;
    }
    let dataVisualizacao = '';
    if (anoMesAtual) {
      dataVisualizacao = `Produtos visualizados em ${nomeMes(anoMesAtual.mes)} de ${anoMesAtual.ano}`;
    }
    return { dataVisualizacao, produtosPorAnoMes: agrupados, anoMesAtual };
  }, [produtos]);

  // Função para calcular o valor da parcela
  function valorParcela(preco) {
    const valor = parseFloat(preco.replace(/[^\d,]/g, '').replace(',', '.'));
    if (isNaN(valor)) return '';
    return (valor / 12).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });
  }

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
                {produtos.map((produto, idx) => (
                  <ProductCard product={produto} onClick={handleCardClick} key={(produto.id || produto.nome) + '-' + idx} showBuyButton={true} />
                ))}
              </div>
            </div>
          ))}
      </section>
      {/* Modal de detalhes do produto */}
      <ProductDetailsModal open={modalOpen} onClose={handleModalClose} product={selectedProduct} />
      <Footer />
    </>
  );
}