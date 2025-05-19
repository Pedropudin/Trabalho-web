import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import ROUTES from '../routes';
import '../styles/HistoricoProdutos.css';

/*
  Página de Histórico de Produtos Visualizados pelo usuário.
  Exibe lista de produtos visualizados, data e seção de recomendação.
*/

export default function HistoricoProdutos() {
  // Exemplo de dados estáticos (substitua por dados reais se necessário)
  const produtos = [
    {
      nome: 'Controle Remoto NET/CLARO TV+',
      preco: 'R$ 299,00',
      img: '/imagens/controle_remoto.jpeg',
      data: '10/03/2025',
    },
    {
      nome: 'Liquidificador Mondial',
      preco: 'R$ 199,00',
      img: '/imagens/liquidificador.jpeg',
      data: '11/03/2025',
    },
    {
      nome: 'Protoboard',
      preco: 'R$ 1.199,00',
      img: '/imagens/hardware.jpeg',
      data: '12/03/2025',
    },
    {
      nome: 'Televisão Samsung QLED/4K',
      preco: 'R$ 3.799,00',
      img: '/imagens/televisão.jpeg',
      data: '13/03/2025',
    },
    {
      nome: 'Microondas',
      preco: 'R$ 799,00',
      img: '/imagens/microondas.jpeg',
      data: '14/03/2025',
    },
  ];

  return (
    <>
      <Header />
      <main className="container">
        {/* Logo e título */}
        <img src="/logo-com-escrita.png" alt="Logo do website" className="logo" />
        <h2>Histórico de Produtos Visualizados</h2>
        <br />

        {/* Seção para exibição da data do histórico */}
        <section className="compras">
          <p>(Dia + mês da visualização)</p>
        </section>

        {/* Seção de recomendação de produtos */}
        <section className="avaliacao">
          <img src="/imagens/controle_remoto.jpeg" alt="Produto recomendado" className="img-miniatura" />
          <p>{produtos.length} produtos visualizados recentemente</p>
          <button>
            <i className="fas fa-star"></i> Recomendar
          </button>
        </section>

        {/* Galeria de produtos visualizados */}
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