import React, { useState, useEffect } from 'react';
import EfeitoEletrico from './EfeitoEletrico';

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);
  const [efeito, setEfeito] = useState(null);

  // Mostra o botão quando o scroll passa de 200px
  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Função para rolar ao topo e disparar o efeito elétrico
  const handleRetornoClick = (e) => {
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  
  // Coordenadas relativas ao botão
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
      aria-label="Voltar ao topo"
    >
      <span style={{ position: 'relative', display: 'inline-block' }}>
        <EfeitoEletrico trigger={efeito} />
        <i className="fas fa-arrow-up"></i>
      </span>
    </button>
  );
};

export default ScrollToTop;