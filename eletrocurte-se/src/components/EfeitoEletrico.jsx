// -----------------------------------------------------------------------------
// EfeitoEletrico.jsx
// Componente visual para efeito elétrico animado na tela.
// Gera partículas animadas e toca som ao ser disparado por um trigger externo.
// Usado para feedback visual em ações como ScrollToTop.
// -----------------------------------------------------------------------------
import React, { useState, useEffect, useRef } from 'react';
import '../styles/EfeitoEletrico.css';

export default function EfeitoEletrico({ trigger }) {
  // Lista de partículas animadas na tela
  const [particulas, setParticulas] = useState([]);
  // Guarda o último trigger para evitar repetição
  const lastTrigger = useRef(null);

  useEffect(() => {
    // Só executa se o trigger mudou de fato
    if (
      trigger &&
      trigger.x !== undefined &&
      trigger.y !== undefined &&
      (lastTrigger.current?.x !== trigger.x || lastTrigger.current?.y !== trigger.y)
    ) {
      lastTrigger.current = trigger;

      // Toca o som do efeito elétrico
      const som = new Audio('/electric_zap_001-6374.mp3');
      som.volume = 0.3;
      som.play().catch(() => {});

      // Cria partículas animadas em posições aleatórias próximas ao trigger
      const novas = [];
      for (let i = 0; i < 6; i++) {
        const formatos = ['circulo', 'quadrado', 'faisca'];
        const classeForma = formatos[Math.floor(Math.random() * formatos.length)];
        const offsetX = Math.random() * 40 - 20;
        const offsetY = Math.random() * 40 - 20;
        novas.push({
          id: Math.random() + '-' + i,
          x: trigger.x + offsetX,
          y: trigger.y + offsetY,
          classe: classeForma,
        });
      }
      setParticulas(novas);

      // Remove partículas após 0.5s
      const timeout = setTimeout(() => setParticulas([]), 500);
      return () => clearTimeout(timeout);
    }
  }, [trigger]);

  return (
    <>
      {/* Renderiza partículas animadas na tela */}
      {particulas.map(p => (
        <div
          key={p.id}
          className={`efeito-eletrico ${p.classe}`}
          style={{ left: p.x, top: p.y }}
        />
      ))}
    </>
  );
}