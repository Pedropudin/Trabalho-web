// -----------------------------------------------------------------------------
// ScrollToTop.jsx
// Floating button to scroll the page to the top with visual effect.
// Integrates EfeitoEletrico for animated feedback on click.
// Displays only when scroll is past 200px.
// -----------------------------------------------------------------------------
import React, { useState, useEffect } from 'react';
import EfeitoEletrico from './EfeitoEletrico';
import '../styles/ScrollToTop.css';

const ScrollToTop = () => {
  // Controls button visibility
  const [visible, setVisible] = useState(false);
  // State to trigger electric effect
  const [efeito, setEfeito] = useState(null);

  // Shows button when scroll passes 200px
  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to scroll to top and trigger electric effect
  const handleRetornoClick = (e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    // Coordinates relative to the button to position the effect
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setEfeito({ x, y });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setEfeito(null), 500);
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      className="btn-retorno"
      onClick={handleRetornoClick}
      style={{ position: 'fixed', bottom: 30, right: 30, zIndex: 1000 }}
      aria-label="Scroll to top"
    >
      <span style={{ position: 'relative', display: 'inline-block' }}>
        {/* Animated visual effect on click */}
        <EfeitoEletrico trigger={efeito} />
        <i className="fas fa-arrow-up"></i>
      </span>
    </button>
  );
};

export default ScrollToTop;