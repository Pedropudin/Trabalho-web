import React, { useMemo, useState, useEffect } from 'react';
import Header from '../components/Header';
import '../styles/HistoricoCompras.css';
import Footer from '../components/Footer';
import UserRating from '../components/UserRating';
import '../styles/UserRating.css';
import ProductCard from '../components/Produtos/ProductCard';
import ProductDetailsModal from '../components/Produtos/ProductDetailsModal';
import ScrollToTop from '../components/ScrollToTop';
import ROUTES from '../routes';

/*
  Página de histórico de compras do usuário.
  - Exibe produtos agrupados por mês/ano de compra.
  - Permite avaliar produtos ainda não avaliados.
  - Modal de detalhes sem botão de compra.
*/

function getProdutosByRoute(route, data) {
  switch (route) {
    case ROUTES.HIST_COMPRAS:
      return data.produtosHistorico || [];
    case ROUTES.HIST_PRODUTOS:
      return data.produtosVisualizados || [];
    default:
      return [];
  }
}

export default function HistoricoCompras() {
  // Obtém produtos do histórico via products.js
  const [produtos, setProdutos] = useState([]);
  // Estado para modal de detalhes do produto
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  // Estado para controlar o índice do produto selecionado para avaliação
  const [produtoAvaliacaoIdx, setProdutoAvaliacaoIdx] = useState(0);

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/data/products.json')
      .then(res => res.json())
      .then(data => {
        let produtos = getProdutosByRoute(ROUTES.HIST_COMPRAS, data);
        // Adiciona até 4 produtos reais do JSON sem avaliação, com datas recentes (intenção de teste de funcionalidade)
        const produtosSemAvaliacao = [];
        for (let i = 0; i < 4 && i < produtos.length; i++) {
          const novoProduto = { ...produtos[i] };
          delete novoProduto.avaliacao;
          // Datas diferentes para cada produto
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
            return { ...prod, avaliacao: avaliacoes[prod.id].nota, comentario: avaliacoes[prod.id].comentario };
          }
          return { ...prod, avaliacao: prod.avaliacao, comentario: undefined };
        });

        setProdutos(produtos);
      });
  }, []);

  // Produtos aguardando avaliação: possuem avaliacao null ou undefined
  const produtosAguardando = produtos.filter(p => p.avaliacao == null);

  // Função chamada ao avaliar um produto
  const handleAvaliar = (nota, comentario, idx) => {
    setProdutos(produtosAntigos => {
      // Atualiza o produto avaliado com a nota e comentário
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
          return { ...p, avaliacao: nota, comentario };
        }
        return p;
      });
    });
  };

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
          Compras realizadas em {meses[parseInt(mes, 10) - 1]} de {ano}
        </p>
      </section>
    );
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
      <ScrollToTop />
      <Footer />
    </>
  );
}