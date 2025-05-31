import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import ROUTES from '../routes';
import '../styles/HistoricoCompras.css';
import Footer from '../components/Footer';
import UserRating from '../components/UserRating';
import '../styles/UserRating.css';
import ProductCard from '../components/Produtos/ProductCard';
import ProductDetailsModal from '../components/Produtos/ProductDetailsModal';

/*
  Página de histórico de compras do usuário.
  - Exibe produtos agrupados por mês/ano de compra.
  - Permite avaliar produtos ainda não avaliados.
  - Modal de detalhes sem botão de compra.
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

export default function HistoricoCompras() {
  // Obtém produtos do histórico via products.js
  const [produtos, setProdutos] = useState([]);
  const [jsonData, setJsonData] = useState({});
  // Estado para modal de detalhes do produto
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  // Estado para controlar o índice do produto selecionado para avaliação
  const [produtoAvaliacaoIdx, setProdutoAvaliacaoIdx] = useState(0);

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/data/products.json')
      .then(res => res.json())
      .then(data => {
        setJsonData(data);
        setProdutos(getProdutosByRoute('/historico-compras', data));
      });
  }, []);

  // Produtos aguardando avaliação: não possuem campo 'avaliacao'
  const produtosAguardando = produtos.filter(p => p.avaliacao === undefined);

  // Função chamada ao avaliar um produto
  const handleAvaliar = (nota, comentario, idx) => {
    setProdutos(produtosAntigos => {
      // Atualiza o produto avaliado com a nota
      return produtosAntigos.map((p, i) => {
        if (produtosAguardando[idx] && p === produtosAguardando[idx]) {
          return { ...p, avaliacao: nota };
        }
        return p;
      });
    });
  };

  // Data dinâmica e agrupamento por ano/mês
  const { dataCompra, produtosPorAnoMes, anoMesAtual } = useMemo(() => {
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
    let dataCompra = '';
    if (anoMesAtual) {
      dataCompra = `Compras realizadas em ${nomeMes(anoMesAtual.mes)} de ${anoMesAtual.ano}`;
    }
    return { dataCompra, produtosPorAnoMes: agrupados, anoMesAtual };
  }, [produtos]);

  // Função utilitária para renderizar o cabeçalho de mês/ano
  function renderCabecalhoMesAno(mes, ano) {
    const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    return (
      <section className="compras">
        <p>
          Compras realizadas em {meses[parseInt(mes, 10) - 1]} de {ano}
        </p>
      </section>
    );
  }

  // Função para calcular o valor da parcela
  function valorParcela(preco) {
    const valor = parseFloat(preco.replace(/[^\d,]/g, '').replace(',', '.'));
    if (isNaN(valor)) return '';
    return (valor / 12).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });
  }

  // Função para abrir detalhes do produto avaliado
  const handleProductClick = (product) => {
    // Nunca mostra o botão de compra no modal do histórico de compras
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
      {/* Seção de avaliação destacada no topo, se houver produtos aguardando avaliação */}
      {produtosAguardando.length > 0 && (
        <section className="avaliacao">
          <img
            src={produtosAguardando[produtoAvaliacaoIdx]?.img || "/imagens/raquete_elétrica2.jpeg"}
            alt="Produto aguardando avaliação"
            className="img-miniatura"
          />
          <p>
            {produtosAguardando.length > 0
              ? `${produtosAguardando.length} produto${produtosAguardando.length > 1 ? 's' : ''} esperam sua opinião/avaliação`
              : 'Todos os produtos já foram avaliados!'}
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
      {/* Produtos agrupados por mês/ano de compra */}
      <section className="produtos">
        {Object.entries(produtosPorAnoMes)
          .sort((a, b) => {
            // Ordena por ano e mês decrescente (mais recente primeiro)
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
                  <ProductCard product={produto} onClick={handleProductClick} key={produto.nome + idx} showBuyButton={false} />
                )) : null}
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