import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import ROUTES from '../routes';
import '../styles/HistoricoCompras.css';
import Footer from '../components/Footer';
import UserRating from '../components/UserRating';
import '../styles/UserRating.css';
import { getProdutosByRoute } from '../products';

export default function HistoricoCompras() {
  // Obtém produtos do histórico via products.js
  const produtos = getProdutosByRoute('/historico-compras');

  // Flags de avaliação para cada produto (simulação)
  const [avaliados, setAvaliados] = useState(produtos.map(() => false));
  // Adiciona um estado para armazenar avaliações detalhadas
  const [avaliacoes, setAvaliacoes] = useState([]); // [{produtoIdx, nota, comentario, data}]

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
  const [produtoDetalhe, setProdutoDetalhe] = useState(null); // idx do produto
  const handleAbrirDetalhe = idx => setProdutoDetalhe(idx);
  const handleFecharDetalhe = () => setProdutoDetalhe(null);

  return (
    <>
      <Header />
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
                    <img src={produto.img} alt={produto.nome} />
                    <p>{produto.nome}</p>
                    <p className="preco">
                      {produto.preco}
                      <br />
                      <small>ou 12x {valorParcela(produto.preco)}</small>
                      <br />
                      <small>{produto.data}</small>
                    </p>
                    {/* ...UserRating e outros elementos se necessário... */}
                  </div>
                ))}
              </div>
            </div>
          ))}
      </section>

      {/* Modal de detalhes do produto avaliado */}
      {produtoDetalhe !== null && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.35)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} onClick={handleFecharDetalhe}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 320, maxWidth: 420, boxShadow: '0 8px 32px #0003', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={handleFecharDetalhe} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>&times;</button>
            <img src={produtos[produtoDetalhe].img} alt={produtos[produtoDetalhe].nome} style={{ width: 120, borderRadius: 8, marginBottom: 16 }} />
            <h2 style={{ margin: 0 }}>{produtos[produtoDetalhe].nome}</h2>
            <p style={{ margin: '8px 0', fontWeight: 500 }}>{produtos[produtoDetalhe].preco}</p>
            <p style={{ margin: '8px 0', color: '#555' }}>Data da compra: {produtos[produtoDetalhe].data}</p>
            {/* Mostra avaliação se houver */}
            {(() => {
              const avaliacao = avaliacoes.find(a => a.produtoIdx === produtoDetalhe);
              if (!avaliacao) return <p style={{color:'#888'}}>Nenhuma avaliação encontrada.</p>;
              return (
                <div style={{ marginTop: 16 }}>
                  <div style={{ color: '#ffc107', fontSize: 22 }}>
                    {'★'.repeat(avaliacao.nota)}
                    {'☆'.repeat(5 - avaliacao.nota)}
                  </div>
                  <p style={{ margin: '8px 0', color: '#333' }}><b>Comentário:</b> {avaliacao.comentario}</p>
                  <p style={{ margin: '8px 0', color: '#888', fontSize: 13 }}>Avaliado em: {avaliacao.data}</p>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}