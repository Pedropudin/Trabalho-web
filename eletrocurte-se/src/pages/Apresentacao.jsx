import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../routes';
import ScrollToTop from '../components/ScrollToTop';
import Footer from '../components/Footer';
import '../styles/Apresentacao.css';

/*
  Página "Sobre nós" do portal Eletrocurte-se.
  - Apresenta visão geral do projeto, logo, descrição técnica e contexto acadêmico.
  - Estrutura semântica, responsiva e com integração ao React Router.
  - Comentários explicam cada bloco principal e reforçam a proposta documental.
*/

export default function Apresentacao() {
  return (
    <>
      {/* Container principal centralizado */}
      <main className="container-apresentacao">
        {/* Logo institucional do portal */}
        <img src="/logo-com-escrita.png" alt="Logo do website" className="logo" />

        {/* Título de destaque */}
        <h2>Encontre os melhores produtos e fornecedores em um só lugar!</h2>
        <br />

        {/* Seção descritiva: contexto acadêmico, técnicas e tecnologias */}
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
            (<code>&lt;h2&gt;, &lt;h3&gt;</code>) e seções, para melhor acessibilidade e SEO.
          </p>
          <br />

          <p>
            <strong>Layout Responsivo: </strong>
            CSS3 com Flexbox e Grid garante fluidez em desktop, tablet e mobile, com media queries para ajustes finos.
          </p>
          <br />

          <p>
            <strong>Interatividade: </strong>
            O front-end utiliza JavaScript para validação, navegação suave e animações CSS. Integração com framework e banco NoSQL (MongoDB).
          </p>
          <br />

          <p>
            <strong>Fluxo de trabalho: </strong>
            Controle de versão e revisão de código via Git/GitHub.
          </p>
          <br />

          <p>
            Para dúvidas ou contribuições, utilize o repositório no GitHub. Bom proveito e <em>&ldquo;eletrocurte-se&rdquo;</em>!
          </p>
          <br />
        </section>
      </main>

      {/* Botão flutuante para rolar ao topo */}
      <ScrollToTop />

      {/* Rodapé institucional */}
      <Footer />
    </>
  );
}