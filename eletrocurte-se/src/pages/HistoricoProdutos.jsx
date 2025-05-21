import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import ROUTES from '../routes';
import '../styles/HistoricoCompras.css';
import Footer from '../components/Footer';

export default function HistoricoCompras() {
  // Dados dos produtos (simulando o que viria do backend)
  const produtos = [
    {
      nome: 'Raquete Elétrica',
      preco: 'R$ 89,90',
      img: '/imagens/raquete_elétrica2.jpeg',
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

  // Data dinâmica
  const dataCompra = useMemo(() => {
    const data = new Date();
    const opcoes = { day: '2-digit', month: 'long' };
    return `Produto visualizado em ${data.toLocaleDateString('pt-BR', opcoes)}`;
  }, []);

  // Contador de produtos aguardando avaliação
  const produtosAguardando = produtos.length;

  // Função para calcular o valor da parcela
  function valorParcela(preco) {
    const valor = parseFloat(preco.replace(/[^\d,]/g, '').replace(',', '.'));
    if (isNaN(valor)) return '';
    return (valor / 12).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });
  }

  return (
    <>
      <Header />
      <main>
        {/* Seção de compra realizada */}
        <section className="compras">
          <p>{dataCompra}</p>
        </section>

        {/* Galeria de produtos comprados */}
        <section className="produtos">
          {produtos.map((produto, idx) => (
            <div className="produto" key={idx}>
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
        </section>
      </main>

      {/* Rodapé igual ao original */}
      <Footer />
    </>
  );
}