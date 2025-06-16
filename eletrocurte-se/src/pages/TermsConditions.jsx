import React, { useEffect, useState } from 'react';
import '../styles/TermsConditions.css';
import ScrollToTop from '../components/ScrollToTop';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Footer from '../components/Footer';

/*
  Terms and Conditions page for the portal.
  - Semantic structure, based on the original HTML, adapted for React.
  - Well-defined sections: definitions, acceptance, registration, intellectual property, conduct, etc.
  - Footer with institutional data and external links.
*/

export default function TermsConditions() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    // Marca termos como aceitos no localStorage
    localStorage.setItem('termsAccepted', 'true');
    // Atualiza no backend se usuário logado
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ privacy: { termsAccepted: true } })
      });
    }
    setSnackbarOpen(true);
  }, []);

  return (
    <>
      <main className="container-termos">
        {/* Institutional logo */}
        <img src="/logo-com-escrita.png" alt="Website logo" className="logo" />

        {/* Main title */}
        <h2>Terms and Conditions of Use</h2>

        {/* Descriptive section with date and clauses */}
        <section className="descricao">
          <p><strong>Effective Date:</strong> March 12, 2025</p>
          <p>
            Welcome to our website! These Terms and Conditions govern access to and use of this website.
            By accessing or using the page, you agree to comply with and be bound by these terms.
            If you do not agree with any part, please do not use the site.
          </p>

          {/* Main definitions */}
          <h3>1. Definitions</h3>
          <ul>
            <li><strong>Site</strong>: refers to the web page and all its features, content, functionalities, and associated services.</li>
            <li><strong>User</strong>: any person who accesses or uses the Site.</li>
            <li><strong>Content</strong>: texts, images, videos, audios, files, interfaces, scripts, and any other material made available.</li>
          </ul>

          {/* Acceptance of terms */}
          <h3>2. Acceptance of Terms</h3>
          <ol>
            <li>Use of the Site implies full acceptance of these Terms.</li>
            <li>We reserve the right to change the Terms at any time by publishing the updated version. Continued use of the Site after changes constitutes acceptance.</li>
          </ol>

          {/* Access and registration */}
          <h3>3. Access and Registration</h3>
          <p>
            Access to the Site is free, provided that proper login is performed for the client or administrator area.
            The User is responsible for the accuracy of the information provided and agrees to keep their login data secure.
          </p>

          {/* Intellectual property */}
          <h3>4. Intellectual Property</h3>
          <p>
            All Content is protected by copyright and other intellectual property laws.
            Reproduction, distribution, modification, or creation of derivative works without prior written authorization is prohibited.
          </p>

          {/* User conduct */}
          <h3>5. User Conduct</h3>
          <p>The User agrees not to:</p>
          <ul>
            <li>Violate applicable laws or third-party rights;</li>
            <li>Post offensive, defamatory, obscene, or illegal content;</li>
            <li>Use automated tools or bots that interfere with the normal operation of the Site;</li>
            <li>Engage in practices that compromise the security or integrity of the Site.</li>
          </ul>

          {/* Limitation of liability */}
          <h3>6. Limitation of Liability</h3>
          <ul>
            <li>The Site is provided "as is", without express or implied warranties.</li>
            <li>We do not guarantee uninterrupted availability or absence of errors.</li>
            <li>We are not responsible for direct, indirect, incidental, or consequential damages arising from the use or inability to use the Site.</li>
          </ul>

          {/* External links */}
          <h3>7. Links to Third-Party Sites</h3>
          <p>
            The Site may contain links to external domains. We are not responsible for the content or privacy policies of those sites.
          </p>

          {/* Service changes */}
          <h3>8. Changes to Services</h3>
          <p>
            We reserve the right to modify, suspend, or discontinue any feature or content without prior notice.
          </p>

          {/* Jurisdiction */}
          <h3>9. Applicable Law and Jurisdiction</h3>
          <p>
            These Terms are governed by the laws of the Federative Republic of Brazil.
            The court of [City/State] is chosen to resolve any disputes.
          </p>

          {/* Contact */}
          <h3>10. Contact</h3>
          <p>
            In case of questions or requests, contact us through the data in the site footer.
          </p>
          <br />
          {/* Final message */}
          <p>
            Thank you for your visit and we wish you an excellent experience :)
          </p>
        </section>
      </main>

      {/* Scroll to top button */}
      <ScrollToTop />

      <Footer />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3500}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="info" sx={{ width: '100%' }}>
          By accessing this page, you accept the Terms and Conditions of Use.
        </Alert>
      </Snackbar>
    </>
  );
}