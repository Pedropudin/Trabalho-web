import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/TermosCondicoes.css';
import ROUTES from '../routes';
import ScrollToTop from '../components/ScrollToTop';

/*
  Página de Termos e Condições do portal.
  - Estrutura semântica, baseada no HTML original, adaptada para React.
  - Seções bem definidas: definições, aceitação, cadastro, propriedade intelectual, conduta, etc.
  - Rodapé com dados institucionais e links externos.
*/

export default function TermosCondicoes() {
  return (
    <>
      <main className="container-termos">
        {/* Logo institucional */}
        <img src="/logo-com-escrita.png" alt="Logo do website" className="logo" />

        {/* Título principal */}
        <h2>Termos e Condições de Uso</h2>

        {/* Seção descritiva com data e cláusulas */}
        <section className="descricao">
          <p><strong>Data de Vigência:</strong> 12 de Março de 2025</p>
          <p>
            Bem-vindo ao nosso site! Estes Termos e Condições regem o acesso e uso deste website.
            Ao acessar ou usar a página, você concorda em cumprir e estar vinculado a estes termos.
            Caso não concorde com qualquer parte, por favor, não utilize o site.
          </p>

          {/* Definições principais */}
          <h3>1. Definições</h3>
          <ul>
            <li><strong>Site</strong>: refere-se à página web e todos os seus recursos, conteúdos, funcionalidades e serviços associados.</li>
            <li><strong>Usuário</strong>: qualquer pessoa que acesse ou utilize o Site.</li>
            <li><strong>Conteúdo</strong>: textos, imagens, vídeos, áudios, arquivos, interfaces, scripts e qualquer outro material disponibilizado.</li>
          </ul>

          {/* Aceitação dos termos */}
          <h3>2. Aceitação dos Termos</h3>
          <ol>
            <li>O uso do Site implica aceitação integral destes Termos.</li>
            <li>Reservamo-nos o direito de alterar os Termos a qualquer momento, mediante publicação da versão atualizada. A continuidade no uso do Site após modificações constitui aceitação.</li>
          </ol>

          {/* Cadastro e acesso */}
          <h3>3. Acesso e Cadastro</h3>
          <p>
            O acesso ao Site é livre, desde que seja efetuado o devido login para a área de cliente ou de administrador.
            O Usuário é responsável pela veracidade das informações fornecidas e compromete-se a manter seus dados de login seguros.
          </p>

          {/* Propriedade intelectual */}
          <h3>4. Propriedade Intelectual</h3>
          <p>
            Todo Conteúdo é protegido por direitos autorais e outras leis de propriedade intelectual.
            É proibida a reprodução, distribuição, modificação ou criação de obras derivadas sem autorização prévia por escrito.
          </p>

          {/* Conduta do usuário */}
          <h3>5. Conduta do Usuário</h3>
          <p>O Usuário concorda em não:</p>
          <ul>
            <li>Violar leis aplicáveis ou direitos de terceiros;</li>
            <li>Publicar conteúdo ofensivo, difamatório, obsceno ou ilegal;</li>
            <li>Utilizar ferramentas automáticas ou bots que interfiram com o funcionamento normal do Site;</li>
            <li>Engajar em práticas que comprometam a segurança ou integridade do Site.</li>
          </ul>

          {/* Limitação de responsabilidade */}
          <h3>6. Limitação de Responsabilidade</h3>
          <ul>
            <li>O Site é fornecido "no estado em que se encontra", sem garantias expressas ou implícitas.</li>
            <li>Não garantimos disponibilidade ininterrupta nem ausência de erros.</li>
            <li>Não nos responsabilizamos por danos diretos, indiretos, acidentais ou consequenciais decorrentes do uso ou da impossibilidade de uso do Site.</li>
          </ul>

          {/* Links externos */}
          <h3>7. Links para Sites de Terceiros</h3>
          <p>
            O Site pode conter links para domínios externos. Não nos responsabilizamos pelo conteúdo ou políticas de privacidade desses sites.
          </p>

          {/* Alterações nos serviços */}
          <h3>8. Alterações nos Serviços</h3>
          <p>
            Reservamo-nos o direito de modificar, suspender ou descontinuar qualquer recurso ou conteúdo sem aviso prévio.
          </p>

          {/* Jurisdição */}
          <h3>9. Lei Aplicável e Foro</h3>
          <p>
            Estes Termos são regidos pelas leis da República Federativa do Brasil.
            Fica eleito o foro da comarca de [Cidade/Estado] para resolver quaisquer conflitos.
          </p>

          {/* Contato */}
          <h3>10. Contato</h3>
          <p>
            Em caso de dúvidas ou solicitações, entre em contato através dos dados presentes no rodapé do site.
          </p>
          <br />
          {/* Mensagem final */}
          <p>
            Agradecemos sua visita e desejamos uma excelente experiência :)
          </p>
        </section>
      </main>

      {/* Botão para rolar ao topo */}
      <ScrollToTop />

      {/* Rodapé institucional e redes sociais */}
      <footer>
        <div className="rodape-conteudo">
          <p>000.000.000-00</p>
          <p>email@gmail.com</p>
          <p>Tel: (00) 00000-0000</p>
          <p>
            <Link to={ROUTES.APRESENTACAO}>
              Sobre nós
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