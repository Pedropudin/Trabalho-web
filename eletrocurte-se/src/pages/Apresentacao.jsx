import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../routes';
import ScrollToTop from '../components/ScrollToTop';
import Footer from '../components/Footer';
import '../styles/Apresentacao.css';

/*
  Esta é a página documental "sobre nós" do site, que apresenta uma visão geral do portal de e-commerce,
  incluindo logo, descrição e fornecedores.
  - Estrutura semântica, layout responsivo e integração com React Router.
  - Comentários originais do HTML foram mantidos/adaptados para JSX.
*/

export default function Apresentacao() {
  return (
    <>
      {/* Container principal alinhando itens ao centro */}
      <main className="container">
        {/* Logo do website (link relativo para a imagem) */}
        <img src="/logo-com-escrita.png" alt="Logo do website" className="logo" />

        {/* Título de destaque explicando proposta do portal */}
        <h2>Encontre os melhores produtos e fornecedores em um só lugar!</h2>
        <br />

        {/* Seção de descrição com explicação técnica e direta sobre o trabalho */}
        <section className="descricao">
          <p>
            <strong>Projeto Integrador: </strong>
            Este portal de e-commerce de dispositivos eletrônicos foi desenvolvido
            como um trabalho da disciplina <em>Introdução ao Desenvolvimento Web</em>.
          </p>
          <br />

          <p>
            <strong>Estrutura Semântica: </strong>
            Utilizamos HTML5 semântico, estruturando conteúdo em cabeçalhos
            (<code>&lt;h2&gt;, &lt;h3&gt;</code>) e seções, correspondendo o conteúdos ao contexto de interação
            do usuário com o site.
          </p>
          <br />

          <p>
            <strong>Layout Responsivo: </strong>
            Aplicamos CSS3 com Flexbox e Grid para garantir fluidez em diversas
            resoluções (desktop, tablet e mobile), com media queries para ajustes finos de tipografia e espaçamento.
          </p>
          <br />

          <p>
            <strong>Interatividade: </strong>
            A lógica de front-end foi implementada em JavaScript, manipulando o DOM
            para validação de formulários, navegação suave (smooth scroll) e animações via
            <code>@keyframes</code> e transições CSS. Além disso, foi feito o uso de framework
            e banco de dados não relacional (NoSQL - MongoDB).
          </p>
          <br />

          <p>
            <strong>Fluxo de trabalho: </strong>
            Adotamos Git/GitHub para controle de versão e revisão de código.
          </p>
          <br />

          <p>
            Para dúvidas ou contribuições, abra uma issue ou pull request em nosso
            repositório no GitHub. Bom proveito e <em>&ldquo;eletrocurte-se&rdquo;</em>!
          </p>
          <br />
        </section>
      </main>

      <ScrollToTop />

      {/* Rodapé com informações de contato e redes sociais */}
      <Footer />
    </>
  );
}