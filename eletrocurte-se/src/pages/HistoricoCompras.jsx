import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import ROUTES from '../routes';
import '../../styles/HistoricoCompras.css';
import Footer from '../components/Footer';
import UserRating from '../components/UserRating';
import '../../styles/UserRating.css';
import { getProdutosByRoute } from '../products';
import ProductCard from '../components/ProductCard';
import ProductDetailsModal from '../components/ProductDetailsModal';

export default function HistoricoCompras() {
  // Obtém produtos do histórico via products.js
  const produtos = getProdutosByRoute('/historico-compras');

  // Flags de avaliação para cada produto (simulação)
  const [avaliados, setAvaliados] = useState(produtos.map(() => false));
  // Adiciona um estado para armazenar avaliações detalhadas
  const [avaliacoes, setAvaliacoes] = useState([]); // [{produtoIdx, nota, comentario, data}]

  // Estado para modal de detalhes do produto
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Função chamada ao avaliar um produto
  const handleAvaliar = (nota, comentario, idx) => {
    setAvaliacoes(avaliacoes => {
      // Atualiza ou adiciona avaliação para o produto
      const outras = avaliacoes.filter(a => a.produtoIdx !== idx);
      return [
        ...outras,
        {
          produtoIdx: idx,
          nota,
          comentario,
          data: new Date().toLocaleString('pt-BR')
        }
      ];
    });
    setAvaliados(avaliados => avaliados.map((v, i) => i === idx ? true : v));
  };

  // Produtos aguardando avaliação
  const produtosAguardando = produtos.filter((_, idx) => !avaliados[idx]);

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
      <section className="compras" style={{ width: '100%', flexBasis: '100%' }}>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, width: '100%', textAlign: 'center' }}>
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
    setSelectedProduct(product);
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <Header />
      {/* Seção de avaliação destacada no topo, como no HTML antigo */}
      <section className="avaliacao">
        <img
          src={produtosAguardando[0]?.img || "/imagens/raquete_elétrica2.jpeg"}
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
          imagem={produtosAguardando[0]?.img || "/imagens/raquete_elétrica2.jpeg"}
          produtosParaAvaliar={produtosAguardando}
          onAvaliar={(nota, comentario, idx) => {
            // O idx recebido é o índice dentro de produtosAguardando, precisamos mapear para o índice real em produtos
            const idxReal = produtos.findIndex(p => p === produtosAguardando[idx]);
            handleAvaliar(nota, comentario, idxReal);
          }}
        />
      </section>
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
            <div key={chave} style={{ marginBottom: 32 }}>
              {renderCabecalhoMesAno(mes, ano)}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
                {produtos.map((produto, idx) => (
                  <div className="produto" key={produto.nome + idx}>
                    <ProductCard product={produto} onClick={handleProductClick} />
                  </div>
                ))}
              </div>
            </div>
          ))}
      </section>
      <ProductDetailsModal open={modalOpen} onClose={handleModalClose} product={selectedProduct} />
      <Footer />
    </>
  );
}