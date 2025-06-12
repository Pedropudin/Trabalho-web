import React from 'react';
import ScrollToTop from '../components/ScrollToTop';
import Footer from '../components/Footer';
import '../styles/Presentation.css';

/*
  "About Us" page for the Eletrocurte-se portal.
  - Presents an overview of the project, logo, technical description, and academic context.
  - Semantic, responsive structure with React Router integration.
  - Comments explain each main block and reinforce the documentation proposal.
*/

export default function Presentation() {
  return (
    <>
      {/* Main centered container */}
      <main className="container-apresentacao">
        {/* Institutional portal logo */}
        <img src="/logo-com-escrita.png" alt="Website logo" className="logo" />

        {/* Highlighted title */}
        <h2>Find the best products and suppliers in one place!</h2>
        <br />

        {/* Descriptive section: academic context, techniques, and technologies */}
        <section className="descricao">
          <p>
            <strong>Integration Project: </strong>
            This electronic devices e-commerce portal was developed
            as an assignment for the <em>Introduction to Web Development</em> course.
          </p>
          <br />

          <p>
            <strong>Semantic Structure: </strong>
            We use semantic HTML5, structuring content in headings
            (<code>&lt;h2&gt;, &lt;h3&gt;</code>) and sections, for better accessibility and SEO.
          </p>
          <br />

          <p>
            <strong>Responsive Layout: </strong>
            CSS3 with Flexbox and Grid ensures fluidity on desktop, tablet, and mobile, with media queries for fine adjustments.
          </p>
          <br />

          <p>
            <strong>Interactivity: </strong>
            The front-end uses JavaScript for validation, smooth navigation, and CSS animations. Integration with framework and NoSQL database (MongoDB).
          </p>
          <br />

          <p>
            <strong>Workflow: </strong>
            Version control and code review via Git/GitHub.
          </p>
          <br />

          <p>
            For questions or contributions, use the GitHub repository. Enjoy and <em>&ldquo;eletrocurte-se&rdquo;</em>!
          </p>
          <br />
        </section>
      </main>

      {/* Floating button to scroll to top */}
      <ScrollToTop />

      {/* Institutional footer */}
      <Footer />
    </>
  );
}