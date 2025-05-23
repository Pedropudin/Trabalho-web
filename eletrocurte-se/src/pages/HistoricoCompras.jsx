import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import ROUTES from '../routes';
import '../styles/HistoricoCompras.css';
import Footer from '../components/Footer';
import UserRating from '../components/UserRating';
import '../styles/UserRating.css';

export default function HistoricoCompras() {
  // Exemplo de dados estáticos
  const produtos = [
    {
      nome: 'Raquete Elétrica',
      preco: 'R$ 89,90',
      img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80', // imagem pública para teste
      data: '12/03/2025',
    },
    {
      nome: 'Escova Elétrica',
      preco: 'R$ 159,99',
      img: '/imagens/escova_elétrica.jpeg',
      data: '15/03/2025',
    },
    {
      nome: 'Aspirador de Pó',
      preco: 'R$ 349,90',
      img: '/imagens/aspirador_de_pó.jpeg',
      data: '20/03/2025',
    },
    {
      nome: 'Máquina de Lavar',
      preco: 'R$ 2.799,00',
      img: '/imagens/máquina_de_lavar.jpeg',
      data: '25/03/2025',
    },
    {
      nome: 'Air Fryer',
      preco: 'R$ 479,00',
      img: '/imagens/airfryer.jpeg',
      data: '28/03/2025',
    },
  ];

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

  // Data dinâmica no formato "Compra realizada em 19 de maio"
  const dataCompra = useMemo(() => {
    const data = new Date();
    const opcoes = { day: '2-digit', month: 'long' };
    return `Compra realizada em ${data.toLocaleDateString('pt-BR', opcoes)}`;
  }, []);

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
      <section className="compras">
        <p>{dataCompra}</p>
      </section>

      {/* Exibe UserRating apenas se houver produtos não avaliados */}
      {produtosAguardando.length > 0 && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '32px 0 16px 0',
        }}>
          <div style={{
            background: '#fffbe6',
            color: '#856404',
            border: '1px solid #ffeeba',
            borderRadius: 8,
            padding: '16px 24px',
            fontSize: 18,
            fontWeight: 500,
            marginBottom: 16,
            boxShadow: '0 2px 8px #0001',
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <i className="fas fa-info-circle" style={{ fontSize: 22, color: '#ffc107' }}></i>
            Há produtos que ainda não foram avaliados. Compartilhe sua opinião!
          </div>
          <UserRating
            produtosAguardando={produtosAguardando.length}
            produtosParaAvaliar={produtosAguardando}
            onAvaliar={(nota, comentario, idxAguardando) => {
              // Marca o produto selecionado como avaliado
              const idx = produtos.findIndex((p, i) => !avaliados[i] && produtosAguardando[idxAguardando].nome === p.nome);
              handleAvaliar(nota, comentario, idx);
            }}
          />
        </div>
      )}

      <section className="produtos">
        {produtos.map((produto, idx) => (
          <div
            className="produto"
            key={idx}
            style={{ opacity: avaliados[idx] ? 0.5 : 1, cursor: avaliados[idx] ? 'pointer' : 'default' }}
            onClick={avaliados[idx] ? () => handleAbrirDetalhe(idx) : undefined}
            title={avaliados[idx] ? 'Ver detalhes da avaliação' : ''}
          >
            <img src={produto.img} alt={produto.nome} />
            <p>{produto.nome}</p>
            <p className="preco">
              {produto.preco}
              <br />
              <small>ou 12x {valorParcela(produto.preco)}</small>
            </p>
            {/* Flag visual para produto avaliado */}
            {avaliados[idx] && <span style={{ color: '#1976d2', fontWeight: 'bold' }}>Avaliado</span>}
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