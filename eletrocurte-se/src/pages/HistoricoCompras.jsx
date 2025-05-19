import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import ROUTES from '../routes';
import '../styles/HistoricoCompras.css';

/*
  Página de Histórico de Compras do usuário.
  Exibe lista de produtos comprados, data da compra e seção de avaliação.
*/

export default function HistoricoCompras() {
  // Exemplo de dados estáticos
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

  return (
    <>
      <Header />
      <main className="container">
        {/* Logo e título */}
        <img src="/logo-com-borda.png" alt="Logo do website" className="logo" />
        <h2>Histórico de Compras</h2>
        <br />

        {/* Seção para exibição da data da compra */}
        <section className="compras">
          <p>(Dia + mês da compra)</p>
        </section>

        {/* Seção de avaliação de produtos aguardando feedback */}
        <section className="avaliacao">
          <img src="/imagens/raquete_elétrica2.jpeg" alt="Produto aguardando avaliação" className="img-miniatura" />
          <p>{produtos.length} produtos esperam sua opinião/avaliação</p>
          <button>
            <i className="fas fa-star"></i> Avaliar
          </button>
        </section>

        {/* Galeria de produtos comprados */}
        <section className="produtos">
          {produtos.map((produto, idx) => (
            <div className="produto" key={idx}>
              <img src={produto.img} alt={produto.nome} />
              <p>{produto.nome}</p>
              <p className="preco">{produto.preco}<br /><small>{produto.data}</small></p>
            </div>
          ))}
        </section>
      </main>

      {/* Rodapé com informações institucionais e ícones sociais */}
      <footer>
        <div className="rodape-conteudo">
          <p>000.000.000-00</p>
          <p>email@gmail.com</p>
          <p>Tel: (00) 00000-0000</p>
          <p>
            <Link to={ROUTES.TERMOS} target="_blank">
              Termos e Condições
            </Link>
          </p>
          <p>Endereço</p>
          <div className="social-icons">
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://www.twitter.com/" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook"></i>
            </a>
          </div>
        </div>
        <br />
        <p className="copyright">
          Copyright &copy;2025
        </p>
      </footer>
    </>
  );
}