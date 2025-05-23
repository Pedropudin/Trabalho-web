import React, { useMemo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import ROUTES from '../routes';
import '../styles/HistoricoCompras.css';
import Footer from '../components/Footer';
import { getProdutosByRoute } from '../products';

export default function HistoricoProdutos() {
  // Estado para produtos (simulando fetch)
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    // Simula um fetch (poderia ser fetch real de API)
    // Aqui usamos a função utilitária para garantir modularização
    setTimeout(() => {
      setProdutos(getProdutosByRoute('/historico-produtos'));
    }, 200); // delay para simular requisição
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
      <section className="compras" style={{ width: '100%', flexBasis: '100%' }}>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, width: '100%', textAlign: 'center' }}>
          Produtos visualizados em {meses[parseInt(mes, 10) - 1]} de {ano}
        </p>
      </section>
    );
  }

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
          .map(([chave, { ano, mes, produtos }], idx) => (
            <div key={chave} style={{ marginBottom: 32 }}>
              {renderCabecalhoMesAno(mes, ano)}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
                {produtos.map((produto, idx) => (
                  <div className="produto" key={(produto.id || produto.nome) + '-' + idx}>
                    <img src={produto.img} alt={produto.nome} />
                    <p>{produto.nome}</p>
                    <p className="preco">
                      {produto.preco}
                      <br />
                      <small>ou 12x {valorParcela(produto.preco)}</small>
                      <br />
                      <small>{produto.data}</small>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </section>
      <Footer />
    </>
  );
}